# Método «Una clase» — receta para repetir un carrusel

> Primera vez usado: «¿Por qué Colombia marcha el 19 de noviembre?» (publicado el 19 nov. 2026). Sigue siendo piloto: se pule en cada uso.
> **Para ahorrar tokens, una sesión nueva lee SOLO este archivo** y, cuando lo necesite, `TABLERO.md` (reglas de contenido) y `panorama/marcha.cjs` (la plantilla de código). No hace falta leer PANORAMA, SISTEMA ni EXPLORACION.

## Mensaje para abrir una sesión nueva

```
Carrusel «Una clase» para @leoelpasado. Lee carrusel/METODO.md y sigue la receta.
Tema: <pregunta gancho>. Fecha de publicación: <día>. Caveman lite.
```

## Pasos (con quién aprueba qué)

| # | Paso | Archivo | Aprueba Leo |
|---|---|---|---|
| 1 | Pregunta gancho + investigación con fuentes (web) | — | — |
| 2 | Guion de 6 a 10 láminas, cada una con papel, tipo de sketch, frases, objeto y nota | `temas/<tema>.md` (copiar la estructura de `temas/marcha-19n.md`) | **sí, antes de dibujar** |
| 3 | Copiar `panorama/marcha.cjs` → `panorama/<tema>.cjs` y cambiar solo lo de la tabla de abajo | `panorama/<tema>.cjs` | — |
| 4 | Render y hoja de contacto; mandar las 10 PNG con SendUserFile | `out/<tema>/` | **sí** |
| 5 | Ajustes por lámina (render parcial: `node <tema>.cjs 3,5`) | — | — |
| 6 | Copy de la publicación | `temas/<tema>-copy.md` (copiar `temas/marcha-19n-copy.md`) | **sí** |
| 7 | Verificaciones pendientes contra fuente primaria; render final sin marca de borrador | — | publica Leo |
| 8 | Commit + push a la rama `carrusel` | — | — |

## Qué se cambia en la copia de `marcha.cjs`

Todo lo demás (aula, zoom, Leo, la clase de tres cabezas, rótulos, colores, filtro a mano) **no se toca**.

| Pieza | Variable | Qué poner |
|---|---|---|
| Carpeta de salida | `OUT` | `out/<tema>` |
| Imagen épica del televisor | `epica` (canvas 160×84, dithering Bayer) | escena pixel del tema; clara, legible a 375 px |
| Rótulo del televisor | `ETQ`, `TIT` | `LUGAR · FECHA` y la pregunta gancho |
| Portada: línea del tablero | `portada` (dos `mtx`) | dato fuerte + «Hoy te cuento…» |
| Objetos de la bandeja | `objetos` (dos `dib(...)` pixel) | dos objetos del tema |
| Objetos por lámina | `PIX` (pixel en código) o sprite (`obj-…`) | uno por lámina, relacionado |
| Láminas 2–10 | arreglo `L` | por lámina: `n`, `k` (tramo de sala), `tipo` (verde), `etq` (gris), `tit` (con `sup(n)`), `leo` (pose), `egg`, `svg` (sketch), `frases` |
| Lámina final | último elemento de `L` | afirmación de cierre resaltada + firma + hoja de fuentes (notas breves Chicago, sin mencionar la descripción) |

Piezas de dibujo ya hechas (en `marcha.cjs` y `carrusel.cjs`): `personita`, `capitolio`, `doc`, `libro`, `eslabon`, `flecha`, `resaltado`, `cifra`, `sube`/`baja`, `mapaCol` + `marca` (mapa de Colombia con indicativos), `txt`, `mtx`, `frase`, `sup`.

Poses de Leo usadas: `leo-habla`, `leo-documento`, `leo-gancho-pregunta` (ver `REG` en `carrusel.cjs` para el resto).

## Comandos

```
cd carrusel/panorama
node <tema>.cjs            # las 10 láminas + out/<tema>/contacto.png
node <tema>.cjs 3,5        # solo esas láminas
FINAL=1 node <tema>.cjs    # sin la marca «PILOTO · BOCETO» (para publicar)
```

Requiere: Chrome (ruta en `K.chrome`), Python con PIL, `topojson-client`, `d3-geo`, `world-atlas`.

## Revisión antes de mandar (checklist)

- [ ] Ningún texto se monta sobre otro (tablas, resaltados, rótulos del mapa).
- [ ] Una sola palabra en amarillo por lámina; rojo solo en números de nota.
- [ ] Sin dos sketches del mismo tipo seguidos.
- [ ] Cada cifra tiene nota; cada nota está en la lámina de fuentes y en el copy.
- [ ] Opiniones atribuidas («según…», «el Gobierno dice…»); cero insultos; ideología nunca nombrada.
- [ ] Fechas revisadas (ej.: el paro del 19N fue en **2020**, no en 2021).
- [ ] Vista a 375 px (la hoja de contacto a 1/3 sirve de aproximación).
- [ ] Texto público = BOCETO hasta que Leo lo apruebe con su voz.

## Errores ya resueltos (no repetir)

- El desplazamiento `DY` de las frases solo debe tocar `position:absolute;left:Npx;top:` (si toca `padding-top` abre huecos).
- Portada: `translateY(170px) scale(2)` con origen `540px 170px`; otro valor deja una franja negra.
- Heredocs largos en Bash fallan: escribir a un archivo y luego copiarlo.
- Rótulos largos se salen: acortar el texto antes de achicar la letra.

## Copy (resumen de `TABLERO.md` §8)

Pregunta o afirmación fuerte con fuente → 4-5 viñetas con lo esencial → afirmación de cierre → «desliza, guarda y comparte» → fuentes completas → 3-4 etiquetas, sin etiquetas de IA.
