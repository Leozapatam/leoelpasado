"""Paso 1a (opcional): edita la grabación cruda quitando tomas repetidas o tropiezos.

Uso: python scripts/editar_voz.py <slug> <grabacion>
Lee public/episodios/<slug>/cortes.json:
  { "conservar": [[0, 103.6], [156.4, 160.3], [166.3, 999]] }   (segundos de la grabación original)
Cada corte se ajusta al punto más silencioso cercano (±0,25 s) y se une con un fundido de 30 ms,
así no se oyen clics ni saltos. Escribe grabaciones/<slug>-editada.wav, que luego va a preparar_voz.py.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SR = 48000


def silencio_cercano(a, t, radio=0.25, ventana=0.02):
    """Momento más silencioso alrededor de t (para cortar entre palabras)."""
    i0, i1 = max(0, int((t - radio) * SR)), min(len(a), int((t + radio) * SR))
    w = int(ventana * SR)
    if i1 - i0 <= w:
        return int(t * SR)
    e = np.convolve(a[i0:i1] ** 2, np.ones(w) / w, mode="valid")
    return i0 + int(np.argmin(e)) + w // 2


def main():
    slug, entrada = sys.argv[1], sys.argv[2]
    cortes = json.load(open(os.path.join(RAIZ, "public", "episodios", slug, "cortes.json"), encoding="utf-8"))
    tmp = os.path.join(tempfile.gettempdir(), f"{slug}_crudo.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", entrada, "-ac", "1", "-ar", str(SR), tmp], check=True)
    with wave.open(tmp) as wf:
        a = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).astype(np.float32) / 32768

    fade = int(0.03 * SR)
    piezas = []
    for ini, fin in cortes["conservar"]:
        i = 0 if ini <= 0 else silencio_cercano(a, ini)
        j = len(a) if fin >= len(a) / SR else silencio_cercano(a, fin)
        p = a[i:j].copy()
        p[:fade] *= np.linspace(0, 1, fade)
        p[-fade:] *= np.linspace(1, 0, fade)
        piezas.append(p)
        print(f"conserva {i / SR:7.2f} → {j / SR:7.2f} s")
    out = np.concatenate(piezas)
    dest = os.path.join(RAIZ, "grabaciones", f"{slug}-editada.wav")
    with wave.open(dest, "w") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    print(f"editada: {len(a) / SR:.1f} s → {len(out) / SR:.1f} s  ({dest})")


if __name__ == "__main__":
    main()
