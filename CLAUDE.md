# @leoelpasado · fábrica de videos (léeme primero)

## Intención (no negociable)
Esta carpeta es una **plantilla reutilizable**. Todo lo que se construyó (identidad, escenarios, narrador, subtítulos, voz, música, mezcla) existe para que **cada episodio nuevo cueste pocos tokens**: no se rediseña, se rellenan datos.

## Orden de trabajo (para no gastar tokens en vano)
1. **Guion** en `guion.md` → Leo lo aprueba.
2. **Storyboard en texto** (escena por escena: qué se ve, qué fotos, qué fichas, qué hilos conectan qué, cuándo va mapa o documento) → Leo lo aprueba. El tablero sale del guion, no al revés.
3. Solo entonces se construye `episodio.json` y se renderiza.
No renderices ni construyas escenas antes de que guion y storyboard estén aprobados.

## Estilo del guion
Humano, casual, de conversación. Que lo entienda un niño, un anciano y un académico. **Sin dos puntos y sin guiones** en el texto que se lee. Frases cortas. Las citas, en versión hablada; el original va en pantalla y en la descripción.

## Pasos técnicos de cada episodio
Para un episodio nuevo, **no reescribas componentes ni explores el código**. Haz solo esto:
0. Si Leo grabó tomas repetidas: transcribe, elige la toma final, anota los tramos en `public/episodios/<slug>/cortes.json` y ejecuta `python scripts/editar_voz.py <slug> <grabación>`. El guion final se escribe a partir de lo que Leo dijo (su voz manda). Para medir siseo y eses antes y después: `python scripts/medir_voz.py <archivos>`. Correcciones de Whisper: agrégalas al `glosario` y usa `--solo-glosario`.
1. `python scripts/preparar_voz.py <slug> <audio> --preset s24` (o `sala`) → voz.wav, palabras.json, boca.json
2. Copia `public/episodios/bananeras/episodio.json` → `public/episodios/<slug>/episodio.json` y cambia textos y tiempos (segundos de la voz, tomados de la salida del paso 1)
3. `python scripts/musica.py <slug>` → musica.wav, mezcla.wav
4. Revisa 3–5 fotogramas con `--props='{"slug":"<slug>","guias":true}'` y luego `npm run render -- <slug>`

Cambia la plantilla (src/, scripts/) **solo si Leo pide algo nuevo**. Si lo haces, actualiza `PLANTILLA.md`.

## Reglas que Leo ya decidió
- Estilo noir de archivo: tinta, papel, **rojo hilo como único acento** (src/marca.ts). Regla n.º 1: **ningún hilo sin fuente**.
- El narrador es **Profe Leo en pixel art, cuerpo entero, expresión seria** (public/personaje/), animado con la voz de Leo. Se mueve como una sola pieza (nunca separar cabeza y cuerpo). Movimiento sutil; se irá sofisticando poco a poco.
- Todo video empieza con la **entrada** (`intro`, 3 s: Profe Leo señala el marco y la cámara entra a la primera escena) y termina con el **eslogan** «Profe Leo» y debajo «@leoelpasado», nada más.
- Episodio en curso: `capitulo-0` (presentación del canal). Al recibir la voz: preparar_voz.py → reajustar tiempos del episodio.json a palabras.json → musica.py → render.
- **Zona segura** TikTok/IG/FB (SEGURA en marca.ts): nada importante en los 250 px de arriba, los 480 de abajo ni los 160 de la derecha. Los subtítulos van como diálogo **a la altura de la cabeza del narrador** (SEGURA.abajo + 260), **nunca abajo del todo**: ahí se confunden con la descripción del post. El narrador se queda abajo a la izquierda.
- **Responde siempre a Leo en español.**
- Rigor: cada cifra coincide con su fuente; los documentos recreados llevan «RECREACIÓN · PARÁFRASIS»; no se inventan citas.
- Leo graba con un Samsung S24 Ultra (preset `s24`).
- La música es original (scripts/musica.py), sin derechos de autor.

Manual completo: `PLANTILLA.md`.

## Notas técnicas
- La carpeta vive en Google Drive (`G:\Mi unidad\Leo el pasado`). **`node_modules` no se guarda en Drive** (son ~600 MB y miles de archivos): viven en `%USERPROFILE%\leoelpasado-deps\node_modules` (Drive no admite enlaces). Renderiza con `node scripts/render.js <slug>` y revisa con `node scripts/hoja.js <slug> <segundos> --guias`; ambos usan esa carpeta solos (ver PLANTILLA.md, «Instalación»).
- Ruta larga de Windows: si Remotion falla con `ENOENT chrome-headless-shell`, mapea la carpeta a una unidad corta (`subst R: "<carpeta>"`) y trabaja desde `R:\`.
- Python: `faster-whisper` necesita audio como arreglo numpy (ya resuelto en preparar_voz.py).
