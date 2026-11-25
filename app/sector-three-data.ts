import type { SectorLesson } from "@/app/course-data";

export const sectorThreeLessons: SectorLesson[] = [
  {
    id: "03.01",
    navTitle: "Aritmética de píxeles",
    title: "Sumar luz sin romper la imagen",
    objective: "Aplicar suma, resta, escala y mezcla de imágenes entendiendo dtype, saturación y desbordamiento.",
    lead: "Aclarar una imagen parece tan sencillo como sumar un número. Lo es, hasta que 250 + 10 se convierte en 4. Antes de filtrar nada, hay que dominar qué ocurre con cada píxel y con el recipiente que lo guarda.",
    keyIdea: "Las operaciones píxel a píxel no miran a los vecinos; transforman cada posición, pero el dtype decide qué valores pueden sobrevivir.",
    sections: [
      {
        title: "La misma suma puede dar dos respuestas",
        paragraphs: [
          "250 + 10 vale 260. Con entrada y salida uint8, cv.add satura en 255; la suma elemento a elemento de dos arrays uint8 de NumPy conserva 260 módulo 256, es decir, 4.",
          "Si quieres saturar en NumPy, convierte los operandos a int16, suma, recorta a [0, 255] y vuelve a uint8. Recortar después de sumar en uint8 ya no sirve: el 4 parece una intensidad válida.",
        ],
        formula: {
          label: "TRANSFORMACIÓN LINEAL",
          value: "salida = α · entrada + β",
          parts: ["α cambia contraste", "β cambia brillo", "clip protege el rango"],
        },
      },
      {
        title: "Suma, resta y diferencia",
        paragraphs: [
          "Con aritmética con signo, un píxel que pasa de 100 a 70 da actual − anterior = −30: se ha oscurecido. La diferencia absoluta vale 30 tanto para ese cambio como para uno de 70 a 100; mide cuánto cambió, no en qué sentido.",
          "Ni la resta ni su magnitud identifican la causa. Con imágenes alineadas puede haber cambios de luz o ruido; si la cámara se movió y no se alinearon bien, también aparecerán diferencias en objetos inmóviles.",
        ],
      },
      {
        title: "Mezclar no es pegar",
        paragraphs: [
          "En α·A + β·B + γ, A y B son intensidades en la misma posición de dos imágenes alineadas; α y β son sus pesos y γ es un desplazamiento. Con pesos no negativos que suman 1 y γ = 0, la salida queda entre A y B.",
          "Unos pesos constantes mezclan toda la imagen. Para pegar una pieza opaca solo dentro de su silueta, usa una máscara que elija A dentro y B fuera.",
        ],
      },
    ],
    takeaways: [
      "El dtype y la política de recorte forman parte de la operación.",
      "Una operación píxel a píxel conserva la organización espacial.",
      "La diferencia detecta cambio numérico, no su significado.",
    ],
    questions: [
      {
        id: "s3-saturated-addition",
        prompt: "En una suma saturada uint8, ¿cuál es el resultado de 250 + 10?",
        options: ["4", "255", "260", "0"],
        correctIndex: 1,
        feedback: [
          "Ese es el resultado de envolver módulo 256, no de saturar.",
          "Correcto: la suma da 260; la saturación guarda 255, el máximo de uint8.",
          "El cálculo intermedio vale 260, pero no cabe en la salida uint8 saturada.",
          "Saturar al límite superior no produce cero.",
        ],
      },
      {
        id: "s3-linear-brightness",
        prompt: "En salida = α·entrada + β, ¿qué parámetro añade normalmente un desplazamiento de brillo?",
        options: ["α", "β", "El ancho", "El número de canales"],
        correctIndex: 1,
        feedback: [
          "α multiplica las diferencias y suele controlar el contraste lineal.",
          "Correcto: β desplaza todas las intensidades por igual antes del recorte.",
          "La resolución no forma parte de esta transformación puntual.",
          "La fórmula puede aplicarse por canal, pero el número de canales no es el desplazamiento.",
        ],
      },
      {
        id: "s3-difference-meaning",
        prompt: "Una diferencia grande entre dos imágenes consecutivas demuestra por sí sola que hay un objeto nuevo. ¿Es correcto?",
        options: ["Sí, siempre", "Solo en RGB", "No: también puede deberse a cámara, luz o ruido", "Sí, si usamos float"],
        correctIndex: 2,
        feedback: [
          "La resta detecta discrepancias, pero no identifica su causa.",
          "Los canales de color no eliminan los cambios de iluminación o registro.",
          "Correcto: primero hay que controlar alineación, iluminación y ruido.",
          "Float evita ciertos problemas numéricos, no convierte la diferencia en una explicación semántica.",
        ],
      },
    ],
    lab: "pixel-arithmetic",
    labTitle: "Empuja el rango",
    labInstruction: "Ajusta ganancia y brillo; compara recorte saturado y envoltura uint8 en los píxeles que sobrepasan 255.",
    sources: [
      { label: "OpenCV · Arithmetic Operations on Images", url: "https://docs.opencv.org/4.x/d0/d86/tutorial_py_image_arithmetics.html" },
      { label: "NumPy · Data types", url: "https://numpy.org/doc/stable/user/basics.types.html" },
    ],
  },
  {
    id: "03.02",
    navTitle: "Curvas de intensidad",
    title: "Cambiar el tono sin mirar alrededor",
    objective: "Distinguir brillo, contraste, gamma y tablas de consulta como transformaciones puntuales.",
    lead: "Una fotografía oscura no siempre necesita sumar luz a todo. A veces conviene levantar sobre todo las sombras, proteger las zonas claras o diseñar una curva exacta que se aplique a millones de píxeles.",
    keyIdea: "Una transformación puntual decide la salida usando únicamente el valor del píxel actual; su curva describe todo el comportamiento.",
    sections: [
      {
        title: "La curva es una máquina de traducción",
        paragraphs: [
          "Con la intensidad de entrada en horizontal y la de salida en vertical, y = x deja cada tono igual. Subir la curva aclara; una pendiente mayor separa más dos tonos próximos. Si el resultado se recorta al máximo, varios tonos producen el mismo blanco y se pierde su diferencia.",
          "Como no se consulta el vecindario, dos píxeles con el mismo valor reciben exactamente el mismo resultado aunque estén en lugares distintos.",
        ],
      },
      {
        title: "Gamma curva, no desplaza",
        paragraphs: [
          "Con entrada en [0, 1] y salida = entrada^γ, 0 < γ < 1 aclara los tonos intermedios y γ > 1 los oscurece. Por ejemplo, para entrada 0,25, el exponente 0,5 da 0,5 y el exponente 2 da 0,0625. Algunos sistemas usan 1/γ: el mismo parámetro entonces tiene el efecto contrario.",
        ],
        formula: {
          label: "GAMMA EN RANGO 0–1",
          value: "salida = entradaᵞ",
          parts: ["γ < 1 aclara", "γ = 1 identidad", "γ > 1 oscurece"],
        },
      },
      {
        title: "Una LUT cambia cálculo por memoria",
        paragraphs: [
          "Para una imagen uint8 solo existen 256 entradas posibles por canal. Puedes precalcular la salida de cada una en una tabla de consulta o LUT y después reemplazar cada píxel mediante esa tabla.",
          "La intensidad sirve de índice: todos los píxeles de valor 80 consultan la misma casilla, estén al sol o a la sombra. Una sola tabla ahorra cálculo, pero no distingue la posición ni recupera niveles ya saturados.",
        ],
      },
    ],
    takeaways: [
      "Brillo y contraste lineal son casos de α·I + β.",
      "Gamma modifica de forma no lineal la relación entrada-salida.",
      "Una LUT implementa cualquier mapeo puntual discreto y repetible.",
    ],
    questions: [
      {
        id: "s3-gamma-convention",
        prompt: "Usando salida = entrada^γ con intensidades entre 0 y 1, ¿qué suele hacer γ = 0,5?",
        options: ["Aclarar tonos intermedios", "Oscurecer toda la imagen", "Detectar bordes", "Aumentar la resolución"],
        correctIndex: 0,
        feedback: [
          "Correcto: la raíz cuadrada eleva los valores intermedios.",
          "Con esta fórmula, los oscurece γ mayor que 1.",
          "Gamma es puntual y no compara píxeles vecinos.",
          "La cantidad de píxeles no cambia.",
        ],
      },
      {
        id: "s3-point-transform",
        prompt: "Una vez fijada una curva de tonos global, ¿qué dato consulta para calcular cada píxel de salida?",
        options: ["Toda la imagen", "Solo el píxel de entrada correspondiente", "Los ocho vecinos", "La etiqueta de clase"],
        correctIndex: 1,
        feedback: [
          "Eso describiría una operación global.",
          "Correcto: la posición puede procesarse de forma independiente.",
          "Consultar vecinos caracteriza a un filtro espacial.",
          "No necesita una anotación semántica.",
        ],
      },
      {
        id: "s3-lut-limit",
        prompt: "Aplicas a toda una imagen uint8 la misma tabla de consulta (LUT), indexada por intensidad. ¿Qué no puede hacer esa tabla por sí sola?",
        options: ["Aplicar una curva gamma", "Invertir intensidades", "Corregir de forma distinta dos zonas con el mismo valor", "Acelerar un mapeo uint8"],
        correctIndex: 2,
        feedback: [
          "Una LUT puede guardar esa curva.",
          "Basta mapear I a 255 − I.",
          "Correcto: si la entrada es igual, una única LUT entrega la misma salida sin conocer la posición.",
          "Precisamente evita recalcular la función para cada píxel.",
        ],
      },
    ],
    lab: "tone-curve",
    labTitle: "Dibuja la traducción tonal",
    labInstruction: "Mueve contraste, brillo y gamma. Observa la curva y qué entradas terminan recortadas.",
    sources: [
      { label: "scikit-image · Exposure adjustment", url: "https://scikit-image.org/docs/stable/api/skimage.exposure.html" },
      { label: "scikit-image · Gamma and log contrast", url: "https://scikit-image.org/docs/stable/auto_examples/color_exposure/plot_log_gamma.html" },
    ],
  },
  {
    id: "03.03",
    navTitle: "Máscaras y umbrales",
    title: "Decidir dónde opera la imagen",
    objective: "Crear máscaras mediante comparaciones y utilizarlas para seleccionar, combinar o limitar operaciones.",
    lead: "Una máscara es como una plantilla de pintar: deja pasar la operación en unas posiciones y protege las demás. Convierte una condición numérica en una geometría utilizable.",
    keyIdea: "Una máscara responde ‘sí o no’ por píxel; no es todavía una detección inteligente y su calidad depende de la regla que la creó.",
    sections: [
      {
        title: "Comparar produce una imagen booleana",
        paragraphs: [
          "En una imagen de grises, imagen > T genera una máscara: verdadero si la intensidad supera T y falso si es menor o igual. Sobre dos máscaras alineadas, AND selecciona lo común; OR, lo que está en al menos una; XOR, lo que está en exactamente una. NOT invierte una sola máscara.",
        ],
        formula: {
          label: "UMBRAL GLOBAL",
          value: "M(x,y) = I(x,y) > T",
          parts: ["I = intensidad", "T = umbral", "M = máscara"],
        },
      },
      {
        title: "Seleccionar y mezclar son cosas diferentes",
        paragraphs: [
          "En M·A + (1−M)·B, M = 1 elige A y M = 0 elige B. Con alfa intermedio, por ejemplo M = 0,25, se mezcla un 25 % de A con un 75 % de B. Calcula en coma flotante antes de redondear.",
          "Una máscara uint8 con 0 y 255 sirve como selección por cero/no cero. Para usarla como peso de mezcla, conviértela a float y divídela por 255: el peso debe estar entre 0 y 1. Una operación bit a bit no calcula esa mezcla.",
        ],
      },
      {
        title: "Un único umbral no entiende la iluminación",
        paragraphs: [
          "Otsu divide el histograma en dos grupos con un umbral global T que minimiza la varianza interna ponderada, o equivalentemente maximiza la varianza entre grupos. No exige que T esté justo a mitad de dos picos.",
          "Si el fondo iluminado y el objeto en sombra tienen intensidades parecidas, un solo T no los distingue. Un umbral adaptativo se estima con vecinos de cada zona y puede seguir una iluminación que varía lentamente.",
        ],
      },
    ],
    takeaways: [
      "Una comparación por píxel puede convertirse en máscara.",
      "Las máscaras combinan regiones mediante lógica booleana o alfa.",
      "La iluminación desigual suele romper un umbral global fijo.",
      "Otsu automatiza un umbral global; no elimina por sí mismo la iluminación desigual.",
    ],
    questions: [
      {
        id: "s3-mask-and",
        prompt: "Quieres conservar únicamente los píxeles que cumplen dos condiciones a la vez. ¿Qué operación lógica usarías?",
        options: ["OR", "AND", "NOT", "XOR"],
        correctIndex: 1,
        feedback: [
          "OR acepta los píxeles que cumplen al menos una condición.",
          "Correcto: AND exige que ambas máscaras sean verdaderas.",
          "NOT invierte una única selección.",
          "XOR excluye precisamente la intersección común.",
        ],
      },
      {
        id: "s3-global-threshold-fail",
        prompt: "¿Cuándo es especialmente probable que falle un único umbral global?",
        options: ["Con iluminación desigual", "En una imagen cuadrada", "Cuando usamos float", "Con una máscara binaria"],
        correctIndex: 0,
        feedback: [
          "Correcto: el mismo material puede adoptar valores distintos según la zona iluminada.",
          "La relación entre ancho y alto no determina la separación tonal.",
          "El dtype no resuelve por sí solo la variación espacial de luz.",
          "La máscara es la salida, no la causa del problema.",
        ],
      },
      {
        id: "s3-otsu-global",
        prompt: "Otsu ha elegido automáticamente un umbral. ¿Qué límite conserva ese resultado?",
        options: ["Sigue siendo un único umbral global", "La iluminación desigual queda corregida", "Reconoce el objeto por su forma", "Elige un umbral distinto por píxel"],
        correctIndex: 0,
        feedback: [
          "Correcto: se optimiza una separación tonal global, no una regla espacial ni semántica.",
          "Otsu no compensa una luz que cambia de una zona a otra.",
          "El histograma no conserva la forma ni la ubicación de los objetos.",
          "Eso describe una regla local o adaptativa, no Otsu global.",
        ],
      },
    ],
    lab: "masks",
    labTitle: "Umbral manual y Otsu",
    labInstruction: "Compara tu umbral con el calculado por Otsu. Cambia la iluminación y observa que ambos siguen siendo globales.",
    sources: [
      { label: "OpenCV · Image Thresholding", url: "https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html" },
      { label: "OpenCV · Arithmetic and bitwise operations", url: "https://docs.opencv.org/4.x/d0/d86/tutorial_py_image_arithmetics.html" },
    ],
  },
  {
    id: "03.04",
    navTitle: "Vecindarios y kernels",
    title: "Una pequeña ventana que recorre la imagen",
    objective: "Calcular manualmente la respuesta de un kernel y relacionar pesos, tamaño y comportamiento.",
    lead: "Hasta ahora cada píxel vivía solo. Un filtro espacial coloca una pequeña plantilla sobre su vecindario, hace una cuenta y mueve la plantilla a la siguiente posición.",
    keyIdea: "Un filtro lineal produce en cada posición una suma ponderada del vecindario; los pesos del kernel deciden qué patrón refuerza o elimina.",
    sections: [
      {
        title: "Multiplicar, sumar y desplazar",
        paragraphs: [
          "Se alinea el ancla del kernel con la posición de salida, se multiplica cada intensidad cubierta por su peso y se suman los productos. Para la ventana [10, 20, 50] y los pesos [¼, ½, ¼] con ancla central, se escribe 2,5 + 10 + 12,5 = 25 en la posición del 20. Al deslizar la ventana se repiten los mismos pesos.",
        ],
        formula: {
          label: "RESPUESTA LOCAL",
          value: "R = Σ vecindarioᵢ · kernelᵢ",
          parts: ["alinear", "multiplicar", "sumar"],
        },
      },
      {
        title: "La suma de pesos ofrece una pista",
        paragraphs: [
          "Si todas las muestras bajo el kernel valen c, la salida es c por la suma de pesos: con suma 1 queda c; con suma 0 queda 0. Un promedio 3×3, por ejemplo, usa nueve pesos de 1/9.",
          "Es una pista, no una descripción completa. La disposición y el signo de los pesos determinan la orientación y las frecuencias a las que responde el filtro.",
        ],
      },
      {
        title: "Más tamaño significa más contexto",
        paragraphs: [
          "Un kernel 7×7 consulta una zona mayor que uno 3×3. Puede eliminar variaciones más amplias, pero también borrar detalles y requerir más multiplicaciones por píxel.",
          "Algunos kernels son separables: el filtro 2D puede ejecutarse como uno horizontal y otro vertical. Entonces el coste pasa aproximadamente de k² a 2k operaciones por posición.",
        ],
      },
    ],
    takeaways: [
      "Un kernel lineal calcula una suma ponderada local.",
      "La suma de pesos ayuda a anticipar qué ocurre en regiones constantes.",
      "Tamaño, forma y separabilidad influyen en señal y coste.",
    ],
    questions: [
      {
        id: "s3-kernel-constant",
        prompt: "Todos los píxeles bajo un kernel valen 80. Sus pesos suman 1 y no se añade ningún sesgo. ¿Qué salida esperas?",
        options: ["Quedar cerca de 80", "Convertirse siempre en 0", "Duplicarse", "Cambiar de resolución"],
        correctIndex: 0,
        feedback: [
          "Correcto: 80 multiplicado por una suma total de 1 sigue siendo 80.",
          "Eso es típico de kernels de suma cero, no de suma uno.",
          "Para duplicarse los pesos deberían sumar 2.",
          "El kernel descrito calcula valores, no redimensiona la cuadrícula.",
        ],
      },
      {
        id: "s3-kernel-operation",
        prompt: "¿Qué hace un filtro lineal en cada posición?",
        options: ["Ordena todos los píxeles de la imagen", "Calcula una suma ponderada del vecindario", "Entrena una red", "Cambia el formato del archivo"],
        correctIndex: 1,
        feedback: [
          "Un filtro lineal no ordena los valores: el peso depende de la posición del vecino, no de su puesto por intensidad.",
          "Correcto: cada vecino aporta su intensidad multiplicada por el peso del kernel en esa posición.",
          "La operación puede aparecer en redes, pero por sí misma no es entrenamiento.",
          "Trabaja sobre los datos ya decodificados.",
        ],
      },
      {
        id: "s3-separable-cost",
        prompt: "¿Cuál es la principal ventaja computacional de un kernel separable k×k?",
        options: ["No necesita bordes", "Puede aplicarse con dos filtros 1D", "Siempre conserva bordes", "Funciona solo en RGB"],
        correctIndex: 1,
        feedback: [
          "También necesita una política para los límites.",
          "Correcto: reduce aproximadamente k² multiplicaciones a 2k por posición.",
          "Separabilidad describe la factorización, no la preservación de discontinuidades.",
          "Puede aplicarse a imágenes de uno o varios canales.",
        ],
      },
    ],
    lab: "kernel-window",
    labTitle: "Haz la cuenta del centro",
    labInstruction: "Elige un kernel y observa producto a producto cómo su vecindario genera un único píxel de salida.",
    sources: [
      { label: "OpenCV · Image Filtering reference", url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html" },
      { label: "OpenCV · Smoothing Images", url: "https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html" },
    ],
  },
  {
    id: "03.05",
    navTitle: "Correlación y bordes",
    title: "El detalle que cambia la dirección",
    objective: "Diferenciar correlación y convolución, entender ancla y elegir una política de padding consciente.",
    lead: "Muchas APIs llaman convolución a una operación que no gira el kernel. Con filtros simétricos no lo notarás; con un detector orientado puedes invertir la respuesta sin saber por qué.",
    keyIdea: "La convolución invierte el kernel antes de desplazarlo; la correlación lo usa tal cual. En los límites, ambas necesitan inventar valores exteriores o reducir la salida.",
    sections: [
      {
        title: "Girar o no girar",
        paragraphs: [
          "La correlación usa los pesos tal como están escritos; la convolución invierte los dos ejes del kernel (giro de 180°). Con ancla central y el mismo borde, un gaussiano centrado da lo mismo en ambas. En cambio, [-1, 0, 1] pasa a [1, 0, -1]: las respuestas tienen signos opuestos.",
          "cv.filter2D de OpenCV hace correlación. Para aplicar una convolución con un kernel no simétrico hay que invertirlo y, si el ancla no era central, reflejar también su posición.",
        ],
        formula: {
          label: "DIFERENCIA OPERATIVA",
          value: "convolución = correlación con K girado",
          parts: ["giro horizontal", "giro vertical", "misma suma local"],
        },
      },
      {
        title: "El ancla dice dónde escribir",
        paragraphs: [
          "El ancla fija a qué posición de salida se asigna la suma de una ventana. Si la ventana cubre las columnas 10, 11 y 12, con ancla central el resultado se escribe en la 11; con ancla izquierda, en la 10. No han cambiado los pesos ni las muestras de esa ventana, solo la alineación.",
        ],
      },
      {
        title: "Fuera de la foto también hay una decisión",
        paragraphs: [
          "Fuera de la imagen, constant usa un valor fijo, replicate prolonga el píxel de borde y reflect refleja los valores del interior. En modo valid no se inventan vecinos: solo se calcula donde cabe la ventana y la salida se reduce. Rellenar con ceros una región clara crea un salto falso en el marco; un detector puede confundirlo con un contorno real.",
        ],
      },
    ],
    takeaways: [
      "Convolución y correlación difieren por el giro del kernel.",
      "Los kernels simétricos ocultan esa diferencia.",
      "El padding modifica los resultados cerca de los límites.",
    ],
    questions: [
      {
        id: "s3-filter2d-correlation",
        prompt: "Pasas un kernel asimétrico a cv.filter2D de OpenCV sin modificar sus pesos. ¿Qué operación ejecuta?",
        options: ["Correlación sin girarlo", "Convolución girándolo siempre", "Producto matricial", "Mediana local"],
        correctIndex: 0,
        feedback: [
          "Correcto: para una convolución verdadera hay que girar explícitamente un kernel no simétrico.",
          "OpenCV no lo refleja automáticamente en filter2D.",
          "Se trata de una suma ponderada deslizante, no de A @ B.",
          "La mediana es un filtro no lineal distinto.",
        ],
      },
      {
        id: "s3-symmetric-kernel",
        prompt: "Con ancla central, igual borde y kernels de dimensiones impares, ¿qué condición garantiza que correlación y convolución coincidan para cualquier imagen?",
        options: ["El kernel no cambia al girarlo 180°", "Solo puede medir 1×1", "Sus pesos suman cero", "Ninguna condición lo garantiza"],
        correctIndex: 0,
        feedback: [
          "Correcto: si el giro deja K igual, ambas operaciones coinciden.",
          "Un 1×1 es simétrico, pero no es el único caso.",
          "La suma no garantiza simetría espacial.",
          "Los Gaussian centrados son un contraejemplo habitual.",
        ],
      },
      {
        id: "s3-zero-padding-artifact",
        prompt: "¿Qué artefacto puede introducir padding constante a cero en una imagen clara?",
        options: ["Un borde oscuro artificial", "Más detalle real", "Una rotación", "Canales nuevos"],
        correctIndex: 0,
        feedback: [
          "Correcto: el filtro ve una transición inexistente entre la imagen clara y el exterior negro.",
          "El padding no recupera información fuera del encuadre.",
          "No cambia las coordenadas internas de esa manera.",
          "Añade muestras espaciales temporales, no canales semánticos.",
        ],
      },
    ],
    lab: "correlation",
    labTitle: "Gira el detector",
    labInstruction: "Desplaza un kernel asimétrico por una señal y alterna correlación, convolución y modo de borde.",
    sources: [
      { label: "OpenCV · filter2D reference", url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html" },
      { label: "SciPy · ndimage.convolve", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.convolve.html" },
      { label: "SciPy · ndimage.correlate", url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.ndimage.correlate.html" },
    ],
  },
  {
    id: "03.06",
    navTitle: "Promedio y Gaussian",
    title: "Suavizar pagando con detalle",
    objective: "Comparar box blur y Gaussian, interpretar tamaño y sigma y aprovechar filtros separables.",
    lead: "Suavizar consiste en desconfiar de cada píxel aislado y pedir opinión a sus vecinos. Ayuda contra el ruido, pero todo acuerdo local borra también parte de las transiciones reales.",
    keyIdea: "Un filtro paso bajo reduce cambios rápidos; el promedio reparte el peso por igual y el Gaussian concede más influencia a los vecinos cercanos.",
    sections: [
      {
        title: "El promedio trata a todos por igual",
        paragraphs: [
          "Un filtro de caja normalizado sustituye cada píxel por la media de la ventana: en 3×3 cada una de las nueve muestras pesa 1/9. Una ventana mayor promedia más fluctuaciones, pero mezcla los dos lados de un borde y puede borrar líneas delgadas.",
        ],
      },
      {
        title: "Gaussian crea un vecindario con jerarquía",
        paragraphs: [
          "El kernel Gaussian da el mayor peso al centro y reduce suavemente la influencia con la distancia. Sigma controla la extensión efectiva: sigma pequeño concentra el peso; sigma grande mezcla una zona más amplia.",
          "El tamaño del kernel debe abarcar suficientemente esa distribución. Recortarlo demasiado ignora parte de la cola; hacerlo enorme añade coste con contribuciones casi nulas.",
        ],
        formula: {
          label: "PESO GAUSSIANO",
          value: "w(r) ∝ exp(−r² / 2σ²)",
          parts: ["centro pesa más", "σ abre la campana", "pesos normalizados"],
        },
      },
      {
        title: "Suavizar antes de medir",
        paragraphs: [
          "Los detectores de gradiente amplifican variaciones rápidas, incluido el ruido. Un suavizado moderado previo puede estabilizar los bordes; uno excesivo elimina precisamente el defecto fino que querías detectar.",
          "El Gaussian es separable: una pasada horizontal y otra vertical reproducen el filtro 2D ideal con menos cálculo. Esta propiedad importa cuando la resolución o la latencia crecen.",
        ],
      },
    ],
    takeaways: [
      "Promedio y Gaussian son filtros paso bajo.",
      "Sigma determina la escala del suavizado Gaussian.",
      "Reducir ruido siempre negocia contra conservar detalle.",
    ],
    questions: [
      {
        id: "s3-box-vs-gaussian",
        prompt: "¿Cuál es la diferencia principal entre box blur y Gaussian blur?",
        options: ["El box usa pesos iguales y el Gaussian favorece el centro", "El Gaussian no usa vecinos", "El box conserva todos los bordes", "Solo el box es lineal"],
        correctIndex: 0,
        feedback: [
          "Correcto: ambos promedian, pero distribuyen la influencia de forma distinta.",
          "Precisamente pondera un vecindario espacial.",
          "El promedio también difumina transiciones.",
          "Ambos son filtros lineales.",
        ],
      },
      {
        id: "s3-gaussian-sigma",
        prompt: "En un filtro gaussiano, con una ventana suficientemente grande, ¿qué efecto tiene aumentar la desviación espacial sigma?",
        options: ["Suavizado más amplio", "Más resolución", "Un umbral binario", "Inversión del kernel"],
        correctIndex: 0,
        feedback: [
          "Correcto: el peso significativo se reparte a distancias mayores.",
          "No aparecen píxeles nuevos.",
          "Gaussian produce intensidades continuas, no una decisión sí/no.",
          "El kernel sigue siendo simétrico.",
        ],
      },
      {
        id: "s3-blur-before-gradient",
        prompt: "¿Por qué se usa a veces un Gaussian moderado antes de calcular gradientes?",
        options: ["Para reducir respuestas al ruido", "Para añadir clases", "Para evitar cualquier borde", "Para convertir RGB en BGR"],
        correctIndex: 0,
        feedback: [
          "Correcto: el ruido también contiene cambios rápidos que un derivador amplificaría.",
          "No interviene en las etiquetas.",
          "Se busca estabilizarlos, no borrarlos todos.",
          "El orden de canales es independiente del suavizado.",
        ],
      },
    ],
    lab: "linear-smoothing",
    labTitle: "Negocia ruido por detalle",
    labInstruction: "Compara promedio y Gaussian con varios tamaños. Observa cómo cambia una señal fina junto a una zona ruidosa.",
    sources: [
      { label: "OpenCV · Smoothing Images", url: "https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html" },
      { label: "OpenCV · GaussianBlur reference", url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html" },
    ],
  },
  {
    id: "03.07",
    navTitle: "Mediana y bilateral",
    title: "No todo ruido se elimina promediando",
    objective: "Relacionar tipos de ruido con filtros de mediana y bilateral, evaluando preservación de bordes y coste.",
    lead: "Si una foto tiene puntos blancos y negros aislados, promediarlos reparte su error entre los vecinos. A veces conviene ignorar al valor extremo en lugar de invitarlo a la media.",
    keyIdea: "La mediana combate valores impulsivos mediante orden; el bilateral pondera distancia espacial y similitud de intensidad para no mezclar fácilmente a través de un borde.",
    sections: [
      {
        title: "La mediana elige, no inventa",
        paragraphs: [
          "En [20, 21, 22, 23, 255], la media vale 341/5 = 68,2; la mediana es el valor central ordenado, 22. La magnitud del impulso 255 arrastra la media, pero no cambia la posición central. Esta ventaja también es un riesgo: si un punto brillante es un defecto real y pocos vecinos lo comparten, la mediana puede borrarlo.",
        ],
      },
      {
        title: "Bilateral pregunta distancia y parecido",
        paragraphs: [
          "El filtro bilateral da más peso a píxeles cercanos y, además, a los que tienen intensidad o color parecido al centro. Dos vecinos separados por un borde fuerte influyen poco aunque estén pegados.",
          "Dentro de la ventana, sigmaSpace regula cuánto cae el peso con la distancia en píxeles; sigmaColor, cuánto cae con la diferencia de intensidad o color. Subir solo sigmaColor permite mezclar vecinos de tonos más distintos y puede desdibujar un borde.",
        ],
        formula: {
          label: "PESO BILATERAL",
          value: "peso = cercanía espacial × cercanía tonal",
          parts: ["sigmaSpace", "sigmaColor", "normalización local"],
        },
      },
      {
        title: "Preservar bordes cuesta",
        paragraphs: [
          "El bilateral suele ser bastante más lento que un Gaussian porque los pesos tonales dependen del píxel central y cambian en cada posición. Ya no basta con reutilizar el mismo kernel fijo.",
          "Compara ambos filtros en las mismas imágenes: mide ruido en regiones uniformes, conservación del contraste en los bordes útiles y tiempo por imagen. El bilateral se justifica si mejora la detección de esos bordes sin superar la latencia disponible.",
        ],
      },
    ],
    takeaways: [
      "La mediana es robusta frente a impulsos aislados.",
      "El bilateral evita mezclar intensidades muy distintas a través de un borde.",
      "Preservar detalle, eliminar ruido y reducir latencia son objetivos en tensión.",
    ],
    questions: [
      {
        id: "s3-salt-pepper-filter",
        prompt: "¿Qué filtro es una primera opción razonable para ruido sal y pimienta?",
        options: ["Mediana", "Promedio de caja", "Gamma", "Umbral global siempre"],
        correctIndex: 0,
        feedback: [
          "Correcto: los impulsos extremos suelen quedar fuera del valor central ordenado.",
          "Un promedio incorpora la amplitud de cada impulso y puede extenderlo a los vecinos.",
          "Gamma remapea intensidades pero conserva los puntos impulsivos.",
          "Un umbral puede convertir el ruido en falsas regiones.",
        ],
      },
      {
        id: "s3-bilateral-weights",
        prompt: "¿Qué dos factores utiliza el filtro bilateral para ponderar un vecino?",
        options: ["Distancia espacial y diferencia tonal", "Anchura y altura", "Clase y confianza", "Media y mediana global"],
        correctIndex: 0,
        feedback: [
          "Correcto: debe estar cerca y parecerse al centro para pesar mucho.",
          "Son dimensiones de la imagen, no los dos términos del peso.",
          "El filtro no necesita predicciones semánticas.",
          "Sus pesos se calculan localmente para cada centro.",
        ],
      },
      {
        id: "s3-bilateral-cost",
        prompt: "¿Por qué el bilateral suele ser más lento que un Gaussian equivalente?",
        options: ["Porque sus pesos dependen también del contenido local", "Porque siempre duplica la resolución", "Porque entrena parámetros", "Porque solo funciona en CPU"],
        correctIndex: 0,
        feedback: [
          "Correcto: la similitud tonal cambia con cada píxel central.",
          "La salida normalmente conserva el tamaño.",
          "Sus sigmas son configurados, no aprendidos mediante backpropagation.",
          "Existen implementaciones aceleradas; la diferencia conceptual no es esa.",
        ],
      },
    ],
    lab: "edge-preserving",
    labTitle: "Rescata el borde del ruido",
    labInstruction: "Aplica promedio, mediana o bilateral a una señal con borde e impulsos; compara cuánto ruido y contraste conserva cada uno.",
    sources: [
      { label: "OpenCV · Median and bilateral filtering", url: "https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html" },
      { label: "OpenCV · bilateralFilter reference", url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html" },
    ],
  },
  {
    id: "03.08",
    navTitle: "Sobel y Scharr",
    title: "Medir hacia dónde cambia la luz",
    objective: "Interpretar derivadas espaciales Gx y Gy y convertirlas en magnitud y orientación del gradiente.",
    lead: "Un borde no es una línea dibujada sobre la foto: es una zona donde la intensidad cambia deprisa. El gradiente mide cuánto cambia y en qué dirección aumenta más.",
    keyIdea: "Gx mide cambio al desplazarse en x y Gy al desplazarse en y; juntos forman un vector perpendicular al borde local.",
    sections: [
      {
        title: "Derivar una imagen discreta",
        paragraphs: [
          "Sobel estima Gx, el cambio de intensidad hacia la derecha, diferenciando en x y suavizando en y. Si la intensidad cambia bruscamente entre columnas pero apenas entre filas, |Gx| es grande y |Gy| pequeño. La frontera se prolonga en vertical: la dirección del cambio cruza la línea, no la sigue.",
        ],
      },
      {
        title: "Magnitud y ángulo cuentan historias distintas",
        paragraphs: [
          "Gx y Gy son las derivadas de intensidad en los ejes x e y. √(Gx² + Gy²) mide la fuerza del cambio; para un gradiente no nulo, atan2(Gy, Gx) da su dirección respecto de +x sin perder el cuadrante. Si y crece hacia abajo en la imagen, los ángulos positivos se ven en sentido horario.",
          "El borde local sigue una línea de intensidad aproximadamente constante: es perpendicular al gradiente. Donde el gradiente es cero no hay una dirección de borde deducible de él.",
        ],
        formula: {
          label: "GRADIENTE 2D",
          value: "|G| = √(Gx² + Gy²)",
          parts: ["θ = atan2(Gy,Gx)", "fuerza", "dirección normal al borde"],
        },
      },
      {
        title: "Signo, dtype y Scharr",
        paragraphs: [
          "La derivada puede ser positiva o negativa según el sentido claro-oscuro. Guardarla directamente en uint8 destruye los valores negativos; conviene usar una profundidad con signo o float y decidir después cómo visualizarla.",
          "Con kernels 3×3, Scharr ofrece una aproximación más precisa y con mejor comportamiento rotacional que Sobel estándar, con un coste similar. No convierte el resultado en semántica: sigue detectando cualquier transición intensa.",
        ],
      },
    ],
    takeaways: [
      "Gx y Gy son componentes del cambio espacial.",
      "El gradiente apunta en la dirección de máximo aumento y es normal al borde.",
      "Una profundidad sin signo puede borrar media respuesta derivativa.",
    ],
    questions: [
      {
        id: "s3-gx-vertical-edge",
        prompt: "En una imagen de grises, la intensidad aumenta bruscamente entre columnas y no cambia entre filas. Si Gx y Gy miden el cambio horizontal y vertical, ¿qué observarás?",
        options: ["|Gx| alto y un borde vertical", "|Gy| alto y un borde horizontal", "Gradiente cero", "Solo un cambio de gamma"],
        correctIndex: 0,
        feedback: [
          "Correcto: cambia en x y la frontera visual es aproximadamente vertical.",
          "Gy responde al cambio al subir o bajar.",
          "Una transición fuerte no es una región constante.",
          "Gamma puede alterar intensidades, pero no describe la medición pedida.",
        ],
      },
      {
        id: "s3-gradient-direction",
        prompt: "¿Cómo se relaciona normalmente la dirección del gradiente con el borde?",
        options: ["Es perpendicular al borde", "Es siempre paralela", "No contiene dirección", "Depende del número de canales únicamente"],
        correctIndex: 0,
        feedback: [
          "Correcto: apunta a través de la transición, no a lo largo de ella.",
          "La orientación del borde se obtiene girando aproximadamente 90°.",
          "Gx y Gy forman un vector con magnitud y ángulo.",
          "Puede calcularse en gris o por canal; la relación geométrica permanece.",
        ],
      },
      {
        id: "s3-signed-gradient",
        prompt: "Estimas con Sobel la derivada horizontal Gx de una imagen. ¿Por qué no conviene guardarla directamente en uint8?",
        options: ["Porque puede contener valores negativos", "Porque uint8 tiene demasiada precisión", "Porque cambia la resolución", "Porque Sobel solo devuelve booleanos"],
        correctIndex: 0,
        feedback: [
          "Correcto: perderías las transiciones con signo contrario.",
          "Ocurre lo contrario: su rango es limitado y sin signo.",
          "El tamaño espacial puede mantenerse.",
          "Sobel devuelve una respuesta numérica, no una máscara binaria.",
        ],
      },
    ],
    lab: "sobel",
    labTitle: "Orienta el borde",
    labInstruction: "Cambia la orientación de la transición y observa Gx, Gy, magnitud y la flecha del gradiente.",
    sources: [
      { label: "OpenCV · Sobel Derivatives", url: "https://docs.opencv.org/4.x/d2/d2c/tutorial_sobel_derivatives.html" },
      { label: "scikit-image · Sobel and Scharr filters", url: "https://scikit-image.org/docs/stable/api/skimage.filters.html" },
    ],
  },
  {
    id: "03.09",
    navTitle: "Laplaciano y enfoque",
    title: "De la segunda derivada al detalle amplificado",
    objective: "Entender el Laplaciano, la máscara de enfoque y los artefactos causados por amplificar alta frecuencia.",
    lead: "Enfocar no inventa información perdida. Toma los cambios rápidos que aún existen, los amplifica y hace que el ojo perciba contornos más marcados; por el camino también puede amplificar ruido y crear halos.",
    keyIdea: "El Laplaciano resume curvatura en x e y; un unsharp mask extrae detalle restando una versión suave y lo suma de nuevo con una ganancia.",
    sections: [
      {
        title: "La segunda derivada reacciona a la curvatura",
        paragraphs: [
          "El Laplaciano suma las segundas derivadas espaciales. En regiones lineales o constantes su respuesta es pequeña; alrededor de transiciones cambia de signo y puede localizar contornos mediante cruces por cero o magnitud.",
          "Las derivadas de segundo orden son especialmente sensibles al ruido. Por eso suele aplicarse un suavizado previo o integrarse la suavidad en un operador como Laplacian of Gaussian.",
        ],
        formula: {
          label: "LAPLACIANO 2D",
          value: "∇²I = ∂²I/∂x² + ∂²I/∂y²",
          parts: ["curvatura en x", "curvatura en y", "alta frecuencia"],
        },
      },
      {
        title: "Unsharp mask: restar para encontrar detalle",
        paragraphs: [
          "En unsharp masking, detalle = original − suavizada y salida = original + amount × detalle. El radio del suavizado fija el ancho de las estructuras que entran en la capa de detalle; amount es la ganancia.",
          "Junto a un escalón, la media suavizada queda por debajo del lado claro y por encima del oscuro. Al sumar demasiado residuo se exageran ambos lados: aparecen franjas claras y oscuras (halos), y también se amplifica el ruido.",
        ],
        formula: {
          label: "MÁSCARA DE ENFOQUE",
          value: "mejorada = original + a·(original − suave)",
          parts: ["detalle = original − suave", "a = cantidad", "recortar al final"],
        },
      },
      {
        title: "Más nítido no significa más verdadero",
        paragraphs: [
          "El enfoque aumenta contraste local, pero no recupera letras borradas ni frecuencias que el sensor nunca capturó. Evaluarlo solo por apariencia puede favorecer una imagen vistosa y perjudicar al modelo.",
          "En visión industrial, conviene medir el efecto sobre el objetivo final: recall de defectos, falsos positivos, estabilidad entre cámaras y sensibilidad a ruido, no solo nitidez visual.",
        ],
      },
    ],
    takeaways: [
      "El Laplaciano es una derivada de segundo orden y amplifica variación rápida.",
      "Unsharp mask suma una versión escalada del detalle de alta frecuencia.",
      "El enfoque puede crear halos y falsas evidencias.",
    ],
    questions: [
      {
        id: "s3-laplacian-order",
        prompt: "¿Qué tipo de derivada utiliza el Laplaciano?",
        options: ["Segunda derivada en x e y", "Solo primera derivada en x", "Ninguna derivada", "Derivada respecto al tiempo"],
        correctIndex: 0,
        feedback: [
          "Correcto: para la intensidad I suma su curvatura espacial en los dos ejes, ∂²I/∂x² + ∂²I/∂y².",
          "Eso sería una única componente de gradiente.",
          "Su propia definición es diferencial.",
          "Aquí opera sobre coordenadas espaciales de una imagen.",
        ],
      },
      {
        id: "s3-unsharp-formula",
        prompt: "En unsharp masking, ¿cómo se obtiene la capa de detalle?",
        options: ["Original − imagen suavizada", "Original + umbral", "Mediana global − original", "FFT sin fase"],
        correctIndex: 0,
        feedback: [
          "Correcto: la resta conserva principalmente cambios que el suavizado eliminó.",
          "Un umbral no separa las escalas espaciales de esa forma.",
          "Restar de una mediana global compara con un único nivel, no con una versión suavizada del mismo vecindario.",
          "Eliminar la fase destruye estructura espacial esencial.",
        ],
      },
      {
        id: "s3-oversharpen-risk",
        prompt: "En unsharp masking sumas a la imagen una capa de detalle multiplicada por amount. ¿Qué riesgo tiene una ganancia demasiado alta?",
        options: ["Halos y ruido amplificado", "Aumento de la resolución espacial", "Desaparecen todos los bordes", "Conversión a tres canales"],
        correctIndex: 0,
        feedback: [
          "Correcto: la capa de alta frecuencia contiene señal y perturbaciones.",
          "No crea muestras espaciales nuevas.",
          "Normalmente los exagera en lugar de eliminarlos.",
          "El número de canales no se deduce del enfoque.",
        ],
      },
    ],
    lab: "sharpen",
    labTitle: "Amplifica sin inventar",
    labInstruction: "Sube la cantidad de detalle y observa cómo aparecen contraste, ruido y halos alrededor de una transición.",
    sources: [
      { label: "OpenCV · Laplace Operator", url: "https://docs.opencv.org/4.x/d5/db5/tutorial_laplace_operator.html" },
      { label: "scikit-image · Unsharp masking", url: "https://scikit-image.org/docs/stable/auto_examples/filters/plot_unsharp_mask.html" },
    ],
  },
  {
    id: "03.10",
    navTitle: "Detector de Canny",
    title: "De cambios gruesos a contornos finos",
    objective: "Reconstruir las etapas de Canny y razonar sobre suavizado, supresión de no máximos e histéresis.",
    lead: "Aplicar Sobel produce bandas de distinta intensidad, no necesariamente un contorno limpio. Canny encadena varias decisiones para obtener bordes finos y conectados.",
    keyIdea: "Canny no es un único kernel: suaviza, calcula gradiente, adelgaza máximos y decide conectividad con dos umbrales.",
    sections: [
      {
        title: "Una cadena de cuatro etapas",
        paragraphs: [
          "En el detector de Canny se suaviza para limitar el ruido y se calcula el gradiente para medir la fuerza y la dirección del cambio. La supresión de no máximos compara la magnitud a ambos lados en la dirección del gradiente y conserva las crestas: así adelgaza las bandas.",
          "Después, la histéresis usa dos umbrales de magnitud: las respuestas fuertes inician bordes y las intermedias solo se conservan si están conectadas a una fuerte.",
        ],
        formula: {
          label: "SECUENCIA CANNY",
          value: "suavizar → gradiente → adelgazar → conectar",
          parts: ["Gaussian", "no máximos", "doble umbral"],
        },
      },
      {
        title: "Dos umbrales protegen la continuidad",
        paragraphs: [
          "Un tramo intermedio se conserva si existe un camino de respuestas por encima del umbral bajo que lo conecte con una respuesta fuerte. No necesita tocarla directamente. Una isla débil sin ese camino se descarta: usar solo el umbral alto rompería el borde y usar solo el bajo aceptaría también la isla.",
        ],
      },
      {
        title: "Los parámetros dependen del dominio",
        paragraphs: [
          "Con umbrales muy bajos, Canny marca como bordes variaciones de textura o ruido. Umbrales muy altos cortan contornos débiles; un suavizado excesivo puede borrar el cambio de intensidad antes de medirlo. Resolución, exposición y tamaño del defecto modifican el ajuste útil.",
          "En producción no conviene ajustar una sola imagen bonita. Debes validar por cámara, material y condiciones, registrando cómo varían continuidad, falsas alarmas y coste.",
        ],
      },
    ],
    takeaways: [
      "Canny es un algoritmo multietapa.",
      "La supresión de no máximos adelgaza la respuesta del gradiente.",
      "La histéresis conserva bordes débiles conectados a bordes fuertes.",
    ],
    questions: [
      {
        id: "s3-canny-order",
        prompt: "¿En qué orden procesa una imagen el detector clásico de Canny para producir bordes finos y conectados?",
        options: ["Suavizado → gradiente → no máximos → histéresis", "Gradiente → histéresis → suavizado → no máximos", "Suavizado → no máximos → gradiente → histéresis", "Histéresis → suavizado → gradiente → no máximos"],
        correctIndex: 0,
        feedback: [
          "Correcto: primero se limita el ruido y se mide el cambio; luego se adelgazan las respuestas y se enlazan por histéresis.",
          "Umbralizar antes de adelgazar marca bandas anchas; suavizar después tampoco evita que el ruido haya entrado en la derivada.",
          "La supresión de no máximos necesita magnitud y dirección del gradiente, aún no calculadas en ese orden.",
          "La histéresis selecciona respuestas de borde ya medidas y adelgazadas, no intensidades de entrada.",
        ],
      },
      {
        id: "s3-canny-weak-edge",
        prompt: "En Canny, tras la supresión de no máximos, la magnitud de un píxel cae entre los dos umbrales. ¿Cuándo lo conserva la histéresis?",
        options: ["Si está conectado a un borde fuerte", "Siempre", "Nunca", "Solo si es blanco puro"],
        correctIndex: 0,
        feedback: [
          "Correcto: la conexión le aporta evidencia de continuidad.",
          "Los débiles aislados se eliminan.",
          "Puede sobrevivir si prolonga una respuesta fuerte.",
          "Se evalúa la fuerza de gradiente y conectividad, no la intensidad RGB final.",
        ],
      },
      {
        id: "s3-canny-low-thresholds",
        prompt: "Si bajas en exceso los dos umbrales de histéresis de Canny en una imagen con ruido, ¿qué suele ocurrir?",
        options: ["Aparecen muchos bordes de ruido o textura", "La imagen gana resolución", "Se elimina cualquier contorno", "Canny se vuelve un filtro Gaussian"],
        correctIndex: 0,
        feedback: [
          "Correcto: demasiadas respuestas pasan como fuertes o conectables.",
          "La cuadrícula no cambia.",
          "Eso encaja más con umbrales excesivamente altos.",
          "Gaussian es solo una de sus etapas previas.",
        ],
      },
    ],
    lab: "canny",
    labTitle: "Conecta solo la evidencia",
    labInstruction: "Mueve los dos umbrales sobre un mapa de gradiente y observa qué bordes son fuertes, débiles conectados o descartados.",
    sources: [
      { label: "OpenCV · Canny Edge Detection", url: "https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html" },
      { label: "scikit-image · Hysteresis threshold", url: "https://scikit-image.org/docs/stable/api/skimage.filters.html" },
    ],
  },
  {
    id: "03.11",
    navTitle: "Dominio de frecuencia",
    title: "Ver una imagen como ritmos espaciales",
    objective: "Relacionar frecuencia espacial con detalle, interpretar magnitud y fase y anticipar filtros paso bajo y alto.",
    lead: "Una pared lisa cambia lentamente; una rejilla fina alterna claro y oscuro muchas veces por centímetro. Fourier describe la imagen como una combinación de esos ritmos espaciales.",
    keyIdea: "Las bajas frecuencias representan variación lenta; las altas concentran bordes, textura fina y ruido. La fase coloca esas componentes en el espacio.",
    sections: [
      {
        title: "De píxeles a componentes periódicas",
        paragraphs: [
          "La transformada discreta de Fourier expresa una señal muestreada como suma de componentes con distintas frecuencias. En 2D, cada componente tiene ritmo y orientación espacial.",
          "Al centrar el espectro, la frecuencia cero (nivel medio) queda en el centro. Cerca aparecen cambios lentos de intensidad; lejos, oscilaciones más rápidas. La dirección de una frecuencia indica hacia dónde oscila el patrón: en unas franjas verticales la intensidad oscila horizontalmente.",
        ],
      },
      {
        title: "Magnitud dice cuánto; fase dice dónde",
        paragraphs: [
          "En la transformada de Fourier, la magnitud mide cuánto aporta cada frecuencia y la fase determina cómo se alinean espacialmente sus oscilaciones. Un desplazamiento circular de la imagen cambia las fases sin cambiar las magnitudes: el mismo espectro de magnitud puede corresponder a píxeles en posiciones distintas.",
        ],
        formula: {
          label: "REPRESENTACIÓN COMPLEJA",
          value: "F(u,v) = magnitud · eⁱ·fase",
          parts: ["cuánto", "dónde", "orientación"],
        },
      },
      {
        title: "Filtrar aquí equivale a filtrar allí",
        paragraphs: [
          "Multiplicar el espectro de la imagen por el del filtro y transformar de vuelta equivale a convolucionar. Con la transformada discreta de Fourier sin relleno se obtiene una convolución circular; para la lineal hay que rellenar lo suficiente para que los extremos no se envuelvan.",
          "Un corte abrupto en frecuencia corresponde a un kernel espacial con lóbulos oscilantes. Su respuesta a un borde puede dejar ondulaciones (ringing). Una transición gradual, como la de un paso bajo gaussiano, reduce ese efecto.",
        ],
      },
    ],
    takeaways: [
      "Frecuencia espacial mide la rapidez de cambio, no el brillo absoluto.",
      "Magnitud y fase son necesarias para describir completamente la señal.",
      "Los filtros con cortes bruscos pueden introducir ringing.",
    ],
    questions: [
      {
        id: "s3-low-frequency",
        prompt: "¿Qué representa principalmente una componente espacial de baja frecuencia?",
        options: ["Una variación suave y amplia", "Un píxel aislado", "Una etiqueta de clase", "El número de canales"],
        correctIndex: 0,
        feedback: [
          "Correcto: una componente de baja frecuencia necesita muchos píxeles para completar un ciclo.",
          "Un impulso aislado contiene un abanico amplio de frecuencias.",
          "Fourier describe señal, no semántica de clase.",
          "Los canales pueden transformarse por separado; no son una frecuencia.",
        ],
      },
      {
        id: "s3-phase-role",
        prompt: "¿Qué información aporta principalmente la fase de Fourier?",
        options: ["La colocación espacial de las componentes", "Solo la intensidad media", "La resolución del sensor", "La clase del objeto"],
        correctIndex: 0,
        feedback: [
          "Correcto: coordina dónde encajan los ritmos para reconstruir la estructura.",
          "La media está asociada a la componente de frecuencia cero.",
          "La resolución condiciona el muestreo, pero no es lo que codifica cada fase.",
          "No existe semántica de objeto incorporada en la transformada.",
        ],
      },
      {
        id: "s3-sharp-frequency-mask",
        prompt: "¿Qué puede provocar un corte rectangular muy brusco en el espectro?",
        options: ["Ringing u ondulaciones", "Etiquetas más precisas siempre", "Conversión automática a RGB", "Desaparición del padding"],
        correctIndex: 0,
        feedback: [
          "Correcto: una frontera abrupta en frecuencia genera oscilaciones espaciales.",
          "Un filtro puede incluso crear artefactos que perjudiquen la tarea.",
          "No cambia por sí mismo la organización de canales.",
          "Los límites siguen requiriendo tratamiento en implementaciones espaciales o de FFT.",
        ],
      },
    ],
    lab: "frequency",
    labTitle: "Desmonta una fila en ritmos",
    labInstruction: "Elige una señal que podría ser una fila de imagen, limita sus frecuencias y compara el espectro con la reconstrucción exacta.",
    sources: [
      { label: "NumPy · Discrete Fourier Transform", url: "https://numpy.org/doc/stable/reference/routines.fft.html" },
      { label: "OpenCV · Fourier Transform", url: "https://docs.opencv.org/4.x/de/dbc/tutorial_py_fourier_transform.html" },
      { label: "scikit-image · Butterworth filtering", url: "https://scikit-image.org/docs/stable/api/skimage.filters.html" },
    ],
  },
  {
    id: "03.12",
    navTitle: "Diseñar el pipeline",
    title: "Elegir operaciones por señal, no por costumbre",
    objective: "Diseñar y defender un pipeline de filtrado atendiendo a defecto, ruido, escala, métricas y latencia.",
    lead: "Saber nombrar veinte filtros no te convierte en arquitecto. El criterio aparece cuando puedes explicar qué señal quieres conservar, qué perturbación quieres retirar y qué daño colateral aceptarás.",
    keyIdea: "Cada operación debe responder a una hipótesis verificable y evaluarse sobre el objetivo final, no porque la imagen resultante parezca más bonita.",
    sections: [
      {
        title: "Empieza por el contrato del problema",
        paragraphs: [
          "Mide el grosor del menor defecto en píxeles y observa si el ruido son impulsos aislados o fluctuaciones extendidas. Comprueba si el contraste varía con la iluminación, si el tipo numérico admite las salidas del filtro y cuánto tiempo por imagen permite la inspección.",
          "Un arañazo de dos píxeles puede desaparecer con un gaussiano que reduce el ruido del fondo. Una mediana elimina impulsos aislados, pero también puede eliminar puntos de igual tamaño que sí son defectos.",
        ],
      },
      {
        title: "Ordenar operaciones cambia el resultado",
        paragraphs: [
          "Suavizar antes de derivar atenúa el ruido que el gradiente confundiría con bordes. Umbralizar primero descarta las diferencias de intensidad: promediar una máscara no equivale a umbralizar la imagen suavizada. Enfocar antes del umbral puede convertir ruido en falsos objetos.",
          "Documenta shape, rango, color y dtype a la entrada y salida de cada etapa. Los contratos numéricos evitan que una operación correcta reciba datos con otra escala o convención.",
        ],
        formula: {
          label: "HIPÓTESIS DE PIPELINE",
          value: "problema → operación → efecto esperado → métrica",
          parts: ["señal útil", "perturbación", "coste y riesgo"],
        },
      },
      {
        title: "Ablación antes que intuición visual",
        paragraphs: [
          "Evalúa las mismas imágenes con y sin el filtro, manteniendo el resto del sistema fijo. Si comparas varios ajustes, escógelos en validación y confirma el elegido en datos reservados. Mide defectos detectados, falsas alarmas y latencia; separa por cámara y por tamaño para no ocultar la pérdida de los defectos más finos.",
        ],
      },
    ],
    takeaways: [
      "La escala de la señal útil limita cuánto puedes filtrar.",
      "El orden y los contratos entre etapas importan tanto como el algoritmo.",
      "Una ablación con métricas decide mejor que la apariencia de una muestra.",
    ],
    questions: [
      {
        id: "s3-tiny-defect-blur",
        prompt: "Tu defecto útil mide dos píxeles. ¿Cuál es el mayor riesgo de aplicar un suavizado fuerte?",
        options: ["Eliminar la propia señal del defecto", "Crear más resolución", "Añadir etiquetas", "Convertirlo en un tensor"],
        correctIndex: 0,
        feedback: [
          "Correcto: el filtro puede tratar el defecto como una variación pequeña que debe suprimir.",
          "El blur no inventa nuevas muestras.",
          "Las anotaciones no cambian por una operación de imagen.",
          "La imagen ya puede representarse como tensor antes o después.",
        ],
      },
      {
        id: "s3-pipeline-evidence",
        prompt: "¿Cuál es la mejor evidencia de que un filtro ayuda al sistema?",
        options: ["Una ablación mejora métricas relevantes en datos representativos", "La primera imagen parece más bonita", "Es un filtro muy conocido", "Tiene más parámetros"],
        correctIndex: 0,
        feedback: [
          "Correcto: compara contra baseline y mide el objetivo real bajo distintas condiciones.",
          "La impresión visual de una muestra puede ocultar pérdidas de señal.",
          "Popularidad no demuestra adecuación al dominio.",
          "Complejidad adicional no garantiza utilidad.",
        ],
      },
      {
        id: "s3-pipeline-interview",
        prompt: "Propones un filtro gaussiano para inspeccionar arañazos finos en tiempo real. ¿Qué justificación permitiría decidir si es adecuado?",
        options: ["Explicar ruido, escala, sigma, coste, bordes y validación", "Decir que siempre funciona", "Omitir alternativas", "Elegir el kernel más grande"],
        correctIndex: 0,
        feedback: [
          "Correcto: vincula la operación con hipótesis, compromisos y evidencia.",
          "Ningún filtro sirve siempre ni sin costes.",
          "Comparar con mediana, bilateral o ningún filtro demuestra criterio.",
          "Más contexto puede destruir detalle y aumentar coste.",
        ],
      },
    ],
    lab: "filter-pipeline",
    labTitle: "Defiende la cadena",
    labInstruction: "Cambia de escenario y compara pipelines. Revisa qué señal protegen, qué riesgo introducen y cómo validarías la decisión.",
    sources: [
      { label: "OpenCV · Image Filtering reference", url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html" },
      { label: "OpenCV · Thresholding", url: "https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html" },
      { label: "scikit-image · Filters API", url: "https://scikit-image.org/docs/stable/api/skimage.filters.html" },
    ],
  },
];
