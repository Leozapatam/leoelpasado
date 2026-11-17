# Leo el pasado · fábrica de videos

Videos verticales de divulgación histórica para **@leoelpasado** (Profe Leo). Cada episodio sale de **una grabación de voz** y **un archivo de datos**, y el código hace el resto: entrada animada, tablero de corcho con hilo rojo, mapas con bordes reales, documentos tecleados, narrador en pixel art que habla con la voz de Leo, subtítulos, música original y mezcla.

> Regla n.º 1: **ningún hilo sin fuente.**

## Requisitos
- Node.js 18+ (probado con 24)
- Python 3.10+ (`pip install -r requirements.txt`)
- ffmpeg en el PATH

## Instalación
```bash
npm install
pip install -r requirements.txt
```
Si la carpeta está en Google Drive u otra carpeta sincronizada, instala `node_modules` fuera y enlázalo (ver `PLANTILLA.md`, sección 7).

## Hacer un episodio
```bash
python scripts/editar_voz.py <slug> grabaciones/<audio>           # opcional: quitar tomas repetidas (cortes.json)
python scripts/preparar_voz.py <slug> <audio> --preset s24       # voz limpia + palabras.json + boca.json
python scripts/musica.py <slug>                                  # música original + mezcla
npm run estudio                                                  # revisar en Remotion Studio
npm run render -- <slug>                                         # out/<slug>.mp4
```
El episodio se describe en `public/episodios/<slug>/episodio.json` (escenas, fichas, hilos, mapas, documentos, tiempos en segundos de la voz).

## Documentación
- [PLANTILLA.md](PLANTILLA.md) · manual completo (identidad, escenarios, zona segura de TikTok/IG/FB, flujo)
- [CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md) · instrucciones para agentes de IA
- [guion.md](guion.md) · guion del episodio en curso

## Créditos y licencias
- Video: [Remotion](https://www.remotion.dev/) (gratis para personas y equipos pequeños; revisa su licencia si el proyecto crece).
- Bordes de mapas: Natural Earth (dominio público) vía `world-atlas`.
- Transcripción: faster-whisper (OpenAI Whisper).
- Tipografías: Playfair Display y Special Elite (Google Fonts, OFL).
- Personaje, texturas y música: generados para este proyecto.
