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
python scripts/editar_voz.py <slug>                              # tomas, limpieza IA, timbre y silencios (cortes.json)
python scripts/preparar_voz.py <slug> grabaciones/<slug>-editada.wav --preset lark   # voz + palabras.json
python scripts/validar.py <slug>                                 # revisa el episodio antes de renderizar
python scripts/musica.py <slug> && python scripts/efectos.py <slug> && python scripts/mezclar.py <slug>
node scripts/hoja.js <slug> 3,30,60 --guias                      # hoja de contactos rápida
npm run render -- <slug>                                         # out/<slug>.mp4
```
**Para agentes de IA (Antigravity, Claude, Cursor…): empieza por [AGENTS.md](AGENTS.md).**
**Grabaciones de voz:** no están en el repositorio; están en el Google Drive de Leo, `Mi unidad/Leo el pasado/` (ver AGENTS.md).
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
