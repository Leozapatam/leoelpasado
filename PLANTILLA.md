# Plantilla de video · @leoelpasado

> **Intención:** todo lo de esta carpeta es plantilla. Un episodio nuevo **no se rediseña**: se graba, se rellenan datos en `episodio.json` y se renderiza. Así cada edición futura cuesta poco tiempo y pocos tokens (instrucciones para Claude en `CLAUDE.md`).

> **Yo leo el pasado.** Regla n.º 1: **ningún hilo sin fuente.**

Esta carpeta es la fábrica de reels de @leoelpasado. Cada episodio sale de **una grabación de voz** y de **un archivo de datos** (`episodio.json`). El diseño, los escenarios, los subtítulos, la música y la mezcla ya están resueltos en la plantilla.

---

## 1. Identidad (no se cambia por episodio)

| Elemento | Valor | Uso |
|---|---|---|
| Tinta | `#0d0b09` | fondo general |
| Papel | `#e8dcc2` | fichas, etiquetas, documentos |
| Hueso | `#f4ead5` | texto claro sobre oscuro |
| **Rojo hilo** | `#c1121f` | **único acento**: hilo, subrayados, sellos, pines, cifras |
| Gris archivo | `#6b5a45` | pies de fuente |
| Títulos y cifras | **Playfair Display** 900 | gancho, cifras, subtítulos |
| Fichas, sellos y fuentes | **Special Elite** (máquina de escribir) | todo lo "de archivo" |

Todo está en `src/marca.ts`. Si cambias un color ahí, cambia en todos los videos.

**Reglas visuales**
- El rojo solo marca **lo que importa**: una conexión, una cifra, la palabra que estás diciendo.
- Toda ficha lleva **pie de fuente** (`FUENTE: …`). Una ficha sin fuente no entra al tablero.
- Un documento recreado lleva siempre el sello **RECREACIÓN · PARÁFRASIS**. Nunca se presenta un texto inventado como si fuera el original.
- Formato: vertical 1080×1920, 30 fps.

### Zona segura (lo que tapa la interfaz de Instagram, TikTok y Facebook)
| Zona | Tapada por | Regla |
|---|---|---|
| 250 px superiores | nombre, "Seguir", pestañas (FB/IG) | nada importante arriba |
| **480 px inferiores** | usuario, descripción, música (TikTok es el más alto) | **ni subtítulos, ni cifras, ni narrador** |
| 160 px a la derecha (de y=700 hacia abajo) | botones de like, comentar, compartir (FB) | nada importante a la derecha |
| 60 px a la izquierda | margen | — |

Es la combinación **más estricta** de TikTok, Instagram Reels y Facebook Reels para contenido orgánico (en anuncios pagados Meta pide más: 35 % abajo). Los valores están en `SEGURA` (src/marca.ts) y todo el diseño los usa.

Para revisar un fotograma con las zonas pintadas en azul:
`npx remotion still src/index.ts Episodio out/revision.png --frame=300 --props='{"slug":"<slug>","guias":true}'`

---

## 2. Escenarios

| Escenario | Para qué | Datos en `episodio.json` |
|---|---|---|
| **Tablero** (corcho, fichas, hilo rojo, lupa) | comparar fuentes, conectar pistas, la "investigación" | `tablero.fichas`, `tablero.hilos`, `tablero.camara` |
| **Mapa** (mapamundi noir, bordes reales) | dónde pasó, rutas, zonas, el zoom del mundo al lugar | `escenas[].mapa`: `camara`, `paises`, `etiquetas`, `pines`, `zonas`, `rutas` |
| **Documento** (escritorio, lámpara, texto que se teclea) | leer una fuente: carta, despacho, acta, artículo | `escenas[].documento`: `lineas`, `resaltar`, `firma`, `aviso`, `fuente` |
| **Entrada** (≈3 s, antes de la voz) | Profe Leo señala un marco en la pared con el láser y la cámara entra hasta que el marco **es** la primera escena (tablero o mapa) | `intro.duracion` (3) |
| **Cierre** | Profe Leo de cuerpo entero + eslogan | `cierre.titulo` («Profe Leo»), `cierre.subtitulo` («LEO EL PASADO») |

Encima de todo van el **gancho** (pregunta tecleada al inicio), los **sellos** de tinta, el **narrador**, los **subtítulos** y el grano de película.

### El narrador: Profe Leo en pixel art
- **Cuerpo entero** (40×63 píxeles: camiseta negra, jean, botas), con expresión seria (cejas rectas). Dos poses: `normal` y `senala` (brazo extendido con el láser, usada en la entrada).
- Abajo a la izquierda, justo encima de la zona que tapa la app, durante todo el video. En el cierre aparece grande, en el centro.
- **Habla con tu voz**: la boca se abre según cada sílaba (cerrada, media o abierta), los ojos parpadean y todo el cuerpo se mueve **como una sola pieza** (respira, se balancea apenas y da un pequeño impulso en las sílabas fuertes). La cabeza no se separa del cuerpo: el cuello despegado se veía mal.
- Los sprites están en `public/personaje/` y se amplían sin suavizar. `python scripts/personaje.py personaje/originales/5.webp` los regenera todos: recorta el busto de la imagen 5, limpia los bordes, dibuja píxel a píxel el cuerpo (torso, manos, cinturón, jean, botas), la pose que señala y las cejas, y genera las capas de boca y ojos. Para retocar el personaje se editan las coordenadas de ese script; `personaje/vista.png` muestra la rejilla con números.

### Piezas del tablero (`tablero.fichas[].tipo`)
| tipo | qué es | campos propios |
|---|---|---|
| `ficha` (por defecto) | ficha de archivo con cifra y pie de FUENTE | `encabezado`, `cifra`, `texto`, `fuente`, `lupa` |
| `mini` | fichita en blanco que luego muestra un «?» rojo | `revela` |
| `polaroid` | foto con pie; sin imagen muestra una silueta | `imagen` (ruta en public/), `texto`, `fuente` |
| `objeto` | utilería dibujada: `carta`, `foto`, `expediente`, `papel`, con etiqueta y FUENTE | `objeto`, `texto`, `fuente`, `ilustracion` |
| `etiqueta` | tira de papel con una palabra | `texto`, `ancho` |

- `ilustracion: true` pone la marca **ILUSTRACIÓN**. Úsala siempre que la pieza no sea un documento real.
- `hilos`: `["a", "b"]` se tiende cuando entra `b`; `["a", "b", 81.2]` se tiende en ese segundo.
- `tablero.brillo`: segundo en que todas las fuentes se iluminan en rojo.

### Subtítulos (estilo hilo rojo)
- Salen como **diálogo al lado del narrador**, por encima de la zona que tapa la app (no abajo del todo).
- Cada palabra aparece **cuando la dices**, no antes.
- La palabra activa se subraya con el **hilo rojo**.
- Las **cifras** y las palabras de `subtitulos.resaltar` salen como **etiqueta de papel de archivo** (las cifras en rojo).

### Mapas: ¿Remotion o Kaz?
- **Por defecto: el escenario Mapa de esta plantilla.** Usa tus fuentes y colores, con bordes reales de Natural Earth: 1:50m de lejos y 1:10m de cerca.
- **Kaz Map Animation, cuando haga falta más**: provincias o estados (EE. UU., Canadá, Brasil, China, India, Rusia…), husos horarios, cortes geológicos u organigramas tipo blueprint. Se renderiza aparte con la paleta noir (ejemplo: `public/episodios/bananeras/mapa-kaz-ejemplo.json`). El MP4 resultante se coloca en la carpeta del episodio y se inserta como escena de video. Limitación: Kaz usa su propia tipografía (Poppins) en las etiquetas.

---

## 3. Flujo de trabajo de cada episodio

### Paso 0: guion
El guion del episodio en curso va en `guion.md` (la grabadora lo muestra como teleprompter). Estructura de siempre:
1. **Gancho:** una pregunta en ≤ 10 palabras.
2. **Expediente:** fecha, lugar y hecho.
3. **Pistas:** 2–4 fuentes, cada una con su cifra o afirmación.
4. **Giro:** lo que nadie mira (de dónde viene lo que todos repiten).
5. **Cierre:** «Los saluda el Profe Leo. Esto es Leo el pasado.»

Lee en voz alta cada cifra y comprueba que diga **lo mismo que la fuente** (ojo con «menos de» y «al menos»).

### Paso 1: grabar la voz con el Samsung S24 Ultra
- App **Grabadora de voz** → Ajustes → **Calidad de grabación: Alta**. Modo **Estándar**.
- Teléfono a **15–20 cm** de la boca, un poco de lado (no de frente, así no entran los golpes de aire).
- Habitación con cortinas, cama o ropa colgada. Evita cocina y baño.
- **Modo avión** activado. Graba **3 segundos de silencio** al principio.
- Si te equivocas, haz una pausa y repite la frase entera. Se corrige en la edición.
- Pasa el archivo (`.m4a`) a la carpeta `grabaciones/`.

Alternativa: `npm run grabadora`, luego abrir `http://localhost:4567` **en Chrome**, con teleprompter incluido. Las tomas se guardan solas en `grabaciones/`.

### Paso 2: preparar la voz
```bash
python scripts/preparar_voz.py <slug> grabaciones/<archivo> --preset s24
```
- Procesa la voz con sonido de estudio: limpieza, menos "caja", presencia, de-esser, compresión y -16 LUFS.
- Presets: `s24` para el celular, `sala` para la webcam o un cuarto con eco.
- Transcribe palabra por palabra → `palabras.json`.
- Calcula la boca del narrador para cada fotograma → `boca.json`.
- Si Whisper oye mal un nombre, agrégalo a `glosario` en `episodio.json` («lo que oyó» → «lo correcto») y repite el paso.

### Regrabar una parte
1. Leo graba solo el tramo nuevo (por ejemplo `grabaciones/cap0-definicion.m4a`).
2. En `cortes.json` se usa `"piezas"` para unir la grabación original y el tramo nuevo (ver `scripts/editar_voz.py`). El volumen de cada pieza se iguala solo.
3. Se repiten `preparar_voz.py`, `musica.py` y el render. Si los tiempos de `episodio.json` están **anclados a palabras** (`"@Bloch"`), no hay que recalcular nada a mano.

### Paso 3: escribir `episodio.json`
Los tiempos pueden ser segundos (`23.7`) o **anclas a palabras** (recomendado): `"@Bloch"` (primera vez que se dice), `"@ogro#2"` (segunda vez), `"@ogro+0.4"` (con desfase), `"@ogro:fin"` (cuando termina la palabra). Ver `src/anclas.ts`.
Copia `public/episodios/bananeras/episodio.json` como plantilla. Los tiempos son **segundos de la voz**: tómalos de la lista que imprime el paso 2. La regla es que cada cosa aparece **en la palabra que la nombra**.

### Paso 4: música y mezcla
```bash
python scripts/musica.py <slug>
```
Compone música noir original (sin derechos de autor) con golpes en los momentos de `musica.golpes`. La música baja sola cuando hablas, y la mezcla final queda a -14 LUFS.

### Paso 5: revisar y renderizar
Hoja de contactos (varios momentos en una sola pasada, con las zonas de la app en azul):
```bash
node scripts/hoja.js <slug> 3,25,58,97,160 --guias
```
```bash
npm run estudio
npm run render -- <slug>
```
- `estudio` abre Remotion Studio para ver el episodio y ajustar tiempos en vivo.
- `render` genera `out/<slug>.mp4`.

---

## 4. Mapa de archivos

```
PLANTILLA.md                 este manual
src/marca.ts                 colores, fuentes, tiempos
src/tipos.ts                 formato de episodio.json
src/Episodio.tsx             arma el video: escenas + gancho + sellos + subtítulos + audio
src/escenas/                 Tablero, Mapa, Documento
src/componentes/             Narrador, Subtitulos, Sello, Chincheta, Grano, Foco, Lupa
scripts/personaje.py         convierte la imagen del personaje en sprite + capas de boca y ojos
personaje/originales/        tus imágenes pixel art (fuente del sprite)
public/personaje/            base.png, boca1.png, boca2.png, ojos.png
scripts/preparar_voz.py      paso 2: voz pro + transcripción
scripts/musica.py            paso 4: música noir + mezcla
scripts/texturas.py          regenera corcho, papel y madera (public/texturas)
grabadora/                   grabadora web con teleprompter
public/episodios/<slug>/     episodio.json, palabras.json, boca.json, voz.wav, musica.wav, mezcla.wav
```

## 5. Antes de publicar (lista de rigor)
- [ ] Cada cifra dicha coincide con su ficha y con su fuente.
- [ ] Cada ficha tiene `FUENTE:` con autor, documento y año.
- [ ] Los documentos recreados llevan **RECREACIÓN · PARÁFRASIS**, y el texto original se verificó.
- [ ] En la descripción del post van las fuentes completas y una lectura recomendada.
- [ ] Si usaste imágenes generadas con IA, lo declaras (exigencia de las plataformas).

## 6. Episodios
| slug | estado |
|---|---|
| `capitulo-0` | **Piloto oficial**: presentación del canal (¿qué es la historia? Marc Bloch). Guion en `guion.md`. Tiempos **provisionales**: falta grabar la voz y ajustar `episodio.json` a `palabras.json`. |
| `bananeras` | Primer demo (Masacre de las Bananeras). Sirve de ejemplo de mapa + documento + tablero. Pendiente: regrabar «al menos 50» → «menos de 50». |

## 7. Instalación (en un PC nuevo o tras mover la carpeta)
**En un clon normal de GitHub:** `npm install` dentro del proyecto y listo.

**En Google Drive:** las dependencias (`node_modules`, unos 600 MB) **no deben sincronizarse**, y Drive no admite enlaces. Se instalan en el disco local:
```powershell
mkdir $env:USERPROFILE\leoelpasado-deps
copy package.json, package-lock.json $env:USERPROFILE\leoelpasado-deps\
cd $env:USERPROFILE\leoelpasado-deps; npm ci
```
`remotion.config.ts`, `scripts/render.js` y `scripts/hoja.js` encuentran solos esa carpeta. También hacen falta Python con `faster-whisper`, `scipy` y `Pillow`, y ffmpeg.
