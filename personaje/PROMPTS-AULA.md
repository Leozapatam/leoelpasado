# Prompts de sprites para el aula del carrusel (ChatGPT o Gemini)

Mismo método que `PROMPTS-V2.md`: una hoja por mensaje, cuadrícula de 4 × 2, fondo blanco puro, sin texto y sin sombra en el piso (la sombra la pone la plantilla). Adjunta siempre la ficha `personaje/originales/leo-v2-ficha.png` como referencia de estilo.

Para recortar (modelo aparte, carpeta `v2/`):
`python scripts/sprite.py <hoja.png> v2/nombre1,…,v2/nombre8 --hoja`

## Encabezado para objetos (pegar primero)

```
Pixel art object sprite sheet on a plain pure white background, 8 separate objects in a clean grid of 4 columns and 2 rows,
evenly spaced, not touching, same art style, pixel size, outline and soft two-tone shading as the attached character reference sheet.
Slight three-quarter front view, as seen inside a classroom. No text, no labels, no logos, no floor shadows, nothing else.
Objects, left to right, top row then bottom row:
```

**Hoja J · aula** → `aula-tv, aula-iman, aula-marcadores, aula-borrador, aula-enchufe, aula-caneca, aula-morral, aula-matera`
```
1) wall-mounted flat TV hanging from two thin ceiling poles, screen off and black;
2) round red whiteboard magnet; 3) four whiteboard markers lying side by side (black, red, blue, green caps);
4) whiteboard eraser, dark felt with grey handle; 5) white wall power outlet plate with two sockets;
6) small grey office trash bin; 7) dark backpack leaning, closed; 8) small green potted plant in a terracotta pot.
```

**Hoja K · easter eggs de historia** → `egg-globo, egg-maleta, egg-sombrero, egg-radio, egg-libros, egg-telegrama, egg-cafe, egg-bandera`
```
1) old desk globe on a wooden stand; 2) old leather travel suitcase with straps; 3) traditional woven hat;
4) 1930s wooden table radio; 5) stack of three old books; 6) old folded telegram paper;
7) enamel tin coffee mug; 8) small blank flag on a short wooden stick (the flag has no design, plain cloth).
```

## Encabezado para el público (pegar primero)

```
Pixel art character sprite sheet on a plain pure white background: 8 DIFFERENT young students seen FROM BEHIND
(back view, only head and shoulders, cut at mid-chest), in a clean grid of 4 columns and 2 rows, same size, evenly spaced, not touching.
Same art style, pixel size, outline and two-tone shading as the attached character reference sheet. Varied hair, skin tones and clothes.
No text, no labels, no floor shadows, nothing else.
Students, left to right, top row then bottom row:
```

**Hoja L · público quieto** → `pub-rizos, pub-cola, pub-gorra, pub-corto, pub-trenzas, pub-rapado, pub-mono, pub-gafas`
```
1) curly dark hair, navy t-shirt; 2) long hair in a ponytail with a red hair tie, maroon sweater;
3) backwards blue cap, green t-shirt; 4) short straight black hair, grey hoodie; 5) two braids, yellow t-shirt;
6) shaved head, white shirt; 7) hair in a bun, striped shirt; 8) wavy hair, glasses temples visible over the ears, denim jacket.
```

**Hoja M · público que reacciona** → `pub-mano, pub-apuntes, pub-susurra, pub-rasca, pub-aplaude, pub-cuaderno, pub-inclina, pub-asiente`
```
1) raising one hand high to ask a question; 2) head down, writing notes (elbow moving);
3) leaning to whisper to the left; 4) scratching the back of the head, confused; 5) clapping, hands visible above the shoulders;
6) holding up an open notebook; 7) head tilted to one side, thinking; 8) nodding, head slightly forward.
```

## Notas

- **Personas de la vida pública** en el público: solo cuando el tema trate sus críticas, con el prompt de figuras históricas de `PROMPTS.md`, marcadas como ILUSTRACIÓN y con las pruebas de simetría y del nombre propio.
- **El hilo y el mapa del tablero** no van como sprite: los dibuja la plantilla para que unan los puntos exactos y crucen las costuras a la misma altura.
- Sin sombras en los sprites: la plantilla pone la sombra de contacto y la proyectada según la luz de cada lámina.
