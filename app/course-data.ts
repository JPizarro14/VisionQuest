export type LessonQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  feedback: string[];
};

export type LessonSection = {
  title: string;
  paragraphs: string[];
  formula?: {
    label: string;
    value: string;
    parts: string[];
  };
};

export type LessonSource = {
  label: string;
  url: string;
};

export type LessonLabId =
  | "matrix"
  | "coordinates"
  | "bit-depth"
  | "channels"
  | "color-space"
  | "sampling"
  | "tensor"
  | "structures"
  | "broadcasting"
  | "distances"
  | "similarity"
  | "linear-transform"
  | "matrix-properties"
  | "pca"
  | "gradient"
  | "chain-rule"
  | "probability"
  | "statistics"
  | "stability"
  | "pixel-arithmetic"
  | "tone-curve"
  | "masks"
  | "kernel-window"
  | "correlation"
  | "linear-smoothing"
  | "edge-preserving"
  | "sobel"
  | "sharpen"
  | "canny"
  | "frequency"
  | "filter-pipeline"
  | "morph-structuring"
  | "morph-erosion"
  | "morph-dilation"
  | "morph-open-close"
  | "morph-residuals"
  | "morph-grayscale"
  | "connected-components"
  | "histogram-bins"
  | "histogram-color"
  | "histogram-equalization"
  | "clahe"
  | "histogram-pipeline"
  | "geo-affine"
  | "geo-interpolate"
  | "geo-homogeneous"
  | "geo-homography"
  | "geo-camera"
  | "geo-features"
  | "geo-ransac"
  | "geo-flow"
  | "geo-tiles"
  | "geo-shifted-grid"
  | "det-iou"
  | "det-nms"
  | "det-tiles"
  | "seg-mask-iou"
  | "study-simulation";

export type SectorLesson = {
  id: string;
  navTitle: string;
  title: string;
  objective: string;
  lead: string;
  keyIdea: string;
  sections: LessonSection[];
  takeaways: string[];
  questions: LessonQuestion[];
  lab: LessonLabId;
  labTitle: string;
  labInstruction: string;
  sources: LessonSource[];
};

export const sectorOneLessons: SectorLesson[] = [
  {
    id: "01.01",
    navTitle: "Píxeles y matrices",
    title: "Una imagen es una tabla de números",
    objective: "Descubrir qué contiene realmente una imagen antes de pedirle a una red que aprenda de ella.",
    lead: "Para nosotros es una montaña, una cara o una radiografía. Para el ordenador es una cuadrícula de números. Este es el primer ladrillo de toda la visión artificial.",
    keyIdea: "Un píxel tiene una posición —dónde está— y uno o varios valores —qué intensidad o color guarda—.",
    sections: [
      {
        title: "Piensa en una hoja de cálculo",
        paragraphs: [
          "Cada fila y columna de la tabla localizan un píxel. Con grises de 8 bits sin signo, cada celda guarda una intensidad de 0 (negro) a 255 (blanco). Cambiar una celda aclara u oscurece ese píxel; no lo mueve ni cambia el tamaño de la imagen.",
        ],
      },
      {
        title: "El color añade más números, no más magia",
        paragraphs: [
          "Una imagen RGB suele guardar tres valores por píxel: cuánto rojo, cuánto verde y cuánto azul contiene. Puedes imaginar tres hojas de cálculo apiladas, una por cada canal.",
          "En NumPy, la forma habitual de una imagen de color es (H, W, C): H = Height (alto, filas), W = Width (ancho, columnas) y C = Channels (canales). El orden importa: primero filas, luego columnas y por último color.",
        ],
        formula: {
          label: "SHAPE (H, W, C)",
          value: "(480, 640, 3)",
          parts: ["H · Height = 480 filas", "W · Width = 640 columnas", "C · Channels = 3"],
        },
      },
      {
        title: "Lo que recibe el algoritmo",
        paragraphs: [
          "Un JPEG o PNG contiene bytes codificados, no una tabla que se pueda indexar directamente por fila y columna. Al decodificarlo se obtiene la matriz de píxeles; a partir de ella se prepara el tensor que espera el algoritmo.",
        ],
      },
    ],
    takeaways: [
      "Una imagen digital es una estructura numérica.",
      "Cada píxel combina posición y valor.",
      "Una imagen en color puede verse como varias matrices apiladas.",
    ],
    questions: [
      {
        id: "shape-rgb",
        prompt: "Una imagen RGB mide 640 píxeles de ancho y 480 de alto. ¿Qué forma tiene si los ejes se ordenan como (alto, ancho, canales)?",
        options: ["(640, 480)", "(480, 640, 3)", "(3, 640, 480)", "(640, 480, 255)"],
        correctIndex: 1,
        feedback: [
          "Has intercambiado alto y ancho y falta el eje de los tres canales.",
          "Correcto: H = 480 filas, W = 640 columnas y C = 3 canales RGB.",
          "Esa disposición es C × W × H, no la convención solicitada H × W × C.",
          "255 puede ser un valor de intensidad, pero no es el número de canales.",
        ],
      },
      {
        id: "brighter-pixel",
        prompt: "Visualizas una imagen uint8 con 0 negro y 255 blanco. Si cambias un píxel de 40 a 210 sin tocar la escala, ¿qué verás?",
        options: ["Se verá más claro", "Se verá más oscuro", "Cambiará de posición", "La imagen tendrá más resolución"],
        correctIndex: 0,
        feedback: [
          "Correcto: un valor mayor representa una intensidad más cercana al blanco.",
          "Es al revés: dentro de esta convención, 0 es negro y 255 es blanco.",
          "Solo has cambiado su valor, no sus coordenadas.",
          "La resolución depende del número de filas y columnas, no de una intensidad.",
        ],
      },
      {
        id: "gray-shape",
        prompt: "Una matriz de grises tiene H filas y W columnas. Sin eje de canal explícito, ¿cuál es su forma en NumPy?",
        options: ["(H, W)", "(H, W, 3)", "(3, H, W)", "(255, H, W)"],
        correctIndex: 0,
        feedback: [
          "Correcto: (H, W) representa Height (alto, filas) y Width (ancho, columnas); no hay un eje C explícito.",
          "Tres canales es la representación habitual de una imagen RGB.",
          "También describe tres canales, solo que colocados primero.",
          "255 es un posible valor máximo, no una dimensión espacial.",
        ],
      },
    ],
    lab: "matrix",
    labTitle: "Toca un píxel",
    labInstruction: "Selecciona una celda y cambia su intensidad. Estás editando una imagen número a número.",
    sources: [
      { label: "OpenCV · Basic Operations on Images", url: "https://docs.opencv.org/4.x/d3/df2/tutorial_py_basic_ops.html" },
      { label: "scikit-image · Images are NumPy arrays", url: "https://scikit-image.org/skimage-tutorials/lectures/00_images_are_arrays.html" },
    ],
  },
  {
    id: "01.02",
    navTitle: "Forma y coordenadas",
    title: "Dónde vive cada píxel",
    objective: "Leer dimensiones y coordenadas sin intercambiar ancho, alto, fila, columna, x o y.",
    lead: "Muchos errores de visión artificial no vienen de un modelo complicado, sino de haber confundido dos ejes. Vamos a fijar un mapa mental que puedas reutilizar siempre.",
    keyIdea: "En una matriz se accede como [fila, columna], que normalmente equivale a [y, x]. Primero bajas; después te desplazas a la derecha.",
    sections: [
      {
        title: "El origen está arriba a la izquierda",
        paragraphs: [
          "En la representación habitual de una imagen, el píxel (0, 0) está en la esquina superior izquierda. x crece hacia la derecha y y crece hacia abajo.",
          "La notación gráfica suele escribir (x, y), pero NumPy y OpenCV indexan la matriz como imagen[y, x]. Por ejemplo, el píxel (x=5, y=2) se consulta con imagen[2, 5]: fila 2, columna 5. No es una contradicción: una notación habla de coordenadas y la otra de fila y columna.",
        ],
      },
      {
        title: "Dimensión no significa última coordenada",
        paragraphs: [
          "Si una imagen RGB mide 640 × 480 en la convención ancho × alto, W = 640 columnas y H = 480 filas. En NumPy la shape espacial es (H, W) = (480, 640) y la shape completa es (480, 640, 3). Como empezamos a contar en cero, la última coordenada válida (x, y) es (639, 479).",
        ],
        formula: {
          label: "ÚLTIMO PÍXEL VÁLIDO",
          value: "(W − 1, H − 1)",
          parts: ["W · Width → x", "H · Height → y", "origen = (0, 0)"],
        },
      },
      {
        title: "Shape, size y región de interés",
        paragraphs: [
          "Una región de interés (ROI) es la zona elegida para el análisis. En NumPy, imagen[10:30, 40:70] toma las filas 10 a 29 y las columnas 40 a 69: el extremo superior de cada intervalo queda fuera. Si la imagen es RGB, el recorte tiene shape (20, 30, 3) y size = 20 × 30 × 3 = 1800 valores.",
          "El origen del recorte está en (x, y) = (40, 10) de la imagen original. Un punto local (5, 2) pasa a (40 + 5, 10 + 2) = (45, 12); recortar no cambia la escala.",
        ],
      },
    ],
    takeaways: [
      "Coordenada gráfica (x, y) y acceso matricial [y, x] invierten el orden.",
      "Una dimensión W contiene índices desde 0 hasta W − 1.",
      "Una ROI es una zona de interés; el recorte rectangular es solo una forma habitual de representarla.",
    ],
    questions: [
      {
        id: "numpy-coordinate",
        prompt: "En una imagen de NumPy con índices desde cero, x es la columna e y la fila. ¿Cómo lees el píxel (x, y) = (5, 2)?",
        options: ["imagen[5, 2]", "imagen[2, 5]", "imagen[x + y]", "imagen[5][5]"],
        correctIndex: 1,
        feedback: [
          "Has usado (x, y), pero la matriz espera [fila, columna] = [y, x].",
          "Correcto: el primer índice selecciona la fila 2; el segundo, la columna 5.",
          "Sumar coordenadas pierde la posición bidimensional.",
          "Eso seleccionaría fila 5 y columna 5.",
        ],
      },
      {
        id: "last-coordinate",
        prompt: "Una imagen tiene 640 columnas y 480 filas, numeradas desde cero. ¿Qué coordenadas (x, y) tiene el píxel inferior derecho?",
        options: ["(640, 480)", "(479, 639)", "(639, 479)", "(638, 478)"],
        correctIndex: 2,
        feedback: [
          "Esos son los tamaños, pero los índices empiezan en cero.",
          "Has colocado primero y y después x; la pregunta expresa la coordenada como (x, y).",
          "Correcto: empezando en cero, el último índice es el tamaño del eje menos uno.",
          "Has restado dos en vez de uno.",
        ],
      },
      {
        id: "rows-shape",
        prompt: "Una imagen tiene shape (H, W, C) = (480, 640, 3). ¿Cuántas filas contiene?",
        options: ["3", "480", "640", "1.123"],
        correctIndex: 1,
        feedback: [
          "Tres es el número de canales.",
          "Correcto: H = Height (alto) es el primer eje y contiene 480 filas.",
          "640 es el número de columnas.",
          "Sumar alto, ancho y canales da 1123, pero esa suma no cuenta filas.",
        ],
      },
    ],
    lab: "coordinates",
    labTitle: "Localiza y recorta una ROI",
    labInstruction: "Pulsa la cuadrícula: el píxel seleccionado es la esquina de una ROI de 3×3. Compara coordenadas globales y locales.",
    sources: [
      { label: "OpenCV · Operations with images", url: "https://docs.opencv.org/4.x/d5/d98/tutorial_mat_operations.html" },
      { label: "NumPy · Indexing on ndarrays", url: "https://numpy.org/doc/stable/user/basics.indexing.html" },
    ],
  },
  {
    id: "01.03",
    navTitle: "Bits y tipos",
    title: "Cuántos valores caben en un píxel",
    objective: "Entender profundidad de bits, dtype, rango y pérdida de precisión al convertir datos.",
    lead: "El mismo número no siempre significa lo mismo. Antes de operar sobre una imagen necesitas saber qué tipo de dato lo contiene y qué rango utiliza el pipeline.",
    keyIdea: "La profundidad de bits decide cuántos niveles puedes representar; el dtype decide cómo se almacenan e interpretan esos valores.",
    sections: [
      {
        title: "Ocho bits no significan ocho colores",
        paragraphs: [
          "Con ocho bits puedes formar 2⁸ = 256 combinaciones. En un canal uint8 corresponden a los enteros de 0 a 255. Una imagen RGB uint8 dispone de 256 niveles independientes en cada uno de sus tres canales.",
          "Con 16 bits sin signo aparecen 65.536 niveles, de 0 a 65.535. Es útil cuando pequeñas diferencias de señal importan, como en imagen médica o científica.",
        ],
        formula: {
          label: "NIVELES DISPONIBLES",
          value: "2ᵇ",
          parts: ["b = bits", "8 bits → 256", "16 bits → 65.536"],
        },
      },
      {
        title: "Float no trae un rango mágico",
        paragraphs: [
          "Convertir a float32 cambia el tipo, no la escala: una intensidad uint8 de 200 pasa a 200,0. Para llevar el rango 0–255 a [0, 1], divide los valores convertidos por 255; ese píxel pasa a unos 0,784. Otros modelos esperan [−1, 1] o valores estandarizados.",
        ],
      },
      {
        title: "Convertir puede destruir información",
        paragraphs: [
          "Al representar todo el rango de uint16 con uint8, 65.536 niveles se reducen a 256: intensidades antes distinguibles pueden quedar iguales. Volver a 16 bits no las separa.",
          "También cambia el resultado de la aritmética: 250 + 20 vale 270, pero en uint8 se almacena 255 si se satura y 14 si se toma el resto módulo 256. Un cambio de tipo por sí solo no garantiza saturación.",
        ],
      },
    ],
    takeaways: [
      "uint8 dispone de 256 valores: 0–255.",
      "El rango de un float depende de la convención del pipeline.",
      "Reducir profundidad de bits implica pérdida de precisión.",
    ],
    questions: [
      {
        id: "levels-eight-bit",
        prompt: "¿Cuántas intensidades distintas puede codificar un canal entero de 8 bits sin signo (uint8)?",
        options: ["8", "16", "255", "256"],
        correctIndex: 3,
        feedback: [
          "Ocho es el número de bits, no el número de combinaciones.",
          "Eso corresponde a cuatro bits: 2⁴.",
          "255 es el valor máximo cuando empezamos en cero, pero también existe el valor 0.",
          "Correcto: 2⁸ da 256 combinaciones; 255 es el último código, no el número de niveles.",
        ],
      },
      {
        id: "float-range",
        prompt: "Una imagen se ha convertido a float32. ¿Qué rango de intensidad garantiza únicamente ese dato?",
        options: ["Siempre 0–1", "Siempre −1–1", "Siempre 0–255", "Ninguno: hay que conocer la convención"],
        correctIndex: 3,
        feedback: [
          "Es una convención frecuente, pero float32 no la impone.",
          "Algunos modelos usan ese rango, pero no viene garantizado por el dtype.",
          "Podría conservar esos números, pero tampoco es obligatorio.",
          "Correcto: el dtype indica representación numérica; el pipeline define el rango semántico.",
        ],
      },
      {
        id: "sixteen-to-eight",
        prompt: "¿Qué riesgo principal existe al convertir una imagen uint16 a uint8?",
        options: ["Aparecen más canales", "Se pierde precisión", "Se duplican las dimensiones", "La imagen se vuelve vectorial"],
        correctIndex: 1,
        feedback: [
          "Cambiar dtype no crea canales.",
          "Correcto: 65.536 posibles niveles deben reducirse a 256.",
          "La conversión no cambia necesariamente alto ni ancho.",
          "Sigue siendo una imagen rasterizada formada por píxeles.",
        ],
      },
    ],
    lab: "bit-depth",
    labTitle: "Reduce la profundidad",
    labInstruction: "Compara cuántos grises quedan disponibles al trabajar con 1, 2, 4 u 8 bits.",
    sources: [
      { label: "scikit-image · Image data types and ranges", url: "https://scikit-image.org/docs/stable/user_guide/data_types.html" },
      { label: "NumPy · Data types", url: "https://numpy.org/doc/stable/user/basics.types.html" },
    ],
  },
  {
    id: "01.04",
    navTitle: "Canales de color",
    title: "Tres mapas que forman un color",
    objective: "Comprender RGB, escala de grises, alfa y el orden de canales utilizado por distintas librerías.",
    lead: "Una imagen RGB no es una cuadrícula de colores indivisibles: son tres cuadrículas alineadas. Separarlas mentalmente ayuda a entender filtros, normalización y errores de integración.",
    keyIdea: "Un canal es una matriz que almacena una característica por píxel. RGB utiliza tres: rojo, verde y azul.",
    sections: [
      {
        title: "Mezcla aditiva",
        paragraphs: [
          "Las pantallas suman luz: en RGB, rojo y verde al máximo con azul apagado dan amarillo. Los tres al máximo dan blanco; los tres a cero, negro.",
          "Cada canal puede inspeccionarse por separado como una imagen de grises: las zonas claras indican dónde ese componente tiene mayor intensidad.",
        ],
      },
      {
        title: "Alfa no es otro color",
        paragraphs: [
          "En RGBA, RGB describe el color y alfa su opacidad al componerlo sobre un fondo. Con alfa normalizado, 0 deja ver solo el fondo, 1 lo oculta y un valor intermedio mezcla ambos. Alfa cambia la contribución del color, no añade otro primario.",
        ],
      },
      {
        title: "La trampa BGR",
        paragraphs: [
          "OpenCV carga habitualmente las imágenes de color en orden BGR, mientras que Pillow, Matplotlib y muchas redes esperan RGB. Las dimensiones siguen siendo correctas, pero rojo y azul aparecen intercambiados.",
          "Comprueba un píxel que sepas rojo: en BGR uint8 se aproxima a (0, 0, 255), no a (255, 0, 0). Convierte de BGR a RGB si la red lo espera y ajusta por separado el tipo y el rango: intercambiar canales no convierte 0–255 en 0–1.",
        ],
        formula: {
          label: "MISMO PÍXEL, DISTINTO ORDEN",
          value: "RGB(220, 40, 20)",
          parts: ["R = 220", "G = 40", "B = 20"],
        },
      },
    ],
    takeaways: [
      "RGB combina tres matrices alineadas.",
      "Alfa suele describir opacidad, no color.",
      "OpenCV utiliza BGR por defecto al cargar imágenes de color.",
    ],
    questions: [
      {
        id: "opencv-order",
        prompt: "Al leer una foto con cv.imread en el modo de color predeterminado de OpenCV, ¿en qué orden llegan los canales?",
        options: ["RGB", "BGR", "HSV", "CHW"],
        correctIndex: 1,
        feedback: [
          "RGB es habitual en muchas herramientas, pero cv.imread usa BGR por defecto.",
          "Correcto: un píxel leído en BGR guarda azul, verde y rojo, en ese orden.",
          "HSV requiere una conversión explícita.",
          "CHW describe la posición de los ejes, no el significado de los colores.",
        ],
      },
      {
        id: "alpha",
        prompt: "¿Qué suele representar el canal alfa de una imagen RGBA?",
        options: ["La nitidez", "La profundidad", "La opacidad", "La resolución"],
        correctIndex: 2,
        feedback: [
          "La nitidez no se almacena normalmente como canal alfa.",
          "No es un mapa de distancia por definición.",
          "Correcto: alfa controla cuánto contribuye el píxel al componerlo sobre el fondo.",
          "La resolución depende del número de píxeles.",
        ],
      },
      {
        id: "split-red",
        prompt: "Una imagen RGB de NumPy tiene H filas, W columnas y tres canales. ¿Qué forma devuelve imagen[:, :, 0]?",
        options: ["(H, W)", "(H, W, 3)", "(3, H, W)", "(H × 3, W × 3)"],
        correctIndex: 0,
        feedback: [
          "Correcto: queda (H, W), una matriz de Height (alto) por Width (ancho), con la intensidad roja de cada píxel.",
          "Esa sigue siendo la imagen completa con tres canales.",
          "Esa forma también conserva tres canales.",
          "Separar un canal no multiplica la resolución espacial.",
        ],
      },
    ],
    lab: "channels",
    labTitle: "Mezcla luz RGB",
    labInstruction: "Mueve cada canal y observa el color resultante y su tupla numérica.",
    sources: [
      { label: "OpenCV · Splitting and merging channels", url: "https://docs.opencv.org/4.x/d3/df2/tutorial_py_basic_ops.html" },
      { label: "Pillow · Image modes", url: "https://pillow.readthedocs.io/en/stable/handbook/concepts.html#modes" },
    ],
  },
  {
    id: "01.05",
    navTitle: "Espacios de color",
    title: "Distintas formas de describir el mismo color",
    objective: "Elegir entre RGB, HSV, Lab y YCrCb según la propiedad que interese separar.",
    lead: "Cambiar de espacio de color es como expresar la misma ubicación con coordenadas diferentes. No inventa información, pero puede colocar lo importante en un eje más fácil de utilizar.",
    keyIdea: "El mejor espacio de color depende del problema: mostrar, segmentar por tono, comparar color o separar luminancia y crominancia.",
    sections: [
      {
        title: "RGB sirve muy bien para formar la imagen",
        paragraphs: [
          "RGB describe cuánta luz roja, verde y azul hay. Es natural para cámaras y pantallas, pero brillo y color quedan mezclados entre sus tres ejes.",
          "Si buscas un objeto rojo bajo luces distintas, definir tres rangos RGB puede resultar menos intuitivo que trabajar con un eje de tono.",
        ],
      },
      {
        title: "HSV separa tono, saturación y brillo",
        paragraphs: [
          "En HSV, H es el tono, S la saturación y V el valor (el máximo de los componentes RGB). Puedes seleccionar por tono y tolerar cierto cambio de brillo. Cerca del gris, con S baja, pequeñas diferencias entre canales alteran mucho H; con S = 0 no hay tono distinguible.",
          "En la conversión estándar de OpenCV a HSV uint8, H va de 0 a 179: cada paso representa unos dos grados del círculo de tonos. La variante FULL usa otra escala.",
        ],
      },
      {
        title: "Lab y YCrCb responden a otras necesidades",
        paragraphs: [
          "Lab separa la claridad L* de dos ejes cromáticos (a* y b*) para aproximar diferencias perceptibles. YCrCb separa la luma Y de dos diferencias de color, Cr y Cb; así puede codificarse el color a menor resolución que la luma.",
          "Ninguna conversión añade detalle perdido. Solo reorganiza los valores; además, redondeos y rangos finitos pueden introducir pequeñas pérdidas.",
        ],
        formula: {
          label: "PREGUNTA CORRECTA",
          value: "¿Qué quiero separar?",
          parts: ["RGB: emisión", "HSV: tono", "Lab/YCrCb: luminancia"],
        },
      },
    ],
    takeaways: [
      "Un espacio de color es una representación, no información nueva.",
      "HSV facilita reglas centradas en el tono.",
      "Los rangos numéricos cambian entre estándares y librerías.",
    ],
    questions: [
      {
        id: "red-threshold",
        prompt: "Quieres segmentar un objeto por su tono, tolerando ciertos cambios de brillo. ¿Qué espacio suele ofrecer una regla más intuitiva?",
        options: ["HSV", "RGB sin convertir", "RGBA", "Binario"],
        correctIndex: 0,
        feedback: [
          "Correcto: H permite expresar la familia de color separada de buena parte del brillo.",
          "Es posible, pero brillo y color están más mezclados entre los tres canales.",
          "El canal alfa describe opacidad y no resuelve esa separación.",
          "Binarizar exige haber definido antes cómo separar el objeto.",
        ],
      },
      {
        id: "conversion-information",
        prompt: "¿Qué ocurre con la información al convertir correctamente una imagen RGB a HSV?",
        options: ["Se crea detalle nuevo", "Se reorganiza la representación", "Se duplica la resolución", "Desaparecen siempre las sombras"],
        correctIndex: 1,
        feedback: [
          "Una transformación de coordenadas no puede inventar detalle capturado por la cámara.",
          "Correcto: tono, saturación y valor describen el mismo color con otros ejes.",
          "Alto y ancho no cambian por convertir el espacio de color.",
          "El brillo se representa de otra manera, pero las sombras siguen existiendo.",
        ],
      },
      {
        id: "opencv-hue",
        prompt: "En OpenCV, al convertir una imagen uint8 con COLOR_BGR2HSV (no FULL), ¿qué intervalo de enteros representa el tono H?",
        options: ["0–1", "0–100", "0–179", "0–65.535"],
        correctIndex: 2,
        feedback: [
          "Ese rango es común para floats normalizados, no para el H uint8 habitual de OpenCV.",
          "0–100 sugiere un porcentaje; aquí H codifica un ángulo con unos dos grados por nivel.",
          "Correcto: OpenCV comprime los 360 grados en valores enteros de 0 a 179.",
          "Ese es el rango completo de un uint16, no el del tono en esta representación.",
        ],
      },
    ],
    lab: "color-space",
    labTitle: "Traduce un color",
    labInstruction: "Ajusta RGB y observa cómo el mismo color se expresa mediante tono, saturación y valor.",
    sources: [
      { label: "OpenCV · Changing Colorspaces", url: "https://docs.opencv.org/4.x/df/d9d/tutorial_py_colorspaces.html" },
      { label: "OpenCV · Color conversion reference", url: "https://docs.opencv.org/4.x/d8/d01/group__imgproc__color__conversions.html" },
    ],
  },
  {
    id: "01.06",
    navTitle: "Muestreo y resolución",
    title: "Cuántos puntos usamos para mirar",
    objective: "Distinguir resolución, detalle real, muestreo, cuantización y aliasing.",
    lead: "Tener más píxeles significa disponer de más casillas, pero no garantiza que la cámara haya capturado más información útil. Hay que separar el recipiente de lo que realmente contiene.",
    keyIdea: "El muestreo decide dónde medimos; la cuantización decide con cuántos valores representamos cada medida.",
    sections: [
      {
        title: "Resolución espacial",
        paragraphs: [
          "Ampliar interpola más píxeles a partir de los ya medidos: no equivale a captar más detalle. Si dos líneas se fundieron por desenfoque durante la captura, aumentar el ancho y el alto no vuelve a separarlas. También influyen la óptica, el movimiento, el ruido y el sensor.",
        ],
      },
      {
        title: "Muestreo frente a cuantización",
        paragraphs: [
          "Reducir filas y columnas deja menos muestras espaciales: una grieta estrecha puede desaparecer. Reducir la profundidad de bits mantiene la rejilla, pero deja menos niveles de intensidad: dos grises próximos pueden acabar con el mismo código.",
        ],
        formula: {
          label: "DOS PREGUNTAS DISTINTAS",
          value: "¿Dónde?  /  ¿Con qué precisión?",
          parts: ["muestreo: posición", "cuantización: valor", "ambos limitan información"],
        },
      },
      {
        title: "Aliasing: aparecen patrones que no estaban",
        paragraphs: [
          "Si reduces una textura fina sin filtrar, varias estructuras diferentes pueden producir las mismas muestras. El resultado puede mostrar dientes, parpadeos o patrones moiré falsos.",
          "Por eso se atenúan las frecuencias demasiado altas para la nueva rejilla con un filtro de paso bajo antes o durante la reducción. Una vez que el patrón falso está en las muestras, suavizar después no permite distinguirlo del detalle real.",
        ],
      },
    ],
    takeaways: [
      "Más píxeles no garantizan más detalle real.",
      "Muestreo afecta posiciones; cuantización afecta valores.",
      "El anti-aliasing evita patrones falsos al reducir.",
    ],
    questions: [
      {
        id: "aliasing",
        prompt: "¿Qué describe mejor el aliasing espacial?",
        options: ["Más contraste real", "Patrones falsos por muestreo insuficiente", "Un cuarto canal", "Una mejora de enfoque"],
        correctIndex: 1,
        feedback: [
          "El contraste puede cambiar visualmente, pero no define el fenómeno.",
          "Correcto: la nueva rejilla confunde estructuras demasiado finas y crea artefactos.",
          "No guarda relación con el número de canales.",
          "El aliasing degrada o falsea la señal; no recupera enfoque.",
        ],
      },
      {
        id: "downsample-filter",
        prompt: "¿Cuándo suele aplicarse un filtro anti-aliasing al reducir una imagen?",
        options: ["Solo después de diezmar la imagen", "Antes o durante el remuestreo", "Solo al añadir alfa", "Nunca"],
        correctIndex: 1,
        feedback: [
          "Una vez eliminadas las muestras ya no puedes impedir el aliasing original.",
          "Correcto: se limita el detalle que la nueva rejilla no puede representar.",
          "La transparencia no determina el muestreo espacial.",
          "Es especialmente importante cuando existe contenido de alta frecuencia.",
        ],
      },
      {
        id: "resolution-detail",
        prompt: "Amplías una foto borrosa de 640 × 480 a 4K. ¿Qué afirmación es correcta?",
        options: ["Ahora contiene necesariamente detalle 4K real", "La red neuronal se entrena sola", "Tiene más píxeles, pero no garantiza detalle nuevo", "El ruido desaparece"],
        correctIndex: 2,
        feedback: [
          "La interpolación crea muestras, no garantiza recuperar información que nunca se capturó.",
          "Cambiar el tamaño no ejecuta un entrenamiento.",
          "Correcto: el recipiente crece, pero el contenido informativo puede seguir siendo el mismo.",
          "El proceso puede incluso hacer el ruido más visible.",
        ],
      },
    ],
    lab: "sampling",
    labTitle: "Reduce una rejilla",
    labInstruction: "Cambia la densidad de muestreo y activa el suavizado para ver cómo responde un patrón fino.",
    sources: [
      { label: "scikit-image · Transform and resize", url: "https://scikit-image.org/docs/stable/api/skimage.transform.html" },
      { label: "OpenCV · Geometric image transformations", url: "https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html" },
    ],
  },
  {
    id: "01.07",
    navTitle: "Tensores y lotes",
    title: "Cómo viaja una imagen hasta el modelo",
    objective: "Interpretar (H, W, C), (C, H, W), (N, C, H, W) y (N, H, W, C), y detectar contratos de entrada incompatibles.",
    lead: "La imagen ya es numérica; ahora hay que empaquetarla en el orden exacto que espera el modelo. Una forma correcta con los ejes equivocados puede producir resultados absurdos sin lanzar ningún error.",
    keyIdea: "En (H, W, C), H es Height (alto), W es Width (ancho) y C es Channels (canales). N añade el número de imágenes del lote.",
    sections: [
      {
        title: "De HWC a CHW",
        paragraphs: [
          "En una imagen ordenada por alto, ancho y canal, el valor de entrada [y, x, c] debe pasar a la posición [c, y, x]. En NumPy lo hace imagen.transpose(2, 0, 1); en PyTorch, tensor.permute(2, 0, 1).",
          "reshape cambia cómo se agrupa la secuencia de valores; no intercambia los índices de cada elemento. Puede dar las dimensiones pedidas y, aun así, colocar un valor en el canal equivocado.",
        ],
      },
      {
        title: "N es el lote",
        paragraphs: [
          "N es el número de ejemplos del lote. En orden (N, C, H, W) —lote, canales, alto y ancho—, 16 imágenes RGB de 224×224 forman (16, 3, 224, 224). Si el modelo exige cuatro ejes también en inferencia, una sola imagen entra como (1, 3, 224, 224): cambia la longitud del eje, no su existencia.",
        ],
        formula: {
          label: "ENTRADA HABITUAL EN PYTORCH",
          value: "(N, C, H, W)",
          parts: ["N · lote", "C · Channels (canales)", "H · Height / W · Width"],
        },
      },
      {
        title: "El contrato completo de entrada",
        paragraphs: [
          "Compara el tensor justo antes de la red con lo usado al entrenarla: inspecciona el tipo de dato, el mínimo y el máximo por canal y un píxel de color conocido. RGB y BGR tienen la misma forma, igual que los datos en 0–1 y en 0–255. Comprueba también que se aplicaron las mismas medias y desviaciones, en el orden de canales correcto y una sola vez.",
        ],
      },
    ],
    takeaways: [
      "(H, W, C) y (C, H, W) contienen los mismos ejes espaciales y de canal en distinto orden.",
      "N añade el lote de ejemplos.",
      "Shape, dtype, rango, color y normalización forman el contrato de entrada.",
    ],
    questions: [
      {
        id: "batch-shape",
        prompt: "Una red espera el orden NCHW (lote, canales, alto, ancho). ¿Qué forma corresponde a 16 imágenes RGB de 224 × 224?",
        options: ["(16, 224, 224, 3)", "(3, 16, 224, 224)", "(16, 3, 224, 224)", "(224, 224, 16, 3)"],
        correctIndex: 2,
        feedback: [
          "Eso es NHWC, con canales al final.",
          "Has colocado los canales antes del lote.",
          "Correcto: hay 16 ejemplos, 3 canales por ejemplo y 224 posiciones en cada eje espacial.",
          "Los ejes espaciales no van primero en NCHW.",
        ],
      },
      {
        id: "permute-hwc",
        prompt: "Los ejes de una imagen son alto (eje 0), ancho (1) y canal (2). ¿Qué orden de ejes pasas a transpose para poner primero los canales sin mezclar píxeles?",
        options: ["(0, 1, 2)", "(2, 0, 1)", "(1, 2, 0)", "No se puede"],
        correctIndex: 1,
        feedback: [
          "Ese orden no cambia ningún eje.",
          "Correcto: C (Channels/canales) pasa al frente; después quedan H (Height/alto) y W (Width/ancho).",
          "Ese orden pondría primero el ancho, luego los canales y por último el alto.",
          "Es una operación habitual y no necesita cambiar los valores.",
        ],
      },
      {
        id: "input-contract",
        prompt: "La shape coincide con la entrada del modelo, pero las predicciones son pésimas. ¿Qué conviene comprobar a continuación?",
        options: ["Solo el nombre del archivo", "Dtype, rango, color y normalización", "Solo el número total de píxeles", "Nada: la shape garantiza compatibilidad"],
        correctIndex: 1,
        feedback: [
          "La extensión o nombre no describe cómo llega el tensor al modelo.",
          "Correcto: compara con el entrenamiento; RGB y BGR, por ejemplo, tienen la misma forma.",
          "El número de píxeles no revela un intercambio de canales ni un rango incorrecto.",
          "Una shape correcta no detecta canales intercambiados ni escalas erróneas.",
        ],
      },
    ],
    lab: "tensor",
    labTitle: "Ordena los ejes",
    labInstruction: "Cambia la disposición y el tamaño del lote para leer la shape como un contrato.",
    sources: [
      { label: "PyTorch · Channels Last Memory Format", url: "https://docs.pytorch.org/tutorials/intermediate/memory_format_tutorial.html" },
      { label: "ExecuTorch · Working with CV models", url: "https://docs.pytorch.org/executorch/stable/working-with-cv-models.html" },
    ],
  },
];
