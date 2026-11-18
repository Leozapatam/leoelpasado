# Diagnóstico del sistema · noviembre 2026

Estado después del Capítulo 0. La meta no es sacar un video rápido. Es calibrar un **método replicable**: cualquier modelo o persona con este repositorio debería producir un episodio de @leoelpasado con la misma calidad, solo con la voz de Leo y un guion aprobado.

---

## Lo que debe permanecer (funciona y es identidad)
1. **La regla «ningún hilo sin fuente»** como columna. Es lo que te diferencia de las cuentas de curiosidades: fuentes en pantalla, citas originales, marca ILUSTRACIÓN o RECREACIÓN cuando corresponde.
2. **La identidad noir de archivo** con un solo acento rojo. Es reconocible en una miniatura.
3. **Tu voz como base de todo.** Primero el guion y la voz, después lo visual. La voz real es lo que da credibilidad.
4. **El flujo por etapas aprobadas:** guion → voz limpia → storyboard en texto → construcción. Gasta tokens solo en lo aprobado.
5. **La entrada con el láser** y el cierre «Profe Leo / @leoelpasado». Son la firma de cada video.
6. **Datos separados del código.** Un episodio es un `episodio.json`, no código nuevo. Por eso es replicable.
7. **Instrucciones para agentes** (`CLAUDE.md`, `AGENTS.md`) y GitHub como fuente de verdad.

## Lo que hay que cambiar o mejorar (por prioridad)

### Alta
1. **Tiempos anclados a palabras.** *Hecho hoy.* Un tiempo puede ser `"@Bloch"` en vez de `23.7`. Si se regraba una parte, todo se acomoda solo. Falta migrar el Capítulo 0 a anclas, al hacer la regrabación.
2. **Duración.** 2:53 está bien para YouTube y Facebook, pero en TikTok y Reels se pierde gente después del primer minuto. Propuesta: cada episodio genera dos cortes, uno **largo** y uno **corto** (60–90 s), marcando en el guion qué bloques entran en el corto.
3. **Del storyboard al `episodio.json`.** Hoy lo traduzco a mano y es lo que más tokens gasta. Propuesta: un storyboard en formato estructurado (bloques con anclas a palabras) que un script convierta en `episodio.json`. Así cualquier modelo lo replica sin «entender» el código.
4. **Un validador** (`python scripts/validar.py <slug>`) que revise antes de renderizar: anclas que existen, hilos con fichas válidas, textos que no se salen de la zona segura, citas con fuente. Atrapa errores sin gastar un render de 10 minutos.

### Media
5. **Ritmo visual.** El tablero domina mucho tiempo seguido. Regla sugerida: un cambio visible cada 2–3 s. Elementos nuevos que ayudarían: **línea de tiempo**, **cita grande a pantalla completa** y **documentos reales** de archivo.
6. **Narrador más expresivo, sin exagerar:** que señale cuando aparece algo importante (ya existe la pose), una pose pensativa para las preguntas y un leve asentimiento en el cierre.
7. **Audio.**
   - Grabar a 15–20 cm del celular.
   - Preset `lark` con supresión de ruido por IA (DeepFilterNet), pendiente de tu aprobación.
   - La música hoy es un solo tema. Conviene que cambie de tonalidad o tempo por episodio, para que no canse.
8. **Fuentes por episodio** (`fuentes.json`): de ahí salen solos la **descripción del post** con referencias, los créditos de imágenes y la lista de verificación de rigor.
9. **Exportar subtítulos** `.srt` para subirlos a cada plataforma (accesibilidad y alcance).

### Baja (cuando el método esté estable)
10. **Un solo comando:** `python leo.py nuevo <slug>`, `leo.py voz`, `leo.py hoja`, `leo.py render`. Menos pasos para recordar.
11. **Una skill de Claude** (`leoelpasado-video`) y su equivalente para otros agentes, empaquetando este flujo.
12. **Portadas automáticas** (miniatura del episodio con el gancho y Profe Leo).
13. **Velocidad de render**, hoy unos 10 minutos para 3 minutos de video. Se puede paralelizar o bajar la calidad en los borradores.

## Riesgos a vigilar
- **Git dentro de Google Drive.** La sincronización de Drive puede corromper la carpeta `.git` si se edita desde dos equipos. Lo más seguro a futuro es trabajar en un clon local (`C:\leoelpasado`) y usar Drive solo para grabaciones y videos terminados.
- **Derechos de imágenes.** Cada imagen real necesita licencia verificada y crédito (`public/imagenes/CREDITOS.md`). Nunca retratos generados de personas reales.
- **Licencia de Remotion.** Es gratis para personas y equipos pequeños; si el proyecto crece y hay empresa, revisar su licencia.

---

## Calibración del Capítulo 0 v3 (lo que aprendimos)

| Problema encontrado | Solución que ya es parte del método |
|---|---|
| Whisper cambia palabras entre corridas («trabaja/trabajó», «Piénsenlo/Piénselo», «ogro/logro») y las anclas se rompen | **Anclas por prefijo** (`"@trabaj*"`), glosario por episodio y `validar.py` antes de cada render |
| Una palabra que se repite («Decía») hizo aparecer el documento antes de tiempo | `validar.py` avisa de palabras repetidas sin `#n` |
| Whisper pequeño a veces oye mal un corte limpio («bobamos») | Verificar fragmentos dudosos con el modelo `medium` antes de tocar el audio |
| El zoom final se alejaba de más | Cámara `"todo"`: encuadra solo lo que hay en el tablero, dentro de la zona libre |
| Hojas de poses reescaladas sin rejilla limpia | Extracción en resolución nativa + limpieza de blancos encerrados, halos y motas (`sprite.py --hoja`) |
| Grabaciones de dos sesiones sonaban distintas | Timbre igualado por octavas (±1 dB) + fundido de 120 ms |

### Evaluación visual (después de esta versión)
**Funciona bien:** la entrada con el láser, el tablero con piezas variadas (fichas, polaroids reales, utilería, etiquetas), los personajes históricos con placa, las fotos de archivo reales con crédito, y el cierre.

**Siguiente nivel, en orden de impacto:**
1. **Profe Leo con más gestos en los momentos clave** (ya hay 16 poses; falta usarlas con más intención, y quizá una pose de «señalar arriba»).
2. **Transiciones entre zonas del tablero** con un leve desenfoque de movimiento, para que el viaje de la cámara se sienta más cinematográfico.
3. **Profundidad:** el narrador y los personajes un poco iluminados por el foco, y el tablero un poco más oscuro detrás de ellos.
4. **Escena podcast** con el micrófono (las poses `mic-*` ya están): para episodios de conversación o preguntas de la comunidad.
5. **Mapas como sorpresa** en un episodio donde el lugar sea protagonista.
