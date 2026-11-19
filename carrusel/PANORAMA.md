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
