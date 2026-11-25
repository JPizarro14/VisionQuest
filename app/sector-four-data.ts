import type { SectorLesson } from "@/app/course-data";

export const sectorFourLessons: SectorLesson[] = [
  {
    id: "04.01",
    navTitle: "Forma y vecindario",
    title: "La plantilla que interroga una forma",
    objective: "Entender primer plano, fondo, elemento estructurante, ancla y borde antes de aplicar morfología.",
    lead: "La morfología no pregunta cuánto se parece una imagen a un gato. Recorre su geometría con una plantilla pequeña y responde cosas más humildes: ¿cabe aquí?, ¿toca algo?, ¿qué parte sobresale?",
    keyIdea: "El elemento estructurante define qué vecinos cuentan; cambiar su forma o tamaño cambia la pregunta geométrica que hacemos.",
    sections: [
      {
        title: "Primero decide qué es objeto",
        paragraphs: [
          "Si el operador trata 1 (blanco) como primer plano, la erosión encoge el blanco y la dilatación lo expande. Con letras negras sobre fondo blanco, erosionar el blanco puede engrosar las letras, no afinarlas. Para operar sobre la tinta como objeto, crea una máscara con 1 en las letras y 0 en el fondo.",
        ],
      },
      {
        title: "Una pequeña plantilla con intención",
        paragraphs: [
          "El elemento estructurante (footprint) indica qué posiciones del vecindario participan. En 3×3, un cuadrado lleno incluye las diagonales y una cruz no. Aumentar el tamaño aumenta el alcance: en una erosión, un trazo desaparece allí donde no cabe la plantilla completa, aunque sea un trazo largo.",
        ],
      },
      {
        title: "El ancla es el punto de apoyo",
        paragraphs: [
          "El ancla fija qué posición de la plantilla coincide con el píxel de salida. Una plantilla de alto y ancho impares tiene una celda central inequívoca; desplazar el ancla cambia la alineación.",
          "La política de borde decide qué leer fuera del marco. Al erosionar un objeto blanco pegado al borde, rellenar con negro puede retirarlo una fila; replicar su borde blanco puede conservar esa fila. Donde la plantilla cabe entera, la elección del relleno no influye.",
        ],
        formula: {
          label: "PREGUNTA LOCAL",
          value: "vecindario = imagen bajo el footprint",
          parts: ["forma = direcciones", "tamaño = escala", "ancla = posición de salida"],
        },
      },
    ],
    takeaways: [
      "Primer plano y fondo son una convención que debe hacerse explícita.",
      "Forma y tamaño del elemento estructurante codifican una hipótesis geométrica.",
      "Ancla y política de borde también forman parte de la operación.",
    ],
    questions: [
      {
        id: "s4-foreground-convention",
        prompt: "Quieres afinar letras negras sobre fondo blanco. Al erosionar la máscara, las letras se engrosan. ¿Qué comprobarías antes de cambiar el tamaño de la plantilla?",
        options: ["La resolución", "La polaridad del primer plano", "El formato PNG", "El número de épocas"],
        correctIndex: 1,
        feedback: [
          "La resolución puede influir en la escala, pero aquí la interpretación ya está invertida.",
          "Correcto: debes decidir si el objeto son las letras negras o el fondo blanco antes de interpretar el resultado.",
          "El contenedor de archivo no decide qué conjunto es primer plano.",
          "Las épocas pertenecen al entrenamiento de modelos, no a esta operación determinista.",
        ],
      },
      {
        id: "s4-footprint-shape",
        prompt: "¿Qué parámetro expresa directamente qué vecinos participan en una operación morfológica?",
        options: ["El valor que codifica el blanco", "El elemento estructurante", "El número de objetos", "La etiqueta de clase"],
        correctIndex: 1,
        feedback: [
          "La codificación del blanco identifica el primer plano, no la disposición de los vecinos.",
          "Correcto: sus posiciones activas definen el vecindario consultado.",
          "El recuento de objetos no fija qué posiciones se consultan alrededor de cada píxel.",
          "La morfología básica puede operar sin conocer clases semánticas.",
        ],
      },
      {
        id: "s4-even-anchor",
        prompt: "Para centrar el ancla de una plantilla morfológica, ¿qué ventaja tiene usar alto y ancho impares?",
        options: ["Tiene un centro inequívoco", "Siempre es más rápido", "Convierte RGB en gris", "Elimina cualquier ruido"],
        correctIndex: 0,
        feedback: [
          "Correcto: facilita colocar el ancla en un centro simétrico.",
          "El coste depende de implementación y número de posiciones activas; no hay una garantía universal.",
          "La conversión de color es otra operación.",
          "Ningún tamaño elimina todo ruido sin riesgo para la señal.",
        ],
      },
    ],
    lab: "morph-structuring",
    labTitle: "Mueve la plantilla",
    labInstruction: "Cambia el footprint y pulsa una posición. Observa qué vecinos inspecciona y qué responderían erosión y dilatación.",
    sources: [
      { label: "OpenCV · Morphological Transformations", url: "https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html" },
      { label: "scikit-image · Morphological Filtering", url: "https://scikit-image.org/docs/stable/auto_examples/applications/plot_morphology.html" },
    ],
  },
  {
    id: "04.02",
    navTitle: "Erosión",
    title: "¿Cabe la plantilla dentro del objeto?",
    objective: "Interpretar la erosión en imágenes binarias y de grises, incluyendo escala, iteraciones y efectos secundarios.",
    lead: "Imagina que recorres una figura intentando apoyar un sello sin que ninguna esquina salga fuera. Solo marcas los lugares donde el sello cabe entero. El nuevo objeto queda más delgado.",
    keyIdea: "Con primer plano blanco, la erosión conserva una posición solo cuando todo el footprint activo encuentra primer plano; en grises se comporta como un mínimo local para footprints planos.",
    sections: [
      {
        title: "Todos tienen que cumplir",
        paragraphs: [
          "Con blanco como objeto y el centro activo, la erosión deja blanco el píxel de salida solo si toda posición activa de la plantilla cae en blanco. Basta un vecino de fondo para que salga negro. En una mota o un puente más estrecho que la plantilla, esta puede no caber en ninguna posición.",
        ],
        formula: {
          label: "EROSIÓN BINARIA · INTUICIÓN",
          value: "salida = 1 si todos los activos son 1",
          parts: ["AND local", "encoge primer plano", "rompe uniones estrechas"],
        },
      },
      {
        title: "El tamaño debe hablar el idioma del defecto",
        paragraphs: [
          "Un objeto desaparece cuando ya no contiene una copia completa del elemento estructurante. Por eso el tamaño del kernel debe relacionarse con píxeles reales del problema, resolución, distancia de cámara y tamaño mínimo válido.",
          "En el interior, dos erosiones con un cuadrado 3×3 lleno y centrado exigen que todo un cuadrado 5×5 sea primer plano. Dos cruces 3×3, en cambio, alcanzan un rombo, no ese cuadrado. Antes de sustituir iteraciones, comprueba la forma efectiva, el ancla y el tratamiento del borde.",
        ],
      },
      {
        title: "Limpiar también puede destruir",
        paragraphs: [
          "Compara las mismas máscaras antes y después de erosionar con anotaciones que distingan ruido de señal. Cuenta motas eliminadas, pero también trazos válidos perdidos, adelgazados o partidos.",
          "Evalúa por separado los trazos pegados al marco y repite la comparación con la política de borde que usarás: el valor supuesto fuera de la imagen puede borrar un trazo que en el interior sobreviviría.",
        ],
      },
    ],
    takeaways: [
      "Erosión equivale a una condición «todos» dentro del footprint.",
      "El kernel expresa la escala mínima que quieres conservar.",
      "Eliminar ruido y eliminar detalle son efectos inseparables que deben medirse.",
    ],
    questions: [
      {
        id: "s4-erosion-rule",
        prompt: "Con objeto blanco y un footprint 3×3 lleno, ¿cuándo queda blanco el píxel central tras erosionar?",
        options: ["Si al menos un vecino es blanco", "Si los nueve cubiertos son blancos", "Si el centro supera 128", "Siempre que esté lejos del borde de la imagen"],
        correctIndex: 1,
        feedback: [
          "Esa es la lógica intuitiva de la dilatación.",
          "Correcto: el footprint debe caber por completo en el primer plano.",
          "Eso describe un umbral de intensidad, no la regla binaria de erosión.",
          "La posición no basta: también importa la geometría del objeto local.",
        ],
      },
      {
        id: "s4-erosion-purpose",
        prompt: "Dos regiones blancas están unidas por un puente horizontal de un píxel de grosor sobre fondo negro. ¿Qué le puede ocurrir al erosionar con un cuadrado lleno de 3×3?",
        options: ["Puede romperse", "Se vuelve más ancho", "Aumenta el número de canales", "Recupera detalle saturado"],
        correctIndex: 0,
        feedback: [
          "Correcto: una unión más estrecha que el footprint puede desaparecer.",
          "Expandir el primer plano es el efecto habitual de dilatar.",
          "La morfología no añade canales por sí sola.",
          "Una saturación ya perdió información; erosionar no la reconstruye.",
        ],
      },
      {
        id: "s4-erosion-risk",
        prompt: "Quieres conservar vasos de dos píxeles de grosor. ¿Qué riesgo tiene una erosión grande?",
        options: ["Convertirlos en RGB", "Borrarlos junto con el ruido", "Duplicar la resolución", "Cambiar el histograma sin cambiar la imagen"],
        correctIndex: 1,
        feedback: [
          "El número de canales no cambia automáticamente.",
          "Correcto: la operación no sabe si una estructura fina es ruido o señal.",
          "No se crean nuevas filas ni columnas.",
          "Toda modificación real de píxeles puede cambiar el histograma; aquí el riesgo principal es perder la estructura.",
        ],
      },
    ],
    lab: "morph-erosion",
    labTitle: "Haz retroceder el borde",
    labInstruction: "Aumenta el tamaño y las iteraciones. Vigila qué ruido desaparece y cuándo se rompe la pieza válida.",
    sources: [
      { label: "OpenCV · Erosion", url: "https://docs.opencv.org/4.x/db/df6/tutorial_erosion_dilatation.html" },
      { label: "scikit-image · erosion", url: "https://scikit-image.org/docs/stable/api/skimage.morphology.html#skimage.morphology.erosion" },
    ],
  },
  {
    id: "04.03",
    navTitle: "Dilatación",
    title: "¿Toca la plantilla alguna parte del objeto?",
    objective: "Comprender cómo la dilatación expande, conecta y rellena, y por qué también amplifica defectos.",
    lead: "Ahora no exigimos que el sello quepa entero. Basta con que toque una sola parte del objeto para marcar la posición. Es como extender pintura húmeda alrededor de cada píxel blanco.",
    keyIdea: "Con primer plano blanco, la dilatación activa una posición si al menos un punto del footprint toca primer plano; en grises actúa como un máximo local con footprints planos.",
    sections: [
      {
        title: "Con uno basta",
        paragraphs: [
          "La dilatación binaria se parece a un OR local: si cualquier vecino cubierto es primer plano, la salida se activa. El contorno avanza según las direcciones presentes en el elemento estructurante.",
          "Puede cerrar una interrupción o unir regiones cercanas. La unión solo indica que las expansiones alcanzaron a conectarse con esa plantilla y ese número de pasadas, no que las dos piezas fueran un mismo objeto físico.",
        ],
        formula: {
          label: "DILATACIÓN BINARIA · INTUICIÓN",
          value: "salida = 1 si algún activo es 1",
          parts: ["OR local", "expande primer plano", "une huecos estrechos"],
        },
      },
      {
        title: "La forma deja su huella",
        paragraphs: [
          "Una cruz expande sobre todo en horizontal y vertical; un rectángulo también alcanza diagonales; un disco evita esquinas tan marcadas. El resultado no es «más grande» en abstracto: es la suma geométrica del objeto y la plantilla.",
          "Las iteraciones acumulan alcance. Conviene registrar footprint, tamaño, ancla, borde e iteraciones como parte de la configuración reproducible.",
        ],
      },
      {
        title: "También crece lo que no quieres",
        paragraphs: [
          "Dilatar un punto blanco aislado con un cuadrado 3×3 centrado le da nueve píxeles blancos si está lejos del marco. Para quitarlo, una apertura erosiona primero y dilata después: la mota no contiene el cuadrado, así que no deja ningún píxel desde el que volver a crecer.",
        ],
      },
    ],
    takeaways: [
      "Dilatación utiliza una condición «alguno» dentro del footprint.",
      "Puede unir cortes pequeños, pero también fusionar objetos distintos.",
      "La forma del footprint determina las direcciones de crecimiento.",
    ],
    questions: [
      {
        id: "s4-dilation-rule",
        prompt: "¿Qué condición binaria resume una dilatación de primer plano blanco?",
        options: ["Todos los vecinos son 1", "Algún vecino activo es 1", "La media supera 128", "El histograma es uniforme"],
        correctIndex: 1,
        feedback: [
          "La condición «todos» corresponde a la erosión.",
          "Correcto: un solo contacto con primer plano activa la salida.",
          "La dilatación no calcula la media del vecindario.",
          "La forma del histograma global no decide cada salida local.",
        ],
      },
      {
        id: "s4-dilation-merge",
        prompt: "Dos piezas quedan unidas tras dilatar. ¿Qué puedes concluir con seguridad?",
        options: ["Eran la misma clase", "Estaban suficientemente cerca para ese footprint", "La segmentación es perfecta", "Tenían idéntico color"],
        correctIndex: 1,
        feedback: [
          "La morfología no conoce clases semánticas.",
          "Correcto: la unión depende de la distancia y de la plantilla elegida.",
          "Fusionar instancias puede ser precisamente un error de segmentación.",
          "La operación pudo aplicarse sobre una máscara sin información de color.",
        ],
      },
      {
        id: "s4-dilation-noise",
        prompt: "Dilatas un píxel blanco aislado sobre fondo negro con una cruz de 3×3, lejos del marco. ¿Qué ocurre con la mota?",
        options: ["Desaparece", "Crece", "Cambia a negro sin más", "Se convierte en un histograma"],
        correctIndex: 1,
        feedback: [
          "Para retirar motas claras suele ser útil erosionar o abrir.",
          "Correcto: la cruz activa el punto y sus cuatro vecinos horizontales y verticales.",
          "No es una inversión de polaridad.",
          "El histograma es un resumen, no un tipo de píxel.",
        ],
      },
    ],
    lab: "morph-dilation",
    labTitle: "Cierra la interrupción",
    labInstruction: "Prueba footprint, tamaño e iteraciones. Comprueba cuándo conectas la grieta y cuándo fusionas piezas que debían seguir separadas.",
    sources: [
      { label: "OpenCV · Dilation", url: "https://docs.opencv.org/4.x/db/df6/tutorial_erosion_dilatation.html" },
      { label: "scikit-image · dilation", url: "https://scikit-image.org/docs/stable/api/skimage.morphology.html#skimage.morphology.dilation" },
    ],
  },
  {
    id: "04.04",
    navTitle: "Apertura y cierre",
    title: "El orden cambia la limpieza",
    objective: "Distinguir apertura y cierre como composiciones no intercambiables y elegirlas según la polaridad del defecto.",
    lead: "Pasar una escoba y después rellenar las juntas no produce lo mismo que rellenar primero y barrer después. Erosión y dilatación tampoco conmutan: el orden define qué estructuras sobreviven.",
    keyIdea: "Apertura = erosión seguida de dilatación; cierre = dilatación seguida de erosión. Una retira salientes claros pequeños y la otra rellena huecos oscuros pequeños, según la convención.",
    sections: [
      {
        title: "Abrir deja pasar solo lo que cabe",
        paragraphs: [
          "En la apertura binaria clásica primero se erosiona y después se dilata con el elemento correspondiente. Una mota aislada donde no cabe la plantilla desaparece en la erosión: no queda desde dónde dilatarla. Las estructuras mayores recuperan parte de su contorno.",
          "La apertura es anti-extensiva: el resultado está contenido en el primer plano original. Es idempotente: abrir otra vez con el mismo elemento no cambia el resultado.",
        ],
      },
      {
        title: "Cerrar tapa huecos pequeños",
        paragraphs: [
          "El cierre expande primero el primer plano para atravesar cortes y cubrir agujeros oscuros; la erosión posterior devuelve el contorno exterior hacia dentro. Es extensivo: el original queda contenido en el resultado bajo las condiciones clásicas.",
          "Un cierre puede unir dos objetos cercanos. Si luego cuentas componentes, esa elección morfológica ya ha alterado la respuesta; documenta el tamaño máximo de hueco que estás dispuesto a cerrar.",
        ],
      },
      {
        title: "No son botones de mejorar",
        paragraphs: [
          "Abrir elimina detalles del primer plano donde no cabe el elemento; cerrar rellena detalles del fondo. Si una apertura borra una mota alejada de otras piezas, el cierre no guarda sus coordenadas ni sabe que deba reponerla. Invertir la polaridad intercambia qué detalles se tratan como objeto; girar o agrandar la plantilla cambia cuáles caben.",
        ],
        formula: {
          label: "COMPOSICIONES",
          value: "abrir(I)=dilatar(erosionar(I))",
          parts: ["cerrar(I)=erosionar(dilatar(I))", "orden esencial", "mismo footprint"],
        },
      },
    ],
    takeaways: [
      "La apertura ataca defectos claros pequeños; el cierre, defectos oscuros pequeños.",
      "No son operaciones inversas y su orden no puede intercambiarse.",
      "Con el mismo footprint son idempotentes en el modelo morfológico clásico.",
    ],
    questions: [
      {
        id: "s4-opening-order",
        prompt: "¿Qué secuencia define una apertura?",
        options: ["Dilatar y erosionar", "Erosionar y dilatar", "Ecualizar y umbralizar", "Restar y normalizar"],
        correctIndex: 1,
        feedback: [
          "Esa secuencia define el cierre.",
          "Correcto: primero se retira lo que no contiene el footprint y luego se recupera la forma superviviente.",
          "Son operaciones útiles, pero no definen apertura morfológica.",
          "Restar y normalizar cambia intensidades; no comprueba dónde cabe una plantilla ni dilata lo que sobrevive.",
        ],
      },
      {
        id: "s4-closing-hole",
        prompt: "Con objeto blanco y pequeños agujeros negros, ¿qué operación probarías primero?",
        options: ["Apertura", "Cierre", "Gradiente Sobel", "Solo invertir RGB"],
        correctIndex: 1,
        feedback: [
          "La apertura está orientada a retirar detalles blancos pequeños.",
          "Correcto: el cierre puede cubrir huecos de fondo menores que la escala elegida.",
          "Sobel localiza cambios, pero no rellena la región.",
          "Invertir no limpia; solo cambia la polaridad.",
        ],
      },
      {
        id: "s4-open-close-inverse",
        prompt: "Después de una apertura, aplicas un cierre. ¿Recuperas necesariamente la imagen original?",
        options: ["Sí, siempre", "Solo en uint8", "No: ambas pueden descartar información", "Sí, con kernel impar"],
        correctIndex: 2,
        feedback: [
          "Una estructura eliminada por completo no tiene por qué reaparecer.",
          "El dtype no convierte las operaciones en inversas.",
          "Correcto: son filtros de forma, no un par codificar/decodificar.",
          "Un centro claro no garantiza reversibilidad.",
        ],
      },
    ],
    lab: "morph-open-close",
    labTitle: "Limpia ruido o rellena huecos",
    labInstruction: "Alterna apertura, cierre y ambos órdenes. Compara qué ocurre con motas, agujeros, un puente fino y dos piezas cercanas.",
    sources: [
      { label: "OpenCV · Opening and Closing", url: "https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html" },
      { label: "scikit-image · opening and closing", url: "https://scikit-image.org/docs/stable/api/skimage.morphology.html" },
    ],
  },
  {
    id: "04.05",
    navTitle: "Residuos de forma",
    title: "Restar la versión estable para revelar detalles",
    objective: "Usar gradiente morfológico, top-hat y black-hat entendiendo qué residual calcula cada uno.",
    lead: "A veces no quieres la figura limpia, sino precisamente lo que la limpieza quitó o rellenó. Restar dos versiones de la imagen convierte esos detalles en una señal independiente.",
    keyIdea: "El gradiente extrae una banda de contorno; top-hat conserva detalles claros pequeños; black-hat conserva detalles oscuros pequeños, siempre relativos al footprint.",
    sections: [
      {
        title: "Un contorno de dos fronteras",
        paragraphs: [
          "El gradiente morfológico resta erosión a dilatación. Una versión avanzó hacia fuera y la otra retrocedió hacia dentro; la diferencia forma una banda alrededor del límite.",
          "Su grosor depende del footprint y no equivale al gradiente diferencial de Sobel. Sobel estima cambios de intensidad y orientación; el morfológico compara máximos y mínimos locales de forma no lineal.",
        ],
        formula: {
          label: "GRADIENTE MORFOLÓGICO",
          value: "G = dilatar(I) − erosionar(I)",
          parts: ["banda de borde", "no lineal", "escala del footprint"],
        },
      },
      {
        title: "Top-hat: lo claro que no pudo quedarse",
        paragraphs: [
          "White top-hat = original − apertura. Si la apertura sigue un fondo que varía lentamente pero elimina un reflejo estrecho, el fondo se cancela en la resta y el reflejo da un residuo positivo. Una mota de ruido clara de la misma escala también responderá.",
        ],
      },
      {
        title: "Black-hat: lo oscuro que el cierre tapó",
        paragraphs: [
          "El black-hat resta la imagen original del cierre. Muestra huecos, texto oscuro o valles locales que el cierre fue capaz de cubrir.",
          "La orientación cuenta: sobre fondo claro, un segmento vertical más largo que el grosor de una raya oscura horizontal puede cerrar esa raya. Un segmento paralelo a ella puede dejar intacto su interior. Por eso el residuo depende de la plantilla, no solo del nivel de gris.",
        ],
      },
    ],
    takeaways: [
      "El gradiente morfológico es dilatación menos erosión.",
      "Top-hat extrae detalles claros retirados por la apertura.",
      "Black-hat extrae detalles oscuros rellenados por el cierre.",
    ],
    questions: [
      {
        id: "s4-gradient-definition",
        prompt: "¿Qué resta produce el gradiente morfológico habitual?",
        options: ["Original − apertura", "Cierre − original", "Dilatación − erosión", "Sobel x − Sobel y"],
        correctIndex: 2,
        feedback: [
          "Esa resta es el white top-hat.",
          "Esa resta es el black-hat.",
          "Correcto: el máximo local menos el mínimo local forma una banda donde cambia la intensidad.",
          "Sobel estima derivadas por sumas ponderadas; restar sus componentes no calcula un rango local.",
        ],
      },
      {
        id: "s4-tophat-choice",
        prompt: "Quieres resaltar pequeños reflejos blancos sobre un fondo que varía lentamente. ¿Qué residual encaja mejor?",
        options: ["White top-hat", "Black-hat", "Solo cierre", "Inversa matricial"],
        correctIndex: 0,
        feedback: [
          "Correcto: original menos apertura cancela el fondo y conserva el exceso de intensidad del reflejo.",
          "Black-hat destaca depresiones oscuras.",
          "El cierre puede modificar huecos, pero no entrega ese residual claro.",
          "No es un problema de resolver un sistema lineal.",
        ],
      },
      {
        id: "s4-hat-scale",
        prompt: "¿Qué significa «detalle pequeño» en top-hat y black-hat?",
        options: ["Menos de 1 MB", "Pequeño respecto al footprint", "Oscuro en todos los canales", "Situado cerca de la esquina"],
        correctIndex: 1,
        feedback: [
          "El tamaño del archivo no define la geometría de la imagen.",
          "Correcto: la plantilla establece la escala y orientación que se elimina o rellena.",
          "Top-hat y black-hat distinguen polaridad local, pero la escala la marca el footprint.",
          "La posición absoluta no define si un detalle es pequeño.",
        ],
      },
    ],
    lab: "morph-residuals",
    labTitle: "Separa lo que sobra",
    labInstruction: "Cambia entre gradiente, top-hat y black-hat; aumenta el footprint y observa qué escala de detalle entra en el residual.",
    sources: [
      { label: "OpenCV · More Morphology Transformations", url: "https://docs.opencv.org/4.x/d3/dbe/tutorial_opening_closing_hats.html" },
      { label: "OpenCV · morphologyEx definitions", url: "https://docs.opencv.org/4.x/d4/d86/group__imgproc__filter.html" },
    ],
  },
  {
    id: "04.06",
    navTitle: "Morfología en grises",
    title: "Máximos y mínimos que siguen la forma",
    objective: "Extender la intuición binaria a intensidades y situar reconstrucción, esqueletos y distancia como herramientas relacionadas.",
    lead: "Cuando la imagen ya no es solo cero o uno, el sello sigue recorriéndola. En vez de preguntar si todos cumplen, recoge el valle o el pico local bajo la plantilla.",
    keyIdea: "Con un footprint plano, erosionar una imagen de grises toma mínimos locales y dilatar toma máximos locales; no es una media ni una convolución lineal.",
    sections: [
      {
        title: "El valle y el pico del vecindario",
        paragraphs: [
          "Con una plantilla plana, la erosión elige el mínimo local y la dilatación, el máximo. En [20, 80, 30] devuelven 20 y 80. No son promedios lineales: el vecino elegido depende de las intensidades y puede cambiar de posición de una ventana a otra.",
        ],
        formula: {
          label: "FOOTPRINT PLANO",
          value: "erosión = mínimo · dilatación = máximo",
          parts: ["orden local", "no lineal", "por vecindario"],
        },
      },
      {
        title: "Color: operar por canal puede inventar combinaciones",
        paragraphs: [
          "Si una ventana solo contiene rojo (255, 0, 0) y verde (0, 255, 0), el máximo independiente de cada canal RGB produce (255, 255, 0): amarillo, un color ausente. Para ampliar la silueta de un objeto se puede dilatar una máscara binaria; para ampliar brillos, trabajar sobre un canal de claridad.",
        ],
      },
      {
        title: "Tres ramas que conviene reconocer",
        paragraphs: [
          "En una reconstrucción binaria por dilatación, unas semillas crecen solo dentro de la máscara hasta recuperar el primer plano conectado a ellas. La esqueletización adelgaza el objeto a un trazado central que busca conservar sus conexiones.",
          "La transformada de distancia asigna a cada píxel del objeto la distancia al fondo más cercano según la métrica elegida. Sus máximos interiores pueden servir como semillas para separar objetos que se tocan.",
        ],
      },
    ],
    takeaways: [
      "En grises, erosión y dilatación planas son filtros de mínimo y máximo.",
      "Operar cada canal RGB por separado puede crear colores inexistentes.",
      "Reconstrucción, esqueletos y distancia responden preguntas de conectividad, eje y grosor.",
    ],
    questions: [
      {
        id: "s4-gray-erosion",
        prompt: "En una imagen de grises, erosionas con una plantilla plana (sin sumar pesos a las intensidades). ¿Qué estadístico de las posiciones activas da la salida?",
        options: ["Media", "Mediana", "Mínimo", "Desviación típica"],
        correctIndex: 2,
        feedback: [
          "La media define un suavizado lineal distinto.",
          "La mediana es otro filtro de orden, pero no la erosión.",
          "Correcto: selecciona el valor más bajo bajo el footprint.",
          "La dispersión no es el valor de salida morfológico.",
        ],
      },
      {
        id: "s4-rgb-morphology",
        prompt: "¿Qué riesgo tiene tomar el máximo independientemente en R, G y B?",
        options: ["Crear un color que no estaba en ningún vecino", "Reducir siempre a gris", "Perder las dimensiones espaciales", "Entrenar una CNN sin querer"],
        correctIndex: 0,
        feedback: [
          "Correcto: cada máximo puede proceder de una posición diferente.",
          "Los tres canales siguen presentes.",
          "La salida conserva alto y ancho.",
          "Es una operación determinista, no un entrenamiento.",
        ],
      },
      {
        id: "s4-distance-transform",
        prompt: "¿Qué responde una transformada de distancia dentro de un objeto binario?",
        options: ["La clase del objeto", "La distancia de cada píxel al fondo", "El histograma RGB", "La tasa de aprendizaje"],
        correctIndex: 1,
        feedback: [
          "No asigna significado semántico.",
          "Correcto: mide la distancia al fondo más cercano; los máximos interiores ayudan a localizar centros.",
          "No resume frecuencias de color.",
          "No hay optimización de parámetros.",
        ],
      },
    ],
    lab: "morph-grayscale",
    labTitle: "Busca picos y valles",
    labInstruction: "Elige mínimo, máximo o gradiente y cambia el tamaño. Inspecciona el vecindario central y el valor que realmente gana.",
    sources: [
      { label: "scikit-image · Morphology API", url: "https://scikit-image.org/docs/stable/api/skimage.morphology.html" },
      { label: "scikit-image · Morphological Filtering", url: "https://scikit-image.org/docs/stable/auto_examples/applications/plot_morphology.html" },
    ],
  },
  {
    id: "04.07",
    navTitle: "Componentes conectados",
    title: "Convertir manchas en objetos medibles",
    objective: "Etiquetar componentes con conectividad 4 u 8 y extraer área, caja y centro sin confundir etiquetas con clases.",
    lead: "Después de limpiar una máscara todavía tienes una sola cuadrícula de ceros y unos. El etiquetado conectado le pone un número distinto a cada isla para que puedas contarla y medirla.",
    keyIdea: "Un componente conectado es un conjunto de píxeles de primer plano alcanzables bajo una regla de vecindad; su etiqueta es un identificador, no una categoría semántica.",
    sections: [
      {
        title: "¿Las esquinas se tocan?",
        paragraphs: [
          "Con conectividad 4, un píxel solo considera vecinos arriba, abajo, izquierda y derecha. Con conectividad 8 también admite diagonales. Dos manchas que únicamente se besan por una esquina son dos componentes en 4 y una sola en 8.",
          "La elección debe corresponder a la geometría del problema. Para trazos diagonales, 8 puede mantener una línea unida; para celdas que no deben fusionarse por una esquina, 4 puede ser más prudente.",
        ],
      },
      {
        title: "La salida es un mapa de enteros",
        paragraphs: [
          "Cada componente recibe una etiqueta entera; en OpenCV la etiqueta 0 representa el fondo. El número asignado puede depender del algoritmo y del orden de recorrido, así que no interpretes «componente 3» como una identidad estable entre imágenes.",
          "Para cada etiqueta, connectedComponentsWithStats da el área (número de píxeles), la caja alineada con los ejes (izquierda, arriba, ancho, alto) y el centroide (promedio de x e y de sus píxeles). El centroide no tiene por qué ser el centro de la caja ni caer dentro de la mancha.",
        ],
        formula: {
          label: "CONECTIVIDAD 2D",
          value: "4 = lados · 8 = lados + diagonales",
          parts: ["0 = fondo en OpenCV", "labels = IDs", "stats = medidas"],
        },
      },
      {
        title: "Medir no equivale a reconocer",
        paragraphs: [
          "Un filtro por área puede eliminar componentes demasiado pequeños, pero también borra objetos válidos pequeños si la escala cambia. Una caja describe extensión, no orientación exacta ni forma interior.",
          "Si el umbral corta un objeto en dos, se cuentan dos componentes; si un cierre une dos objetos, se cuenta uno. Filtrar por área no corrige ninguna de esas identidades. Revisa también objetos recortados por el marco: su área visible subestima la completa.",
        ],
      },
    ],
    takeaways: [
      "Conectividad 4 y 8 discrepan en los contactos diagonales.",
      "Las etiquetas identifican regiones dentro de una imagen; no son clases.",
      "Área, caja y centroide dependen de la máscara que construiste antes.",
    ],
    questions: [
      {
        id: "s4-connectivity-diagonal",
        prompt: "Una máscara solo contiene dos píxeles de primer plano, tocándose por una esquina. ¿Cuántos componentes dan las conectividades 4 y 8, sin contar el fondo?",
        options: ["Uno con 4 y dos con 8", "Dos con 4 y uno con 8", "Siempre uno", "Siempre dos"],
        correctIndex: 1,
        feedback: [
          "La vecindad de 4 solo comparte lados; la de 8 añade contactos por esquina, no al revés.",
          "Correcto: la diagonal solo pertenece a la vecindad de 8.",
          "Con conectividad 4 no existe ese enlace.",
          "Con conectividad 8 sí se consideran unidos.",
        ],
      },
      {
        id: "s4-label-meaning",
        prompt: "Al etiquetar los componentes conexos de una máscara, una mancha recibe el entero 3. ¿Qué significa por sí solo ese número?",
        options: ["Que pertenece a la clase 3", "Que identifica ese componente dentro de este mapa", "Que tiene área 3", "Que su confianza es 0,3"],
        correctIndex: 1,
        feedback: [
          "Las clases semánticas requieren otra regla o modelo.",
          "Correcto: agrupa píxeles conectados de este mapa; la etiqueta 3 puede designar otra pieza en el siguiente fotograma.",
          "El área aparece en una estadística distinta.",
          "No representa una probabilidad.",
        ],
      },
      {
        id: "s4-component-stats",
        prompt: "Al aplicar connectedComponentsWithStats de OpenCV a una máscara binaria, ¿qué medidas obtienes directamente para cada componente?",
        options: ["Longitud exacta de su contorno", "Área y caja delimitadora", "Orientación de sus ejes principales", "Número de agujeros interiores"],
        correctIndex: 1,
        feedback: [
          "La caja no describe todo el contorno; para medir el perímetro hay que estimar esa frontera.",
          "Correcto: cuenta píxeles y registra la caja alineada con los ejes; también devuelve el centroide.",
          "La orientación requiere información adicional, por ejemplo los momentos de segundo orden.",
          "Contar agujeros requiere analizar el fondo interior o la jerarquía de contornos.",
        ],
      },
    ],
    lab: "connected-components",
    labTitle: "Decide si las esquinas conectan",
    labInstruction: "Dibuja o borra píxeles y alterna conectividad 4/8. Selecciona una isla para leer área, caja y centroide.",
    sources: [
      { label: "OpenCV · connectedComponentsWithStats", url: "https://docs.opencv.org/4.x/d3/dc0/group__imgproc__shape.html" },
      { label: "scikit-image · Measure region properties", url: "https://scikit-image.org/docs/stable/api/skimage.measure.html" },
    ],
  },
  {
    id: "04.08",
    navTitle: "Leer histogramas",
    title: "Contar tonos sin saber dónde viven",
    objective: "Construir e interpretar histogramas, bins, rangos, conteos y normalización sin atribuirles información espacial.",
    lead: "Un histograma hace inventario: cuántos píxeles son oscuros, medios o claros. Es muy útil para conocer la distribución, pero ha tirado a la basura las direcciones de cada casa.",
    keyIdea: "Un histograma agrupa valores en intervalos y cuenta su frecuencia; dos imágenes totalmente distintas pueden compartir exactamente el mismo histograma.",
    sections: [
      {
        title: "Los bins son cubos de valores",
        paragraphs: [
          "Un bin es un intervalo de intensidades. En [0, 256), 0 entra y 256 no: quedan los 256 enteros uint8, incluido 255. Con 256 bins uniformes se distingue cada nivel. Con 16, el primero agrupa 0–15 y el último 240–255: se gana compacidad a costa de no distinguir valores dentro de un intervalo.",
        ],
        formula: {
          label: "CONTEO",
          value: "H[b] = número de píxeles dentro del bin b",
          parts: ["bins = resolución tonal", "range = valores admitidos", "mask = región contada"],
        },
      },
      {
        title: "Conteos y proporciones responden distinto",
        paragraphs: [
          "El conteo indica cuántos píxeles caen en cada intervalo; dividido por el número total contado da una proporción. Si hay 20 de 100 en un recorte y 40 de 200 en otro, ese bin ocupa el 20 % en ambos. Compara proporciones con los mismos intervalos y conserva aparte el total si también importa el área.",
        ],
      },
      {
        title: "No contiene un mapa",
        paragraphs: [
          "Si barajas todos los píxeles, el histograma no cambia aunque la imagen quede irreconocible. Tampoco sabe si dos tonos están juntos, forman un borde o pertenecen a objetos distintos.",
          "Otsu elige el umbral que mejor separa dos grupos tonales en ese histograma. Con los mismos conteos y la misma regla de desempate elegirá el mismo umbral tras barajar los píxeles, aunque ya no haya objetos reconocibles. No evalúa forma, conectividad ni posición.",
        ],
      },
    ],
    takeaways: [
      "Bins y rango determinan cómo se cuantiza el inventario tonal.",
      "Los conteos brutos dependen del tamaño; normalizar cambia su interpretación.",
      "Un histograma pierde toda la organización espacial de los píxeles.",
    ],
    questions: [
      {
        id: "s4-hist-spatial",
        prompt: "Barajas aleatoriamente la posición de todos los píxeles sin cambiar sus valores. ¿Qué ocurre con el histograma global?",
        options: ["Permanece igual", "Se invierte", "Duplica sus bins", "Se convierte en RGB"],
        correctIndex: 0,
        feedback: [
          "Correcto: se conserva el número de píxeles de cada intensidad, aunque sus posiciones cambien.",
          "No se ha cambiado la intensidad de ningún píxel.",
          "El número de bins es una decisión de cálculo.",
          "Reordenar posiciones no añade canales.",
        ],
      },
      {
        id: "s4-hist-range",
        prompt: "¿Por qué se usa con frecuencia el rango [0, 256) para un histograma uint8?",
        options: ["Para incluir 0…255", "Porque existen 256 canales", "Para aumentar la resolución espacial", "Porque 256 es el ancho de toda imagen"],
        correctIndex: 0,
        feedback: [
          "Correcto: el límite superior exclusivo deja dentro el valor 255.",
          "uint8 describe 256 intensidades posibles, no canales.",
          "El histograma no crea píxeles.",
          "El ancho de la imagen puede ser cualquier otro.",
        ],
      },
      {
        id: "s4-hist-normalize",
        prompt: "Dos recortes de distinto tamaño usan los mismos intervalos de intensidad. Para comparar fracciones de píxeles y no cantidades absolutas, ¿qué haces?",
        options: ["Normalizar los histogramas", "Aumentar ambos a 4K", "Ordenar los píxeles por x", "Entrenar durante más épocas"],
        correctIndex: 0,
        feedback: [
          "Correcto: divide cada conteo por el total del recorte para comparar proporciones.",
          "Cambiar resolución altera datos y no resuelve conceptualmente la escala de conteos.",
          "El histograma no conserva x.",
          "No es una operación aprendida.",
        ],
      },
    ],
    lab: "histogram-bins",
    labTitle: "Baraja sin cambiar el inventario",
    labInstruction: "Cambia el número de bins y reorganiza los mismos tonos. Comprueba qué pierde el histograma y qué conserva.",
    sources: [
      { label: "OpenCV · Find, Plot, Analyze Histograms", url: "https://docs.opencv.org/4.x/d1/db7/tutorial_py_histogram_begins.html" },
      { label: "OpenCV · Histogram API", url: "https://docs.opencv.org/4.x/d6/dc7/group__imgproc__hist.html" },
    ],
  },
  {
    id: "04.09",
    navTitle: "Histogramas de color",
    title: "Contar color sin romper sus relaciones",
    objective: "Distinguir histogramas por canal y conjuntos, usar máscaras y elegir espacios de color y bins con criterio.",
    lead: "Tres inventarios separados de rojo, verde y azul te dicen cuánto hay de cada ingrediente, pero no qué ingredientes estaban juntos en el mismo píxel. Un histograma conjunto conserva esa relación a cambio de ocupar más.",
    keyIdea: "Los histogramas marginales resumen cada canal por separado; un histograma conjunto cuenta combinaciones entre canales y crece de forma multiplicativa con los bins.",
    sections: [
      {
        title: "Marginal no significa color completo",
        paragraphs: [
          "Contar el tono H y la saturación S por separado no dice si los rojos son saturados o apagados. El histograma conjunto cuenta el par (H, S) de cada píxel. Con 30 intervalos de tono y 32 de saturación tiene 30 × 32 = 960 celdas, frente a 30 + 32 = 62 conteos separados; necesita más muestras para estimarlas.",
        ],
        formula: {
          label: "HISTOGRAMA CONJUNTO",
          value: "H[i,j] = conteo de pares (canal A, canal B)",
          parts: ["conserva coocurrencia", "bins se multiplican", "puede quedar disperso"],
        },
      },
      {
        title: "HSV separa preguntas útiles",
        paragraphs: [
          "En HSV, H representa tono, S cuánto se aleja del gris y V una medida de brillo. El tono es circular: rojo vive cerca de ambos extremos del rango. Además, con saturación muy baja, el tono es inestable o poco significativo.",
          "Para buscar un color puede ser más robusto contar H y S que RGB bajo ciertos cambios de iluminación, pero no es invariante por arte de magia. Exposición, balance de blancos, sombras y cámara siguen moviendo la distribución.",
        ],
      },
      {
        title: "La máscara define de quién haces inventario",
        paragraphs: [
          "En cv.calcHist se cuenta un píxel si el valor de la máscara uint8 en esa posición no es cero. Un 255 lo selecciona, no le da 255 votos. Así el fondo no domina el histograma de un objeto pequeño.",
          "Usa en ambas imágenes el mismo criterio de selección, espacio y orden de canales, intervalos y normalización. Dos bins con el mismo índice solo son comparables si representan el mismo intervalo.",
        ],
      },
    ],
    takeaways: [
      "Histogramas separados por canal pierden qué valores coincidían en cada píxel.",
      "Los histogramas conjuntos conservan relaciones, pero su tamaño crece rápido.",
      "Máscara, espacio de color, bins y normalización forman una única especificación.",
    ],
    questions: [
      {
        id: "s4-joint-hist",
        prompt: "¿Qué conserva un histograma conjunto H-S que pierden dos histogramas H y S separados?",
        options: ["La posición x,y", "Qué pares de tono y saturación coinciden", "La identidad del objeto", "La profundidad 3D"],
        correctIndex: 1,
        feedback: [
          "Sigue siendo un resumen sin coordenadas.",
          "Correcto: cada celda cuenta una combinación de ambos canales.",
          "No aporta semántica por sí solo.",
          "No contiene geometría de profundidad.",
        ],
      },
      {
        id: "s4-hue-low-saturation",
        prompt: "En el espacio de color HSV, ¿cuándo resulta poco fiable seleccionar un objeto por su tono H?",
        options: ["Con saturación muy baja", "Con ancho par", "Al usar una máscara", "Cuando el área es grande"],
        correctIndex: 0,
        feedback: [
          "Correcto: cerca del gris apenas hay cromaticidad que defina un ángulo de tono.",
          "El ancho espacial no determina la fiabilidad del tono.",
          "Una máscara solo limita qué píxeles contamos.",
          "Más píxeles pueden estabilizar un conteo, pero no dan significado cromático a un gris.",
        ],
      },
      {
        id: "s4-hist-mask",
        prompt: "Quieres describir el color de una camiseta, pero ocupa el 10 % de la foto. ¿Qué evita que domine el fondo?",
        options: ["Una máscara sobre la camiseta", "Un kernel Sobel", "Normalizar el histograma de toda la foto por su suma", "Guardar como JPEG"],
        correctIndex: 0,
        feedback: [
          "Correcto: el histograma contará solo la región relevante.",
          "Sobel busca cambios locales, no selecciona automáticamente la prenda.",
          "Dividir por la suma cambia los conteos a proporciones, pero el fondo aún aporta el 90 % de las muestras.",
          "El formato no separa objeto y fondo.",
        ],
      },
    ],
    lab: "histogram-color",
    labTitle: "Cambia de inventario",
    labInstruction: "Compara un canal, distribuciones marginales y pares H-S. Activa la máscara para ver cuánto contaminaba el fondo.",
    sources: [
      { label: "OpenCV · 2D Histograms", url: "https://docs.opencv.org/4.x/dd/d0d/tutorial_py_2d_histogram.html" },
      { label: "OpenCV · Histogram Calculation", url: "https://docs.opencv.org/4.x/d8/dbc/tutorial_histogram_calculation.html" },
    ],
  },
  {
    id: "04.10",
    navTitle: "Ecualización global",
    title: "Usar el acumulado como nueva escala tonal",
    objective: "Comprender la ecualización global mediante la CDF, distinguirla del estiramiento de contraste y aplicarla con cautela.",
    lead: "Si muchas intensidades están amontonadas en una franja estrecha, la ecualización intenta repartirlas por la escala disponible. Para decidir el nuevo lugar de cada tono utiliza cuánto inventario se ha acumulado hasta él.",
    keyIdea: "La ecualización global remapea cada intensidad mediante la distribución acumulada; mejora ciertos contrastes globales, pero no recupera información ni garantiza una imagen natural.",
    sections: [
      {
        title: "La CDF es un contador acumulado",
        paragraphs: [
          "La función de distribución acumulada, CDF(t), es la fracción de píxeles con intensidad menor o igual que t: suma los conteos hasta t y divide por el total. La ecualización escala esa acumulada al rango de salida y redondea para obtener una tabla de consulta.",
          "Donde abundan tonos vecinos, la curva crece más deprisa y puede separarlos. Pero todos los píxeles con el mismo valor consultan la misma entrada: ni los empates ni el redondeo permiten garantizar un histograma plano.",
        ],
        formula: {
          label: "MAPEO GLOBAL",
          value: "I′ = round((L−1) · CDF(I))",
          parts: ["L = niveles", "CDF = acumulado normalizado", "una LUT para toda la imagen"],
        },
      },
      {
        title: "No es lo mismo que estirar",
        paragraphs: [
          "El estiramiento de contraste suele mapear dos extremos —por ejemplo percentiles— al mínimo y máximo y conserva el orden mediante una recta entre ellos. La ecualización usa toda la forma de la distribución y su curva generalmente no es lineal.",
          "Ninguna técnica recupera detalle perdido por saturación o desenfoque. Solo redistribuye valores disponibles.",
        ],
      },
      {
        title: "Una decisión global puede perjudicar una zona",
        paragraphs: [
          "Una curva global depende de los conteos de toda la imagen. Asigna más contraste a niveles muy poblados y puede comprimir tonos cercanos de una región pequeña. Si los niveles frecuentes son ruido del fondo, también realza ese ruido.",
          "En color, ecualizar R, G y B por separado suele cambiar el equilibrio cromático. Es más habitual trabajar sobre luminancia o valor dentro de un espacio elegido conscientemente, comprobando aun así los cambios de color.",
        ],
      },
    ],
    takeaways: [
      "La CDF normalizada funciona como tabla global de remapeo.",
      "Ecualización y estiramiento de contraste no son la misma curva.",
      "La ecualización puede amplificar ruido, parecer artificial o dañar color.",
    ],
    questions: [
      {
        id: "s4-equalization-cdf",
        prompt: "¿Qué función utiliza la ecualización global como base de su mapeo?",
        options: ["La distribución acumulada (CDF) de intensidades", "La derivada espacial de la intensidad", "Solo la intensidad media", "La desviación estándar de cada ventana"],
        correctIndex: 0,
        feedback: [
          "Correcto: el conteo acumulado normalizado determina la nueva intensidad.",
          "Sobel estima gradientes espaciales.",
          "Una media no indica qué fracción de los píxeles queda por debajo de cada nivel de gris.",
          "La ecualización global usa conteos de toda la imagen, no la dispersión de ventanas locales.",
        ],
      },
      {
        id: "s4-equalization-flat",
        prompt: "¿La ecualización discreta garantiza un histograma perfectamente uniforme?",
        options: ["Sí, por definición", "No: muchos píxeles iguales siguen mapeándose juntos", "Solo si la imagen es RGB", "Sí, usando JPEG"],
        correctIndex: 1,
        feedback: [
          "La discretización y los empates impiden esa garantía.",
          "Correcto: un mapeo puntual no puede separar muestras idénticas sin información adicional.",
          "El color añade complejidad; no garantiza uniformidad.",
          "La compresión no resuelve los empates del mapeo.",
        ],
      },
      {
        id: "s4-equalize-rgb",
        prompt: "¿Qué riesgo tiene ecualizar R, G y B de forma independiente?",
        options: ["Cambiar los colores", "Eliminar el ancho", "Crear etiquetas conectadas", "Aumentar las épocas"],
        correctIndex: 0,
        feedback: [
          "Correcto: cada canal recibe una curva distinta y altera sus proporciones.",
          "Las dimensiones espaciales se conservan.",
          "No es un algoritmo de etiquetado.",
          "No participa ningún entrenamiento.",
        ],
      },
    ],
    lab: "histogram-equalization",
    labTitle: "Convierte el acumulado en una curva",
    labInstruction: "Comprime el rango original y observa histograma, CDF y mapeo. Compara ecualización con un estiramiento lineal.",
    sources: [
      { label: "OpenCV · Histogram Equalization", url: "https://docs.opencv.org/4.x/d5/daf/tutorial_py_histogram_equalization.html" },
      { label: "scikit-image · Histogram Equalization", url: "https://scikit-image.org/docs/stable/auto_examples/color_exposure/plot_equalize.html" },
    ],
  },
  {
    id: "04.11",
    navTitle: "CLAHE",
    title: "Contraste local con un limitador de ruido",
    objective: "Entender teselas, límite de contraste e interpolación en CLAHE y razonar sus artefactos.",
    lead: "Una única curva no sirve igual para una habitación en sombra y una ventana iluminada. CLAHE divide la escena en barrios, ajusta cada uno y suaviza las fronteras para que no parezca un mosaico.",
    keyIdea: "CLAHE ecualiza regiones locales, recorta bins dominantes y mezcla los mapeos vecinos; tile grid y clip limit controlan escalas y amplificación.",
    sections: [
      {
        title: "Una CDF por barrio",
        paragraphs: [
          "CLAHE ecualiza el contraste usando histogramas locales. En OpenCV, tileGridSize=(8, 4) significa 8 teselas a lo ancho y 4 a lo alto, no teselas de 8×4 píxeles. Cada zona dispone así de un mapeo que depende de sus propios tonos.",
          "Con la imagen fija, aumentar el número de teselas reduce su tamaño: sigue mejor cambios locales de luz, pero cada histograma tiene menos muestras y puede realzar fluctuaciones de ruido.",
        ],
      },
      {
        title: "Limitar antes de redistribuir",
        paragraphs: [
          "Antes de acumular el histograma local, CLAHE recorta los conteos que superan un límite y redistribuye el excedente entre los bins. Así reduce los saltos de la curva y evita amplificar tanto pequeñas variaciones dominantes. Recorta conteos, no intensidades de la imagen.",
          "El parámetro clip limit puede estar normalizado por área de tesela o número de intervalos. El mismo valor numérico en dos bibliotecas no implica el mismo tope efectivo.",
        ],
      },
      {
        title: "Interpolar para esconder las costuras",
        paragraphs: [
          "Dos teselas pueden asignar salidas distintas a un mismo gris. OpenCV interpola las salidas que sus tablas dan a la intensidad del píxel, ponderándolas por posición. Suaviza así las costuras sin promediar las intensidades de píxeles vecinos.",
          "Si el contraste local realza ruido o textura de fondo con aspecto de defecto, un detector puede generar más falsas alarmas. Compara detecciones con y sin CLAHE en las mismas imágenes.",
        ],
        formula: {
          label: "TRES CONTROLES",
          value: "teselas → recorte → interpolación",
          parts: ["escala local", "límite de amplificación", "continuidad espacial"],
        },
      },
    ],
    takeaways: [
      "CLAHE utiliza múltiples histogramas locales en vez de una única CDF.",
      "El clip limit reduce la amplificación de bins dominantes y ruido.",
      "Teselas e interpolación introducen decisiones espaciales que hay que validar.",
    ],
    questions: [
      {
        id: "s4-clahe-purpose",
        prompt: "¿Qué problema intenta resolver CLAHE mejor que la ecualización global?",
        options: ["Contraste distinto según la zona", "Falta de etiquetas de clase", "Movimiento 3D", "Overfitting de una CNN"],
        correctIndex: 0,
        feedback: [
          "Correcto: cada tesela adapta su mapeo a la distribución local.",
          "No crea anotaciones semánticas.",
          "No estima pose o profundidad.",
          "Puede formar parte del preprocesado, pero no es una regularización del modelo.",
        ],
      },
      {
        id: "s4-clahe-clip",
        prompt: "¿Para qué sirve el límite de contraste en CLAHE?",
        options: ["Recortar bins dominantes antes de la CDF", "Recortar la imagen espacialmente", "Elegir conectividad 4/8", "Aumentar la resolución"],
        correctIndex: 0,
        feedback: [
          "Correcto: limita cuánto puede concentrarse y amplificarse una distribución local.",
          "No se quitan filas ni columnas: el límite actúa sobre el número de muestras acumuladas en cada bin.",
          "La conectividad pertenece al etiquetado de componentes.",
          "Conserva el número de píxeles.",
        ],
      },
      {
        id: "s4-clahe-transfer",
        prompt: "Al trasladar un ajuste de CLAHE de OpenCV a otra biblioteca, ¿basta copiar clipLimit=2 para conservar el mismo límite de contraste?",
        options: ["Sí, siempre", "No: la parametrización puede estar normalizada de otra forma", "Solo en RGB", "Sí, si las teselas son impares"],
        correctIndex: 1,
        feedback: [
          "Las APIs pueden definir y normalizar el parámetro de forma diferente.",
          "Correcto: comprueba a qué conteo efectivo corresponde el parámetro, además del tamaño de tesela y los bins.",
          "El problema de equivalencia no depende de tener tres canales.",
          "La paridad no unifica las convenciones de distintas implementaciones.",
        ],
      },
    ],
    lab: "clahe",
    labTitle: "Ajusta barrios, límite y costuras",
    labInstruction: "Cambia número de teselas y clip limit. Desactiva la interpolación para descubrir por qué aparecen costuras.",
    sources: [
      { label: "OpenCV · CLAHE", url: "https://docs.opencv.org/4.x/d5/daf/tutorial_py_histogram_equalization.html#autotoc_md430" },
      { label: "scikit-image · equalize_adapthist", url: "https://scikit-image.org/docs/stable/api/skimage.exposure.html#skimage.exposure.equalize_adapthist" },
    ],
  },
  {
    id: "04.12",
    navTitle: "Comparar y decidir",
    title: "Del histograma al pipeline defendible",
    objective: "Comparar histogramas, entender backprojection y diseñar una solución morfológica medible en vez de una receta fija.",
    lead: "Saber qué hace cada herramienta no basta. Un arquitecto de visión debe formular una hipótesis, reconocer qué información pierde, elegir una métrica y demostrar que mejora el objetivo bajo condiciones reales.",
    keyIdea: "Los histogramas ofrecen descriptores y mapas de similitud baratos, pero carecen de geometría y semántica; deben integrarse en un pipeline con supuestos y métricas explícitos.",
    sections: [
      {
        title: "La dirección de la métrica no siempre coincide",
        paragraphs: [
          "Con histogramas comparables, busca una correlación o intersección mayor, pero una distancia chi-cuadrado o Bhattacharyya menor. Por ejemplo, con histogramas de suma 1, la intersección suma el mínimo de cada par de bins y llega a 1 para dos histogramas idénticos.",
          "Iguala canales, intervalos y normalización; comprueba cómo trata la implementación los bins vacíos. Un umbral fijado para una distancia no se traslada directamente a otra ni a una similitud.",
        ],
      },
      {
        title: "Backprojection devuelve un mapa, no una caja",
        paragraphs: [
          "La retroproyección toma un histograma del objetivo —a menudo conjunto H-S— y consulta para cada píxel cuánto encaja su combinación de valores. La salida es un mapa de respuesta del mismo tamaño que la imagen.",
          "Puede localizar regiones con color parecido, pero un fondo del mismo color también responde. Aunque se explique intuitivamente como probabilidad, no asumas que está calibrada: es un score derivado del histograma y su normalización.",
        ],
        formula: {
          label: "RETROPROYECCIÓN",
          value: "B(x,y) = tabla[H(x,y), S(x,y)]",
          parts: ["histograma objetivo", "lookup por píxel", "mapa de respuesta"],
        },
      },
      {
        title: "Construye desde el fallo esperado",
        paragraphs: [
          "En una cinta oscura, un umbral puede separar las tabletas claras del fondo. Una apertura elimina motas claras si son menores que la plantilla; un cierre rellena agujeros pequeños. Cuenta los componentes de primer plano y compara con el recuento anotado.",
          "Si dos tabletas separadas se convierten en un componente, reduce u omite el cierre y repite sobre las mismas imágenes. Si ya se tocaban antes, puedes usar máximos de distancia al fondo como semillas de watershed para intentar separarlas; comprueba que no divida una tableta en dos.",
        ],
      },
    ],
    takeaways: [
      "La dirección de «mejor» depende de la métrica de comparación.",
      "Backprojection produce afinidad por valores, no segmentación semántica garantizada.",
      "Cada paso del pipeline debe justificar un fallo y demostrar valor mediante ablación.",
    ],
    questions: [
      {
        id: "s4-compare-direction",
        prompt: "Buscas el histograma más parecido a una referencia con cv.compareHist. ¿Cómo interpretas el valor devuelto al cambiar de métrica?",
        options: ["Todas las métricas mejoran al crecer", "La dirección depende de la métrica", "No hace falta normalizar nunca", "El resultado siempre es una probabilidad"],
        correctIndex: 1,
        feedback: [
          "Chi-cuadrado y Bhattacharyya suelen interpretarse como distancias: menor es más parecido.",
          "Correcto: correlación/intersección y varias distancias tienen sentidos distintos.",
          "Los conteos y tamaños pueden dominar la comparación.",
          "La mayoría devuelve similitudes o distancias no calibradas.",
        ],
      },
      {
        id: "s4-backprojection-output",
        prompt: "¿Qué entrega directamente la retroproyección de un histograma de color?",
        options: ["Un mapa de respuesta por píxel", "Una caja alrededor de cada objeto", "Una probabilidad calibrada de pertenencia", "Un identificador para cada componente conectado"],
        correctIndex: 0,
        feedback: [
          "Correcto: los píxeles compatibles con la distribución objetivo reciben mayor respuesta.",
          "Un conjunto de píxeles de respuesta alta aún no delimita automáticamente una caja.",
          "El valor depende de los conteos y de la normalización, no de una calibración frente a etiquetas reales.",
          "La retroproyección no agrupa píxeles vecinos; un etiquetado sería un paso posterior.",
        ],
      },
      {
        id: "s4-pipeline-ablation",
        prompt: "Añades cierre morfológico y la métrica final mejora. ¿Qué prueba ayuda a atribuir la mejora?",
        options: ["Una ablación sin cierre", "Cambiar el nombre del modelo", "Mirar solo una imagen bonita", "Aumentar todos los kernels"],
        correctIndex: 0,
        feedback: [
          "Correcto: manteniendo lo demás fijo puedes medir la contribución del paso.",
          "El nombre no cambia la salida.",
          "Un ejemplo escogido no estima generalización ni falsos positivos.",
          "Modificar varios factores a la vez impide atribuir el efecto.",
        ],
      },
    ],
    lab: "histogram-pipeline",
    labTitle: "Defiende la decisión",
    labInstruction: "Elige un escenario y un pipeline candidato. Revisa el supuesto, el fallo probable y la métrica que decidiría si debe llegar a producción.",
    sources: [
      { label: "OpenCV · Histogram Comparison", url: "https://docs.opencv.org/4.x/d8/dc8/tutorial_histogram_comparison.html" },
      { label: "OpenCV · Histogram Backprojection", url: "https://docs.opencv.org/4.x/dc/df6/tutorial_py_histogram_backprojection.html" },
    ],
  },
];
