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
          "En uint8 solo caben enteros entre 0 y 255. OpenCV suele saturar: 250 + 10 termina en 255. Una suma directa de arrays uint8 en NumPy puede envolver el valor módulo 256 y producir 4. La fórmula es idéntica; la regla de almacenamiento cambia el resultado.",
          "En un pipeline seguro es habitual convertir temporalmente a un tipo con más rango, operar, recortar de forma consciente y convertir al tipo final. Así la política deja de ser un efecto secundario oculto.",
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
          "Sumar un escalar eleva intensidades; restarlo las reduce. Restar dos imágenes alineadas resalta lo que ha cambiado entre ellas, pero también recoge movimiento de cámara, variación de iluminación y ruido.",
          "El valor absoluto de la diferencia evita que los cambios negativos desaparezcan. Aun así, una diferencia brillante no explica la causa: solo indica que los valores ya no coinciden.",
        ],
      },
      {
        title: "Mezclar no es pegar",
        paragraphs: [
          "Una mezcla ponderada combina dos imágenes alineadas mediante α·A + β·B + γ. Si α y β suman uno y γ es cero, puedes imaginar una transición transparente entre ambas.",
          "Para superponer una pieza opaca con forma irregular necesitas además una máscara. La aritmética decide cuánto aporta cada imagen; la máscara decide dónde participa cada una.",
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
          "Correcto: 260 supera el máximo y se recorta a 255.",
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
          "En un gráfico entrada-salida, la diagonal significa identidad: cada valor sale igual que entró. Desplazarla hacia arriba aclara; aumentar su pendiente separa más los tonos y eleva el contraste, hasta que el recorte aplasta detalles en negro o blanco.",
          "Como no se consulta el vecindario, dos píxeles con el mismo valor reciben exactamente el mismo resultado aunque estén en lugares distintos.",
        ],
      },
      {
        title: "Gamma curva, no desplaza",
        paragraphs: [
          "Una corrección gamma normaliza la intensidad, aplica una potencia y devuelve el resultado a su rango. Con la convención de scikit-image, salida = entrada^γ: γ menor que 1 aclara los tonos intermedios y γ mayor que 1 los oscurece.",
          "Conviene declarar la convención porque algunos textos o sistemas hablan del exponente inverso. Memorizar solo ‘gamma mayor aclara’ sin saber la fórmula es una receta para equivocarse.",
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
          "La LUT es rápida y reproducible para curvas complejas, pero no recupera detalle ya saturado ni corrige por sí sola una iluminación espacialmente desigual.",
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
        prompt: "¿Qué información utiliza una transformación puntual para calcular un píxel de salida?",
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
        prompt: "¿Qué no puede hacer una LUT puntual por sí sola?",
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
          "La condición imagen > T genera un valor verdadero o falso por posición. En una representación binaria puede visualizarse como 255 y 0, pero conceptualmente es una selección, no una imagen de tonos.",
          "AND conserva lo común a dos máscaras, OR reúne ambas, NOT invierte la selección y XOR conserva lo que pertenece a una sola. Estas operaciones permiten construir regiones complejas a partir de reglas sencillas.",
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
          "Una máscara binaria puede elegir entre fondo y primer plano: salida = M·A + (1−M)·B si M está expresada como 0 o 1. Una máscara suave o alfa permite valores intermedios y crea transiciones graduales.",
          "Los operadores bit a bit son naturales con máscaras enteras, pero aplicarlos directamente sobre intensidades float rara vez expresa la intención correcta. Primero define qué representa cada array.",
        ],
      },
      {
        title: "Un único umbral no entiende la iluminación",
        paragraphs: [
          "Un umbral global funciona cuando objeto y fondo ocupan rangos separables. Si una mitad está en sombra y otra iluminada, el mismo T puede perder objeto en un lado y aceptar fondo en el otro.",
          "Otsu elige automáticamente un único T usando el histograma: entre los umbrales posibles, busca una separación en dos grupos que minimice su dispersión interna ponderada (equivalentemente, maximice la varianza entre grupos). El valor elegido puede no ser el punto medio visual entre dos picos: varios umbrales de un valle vacío pueden rendir igual.",
          "Otsu funciona mejor cuando los grupos tonales se separan bien. No sabe dónde está cada píxel: con iluminación desigual o mucho ruido puede fallar aunque el umbral sea óptimo para ese histograma. El umbral adaptativo calcula umbrales locales; compara ambos en el laboratorio.",
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
          "Superpones el kernel sobre una zona de la imagen, multiplicas cada píxel por el peso que tiene encima y sumas todos los productos. Ese número se escribe en la posición asociada al ancla, normalmente el centro.",
          "Después desplazas la ventana y repites. La misma regla se aplica en todas las posiciones: por eso hablamos de un filtro espacialmente invariante.",
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
          "Si los pesos suman 1, una región completamente uniforme conserva su intensidad. Un promedio 3×3 usa nueve pesos 1/9. Si suman 0, las zonas constantes responden con cero y suelen destacar variaciones como bordes.",
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
        prompt: "Un kernel tiene pesos que suman 1. ¿Qué debería ocurrir idealmente en una región constante de valor 80?",
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
          "Solo un filtro de orden local, como la mediana, ordenaría valores del vecindario.",
          "Correcto: multiplica cada muestra por su peso y suma.",
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
          "La correlación alinea el kernel como está escrito. La convolución lo refleja en ambos ejes antes de aplicar la misma suma ponderada. OpenCV filter2D calcula realmente correlación, aunque parte de su documentación use el verbo convolucionar.",
          "Con un Gaussian simétrico, girarlo no cambia nada. Con [-1, 0, 1], la inversión produce [1, 0, -1] y cambia el signo de la respuesta de borde.",
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
          "El ancla es la posición del kernel asociada al píxel de salida. En un kernel impar suele ser el centro; moverla desplaza espacialmente la respuesta.",
          "Por eso los tamaños impares resultan cómodos: tienen un centro inequívoco. Los kernels pares son posibles en algunas APIs, pero obligan a declarar una convención de alineación.",
        ],
      },
      {
        title: "Fuera de la foto también hay una decisión",
        paragraphs: [
          "Al llegar a un borde faltan vecinos. Padding constante añade un valor como cero; replicate repite el último píxel; reflect espeja el contenido; valid calcula solo donde el kernel cabe y reduce la salida.",
          "Ninguna política es neutral. Añadir negro puede fabricar un contorno artificial, repetir prolonga una meseta y reflejar conserva mejor la continuidad en muchos casos. La elección debe coincidir con el fenómeno y la librería.",
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
        prompt: "Según la referencia de OpenCV, ¿qué calcula realmente filter2D con el kernel recibido?",
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
        prompt: "¿Con qué kernel darán el mismo resultado correlación y convolución?",
        options: ["Uno simétrico", "Solo uno 1×1", "Cualquier kernel de suma cero", "Ninguno"],
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
          "Un box blur normalizado reemplaza el centro por la media de su ventana. Es barato y fácil de entender, pero el corte brusco del rectángulo puede producir una respuesta menos natural que una ponderación gradual.",
          "Aumentar el tamaño mezcla regiones más alejadas: elimina más fluctuación y también engorda o borra bordes finos.",
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
        prompt: "Manteniendo lo demás, ¿qué suele provocar aumentar sigma en un Gaussian?",
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
          "Ordena los valores del vecindario y selecciona el central. En [20, 21, 22, 23, 255], la media sube a 68,2 por culpa del impulso; la mediana sigue siendo 22. Por eso funciona especialmente bien con ruido sal y pimienta.",
          "Es un filtro no lineal: no puede expresarse como una suma fija de productos. También puede borrar estructuras más pequeñas que la ventana o deformar texturas si se aplica con demasiada fuerza.",
        ],
      },
      {
        title: "Bilateral pregunta distancia y parecido",
        paragraphs: [
          "El filtro bilateral da más peso a píxeles cercanos y, además, a los que tienen intensidad o color parecido al centro. Dos vecinos separados por un borde fuerte influyen poco aunque estén pegados.",
          "SigmaSpace controla cuánto territorio se consulta y sigmaColor cuánta diferencia tonal todavía se considera semejante. Valores grandes mezclan más; valores pequeños preservan más diferencias.",
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
          "El filtro correcto depende del ruido y del detalle útil. Sal y pimienta sugiere mediana; ruido aproximadamente Gaussian suele casar con suavizado Gaussian; conservar discontinuidades puede justificar bilateral si la latencia lo permite.",
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
        options: ["Mediana", "Producto matricial", "Gamma", "Umbral global siempre"],
        correctIndex: 0,
        feedback: [
          "Correcto: los impulsos extremos suelen quedar fuera del valor central ordenado.",
          "No es una estrategia de reducción de ruido espacial.",
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
          "Como los píxeles son muestras separadas, aproximamos la derivada mediante diferencias entre vecinos. Sobel combina una diferencia en un eje con un pequeño suavizado en el otro, haciéndolo menos frágil que restar solo dos píxeles.",
          "Un cambio izquierda-derecha grande produce |Gx| alto y suele corresponder a un borde aproximadamente vertical. El nombre Gx describe la dirección en la que cambia la intensidad, no la orientación visual de la línea.",
        ],
      },
      {
        title: "Magnitud y ángulo cuentan historias distintas",
        paragraphs: [
          "La magnitud sqrt(Gx² + Gy²) expresa fuerza de cambio. El ángulo atan2(Gy, Gx) expresa la dirección del gradiente y conserva el cuadrante; usar solo Gy/Gx pierde información y falla cuando Gx es cero.",
          "La dirección del borde es perpendicular al gradiente. Si el gradiente apunta a la derecha, la transición separa normalmente regiones mediante una línea vertical.",
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
        prompt: "Una transición fuerte de oscuro a claro al desplazarte de izquierda a derecha produce principalmente…",
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
        prompt: "¿Por qué no conviene guardar directamente Gx en uint8?",
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
          "Primero suavizas la imagen. Original − suave deja una capa de altas frecuencias: bordes, textura y también ruido. Después sumas amount veces esa capa a la original.",
          "El radio del suavizado decide qué escala se considera detalle; amount controla cuánto se amplifica. Un radio o cantidad inadecuados producen halos claros y oscuros alrededor de los contornos.",
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
          "Correcto: suma ∂²I/∂x² y ∂²I/∂y².",
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
          "No es la construcción habitual del método.",
          "Eliminar la fase destruye estructura espacial esencial.",
        ],
      },
      {
        id: "s3-oversharpen-risk",
        prompt: "¿Qué riesgo tiene aumentar demasiado amount en unsharp masking?",
        options: ["Halos y ruido amplificado", "Resolución infinita", "Desaparecen todos los bordes", "El dtype se vuelve RGB"],
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
          "Primero reduce ruido, normalmente con Gaussian. Después obtiene magnitud y dirección del gradiente. La supresión de no máximos conserva solo los máximos locales en la dirección del gradiente y adelgaza las bandas.",
          "Finalmente, la histéresis clasifica respuestas con dos umbrales. Los píxeles por encima del alto son bordes fuertes; los situados entre ambos solo sobreviven si están conectados con uno fuerte.",
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
          "Un único umbral alto rompería bordes cuya fuerza varía; uno bajo aceptaría demasiado ruido. La histéresis permite que tramos débiles sobrevivan cuando prolongan un borde convincente.",
          "Un tramo débil aislado se descarta. La conectividad aporta contexto espacial sin convertir el algoritmo en un detector de objetos.",
        ],
      },
      {
        title: "Los parámetros dependen del dominio",
        paragraphs: [
          "Umbrales muy bajos y poco suavizado producen textura y ruido; umbrales muy altos o demasiado blur pierden contornos de bajo contraste. La resolución, exposición y escala del defecto cambian el rango útil.",
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
        prompt: "¿Qué secuencia representa mejor Canny?",
        options: ["Suavizado → gradiente → no máximos → histéresis", "Histéresis → resize → PCA", "Gamma → mediana → clasificación", "FFT → erosión → entrenamiento"],
        correctIndex: 0,
        feedback: [
          "Correcto: cada etapa prepara o depura la anterior.",
          "No son las etapas del detector.",
          "Gamma y mediana pueden ser operaciones útiles, pero no definen Canny.",
          "Mezcla técnicas que no forman esa cadena.",
        ],
      },
      {
        id: "s3-canny-weak-edge",
        prompt: "Un píxel queda entre los umbrales bajo y alto. ¿Cuándo lo conserva la histéresis?",
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
        prompt: "¿Qué suele ocurrir si ambos umbrales son demasiado bajos?",
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
          "Tras centrar el espectro, la zona próxima al centro suele corresponder a frecuencias bajas. Alejarse representa cambios espaciales más rápidos; la orientación en el espectro está ligada a la de los patrones de la imagen.",
        ],
      },
      {
        title: "Magnitud dice cuánto; fase dice dónde",
        paragraphs: [
          "El resultado es complejo. Su magnitud indica la fuerza de cada componente y su fase conserva la alineación espacial. Una imagen no se reconstruye fielmente guardando solo un espectro de barras bonito.",
          "La fase suele transportar gran parte de la estructura reconocible. Alterarla sin criterio desplaza o desorganiza los patrones aunque la energía por frecuencia parezca similar.",
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
          "Un paso bajo atenúa altas frecuencias y suaviza; un paso alto reduce componentes lentas y resalta cambios. El teorema de convolución conecta ambos mundos: convolución espacial equivale a multiplicación en frecuencia.",
          "Cortes rectangulares bruscos en el espectro pueden generar ringing, ondulaciones alrededor de bordes. Transiciones suaves como ventanas Gaussian o Butterworth reducen ese artefacto.",
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
          "Correcto: cambia lentamente a lo largo de la imagen.",
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
          "Describe el detalle mínimo relevante en píxeles, el tipo de ruido, la variación de iluminación, el movimiento, el dtype, la resolución y el presupuesto de latencia. Sin eso, ‘aplica blur’ no es una decisión técnica.",
          "Un arañazo de dos píxeles puede desaparecer con un Gaussian que mejora una fotografía ruidosa. Una mediana puede rescatar impulsos, pero también eliminar puntos pequeños que sí son defectos reales.",
        ],
      },
      {
        title: "Ordenar operaciones cambia el resultado",
        paragraphs: [
          "Suavizar antes de derivar reduce ruido amplificado. Umbralizar antes de suavizar convierte parte del ruido en regiones duras difíciles de recuperar. Enfocar antes de comprimir puede exagerar artefactos; hacerlo después no recupera lo perdido.",
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
          "Compara un baseline sin la operación y variantes con parámetros razonables. Mide métricas del sistema completo por subgrupos: cámara, turno, material, tamaño de objeto y condiciones difíciles.",
          "En una entrevista exigente, una buena respuesta incluye alternativas y fallos: por qué Gaussian y no bilateral, cómo escoger sigma, qué pasa en los bordes, cuánto cuesta y qué experimento demostraría que la decisión ayuda.",
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
        prompt: "En una entrevista de arquitectura, ¿qué hace más sólida la elección de un Gaussian?",
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
