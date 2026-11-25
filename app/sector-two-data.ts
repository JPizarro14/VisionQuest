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
          "Un escalar tiene 0 ejes (una intensidad), un vector tiene 1 (los tres componentes de un píxel RGB) y una matriz tiene 2 (fila y columna). En bibliotecas como PyTorch, «tensor» designa un array de cualquier número de ejes: también un escalar o una matriz.",
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
          "Una caja en formato xywh guarda posición (x, y), ancho y alto; RGBA guarda intensidades roja, verde y azul y un valor de opacidad. Ambos vectores admiten las mismas operaciones numéricas, pero sumarles un desplazamiento en píxeles solo tiene sentido para las coordenadas de la caja.",
        ],
      },
      {
        title: "La shape es la gramática",
        paragraphs: [
          "Un embedding representa un ejemplo mediante un vector de características aprendidas. Si guardas uno por fila, (32, 128) significa 32 ejemplos y 128 características. Promediar las filas resume cada característica entre ejemplos; promediar las columnas resume cada ejemplo. La forma no te dice cuál de las dos operaciones necesitas.",
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
          "Correcto: hay un solo eje, con una intensidad para cada uno de los tres colores.",
          "No hay nueve valores ni dos ejes de tamaño tres.",
          "Un lote agrupa varios ejemplos; aquí solo describimos un píxel.",
        ],
      },
      {
        id: "s2-embedding-shape",
        prompt: "Guardas 32 vectores de características (embeddings), uno por fila y con 128 números por vector. ¿Qué forma tiene la tabla?",
        options: ["(128,)", "(32, 128)", "(32, 128, 3)", "(4096, 32)"],
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
          "Correcto: tanto una caja como un píxel RGBA tienen cuatro componentes, pero miden cosas distintas.",
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
          "Un ndarray es un array de NumPy cuyos elementos comparten tipo. Para una imagen de grises con dos filas, tres columnas y valores uint8: shape = (2, 3) da los tamaños de los ejes; ndim = 2 los cuenta; dtype = uint8 identifica el tipo de cada valor, y size = 6 cuenta los valores, no los ejes.",
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
          "Las tres formas contienen tres valores. (3,) tiene un solo eje, sin orientación de fila o columna; (1, 3) es una matriz de una fila y tres columnas; (3, 1), de tres filas y una columna. En Python la coma hace que (3,) sea una tupla de un elemento: (3) es solo el entero 3.",
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
          "Vectorizar es expresar el cálculo sobre arrays sin escribir un bucle por elemento. En NumPy, A * B multiplica elementos de posiciones correspondientes (con broadcasting si sus formas lo permiten). Para dos matrices, A @ B combina cada fila de A con cada columna de B: suma productos y exige que coincidan las dimensiones internas.",
        ],
      },
      {
        title: "Broadcasting: aplicar un vector a cada fila",
        paragraphs: [
          "Al sumar [[10, 20, 30], [40, 50, 60]] y [1, 2, 3] como arrays de NumPy, el eje de tres elementos se alinea con las columnas. La misma fila de ajustes se usa dos veces: el resultado es [[11, 22, 33], [41, 52, 63]]. Este ajuste de formas compatibles, sin copiar a mano el vector, se llama broadcasting.",
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
          "Alinea los ejes por la derecha y trata los que faltan a la izquierda como si midieran 1. Cada pareja debe coincidir o tener un tamaño 1. Frente a (3, 4), (4,) actúa como (1, 4): suma un valor por columna. Con (3,) los últimos tamaños serían 4 y 3: la suma falla.",
          "Para sumar un valor por fila, dale forma (3, 1) al vector. Los tres valores, por ejemplo [[10], [20], [30]], se extienden cada uno por las cuatro columnas de su fila.",
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
          "Con los canales en el último eje, NumPy aplica el ajuste (3,) a cada píxel. Para no sumar en uint8: ajuste = np.array([20, 10, 0], dtype=np.int16); resultado = np.clip(imagen.astype(np.int16) + ajuste, 0, 255).astype(np.uint8). El recorte va después de la suma y antes de volver a 8 bits.",
          "En RGB ese vector aumenta rojo y verde, no azul. Si la imagen está en orden BGR y se quiere el mismo efecto, el ajuste debe ser [0, 10, 20].",
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
          "Con los ejes (alto, ancho, canales), media = imagen.mean(axis=(0, 1)) tiene forma (C,), una media por canal. Con keepdims=True tiene forma (1, 1, C): los ejes reducidos siguen en su sitio. En imagen − media, cada píxel usa la media de su canal. Aquí (C,) también funciona porque los canales son el último eje.",
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
        prompt: "En NumPy sumas un vector de tres ajustes a una imagen de forma (480, 640, 3), con los canales al final. ¿Es compatible la suma elemento a elemento?",
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
        prompt: "En NumPy, A tiene forma (2, 3) y B, (3, 2). ¿Qué ocurre al evaluar A + B?",
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
        prompt: "Una imagen tiene forma (alto, ancho, canales). Si promedias alto y ancho sin conservar esos ejes, ¿qué queda para C canales?",
        options: ["Un vector de C valores", "Una imagen H × W", "Un escalar siempre", "Un tensor C × H × W"],
        correctIndex: 0,
        feedback: [
          "Correcto: desaparecen los dos ejes espaciales y queda una media por canal.",
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
          "De a = (1, 2) a b = (4, 6) el desplazamiento b − a es (3, 4). L1 suma los cambios absolutos por eje: 3 + 4 = 7. L2 mide la distancia recta: √(3² + 4²) = 5. L∞ toma el mayor cambio absoluto en un eje: max(3, 4) = 4.",
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
          "L1 suma errores absolutos; L2 eleva al cuadrado antes de sumar y tomar la raíz. Con igual L1, un error concentrado en un eje pesa más en L2: (4, 0) y (2, 2) tienen L1 = 4, pero sus L2 son 4 y √8. No significa que L2 sea siempre mayor que L1.",
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
          "Correcto: los desplazamientos son 3 y 4; la distancia recta es √(3² + 4²) = 5.",
          "Siete es la distancia L1: |3| + |4|.",
        ],
      },
      {
        id: "s2-l1-345",
        prompt: "Entre los puntos (1, 2) y (4, 6), ¿cuánto vale la distancia Manhattan (L1)?",
        options: ["5", "7", "12", "25"],
        correctIndex: 1,
        feedback: [
          "Cinco corresponde a L2.",
          "Correcto: la distancia por ejes suma |4 − 1| + |6 − 2| = 7.",
          "12 es el producto de los desplazamientos (3 × 4); L1 los suma en valor absoluto.",
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
          "Para vectores no nulos también vale ‖a‖ ‖b‖ cos(θ), con ‖·‖ la longitud euclídea y θ el ángulo entre ambos. Es positivo para un ángulo agudo, cero para 90° y negativo para uno obtuso; con el mismo sentido es positivo y con sentidos opuestos es negativo.",
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
          "En una búsqueda por embeddings (vectores de características), usa coseno si un cambio de escala no debe alterar la coincidencia. Si la norma codifica una intensidad que sí te interesa distinguir, el coseno pierde esa información: asigna la misma similitud a un vector y a su doble al compararlos con una referencia no nula.",
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
          "Sumar solo 3 y 4 omite la contribución del primer vector.",
          "10 es la suma de las cuatro componentes; primero hay que multiplicar las parejas.",
          "Correcto: se multiplican las componentes correspondientes y se suman: 3 + 8 = 11.",
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
          "Correcto: multiplicar el primer vector por 10 cambia su norma, pero no su dirección ni su sentido.",
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
          "Correcto: al dividir el producto escalar por las dos normas, solo queda el coseno del ángulo.",
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
          "Con x de forma (128,) y y = W @ x + b para un solo ejemplo, W tiene forma (64, 128) y b, (64,). La fila i contiene los 128 pesos que se combinan con x para obtener la salida i; a esa suma se añade el sesgo b[i]. Si b no es cero, la transformación es afín.",
        ],
      },
      {
        title: "Transponer no es hacer reshape",
        paragraphs: [
          "Si A = [[1, 2, 3], [4, 5, 6]] es un array NumPy, A.T intercambia filas y columnas: su primera fila es [1, 4]. A.reshape(3, 2), con el orden por filas predeterminado, reagrupa 1, 2, 3, 4, 5, 6: su primera fila es [1, 2]. Ambas salidas tienen forma (3, 2), pero no el mismo significado.",
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
        prompt: "A tiene 5 filas y 3 columnas; B, 3 filas y 8 columnas. ¿Qué forma tiene su producto matricial A @ B?",
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
          "Correcto: cada una de las 64 salidas necesita una fila con 128 pesos de entrada.",
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
          "El rango es el máximo número de columnas linealmente independientes, que coincide con el máximo de filas independientes. Una columna que sea combinación de las demás no aporta una dirección nueva.",
          "Una matriz de shape (3, 3) puede tener rango 2: tiene tres filas y tres columnas, pero sus columnas solo generan un subespacio de dimensión dos.",
        ],
      },
      {
        title: "Determinante e inversa",
        paragraphs: [
          "Para una matriz cuadrada, el valor absoluto del determinante mide cuánto escala volúmenes. Si vale cero, la transformación colapsa volumen, la matriz es singular y no existe una inversa ordinaria.",
          "Si A es invertible y solo interesa x, un solucionador factoriza A y resuelve A x = b sin construir todas las columnas de A⁻¹. Evita trabajo y redondeos adicionales; no corrige por sí solo un mal condicionamiento.",
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
          "Una matriz invertible puede comprimir mucho una dirección y poco otra. Al resolver A x = b se deshace esa compresión: un pequeño error relativo en b puede amplificarse en x. El número de condición mide esa sensibilidad en el peor caso, no el error efectivo de cada solución.",
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
        prompt: "Al resolver A x = b, la matriz A es invertible pero tiene un número de condición muy alto. ¿Qué riesgo indica?",
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
          "Un autovector es un vector no nulo v tal que A v = λ v. El autovalor λ indica la escala: con λ negativo cambia el sentido; con λ = 0, la imagen de v es el vector cero.",
          "No toda matriz real tiene suficientes autovectores reales independientes para formar una base. Un giro de 90° en el plano, por ejemplo, envía todo vector no nulo a una línea perpendicular: no conserva ninguna recta real por el origen.",
        ],
      },
      {
        title: "SVD funciona con matrices rectangulares",
        paragraphs: [
          "Toda matriz real, incluso rectangular, admite una descomposición en valores singulares (SVD): A = U Σ Vᵀ. Las columnas de V son direcciones ortonormales de entrada; las de U, de salida. Cada valor singular de la diagonal de Σ indica cuánto se escala la dirección correspondiente.",
          "Al conservar los k valores mayores y sus pares de direcciones se obtiene la mejor aproximación de rango a lo sumo k en error cuadrático total. Puede servir para comprimir, aunque una componente pequeña no es necesariamente ruido.",
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
          "PCA no usa etiquetas. Si el cambio de iluminación domina la varianza y una grieta solo altera un contraste débil en otra dirección, proyectar sobre el primer eje puede conservar la luz y perder la grieta. Se descarta una dirección de variación, no necesariamente una columna de los datos.",
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
          "Correcto: aplicar A a v solo triplica su longitud; v es autovector y 3 es su autovalor.",
          "Una inversa es una matriz, no este vector.",
          "Podría coincidir casualmente con un gradiente, pero la ecuación no lo implica.",
        ],
      },
      {
        id: "s2-svd-rectangular",
        prompt: "Tienes 40 ejemplos con 12 características cada uno. ¿Puedes aplicar la descomposición en valores singulares (SVD) directamente a esa matriz de 40 × 12?",
        options: ["No", "Solo si todas las filas son iguales", "Sí", "Solo después de hacerla cuadrada con ceros"],
        correctIndex: 2,
        feedback: [
          "La SVD admite números distintos de filas y columnas; no necesita una matriz cuadrada.",
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
          "Para f(x) = x², f(3) = 9 es la altura y f′(3) = 2 × 3 = 6 es la pendiente. Cerca de 3, un cambio pequeño Δx modifica f en aproximadamente 6·Δx. La derivada mide cambio por unidad de entrada, no el valor de la función.",
        ],
      },
      {
        title: "De una pendiente a un mapa de pendientes",
        paragraphs: [
          "El gradiente de una salida escalar reúne una derivada parcial por entrada. Para varias salidas, el Jacobiano es una matriz: en la fila i y columna j indica cómo cambia la salida i al variar la entrada j. El Hessiano de una salida escalar reúne sus segundas derivadas: describe cómo cambia el gradiente, es decir, la curvatura local.",
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
          "Correcto: la pendiente es f'(x) = 2x; al evaluar en x = 3 se obtiene 6.",
          "Nueve es el valor de la función.",
          "18 sería 2 × 3²; la derivada de x² es 2x, no 2x².",
        ],
      },
      {
        id: "s2-gradient-direction",
        prompt: "En descenso de gradiente, si la pérdida es diferenciable y su gradiente no es cero, ¿en qué dirección das un paso pequeño para reducirla?",
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
        prompt: "En cierto punto, el gradiente de una pérdida diferenciable L es cero (∇L = 0). ¿Qué puedes asegurar?",
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
          "En PyTorch, al calcular la salida se registra el grafo de operaciones diferenciables. La pasada hacia atrás (backward) lo recorre desde la pérdida hacia las entradas: multiplica derivadas a lo largo de cada ruta y suma las contribuciones donde confluyen.",
        ],
      },
      {
        title: "Backward calcula; el optimizador actualiza",
        paragraphs: [
          "En PyTorch, loss.backward() propaga derivadas y acumula gradientes en .grad de los parámetros entrenables. optimizer.step() usa esos gradientes para cambiar los pesos. Si cada lote debe producir una actualización independiente, llama a optimizer.zero_grad() antes del siguiente backward; si no, el gradiente anterior también cuenta.",
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
          "Correcto: en x = 1 se tiene u = 3; las derivadas locales son 2u = 6 y 2. Su producto es 12.",
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
          "Correcto: calcula derivadas de la pérdida y las acumula en .grad; no actualiza pesos.",
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
          "Una distribución asigna probabilidades a los resultados posibles; para clases excluyentes que cubren todos los casos, suman 1. La esperanza de una cantidad numérica es la suma de sus valores ponderados por esas probabilidades.",
          "Los logits son puntuaciones, no probabilidades. Softmax puede convertirlos en una distribución, pero no garantiza calibración: entre los casos a los que se asigna 0,8, el suceso debería ocurrir aproximadamente el 80 % de las veces.",
        ],
      },
      {
        title: "La condición cambia la pregunta",
        paragraphs: [
          "P(alarma | defecto) es la sensibilidad: de los defectos reales, cuántos detectamos. P(defecto | alarma) es el valor predictivo: de las alarmas, cuántas son defectos. No son intercambiables.",
          "Importa la frecuencia del defecto. De 10.000 piezas, supón que 10 son defectuosas y se detectan 9. Si hay además 99 falsas alarmas entre las 9990 piezas sanas, la sensibilidad es 9/10 = 90 %, pero solo 9 de las 108 alarmas son aciertos (8,3 %).",
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
          "Si una puntuación alta indica defecto, bajar el umbral señala más piezas: puede recuperar defectos, pero también enviar piezas sanas a inspección. Compara umbrales en validación con una prevalencia representativa y pondera cada falsa alarma y cada defecto omitido por su coste.",
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
        prompt: "En una inspección de piezas, un detector tiene un 90 % de sensibilidad. ¿Qué significa?",
        options: ["El 90% de sus alarmas son correctas", "Detecta el 90% de los defectos reales", "Solo produce 10 alarmas", "Su accuracy es necesariamente 90%"],
        correctIndex: 1,
        feedback: [
          "Tomar las alarmas como denominador mediría el valor predictivo positivo, no la sensibilidad.",
          "Correcto: el denominador son los defectos reales; de cada 100, el detector señala 90.",
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
          "Bayes sigue relacionando la sensibilidad con el valor predictivo mediante la frecuencia previa del defecto.",
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
          "En [1, 2, 3], media y mediana valen 2. Si el 3 pasa a 30, la media pasa a 11 y la mediana sigue en 2: cambia la suma, no el valor central ordenado.",
          "La varianza mide desviaciones cuadráticas respecto a la media y tiene unidades al cuadrado. La desviación estándar es su raíz: si los datos están en píxeles, la varianza se expresa en px² y la desviación en px.",
        ],
      },
      {
        title: "Covarianza no significa causalidad",
        paragraphs: [
          "La covarianza es positiva cuando dos variables tienden a crecer juntas y negativa cuando una sube al bajar la otra. Su escala depende de las unidades.",
          "La correlación de Pearson divide la covarianza por el producto de las desviaciones estándar: queda entre −1 y 1 si ambas son positivas. Ninguna medida demuestra causalidad; dos canales pueden aumentar juntos porque ambos reciben más luz.",
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
          "Para una estandarización ajustada al conjunto de datos, estima la media μ y la desviación σ solo en entrenamiento. Con σ > 0, aplica z = (x − μ)/σ usando las mismas estadísticas en validación, prueba y producción. Incluir la prueba en el ajuste filtra información reservada.",
          "Declara los ejes: «por canal» puede significar promediar sobre imágenes, filas y columnas, conservando un par (μ, σ) para cada color. No equivale a calcular un único par para todos los canales ni a recalcularlo en cada imagen.",
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
          "Correcto: la media utiliza la magnitud del extremo; la mediana depende de la posición ordenada.",
          "Su sensibilidad a extremos es diferente.",
          "Al menos la media cambiará salvo casos especiales.",
        ],
      },
      {
        id: "s2-zscore",
        prompt: "Una intensidad x coincide con la media μ del entrenamiento y la desviación estándar σ es positiva. ¿Qué puntuación estandarizada (z-score) recibe?",
        options: ["−1", "0", "1", "σ"],
        correctIndex: 1,
        feedback: [
          "Eso correspondería a una desviación por debajo de la media.",
          "Correcto: z = (x − μ)/σ; si x es la media, su distancia a la media es cero.",
          "Uno indica una desviación estándar por encima.",
          "σ mide dispersión; se usa como divisor, no como puntuación de un valor igual a la media.",
        ],
      },
      {
        id: "s2-leakage-stats",
        prompt: "Vas a fijar la media y la desviación estándar de las entradas antes de evaluar un modelo. ¿Con qué datos debes estimarlas?",
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
          "Para 0 < p ≤ 1, log(p) ≤ 0 y log(1) = 0. El logaritmo real de 0 no está definido; cuando p se acerca a 0 por la derecha, log(p) tiende a −∞. Calcula los logaritmos antes de que un producto se redondee a cero.",
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
          "Para puntuaciones finitas xᵢ, toma m = max(xᵢ). En softmax usa exp(xᵢ − m) / ∑ⱼ exp(xⱼ − m): el factor exp(−m) se cancela en el cociente. Ningún exponente es positivo y al menos un término vale exp(0) = 1.",
          "Para calcular log(∑ᵢ exp(xᵢ)), en cambio, devuelve m + log(∑ᵢ exp(xᵢ − m)). Aquí no hay un cociente que cancele el factor: hay que sumar m al final.",
        ],
      },
      {
        title: "Epsilon no es decoración",
        paragraphs: [
          "Un suelo positivo ε en log(max(p, ε)) evita log(0), pero da el mismo valor a todas las probabilidades menores que ε. Un ε demasiado grande introduce sesgo; uno demasiado pequeño puede redondearse a cero en el tipo usado.",
          "Para localizar NaN (valor no numérico) o infinito, inspecciona entradas y salidas de cada operación hasta encontrar la primera que recibe datos finitos y devuelve uno no finito. Ahí comprueba denominadores, dominios de logaritmos y rangos de exponenciales antes de añadir ε.",
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
        prompt: "Si a y b son probabilidades estrictamente positivas, ¿qué identidad permite trabajar con su producto en el dominio logarítmico?",
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
        prompt: "Una implementación sustituye log(p) por log(max(p, ε)) con 0 < ε < 1 y p entre 0 y 1. ¿Qué gana y qué cambia?",
        options: ["Recupera exactamente la probabilidad original si hubo underflow", "Evita log(0), pero modifica el valor cuando p < ε", "Garantiza probabilidades calibradas", "Es equivalente a log_softmax para cualquier ε"],
        correctIndex: 1,
        feedback: [
          "No puede distinguir las probabilidades que se redondearon a cero.",
          "Correcto: se impone un suelo. En clasificación con logits es preferible calcular log_softmax directamente si se quiere la log-probabilidad sin ese recorte.",
          "La calibración se contrasta con frecuencias en ejemplos representativos.",
          "log_softmax usa log-sum-exp sobre logits, no fija un suelo arbitrario a p.",
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
