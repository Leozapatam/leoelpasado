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
