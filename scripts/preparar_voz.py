"""Paso 1 de cada episodio: limpia la voz y la transcribe palabra por palabra.

Uso:
  python scripts/preparar_voz.py <slug> <archivo_de_audio_o_video> [--preset s24|sala]

Crea en public/episodios/<slug>/:
  voz.wav        voz procesada (sonido de estudio)
  palabras.json  cada palabra con su inicio y fin, corregida con el "glosario" de episodio.json
  boca.json      apertura de boca del personaje en cada fotograma (0 cerrada, 1 media, 2 abierta)

Presets:
  s24   Samsung S24 Ultra (Grabadora de voz, calidad alta). El teléfono ya limpia el ruido: se trata suave.
  sala  webcam o micrófono del PC en una habitación con eco ("encocado"): corrección fuerte.
  lark  (recomendado) voz ya limpiada con IA por editar_voz.py: solo color de micrófono, eses y compresión.
"""
import argparse, json, os, re, subprocess, tempfile, wave
import numpy as np

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

PRESETS = {
    # graves limpios, menos "caja", presencia, aire, sin puerta de ruido
    # Ajustado con la grabación real del piloto (S24 Ultra, nov. 2026). El ruido de fondo es un zumbido grave
    # de la habitación (80-250 Hz), no siseo agudo; las eses son muy marcadas.
    # Resultado medido: ruido 34 dB bajo la voz (antes 25) y eses de -2 a -13 dB, sin sonar a ceceo.
    "s24": "highpass=f=90:poles=2,lowpass=f=15000,afftdn=nr=20:nf=-50:tn=1,"
           "equalizer=f=130:t=q:w=1:g=1,equalizer=f=320:t=q:w=1.2:g=-1.5,equalizer=f=3000:t=q:w=1:g=2,"
           "deesser=i=0.45:m=0.5:f=0.55,equalizer=f=7000:t=q:w=1.5:g=-2,"
           "acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200:makeup=2,"
           "agate=threshold=0.025:ratio=3:range=0.12:attack=8:release=350:knee=4,"
           "alimiter=limit=0.9,loudnorm=I=-16:TP=-1.5:LRA=7",
    # Después de la limpieza IA (DeepFilterNet, en editar_voz.py): el ruido ya no está, así que no hay
    # reducción de ruido ni puerta; solo el color "de micrófono de solapa" (estilo Lark), eses y compresión.
    "lark": "highpass=f=80:poles=2,lowpass=f=16000,"
            "equalizer=f=140:t=q:w=1:g=1.5,equalizer=f=330:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1:g=2,"
            "highshelf=f=9000:g=1.5,deesser=i=0.45:m=0.5:f=0.55,equalizer=f=7000:t=q:w=1.5:g=-1.5,"
            "acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200:makeup=2,"
            "alimiter=limit=0.9,loudnorm=I=-16:TP=-1.5:LRA=7",
    # habitación con eco: recorte fuerte de 250-600 Hz y expansor para la cola de la sala
    "sala": "highpass=f=75,afftdn=nf=-30:tn=1,"
            "equalizer=f=120:t=q:w=1:g=2.5,equalizer=f=280:t=q:w=1.2:g=-3,equalizer=f=480:t=q:w=1.4:g=-4.5,"
            "equalizer=f=3500:t=q:w=1:g=3,highshelf=f=9000:g=3,"
            "agate=threshold=0.015:ratio=2.5:attack=5:release=140:range=0.25,"
            "deesser=i=0.4,acompressor=threshold=-22dB:ratio=3.5:attack=8:release=120:makeup=4,"
            "alimiter=limit=0.9,loudnorm=I=-16:TP=-1.5:LRA=7",
}


def limpia(w):
    return re.sub(r"[¿?¡!.,:;«»\"()]", "", w).lower()


def aplicar_glosario(palabras, glosario):
    """Reemplaza secuencias que Whisper oyó mal ("Siena Gamagdalena." -> "Ciénaga, Magdalena.")."""
    for mal, bien in glosario.items():
        m, b = mal.split(), bien.split()
        i = 0
        while i <= len(palabras) - len(m):
            if [p["w"] for p in palabras[i:i + len(m)]] == m:
                s, e = palabras[i]["s"], palabras[i + len(m) - 1]["e"]
                paso = (e - s) / len(b)
                nuevas = [{"w": w, "s": round(s + k * paso, 2), "e": round(s + (k + 1) * paso, 2)} for k, w in enumerate(b)]
                palabras[i:i + len(m)] = nuevas
                i += len(b)
            else:
                i += 1
    return palabras


def boca(voz16k, destino, fps=30):
    """Lipsync tipo "PNGtuber": el volumen de la voz en cada fotograma decide la boca."""
    with wave.open(voz16k) as wf:
        a = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768
    paso = 16000 // fps
    rms = np.array([np.sqrt(np.mean(a[i:i + paso] ** 2)) for i in range(0, len(a) - paso, paso)])
    db = 20 * np.log10(rms + 1e-6)
    piso = np.percentile(db[db > -60], 90) - 22 if (db > -60).any() else -40  # por debajo: silencio
    # sílabas: se compara cada fotograma con el máximo local (~0,2 s)
    from scipy.ndimage import maximum_filter1d
    pico = maximum_filter1d(rms, size=7)
    rel = rms / (pico + 1e-9)
    estados = np.where(db < piso, 0, np.where(rel > 0.8, 2, np.where(rel > 0.45, 1, 0)))
    # aleteo natural: nunca más de 3 fotogramas seguidos con la boca abierta
    racha = 0
    for i in range(len(estados)):
        racha = racha + 1 if estados[i] == 2 else 0
        if racha > 3:
            estados[i] = 1
            racha = 0
    for i in range(1, len(estados) - 1):
        if estados[i] == 0 and estados[i - 1] > 0 and estados[i + 1] > 0 and db[i] > piso:
            estados[i] = 1
    json.dump(estados.tolist(), open(os.path.join(destino, "boca.json"), "w"))
    print("boca.json ->", len(estados), "fotogramas")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("entrada")
    ap.add_argument("--preset", default="s24", choices=PRESETS)
    ap.add_argument("--modelo", default="small", help="tiny/base/small/medium: más grande = más preciso y más lento")
    ap.add_argument("--solo-boca", action="store_true", help="solo recalcula boca.json a partir de voz.wav")
    ap.add_argument("--solo-glosario", action="store_true", help="solo reaplica el glosario a palabras.json (sin volver a transcribir)")
    a = ap.parse_args()

    dest = os.path.join(RAIZ, "public", "episodios", a.slug)
    os.makedirs(dest, exist_ok=True)
    ep_path = os.path.join(dest, "episodio.json")
    ep = json.load(open(ep_path, encoding="utf-8")) if os.path.exists(ep_path) else {}

    voz = os.path.join(dest, "voz.wav")
    if a.solo_glosario:
        pp = os.path.join(dest, "palabras.json")
        palabras = aplicar_glosario(json.load(open(pp, encoding="utf-8")), ep.get("glosario", {}))
        json.dump(palabras, open(pp, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
        return print(" ".join(p["w"] for p in palabras))
    if a.solo_boca:
        tmp = os.path.join(tempfile.gettempdir(), f"{a.slug}_16k.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-ac", "1", "-ar", "16000", tmp], check=True)
        return boca(tmp, dest)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.entrada, "-vn", "-af", PRESETS[a.preset], "-ar", "48000", "-ac", "2", voz], check=True)
    print("voz procesada ->", voz)

    # transcripción (16 kHz mono)
    tmp = os.path.join(tempfile.gettempdir(), f"{a.slug}_16k.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-ac", "1", "-ar", "16000", tmp], check=True)
    boca(tmp, dest)
    with wave.open(tmp) as wf:
        audio = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768

    from faster_whisper import WhisperModel
    # pista con puntuación: si va sin puntos, Whisper también transcribe sin puntos (y los subtítulos los necesitan)
    nombres = list(ep.get("glosario", {}).values()) + ep.get("subtitulos", {}).get("resaltar", [])
    pista = ("Hola, ¿qué tal? En este video hablamos de " + ", ".join(nombres) + ".") if nombres else None
    modelo = WhisperModel(a.modelo, device="cpu", compute_type="int8")
    segs, _ = modelo.transcribe(audio, language="es", word_timestamps=True, vad_filter=True, initial_prompt=pista)
    palabras = [{"w": w.word.strip(), "s": round(w.start, 2), "e": round(w.end, 2)} for s in segs for w in s.words]
    palabras = aplicar_glosario(palabras, ep.get("glosario", {}))

    json.dump(palabras, open(os.path.join(dest, "palabras.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    dur = len(audio) / 16000
    print(f"palabras.json -> {len(palabras)} palabras, voz de {dur:.1f} s\n")
    print(" ".join(f"{p['w']}[{p['s']}]" for p in palabras))


if __name__ == "__main__":
    main()
