# Profe Leo v2 · prompts para ChatGPT o Gemini

Objetivo: que el pixel art **se parezca a Leo** sin cambiar el estilo de la casa, y tener muchas poses y utilería para escenas de mapa. Los prompts van en inglés porque los modelos de imagen responden mejor así; las instrucciones, en español.

Sirve con ChatGPT (generación de imágenes) o con Gemini (generación y edición de imágenes). Las reglas de uso son las mismas en los dos.

---

## Reglas para que el personaje no cambie

1. **Primero la ficha de identidad (paso 1), después las hojas de poses.** Si se piden poses antes de fijar la cara, cada hoja sale con una persona distinta.
2. En **cada** pedido se adjuntan dos cosas: la ficha de identidad aprobada y el sprite actual (`personaje/originales/leo-base-microfono.png`) como referencia de estilo.
3. Un pedido por mensaje. Si una pose sale distinta, se pide de nuevo **solo esa pose** con el prompt individual (sección 5).
4. Fondo blanco puro, sin texto, sin sombra en el piso. Así `scripts/sprite.py` las recorta solo.
5. Cuadrícula de **4 columnas por 2 filas**, las 8 poses del mismo tamaño. Imagen grande y horizontal (por ejemplo 2048 × 1024).
6. Al recortar (modelo aparte en `public/personaje/v2/`): `python scripts/sprite.py <hoja.png> v2/nombre1,…,v2/nombre8 --hoja`.

---

## Paso 1 · Ficha de identidad (con fotos)

Adjunta de 2 a 4 fotos tuyas: una de frente con buena luz, una de tres cuartos y una de cuerpo entero con la ropa que quieres que use el personaje. Adjunta también el sprite actual como referencia de estilo.

Antes de pegar el prompt, llena los corchetes con lo que se ve en las fotos (por ejemplo, si usas gafas o no).

```
I am attaching photos of a real person and one pixel-art sprite.
Create a pixel-art CHARACTER REFERENCE SHEET of the person in the photos, drawn in EXACTLY the art style of the attached sprite:
chibi proportions (big head, small body), thick dark outline, two-tone soft shading, clean visible pixel grid, limited palette.
The character must be clearly recognizable as the person in the photos: keep his hairline, hair volume and curl pattern,
facial-hair shape, eyebrow shape, nose and face shape (simplified to pixel art), skin tone and body build.
Details to keep: [glasses: yes/no, shape], [hair: length and color], [beard/mustache: shape], [skin tone].
Clothes: [black crew-neck t-shirt, dark navy jeans, dark brown boots — or describe the clothes from the photos].
Expression: calm, serious and kind.
Layout: 4 views of the SAME character side by side, same height and scale, evenly spaced, not touching:
1) front view, 2) three-quarter view facing right, 3) side view facing right, 4) back view.
Plain pure white background. No text, no labels, no numbers, no floor shadow, nothing else.
```

Revisión antes de seguir: ¿te reconoces? ¿El tamaño del píxel y el contorno son iguales a los del sprite actual? Si no, pide ajustes concretos en el mismo chat ("hair longer", "beard shorter", "same pixel size as the sprite"). Cuando esté bien, guárdala como `personaje/originales/leo-v2-ficha.png`. Esa es la nueva referencia oficial.

---

## Paso 2 · Encabezado común de las hojas

Pega este bloque y debajo la lista de poses de la hoja que quieras.

```
Pixel art character sprite sheet on a plain pure white background: the SAME character 8 times,
in a clean grid of 4 columns and 2 rows, every pose the same height and scale, evenly spaced, not touching each other, full body.
EXACTLY the same character, face, hair, clothes, colors, pixel size, proportions and outline as the attached character reference sheet,
and the same art style as the attached sprite. Do not redesign the character.
No text, no labels, no numbers, no floor shadows, nothing else.
Poses, left to right, top row then bottom row:
```

---

## Paso 3 · Hojas del narrador (repone las 16 poses actuales con la cara nueva)

**Hoja A · narrador** → `normal, habla, senala, senala-izq, piensa, lupa, documento, saluda`
```
1) standing relaxed, arms down, looking at the viewer; 2) talking, one open hand raised at chest height;
3) pointing to the right with a small laser pointer, arm fully extended; 4) pointing to the left with his index finger, arm extended;
5) thinking, hand on chin, eyes looking up; 6) holding a vintage brass magnifying glass in front of one eye;
7) reading an old yellowed paper document held with both hands; 8) waving hello with one hand, warm half smile.
```

**Hoja B · narrador y podcast** → `brazos, sorpresa, libro, camina, mic-escucha, mic-mano, mic-rie, mic-perfil`
```
1) arms crossed, serious and confident; 2) surprised, eyebrows raised, hands slightly open;
3) holding an open old leather book, looking at the viewer; 4) walking to the right, three-quarter view, mid-step;
5) next to a vintage chrome stand microphone, listening, mouth closed; 6) holding a vintage handheld microphone close to his mouth, talking;
7) next to the vintage stand microphone, laughing, eyes closed, hand on his belly; 8) three-quarter view facing right, talking into the vintage stand microphone.
```

---

## Paso 4 · Hojas nuevas para mapas

**Hoja D · explorador del mapa** → `mapa-puntero, mapa-pin, mapa-despliega, mapa-catalejo, mapa-brujula, mapa-camina, mapa-hilo, mapa-mira-arriba`
```
1) pointing down and to the right with a long wooden pointer, as if touching a map on the floor;
2) kneeling on one knee, pushing a red push pin into the ground with one hand;
3) holding a large unrolled old parchment map with both hands, the blank back of the map facing the viewer, his face visible above it;
4) looking through a vintage brass spyglass to the right, one eye closed;
5) holding an old brass compass in his open palm, looking down at it;
6) walking to the right, three-quarter view, a rolled map under his arm;
7) stretching a red thread between both hands at chest height, as if measuring a distance;
8) looking up and pointing up with one hand, as if something big appeared above him.
```

**Hoja E · gestos para el gancho** → `gancho-manos-cabeza, gancho-hombros, gancho-tijeras, gancho-pregunta, gancho-cara, gancho-tu, gancho-grande, gancho-pequeno`
```
1) both hands on his head, shocked, mouth open;
2) shrugging, palms up, eyebrows raised, as if saying "who knows?";
3) holding a big pair of scissors with both hands, ready to cut;
4) holding up a big blank sign shaped like a red question mark;
5) facepalm, one hand covering his eyes;
6) pointing straight at the viewer with his index finger, serious;
7) arms wide open to both sides, as if showing something very big;
8) holding his thumb and index finger very close together, as if showing something very small.
```

**Hoja F · moverse sobre el mapa** → `camina-der-1, camina-der-2, camina-izq-1, camina-izq-2, espalda-mapa, sentado-caja, sobre-libros, salta`
```
1) walking to the right, side view, left leg forward; 2) walking to the right, side view, right leg forward;
3) walking to the left, side view, left leg forward; 4) walking to the left, side view, right leg forward;
5) back view, looking at something on a wall in front of him, hands on his hips;
6) sitting on a small wooden crate, reading a paper;
7) standing on top of a stack of old books, pointing far to the right;
8) jumping with both arms up, happy.
```

**Hoja G · utilería de mapa** (sin personaje) → `obj-mapa-enrollado, obj-pergamino, obj-rosa-vientos, obj-pin, obj-catalejo, obj-brujula, obj-tijeras, obj-hilo`
```
Pixel art object sprite sheet on a plain pure white background, 8 separate objects in a clean grid of 4 columns and 2 rows,
evenly spaced, same art style, pixel size and outline as the attached sprite, no text, no labels:
1) rolled old parchment map tied with a red string; 2) unrolled blank parchment, slightly torn edges; 3) old-style compass rose;
4) red push pin; 5) vintage brass spyglass; 6) old brass compass; 7) big pair of scissors; 8) spool of red thread.
```

**Hoja H · íconos para dibujar sobre el mapa** (sin personaje) → `ico-montanas, ico-rio, ico-barco, ico-tren, ico-mula, ico-canoa, ico-fuerte, ico-mojon`
```
Pixel art map icon sprite sheet on a plain pure white background, 8 separate small icons in a clean grid of 4 columns and 2 rows,
evenly spaced, same art style, pixel size and outline as the attached sprite, slightly top-down view like a board game map, no text:
1) small mountain range with three peaks; 2) short winding river segment; 3) small 19th-century steamship;
4) small old steam locomotive; 5) pack mule with cargo; 6) dugout canoe with a paddle; 7) small colonial stone fort; 8) old stone border marker.
```

**Hoja I · fichas de Profe Leo para el mapa** → `ficha-normal, ficha-sorpresa, ficha-piensa, ficha-senala, ficha-rie, ficha-serio, ficha-pregunta, ficha-guina`
```
Pixel art sprite sheet on a plain pure white background: 8 round map tokens in a clean grid of 4 columns and 2 rows, evenly spaced.
Each token is a circle with a thick dark outline and a paper-colored inner background, showing the head and shoulders of the SAME character
as the attached character reference sheet, same pixel size and colors. No text.
Expressions: 1) neutral; 2) surprised; 3) thinking; 4) pointing to the right; 5) laughing; 6) serious frown; 7) one eyebrow raised, doubtful; 8) winking.
```

---

## Paso 5 · Una pose suelta (para repetir lo que salió mal)

```
Pixel art character, full body, plain pure white background. EXACTLY the same character as the attached character reference sheet,
same art style, pixel size and outline as the attached sprite. Do not redesign the character. No text, no floor shadow, nothing else.
Pose: [copiar aquí la línea de la pose]
```

---

## Notas

- Las figuras históricas siguen con el prompt de `PROMPTS.md`, sección 3, y llevan la marca ILUSTRACIÓN como hasta ahora.
- Total de assets nuevos: 8 poses de mapa, 8 gestos de gancho, 8 de movimiento, 8 objetos, 8 íconos y 8 fichas. Son 48, más las 16 poses repuestas.
- Cuando estén listas, revisa cada recorte en `personaje/vista-<nombre>.png` antes de usarlo.
