# Carrusel panorámico · ideas para la rama de imágenes

Fecha: 19/11/2026. Rama de git: `carrusel` (separada de `main`, donde viven los videos). Estado: **exploración**.

Prototipo: `node carrusel/panorama/panorama.cjs` → `out/panorama-leticia/` (imagen completa, versión con costuras marcadas y las 6 láminas cortadas). Tema de muestra: «¿Por qué Colombia tiene esta punta?». Datos por verificar.

---

## 1. La idea

El carrusel es **una sola imagen horizontal** de 6 a 8 láminas que se corta en piezas de 1080 × 1350. Un **hilo rojo continuo** recorre toda la imagen y guía la lectura. Cada **nudo** del hilo es una afirmación con su número de nota. Al final, el hilo termina en las **fuentes en estilo Chicago**.

Es la regla de la casa vuelta forma: *ningún hilo sin fuente*. El hilo es literal y cada nudo se puede verificar.

## 2. Gramática del hilo

| Regla | Por qué |
|---|---|
| El hilo cruza **todas las costuras a la misma altura** (760 px en el prototipo) | Si cambia de altura entre una lámina y otra, al deslizar se ve el salto |
| Dentro de cada lámina, el hilo **sube al nudo, baja y sale** por la costura | Así se cumple "de arriba hacia abajo" sin romper la continuidad. Un zigzag que entre arriba y salga abajo no empata con la lámina siguiente |
| El hilo **nunca cruza un texto** | Baja por el borde izquierdo de cada ficha y pasa por debajo |
| El hilo **nunca pasa por encima de Profe Leo** | Se lee como error, no como diseño |
| **Un nudo por lámina**, con su número de nota | Una idea por lámina; cada idea tiene fuente |
| El **primer nudo** sale del titular de la portada y el **último** llega a las fuentes | El recorrido empieza en la pregunta y termina en la evidencia |
| **Ningún texto sobre una costura**. Solo imágenes y el hilo cruzan las costuras (el mapa, el pergamino) | Instagram puede mover un píxel al cortar; un texto partido se ve roto |
| Los **pines** nunca van justo en la costura | Un pin partido en dos se ve mal en cada lámina vista sola |

## 3. Cada lámina también debe funcionar sola

- En el perfil solo se ve la lámina 1. Es la portada y lleva el gancho completo. En 2025 Instagram cambió la cuadrícula del perfil a rectángulos 3:4 (por verificar), así que el gancho de la lámina 1 va dentro de la franja central, lejos de los bordes laterales.
- Quien recibe una lámina compartida suelta tiene que entenderla: titular con año o lugar y una frase.
- El hilo que sale por la derecha de la lámina 1 es la invitación a deslizar. No hace falta escribir "desliza".

## 4. Fuentes en estilo Chicago, verificables

El estilo Chicago (*Chicago Manual of Style*, 18.ª edición, 2024) tiene dos formas: **notas** y **bibliografía**. Propuesta para el carrusel:

1. En las láminas, cada nudo lleva un **número volado** (¹, ², ³), como una nota al pie.
2. La última lámina se llama **Notas** y usa la **forma de nota**, con la página o el folio exacto:
   - Libro: `1. Nombre Apellido, Título del libro (Ciudad: Editorial, año), 45.`
   - Artículo: `2. Nombre Apellido, «Título del artículo», Revista 12, n.º 3 (año): 45, https://doi.org/…`
   - Documento de archivo: `3. «Título o descripción del documento», día mes año, Fondo, caja, carpeta, folio, Archivo General de la Nación, Bogotá.`
   - Tratado: `4. «Título del tratado», Ciudad, día mes año, en Colección, vol., p.`
   - Mapa o datos: `5. Natural Earth, «Admin 0. Countries», escala 1:50m, consultado el 19 de noviembre de 2026, https://www.naturalearthdata.com/.`
3. La **bibliografía completa** (forma de bibliografía, con el apellido primero) va en la descripción del post, porque Instagram no deja tocar enlaces dentro de la imagen.
4. Regla de verificabilidad: **toda nota lleva página, folio o enlace estable** (DOI, catálogo del archivo, biblioteca digital). Sin eso no entra.

En el prototipo, la lámina de fuentes todavía usa la forma de bibliografía con números. Hay que pasarla a forma de nota.

## 5. Estilo propio, pero conectado con los videos

| | Videos (rama `main`) | Carruseles (rama `carrusel`) |
|---|---|---|
| Fondo | Tinta oscura, noir de archivo | **Papel claro** (propuesta), como mesa de trabajo o cuaderno de campo |
| Hilo rojo | Conecta fichas en el tablero | Es la columna del carrusel |
| Profe Leo | Modelo original o v2 | **v2**, con poses de mapa y de gancho |
| Fuentes | En la descripción | Notas Chicago en la última lámina + bibliografía en la descripción |
| Tipografías | Playfair Display y Special Elite | Las mismas. Son el lazo de marca |

Formas de conectarlos:
- **Mismo tema, dos piezas**: el episodio y el carrusel comparten `fuentes.json`, así las notas del carrusel salen de las fuentes del video.
- **El hilo es la marca**: en el video el hilo une fichas; en el carrusel el hilo es el camino. Quien ve uno reconoce el otro.
- **Remisión cruzada**: el cierre del carrusel puede invitar al video y al revés (el informe propone probar "cierre con pregunta" frente a "cierre con remisión").

## 6. Variantes del mismo formato

| Variante | Qué recorre el hilo | Ejemplo de tema |
|---|---|---|
| **Línea de tiempo con mapa** (prototipo) | Fechas que cambian un territorio | Leticia, Panamá, Mosquitia |
| **Gran mapa** | Un solo mapa partido en 6 láminas; el hilo es una ruta | Una expedición, la ruta de la quina o del tabaco |
| **Mesa de archivo** | Documentos sobre una mesa que cruzan las costuras | Un expediente judicial, una carta y su respuesta |
| **Genealogía de una idea** | De una frase de hoy a su origen, hacia atrás | "Mano dura", "la Colombia de las regiones" (encaja con el inventario del sentido común) |
| **Dos hilos** | Dos versiones del mismo hecho que se cruzan y se separan | Las lecturas peruana y colombiana de 1932, con simetría |

## 7. Cómo se construiría (sistema)

1. **`panorama.json`** por carrusel: número de láminas, fondo, mapa, y una lista de **nudos** (lámina, posición, año, texto, pose de Profe Leo, número de nota).
2. **El hilo se calcula solo**: pasa por los nudos, por debajo de las fichas y por la altura fija de cada costura (ya funciona así en el prototipo).
3. **`notas.json`** en forma Chicago, compartible con el video.
4. **Validador** antes de exportar:
   - que ningún texto cruce una costura;
   - que el hilo cruce cada costura dentro de la franja fija;
   - que cada nudo tenga nota y cada nota tenga página, folio o enlace;
   - que la portada quepa en la franja 3:4;
   - que todas las poses existan en el modelo v2.
5. **Salida**: la imagen completa, las láminas cortadas y una vista con costuras para revisar.

## 8. Lo que falta resolver

1. **Mapas de época**: el prototipo usa bordes actuales rotulados ESQUEMA. Para 1922 o 1930 hace falta un mapa histórico con fuente.
2. **La "punta" se ve chica** en la lámina 1. Opción: un recuadro ampliado del trapecio o encuadrar más cerca.
3. **Fondo**: papel claro (propuesta) o tinta como los videos. Decide Leo.
4. **Nombre del formato**: decide Leo.
5. **Primer tema real**: pasarlo por la matriz y conseguir las fuentes antes de armar el `panorama.json`.

---

## 9. Versión sobre tablero de corcho (19/11/2026)

Prototipo: `node carrusel/panorama/corcho.cjs` → `out/corcho-leticia/`.

- **Fondo**: el corcho de los videos, puesto en baldosas espejadas para que no se note el corte entre láminas.
- **Hilo realista**: va de pin en pin en tramos rectos que cuelgan un poco. Tiene sombra, borde oscuro y un brillo punteado que imita el torcido de la cuerda. Los pines de los nudos son rojos y los de las costuras son de latón.
- **Recorrido en cada lámina**: entra abajo a la izquierda, sube por el margen, cruza por el borde de la tarjeta de título (entre sus dos pines), baja por el margen derecho y sale a la misma altura (1080 px). Así nunca pasa por encima de un párrafo.
- **Texto**: cada lámina tiene una tarjeta de título y una tarjeta con un párrafo de 25 a 45 palabras, en frases cortas y palabras comunes. Las tarjetas van una debajo de la otra en flujo, así un párrafo más largo nunca se monta sobre el título.
- **Letra del párrafo**: propuesta Source Serif 4 a 38 px (unos 13 px en un celular de 375 px), más fácil de leer que la máquina de escribir para personas mayores. Es una decisión de identidad: decide Leo.
- **Decoraciones**: cinta de papel que sostiene las tarjetas, parches bordados redondos (año o lugar), stickers con borde blanco (íconos del modelo v2), chapas con las fichas de Profe Leo y el carrete de hilo donde termina el recorrido.
- **Notas**: la última lámina ya usa la forma de nota de Chicago.

Pendiente en esta versión: el trapecio de la lámina 1 se ve muy chico (falta un recuadro ampliado); los párrafos son texto de muestra escrito para el boceto, no la voz de Leo; los datos siguen por verificar en fuente primaria.

---

## 10. Escenario 2.5D (19/11/2026)

Leo descartó la versión de corcho. Prototipo nuevo: `node carrusel/panorama/escena.cjs` → `out/escena-leticia/`.

- **Paisaje en capas**, en pixel art del mismo tamaño de píxel que Profe Leo v2: cielo con tramado, sol bajo, la cordillera lejana a la izquierda (los Andes) que baja hacia la selva, el río, la orilla, el camino y el pasto en primer plano. La neblina sobre lo lejano da profundidad. Se dibuja a 1/4 de resolución y se amplía sin suavizar.
- **Profe Leo recorre el camino** de lámina en lámina, con sombra en el suelo. Los íconos v2 viven en el escenario: la mula, el mojón de frontera, el barco y la canoa en el río, el fuerte en la orilla.
- **El texto va en carteles de madera** clavados en la orilla. Cada cartel toma la altura de su texto y sus patas bajan hasta el río.
- **El hilo es una cuerda roja entre postes.** Hay dos postes junto a cada costura a la misma altura, y uno en el centro de cada lámina con una etiqueta de papel que lleva el número de la nota.

Ideas para profundizar el 2.5D: cambiar la hora del día o la estación según la época del relato, poner objetos en primer plano que tapen parte de la escena (hojas, ramas), y repetir el mismo escenario en el video con movimiento de cámara (parallax), para que el carrusel y el video compartan mundo.

---

## 11. Aula 2.5D con tablero continuo (19/11/2026)

Prototipo: `node carrusel/panorama/aula.cjs` → `out/aula-leticia/`. Pedido de Leo: el escenario es un aula y el hilo rojo conecta puntos en el tablero.

- **Tres franjas por lámina**: arriba, el título en una cartulina pegada con cinta a la pared; en medio, el **tablero de tiza continuo** que se alarga por todas las láminas; abajo, Profe Leo v2 en el piso de madera y el párrafo en una hoja.
- **El hilo une imanes rojos** sobre el tablero. Los nudos alternan arriba y abajo (el ojo baja y sube), y el hilo cruza todas las costuras a la misma altura (580 px). Junto a cada nudo hay un número de tiza en un círculo, que remite a las notas.
- **Tiza**: fechas grandes, frases cortas y dibujos simples (el mapa de Colombia con la punta marcada, olas del río, el signo de pregunta). El efecto de tiza es un filtro de ruido sobre el trazo.
- **El aula** (pared, zócalo, tablero con manchas de borrador, bandeja con tizas y borradores, piso de tablas) se dibuja en pixel art a 1/4 de resolución, del mismo tamaño de píxel que Profe Leo.
- **Notas**: la última lámina pega la hoja de notas Chicago sobre el tablero y el hilo termina en ella. Profe Leo sostiene el hilo.

---

## 12. Aula moderna con tablero blanco (19/11/2026)

Prototipo: `node carrusel/panorama/aula-blanca.cjs` → `out/aula-blanca-leticia/`. Ajustes pedidos por Leo sobre el aula de tiza:

- **Televisor** en la pared, encima del tablero, uno por lámina. En la pantalla va el título (texto claro sobre fondo oscuro, etiqueta en rojo claro).
- **Tablero blanco** continuo con marco de aluminio, reflejos suaves y una bandeja con marcadores de colores y borradores.
- **Marcador**: textos y dibujos en marcador negro (fuente Permanent Marker, trazo con un leve temblor de mano). Las frases de apoyo van en marcador azul y la marca de la punta en rojo.
- **Piso de baldosa** en una franja delgada, con juntas inclinadas para dar profundidad.
- Se mantienen el hilo rojo entre imanes, los números de nota en círculo, la hoja con el párrafo y la hoja de notas Chicago en la última lámina.

Ajuste del mismo día: el tablero blanco baja a la altura de Profe Leo (de 470 a 1240 px), y el párrafo se escribe en el tablero con letra de mano clara (Patrick Hand), como si Profe Leo lo hubiera copiado. Arriba, el televisor muestra el marco completo: canto, pantalla, soporte de pared, marca y luz de encendido.

Segundo ajuste del mismo día: el tablero sube un poco (450 a 1080 px) y su borde de abajo queda a la cadera de Profe Leo, que ahora mide 420 px y está de pie sobre el piso, delante del tablero. El televisor cuelga del techo con dos tubos y proyecta una sombra suave en la pared.
Pendiente de proporción: el píxel de Profe Leo (unos 6,5 px) ya es más grueso que el del aula (4 px). Para unificar, el aula debería dibujarse con píxel de 6 o 7.

---

## 13. Escena aprobada en muestra y reglas de detalle (19/11/2026)

Muestra: `node carrusel/panorama/muestra.cjs` → `out/muestra/lamina.png` (una sola lámina, para ahorrar antes de aprobar).

Escena: pared al fondo con degradado de luz (aprobado por Leo), televisor colgado del techo con sombra y brillo frío, tablero blanco de altura normal, Profe Leo al frente hablándole al público, piso de baldosa con profundidad.

Reglas de detalle decididas por Leo:
1. **Luz de ventana coherente**: en la lámina 1 entra por la izquierda y en la última por la derecha. En las del medio, suave.
2. **Brillo del televisor** sobre la pared: sí.
3. **Público que reacciona** según el tema y la lámina (levantar la mano en la pregunta, tomar apuntes, etc.). Puede incluir personas de la vida pública cuando el tema trate sus críticas: siempre como ILUSTRACIÓN, con las pruebas de simetría y del nombre propio (nunca poniéndoles palabras que no dijeron).
4. **Easter eggs**: un objeto por lámina relacionado con el tema (en la muestra, el pergamino enrollado por el tratado de 1922).
5. **Reflejo muy suave** de Profe Leo en la baldosa.
6. **Enchufe sí, reloj no** (satura y la hora es un problema).
7. **El carrete de hilo rojo siempre abajo, en la bandeja**, como si Profe Leo lo hubiera dejado ahí.
8. **Público en pixel art con detalle**: pelo, orejas, cuello, camisetas, gorra, cola de caballo, borde de luz.
9. **Sombra profesional, sin bordes claros**: se quitó el borde de luz del personaje (dejaba un contorno blanco). La sombra va en tres capas: oclusión ambiental amplia y muy suave, sombra proyectada (la silueta aplastada sobre el piso y tirada hacia el lado contrario a la ventana) y sombra de contacto oscura pegada a las botas. Profe Leo se muestra a escala entera (x2) para que el píxel quede nítido.
10. **Sprites del aula**: prompts en `personaje/PROMPTS-AULA.md` (objetos del aula, easter eggs, público quieto y público que reacciona). El hilo y el mapa los sigue dibujando la plantilla.
11. **Sprites del aula integrados** (hojas J, K, L y M en `public/personaje/v2/`): 8 objetos del aula, 8 easter eggs, 8 alumnos de espaldas y 8 alumnos que reaccionan. En la muestra: enchufe, carrete y público (una alumna toma apuntes). El público va a escala 1,4, más oscuro (cerca de la cámara y fuera de la luz) y cortado por el borde de abajo.
12. **`sprite.py` para hojas de fondo blanco puro**: público y objetos usan un umbral de fondo más alto, conservan los blancos rotos (enchufe, esmalte, camisas) y rellenan el busto de los alumnos para no perder una camisa blanca.
13. **Perspectiva frontal coherente**: el piso deja la inclinación y usa juntas verticales paralelas, igual que la pared; la profundidad la dan las filas, que crecen hacia el frente. Así la pared, el tablero y el piso se ven desde el mismo punto y el piso empata entre láminas.
14. **Televisor 16:9 de tamaño real** (520 × 292 px), centrado sobre el tablero. El tablero baja 8 px (2 píxeles del dibujo).
15. **Enchufe de frente**, dibujado en el pixel art del salón, con la misma vista que el tablero (el sprite en tres cuartos se descartó).

## 14. El tablero como sketchnote (jerarquía visual)

Referencia de método: Mike Rohde, *The Sketchnote Handbook* (Peachpit, 2012). Leo vio un curso de sketchnotes en Domestika; si comparte sus apuntes, se ajusta esta guía.

Cada lámina dibuja en el tablero una sola idea, con cinco niveles que nunca se mezclan:

| Nivel | Qué es | Cómo se dibuja |
|---|---|---|
| 1. Cinta | Año y lugar | Banda con puntas recortadas, relleno azul pálido, marcador negro grande |
| 2. Palabra clave | El concepto que hay que recordar (TRATADO, FRONTERA) | Marcador negro en mayúsculas sobre resaltador amarillo, con su definición corta en azul |
| 3. Íconos | Dibujos básicos de tablero: personas de palito, documento, mapa, flecha, signo | Contorno negro de marcador, sin sombras, un solo relleno de acento azul |
| 4. Frases | El párrafo completo en lenguaje sencillo, repartido debajo de cada idea | Letra de mano clara (Patrick Hand), 29 px |
| 5. Conectores | Flechas que marcan el orden de lectura (izquierda a derecha) | Flecha curva de marcador negro |

Reglas:
- **De izquierda a derecha y de arriba abajo**, en tres bloques como máximo por lámina.
- **El rojo es solo del hilo y de los números de nota.** El azul es el único acento del marcador; el amarillo solo resalta la palabra clave.
- **Nada del sketchnote toca el hilo** ni queda detrás de la cabeza de Profe Leo.
- **El párrafo no desaparece**: se reparte en frases cortas bajo cada ícono, para que cualquiera lo entienda aunque no lea los dibujos.

## 15. Formato «Una clase» (19/11/2026)

Nombre del formato de carrusel con aula: cada carrusel es **una clase** completa de Profe Leo.

- **Los mismos estudiantes en todas las láminas**, en el mismo puesto (`pub-rizos`, `pub-cola`, `pub-gorra`). Es la misma clase de principio a fin; no se cambian cabezas entre láminas.
- **Sin hilo rojo (prueba)**: en este formato el hilo no aportaba sentido. Queda apagado con `CON_HILO = false` en `panorama/carrusel.cjs`; el número de nota se mantiene en el tablero.
- **Letra más grande**: las frases pasan de 29 a 33 px y el contenido del tablero sube 40 px para aprovechar el espacio que dejó el hilo. Las frases de una misma columna se apilan solas para no montarse.
- Lámina final: Profe Leo se despide (`leo-saluda`) junto a la hoja de fuentes.
- **Escena acercada (prueba)** en `panorama/una-clase.cjs`: el salón, el televisor y Profe Leo se amplían 1,15× desde arriba; el tablero gana tamaño y el piso casi desaparece. El contenido del tablero se reubica sin ampliarse (para no salirse por los lados) y la letra sube a 37 px. El público baja: se ven menos las cabezas, pero siguen siendo los mismos tres.
- **Mapas con indicativos** (lámina de ejemplo): sombreado con leyenda, flecha de recorrido, pines numerados, escala real (1000 km sobre el ecuador, misma proyección) y norte. Regla: todo indicativo lleva su leyenda.
