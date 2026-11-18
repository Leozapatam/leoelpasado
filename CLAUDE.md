# @leoelpasado · fábrica de videos (léeme primero)

## Intención (no negociable)
Esta carpeta es una **plantilla reutilizable**. Todo lo que se construyó (identidad, escenarios, narrador, subtítulos, voz, música, mezcla) existe para que **cada episodio nuevo cueste pocos tokens**: no se rediseña, se rellenan datos.

## Orden de trabajo (para no gastar tokens en vano)
1. **Guion** en `guion.md` → Leo lo aprueba.
2. **Storyboard en texto** (escena por escena: qué se ve, qué fotos, qué fichas, qué hilos conectan qué, cuándo va mapa o documento) → Leo lo aprueba. El tablero sale del guion, no al revés.
3. Solo entonces se construye `episodio.json` y se renderiza.
No renderices ni construyas escenas antes de que guion y storyboard estén aprobados.

## Protocolo de audio (aprobado por Leo; no cambiarlo por episodio)
1. **Grabación**: S24 Ultra, Grabadora de voz en calidad alta, a 15–20 cm de la boca. Si Leo repite una frase, **la última toma es la buena**.
2. **Edición** (`editar_voz.py` + `cortes.json`):
   - Transcribir y elegir tomas. Para quitar una sola palabra: `"exacto": true`, cortando por energía (Whisper falla por décimas en palabras cortas; transcribir fragmentos sueltos para confirmar).
   - Limpieza IA de cada grabación con **DeepFilterNet** (`-D -a 35`) antes de todo lo demás.
   - Grabaciones de sesiones distintas: **timbre igualado por octavas** (a menos de 1 dB) y **fundido cruzado de 120 ms** en la costura.
   - **Silencios** de más de 0,8 s se acortan a 0,5 s (medidos contra el piso de ruido real).
3. **Voz** (`preparar_voz.py --preset lark`): color de micrófono de solapa, compresión suave, **desesado adaptativo** (solo donde la «s» sobresale), −16 LUFS. Glosario para nombres propios.
4. **Música, efectos y mezcla** (`musica.py`, `efectos.py`, `mezclar.py`): todo lo que pasa en pantalla suena; ambientes por escena; voz integrada en la misma sala; −14 LUFS.
5. **Metas medidas** (`medir_voz.py`): voz limpia con ruido ≥ 50 dB bajo la voz y eses pico ≤ −15 dB. Después, en la mezcla, el **estilo de transmisión antigua** (`voz.estilo`) añade a propósito un fondo audible de unos 20 dB: es estética, no defecto. Ese es el sonido de la marca.
6. **Entregar el audio completo y esperar la aprobación de Leo** antes de construir o renderizar el video.

## Estilo del guion
Humano, casual, de conversación. Que lo entienda un niño, un anciano y un académico. **Sin dos puntos y sin guiones** en el texto que se lee. Frases cortas. Las citas, en versión hablada; el original va en pantalla y en la descripción.

## Pasos técnicos de cada episodio
Para un episodio nuevo, **no reescribas componentes ni explores el código**. Haz solo esto:
0. Si Leo grabó tomas repetidas: transcribe, elige la toma final, anota los tramos en `public/episodios/<slug>/cortes.json` y ejecuta `python scripts/editar_voz.py <slug> <grabación>`. El guion final se escribe a partir de lo que Leo dijo (su voz manda). Para medir siseo y eses antes y después: `python scripts/medir_voz.py <archivos>`. Correcciones de Whisper: agrégalas al `glosario` y usa `--solo-glosario`.
1. `python scripts/preparar_voz.py <slug> <audio> --preset s24` (o `sala`) → voz.wav, palabras.json, boca.json
2. Copia `public/episodios/bananeras/episodio.json` → `public/episodios/<slug>/episodio.json` y cambia textos y tiempos (segundos de la voz, tomados de la salida del paso 1)
3. `python scripts/musica.py <slug>`, `python scripts/efectos.py <slug>` y `python scripts/mezclar.py <slug>` → música, efectos automáticos y mezcla (método fijo: no se eligen efectos a mano salvo pedidos del relato)
4. Revisa 3–5 fotogramas con `--props='{"slug":"<slug>","guias":true}'` y luego `npm run render -- <slug>`

Cambia la plantilla (src/, scripts/) **solo si Leo pide algo nuevo**. Si lo haces, actualiza `PLANTILLA.md`.

## Reglas que Leo ya decidió
- Estilo noir de archivo: tinta, papel, **rojo hilo como único acento** (src/marca.ts). Regla n.º 1: **ningún hilo sin fuente**.
- El narrador es **Profe Leo en pixel art, cuerpo entero, expresión seria**. **No mueve la boca: cambia de pose** (`narrador.poses` en episodio.json: normal, habla, senala, piensa, lupa, documento, libro, brazos, sorpresa, saluda…). Todos los personajes **respiran un píxel** (el torso sube un píxel y vuelve). Los sprites `leo-<pose>.png` se generan con `personaje/PROMPTS.md`; mientras no existan se usan los actuales.
- **Figuras históricas** en pixel art (mismo estilo, fondo blanco) con `scripts/sprite.py` y la lista `personajes` del episodio. Llevan placa con su nombre y la marca ILUSTRACIÓN.
- **Tiempos anclados a palabras** (`"@Bloch"`, `"@Decía#2"`). Antes de renderizar: `python scripts/validar.py <slug>` (avisa si una palabra se repite y falta el #n).
- Todo video empieza con la **entrada** (`intro`, 3 s: Profe Leo señala el marco y la cámara entra a la primera escena) y termina con el **eslogan** «Profe Leo» y debajo «@leoelpasado», nada más.
- Episodio en curso: `capitulo-0` (presentación del canal). Al recibir la voz: preparar_voz.py → reajustar tiempos del episodio.json a palabras.json → musica.py → render.
- **Zona segura** TikTok/IG/FB (SEGURA en marca.ts): nada importante en los 250 px de arriba, los 480 de abajo ni los 160 de la derecha. Los subtítulos van como diálogo **a la altura de la cabeza del narrador** (SEGURA.abajo + 260), **nunca abajo del todo**: ahí se confunden con la descripción del post. El narrador se queda abajo a la izquierda.
- **Responde siempre a Leo en español.**
- Rigor: cada cifra coincide con su fuente; los documentos recreados llevan «RECREACIÓN · PARÁFRASIS»; no se inventan citas.
- Leo graba con un Samsung S24 Ultra. La voz se limpia con **IA (DeepFilterNet, `~/leoelpasado-deps/deep-filter.exe`)** dentro de `editar_voz.py` y luego va el preset **`lark`**. Si el programa no está, usa el preset `s24`.
- La música y los efectos son originales y sintetizados (scripts/musica.py, scripts/sonidos.py), sin derechos de terceros. **Todo lo que pasa en pantalla suena**, tenue, y cada escena tiene su ambiente. La voz va integrada en la mezcla, no pegada encima.
- **El método no se cambia por episodio:** cambian los mapas, las fichas y las conexiones; las reglas (identidad, escenarios, sonido, flujo) permanecen.

Manual completo: `PLANTILLA.md`.

## Notas técnicas
- **Grabaciones de voz:** no van en el repositorio (es público). Originales en el Google Drive de Leo, `Mi unidad/Leo el pasado/` (`Piloto.m4a`, `PILOTO2.m4a`); copia de trabajo en `plantilla/grabaciones/` (`piloto.m4a`, `piloto2.m4a`). Ver AGENTS.md.
- La carpeta vive en Google Drive (`G:\Mi unidad\Leo el pasado`). **`node_modules` no se guarda en Drive** (son ~600 MB y miles de archivos): viven en `%USERPROFILE%\leoelpasado-deps\node_modules` (Drive no admite enlaces). Renderiza con `node scripts/render.js <slug>` y revisa con `node scripts/hoja.js <slug> <segundos> --guias`; ambos usan esa carpeta solos (ver PLANTILLA.md, «Instalación»).
- Ruta larga de Windows: si Remotion falla con `ENOENT chrome-headless-shell`, mapea la carpeta a una unidad corta (`subst R: "<carpeta>"`) y trabaja desde `R:\`.
- Python: `faster-whisper` necesita audio como arreglo numpy (ya resuelto en preparar_voz.py).
