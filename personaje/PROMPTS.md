# Prompts para generar los assets de personajes

**Referencia oficial de Profe Leo:** `personaje/originales/leo-base-microfono.png` (Leo con el micrófono antiguo, fondo blanco).
Adjúntala **en cada pedido**. Pide **una imagen por pose**. Si pides varias juntas, el personaje cambia.
Cuando las tengas: guárdalas en `personaje/originales/leo-<pose>.png` y ejecuta `python scripts/sprite.py personaje/originales/leo-<pose>.png leo-<pose>`.

---

## 1. Prompt base (pégalo siempre primero, en inglés da mejores resultados)

```
Pixel art chibi character, full body, front view, standing, on a plain pure white background.
EXACTLY the same character, art style, pixel size, proportions, outline and colors as the attached reference image.
Character: Profe Leo. Young man, long thick curly dark-brown hair down to the shoulders, light-brown skin,
straight thick dark eyebrows, small dark eyes, dark mustache and short goatee, black crew-neck t-shirt,
dark navy jeans, dark brown boots. Calm, serious and kind expression.
Big head, small body, thick dark outline, two-tone soft shading, clean pixel grid.
No text, no floor shadow, no background objects, nothing else in the image.
Pose:
```

## 2. Poses (añade UNA línea después de «Pose:»)

### Narrador del video
| archivo | línea a añadir |
|---|---|
| `leo-normal` | Standing relaxed, arms down at his sides, looking at the viewer. |
| `leo-habla` | Talking to the viewer, one open hand raised at chest height as if explaining. |
| `leo-senala` | Pointing to the right side of the image with a small laser pointer, right arm fully extended. |
| `leo-senala-izq` | Pointing to the left side of the image with his left index finger, arm fully extended. |
| `leo-piensa` | Thinking, one hand on his chin, eyes looking slightly up. |
| `leo-lupa` | Holding a vintage brass magnifying glass in front of one eye, curious. |
| `leo-documento` | Reading an old yellowed paper document held with both hands at chest height. |
| `leo-libro` | Holding an open old leather book with both hands, looking at the viewer. |
| `leo-brazos` | Arms crossed over his chest, serious and confident. |
| `leo-sorpresa` | Surprised, eyebrows raised, both hands slightly open at his sides. |
| `leo-saluda` | Waving hello with his right hand raised, warm half smile. |

### Formato podcast (con micrófono antiguo)
| archivo | línea a añadir |
|---|---|
| `leo-mic-habla` | Standing next to a vintage chrome stand microphone, holding the stand with one hand and gesturing with the other, talking. *(es la imagen base)* |
| `leo-mic-escucha` | Standing next to the same vintage stand microphone, both hands down, listening, mouth closed. |
| `leo-mic-mano` | Holding a vintage handheld microphone close to his mouth with both hands, talking. |
| `leo-mic-ríe` | Next to the vintage stand microphone, laughing, eyes closed, one hand on his belly. |
| `leo-mic-perfil` | Three-quarter side view facing right, talking into the vintage stand microphone. |

### Utilería suelta (mismo estilo, fondo blanco, sin personaje)
```
Pixel art object, same art style and pixel size as the attached reference image, plain pure white background, no text: 
```
+ una de estas: `vintage chrome stand microphone` · `vintage brass magnifying glass` · `old typewriter` · `empty polaroid photo frame` · `open old leather book` · `old letter with red wax seal` · `old case file folder tied with red string` · `rolled old map` · `green banker desk lamp` · `red push pins`.

## 2b. Hojas de 8 poses en una sola imagen (más rápido)

Formato fijo para que la plantilla las recorte sola: **cuadrícula de 4 columnas por 2 filas**, todas las poses del mismo tamaño, separadas, fondo blanco, sin texto. Imagen **vertical u horizontal grande** (por ejemplo 2048 × 1024).

**Hoja A · narrador**
```
Pixel art character sprite sheet on a plain pure white background: the SAME character 8 times, in a clean grid of 4 columns and 2 rows,
every pose the same height and scale, evenly spaced, not touching each other, full body, front view.
EXACTLY the same character, art style, pixel size, proportions, outline and colors as the attached reference image:
Profe Leo, young man, long thick curly dark-brown hair to the shoulders, light-brown skin, thick dark eyebrows, dark mustache and short goatee,
black crew-neck t-shirt, dark navy jeans, dark brown boots. Calm, serious and kind expression.
No text, no labels, no numbers, no floor shadows, nothing else.
Poses, left to right, top row: 1) standing relaxed, arms down; 2) talking, one open hand raised at chest height;
3) pointing to the right with a small laser pointer, arm fully extended; 4) pointing to the left with his index finger, arm extended.
Bottom row: 5) thinking, hand on chin, eyes up; 6) holding a vintage magnifying glass in front of one eye;
7) reading an old yellowed paper document with both hands; 8) waving hello with one hand, warm half smile.
```

**Hoja B · narrador y podcast**
```
Pixel art character sprite sheet on a plain pure white background: the SAME character 8 times, in a clean grid of 4 columns and 2 rows,
every pose the same height and scale, evenly spaced, not touching each other, full body.
EXACTLY the same character, art style, pixel size, proportions, outline and colors as the attached reference image:
Profe Leo, young man, long thick curly dark-brown hair to the shoulders, light-brown skin, thick dark eyebrows, dark mustache and short goatee,
black crew-neck t-shirt, dark navy jeans, dark brown boots.
No text, no labels, no numbers, no floor shadows, nothing else.
Poses, left to right, top row: 1) arms crossed, serious and confident; 2) surprised, eyebrows raised, hands slightly open;
3) holding an open old leather book, looking at the viewer; 4) walking to the right, three-quarter view, mid-step.
Bottom row: 5) next to a vintage chrome stand microphone, listening, mouth closed; 6) holding a vintage handheld microphone close to his mouth, talking;
7) next to the vintage stand microphone, laughing, eyes closed, hand on his belly; 8) three-quarter view facing right, talking into the vintage stand microphone.
```

**Hoja C · utilería (opcional)**
```
Pixel art object sprite sheet on a plain pure white background, 8 separate objects in a clean grid of 4 columns and 2 rows, evenly spaced,
same art style and pixel size as the attached reference image, no text, no labels:
vintage chrome stand microphone, vintage brass magnifying glass, old typewriter, empty polaroid photo frame,
open old leather book, old letter with red wax seal, old case file folder tied with red string, green banker desk lamp.
```

Orden de las poses en cada hoja (para nombrarlas al recortar):
- A: `normal, habla, senala, senala-izq, piensa, lupa, documento, saluda`
- B: `brazos, sorpresa, libro, camina, mic-escucha, mic-mano, mic-rie, mic-perfil`
- C: `obj-microfono, obj-lupa, obj-maquina, obj-polaroid, obj-libro, obj-carta, obj-expediente, obj-lampara`

Si en una hoja el personaje sale distinto en alguna pose, se pide de nuevo solo esa pose con el prompt de una imagen (sección 2).

## 3. Figuras históricas (mismo estilo)
```
Pixel art chibi character, full body, front view, plain pure white background, no text.
Same art style, pixel size and proportions as the attached reference image.
Character: [NOMBRE], [época], [rasgos y ropa según fotos o retratos de la época]. Serious, dignified expression.
```
**Rigor:** son **ilustraciones**, no retratos. En el video llevan su nombre y la marca ILUSTRACIÓN. Para personas reales, básalos en fotos o retratos de la época, y nunca los pongas a decir cosas que no dijeron.

---

## Ideas en cola (para después de tener los assets)
1. **Filtro de micrófono antiguo** para la voz: un sonido de radio o micrófono de los años 40 (banda más angosta, leve saturación, un poco de ruido de válvula). El «ruido» deja de ser un defecto y pasa a ser parte de la estética.
2. **Formato podcast**: Profe Leo junto al micrófono antiguo como escenario fijo, con efectos y cortinas, gestionable desde la misma plantilla (otro tipo de escena y otro preset de audio).
