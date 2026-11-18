# Prompts para generar los assets de personajes

Úsalos en Gemini (o el generador que prefieras). **Adjunta siempre como referencia**:
- tu imagen de Profe Leo que más te guste (la del mapa con el láser o la del retrato),
- y la de Walter Benjamin o Marc Bloch (para copiar el estilo).

Pide **una imagen por pose**: si pides todas juntas en una hoja, el personaje cambia de una a otra.
Cuando tengas las imágenes, súbelas a `personaje/originales/` con el nombre de la pose (por ejemplo `leo-senala.png`) y ejecuta `python scripts/sprite.py personaje/originales/leo-senala.png leo-senala`.

---

## 1. Prompt base (pégalo siempre primero)

> Pixel art chibi character, full body, front view, standing on a plain pure white background. Exactly the same art style as the reference image of the historian: thick dark outline, soft two-tone shading, clean pixel grid of about 60 pixels wide, big head, small body, no text, no shadow on the floor, nothing else in the image.
> The character is **Profe Leo**, the same person as the reference photo: young Colombian man with long curly dark-brown hair to the shoulders, light-brown skin, short goatee and thin mustache, black crew-neck t-shirt, dark blue jeans, brown boots. Calm, serious and kind expression, like a teacher about to explain something. Keep his face, hair and clothes identical in every image.

## 2. Poses (añade una línea al final del prompt base, una imagen por línea)

| archivo | qué añadir al prompt |
|---|---|
| `leo-normal` | Standing relaxed, arms down, looking at the viewer. |
| `leo-habla` | Talking, one open hand raised at chest height as if explaining. |
| `leo-senala` | Pointing to the right side of the image with a small laser pointer in his right hand, arm extended. |
| `leo-senala-izq` | Pointing to the left side of the image with his left hand, arm extended. |
| `leo-piensa` | Thinking, one hand on his chin, eyes looking slightly up. |
| `leo-lupa` | Holding a vintage magnifying glass in front of one eye, curious. |
| `leo-documento` | Reading an old yellowed paper document held with both hands. |
| `leo-libro` | Holding an open old book, looking at the viewer. |
| `leo-brazos` | Arms crossed, serious, confident. |
| `leo-sorpresa` | Surprised, eyebrows up, both hands slightly open. |
| `leo-saluda` | Waving hello with one hand, warm half smile (for the farewell). |
| `leo-camina` | Walking to the right, side three-quarter view, mid-step. |

## 3. Personajes históricos (mismo estilo)

> Same pixel art chibi style as the reference, full body, front view, plain pure white background, no text.
> **[Nombre]**, [época], [rasgos y ropa basados en fotos de la época]. Serious, dignified expression.

Ejemplos:
- *Josep Fontana, 1980s, Catalan historian, grey hair, glasses, dark jacket, holding a book.*
- *Policarpa Salavarrieta, 1817, New Granada patriot, long dark dress of the period, shawl.*

**Rigor:** los personajes en pixel art son **ilustraciones**, no retratos. En el video llevan su nombre y se presentan como ilustración. Para personas reales, básalos en fotos o retratos de la época, y nunca los pongas a decir cosas que no dijeron.

## 4. Utilería opcional (mismo estilo, fondo blanco)
Lupa antigua · máquina de escribir · polaroid vacía · libro abierto · carta con sello de lacre · expediente con cinta roja · mapa enrollado · lámpara de escritorio · chinchetas rojas.
