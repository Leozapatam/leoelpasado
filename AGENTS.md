# Instrucciones para agentes de código (Antigravity, Claude Code, Cursor, Codex…)

Las reglas completas están en **[CLAUDE.md](CLAUDE.md)** y valen para cualquier agente. Léelas antes de tocar nada.
Manual para humanos: [PLANTILLA.md](PLANTILLA.md) · Qué funciona y qué falta: [DIAGNOSTICO.md](DIAGNOSTICO.md) · Personajes: [personaje/PROMPTS.md](personaje/PROMPTS.md).

**En una línea:** esto es una fábrica de reels de divulgación histórica para @leoelpasado (Profe Leo). Un episodio nuevo **no se rediseña**: se sigue el orden guion → audio → storyboard en texto → aprobación de Leo → `episodio.json` → render.

---

## Puesta en marcha (en un clon nuevo)

```bash
npm install
pip install -r requirements.txt        # faster-whisper, numpy, scipy, Pillow
# ffmpeg en el PATH
# opcional, para la limpieza de voz con IA (Windows):
#   descargar deep-filter-0.5.6-x86_64-pc-windows-msvc.exe de github.com/Rikorose/DeepFilterNet/releases
#   y guardarlo como ~/leoelpasado-deps/deep-filter.exe   (sin él todo funciona, solo sin esa limpieza)
```

## Comprobar que todo funciona (sin audio)

```bash
python scripts/validar.py capitulo-0                       # revisa anclas, hilos, imágenes y personajes
node scripts/hoja.js capitulo-0 3,30,60,100,150 --guias    # 5 fotogramas en out/hoja-capitulo-0/
npm run estudio                                            # Remotion Studio para mirar el episodio
```
La hoja de contactos y el Studio **no necesitan audio**: si faltan `mezcla.wav` o `voz.wav`, el video se ve igual, solo que en silencio.

## Dónde están las grabaciones de voz (no van en el repositorio)
El repositorio es público, así que la voz de Leo **no se sube**. Las grabaciones están en el **Google Drive de Leo**:
- **Originales:** `Mi unidad/Leo el pasado/` → `Piloto.m4a` (grabación 1) y `PILOTO2.m4a` (tramo de Walter Benjamin).
- **Copia de trabajo:** `Mi unidad/Leo el pasado/plantilla/grabaciones/` → `piloto.m4a` y `piloto2.m4a` (los nombres que usa `cortes.json`).

Para trabajar desde otro equipo o modelo: pídele a Leo acceso a esa carpeta de Drive y copia los dos archivos a `grabaciones/` con esos nombres en minúscula. Las grabaciones nuevas siguen la misma regla: el original en `Mi unidad/Leo el pasado/` y la copia en `plantilla/grabaciones/`.

## Producir el audio y el video completos

Con las grabaciones en `grabaciones/`, ejecuta:

```bash
python scripts/editar_voz.py capitulo-0                          # tomas, limpieza IA, timbre, silencios (cortes.json)
python scripts/preparar_voz.py capitulo-0 grabaciones/capitulo-0-editada.wav --preset lark
python scripts/validar.py capitulo-0
python scripts/musica.py capitulo-0 && python scripts/efectos.py capitulo-0 && python scripts/mezclar.py capitulo-0
npm run render -- capitulo-0                                     # out/capitulo-0.mp4
```

## Estado actual (noviembre 2026)
- **Capítulo 0** («¿Qué es la historia?»): completo y calibrado. Tablero con Benjamin, Bloch, fotos de archivo reales, 16 poses de Profe Leo, voz con estilo «transmisión antigua» e interferencias.
- **Siguiente:** ideas en `DIAGNOSTICO.md` (escena podcast con las poses `mic-*`, mapas como sorpresa, storyboard estructurado).

## Reglas que no se negocian (resumen de CLAUDE.md)
- Responder a Leo **en español**.
- **Ningún hilo sin fuente:** citas reales con su fuente; imágenes con licencia verificada (`public/imagenes/CREDITOS.md`); personajes en pixel art marcados como ILUSTRACIÓN.
- **Zona segura** de TikTok/Instagram/Facebook (`SEGURA`, `NARRADOR`, `SUBTITULOS_IZQ` en `src/marca.ts`).
- No construir ni renderizar antes de que Leo apruebe guion, audio y storyboard.
- Subir cada avance a GitHub.
