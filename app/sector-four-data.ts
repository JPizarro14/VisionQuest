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
          "En una máscara binaria hay dos conjuntos: primer plano y fondo. OpenCV suele mostrar el primer plano en blanco y el fondo en negro, pero esa convención no es una ley física. Si inviertes la polaridad, también inviertes la interpretación de encoger y expandir.",
          "Antes de tocar un parámetro, escribe una frase comprobable: «los píxeles 1 representan las letras» o «los píxeles 1 representan el defecto». Así evitas limpiar justo lo que querías conservar.",
        ],
      },
      {
        title: "Una pequeña plantilla con intención",
        paragraphs: [
          "El elemento estructurante —también llamado footprint o kernel morfológico— es una cuadrícula de posiciones activas. Un rectángulo mira todas las direcciones; una cruz privilegia los ejes; un disco o elipse trata las direcciones de forma más equilibrada.",
          "El tamaño expresa la escala de lo que consideras pequeño. Una mota de dos píxeles puede desaparecer con una plantilla que no afecta a una pieza de veinte, pero una plantilla demasiado grande también se comerá detalles válidos.",
        ],
      },
      {
        title: "El ancla es el punto de apoyo",
        paragraphs: [
          "Al deslizar la plantilla, su ancla indica qué píxel de salida estamos calculando. Con tamaños impares se suele usar el centro porque es inequívoco. Los tamaños pares son posibles en algunas bibliotecas, pero obligan a declarar una convención y pueden introducir un desplazamiento aparente.",
          "También existe una política de borde: fuera de la imagen no hay muestras reales. Rellenar, replicar o elegir un valor neutro puede cambiar los objetos que tocan el marco.",
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
        prompt: "Una máscara tiene letras negras sobre fondo blanco y aplicas una operación pensando que el blanco es el objeto. ¿Cuál es el primer problema?",
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
        options: ["El learning rate", "El elemento estructurante", "La extensión del archivo", "La etiqueta de clase"],
        correctIndex: 1,
        feedback: [
          "No hay optimización ni aprendizaje en esta operación.",
          "Correcto: sus posiciones activas definen el vecindario consultado.",
          "JPEG o PNG no define la geometría local del operador.",
          "La morfología básica puede operar sin conocer clases semánticas.",
        ],
      },
      {
        id: "s4-even-anchor",
        prompt: "¿Por qué suele preferirse un footprint de tamaño impar?",
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
          "En binario, una erosión con un footprint lleno conserva el píxel central si todos los vecinos cubiertos pertenecen al objeto. Cerca del contorno alguno cae en el fondo, así que el borde retrocede.",
          "Por eso puede borrar motas claras, separar un puente estrecho o adelgazar trazos. Esas tres descripciones son el mismo mecanismo visto desde tareas distintas.",
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
          "Repetir una erosión aumenta el efecto. Varias iteraciones con una plantilla pequeña pueden equivaler a una plantilla mayor en casos concretos, pero la equivalencia depende de la forma, el borde y la implementación: no la des por universal.",
        ],
      },
      {
        title: "Limpiar también puede destruir",
        paragraphs: [
          "Si una grieta, vaso sanguíneo o tipografía fina es la señal útil, erosionar puede eliminarla. Mide no solo cuántas motas desaparecen, sino cuánto grosor, área o conectividad pierde la señal.",
          "En los límites de la imagen, el resultado depende del valor asumido fuera. Un objeto pegado al marco puede encogerse de manera diferente que uno idéntico situado en el centro.",
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
        prompt: "¿Qué efecto es razonable esperar al erosionar un puente blanco de un píxel?",
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
          "Puede cerrar una interrupción pequeña, engrosar texto o unir regiones cercanas. Que dos piezas se unan no demuestra que fueran el mismo objeto; solo demuestra que la distancia era menor que la escala impuesta.",
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
          "Una mota blanca aislada se convierte en una mancha mayor al dilatar. Por eso, para limpiar ruido claro, suele erosionarse antes y dilatar después: esa composición recibe el nombre de apertura.",
          "Si el primer plano está invertido, la misma matriz numérica puede parecer que encoge el objeto de interés. Describe siempre el conjunto sobre el que estás operando.",
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
        prompt: "¿Qué ocurre normalmente con una mota blanca aislada al dilatar?",
        options: ["Desaparece", "Crece", "Cambia a negro sin más", "Se convierte en un histograma"],
        correctIndex: 1,
        feedback: [
          "Para retirar motas claras suele ser útil erosionar o abrir.",
          "Correcto: cualquier píxel blanco extiende su influencia al vecindario.",
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
          "La apertura elimina componentes y salientes de primer plano demasiado pequeños para contener el footprint. La dilatación posterior recupera parte del tamaño de las estructuras que sí sobrevivieron, pero no resucita una mota que desapareció por completo.",
          "Es anti-extensiva en la morfología binaria clásica: el resultado no añade primer plano fuera del original. Aplicarla dos veces con el mismo elemento es idempotente; después de la primera, una segunda no debería seguir cambiando la forma ideal.",
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
          "Apertura y cierre no son inversas exactas ni se cancelan. Ambas descartan información de forma controlada y su efecto depende de polaridad, orientación y escala.",
          "Una secuencia abrir→cerrar puede quitar puntos claros y rellenar puntos oscuros, pero también redondear esquinas, separar puentes y fusionar huecos. Valida sobre rasgos que quieras proteger.",
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
          "Tampoco corresponde a la definición.",
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
          "El white top-hat resta la apertura a la imagen original. La apertura conserva estructuras claras grandes; el residual destaca puntos, líneas o brillos claros menores que la plantilla.",
          "Puede ayudar con iluminación de fondo lenta, pero no reemplaza una validación: textura clara real y ruido también pueden aparecer en el residual.",
        ],
      },
      {
        title: "Black-hat: lo oscuro que el cierre tapó",
        paragraphs: [
          "El black-hat resta la imagen original del cierre. Muestra huecos, texto oscuro o valles locales que el cierre fue capaz de cubrir.",
          "En ambos hats, «pequeño» no es absoluto: significa pequeño respecto a la forma y tamaño del elemento estructurante. Un kernel horizontal puede realzar trazos distintos a uno vertical.",
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
          "Correcto: separa las envolventes exterior e interior.",
          "Sobel y morfología son familias distintas.",
        ],
      },
      {
        id: "s4-tophat-choice",
        prompt: "Quieres resaltar pequeños reflejos blancos sobre un fondo que varía lentamente. ¿Qué residual encaja mejor?",
        options: ["White top-hat", "Black-hat", "Solo cierre", "Inversa matricial"],
        correctIndex: 0,
        feedback: [
          "Correcto: conserva lo claro que la apertura elimina.",
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
          "La erosión en grises devuelve el mínimo cubierto: las regiones brillantes se reducen y las oscuras se expanden. La dilatación devuelve el máximo: los brillos se expanden y las zonas oscuras retroceden.",
          "Como max y min no son operaciones lineales, no puedes representar este filtro con una simple suma ponderada ni esperar superposición. Responde bien a la forma de picos y valles, no al promedio.",
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
          "Aplicar mínimos o máximos por separado a R, G y B puede tomar cada canal de un vecino diferente y producir un color que no existía en ningún píxel original. En color no hay un orden total tan natural como en escala de grises.",
          "A menudo se trabaja sobre una máscara, luminancia u otro canal con significado. La elección depende de qué forma deseas preservar, no de una regla universal de «morfología RGB».",
        ],
      },
      {
        title: "Tres ramas que conviene reconocer",
        paragraphs: [
          "La reconstrucción morfológica deja crecer una imagen marcador, pero la limita mediante una máscara; sirve para recuperar componentes conectados sin la deformación de una dilatación libre. La esqueletización reduce una forma binaria a líneas centrales preservando su estructura esencial.",
          "La transformada de distancia asigna a cada píxel del objeto su distancia al fondo. Es útil para grosor, centros y semillas de separación. Las veremos de nuevo cuando tratemos forma y segmentación; aquí debes reconocer qué pregunta responde cada familia.",
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
        prompt: "Con footprint plano sobre grises, ¿qué estadístico local representa una erosión?",
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
          "Correcto: permite localizar centros y estimar grosor.",
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
          "connectedComponentsWithStats entrega además área, caja delimitadora y centroide. Esas medidas permiten filtrar motas o construir candidatos para una etapa posterior.",
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
          "En producción debes contemplar objetos que tocan el borde, agujeros, componentes fusionados y fragmentados. La calidad del etiquetado depende directamente de umbral y morfología anteriores.",
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
        prompt: "Dos píxeles blancos solo se tocan en diagonal. ¿Cómo se cuentan normalmente?",
        options: ["Uno con 4 y dos con 8", "Dos con 4 y uno con 8", "Siempre uno", "Siempre dos"],
        correctIndex: 1,
        feedback: [
          "Está invertido.",
          "Correcto: la diagonal solo pertenece a la vecindad de 8.",
          "Con conectividad 4 no existe ese enlace.",
          "Con conectividad 8 sí se consideran unidos.",
        ],
      },
      {
        id: "s4-label-meaning",
        prompt: "El mapa asigna la etiqueta 3 a una mancha. ¿Qué significa por sí solo ese 3?",
        options: ["Que pertenece a la clase 3", "Que es el tercer identificador del etiquetado", "Que tiene área 3", "Que su confianza es 0,3"],
        correctIndex: 1,
        feedback: [
          "Las clases semánticas requieren otra regla o modelo.",
          "Correcto: es un ID interno para separar componentes.",
          "El área aparece en una estadística distinta.",
          "No representa una probabilidad.",
        ],
      },
      {
        id: "s4-component-stats",
        prompt: "¿Cuál de estas medidas puede entregar connectedComponentsWithStats?",
        options: ["Learning rate", "Área y caja delimitadora", "Arquitectura CNN", "Balance de blancos"],
        correctIndex: 1,
        feedback: [
          "No hay entrenamiento.",
          "Correcto: también proporciona centroides por etiqueta.",
          "No diseña una red neuronal.",
          "La temperatura de color no es una estadística de componentes.",
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
          "Para uint8, 256 bins pueden separar cada intensidad. Con 16 bins, cada cubo resume aproximadamente 16 valores y pierde detalle a cambio de ser más compacto y, a veces, más robusto al ruido.",
          "El rango importa. En OpenCV se utiliza habitualmente [0, 256) para incluir intensidades 0…255: el extremo izquierdo entra y el derecho queda fuera. Un rango mal declarado puede descartar o colocar mal muestras.",
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
          "El histograma bruto crece con el número de píxeles. Para comparar recortes de tamaños distintos suele normalizarse por suma, norma u otra convención compatible con la métrica elegida.",
          "Una densidad o proporción permite comparar distribución, pero ya no te dice directamente cuántos píxeles reales había. Conserva ambos datos cuando el área también importa.",
        ],
      },
      {
        title: "No contiene un mapa",
        paragraphs: [
          "Si barajas todos los píxeles, el histograma no cambia aunque la imagen quede irreconocible. Tampoco sabe si dos tonos están juntos, forman un borde o pertenecen a objetos distintos.",
          "Otsu minimiza la varianza intraclase ponderada (o maximiza la varianza entre clases) para elegir un umbral global. Supone que una separación tonal en dos grupos es útil para la tarea; no distingue posiciones ni corrige una iluminación que cambia según la zona.",
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
          "Correcto: solo cuenta valores, no coordenadas.",
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
        prompt: "Quieres comparar la distribución de dos recortes con áreas distintas. ¿Qué suele ser necesario?",
        options: ["Normalizar los histogramas", "Aumentar ambos a 4K", "Ordenar los píxeles por x", "Entrenar durante más épocas"],
        correctIndex: 0,
        feedback: [
          "Correcto: evita que el tamaño domine el conteo, siempre según la métrica elegida.",
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
          "Un histograma R, otro G y otro B son tres distribuciones marginales. Dos imágenes pueden compartirlas y, sin embargo, combinar los canales de forma diferente en cada píxel.",
          "Un histograma 2D de dos canales cuenta pares, por ejemplo tono y saturación. Con 30 bins de H y 32 de S ya hay 960 celdas; añadir dimensiones multiplica memoria y exige más datos para llenar el espacio.",
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
          "calcHist puede recibir una máscara para contar solo una región de interés. Si incluyes un fondo enorme, su distribución puede ocultar justo el objeto que querías describir.",
          "Para comparar entre imágenes, conserva el mismo espacio de color, rangos, bins, máscara conceptual y normalización. Cambiar cualquiera convierte la comparación en otra pregunta.",
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
        prompt: "¿Cuándo suele ser poco fiable interpretar el tono H?",
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
        options: ["Una máscara sobre la camiseta", "Un kernel Sobel", "Aumentar el learning rate", "Guardar como JPEG"],
        correctIndex: 0,
        feedback: [
          "Correcto: el histograma contará solo la región relevante.",
          "Sobel busca cambios locales, no selecciona automáticamente la prenda.",
          "No se está entrenando nada.",
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
          "La función de distribución acumulada o CDF suma el histograma desde los tonos bajos hasta el valor actual. Tras normalizarla, puede usarse como LUT: los tonos frecuentes ocupan más espacio de salida y los rangos comprimidos se separan.",
          "En datos discretos el histograma final no tiene por qué quedar perfectamente plano. Si miles de píxeles comparten exactamente el mismo valor, un mapeo puntual no puede repartirlos sin introducir otra información.",
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
          "Si fondo y cara, cielo y suelo o metal y defecto tienen distribuciones distintas, una única CDF puede mejorar una región y sobreexponer o comprimir otra. También puede amplificar ruido en rangos muy poblados.",
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
        options: ["La CDF del histograma", "La derivada de Sobel", "La matriz de confusión", "El learning rate"],
        correctIndex: 0,
        feedback: [
          "Correcto: el conteo acumulado normalizado determina la nueva intensidad.",
          "Sobel estima gradientes espaciales.",
          "Esa matriz evalúa clasificación.",
          "No hay un proceso de optimización.",
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
          "La imagen se divide en teselas. Cada una construye su histograma y su CDF, de modo que una zona oscura no queda gobernada por millones de píxeles de otra zona brillante.",
          "Teselas más pequeñas adaptan el contraste a variaciones rápidas, pero tienen menos muestras, son más sensibles al ruido y pueden generar aspecto local exagerado. El parámetro tileGridSize expresa cuántas teselas usa OpenCV, no el tamaño de cada píxel de la tesela.",
        ],
      },
      {
        title: "Limitar antes de redistribuir",
        paragraphs: [
          "AHE puro puede convertir pequeñas fluctuaciones de ruido en contraste fuerte. CLAHE recorta los bins que superan un límite y redistribuye el excedente antes de formar la CDF.",
          "El significado numérico exacto del clip limit depende de la biblioteca y su normalización. Aprende la dirección del efecto y verifica la API concreta; copiar un valor entre OpenCV y scikit-image no garantiza el mismo resultado.",
        ],
      },
      {
        title: "Interpolar para esconder las costuras",
        paragraphs: [
          "Si cada píxel usara únicamente el mapeo de su tesela, aparecerían cambios bruscos en los límites. OpenCV interpola entre transformaciones vecinas para suavizar esas costuras.",
          "Más contraste local no siempre ayuda al sistema final. Puede crear textura en fondo, alterar estadísticas respecto al entrenamiento y elevar falsos positivos. Evalúa la tarea, no solo si la imagen parece más nítida.",
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
          "No es un crop.",
          "La conectividad pertenece al etiquetado de componentes.",
          "Conserva el número de píxeles.",
        ],
      },
      {
        id: "s4-clahe-transfer",
        prompt: "¿Puedes copiar sin más clipLimit=2 entre OpenCV y otra biblioteca esperando el mismo resultado?",
        options: ["Sí, siempre", "No: la parametrización puede estar normalizada de otra forma", "Solo en RGB", "Sí, si las teselas son impares"],
        correctIndex: 1,
        feedback: [
          "Las APIs pueden definir y normalizar el parámetro de forma diferente.",
          "Correcto: consulta la documentación y valida visual y cuantitativamente.",
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
          "OpenCV ofrece correlación, chi-cuadrado, intersección y distancia de Bhattacharyya, entre otras. En correlación e intersección, un valor mayor suele indicar más coincidencia; en chi-cuadrado o Bhattacharyya, un valor menor indica mayor similitud.",
          "Normaliza de forma compatible, trata bins vacíos y calibra umbrales con datos representativos. Un número aislado no tiene significado universal entre métricas distintas.",
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
          "Ejemplo: para contar tabletas claras sobre una cinta oscura podrías normalizar iluminación, umbralizar, abrir motas, cerrar pequeños huecos y etiquetar componentes. Pero si las tabletas se tocan, el cierre puede fusionarlas y necesitarás distancia o watershed.",
          "En una entrevista explica señal útil, perturbaciones, escala en píxeles, coste, parámetros, ablaciones y métrica final. Compara al menos un baseline sin el paso propuesto: una imagen más bonita no demuestra mejor detección.",
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
        prompt: "¿Cuál afirmación es correcta al comparar histogramas con OpenCV?",
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
        options: ["Un mapa de respuesta por píxel", "Una clase ImageNet", "Una nube de puntos 3D", "Una arquitectura CNN"],
        correctIndex: 0,
        feedback: [
          "Correcto: los píxeles compatibles con la distribución objetivo reciben mayor respuesta.",
          "No incluye un clasificador semántico.",
          "No estima profundidad.",
          "Es una operación de imagen, no un diseño de red.",
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
