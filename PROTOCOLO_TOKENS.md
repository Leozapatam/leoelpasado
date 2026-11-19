# Protocolo de Ahorro de Tokens y Máxima Calidad · @leoelpasado

Este protocolo define cómo cualquier agente de IA debe operar en este repositorio para **reducir el consumo de tokens entre un 40% y 60% sin sacrificar una sola gota de calidad en los videos, investigaciones o guiones**.

---

## 1. La Regla Madre: Ahorro en el Medio, Cirugía en el Fin

| Área | Política de Tokens | Regla de Calidad |
|---|---|---|
| **Chat y Explicaciones** | Mínimo absoluto (Modo Caveman) | Cero cortesías, respuestas directas en listas y flechas (`->`). |
| **Lectura de Código** | Bajo demanda (progresivo) | No leer `src/` si se está trabajando en guion o audio. |
| **Procesamiento de Datos** | Delegado a scripts locales (Python/Node) | Whisper, DeepFilterNet y ffmpeg corren en máquina local, no en el prompt. |
| **Investigación Histórica** | **Máxima riqueza** | Citas textuales íntegras, fuentes primarias con página, autor y año. |
| **Guion Oral** | **Máxima naturalidad** | Prosa hablada completa, ritmo humano, sin recortes artificiales. |
| **Configuraciones JSON** | **100% completas** | Sin truncamientos tipo `// ... resto aquí`. Validación estricta con `validar.py`. |

---

## 2. Los 4 Mandamientos Anti-Desperdicio de Tokens

### 1. No re-explorar lo que ya está documentado
* La arquitectura visual (`src/marca.ts`) y las reglas de Remotion ya están fijadas. No hace falta que el agente lea los archivos de escenas (`Tablero.tsx`, `Documento.tsx`) para escribir un nuevo episodio.
* Cada nuevo capítulo se define **únicamente** en `episodio.json`.

### 2. Procesamiento local antes de pasar al modelo
* **Audios:** Nunca intentar que el modelo "escuche" o transcriba texto crudo en el prompt si `faster-whisper` (`preparar_voz.py`) puede generar `palabras.json` localmente.
* **Cortes:** El filtrado por energía y silencios se hace con `editar_voz.py` y `cortes.json`.
* **Semáforo:** Antes de renderizar, correr `python scripts/validar.py <slug>`. Si falla, reporta el error exacto en 1 línea.

### 3. Fases estrictas con aprobación humana
Para no gastar tokens construyendo videos que no sirven:
```text
Paso 1: Investigación y Tesis     -> Aprobación de Leo
Paso 2: Guion oral                -> Aprobación de Leo
Paso 3: Audio (edición y anclas)  -> Aprobación de Leo
Paso 4: Storyboard estructurado   -> Aprobación de Leo
Paso 5: Compilación y Render      -> Automático y ciego
```

### 4. Formato de comunicación directa (Caveman Style)
* Reportar: qué se hizo, resultado del comando, siguiente decisión.
* No explicar obviedades ni dar tutoriales no solicitados.
