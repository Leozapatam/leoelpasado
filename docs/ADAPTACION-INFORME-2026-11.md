# Adaptar Leo el pasado al informe de divulgación en redes

Fecha: 19/11/2026. Base: informe exploratorio de TikTok, Instagram, YouTube y Facebook (19 perfiles de TikTok, 21 publicaciones de Instagram, unos 24 videos largos y 5 Shorts de YouTube, páginas de Facebook).

**Regla de lectura.** El informe no prueba que ningún formato funcione. Sirve para decidir qué medir y qué probar. No cambia la identidad de Leo (noir de archivo, Profe Leo, regla de ningún hilo sin fuente). Cada cambio abajo es una propuesta para aprobación de Leo, según el orden de CLAUDE.md (tema, guion, audio, storyboard, render).

---

## 1. Qué cambia en el método

| Hallazgo del informe (confianza) | Cambio propuesto | Dónde se toca | Costo para Leo |
|---|---|---|---|
| El tema y el ángulo pesan más que el estilo gráfico (baja, pero es la comparación mejor controlada del estudio) | **Paso 0: elegir tema** con la matriz de la sección 4 antes de escribir el guion | `docs/matriz-temas.csv` (nuevo) y `CLAUDE.md`, orden de trabajo | 20 a 30 min por tema candidato |
| Pérdida, disputa y frontera aparecen arriba (baja) | Se usa como **hipótesis** en la matriz (variable provisional de 2 puntos), no como regla | Solo la matriz | Ninguno |
| Abrir con una pregunta o paradoja y responderla (baja) | Regla de guion: el gancho es una pregunta concreta y el título promete lo mismo que el episodio cumple | `CLAUDE.md`, sección de estilo del guion | Ninguno extra |
| Anclar en algo reconocible: lugar, fecha patria, escuela, símbolo (matriz del informe, sin medir) | Cada episodio abre con un ancla reconocible en los primeros 10 s | Guion (paso 2 del orden de trabajo) | Ninguno extra |
| Los comentarios son banco de temas: peticiones repetidas, omisiones, correcciones (baja) | Archivo de temas pedidos, alimentado a mano después de cada video | `banco-temas.md` (nuevo, sin plantilla técnica) | 5 min por semana |
| Medir con razones y con la mediana de la propia cuenta, no con totales (baja) | Hoja de métricas por video con la razón vistas/seguidores y la mediana de los últimos 6 | `metricas/metricas.csv` (nuevo) | 5 min por video |
| Cumplir la promesa del título y rotular imágenes generadas (matriz del informe) | Se mantiene el rótulo ILUSTRACIÓN y RECREACIÓN. Si una imagen es generada con IA, se rotula IMAGEN GENERADA CON IA. Checklist manual antes de render | Checklist en `docs/matriz-temas.csv` | Ninguno |
| Duración: los videos de 15 a 30 minutos dominan en YouTube, pero la duración está confundida con el tema (sin conclusión) | El corte corto de 60 a 90 s queda como **experimento**, no como regla. Se mantiene la propuesta de DIAGNOSTICO.md | Experimento E5 | Un corte extra por episodio cuando se pruebe |

## 2. Qué NO cambia por el informe

- **Identidad visual.** El informe no compara estilos con control: no hay evidencia de que un mapa, una ilustración o una foto funcione mejor. El estilo se mantiene por decisión de marca, no por datos.
- **Calendario y frecuencia.** El informe no estudió horarios ni cadencia. No se propone ninguna.
- **Viralidad como objetivo.** El informe dice que no predice viralidad. Las métricas son para aprender de las propias piezas, no para perseguir cifras.
- **Shorts contra videos largos.** Solo hay 5 Shorts. No hay conclusión.
- **Afecto y humor.** El informe muestra que reciben más apoyo en comentarios que las correcciones. Eso no autoriza cambiar el tono: el método de Leo es corregir con fuentes. Se usa solo como señal sobre cómo responde la gente.

## 3. Experimentos (uno a la vez, con hipótesis escrita antes de publicar)

Regla propia de este plan (no del informe): cada experimento necesita al menos 6 piezas por brazo antes de sacar conclusiones. Con menos, el resultado es anécdota y se registra como tal.

| Código | Pregunta | Qué cambia | Qué se mantiene igual | Qué se mide |
|---|---|---|---|---|
| E1 | ¿La miniatura cambia las vistas del mismo video? | Dos miniaturas: mapa o documento frente a imagen de archivo | Título, tema, duración | Vistas contra la mediana propia. Si YouTube Studio ofrece la prueba de miniaturas para el canal, usarla (verificar disponibilidad) |
| E2 | ¿Abrir con pregunta mejora la retención? | Apertura: pregunta frente a presentación | Tema, duración, cierre | Retención de los primeros 30 s en la analítica del propio canal |
| E3 | ¿El cierre con pregunta genera más comentarios? | Cierre: pregunta abierta frente a remisión a otra pieza | Apertura, tema | Comentarios por 1.000 vistas |
| E4 | ¿Pérdida o disputa rinde más que curiosidad cotidiana? | Tema: uno de pérdida o disputa frente a uno de curiosidad | Plantilla, duración, miniatura | Razón vistas/seguidores frente a la mediana propia |
| E5 | ¿El corte corto de 60 a 90 s atrae más público? | Versión corta frente a larga del mismo episodio | Tema, miniatura | Vistas y retención en cada versión |

Orden sugerido: E1 primero, porque es el más barato y el informe lo describe como comparación posible para el dueño del canal. E4 después, porque toca la matriz de temas.

## 4. Matriz de temas (propuesta sin calibrar)

**Filtro.** Pasa o no pasa. Si una sola casilla falla, el tema no entra.

1. Fuentes verificables para cada afirmación central.
2. El contenido cumple la promesa del título.
3. Las imágenes corresponden al período, y toda imagen generada o con aspecto de generada se rotula.
4. Se distinguen hechos, interpretaciones y controversias.
5. Se puede publicar sin simplificar hasta el error.

**Puntaje.** Cada variable se califica de 0 a 5. Se multiplica por su peso. El máximo positivo es 170.

| Variable | Peso | Cómo se califica |
|---|---|---|
| Demanda observada | 5 | Peticiones en comentarios y búsquedas del tema |
| Tensión inicial | 5 | Qué tan fuerte es la pregunta o el conflicto del arranque |
| Anclaje local o de identidad | 5 | Qué tan reconocible es el lugar, la fecha o el símbolo |
| Rigor y fuentes | 5 | Cuántas afirmaciones tienen fuente primaria |
| Evidencia visual | 3 | Si hay mapa o documento que mostrar |
| Valor de archivo | 3 | Si la pieza sirve como archivo dentro de diez años |
| Diferenciación | 3 | Qué se dice que no se dijo ya en el canal |
| Capacidad de producción | 3 | Cuántas horas de trabajo cuesta, con la jornada docente en mente |
| Pérdida, disputa o frontera | 2 | Variable provisional. Solo hipótesis del informe |

**Resta.** Riesgo de polarización sin valor educativo: se califica de 0 a 5 y se resta 3 veces esa calificación.

**Fórmula.** Puntaje final = (suma de variables × peso − 3 × riesgo) × 100 / 170.

El resultado puede dar negativo. La forma de la portada no puntúa. Solo sirve para desempatar.

**Qué no hace la matriz.** Ordena prioridades y obliga a documentar la evidencia. No predice si un video funcionará.

## 5. Orden de trabajo propuesto para Leo

1. Revisar este documento y decir qué puntos se adoptan (uno por uno).
2. Crear `docs/matriz-temas.csv`, `banco-temas.md` y `metricas/metricas.csv` con solo los encabezados. Se hace cuando Leo lo apruebe.
3. Antes del siguiente guion: llenar la matriz para tres temas candidatos, con sus fuentes.
4. Elegir uno de los experimentos (recomendado E1) y escribir la hipótesis antes de publicar.
5. Al cerrar cada episodio: llenar una fila en `metricas.csv` y agregar al banco los comentarios que pidan un tema.

## 6. Límites de este plan

- Lo que más pesa en el informe son los hallazgos de confianza baja. Cada cambio de la sección 1 es una prueba, no una certeza.
- Los pesos de la matriz son una propuesta sin calibrar. Se ajustan con los resultados de Leo.
- El informe mide cuentas ajenas. Sus cifras no son un punto de comparación para el canal de Leo. Solo sirve la mediana del propio canal.
- Faltan datos de distribución (cuándo y cómo adaptar entre redes). Esa parte del informe no tiene evidencia.

## 7. Decisiones que necesitan a Leo

- ¿Se adopta la matriz como Paso 0 del orden de trabajo?
- ¿Se usa YouTube como canal principal de medición, o también TikTok e Instagram?
- ¿Qué experimento se corre primero?
