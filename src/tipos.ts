// Formato de un episodio (public/episodios/<slug>/episodio.json). Todos los tiempos en segundos de la voz.

export type Palabra = { w: string; s: number; e: number };

export type Ficha = {
  id: string;
  // "ficha" (por defecto) · "mini" (fichita con «?») · "polaroid" (foto o silueta) · "objeto" (utilería) · "etiqueta" (tira de papel)
  tipo?: "ficha" | "mini" | "polaroid" | "objeto" | "etiqueta";
  revela?: number; // mini: cuándo aparece el «?»
  imagen?: string; // polaroid: archivo en public/ (sin imagen = silueta)
  objeto?: "carta" | "foto" | "expediente" | "papel"; // objeto: qué dibujar
  ilustracion?: boolean; // marca ILUSTRACIÓN (no es un documento real)
  apaisada?: boolean; // polaroid: foto horizontal (usa "ancho")
  sprite?: string; // objeto: dibujo de public/personaje/<sprite>.png en vez del dibujo por código
  x: number; // posición en el tablero (1080 x 1920)
  y: number;
  ancho?: number;
  giro?: number; // grados
  entra: number;
  encabezado?: string;
  cifra?: string;
  texto?: string;
  fuente?: string;
  lupa?: { desde: number; hasta: number; y?: number };
};

export type Escena =
  | { tipo: "tablero"; desde: number; hasta: number }
  | { tipo: "mapa"; desde: number; hasta: number; mapa: MapaDatos }
  | { tipo: "documento"; desde: number; hasta: number; documento: DocumentoDatos }
  | { tipo: "cierre"; desde: number; hasta: number };

export type MapaDatos = {
  camara: { t: number; lon: number; lat: number; span: number }[]; // span = grados de longitud a lo ancho
  paises?: { nombre: string; t: number; estilo?: "tenue" | "rojo" }[];
  etiquetas?: { texto: string; lon: number; lat: number; t: number; hasta?: number; tam?: number }[];
  pines?: { texto: string; lon: number; lat: number; t: number; color?: "rojo" | "papel"; lado?: "izq" | "der" }[];
  zonas?: { texto: string; t: number; puntos: [number, number][]; etiquetaEn?: [number, number] }[];
  rutas?: { t: number; dur?: number; puntos: [number, number][]; texto?: string }[];
};

export type DocumentoDatos = {
  membrete: string;
  lineas: { texto: string; t: number }[]; // cada línea se teclea desde t
  resaltar: { linea: number; desde: string; t: number }; // subrayado rojo desde ese fragmento
  firma?: string;
  aviso: string; // p. ej. "RECREACIÓN · PARÁFRASIS"
  fuente: string;
};

export type Episodio = {
  titulo: string;
  audio: string; // archivo dentro de la carpeta del episodio
  duracion: number;
  gancho: { antetitulo: string; texto: string; desde: number; hasta: number };
  escenas: Escena[];
  tablero: {
    fichas: Ficha[];
    hilos: ([string, string] | [string, string, number])[]; // [desde, hasta, segundo opcional en que se tiende]
    brillo?: number; // segundo en que se iluminan todas las fuentes
    camara: [number, number, number, number][]; // [t, x, y, zoom]
  };
  sellos: { texto: string; t: number; hasta: number; x: number; y: number; giro?: number }[];
  subtitulos: { resaltar: string[] };
  cierre: { titulo: string; subtitulo: string }; // eslogan: "Profe Leo" / "Leo el pasado"
  intro?: { duracion: number };
  // Profe Leo cambia de pose (no mueve la boca): normal, habla, senala, piensa, lupa, documento, libro, brazos, sorpresa, saluda…
  narrador?: { poses: { t: number; pose: string }[] };
  // figuras históricas en pixel art (public/personaje/<sprite>.png), con placa de nombre
  personajes?: { sprite: string; nombre: string; desde: number; hasta: number; x?: number; y?: number; alto?: number }[]; // entrada (Profe Leo señala el marco y la cámara entra); va antes de la voz
  musica: { golpes: number[]; sellos?: number[]; subidas?: number[]; final: number };
};
