> **PILOTO (noviembre 2026).** Todo en esta carpeta es prueba: formatos, textos y datos de muestra, sin verificar en fuentes primarias. No publicar tal cual.

# Sala de imágenes · exploración del formato carrusel

Fecha: 19/11/2026. Estado: **exploración**. Hasta que Leo elija una dirección, nada aquí es plantilla. El orden de trabajo es el mismo de los videos: primero la dirección visual, luego el guion de láminas, la aprobación de Leo y al final la construcción.

Bocetos: `exploracion/A-noticiero.png`, `B-expediente.png`, `C-mapa.png`, `D-documento.png` (3 láminas cada uno, 1080 × 1350). Se regeneran con `node carrusel/exploracion/bocetos.cjs`. Los textos son de muestra para juzgar la jerarquía; los que van entre corchetes son huecos para fuentes reales.

---

## 1. Lo que dice el informe sobre carruseles e imágenes

Archivos de `miradaparda-web/investigacion-difusion/`. Todo es de confianza baja y viene de pocos casos.

| Hallazgo | Archivo | Qué hacemos con él |
|---|---|---|
| Portadas de video con 3 a 8 palabras; en carruseles de archivo, la primera lámina lleva una frase completa en serif (fecha, nombre, acción) | 13 | Portada con titular corto y una pregunta; la frase completa va en la lámina 2 |
| Un documento real en portada coincidió con la razón más alta del estudio (195 %, juicio de 1757) | 12, 13 | Probar la dirección D (documento) como apuesta de rigor |
| Mapas con pregunta de una palabra se repiten en las cuadrículas; territorio y pérdida encabezan lo más visto en 4 cuentas de TikTok | 13, 14 | Dirección C (mapa que cambia) |
| Varios comentaristas juzgan un carrusel sin llegar a la última lámina | 04 | Cada lámina se entiende sola, y la conclusión no queda escondida al final |
| Las listas útiles (libros) se guardan y se comparten más de lo que se comentan | 05, 12 | Lámina final con fuentes: se guarda como ficha de estudio |
| Una pregunta en el pie no garantiza comentarios | 12 | La pregunta va en la imagen, no solo en el pie |
| La forma de la portada no explica sola el rendimiento | 14, 16 | La dirección se elige por identidad y costo, no por promesa de alcance |

## 2. Jerarquía visual (fuentes)

- **Definición.** La jerarquía visual ordena los elementos para que el ojo los lea en el orden de importancia que se quiere. Se construye con escala, valor, color, espacio y posición. No conviene depender solo del color, porque las personas con daltonismo pueden no distinguir algunas combinaciones. Fuente: Nielsen Norman Group, [Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) y [5 Principles of Visual Design](https://www.nngroup.com/articles/principles-visual-design/).
- **Un solo elemento distinto salta a la vista.** Un objetivo que se diferencia por un solo rasgo, como el color, se encuentra rápido aunque haya muchos distractores ("pop-out"). Cuando hay que combinar dos rasgos, la búsqueda es lenta. Fuente: Treisman y Gelade (1980), Treisman y Souther (1985), y la revisión de Wolfe (2021, [Guided Search 6.0](https://search.bwh.harvard.edu/new/pubs/Wolfe2021_GS6.pdf)), que matiza que el efecto también depende de lo que la persona busca.
- **Consecuencia para la marca.** La regla que ya existe (rojo como único acento) tiene respaldo: si el rojo marca una sola cosa por lámina, esa cosa salta. Si el rojo marca tres, ninguna salta.

Reglas que propongo para cada lámina:
1. Tres niveles como máximo: titular (Playfair 900), apoyo (Special Elite), fuente (Special Elite pequeña, gris).
2. Un solo punto rojo por lámina: la cifra, la palabra o la zona del mapa que importa.
3. La lámina se entiende con el titular solo.
4. Margen de 80 a 90 px. Nada importante cerca del borde inferior, donde Instagram pone los puntos del carrusel.

## 3. Psicología del color: lo que se puede y lo que no se puede afirmar

- Elliot y Maier (2014), [Annual Review of Psychology 65, 95-120](https://pubmed.ncbi.nlm.nih.gov/23808916/): el color puede influir en el afecto, la cognición y la conducta, pero el campo está "en una etapa incipiente", y su efecto depende del contexto.
- Por eso **no** se usan aquí afirmaciones como "el rojo genera urgencia" o "el sepia da confianza". Son creencias de mercadeo sin base sólida.
- Lo que sí se sostiene: el contraste y la diferencia de un solo rasgo dirigen la atención (sección 2). El sepia y la máquina de escribir son una **convención cultural** de lo "de archivo", no un efecto psicológico demostrado.

## 4. La paleta actual, medida (contraste WCAG)

Colores de `src/marca.ts`. Razón de contraste calculada con la fórmula de WCAG 2.x. Mínimo 4,5 para texto normal y 3 para texto grande (24 px o más, o 19 px en negrita).

| Combinación | Contraste | Uso permitido |
|---|---|---|
| Hueso sobre tinta | 16,4 | Todo |
| Texto sobre papel | 13,2 | Todo |
| Apagado sobre tinta | 6,9 | Texto secundario |
| Rojo claro sobre tinta | 6,0 | Texto en rojo sobre fondo oscuro |
| Hueso sobre rojo | 5,2 | Sellos y bandas |
| Gris sobre papel | 4,9 | Pies de fuente |
| Rojo sobre papel | 4,6 | Texto en rojo sobre papel (justo en el límite) |
| **Rojo sobre tinta** | **3,2** | **Solo hilo, pines, mapas y titulares grandes. Nunca texto pequeño** |

Regla nueva que sale de la medición: sobre fondo oscuro, el texto en rojo usa `rojoClaro`; el `rojo` queda para formas.

## 5. Las cuatro direcciones

| | A. Noticiero desde la historia | B. Expediente panorámico | C. El mapa que cambia | D. Documento anotado |
|---|---|---|---|---|
| Idea | Portada de periódico recreada del día del hecho; luego "lo que se dijo entonces / lo que sabemos hoy" | El tablero de corcho de los videos, con un hilo rojo que cruza de una lámina a la siguiente | El mismo mapa en cada lámina; cambia una sola zona | La fuente a pantalla completa, con el rojo marcando la frase; la siguiente lámina la amplía |
| Qué la hace distinta | Contraste entre la versión de época y la evidencia de hoy | El hilo continuo invita a deslizar y es la misma marca del video | Se ve el cambio sin leer | Muestra la evidencia en lugar de afirmarla |
| Apoyo en el informe | Tensión inicial y conexión con el presente | Ninguno directo; es continuidad de marca | Territorio y pérdida (hipótesis más repetida) | Documento real en portada (un caso, 195 %) |
| Riesgo | Que la recreación se lea como periódico real. Lleva siempre RECREACIÓN en la cabecera | Mucho texto pequeño sobre corcho; legibilidad en el celular | Solo sirve para temas con territorio | Exige un documento con buena imagen y derechos claros |
| Costo por pieza | Medio (prensa de época y hallazgo actual) | Bajo (reutiliza fichas y fotos del video) | Bajo cuando la base del mapa existe | Medio (buscar, transcribir y traducir) |

Ver también: el mapa usa los bordes actuales de Natural Earth (la misma base de los videos). Para un tema histórico real habría que usar bordes de época con fuente, o rotularlo como esquema.

## 6. Recomendación

Una sola plantilla con **dos modos**, no cuatro formatos:
- **Modo documento (D)** como base: es el que mejor cumple "ningún hilo sin fuente" y es el que más se diferencia de las cuentas de curiosidades.
- **Modo mapa (C)** para los temas de territorio, que es la hipótesis más repetida del informe.
- El **noticiero (A)** queda como formato especial para efemérides, sin obligación de calendario.
- El **expediente (B)** queda en el video. El carrusel no tiene por qué repetir el tablero.

La prueba que lo decide es la regla de 5 piezas del informe: 5 carruseles de un modo, con la métrica elegida antes de publicar (guardados entre alcance, que solo ve el dueño de la cuenta).

## 7. Decisiones de Leo

1. ¿Qué dirección o combinación se construye?
2. ¿El noticiero se llama "El Pasado" o tiene otro nombre? (Identidad: decide Leo.)
3. ¿Cuántas láminas por carrusel? El informe solo tiene una hipótesis (5 frente a 10).
