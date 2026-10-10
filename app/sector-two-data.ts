import type { SectorLesson } from "@/app/course-data";

export const sectorTwoLessons: SectorLesson[] = [
  {
    id: "02.01",
    navTitle: "Escalares y vectores",
    title: "De un número a un tensor",
    objective: "Distinguir escalar, vector, matriz y tensor, y entender qué representa cada eje.",
    lead: "En visión artificial casi todo acaba convertido en colecciones de números. La diferencia no está solo en cuántos hay, sino en cómo están organizados y qué significa cada posición.",
    keyIdea: "Escalar, vector, matriz y tensor forman una escalera: 0, 1, 2 o más ejes para organizar valores.",
    sections: [
      {
        title: "Cuatro recipientes numéricos",
        paragraphs: [
          "Un escalar es un solo valor, como la temperatura 21,4. Un vector es una lista ordenada, como RGB = (120, 80, 30). Una matriz organiza valores en filas y columnas. En machine learning llamamos tensor a un array con cualquier número de ejes.",
          "En matemáticas puras, tensor tiene una definición más precisa relacionada con transformaciones entre espacios. En el trabajo diario con PyTorch o NumPy suele usarse para hablar de un array n-dimensional.",
        ],
        formula: {
          label: "NÚMERO DE EJES",
          value: "0 → 1 → 2 → N",
          parts: ["escalar", "vector", "matriz / tensor"],
        },
      },
      {
        title: "Un vector puede describir una imagen",
        paragraphs: [
          "Las coordenadas de una caja, cuatro intensidades, las probabilidades de varias clases o un embedding de 768 características son vectores. El significado depende del contrato, no de la forma por sí sola.",
          "Dos vectores con la misma longitud pueden representar cosas incompatibles. (x, y, ancho, alto) y (rojo, verde, azul, alfa) tienen cuatro componentes, pero no se deben operar como si hablaran el mismo idioma.",
        ],
      },
      {
        title: "La shape es la gramática",
        paragraphs: [
          "La shape indica cuántos valores hay en cada eje. Una tabla de 32 embeddings de 128 características tiene shape (32, 128): 32 ejemplos, cada uno descrito mediante 128 números.",
          "Nombrar los ejes evita errores silenciosos. Antes de una operación, acostúmbrate a decir en voz alta qué significa cada dimensión.",
        ],
      },
    ],
    takeaways: [
      "La dimensionalidad describe el número de ejes, no la cantidad total de valores.",
      "Una shape no explica por sí sola la semántica de sus ejes.",
      "Un embedding es un vector de características aprendido por un modelo.",
    ],
    questions: [
      {
        id: "s2-rgb-structure",
        prompt: "¿Qué estructura describe mejor un único píxel RGB = (20, 80, 140)?",
        options: ["Un escalar", "Un vector de tres componentes", "Una matriz 3 × 3", "Un lote"],
        correctIndex: 1,
        feedback: [
          "Un escalar solo contendría un valor.",
          "Correcto: es una lista ordenada con tres componentes.",
          "No hay nueve valores ni dos ejes de tamaño tres.",
          "Un lote agrupa varios ejemplos; aquí solo describimos un píxel.",
        ],
      },
      {
        id: "s2-embedding-shape",
        prompt: "Guardas 32 embeddings, cada uno con 128 características. ¿Qué shape es la más natural?",
        options: ["(128)", "(32, 128)", "(32, 128, 3)", "(4.096, 32)"],
        correctIndex: 1,
        feedback: [
          "Eso solo describe un embedding.",
          "Correcto: primer eje para ejemplos y segundo para características.",
          "No existe un eje de color implícito en un embedding.",
          "4.096 es el total de valores, pero esa shape no conserva la organización indicada.",
        ],
      },
      {
        id: "s2-same-shape",
        prompt: "Dos vectores tienen shape (4,). ¿Significa que sus componentes representan necesariamente lo mismo?",
        options: ["Sí, siempre", "Solo si son float", "No: también hay que conocer su significado", "Sí, si tienen el mismo dtype"],
        correctIndex: 2,
        feedback: [
          "La misma longitud no garantiza la misma semántica.",
          "El dtype no dice si son coordenadas, colores u otra cosa.",
          "Correcto: shape y significado forman juntos el contrato.",
          "El mismo tipo numérico tampoco define qué mide cada posición.",
        ],
      },
    ],
    lab: "structures",
    labTitle: "Cambia de recipiente",
    labInstruction: "Elige una estructura y observa cómo cambian sus ejes, su shape y el número total de valores.",
    sources: [
      { label: "NumPy · The absolute basics", url: "https://numpy.org/doc/stable/user/absolute_beginners.html" },
      { label: "Deep Learning · Linear Algebra", url: "https://www.deeplearningbook.org/contents/linear_algebra.html" },
    ],
  },
  {
    id: "02.02",
    navTitle: "Operaciones y broadcasting",
    title: "Operar sin mezclar los ejes",
    objective: "Diferenciar operaciones elemento a elemento, reducciones y broadcasting, anticipando la shape resultante.",
    lead: "Una operación puede producir números perfectamente válidos y aun así estar mal planteada. El hábito clave es predecir qué ejes se combinan, cuáles permanecen y cuáles desaparecen.",
    keyIdea: "NumPy opera sobre arrays; broadcasting permite combinar shapes diferentes cuando sus dimensiones son compatibles desde la derecha.",
    sections: [
      {
        title: "NumPy: la base numérica de las imágenes",
        paragraphs: [
          "NumPy (Numerical Python) es una biblioteca de Python para trabajar con arrays multidimensionales y hacer cálculos eficientes. Es una herramienta fundamental en Computer Vision: una imagen decodificada suele representarse mediante un array de NumPy, llamado ndarray.",
          "Un array almacena valores organizados en una o más dimensiones. Su propiedad shape nos dice cuántos elementos tiene cada dimensión; ndim indica el número de dimensiones, dtype el tipo de dato y size el total de elementos. Por ejemplo, np.array([[10, 20, 30], [40, 50, 60]]) tiene shape (2, 3): dos filas y tres columnas.",
        ],
        formula: {
          label: "SHAPE DE UNA IMAGEN RGB",
          value: "(H, W, C)",
          parts: ["H = Height / alto (filas)", "W = Width / ancho (columnas)", "C = Channels / canales"],
        },
      },
      {
        title: "Vector, matriz y tupla: no son lo mismo",
        paragraphs: [
          "Un vector NumPy con tres valores tiene shape (3,): es un array de una dimensión. No tiene una fila y tres columnas ni tres filas y una columna; esas son matrices de shapes (1, 3) y (3, 1), respectivamente. En una matriz de dos dimensiones sí interpretamos el shape como (filas, columnas).",
          "La coma de (3,) no es un error: shape devuelve una tupla de Python. Una tupla es una colección ordenada e inmutable; (3) sería solo el número 3 entre paréntesis, mientras que (3,) es una tupla con un elemento. A diferencia de la tupla, el ndarray de NumPy está optimizado para operaciones numéricas y suele ser mutable y homogéneo.",
          "En Computer Vision conviene memorizar H = Height (alto o filas), W = Width (ancho o columnas), C = Channels (canales). Una imagen RGB de 1920 píxeles de ancho y 1080 de alto suele tener shape (1080, 1920, 3) = (H, W, C). Una imagen de grises normalmente tiene shape (H, W).",
        ],
        formula: {
          label: "UNA DIMENSIÓN FRENTE A DOS",
          value: "(3,) ≠ (1, 3) ≠ (3, 1)",
          parts: ["vector de 3 elementos", "1 fila y 3 columnas", "3 filas y 1 columna"],
        },
      },
      {
        title: "Operaciones vectorizadas y producto matricial",
        paragraphs: [
          "NumPy permite operar con un array completo sin escribir un bucle por cada elemento. Por ejemplo, para A = [[10, 20], [30, 40]], A + 5 devuelve [[15, 25], [35, 45]]. Se puede sumar, restar, multiplicar, dividir o comparar; broadcasting no se limita a la suma.",
          "No confundas operadores: A * B multiplica elemento a elemento, usando broadcasting si hace falta y es compatible. A @ B realiza producto matricial (filas por columnas) y sigue reglas distintas; para dos matrices 2D, el número de columnas de A debe coincidir con el número de filas de B.",
          "Operación vectorizada significa operar sobre arrays sin escribir bucles explícitos; broadcasting es el mecanismo adicional que permite combinar shapes diferentes cuando son compatibles.",
        ],
      },
      {
        title: "Broadcasting: aplicar un vector a cada fila",
        paragraphs: [
          "Imagina A = [[10, 20, 30], [40, 50, 60]] con shape (2, 3) y B = [1, 2, 3] con shape (3,). Al calcular A + B, el resultado es [[11, 22, 33], [41, 52, 63]]. NumPy aplica el mismo vector B a las dos filas, sin que tengas que copiarlo manualmente.",
          "Eso es broadcasting: permite operaciones elemento a elemento entre arrays con shapes diferentes pero compatibles. Es como repetir una plantilla pequeña sobre la grande, aunque NumPy normalmente evita crear físicamente esas copias.",
        ],
        formula: {
          label: "UN VECTOR SE APLICA A CADA FILA",
          value: "(2, 3) + (3,) → (2, 3)",
          parts: ["[10, 20, 30] + [1, 2, 3]", "[40, 50, 60] + [1, 2, 3]", "resultado: [[11, 22, 33], [41, 52, 63]]"],
        },
      },
      {
        title: "Regla de compatibilidad: empezar por la derecha",
        paragraphs: [
          "Compara los shapes desde su última dimensión (derecha hacia izquierda). Cada pareja de ejes es compatible si sus tamaños coinciden o si uno de ellos mide 1. Si un array tiene menos dimensiones, imagina unos a la izquierda: (4,) se alinea como (1, 4) frente a (3, 4), aunque su shape original sigue siendo (4,).",
          "Por eso (3, 4) + (4,) funciona: se compara (3, 4) con (1, 4), y los dos ejes son compatibles. En cambio, (3, 4) + (3,) falla: se compara (3, 4) con (1, 3); los tamaños finales 4 y 3 no coinciden y ninguno vale 1.",
          "Si quieres sumar un valor distinto a cada una de las tres filas de una matriz (3, 4), utiliza un array (3, 1), por ejemplo [[10], [20], [30]]. Se aplicará cada valor a las cuatro columnas de su fila.",
        ],
        formula: {
          label: "COMPARACIÓN DE SHAPES",
          value: "(3, 4) + (1, 4) ✓",
          parts: ["(3, 4) + (4,) ✓", "(3, 4) + (3,) ✗", "(3, 4) + (3, 1) ✓"],
        },
      },
      {
        title: "Aplicación real: modificar canales RGB",
        paragraphs: [
          "Una imagen RGB suele tener shape (H, W, C), con H = Height (alto), W = Width (ancho) y C = Channels (canales); en RGB, C = 3 (Red, Green, Blue). Si sumamos el vector [20, 10, 0] de shape (3,), aumentamos conceptualmente 20 el rojo y 10 el verde de cada píxel, sin cambiar el azul.",
          "NumPy alinea (H, W, 3) con (1, 1, 3). El vector se aplica a todos los H × W píxeles y el resultado mantiene shape (H, W, 3). En código: ajuste = np.array([20, 10, 0]); resultado = imagen + ajuste.",
          "Cuidado: las imágenes uint8 almacenan valores de 0 a 255. Para evitar desbordamientos, convierte primero a un tipo entero más amplio, suma, limita con np.clip(resultado, 0, 255) y después vuelve a uint8. Además, OpenCV suele cargar imágenes en orden BGR, no RGB: el orden de canales del ajuste debe corresponderse con el de la imagen.",
        ],
        formula: {
          label: "BROADCASTING EN COMPUTER VISION",
          value: "(H, W, 3) + (3,)",
          parts: ["H = Height / alto", "W = Width / ancho", "C = Channels / canales RGB"],
        },
      },
      {
        title: "Reducir significa resumir",
        paragraphs: [
          "mean, sum, max o argmax condensan valores a lo largo de uno o varios ejes. Si promedias H (Height/alto) y W (Width/ancho) en un tensor (H, W, C), queda un vector de C valores, uno por canal (Channels).",
          "Con keepdims puedes conservar ejes de tamaño 1. Esto facilita aplicar después broadcasting sin perder la posición semántica de cada dimensión.",
        ],
      },
    ],
    takeaways: [
      "En NumPy, * suele ser elemento a elemento y @ producto matricial.",
      "Broadcasting compara shapes desde la derecha: tamaños iguales o uno igual a 1.",
      "H = Height (alto), W = Width (ancho), C = Channels (canales): una imagen RGB suele tener shape (H, W, 3).",
      "Un vector (3,) no es una matriz (1, 3): la coma indica una tupla de un elemento.",
      "Una reducción debe indicar qué eje se está resumiendo.",
    ],
    questions: [
      {
        id: "s2-broadcast-rgb",
        prompt: "¿Es compatible la suma entre una imagen (480, 640, 3) y un vector (3,)?",
        options: ["No, nunca", "Sí: el vector se aplica a cada píxel", "Solo si la imagen es cuadrada", "Solo después de aplanarla"],
        correctIndex: 1,
        feedback: [
          "El último eje coincide exactamente.",
          "Correcto: cada componente del vector corresponde a un canal.",
          "Alto y ancho no necesitan ser iguales.",
          "Aplanar eliminaría la organización espacial y no hace falta.",
        ],
      },
      {
        id: "s2-broadcast-invalid",
        prompt: "¿Qué ocurre normalmente al sumar arrays con shapes (2, 3) y (3, 2)?",
        options: ["Resultado (2, 2)", "Resultado (3, 3)", "Error por shapes incompatibles", "Se transpone uno automáticamente"],
        correctIndex: 2,
        feedback: [
          "La suma elemento a elemento no recorta ejes.",
          "Tampoco amplía ambos arrays a un cuadrado.",
          "Correcto: 3 frente a 2 y 2 frente a 3 no cumplen las reglas.",
          "NumPy no adivina que querías una transposición.",
        ],
      },
      {
        id: "s2-reduce-spatial",
        prompt: "Promedias los ejes H y W de una imagen H × W × C. Sin keepdims, ¿qué queda?",
        options: ["Un vector de C valores", "Una imagen H × W", "Un escalar siempre", "Un tensor C × H × W"],
        correctIndex: 0,
        feedback: [
          "Correcto: queda la media de cada canal.",
          "Esos son precisamente los ejes que se han reducido.",
          "Solo sería escalar si también redujeras C.",
          "Una reducción no reordena los ejes restantes.",
        ],
      },
    ],
    lab: "broadcasting",
    labTitle: "Haz coincidir las shapes",
    labInstruction: "Prueba distintas parejas de shapes y observa qué ejes se alinean y cuál sería el resultado.",
    sources: [
      { label: "NumPy · Broadcasting", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html" },
      { label: "NumPy · Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" },
    ],
  },
  {
    id: "02.03",
    navTitle: "Normas y distancias",
    title: "Cómo medir cuánto se parecen dos puntos",
    objective: "Interpretar normas L1, L2 y L∞ y elegir una distancia consciente de la escala y del problema.",
    lead: "Cuando un modelo dice que dos imágenes están cerca, necesita una definición matemática de cerca. Cambiar esa regla cambia qué errores o diferencias pesan más.",
    keyIdea: "Una norma mide el tamaño de un vector; una distancia mide el tamaño de la diferencia entre dos vectores.",
    sections: [
      {
        title: "Tres maneras de medir un desplazamiento",
        paragraphs: [
          "L1 suma valores absolutos: como caminar por calles en cuadrícula. L2 calcula la distancia recta usando cuadrados y raíz. L∞ se queda con la mayor diferencia individual.",
          "Entre a = (1, 2) y b = (4, 6), la diferencia es (3, 4): L1 vale 7, L2 vale 5 y L∞ vale 4.",
        ],
        formula: {
          label: "DISTANCIA EUCLÍDEA",
          value: "‖a − b‖₂",
          parts: ["restar", "elevar al cuadrado", "sumar y raíz"],
        },
      },
      {
        title: "La escala puede secuestrar la distancia",
        paragraphs: [
          "Si una característica varía entre 0 y 1 y otra entre 0 y 100.000, la segunda dominará muchas distancias. No significa que sea más importante: solo está expresada con números mayores.",
          "Por eso normalización, unidades y ponderaciones forman parte de la definición del problema.",
        ],
      },
      {
        title: "Dónde aparece en Computer Vision",
        paragraphs: [
          "Las distancias comparan embeddings, asocian detecciones entre fotogramas, miden errores de coordenadas y ayudan a recuperar imágenes similares.",
          "No existe una distancia universalmente mejor. L2 castiga con más fuerza diferencias grandes; L1 suele responder de forma menos extrema ante valores alejados. La decisión depende de qué error quieras penalizar.",
        ],
      },
    ],
    takeaways: [
      "La distancia entre a y b es una norma aplicada a a − b.",
      "L1, L2 y L∞ valoran de forma distinta las discrepancias.",
      "Comparar sin revisar escalas puede producir una similitud engañosa.",
    ],
    questions: [
      {
        id: "s2-l2-345",
        prompt: "¿Cuál es la distancia L2 entre (1, 2) y (4, 6)?",
        options: ["3", "4", "5", "7"],
        correctIndex: 2,
        feedback: [
          "Solo has tomado la diferencia del primer eje.",
          "Ese es el máximo cambio individual, es decir, L∞.",
          "Correcto: √(3² + 4²) = 5.",
          "Siete es la distancia L1: |3| + |4|.",
        ],
      },
      {
        id: "s2-l1-345",
        prompt: "Con los mismos puntos, ¿cuánto vale la distancia L1?",
        options: ["5", "7", "12", "25"],
        correctIndex: 1,
        feedback: [
          "Cinco corresponde a L2.",
          "Correcto: |4 − 1| + |6 − 2| = 3 + 4.",
          "Has sumado las coordenadas originales.",
          "Es la suma de cuadrados antes de aplicar la raíz de L2.",
        ],
      },
      {
        id: "s2-distance-scale",
        prompt: "Una característica usa metros y otra milímetros con valores mucho mayores. ¿Qué debes revisar antes de aplicar L2?",
        options: ["La escala y las unidades", "El nombre del fichero", "El orden RGB/BGR únicamente", "Nada: L2 corrige escalas sola"],
        correctIndex: 0,
        feedback: [
          "Correcto: los números grandes pueden dominar por su unidad, no por su relevancia.",
          "No afecta a la geometría del espacio de características.",
          "Eso importa para imágenes, pero no resuelve esta diferencia de magnitudes.",
          "L2 utiliza directamente los valores que recibe.",
        ],
      },
    ],
    lab: "distances",
    labTitle: "Mide dos puntos",
    labInstruction: "Mueve un punto por el plano y compara cómo responden L1, L2 y L∞.",
    sources: [
      { label: "NumPy · linalg.norm", url: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html" },
      { label: "PyTorch · torch.dist", url: "https://docs.pytorch.org/docs/stable/generated/torch.dist.html" },
    ],
  },
  {
    id: "02.04",
    navTitle: "Producto escalar y coseno",
    title: "Medir alineación, no solo distancia",
    objective: "Comprender producto escalar, ángulo y similitud coseno, incluyendo sus límites.",
    lead: "Dos vectores pueden apuntar hacia la misma dirección aunque uno sea mucho más largo. A veces importa la magnitud; otras, el patrón relativo. El producto escalar y el coseno permiten separar esas ideas.",
    keyIdea: "El producto escalar mezcla alineación y magnitud; la similitud coseno normaliza las longitudes y se centra en el ángulo.",
    sections: [
      {
        title: "Multiplicar parejas y sumar",
        paragraphs: [
          "El producto escalar de (a₁, a₂, …) y (b₁, b₂, …) es a₁b₁ + a₂b₂ + … Para (1, 2) y (3, 4) obtenemos 1×3 + 2×4 = 11.",
          "Geométricamente también equivale a ‖a‖ ‖b‖ cos(θ). Será positivo si apuntan de forma parecida, cero si son perpendiculares y negativo si se oponen, salvo casos degenerados.",
        ],
      },
      {
        title: "Coseno: quitar el efecto de la longitud",
        paragraphs: [
          "La similitud coseno divide el producto escalar entre las normas L2. Dos vectores no nulos en la misma dirección tienen coseno 1 aunque uno sea diez veces mayor.",
          "El vector cero no tiene dirección, así que la fórmula pura no está definida. Las librerías suelen introducir un epsilon para evitar dividir entre cero; debes conocer esa convención.",
        ],
        formula: {
          label: "SIMILITUD COSENO",
          value: "(a · b) / (‖a‖₂ ‖b‖₂)",
          parts: ["1: misma dirección", "0: ortogonales", "−1: opuestos"],
        },
      },
      {
        title: "Parches, embeddings y atención",
        paragraphs: [
          "Una neurona lineal calcula productos escalares entre datos y pesos. Una convolución aplica una idea parecida localmente entre el kernel y cada parche. La atención también construye afinidades a partir de productos entre consultas y claves.",
          "En búsqueda por embeddings, el coseno es útil cuando interesa la dirección semántica más que el tamaño. No lo elijas por costumbre: a veces la norma del embedding contiene información útil.",
        ],
      },
    ],
    takeaways: [
      "El producto escalar suma productos componente a componente.",
      "El coseno compara dirección y elimina la escala positiva.",
      "Normalizar puede descartar información contenida en la magnitud.",
    ],
    questions: [
      {
        id: "s2-dot-basic",
        prompt: "¿Cuánto vale (1, 2) · (3, 4)?",
        options: ["7", "10", "11", "(3, 8)"],
        correctIndex: 2,
        feedback: [
          "Has sumado las cuatro componentes.",
          "No corresponde a la suma de productos emparejados.",
          "Correcto: 1×3 + 2×4 = 11.",
          "Eso es la multiplicación elemento a elemento antes de sumar.",
        ],
      },
      {
        id: "s2-cos-scaled",
        prompt: "¿Qué similitud coseno tienen (1, 2) y (10, 20), ignorando redondeos?",
        options: ["0", "0,5", "1", "10"],
        correctIndex: 2,
        feedback: [
          "Cero indicaría direcciones perpendiculares.",
          "Los vectores están exactamente alineados.",
          "Correcto: uno es un múltiplo positivo del otro.",
          "El coseno está acotado entre −1 y 1.",
        ],
      },
      {
        id: "s2-cos-tradeoff",
        prompt: "¿Qué información elimina principalmente la similitud coseno?",
        options: ["La dirección", "La magnitud global", "El número de componentes", "Los signos"],
        correctIndex: 1,
        feedback: [
          "La dirección es precisamente lo que compara.",
          "Correcto: normaliza las longitudes de ambos vectores.",
          "Los vectores deben seguir teniendo dimensiones compatibles.",
          "Los signos afectan al ángulo y por tanto al resultado.",
        ],
      },
    ],
    lab: "similarity",
    labTitle: "Alinea dos vectores",
    labInstruction: "Cambia dirección y escala para separar lo que ve el producto escalar de lo que ve el coseno.",
    sources: [
      { label: "PyTorch · CosineSimilarity", url: "https://docs.pytorch.org/docs/stable/generated/torch.nn.CosineSimilarity.html" },
      { label: "Deep Learning · Linear Algebra", url: "https://www.deeplearningbook.org/contents/linear_algebra.html" },
    ],
  },
  {
    id: "02.05",
    navTitle: "Producto matricial",
    title: "Combinar entradas para fabricar características",
    objective: "Leer las shapes de un producto matricial y conectar W x + b con una capa aprendida.",
    lead: "El producto matricial es una fábrica de combinaciones. Cada salida mezcla las entradas usando una fila de pesos. Esa operación está en el corazón de capas lineales, convoluciones y atención.",
    keyIdea: "En (M × K) @ (K × N), las dimensiones internas K deben coincidir y el resultado conserva M × N.",
    sections: [
      {
        title: "Las dimensiones internas se consumen",
        paragraphs: [
          "Una matriz A de shape (M, K) puede multiplicarse por B de shape (K, N). Para cada celda de salida se calcula el producto escalar de una fila de A y una columna de B.",
          "El resultado tiene shape (M, N). Si las dimensiones internas no coinciden, la operación no está definida sin transformar antes los datos.",
        ],
        formula: {
          label: "REGLA DE SHAPES",
          value: "(M, K) @ (K, N) → (M, N)",
          parts: ["K coincide", "K se reduce", "M y N quedan"],
        },
      },
      {
        title: "Una capa lineal es una matriz de decisiones",
        paragraphs: [
          "Si x tiene 128 características y queremos 64 salidas, podemos usar W con shape (64, 128). Cada fila de W aprende una combinación distinta de las 128 entradas.",
          "Después suele añadirse un sesgo b de 64 valores: y = W x + b. En sentido matemático estricto, sumar b convierte la transformación lineal en afín, aunque las librerías la llamen Linear.",
        ],
      },
      {
        title: "Transponer no es hacer reshape",
        paragraphs: [
          "La transposición intercambia ejes; reshape cambia la forma siguiendo el orden lineal de almacenamiento. Pueden terminar con la misma shape y, sin embargo, colocar valores diferentes en cada posición.",
          "Antes de transponer, pregunta qué representan filas y columnas. Antes de reshape, pregunta qué agrupación de valores quieres conservar.",
        ],
      },
    ],
    takeaways: [
      "El producto matricial reduce una dimensión compartida.",
      "Cada salida de W x es un producto escalar con una fila de pesos.",
      "Transpose y reshape no son operaciones intercambiables.",
    ],
    questions: [
      {
        id: "s2-matmul-shape",
        prompt: "¿Qué shape resulta de (5, 3) @ (3, 8)?",
        options: ["(5, 8)", "(3, 3)", "(8, 5)", "(5, 3, 8)"],
        correctIndex: 0,
        feedback: [
          "Correcto: se consume el 3 compartido y permanecen 5 y 8.",
          "El eje interno no forma la salida.",
          "Has invertido el orden de los ejes exteriores.",
          "El producto no concatena las tres dimensiones.",
        ],
      },
      {
        id: "s2-linear-weight",
        prompt: "Una capa recibe 128 características y produce 64. Con y = W x + b, ¿qué shape natural tiene W?",
        options: ["(128, 64, 3)", "(64, 128)", "(128,)", "(64, 64)"],
        correctIndex: 1,
        feedback: [
          "No hace falta un eje de color.",
          "Correcto: 64 filas de salida por 128 entradas.",
          "Eso solo define un vector, no 64 combinaciones distintas.",
          "Faltarían pesos para las 128 entradas.",
        ],
      },
      {
        id: "s2-reshape-transpose",
        prompt: "¿Puede reshape sustituir siempre a transpose para intercambiar dos ejes?",
        options: ["Sí", "Solo con enteros", "No: pueden recolocar los valores de forma distinta", "Sí, si el total de valores coincide"],
        correctIndex: 2,
        feedback: [
          "Aunque la shape final coincida, la correspondencia de índices puede ser diferente.",
          "El dtype no cambia la semántica de estas operaciones.",
          "Correcto: transpose permuta ejes; reshape reinterpreta una secuencia.",
          "Coincidir en tamaño total solo permite reshape, no lo hace equivalente.",
        ],
      },
    ],
    lab: "linear-transform",
    labTitle: "Transforma un vector",
    labInstruction: "Aplica matrices de escala, giro y mezcla a un punto y sigue cada producto fila por columna.",
    sources: [
      { label: "NumPy · matmul", url: "https://numpy.org/doc/stable/reference/generated/numpy.matmul.html" },
      { label: "Deep Learning · Linear Algebra", url: "https://www.deeplearningbook.org/contents/linear_algebra.html" },
    ],
  },
  {
    id: "02.06",
    navTitle: "Rango e inversa",
    title: "Cuándo una matriz pierde información",
    objective: "Interpretar rango, determinante, inversa y condicionamiento sin convertirlos en recetas mecánicas.",
    lead: "Algunas transformaciones aplastan direcciones o vuelven casi indistinguibles datos diferentes. Saber detectarlo explica por qué ciertos problemas no tienen una solución única o son numéricamente frágiles.",
    keyIdea: "El rango cuenta direcciones independientes; una matriz singular ha perdido al menos una y no puede deshacerse con una inversa ordinaria.",
    sections: [
      {
        title: "Rango: cuánta información independiente queda",
        paragraphs: [
          "El rango de una matriz es el número de filas o columnas linealmente independientes. Si una columna es combinación de otras, no aporta una dirección nueva.",
          "Una matriz de 3 × 3 puede tener rango 2: ocupa tres ejes en memoria, pero sus transformaciones viven realmente en un subespacio de dos dimensiones.",
        ],
      },
      {
        title: "Determinante e inversa",
        paragraphs: [
          "Para una matriz cuadrada, el valor absoluto del determinante mide cuánto escala volúmenes. Si vale cero, la transformación colapsa volumen, la matriz es singular y no existe una inversa ordinaria.",
          "La inversa A⁻¹ deshace A cuando existe, pero en código numérico suele ser preferible resolver A x = b directamente en vez de calcular A⁻¹ y multiplicar.",
        ],
        formula: {
          label: "SEÑAL DE PÉRDIDA",
          value: "det(A) = 0  →  singular",
          parts: ["rango incompleto", "sin inversa", "solución no única o ausente"],
        },
      },
      {
        title: "Casi singular también es peligroso",
        paragraphs: [
          "Una matriz puede tener inversa y aun ser mal condicionada. Un número de condición alto indica que pequeños cambios o errores de redondeo pueden provocar cambios grandes en la solución.",
          "En una entrevista, no basta con preguntar si la operación se puede calcular: también importa si el resultado será estable.",
        ],
      },
    ],
    takeaways: [
      "Rango completo significa disponer de todas las direcciones posibles para esa shape.",
      "Determinante cero implica singularidad en una matriz cuadrada.",
      "Una matriz invertible puede seguir siendo numéricamente mal condicionada.",
    ],
    questions: [
      {
        id: "s2-rank-dependent",
        prompt: "Una matriz 3 × 3 tiene una columna que es el doble de otra. ¿Cuál puede ser como máximo su rango?",
        options: ["1", "2", "3", "9"],
        correctIndex: 1,
        feedback: [
          "Todavía podría existir otra columna independiente.",
          "Correcto: esas dos columnas aportan una sola dirección y la tercera puede añadir otra.",
          "No puede haber tres columnas independientes con esa dependencia.",
          "El rango no supera el menor número entre filas y columnas.",
        ],
      },
      {
        id: "s2-det-zero",
        prompt: "Para una matriz cuadrada, ¿qué indica det(A) = 0?",
        options: ["Que A es identidad", "Que A es singular", "Que A es ortogonal", "Que todos sus elementos son cero"],
        correctIndex: 1,
        feedback: [
          "La identidad tiene determinante 1.",
          "Correcto: ha colapsado al menos una dirección y no tiene inversa ordinaria.",
          "Una matriz ortogonal invertible tiene determinante +1 o −1.",
          "Puede haber muchos valores no nulos y aun así existir dependencia lineal.",
        ],
      },
      {
        id: "s2-conditioning",
        prompt: "¿Qué advierte un número de condición muy alto?",
        options: ["Que la matriz usa muchos canales", "Que pequeños errores pueden amplificarse", "Que el resultado siempre es exacto", "Que la matriz debe ser rectangular"],
        correctIndex: 1,
        feedback: [
          "No describe el número de canales.",
          "Correcto: el problema puede ser muy sensible a perturbaciones y redondeo.",
          "Indica precisamente lo contrario: fragilidad numérica.",
          "También puede ocurrir en matrices cuadradas.",
        ],
      },
    ],
    lab: "matrix-properties",
    labTitle: "Pon a prueba una matriz",
    labInstruction: "Compara matrices identidad, singulares y casi singulares para ver rango, determinante y estabilidad.",
    sources: [
      { label: "NumPy · Linear algebra", url: "https://numpy.org/doc/stable/reference/routines.linalg.html" },
      { label: "NumPy · Condition number", url: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.cond.html" },
    ],
  },
  {
    id: "02.07",
    navTitle: "Autovalores, SVD y PCA",
    title: "Encontrar las direcciones importantes",
    objective: "Construir una intuición útil de autovectores, SVD y PCA para análisis y compresión de datos visuales.",
    lead: "Una nube de datos puede extenderse mucho en unas direcciones y muy poco en otras. Descomponer una matriz ayuda a descubrir esas direcciones ocultas y cuánto aporta cada una.",
    keyIdea: "Las descomposiciones reescriben una transformación como direcciones principales y factores de escala; PCA conserva las direcciones de mayor varianza.",
    sections: [
      {
        title: "Autovectores: direcciones que no giran",
        paragraphs: [
          "Un autovector v de una matriz cuadrada A cumple A v = λ v. La transformación puede estirarlo, encogerlo o invertirlo, pero no lo saca de su línea. λ indica el factor de escala.",
          "No todas las matrices reales tienen una base completa de autovectores reales. Por eso conviene saber qué condiciones exige cada descomposición.",
        ],
      },
      {
        title: "SVD funciona con matrices rectangulares",
        paragraphs: [
          "La descomposición en valores singulares escribe A = U Σ Vᵀ. U y V contienen direcciones ortogonales y Σ ordena la fuerza de cada componente mediante valores singulares no negativos.",
          "Toda matriz real admite SVD. Conservar solo los valores singulares mayores permite construir una aproximación de bajo rango: útil para compresión, reducción de ruido y diagnóstico.",
        ],
        formula: {
          label: "DESCOMPOSICIÓN SVD",
          value: "A = U Σ Vᵀ",
          parts: ["Vᵀ: direcciones de entrada", "Σ: importancia", "U: direcciones de salida"],
        },
      },
      {
        title: "PCA resume variación, no relevancia",
        paragraphs: [
          "PCA centra los datos y busca ejes ortogonales que capturan la mayor varianza. Puede calcularse mediante autovectores de la covarianza o con SVD sobre los datos centrados.",
          "Mayor varianza no significa necesariamente mayor utilidad para la etiqueta. PCA es no supervisado: podría descartar una señal pequeña pero decisiva para clasificar.",
        ],
      },
    ],
    takeaways: [
      "Un autovector conserva su dirección bajo la transformación.",
      "SVD factoriza cualquier matriz real y permite aproximaciones de bajo rango.",
      "PCA maximiza varianza explicada, no rendimiento de clasificación.",
    ],
    questions: [
      {
        id: "s2-eigenvector",
        prompt: "Si A v = 3v con v ≠ 0, ¿qué representa v?",
        options: ["Un sesgo", "Un autovector de A", "La inversa de A", "Un gradiente necesariamente"],
        correctIndex: 1,
        feedback: [
          "No es un término constante añadido.",
          "Correcto: mantiene su dirección y su autovalor es 3.",
          "Una inversa es una matriz, no este vector.",
          "Podría coincidir casualmente con un gradiente, pero la ecuación no lo implica.",
        ],
      },
      {
        id: "s2-svd-rectangular",
        prompt: "¿Puede aplicarse SVD a una matriz rectangular real?",
        options: ["No", "Solo si todas las filas son iguales", "Sí", "Solo después de hacerla cuadrada con ceros"],
        correctIndex: 2,
        feedback: [
          "SVD es precisamente más general que la eigendescomposición.",
          "No exige esa dependencia entre filas.",
          "Correcto: toda matriz real admite una descomposición SVD.",
          "No es necesario alterar sus dimensiones.",
        ],
      },
      {
        id: "s2-pca-limit",
        prompt: "¿Qué garantiza la primera componente principal de PCA?",
        options: ["Máxima varianza lineal", "Máxima precisión de clasificación", "Ausencia de ruido", "Independencia estadística total"],
        correctIndex: 0,
        feedback: [
          "Correcto: dentro de las direcciones lineales unitarias, captura la mayor varianza.",
          "PCA no utiliza las etiquetas y no puede garantizarlo.",
          "Puede ayudar a reducir ruido, pero no distingue ruido de señal por definición.",
          "Las componentes son ortogonales y no correlacionadas en la muestra, no necesariamente independientes.",
        ],
      },
    ],
    lab: "pca",
    labTitle: "Proyecta una nube",
    labInstruction: "Cambia la orientación y el ruido de una nube 2D para ver qué dirección conserva PCA.",
    sources: [
      { label: "NumPy · Singular Value Decomposition", url: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html" },
      { label: "Deep Learning · Eigen, SVD and PCA", url: "https://www.deeplearningbook.org/contents/linear_algebra.html" },
    ],
  },
  {
    id: "02.08",
    navTitle: "Derivadas y gradientes",
    title: "Saber hacia dónde cambia el error",
    objective: "Interpretar derivadas, derivadas parciales, gradientes, Jacobianos y el signo del descenso.",
    lead: "Entrenar consiste en cambiar millones de parámetros para reducir un error. La derivada no dice solo cuánto error hay: indica cómo cambiaría ante un pequeño movimiento.",
    keyIdea: "El gradiente apunta hacia el aumento local más rápido; para reducir una función damos un paso en la dirección opuesta.",
    sections: [
      {
        title: "Derivada: pendiente local",
        paragraphs: [
          "La derivada de f respecto a x aproxima cuánto cambia f cuando x varía un poco. Para f(x) = x², la derivada es 2x: en x = 3 la pendiente vale 6.",
          "Una derivada grande indica sensibilidad local, no que el valor de la función sea necesariamente grande.",
        ],
      },
      {
        title: "De una pendiente a un mapa de pendientes",
        paragraphs: [
          "Con muchos parámetros calculamos una derivada parcial para cada uno. El vector que las reúne es el gradiente. Si una función produce varias salidas, las derivadas pueden organizarse en un Jacobiano.",
          "El Hessiano reúne segundas derivadas y describe curvatura local. Es útil para razonar sobre optimización, aunque entrenar redes grandes rara vez implica construirlo completo.",
        ],
        formula: {
          label: "PASO DE DESCENSO",
          value: "θ nuevo = θ − η ∇L",
          parts: ["θ: parámetros", "η: tamaño del paso", "∇L: dirección de subida"],
        },
      },
      {
        title: "Gradiente cero no garantiza el mejor punto",
        paragraphs: [
          "Un gradiente cero puede corresponder a un mínimo, un máximo, un punto de silla o una zona plana. Necesitas contexto sobre la curvatura y el entorno.",
          "Además, las derivadas describen comportamiento local. Un paso demasiado grande puede saltar la región donde esa aproximación era útil.",
        ],
      },
    ],
    takeaways: [
      "La derivada mide sensibilidad local.",
      "El gradiente reúne una pendiente por parámetro.",
      "Restar el gradiente busca disminuir la pérdida, pero el tamaño del paso importa.",
    ],
    questions: [
      {
        id: "s2-derivative-square",
        prompt: "Para f(x) = x², ¿cuánto vale f'(3)?",
        options: ["3", "6", "9", "18"],
        correctIndex: 1,
        feedback: [
          "Ese es x, no la pendiente de x².",
          "Correcto: f'(x) = 2x y en 3 vale 6.",
          "Nueve es el valor de la función.",
          "Has multiplicado por el valor de la función.",
        ],
      },
      {
        id: "s2-gradient-direction",
        prompt: "Si quieres reducir una pérdida diferenciable localmente, ¿en qué dirección básica avanzas?",
        options: ["A favor del gradiente", "En contra del gradiente", "Siempre hacia cero", "En una dirección aleatoria obligatoriamente"],
        correctIndex: 1,
        feedback: [
          "Esa es la dirección de aumento local más rápido.",
          "Correcto: el gradiente negativo apunta hacia el descenso local.",
          "Los parámetros óptimos no tienen por qué valer cero.",
          "Puede existir ruido en el optimizador, pero no define el descenso básico.",
        ],
      },
      {
        id: "s2-zero-gradient",
        prompt: "Encuentras ∇L = 0. ¿Qué puedes asegurar?",
        options: ["Es el mínimo global", "El entrenamiento ha terminado bien", "Es un punto estacionario, no necesariamente un mínimo", "La pérdida vale cero"],
        correctIndex: 2,
        feedback: [
          "También podría ser máximo, silla o mínimo local.",
          "No informa por sí solo sobre generalización ni calidad.",
          "Correcto: no hay pendiente de primer orden, pero falta clasificar el punto.",
          "Valor y pendiente son magnitudes distintas.",
        ],
      },
    ],
    lab: "gradient",
    labTitle: "Baja por la pendiente",
    labInstruction: "Mueve un parámetro sobre una función cuadrática y prueba pasos de distinto tamaño.",
    sources: [
      { label: "PyTorch · Automatic differentiation", url: "https://docs.pytorch.org/tutorials/beginner/basics/autograd_tutorial.html" },
      { label: "Deep Learning · Numerical Computation", url: "https://www.deeplearningbook.org/contents/numerical.html" },
    ],
  },
  {
    id: "02.09",
    navTitle: "Regla de la cadena",
    title: "Repartir el error hacia atrás",
    objective: "Seguir la regla de la cadena por un grafo computacional y entender qué hace realmente backpropagation.",
    lead: "Una red es una composición enorme de operaciones sencillas. Backpropagation evita recalcular cada camino desde cero: propaga hacia atrás cuánto influyó cada pieza en el error final.",
    keyIdea: "En una cadena, las derivadas locales se multiplican; cuando varios caminos llegan al mismo valor, sus contribuciones se suman.",
    sections: [
      {
        title: "Una función dentro de otra",
        paragraphs: [
          "Si u = 2x + 1 e y = u², y depende de x a través de u. La regla de la cadena dice dy/dx = (dy/du)(du/dx). En x = 1, u = 3, por tanto 2u × 2 = 12.",
          "Cada operación solo necesita conocer su derivada local y el gradiente que recibe desde la salida.",
        ],
        formula: {
          label: "REGLA DE LA CADENA",
          value: "dy/dx = dy/du · du/dx",
          parts: ["gradiente recibido", "derivada local", "gradiente enviado"],
        },
      },
      {
        title: "Un grafo, no siempre una cadena",
        paragraphs: [
          "Si una variable participa en dos ramas que terminan en la misma pérdida, el efecto total es la suma de ambas rutas. Esto explica los gradientes que atraviesan conexiones residuales.",
          "El grafo se construye durante el forward. El backward lo recorre en sentido inverso y reutiliza resultados intermedios.",
        ],
      },
      {
        title: "Backward calcula; el optimizador actualiza",
        paragraphs: [
          "En PyTorch, backward calcula y acumula gradientes en .grad. No modifica los pesos por sí mismo. El optimizador aplica después la actualización.",
          "Como los gradientes se acumulan por defecto, normalmente se limpian antes del siguiente paso. Olvidarlo cambia el algoritmo de entrenamiento.",
        ],
      },
    ],
    takeaways: [
      "Backpropagation es una aplicación eficiente de la regla de la cadena.",
      "Las ramas que confluyen suman contribuciones de gradiente.",
      "Calcular gradientes y actualizar parámetros son pasos distintos.",
    ],
    questions: [
      {
        id: "s2-chain-value",
        prompt: "Si u = 2x + 1 e y = u², ¿cuánto vale dy/dx en x = 1?",
        options: ["4", "6", "9", "12"],
        correctIndex: 3,
        feedback: [
          "Eso es du/dx multiplicado por sí mismo, no por dy/du.",
          "Es dy/du cuando u = 3, pero falta du/dx.",
          "Nueve es y, no su derivada respecto a x.",
          "Correcto: dy/du = 6 y du/dx = 2; 6 × 2 = 12.",
        ],
      },
      {
        id: "s2-branch-gradient",
        prompt: "Una variable alimenta dos ramas que llegan a la misma pérdida. ¿Cómo se combinan sus gradientes?",
        options: ["Se suman", "Se ignora el menor", "Se multiplican siempre entre ramas", "Se conserva solo el último"],
        correctIndex: 0,
        feedback: [
          "Correcto: la derivada total recoge todas las rutas de dependencia.",
          "Ambas ramas influyen aunque una contribución sea pequeña.",
          "Se multiplican a lo largo de cada cadena; entre rutas paralelas se suman.",
          "El orden de ejecución no elimina dependencias válidas.",
        ],
      },
      {
        id: "s2-backward-update",
        prompt: "¿Qué hace backward por sí solo en un entrenamiento típico de PyTorch?",
        options: ["Actualiza los pesos", "Calcula y acumula gradientes", "Guarda el modelo en disco", "Elige el learning rate"],
        correctIndex: 1,
        feedback: [
          "La actualización corresponde al paso del optimizador.",
          "Correcto: rellena o acumula los campos .grad.",
          "La serialización es una operación separada.",
          "El learning rate es un hiperparámetro del optimizador.",
        ],
      },
    ],
    lab: "chain-rule",
    labTitle: "Sigue el gradiente",
    labInstruction: "Recorre un pequeño grafo hacia delante y hacia atrás para ver qué se multiplica y qué se suma.",
    sources: [
      { label: "PyTorch · Autograd mechanics", url: "https://docs.pytorch.org/docs/stable/notes/autograd.html" },
      { label: "PyTorch · Fundamentals of Autograd", url: "https://docs.pytorch.org/tutorials/beginner/introyt/autogradyt_tutorial.html" },
    ],
  },
  {
    id: "02.10",
    navTitle: "Probabilidad",
    title: "No confundir confianza con certeza",
    objective: "Manejar distribuciones, probabilidad condicionada, esperanza y tasas base en decisiones de visión.",
    lead: "Un detector no ve certezas: produce evidencias bajo incertidumbre. Interpretar bien una probabilidad exige preguntar qué evento mide y bajo qué condición.",
    keyIdea: "P(A | B) y P(B | A) responden preguntas distintas; la frecuencia previa de A puede cambiar por completo la interpretación de una alarma.",
    sections: [
      {
        title: "Una distribución reparte masa",
        paragraphs: [
          "Para clases mutuamente excluyentes y exhaustivas, sus probabilidades suman 1. Una variable aleatoria asigna valores a resultados inciertos, y su esperanza es un promedio ponderado por probabilidades.",
          "Una puntuación de red o logit no es automáticamente una probabilidad. Hace falta una transformación y, si importa tomar decisiones reales, evaluar calibración.",
        ],
      },
      {
        title: "La condición cambia la pregunta",
        paragraphs: [
          "P(alarma | defecto) es la sensibilidad: de los defectos reales, cuántos detectamos. P(defecto | alarma) es el valor predictivo: de las alarmas, cuántas son defectos. No son intercambiables.",
          "Bayes conecta ambas cantidades incorporando la prevalencia. Si los defectos son muy raros, incluso un modelo sensible puede producir muchas falsas alarmas.",
        ],
        formula: {
          label: "BAYES",
          value: "P(A|B) = P(B|A)P(A) / P(B)",
          parts: ["posterior", "evidencia", "tasa previa"],
        },
      },
      {
        title: "El umbral expresa un coste",
        paragraphs: [
          "Subir o bajar el umbral cambia falsos positivos y falsos negativos. Elegirlo requiere conocer el coste de inspeccionar una alarma frente al coste de dejar pasar un defecto.",
          "Por eso una métrica aislada no decide el sistema. Debes conectar distribución, prevalencia, calibración y coste operativo.",
        ],
      },
    ],
    takeaways: [
      "Las probabilidades de clases exhaustivas suman 1.",
      "Sensibilidad y precisión responden condiciones opuestas.",
      "Las tasas base importan al interpretar cualquier alarma.",
    ],
    questions: [
      {
        id: "s2-prob-sum",
        prompt: "Tres clases son mutuamente excluyentes y cubren todos los casos. ¿Cuánto deben sumar sus probabilidades?",
        options: ["0", "0,5", "1", "Depende del número de píxeles"],
        correctIndex: 2,
        feedback: [
          "Eso dejaría toda la masa sin asignar.",
          "Faltaría la mitad de la masa probabilística.",
          "Correcto: la distribución reparte el total entre todas las posibilidades.",
          "No depende de la resolución de la imagen.",
        ],
      },
      {
        id: "s2-sensitivity-meaning",
        prompt: "Un detector tiene 90% de sensibilidad. ¿Qué significa?",
        options: ["El 90% de sus alarmas son correctas", "Detecta el 90% de los defectos reales", "Solo produce 10 alarmas", "Su accuracy es necesariamente 90%"],
        correctIndex: 1,
        feedback: [
          "Eso sería precisión o valor predictivo positivo.",
          "Correcto: mide P(alarma | defecto).",
          "Es una proporción, no un número absoluto.",
          "La accuracy también depende de negativos y de la prevalencia.",
        ],
      },
      {
        id: "s2-base-rate",
        prompt: "Si los defectos son extremadamente raros, ¿qué puede ocurrir aunque la sensibilidad sea alta?",
        options: ["La precisión puede seguir siendo baja por falsas alarmas", "Bayes deja de aplicarse", "Todas las alarmas son defectos", "La tasa previa no influye"],
        correctIndex: 0,
        feedback: [
          "Correcto: una población enorme de negativos puede aportar muchos falsos positivos.",
          "La regla sigue siendo válida.",
          "Eso solo ocurriría sin falsos positivos.",
          "La prevalencia es una parte esencial del posterior.",
        ],
      },
    ],
    lab: "probability",
    labTitle: "Simula 10.000 inspecciones",
    labInstruction: "Ajusta prevalencia, sensibilidad y falsos positivos para descubrir cuántas alarmas serían realmente defectos.",
    sources: [
      { label: "Deep Learning · Probability and Information Theory", url: "https://www.deeplearningbook.org/contents/prob.html" },
      { label: "NIST · Multivariate distributions", url: "https://www.itl.nist.gov/div898/handbook/pmc/section5/pmc54.htm" },
    ],
  },
  {
    id: "02.11",
    navTitle: "Estadística y normalización",
    title: "Resumir datos sin esconder su historia",
    objective: "Interpretar media, mediana, varianza, desviación, covarianza y normalización evitando fuga de datos.",
    lead: "Dos datasets pueden compartir la misma media y ser radicalmente distintos. Los estadísticos son resúmenes: útiles para diagnosticar, peligrosos si olvidamos qué información han comprimido.",
    keyIdea: "Centro, dispersión y relación son preguntas distintas; los estadísticos de preprocesado deben aprenderse solo con el conjunto de entrenamiento.",
    sections: [
      {
        title: "Centro y dispersión",
        paragraphs: [
          "La media suma y divide; la mediana busca el punto central ordenado. Un valor extremo arrastra más la media que la mediana.",
          "La varianza promedia desviaciones cuadráticas respecto a la media. La desviación estándar es su raíz y vuelve a las unidades originales.",
        ],
      },
      {
        title: "Covarianza no significa causalidad",
        paragraphs: [
          "La covarianza es positiva cuando dos variables tienden a crecer juntas y negativa cuando una sube al bajar la otra. Su escala depende de las unidades.",
          "La correlación normaliza esa relación lineal, normalmente entre −1 y 1. Ni covarianza ni correlación prueban que una variable cause la otra.",
        ],
        formula: {
          label: "ESTANDARIZACIÓN",
          value: "z = (x − μ) / σ",
          parts: ["centrar", "escalar", "aplicar estadísticas de train"],
        },
      },
      {
        title: "Normalizar sin mirar el examen",
        paragraphs: [
          "Para estandarizar, calculamos media y desviación en train y reutilizamos esos valores en validación, test y producción. Recalcularlos con test filtra información del futuro.",
          "En visión también debes precisar sobre qué ejes calculas estadísticas: por canal, por imagen, por lote o por dataset producen transformaciones diferentes.",
        ],
      },
    ],
    takeaways: [
      "Media y mediana reaccionan de forma distinta a valores extremos.",
      "Desviación estándar conserva las unidades de la variable.",
      "Calcular estadísticas con test provoca data leakage.",
    ],
    questions: [
      {
        id: "s2-outlier-center",
        prompt: "Añades un valor extremadamente grande a un conjunto. ¿Qué medida de centro suele cambiar más?",
        options: ["La mediana", "La media", "Ambas siempre igual", "Ninguna"],
        correctIndex: 1,
        feedback: [
          "La mediana suele ser más robusta ante un único extremo.",
          "Correcto: el valor participa directamente en la suma.",
          "Su sensibilidad a extremos es diferente.",
          "Al menos la media cambiará salvo casos especiales.",
        ],
      },
      {
        id: "s2-zscore",
        prompt: "Si x = μ, ¿cuánto vale su z-score cuando σ > 0?",
        options: ["−1", "0", "1", "σ"],
        correctIndex: 1,
        feedback: [
          "Eso correspondería a una desviación por debajo de la media.",
          "Correcto: el numerador x − μ vale cero.",
          "Uno indica una desviación estándar por encima.",
          "El resultado queda adimensional.",
        ],
      },
      {
        id: "s2-leakage-stats",
        prompt: "¿Con qué datos debes estimar μ y σ para evaluar honestamente un modelo?",
        options: ["Train únicamente", "Train + test", "Test únicamente", "Con las predicciones"],
        correctIndex: 0,
        feedback: [
          "Correcto: después reutilizas esas estadísticas sin volver a ajustarlas.",
          "El test estaría influyendo en el preprocesado.",
          "Eso entrenaría una parte del pipeline con el conjunto reservado.",
          "Las predicciones no sustituyen a la distribución de entrada.",
        ],
      },
    ],
    lab: "statistics",
    labTitle: "Introduce un valor atípico",
    labInstruction: "Activa un outlier y compara media, mediana, desviación y valores estandarizados.",
    sources: [
      { label: "NIST · Measures of scale", url: "https://itl.nist.gov/div898/handbook/eda/section3/eda356.htm" },
      { label: "scikit-learn · StandardScaler", url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html" },
    ],
  },
  {
    id: "02.12",
    navTitle: "Logaritmos y estabilidad",
    title: "Calcular lo mismo sin romper los números",
    objective: "Usar logaritmos, epsilon y log-sum-exp para entender y evitar underflow, overflow y operaciones indefinidas.",
    lead: "Una fórmula correcta sobre papel puede fallar en coma flotante. En deep learning manejamos exponentiales enormes y probabilidades diminutas; la estabilidad numérica forma parte del algoritmo.",
    keyIdea: "Una reformulación estable conserva el significado matemático mientras evita valores que el ordenador no puede representar con seguridad.",
    sections: [
      {
        title: "El logaritmo convierte productos en sumas",
        paragraphs: [
          "log(ab) = log(a) + log(b). Multiplicar muchas probabilidades menores que uno puede terminar redondeando a cero; sumar sus logaritmos mantiene una representación manejable.",
          "Para probabilidades entre 0 y 1, el logaritmo natural es menor o igual que cero. log(1) = 0 y log(0) no es finito.",
        ],
        formula: {
          label: "DOMINIO LOGARÍTMICO",
          value: "log ∏ pᵢ = ∑ log pᵢ",
          parts: ["evita underflow", "productos → sumas", "p debe ser positiva"],
        },
      },
      {
        title: "Exponentiales que desbordan",
        paragraphs: [
          "exp(1000) supera fácilmente el rango de muchos tipos float. En softmax podemos restar el máximo de todos los logits antes de exponenciar; la distribución resultante no cambia.",
          "log-sum-exp aplica esta idea para calcular log(∑ exp(xᵢ)) de forma estable.",
        ],
      },
      {
        title: "Epsilon no es decoración",
        paragraphs: [
          "Añadir un epsilon pequeño puede evitar dividir entre cero o calcular log(0), pero también modifica ligeramente la expresión. Su tamaño y ubicación deben estar justificados.",
          "NaN e infinito se propagan con facilidad. Al depurar entrenamiento, revisa rangos, dtype, divisiones, logaritmos y exponenciales en el primer punto donde aparecen, no solo al final.",
        ],
      },
    ],
    takeaways: [
      "El dominio logarítmico evita multiplicar directamente probabilidades minúsculas.",
      "Restar el máximo estabiliza softmax sin cambiar su resultado teórico.",
      "NaN e infinito son síntomas que deben rastrearse hasta su primera operación.",
    ],
    questions: [
      {
        id: "s2-log-product",
        prompt: "¿Qué identidad permite sustituir un producto de probabilidades por una suma?",
        options: ["log(ab) = log(a) + log(b)", "log(ab) = log(a)log(b)", "log(a+b) = log(a)+log(b)", "exp(a) = a²"],
        correctIndex: 0,
        feedback: [
          "Correcto: es la base del trabajo en dominio logarítmico.",
          "Los logaritmos se suman, no se multiplican.",
          "El logaritmo no distribuye sobre una suma de esa manera.",
          "La exponencial no equivale al cuadrado.",
        ],
      },
      {
        id: "s2-softmax-shift",
        prompt: "¿Qué ocurre teóricamente al restar el mismo máximo a todos los logits antes de softmax?",
        options: ["Cambia la clase ganadora", "La distribución no cambia y mejora la estabilidad", "Todas las probabilidades pasan a cero", "Elimina una clase"],
        correctIndex: 1,
        feedback: [
          "Restar una constante común conserva todas las diferencias.",
          "Correcto: el factor común se cancela en numerador y denominador.",
          "Al menos el logit máximo queda en cero y exp(0) vale uno.",
          "Se mantienen todos los términos.",
        ],
      },
      {
        id: "s2-log-zero",
        prompt: "¿Por qué se usa a veces epsilon antes de un logaritmo?",
        options: ["Para crear más clases", "Para evitar log(0)", "Para cambiar RGB a BGR", "Para aumentar la resolución"],
        correctIndex: 1,
        feedback: [
          "No altera el número de clases.",
          "Correcto: log(0) tiende a −infinito y puede contaminar el cálculo.",
          "No tiene relación con el orden de canales.",
          "No añade muestras espaciales.",
        ],
      },
    ],
    lab: "stability",
    labTitle: "Evita el overflow",
    labInstruction: "Compara softmax ingenuo y estable con logits pequeños y enormes.",
    sources: [
      { label: "PyTorch · logsumexp", url: "https://docs.pytorch.org/docs/stable/generated/torch.logsumexp.html" },
      { label: "Deep Learning · Numerical Computation", url: "https://www.deeplearningbook.org/contents/numerical.html" },
    ],
  },
];
