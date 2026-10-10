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
          "Imagina una hoja de cálculo diminuta. Cada celda es un píxel y guarda un número. En una imagen de ocho bits en escala de grises, 0 suele representar negro, 255 blanco y los valores intermedios distintos grises.",
          "Cambiar un número cambia una pequeña parte de la imagen. En el laboratorio puedes seleccionar una casilla y modificarla: eso es editar una imagen píxel a píxel.",
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
          "El archivo JPEG o PNG es una forma de guardar y transportar la imagen. Una vez decodificado, el algoritmo trabaja con la matriz o tensor de valores. Distinguir archivo, imagen decodificada y tensor evita muchas confusiones posteriores.",
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
        prompt: "Con la convención (H, W, C) = (Height/alto, Width/ancho, Channels/canales), ¿qué shape tiene una imagen RGB de 640 píxeles de ancho y 480 de alto?",
        options: ["(640, 480)", "(480, 640, 3)", "(3, 640, 480)", "(640, 480, 255)"],
        correctIndex: 1,
        feedback: [
          "Falta indicar que cada píxel tiene tres canales de color.",
          "Correcto: H = 480 filas, W = 640 columnas y C = 3 canales RGB.",
          "Esa disposición es C × W × H, no la convención solicitada H × W × C.",
          "255 puede ser un valor de intensidad, pero no es el número de canales.",
        ],
      },
      {
        id: "brighter-pixel",
        prompt: "En una imagen uint8 en escala de grises, cambias un píxel de 40 a 210. ¿Qué ocurrirá normalmente?",
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
        prompt: "¿Cuál es la forma más habitual de una imagen de grises sin dimensión de canal explícita?",
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
          "La notación gráfica suele escribir (x, y), pero NumPy y OpenCV indexan la matriz como imagen[y, x]. No es una contradicción: una notación habla de coordenadas y la otra de fila y columna.",
        ],
      },
      {
        title: "Dimensión no significa última coordenada",
        paragraphs: [
          "Si una imagen mide 640 × 480 en la convención ancho × alto, W = 640 columnas y H = 480 filas. En NumPy la shape espacial es (H, W) = (480, 640). Como empezamos a contar en cero, la última coordenada válida es x = 639, y = 479.",
          "Este detalle explica muchos errores de tipo off-by-one al recortar regiones o comprobar límites.",
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
          "En un array de NumPy, shape describe las dimensiones y array.size cuenta todos sus elementos: una imagen RGB con shape (H, W, 3) tiene H × W × 3 valores, donde H es Height (alto) y W es Width (ancho). No generalices el nombre size a todas las bibliotecas: en OpenCV también se utiliza para indicar ancho y alto de una imagen.",
          "Una región de interés (ROI) es la zona que decidimos analizar. Puede delimitarse con un rectángulo, un polígono o una máscara. Si la recortas como imagen[y1:y2, x1:x2], los límites superiores y2 y x2 quedan excluidos; al volver a la imagen original debes sumar el desplazamiento (x1, y1) a las coordenadas locales.",
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
        prompt: "Quieres leer el píxel situado en x = 5, y = 2. ¿Qué acceso utilizarías normalmente en NumPy/OpenCV?",
        options: ["imagen[5, 2]", "imagen[2, 5]", "imagen[x + y]", "imagen[5][5]"],
        correctIndex: 1,
        feedback: [
          "Has usado (x, y), pero la matriz espera [fila, columna] = [y, x].",
          "Correcto: y selecciona la fila 2 y x la columna 5.",
          "Sumar coordenadas pierde la posición bidimensional.",
          "Eso seleccionaría fila 5 y columna 5.",
        ],
      },
      {
        id: "last-coordinate",
        prompt: "¿Cuál es el último píxel válido, en coordenadas (x, y), de una imagen con W = 640 (Width/ancho) y H = 480 (Height/alto)?",
        options: ["(640, 480)", "(479, 639)", "(639, 479)", "(638, 478)"],
        correctIndex: 2,
        feedback: [
          "Esos son los tamaños, pero los índices empiezan en cero.",
          "Has colocado primero y y después x; la pregunta expresa la coordenada como (x, y).",
          "Correcto: x llega hasta 639 e y hasta 479.",
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
          "La forma ya proporciona la respuesta directamente; no hay que multiplicar.",
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
          "Un dato float puede representar decimales y un rango enorme, pero cada librería o modelo adopta convenciones. Muchos pipelines convierten la imagen a 0–1; otros trabajan con −1–1 o estandarizan usando media y desviación.",
          "Por eso convertir a float sin escalar y escalar sin conocer el dtype son operaciones distintas. El contrato de entrada del modelo manda.",
        ],
      },
      {
        title: "Convertir puede destruir información",
        paragraphs: [
          "Al pasar de 16 a 8 bits hay que comprimir miles de niveles en solo 256. Varios valores originales terminarán representados por el mismo valor: eso es cuantización y la precisión perdida no se recupera ampliando después.",
          "También debes vigilar el desbordamiento y el recorte. Sumar 20 a un uint8 cercano a 255 puede saturarse o desbordarse según la operación y la librería.",
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
        prompt: "¿Cuántos niveles diferentes puede almacenar un canal de 8 bits?",
        options: ["8", "16", "255", "256"],
        correctIndex: 3,
        feedback: [
          "Ocho es el número de bits, no el número de combinaciones.",
          "Eso corresponde a cuatro bits: 2⁴.",
          "255 es el valor máximo cuando empezamos en cero, pero también existe el valor 0.",
          "Correcto: 2⁸ ofrece 256 niveles, numerados de 0 a 255.",
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
          "Las pantallas mezclan luz. Rojo y verde intensos producen amarillo; los tres canales al máximo producen blanco; los tres a cero producen negro.",
          "Cada canal puede inspeccionarse por separado como una imagen de grises: las zonas claras indican dónde ese componente tiene mayor intensidad.",
        ],
      },
      {
        title: "Alfa no es otro color",
        paragraphs: [
          "RGBA añade un cuarto canal llamado alfa. Suele representar opacidad: cuánto deja ver el píxel lo que hay detrás. No aporta un cuarto color primario.",
          "Una imagen de grises puede aparecer como (H, W) o como (H, W, 1), dependiendo de la herramienta y del contrato esperado. H = Height (alto), W = Width (ancho) y ese 1 es C = Channels (canales) cuando el eje está presente.",
        ],
      },
      {
        title: "La trampa BGR",
        paragraphs: [
          "OpenCV carga habitualmente las imágenes de color en orden BGR, mientras que Pillow, Matplotlib y muchas redes esperan RGB. Las dimensiones siguen siendo correctas, pero rojo y azul aparecen intercambiados.",
          "Antes de culpar al modelo, comprueba siempre orden de canales, dtype y rango. Son tres de los fallos silenciosos más comunes.",
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
        prompt: "¿En qué orden entrega normalmente cv.imread una imagen de color?",
        options: ["RGB", "BGR", "HSV", "CHW"],
        correctIndex: 1,
        feedback: [
          "RGB es habitual en muchas herramientas, pero cv.imread usa BGR por defecto.",
          "Correcto: azul, verde y rojo.",
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
          "Correcto: controla cuánto deja ver el píxel el fondo.",
          "La resolución depende del número de píxeles.",
        ],
      },
      {
        id: "split-red",
        prompt: "Si separas el canal rojo de una imagen con shape (H, W, 3), ¿qué shape tendrá normalmente ese canal?",
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
          "H indica la familia de color; S, lo puro o apagado que está; V, su brillo. Esto facilita muchas reglas basadas en color, aunque HSV no es perceptualmente uniforme y se vuelve inestable cuando la saturación es muy baja.",
          "Los rangos dependen de la implementación. En OpenCV, una imagen HSV uint8 utiliza habitualmente H entre 0 y 179, no entre 0 y 360.",
        ],
      },
      {
        title: "Lab y YCrCb responden a otras necesidades",
        paragraphs: [
          "Lab separa luminosidad L* de dos ejes cromáticos y busca que distancias numéricas se acerquen mejor a diferencias perceptibles. YCrCb separa una componente de luminancia de dos componentes de crominancia, algo útil en vídeo y compresión.",
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
          "Correcto: describimos los colores mediante otros ejes.",
          "Alto y ancho no cambian por convertir el espacio de color.",
          "El brillo se representa de otra manera, pero las sombras siguen existiendo.",
        ],
      },
      {
        id: "opencv-hue",
        prompt: "En la representación HSV uint8 habitual de OpenCV, ¿qué rango utiliza H?",
        options: ["0–1", "0–100", "0–179", "0–65.535"],
        correctIndex: 2,
        feedback: [
          "Ese rango es común para floats normalizados, no para el H uint8 habitual de OpenCV.",
          "No es el rango convencional de OpenCV para H.",
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
          "La resolución digital suele expresarse como ancho × alto (W × H), mientras que NumPy guarda las dimensiones espaciales en la shape (H, W): Height (alto, filas) antes que Width (ancho, columnas). Aumentarla crea más muestras espaciales, pero ampliar una imagen ya capturada no reconstruye automáticamente el detalle que nunca estuvo presente.",
          "El detalle real también depende de óptica, enfoque, movimiento, ruido, distancia y sensor. Dos imágenes 4K pueden contener cantidades de información útil muy diferentes.",
        ],
      },
      {
        title: "Muestreo frente a cuantización",
        paragraphs: [
          "Reducir filas y columnas cambia el muestreo espacial. Reducir bits cambia la cuantización de intensidad. Ambos eliminan información, pero lo hacen en ejes diferentes.",
          "Esta distinción será importante al decidir si un defecto pequeño puede sobrevivir al resize de entrada de un detector.",
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
          "Por eso, al reducir, suele aplicarse antes un filtro paso bajo o anti-aliasing. Suaviza detalle demasiado fino para la nueva rejilla y evita que se convierta en información engañosa.",
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
        options: ["Después de borrar la imagen", "Antes o durante el remuestreo", "Solo al añadir alfa", "Nunca"],
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
          "NumPy y OpenCV suelen representar una imagen de color con shape (H, W, C): Height (alto), Width (ancho), Channels (canales). Muchos modelos de PyTorch reciben (C, H, W). Los valores son los mismos, pero los ejes se reordenan con una permutación; no basta con hacer reshape.",
          "reshape no sustituye a permute: reshape conserva el recorrido lineal de los valores y puede mezclar píxeles con canales si se usa para intercambiar ejes.",
        ],
      },
      {
        title: "N es el lote",
        paragraphs: [
          "Durante entrenamiento e inferencia por lotes se añade un eje N (número de imágenes del batch). (N, C, H, W) significa lote, Channels/canales, Height/alto y Width/ancho. Un lote de 16 imágenes RGB de 224 × 224 tendrá shape (16, 3, 224, 224).",
          "Un único ejemplo también puede necesitar eje de lote: (1, 3, 224, 224). Que N valga uno no significa que el eje deje de existir.",
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
          "La shape es solo una parte. El modelo también espera cierto dtype, rango, orden de color, tamaño y normalización. Si cualquiera difiere del entrenamiento, la imagen puede verse bien para ti y resultar extraña para la red.",
          "Antes de desplegar un modelo, documenta el contrato como si fuera una API: nombre y orden de ejes, tamaño, dtype, rango, espacio de color y normalización.",
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
        prompt: "¿Qué shape NCHW corresponde a 16 imágenes RGB de 224 × 224?",
        options: ["(16, 224, 224, 3)", "(3, 16, 224, 224)", "(16, 3, 224, 224)", "(224, 224, 16, 3)"],
        correctIndex: 2,
        feedback: [
          "Eso es NHWC, con canales al final.",
          "Has colocado los canales antes del lote.",
          "Correcto: N (lote), C (Channels/canales), H (Height/alto) y W (Width/ancho).",
          "Los ejes espaciales no van primero en NCHW.",
        ],
      },
      {
        id: "permute-hwc",
        prompt: "¿Qué permutación conceptual convierte HWC en CHW?",
        options: ["(0, 1, 2)", "(2, 0, 1)", "(1, 2, 0)", "No se puede"],
        correctIndex: 1,
        feedback: [
          "Ese orden no cambia ningún eje.",
          "Correcto: C (Channels/canales) pasa al frente; después quedan H (Height/alto) y W (Width/ancho).",
          "Ese orden produce WCH.",
          "Es una operación habitual y no necesita cambiar los valores.",
        ],
      },
      {
        id: "input-contract",
        prompt: "La shape coincide con la entrada del modelo, pero las predicciones son pésimas. ¿Qué conviene comprobar a continuación?",
        options: ["Solo el nombre del archivo", "Dtype, rango, color y normalización", "El color del botón", "Nada: la shape garantiza compatibilidad"],
        correctIndex: 1,
        feedback: [
          "La extensión o nombre no describe cómo llega el tensor al modelo.",
          "Correcto: son partes esenciales del contrato de entrada.",
          "La interfaz no altera el tensor de inferencia.",
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
