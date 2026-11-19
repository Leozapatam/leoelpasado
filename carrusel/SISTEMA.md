> **PILOTO (noviembre 2026).** Todo en esta carpeta es prueba: formatos, textos y datos de muestra, sin verificar en fuentes primarias. No publicar tal cual.

# Formato imagen · sistema de plantilla (ideas para aprobar)

Fecha: 19/11/2026. Estado: **propuesta**. Nada de esto está construido. Cuando Leo apruebe, se construye igual que el video: **un carrusel es un archivo de datos** (`carrusel.json`), no un diseño nuevo.

Tema de ejemplo, distinto al de los bocetos: **¿Por qué Colombia tiene esta punta?** (el trapecio amazónico y Leticia). Gancho n.º 2 de `docs/GANCHOS-MAPAS.md`. Los datos del ejemplo están **por verificar** en fuente primaria.

---

## 1. Reglas fijas (no cambian por carrusel)

| Regla | Valor | De dónde sale |
|---|---|---|
| Tamaño | 1080 × 1350 (4:5), de 5 a 8 láminas | Instagram; el informe solo tiene la hipótesis de 5 frente a 10 |
| Márgenes | 90 px a los lados, 120 arriba, 140 abajo (los puntos del carrusel) | Zona segura de Instagram |
| Niveles de texto | 3 como máximo. **Titular** (Playfair 900), **apoyo** (Special Elite), **fuente** (Special Elite pequeña, gris) | Jerarquía visual (NN/g) |
| Rojo | Un solo elemento rojo por lámina. Sobre fondo oscuro, el texto rojo usa `rojoClaro` | "Pop-out" de un solo rasgo; contraste medido (`EXPLORACION.md`) |
| Texto de portada | De 3 a 8 palabras, con "esta", "este" o "aquí" si hay mapa | Informe, archivos 13 y 14 |
| Cada lámina se entiende sola | El titular resume la lámina | Comentaristas que no llegan al final (archivo 04) |
| La promesa se cumple pronto | La lámina 2 empieza a responder | Filtro F2 de la matriz |
| Ninguna lámina sin fuente | Pie de fuente en toda lámina con dato | Regla n.º 1 de la casa |
| Escritura | Sin dos puntos ni guiones en el texto que se lee. Frases cortas | Estilo del guion de Leo |
| Personaje | Profe Leo **v2** en todas las láminas, de 280 a 420 px de alto, sin tapar el dato | Modelo v2 |
| Cierre | Pregunta abierta, fuentes y la firma «Profe Leo · @leoelpasado» | Firma del video |

## 2. Catálogo de láminas (las piezas de la plantilla)

Cada tipo es un componente. Un carrusel se arma eligiendo tipos y llenando sus datos.

| Tipo | Para qué | Qué lleva | Assets de Profe Leo |
|---|---|---|---|
| `portada-mapa` | Gancho con territorio | Mapa con una zona roja, titular corto, Profe Leo reaccionando | `gancho-manos-cabeza`, `mapa-puntero`, `gancho-tijeras` |
| `portada-pregunta` | Gancho sin mapa | Pregunta grande, objeto o ficha, Profe Leo | `gancho-pregunta`, `gancho-tu`, `piensa` |
| `dato` | Una cifra o un hecho | Cifra gigante en rojo, una línea de contexto, fuente | `gancho-grande`, `gancho-pequeno`, `sorpresa` |
| `mapa-paso` | Un momento del cambio en el mapa | Mismo mapa de la portada, otra zona marcada, año, íconos | `mapa-pin`, `mapa-hilo`, `mapa-catalejo` |
| `ruta` | Un viaje o un frente | Mapa con línea punteada roja, íconos de transporte | `mapa-camina`, `camina-der-1` + íconos `ico-canoa`, `ico-barco`, `ico-mula`, `ico-tren` |
| `documento` | Mostrar la fuente | Recorte o transcripción del documento, frase marcada, pie con archivo | `lupa`, `documento`, `mapa-despliega` |
| `linea-tiempo` | Ordenar fechas | De 3 a 5 hitos con año grande, un hito en rojo | `sobre-libros`, `senala` |
| `antes-despues` | Comparar dos estados | Dos mitades con el mismo encuadre y una diferencia en rojo | `brazos`, `gancho-hombros` |
| `voces` | Lo que dijo cada parte | Dos fichas enfrentadas con su fuente (prueba de simetría) | fichas redondas `ficha-duda`, `ficha-serio` |
| `figura` | Personaje histórico | Sprite en pixel art con placa y marca ILUSTRACIÓN | Profe Leo `habla` a un lado |
| `cierre` | Pregunta, fuentes, firma | Pregunta abierta, lista de fuentes, firma | `saluda`, `piensa`, `ficha-guina` |

## 3. Recetas (secuencias que ya funcionan juntas)

| Receta | Láminas | Cuándo |
|---|---|---|
| **El mapa que cambia** | `portada-mapa` → `mapa-paso` → `documento` → `mapa-paso` → `dato` → `cierre` | Territorio, fronteras, pérdidas (la hipótesis más repetida del informe) |
| **Mito contrastado** | `portada-pregunta` → `voces` → `documento` → `dato` → `cierre` | "Te contaron que…" con evidencia |
| **Origen de un nombre o símbolo** | `portada-pregunta` → `linea-tiempo` → `documento` → `cierre` | Pregunta de origen (673 mil vistas en el informe) |
| **El viaje** | `portada-mapa` → `ruta` → `figura` → `documento` → `cierre` | Expediciones, migraciones, rutas comerciales |

## 4. Ejemplo con otro tema: «¿Por qué Colombia tiene esta punta?»

Receta **El mapa que cambia**, 6 láminas. Texto de muestra. **Todo dato está por verificar** antes de producir.

| # | Tipo | Titular | Apoyo | Profe Leo | Fuente por conseguir |
|---|---|---|---|---|---|
| 1 | `portada-mapa` | ¿Por qué Colombia tiene esta punta? | El trapecio amazónico en rojo | `mapa-puntero` | Bordes actuales (Natural Earth) |
| 2 | `mapa-paso` | Antes de 1922 no era colombiana | Zona en disputa marcada | `mapa-catalejo` | Mapa de época con fuente |
| 3 | `documento` | Un tratado firmado en Lima | Fragmento del Tratado Salomón-Lozano | `lupa` | Texto del tratado (fecha exacta discutida, marzo o julio de 1922) |
| 4 | `mapa-paso` | 1930. Leticia cambia de bandera | Entrega de Leticia, ícono `ico-barco` en el Amazonas | `mapa-pin` | Fuente de la entrega del 31/7/1930 |
| 5 | `dato` | 1932. Una guerra en la selva | El conflicto con Perú de 1932 a 1933 | `gancho-manos-cabeza` | Historiografía del conflicto |
| 6 | `cierre` | ¿Quién decide dónde termina un país? | Fuentes y firma | `piensa` | Lista completa |

Riesgo de polarización (matriz): 2 de 5. Aplica la prueba de simetría: la lámina `voces` puede reemplazar la 5 para mostrar la lectura peruana y la colombiana, cada una con su fuente.

## 5. Datos: así se vería `carrusel.json`

```json
{
  "slug": "leticia-punta",
  "modelo": "v2",
  "receta": "mapa-que-cambia",
  "mapa": { "base": "natural-earth", "encuadre": ["col", "per", "bra", "ecu"], "rotulo": "ESQUEMA" },
  "laminas": [
    { "tipo": "portada-mapa", "titular": "¿Por qué Colombia tiene esta punta?",
      "zona": "trapecio-amazonico", "leo": "mapa-puntero" },
    { "tipo": "mapa-paso", "anio": "1922", "titular": "Antes de 1922 no era colombiana",
      "zona": "trapecio-amazonico", "leo": "mapa-catalejo", "fuente": "[mapa de época]" },
    { "tipo": "documento", "titular": "Un tratado firmado en Lima",
      "texto": "[fragmento transcrito]", "resaltar": "[frase]", "leo": "lupa", "fuente": "[tratado, 1922]" },
    { "tipo": "mapa-paso", "anio": "1930", "titular": "Leticia cambia de bandera",
      "zona": "leticia", "iconos": [{ "ico": "ico-barco", "en": "rio-amazonas" }], "leo": "mapa-pin", "fuente": "[fuente]" },
    { "tipo": "dato", "cifra": "1932", "titular": "Una guerra en la selva",
      "leo": "gancho-manos-cabeza", "fuente": "[fuente]" },
    { "tipo": "cierre", "pregunta": "¿Quién decide dónde termina un país?",
      "fuentes": ["[1]", "[2]", "[3]"], "leo": "piensa" }
  ]
}
```

Un validador (como `validar.py` del video) revisaría antes de renderizar: que cada lámina con dato tenga fuente, que la portada tenga de 3 a 8 palabras, que no haya dos elementos rojos y que todas las poses existan en el modelo elegido.

## 6. Flujo de trabajo (igual que el video)

1. **Tema**: pasa por la matriz (filtro y puntaje).
2. **Guion de láminas**: la tabla de la sección 4, con fuentes reales. Aprobación de Leo.
3. **Datos**: se llena `carrusel.json`.
4. **Render**: un comando genera las PNG en `out/carrusel-<slug>/`.
5. **Revisión**: vista en tamaño de celular, chequeo de rigor y aprobación de Leo.
6. **Medición**: una fila en `metricas.csv` (guardados entre alcance) y comentarios al banco de temas.

## 7. Lo que falta decidir o conseguir

1. Aprobar el catálogo de láminas y las recetas.
2. Mapas de época: con qué fuente se dibujan las fronteras de 1922 y 1930.
3. Nombre del formato (decide Leo).
4. ¿El fondo base es oscuro (tinta) o papel? Los bocetos usaron los dos.
