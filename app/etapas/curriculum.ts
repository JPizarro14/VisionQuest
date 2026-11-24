// Las decisiones se leen como una ficha: mecanismo, caso concreto, límite y prueba.
type Piece = [name: string, mechanism: string, example: string, limit: string, verify: string];
type Passage = [title: string, text: string, formula?: string];
type Check = {
  prompt: string;
  choices: [label: string, feedback: string][];
  correct: number;
};
export type Stage = {
  id: string;
  title: string;
  question: string;
  goal: string;
  lesson: Passage[];
  pieces: Piece[];
  worked: { title: string; given: string; steps: string[]; conclusion: string };
  transfer: [challenge: string, reasoning: string];
  glossary: [term: string, definition: string][];
  quiz: Check[];
  further: [lessonId: string, label: string][];
};

export const stages: Stage[] = [
  {
    id: "captura", title: "De la escena a los números",
    question: "¿Puede verse la grieta antes de pedirle al modelo que la encuentre?",
    goal: "Distinguir lo que captó la cámara de lo que cabe en el array.",
    lesson: [
      ["Empieza por la decisión", "Una línea de inspección debe apartar una pieza si tiene una grieta. Por ahora basta una decisión por pieza; no necesitamos dibujar su contorno. Señala en la foto qué detalle tendría que distinguir una persona para decidirlo."],
      ["La cámara toma muestras", "Cada posición de la rejilla recoge luz de una zona de la escena. El enfoque, el movimiento y la iluminación limitan el detalle real. Si ampliamos una foto ya borrosa, interpolamos entre medidas antiguas: hay más casillas, no otra observación."],
      ["Un píxel, varios valores", "Al decodificar una foto RGB, en una misma posición hay tres valores, no tres píxeles. En NumPy es habitual (H, W, C): Height = alto/filas, Width = ancho/columnas, Channels = canales. Shape da las dimensiones; size cuenta todos los valores.", "imagen[y, x] → [rojo, verde, azul]\n480 × 640 píxeles RGB → shape (480, 640, 3)"],
      ["Representar no es medir otra vez", "El tipo (dtype) fija qué números caben; el rango observado dice cuáles aparecen realmente. Un canal uint8 ofrece 256 niveles entre 0 y 255. Convertir el 255 a float32 da 255.0, no 1.0: reescalar es otra operación."],
    ],
    pieces: [
      ["Color RGB o grises (grayscale)", "RGB conserva tres canales; los grises resumen intensidad.", "Para detectar una mancha roja en metal gris, conservaría el color. Para medir una silueta a contraluz probaría grises.", "Una mancha y el fondo pueden tener intensidad parecida aunque tengan colores distintos.", "Compara las dos representaciones sobre las mismas piezas difíciles."],
      ["Captura más cercana o ampliación (upsampling)", "Acercar la cámara modifica el muestreo físico; interpolar solo cambia la rejilla digital.", "Si una fisura ocupa una fracción de píxel, ensayaría otra óptica o un campo de visión menor.", "Ganar detalle puede dejar parte de la pieza fuera de campo.", "Mide cuántos píxeles ocupa una grieta conocida y revisa foco y cobertura."],
    ],
    worked: { title: "Presupuesto de píxeles", given: "En una región frontal y enfocada, 2.000 píxeles de ancho cubren 100 mm. Buscamos grietas de 0,2 mm.",
      steps: ["Escala local = 2.000 / 100 = 20 píxeles por mm.", "Ancho esperado = 0,2 × 20 = 4 píxeles.", "Al reducir el ancho a una cuarta parte, la grieta ocuparía alrededor de 1 píxel."],
      conclusion: "La escala advierte de una posible pérdida, no garantiza detección. Mira la grieta en la entrada real, no solo en la foto original." },
    transfer: ["Si el ancho de escena se duplica sin cambiar el sensor, ¿qué ocurre con la grieta?", "Se reduce a la mitad la escala: 10 píxeles/mm y unos 2 píxeles por grieta. Ampliar después no recupera muestras nuevas."],
    glossary: [["Muestreo (sampling)", "Dónde se mide la imagen."], ["Cuantización (quantization)", "En qué niveles se representa cada medida."], ["Tensor (tensor)", "Array numérico cuyos ejes tienen un significado acordado."]],
    quiz: [
      { prompt: "La grieta no se distingue ni en la foto original desenfocada. ¿Qué probarías primero?", choices: [["Interpolar al doble", "Esto estima nuevos valores a partir de los mismos datos borrosos."], ["Revisar enfoque y escala de captura", "Hay que comprobar que la cámara capture la señal antes de intentar aprenderla."], ["Entrenar más épocas", "Eso no aporta observaciones nuevas de la grieta."]], correct: 1 },
      { prompt: "Una imagen RGB tiene 20 filas y 30 columnas. ¿Qué guarda en una sola posición?", choices: [["Tres píxeles independientes", "Las tres intensidades comparten una posición espacial."], ["Un número igual a la suma del RGB", "El array RGB conserva las componentes."], ["Un píxel con tres valores", "Hay 600 posiciones y 1.800 valores."]], correct: 2 },
      { prompt: "Un píxel uint8 vale 128. Solo cambias su tipo a float32. ¿Qué lees?", choices: [["128.0", "Cambió la representación, no la escala."], ["Aproximadamente 0,5", "Faltaría dividir por 255."], ["1.0", "Cambiar el tipo no satura ni normaliza a uno."]], correct: 0 },
    ],
    further: [["01.01", "Píxeles y matrices"], ["01.05", "Espacios de color"], ["17.02", "Captura y geometría"]],
  },
  {
    id: "datos", title: "De las fotos a un dataset fiable",
    question: "¿Me examino con piezas nuevas o con otra foto de la misma pieza?",
    goal: "Definir las etiquetas, la unidad de independencia y un reparto representativo.",
    lesson: [
      ["Qué significa una etiqueta", "Una foto es una observación, no necesariamente un ejemplo independiente. Si dos inspectores no coinciden sobre una raya superficial, fija primero qué cuenta como grieta y cómo tratar casos dudosos. Una etiqueta (label) es una referencia con ese criterio."],
      ["Separar antes de multiplicar", "Entrenamiento (train) ajusta parámetros; validación (validation) guía decisiones; prueba (test) da una evaluación final. Reparte por pieza de origen antes de generar recortes o aumentos. Que dos archivos tengan nombres distintos no los hace independientes."],
      ["Investigar por qué varían las imágenes", "Cuenta clases por pieza y por turno, mira imágenes y compara histogramas. La media describe nivel; la varianza, dispersión alrededor de la media. PCA combina características para conservar las direcciones de mayor varianza, que podrían describir iluminación y no defectos."],
      ["Lo que se aprende de los datos", "Un cambio de formato fijo puede repetirse en todas las particiones. En cambio, si aprendes una media para normalizar o una proyección PCA para el modelo, ajústala solo con train y aplica la misma transformación a validación y test."],
    ],
    pieces: [
      ["Reparto por grupo (group split)", "Mantiene juntas las imágenes de un mismo origen.", "Con cinco vistas por pieza, asigna la pieza completa a una sola partición.", "Separar por pieza no garantiza cubrir un turno nocturno distinto.", "Comprueba que no se repitan identificadores y compara prevalencia y condiciones entre particiones."],
      ["Histograma (histogram)", "Cuenta cuántos valores caen en cada intervalo.", "Si de noche baja el contraste, compara los histogramas de train con una muestra representativa de ese turno.", "Dos distribuciones de brillo iguales pueden corresponder a formas distintas.", "Contrasta el gráfico con piezas etiquetadas y ejemplos visuales."],
      ["Componentes principales (PCA)", "Proyecta características centradas sobre direcciones que conservan la mayor varianza.", "Dos medidas de brillo casi duplicadas pueden resumirse en una componente.", "Una grieta fina podría aportar menos varianza que la iluminación y perderse.", "Compara con no usar PCA y mide en validación qué ocurre con las grietas finas."],
    ],
    worked: { title: "Cien fotos no son cien piezas independientes", given: "Hay 20 piezas, 5 fotos por pieza y 4 piezas defectuosas.",
      steps: ["Unidad que se decidirá revisar = pieza. Prevalencia por pieza = 4 / 20 = 20 %.", "Si sorteas las 100 fotos por separado, otra vista de una pieza de prueba puede acabar en train.", "Agrupa por ID de pieza, reparte los grupos e inspecciona cuántos defectos reales quedan en cada partición."],
      conclusion: "Cuatro defectos son pocos para estimar el rendimiento con precisión; ningún reparto crea lotes defectuosos nuevos." },
    transfer: ["Tienes 1.000 recortes de diez fotografías. ¿Cómo probarías si generaliza a una fotografía nueva?", "Separa por foto de origen antes de recortar; si varias fotos corresponden a una misma pieza, agrupa también por pieza. Informa del número de orígenes independientes."],
    glossary: [["Prevalencia (prevalence)", "Proporción real de casos positivos en la población elegida."], ["Fuga de datos (data leakage)", "Información de evaluación que influye en el aprendizaje o selección."], ["Varianza (variance)", "Promedio de las desviaciones cuadráticas respecto de la media de una población."]],
    quiz: [
      { prompt: "Hay vídeo de cada pieza en movimiento. ¿Dónde pondrías sus fotogramas consecutivos?", choices: [["En particiones diferentes", "Tendrías vistas casi idénticas en entrenamiento y evaluación."], ["Alternados para equilibrar el tamaño", "Equilibrar tamaños no evita la dependencia."], ["Juntos en la partición de su pieza", "La evaluación debe probar generalización a otros orígenes."]], correct: 2 },
      { prompt: "La primera componente de PCA cambia casi solo con la iluminación. ¿Qué garantiza?", choices: [["Máxima varianza proyectada en train", "Ese es su objetivo, no la capacidad de reconocer grietas."], ["Máxima separación entre clases", "PCA no utiliza esas etiquetas."], ["Que la luz causa los defectos", "Una proyección no demuestra causalidad."]], correct: 0 },
      { prompt: "Quieres estandarizar usando una media aprendida. ¿De dónde sale?", choices: [["De todo el conjunto", "El test influiría en la preparación del modelo."], ["Solo de entrenamiento", "Se congela y se reutiliza en validación, test e inferencia."], ["Una media nueva en cada partición", "Así cambiaría el contrato y usarías estadísticas del conjunto evaluado."]], correct: 1 },
    ],
    further: [["06.02", "Dividir sin fuga"], ["02.07", "Autovalores, SVD y PCA"], ["15.02", "Calidad de etiquetas"]],
  },
  {
    id: "preparacion", title: "Preparar la entrada y elegir filtros",
    question: "¿Qué cambio ayuda a ver la grieta y cuál puede borrarla?",
    goal: "Comparar cada operación con la imagen sin filtrar y preparar un lote válido.",
    lesson: [
      ["Parte de una referencia", "Antes de una red, prueba una regla sencilla (baseline): con fondo estable, un umbral separa zonas oscuras. Evalúa por separado sombras, reflejos y grietas pequeñas. No añadas filtros porque la foto «quede bonita»."],
      ["Contraste no es detalle nuevo", "Si una grieta y su entorno ocupan un intervalo estrecho de intensidades, redistribuir los tonos puede hacerla más visible. La ecualización global usa un histograma de toda la foto; CLAHE actúa por zonas y limita la amplificación. Si la señal no fue capturada, ninguna inventa el contorno real."],
      ["Ruido, escala y etiquetas", "Un punto blanco aislado y una raya real de un píxel pueden parecerse a un filtro. Compara con no filtrar. Al reducir una foto, atenúa el detalle demasiado fino para evitar patrones falsos (aliasing). Aplica la misma geometría a cajas y máscaras; no mezcles identificadores de clase al interpolar una máscara."],
      ["El contrato de entrada", "Respeta color, dtype, rango y normalización del modelo. Para convertir NHWC en NCHW mueve el eje de canales, no reagrupes con reshape. Una operación vectorizada permite que cada canal reciba el mismo ajuste en todos los píxeles (broadcasting).", "RGB uint8 → convertir a int16 → sumar [20, 10, 0] → clip(0, 255) → uint8\nlote: (N, H, W, C) → permute(0, 3, 1, 2) → (N, C, H, W)"],
    ],
    pieces: [
      ["Sin filtro + umbral (threshold)", "Compara la intensidad con un límite y genera una máscara.", "Con piezas oscuras sobre un fondo claro fijo, prueba primero un umbral. Otsu propone uno global a partir del histograma.", "Una sombra puede parecer defecto; un umbral global falla con iluminación desigual.", "Mide falsos positivos por turno frente a una referencia etiquetada."],
      ["Ecualización local (CLAHE)", "Redistribuye las intensidades dentro de teselas, limita el contraste y combina las teselas.", "Para resaltar una grieta de bajo contraste en una foto iluminada de forma desigual, compara CLAHE sobre luminosidad con ecualización global y sin ajuste.", "Una tesela demasiado pequeña o un límite excesivo puede realzar ruido; tocar cada canal RGB por separado altera colores.", "Compara grietas recuperadas y falsas texturas con el mismo conjunto y criterio."],
      ["Mediana (median filter)", "Sustituye cada píxel por la mediana de sus vecinos.", "Para puntos de ruido «sal y pimienta», la mediana de [20, 255, 21] es 21.", "También puede eliminar grietas estrechas que sean minoría dentro de la ventana.", "Mide detección en piezas limpias y ruidosas, desglosando por grosor."],
      ["Gaussiano (Gaussian blur)", "Hace una media ponderada que da más peso a los vecinos cercanos.", "Antes de reducir una textura periódica, prueba un paso bajo ajustado a la escala para reducir moiré.", "Un suavizado excesivo borra detalles reales además de la textura.", "Compara patrones falsos y el tamaño de los defectos que sobreviven al resize."],
      ["Bilateral (bilateral filter)", "Pondera por cercanía espacial y similitud de intensidad.", "En una pieza con ruido suave y un borde marcado, intenta suavizar el interior sin cruzar ese borde.", "No preserva todos los bordes; suele costar más que el gaussiano.", "Mide error de contorno y tiempo por imagen frente al gaussiano."],
      ["Recorte o teselas (crop / tiles)", "Conservan resolución local sin enviar la imagen enorme entera.", "Si la grieta desaparece al reescalar, procesa la región de interés o teselas con solapamiento.", "Puede cortarse un defecto en un borde. Hay que volver a coordenadas globales y fusionar repetidos.", "Evalúa defectos en las costuras, cobertura total y latencia."],
    ],
    worked: { title: "No confundas ruido con un defecto", given: "La pieza tiene puntos blancos aislados y una grieta oscura fina. El ajuste RGB de un píxel [250, 100, 5] es [20, 10, 0].",
      steps: ["En int16, el resultado intermedio es [270, 110, 5]. Saturar antes de volver a uint8 da [255, 110, 5].", "Ese ajuste de color no elimina puntos aislados. Ensaya mediana 3 × 3 sobre otra copia y conserva un control sin filtro.", "Compara ambas entradas en las mismas piezas y observa específicamente si las grietas de un píxel desaparecen."],
      conclusion: "Cambiar color, quitar ruido y resaltar contraste son decisiones diferentes. Elige según el problema observado." },
    transfer: ["Una imagen se ve más nítida tras CLAHE pero se disparan las alarmas en piezas buenas. ¿Lo conservarías?", "No por su aspecto. Compara sin CLAHE y con menor amplificación en la misma validación; revisa ruido y reflejos a igual sensibilidad."],
    glossary: [["Región de interés (ROI)", "Zona que importa para la decisión."], ["Remuestreo (resampling)", "Evaluar la imagen en otra rejilla."], ["Normalización (normalization)", "Ajustar los valores según un contrato, no simplemente cambiar el dtype."]],
    quiz: [
      { prompt: "La grieta existe pero el contraste local es bajo y la luz varía por zonas. ¿Qué ensayo responde a ese diagnóstico?", choices: [["CLAHE sobre luminosidad frente a no procesar", "Compara el contraste local y controla las falsas texturas."], ["Más épocas como primera intervención", "No evalúa si el problema era el contraste de entrada."], ["Mediana enorme en todas las imágenes", "Una ventana grande podría eliminar la grieta."]], correct: 0 },
      { prompt: "Una máscara contiene IDs 0 y 2. Tras reescalarla aparece la clase 1 sin existir. ¿Qué cambiarías?", choices: [["El optimizador", "El error ya está en la etiqueta antes de entrenar."], ["La interpolación a vecino más cercano", "Copia IDs existentes sin inventar categorías intermedias."], ["La pérdida por una gaussiana", "Esto no repara identificadores interpolados."]], correct: 1 },
      { prompt: "La grieta desaparece justo al reducir la imagen a 224 px. ¿Qué comparación harías primero?", choices: [["Adam frente a SGD", "Ambos recibirían la misma señal perdida."], ["Más épocas con la misma entrada", "No devuelve las muestras que ya se descartaron."], ["La reducción actual frente a una ROI de mayor resolución", "Ataca la etapa donde deja de verse la señal."]], correct: 2 },
    ],
    further: [["03.07", "Mediana y bilateral"], ["04.11", "CLAHE"], ["02.02", "Broadcasting"], ["17.03", "ROI y teselas"]],
  },
  {
    id: "prediccion", title: "Del tensor a la predicción",
    question: "¿Qué devuelve una neurona y qué necesita devolver el sistema?",
    goal: "Seguir una imagen por las capas y elegir arquitectura, salida y etiquetas compatibles.",
    lesson: [
      ["Seguir una señal", "En el pase hacia delante (forward pass) una convolución recorre ventanas. Cada filtro suma productos y un sesgo; se reutilizan los pesos en muchas posiciones y se forma un mapa de características. Una capa densa también suma productos, pero no aplica un mismo filtro espacial en una rejilla.", "z = suma(píxel × peso correspondiente) + sesgo"],
      ["Transformar y resumir", "Una activación no lineal como ReLU permite que varias capas hagan algo más que una transformación afín. Max pooling conserva el mayor valor local; el promedio conserva la respuesta media. Repetir bloques combina patrones. Nada de esto actualiza pesos durante el pase."],
      ["Qué quiere decir una salida", "La cabeza (head) traduce características en el resultado requerido. Un logit es una puntuación sin normalizar, no un porcentaje. Para clases excluyentes, softmax convierte los logits en una distribución: valores no negativos que suman uno. Eso no garantiza que estén calibrados.", "softmax(z_i) = exp(z_i − m) / suma_j exp(z_j − m), con m = máximo(z)\nRestar m no cambia el cociente y evita exponenciar números positivos enormes."],
      ["Diseña desde la pregunta, no desde la marca", "«¿Hay defecto?», «¿dónde está?» y «¿qué superficie ocupa?» exigen etiqueta por imagen, cajas y máscaras respectivamente. Un modelo preentrenado puede ser una buena referencia. Una arquitectura más grande solo compensa si mejora la métrica importante bajo tus límites de datos y latencia."],
    ],
    pieces: [
      ["ReLU o activación con pendiente negativa", "ReLU(z) = máximo(0, z); Leaky ReLU conserva una pequeña pendiente para z negativo.", "En una CNN, empieza por la activación de la arquitectura preentrenada; si entrenas desde cero y muchas unidades se quedan inactivas, compara una variante con pendiente.", "Cambiar la activación cambia los valores que reciben las capas posteriores.", "Inspecciona activaciones y gradientes, y compara el resultado en validación."],
      ["Máximo o promedio (max / average pooling)", "Uno resume el pico de una zona; el otro, su respuesta media.", "Para [0, 0, 0, 4], el máximo es 4 y la media 1. Un pico aislado puede señalar una pequeña grieta o simplemente ruido.", "Ambos pierden ubicación exacta; un promedio global puede diluir una grieta pequeña.", "Prueba con grietas y puntos de ruido en las mismas posiciones."],
      ["Softmax multiclase (multiclass)", "Las clases compiten; una distribución suma uno. En entrenamiento, la entropía cruzada de PyTorch recibe los logits directamente.", "Clasificar una pieza en exactamente una categoría: íntegra, rayada o rota, según un protocolo de etiqueta única.", "No permite expresar bien dos etiquetas simultáneas. No apliques softmax dos veces.", "Evalúa la matriz de confusión por clase y la calibración si usarás probabilidades."],
      ["Sigmoide binaria o multietiqueta (sigmoid)", "Cada logit se interpreta por separado con 1 / (1 + exp(−z)). BCEWithLogitsLoss combina sigmoide y pérdida binaria de forma estable.", "Con un logit responde «¿hay grieta?»; con uno por defecto puede marcar grieta y óxido en la misma foto.", "Los valores entre clases no tienen que sumar uno; un umbral común no siempre es adecuado.", "Usa etiquetas por clase y elige los umbrales con validación."],
      ["Salida continua (regression)", "Predice una magnitud en las unidades de la etiqueta, no una distribución sobre clases.", "Para estimar el ancho de la grieta en mm, usa etiquetas calibradas y una salida continua; MAE mide error absoluto.", "Softmax sobre «fina/gruesa» no entrega automáticamente mm. Una salida lineal tampoco impone positividad.", "Compara error en mm y comprueba los extremos del intervalo."],
      ["Detector o segmentador (detection / segmentation)", "Un detector como YOLO localiza con cajas; un segmentador como U-Net puede dar una puntuación por píxel.", "Para guiar una revisión elige cajas; para estimar la superficie dañada, máscaras y escala física.", "Una caja incluye fondo; las máscaras son más costosas de etiquetar.", "Mide localización o solapamiento según la salida, además del plazo de respuesta."],
      ["CNN o transformador visual (vision transformer)", "Una CNN aprende filtros locales; la atención compara fragmentos y combina información de varias posiciones.", "Compara una CNN pequeña para inspección en cámara con un modelo preentrenado de atención si el contexto de toda la pieza importa.", "La atención no es una explicación causal y un modelo mayor puede exceder memoria o latencia.", "Mismo reparto y resolución pertinente: mide calidad por tipo de defecto y coste real."],
    ],
    worked: { title: "De un píxel al mapa, del mapa al logit", given: "Una ventana tiene [0.0, 1.0, 0.5, 0.2]. El filtro usa [0.2, 0.4, −0.1, 0.3] y sesgo 0.1.",
      steps: ["z = 0 + 0.4 − 0.05 + 0.06 + 0.1 = 0.51; ReLU(0.51) = 0.51.", "Ese número es una respuesta en UNA posición del mapa. El resto de las capas combina muchas respuestas.", "Supón que al final salen logits [2, 0] para [íntegra, grieta]. Softmax ≈ [0.881, 0.119]."],
      conclusion: "La activación interna 0.51 no era un 51 % de probabilidad. Se necesitan la cabeza, las clases y la interpretación convenida." },
    transfer: ["El cliente ahora quiere marcar grieta Y óxido a la vez. ¿Basta con cambiar el optimizador?", "No. Cambia el contrato de etiquetas, usa logits por defecto y pérdida binaria por clase. El nuevo requisito no se resuelve entrenando más una salida excluyente."],
    glossary: [["Logit (logit)", "Puntuación sin normalizar para una salida."], ["Mapa de características (feature map)", "Rejilla de respuestas de un canal interno."], ["Distribución (probability distribution)", "En clasificación excluyente, probabilidades de las clases que suman uno."]],
    quiz: [
      { prompt: "El modelo debe marcar corrosión y golpe si coexisten. ¿Qué cabeza usarías?", choices: [["Softmax porque suma uno", "Eso fuerza competencia entre clases que pueden coexistir."], ["Un logit por etiqueta con sigmoides", "Cada etiqueta puede activarse independientemente."], ["Un número medio de defectos", "El recuento no identifica cuáles están presentes."]], correct: 1 },
      { prompt: "Una activación interna vale 0.8. ¿Qué se puede afirmar?", choices: [["Hay 80 % de probabilidad de grieta", "No se ha llegado a una salida probabilística."], ["Solo falta compararla con el umbral 0.5", "Un umbral de clasificación no interpreta mapas internos arbitrarios."], ["Es la respuesta de esa unidad", "Su significado depende de la capa; no es automáticamente confianza."]], correct: 2 },
      { prompt: "Debes pintar el contorno exacto de cada zona dañada, no solo señalar su presencia. ¿Qué referencia prepararías?", choices: [["Máscaras etiquetadas por píxel", "La referencia permite aprender y medir la silueta."], ["Solo el nombre del defecto", "No indica dónde está el contorno."], ["Solo cajas envolventes", "Incluyen fondo y no describen la silueta exacta."]], correct: 0 },
    ],
    further: [["07.02", "Activaciones"], ["09.04", "Pooling"], ["10.01", "Multiclase y multietiqueta"], ["09.08", "Elegir arquitectura"], ["13.01", "Atención y tokens"]],
  },
  {
    id: "entrenamiento", title: "Del error al aprendizaje",
    question: "¿Cómo modifica un batch los pesos y qué decisiones tomas tú?",
    goal: "Seguir una actualización completa y justificar pérdida, optimizador, tasa y duración.",
    lesson: [
      ["Una predicción y una referencia por ejemplo", "En aprendizaje supervisado el lote (batch) contiene entradas y etiquetas. Los mismos pesos sirven para todos sus ejemplos. Calcula sus predicciones y la pérdida (loss); con reducción media, una pérdida por ejemplo se combina en un escalar.", "pérdidas de ejemplo: [0.2, 0.8] → pérdida media = (0.2 + 0.8) / 2 = 0.5"],
      ["Una pérdida, muchos gradientes", "Backpropagation deriva la función que produjo la pérdida, no el número 0.5 aislado. Recorre las operaciones al revés con la regla de la cadena. Una unidad oculta no tiene su propia etiqueta: se suman las contribuciones de las salidas conectadas y se aplica la derivada local. Derivar la media del lote ya promedia las contribuciones.", "z = w × x + b; a = ReLU(z)\nsi z > 0: gradiente de w = gradiente recibido en a × x\nuna entrada usada en dos caminos recibe la suma de ambos"],
      ["Actualizar y repetir", "El optimizador (optimizer) recibe los gradientes y actualiza pesos y sesgos entrenables. El siguiente batch ya usa los pesos nuevos. Una época (epoch) termina tras recorrer el conjunto de entrenamiento. En validación se predice sin actualizar: sirve, por ejemplo, para elegir cuándo parar.", "100 ejemplos / 10 por batch = 10 actualizaciones por época\n5 épocas = 50 actualizaciones sin acumulación de gradientes"],
      ["Buscar el primer valor inválido", "Entrada → activaciones → pérdida → gradientes → pesos nuevos. Busca el primer NaN o infinito en ese orden. Una tasa enorme puede romper el paso aunque el forward anterior fuese válido. Usa pérdidas estables sobre logits; un epsilon en una división justificada no arregla un dato de entrada inválido."],
    ],
    pieces: [
      ["Entropía cruzada (cross-entropy)", "En clasificación excluyente penaliza −log de la probabilidad de la clase verdadera.", "Si la clase correcta recibe 0.2, L ≈ 1.61; si recibe 0.9, L ≈ 0.105.", "Su versión para logits ya hace la operación estable internamente. Para varias etiquetas simultáneas usa pérdida binaria por clase.", "Revisa índices de etiquetas y si la función espera logits, no porcentajes."],
      ["Error absoluto o cuadrático (MAE / MSE)", "MAE penaliza la distancia absoluta; MSE eleva el error al cuadrado.", "Con errores de ancho 1 y 3 mm: MAE = 2 mm; MSE = 5 mm². MSE da más peso relativo al error grande.", "Una anotación absurda puede dominar MSE. No compares las cifras de MAE y MSE como si fueran la misma unidad.", "Usa una métrica de validación que refleje la tolerancia física real."],
      ["Descenso estocástico (SGD)", "Resta una fracción del gradiente del batch a cada parámetro.", "Es una referencia interpretable y con poco estado adicional para entrenar una CNN.", "Una tasa demasiado alta puede hacer oscilar la pérdida; una baja puede avanzar muy despacio.", "Traza las curvas con varios learning rates razonables, manteniendo fijo el reparto."],
      ["SGD con inercia (momentum)", "Acumula direcciones recientes para dar continuidad a los pasos.", "Si los lotes alternan direcciones ruidosas pero hay una tendencia estable, compara SGD con y sin momentum.", "La inercia también puede pasarse del mínimo; no sustituye elegir una tasa adecuada.", "Compara convergencia y resultado de validación con el mismo presupuesto de entrenamiento."],
      ["Adam y AdamW", "Adam adapta el paso por parámetro con estimaciones de los gradientes y sus cuadrados. AdamW separa de ese ajuste el decaimiento de pesos (weight decay).", "Al afinar un transformer preentrenado puedes partir de su receta AdamW y una tasa pequeña para no destruir representaciones útiles.", "No son siempre mejores que SGD. Un mismo learning rate numérico no hace necesariamente justa la comparación.", "Ajusta la tasa para cada candidato y compara calidad, tiempo y memoria en la misma validación."],
      ["Tasa y épocas (learning rate / epochs)", "La tasa controla el tamaño del ajuste; las épocas, cuántas veces se recorren los datos.", "Si train sigue mejorando y validación empeora durante varias épocas, conserva el mejor checkpoint y prueba parada temprana con paciencia.", "Cambiar tasa y duración a la vez dificulta el diagnóstico; un solo mal batch no demuestra sobreajuste.", "Revisa curvas y métrica objetivo con validación, nunca elijas la época usando test."],
      ["Ajuste fino o pesos congelados (fine-tuning / freezing)", "Puedes entrenar solo la cabeza o adaptar parte o todo el modelo preentrenado.", "Con pocas piezas etiquetadas, ensaya primero una cabeza sobre características congeladas; después descongela un bloque con tasa menor.", "Si el dominio cambió mucho, las características congeladas pueden no representar el defecto.", "Compara ambas estrategias por subgrupo a igual partición."],
    ],
    worked: { title: "Sigue un peso durante un lote entero", given: "Modelo didáctico: predicción = w × x, sin sesgo; w = 1. Dos pares (entrada, etiqueta): (2, 1) y (1, 1). Usamos L = 0.5 × (predicción − etiqueta)².",
      steps: ["Forward con el mismo w: predicciones [2, 1]. Pérdidas [0.5, 0]; la pérdida del batch es 0.25.", "Para cada ejemplo, dL/dw = (predicción − etiqueta) × x. Contribuciones [2, 0]; el gradiente de la media es 1.", "Un paso de SGD con learning rate 0.1: w nuevo = 1 − 0.1 × 1 = 0.9.", "En el mismo lote las predicciones ahora son [1.8, 0.9]; las pérdidas [0.32, 0.005]. La media baja a 0.1625, aunque el segundo ejemplo empeora."],
      conclusion: "El objetivo del paso es la pérdida del lote. Un paso no garantiza mejorar cada ejemplo ni generalizar a piezas nuevas." },
    transfer: ["Con 16 neuronas ocultas y 4 salidas, ¿de dónde salen las 16 señales? ¿Cuándo cambian los pesos?", "Para cada unidad oculta se suman las señales de las salidas conectadas ponderadas por los pesos actuales; se sigue la regla de la cadena. Primero se calculan los gradientes y luego el optimizador hace el paso."],
    glossary: [["Gradiente (gradient)", "Derivadas de la pérdida respecto a los parámetros."], ["Reducción (loss reduction)", "Cómo se agrupan pérdidas: por ejemplo, media o suma."], ["Época (epoch)", "Una pasada por el conjunto de entrenamiento."]],
    quiz: [
      { prompt: "Dos ejemplos dan gradientes 4 y −2 para un peso. Con pérdida media, ¿qué gradiente usa SGD?", choices: [["2, la suma", "La reducción especificada divide también por dos."], ["0.5, dos medias seguidas", "La división ya queda incluida al derivar la media."], ["1, la media de 4 y −2", "Es un solo paso con el gradiente del lote."]], correct: 2 },
      { prompt: "Un modelo preentrenado recomienda AdamW. ¿Cómo sabrías si compensa frente a SGD?", choices: [["Comparar en validación con tasa apropiada y presupuesto comparable", "La receta es una referencia, no prueba de superioridad."], ["Elegir el que minimice la pérdida del primer batch", "No mide generalización ni convergencia."], ["Escoger siempre AdamW porque es más reciente", "La elección depende de tarea, coste y datos."]], correct: 0 },
      { prompt: "Train mejora hasta la época 60, pero validación alcanza su mejor valor en la 24 y después empeora. ¿Qué conservarías?", choices: [["La época 60 porque ha visto más datos", "Seguir optimizando train no garantiza generalización."], ["El checkpoint 24 según el criterio de validación", "Conserva el modelo elegido sin usar test para decidir."], ["La época que dé mayor puntuación en test", "Convertiría test en validación."]], correct: 1 },
    ],
    further: [["07.04", "Funciones de pérdida"], ["07.05", "Retropropagación"], ["07.06", "Optimizadores"], ["08.05", "Tasa y calendario"], ["02.12", "Logaritmos y estabilidad"]],
  },
  {
    id: "evaluacion", title: "De una puntuación a una decisión",
    question: "¿Cuándo merece la pena apartar la pieza para revisarla?",
    goal: "Elegir métricas y umbral según el coste real y comprobarlos fuera de entrenamiento.",
    lesson: [
      ["Dos preguntas que no son intercambiables", "Sensibilidad (recall) pregunta qué fracción de los defectos detectamos; precisión (precision), qué fracción de las alarmas era correcta. Si los defectos son raros, unas pocas falsas alarmas entre muchas piezas buenas pesan mucho en la precisión.", "recall = VP / (VP + FN)\nprecision = VP / (VP + FP)"],
      ["Del score al riesgo", "Una probabilidad calibrada de 0.2 significa que entre muchos casos comparables con esa predicción cerca de un 20 % son positivos. Softmax no garantiza esto. La esperanza (expected value) pondera cantidades con sentido —como euros— por su probabilidad; no promedia los nombres de las clases."],
      ["Elegir y comprobar", "Fija el coste de pasar un defecto y el límite de revisiones posibles. Explora el umbral en validación representativa y congélalo antes del test final. Si calibras probabilidades, usa datos separados del ajuste del modelo; no ajustes el umbral con la prueba final."],
    ],
    pieces: [
      ["Umbral de decisión (decision threshold)", "Convierte puntuación en acción.", "Si pasar una grieta es muy costoso, compara umbrales más bajos para ganar sensibilidad.", "Aumentará o se mantendrá el número de alarmas en un mismo conjunto. Más alarmas puede saturar la revisión.", "Cuenta falsos negativos y revisiones por mil piezas a cada umbral."],
      ["Calibración (calibration)", "Contrasta probabilidades anunciadas con frecuencias observadas.", "Antes de usar una confianza del 80 % para calcular euros, comprueba qué ocurre entre piezas con ese score.", "Una buena exactitud no garantiza calibración. Con otra cámara las frecuencias pueden cambiar.", "Examina grupos de probabilidad con suficientes ejemplos y condiciones representativas."],
      ["Métricas espaciales (IoU / Dice)", "Miden solapamiento de cajas o máscaras; IoU = intersección / unión.", "Si hay que localizar un defecto, no basta con acertar su clase: compara la región predicha y la anotada.", "El mismo desplazamiento castiga más a un objeto pequeño. Define qué hacer si ambas regiones están vacías.", "Desglosa por tamaño y clase y acompaña el número de una revisión visual."],
    ],
    worked: { title: "Esperanza de coste, no promedio de etiquetas", given: "La probabilidad calibrada de defecto es 0.2. Revisar cuesta 5 € y evita el daño. Dejar pasar un defecto cuesta 100 €; dejar pasar una pieza buena cuesta 0 €.",
      steps: ["No revisar: coste esperado = 0.2 × 100 + 0.8 × 0 = 20 €.", "Revisar: coste = 5 €. Bajo estos supuestos es preferible revisar.", "Punto de indiferencia: p × 100 = 5 → p = 0.05. El umbral no sale de una regla universal de 0.5."],
      conclusion: "Cambia el resultado si cambian los costes, la capacidad de revisión o la calibración. Comprueba el criterio en datos nuevos." },
    transfer: ["Mantén los costes y cambia el coste de revisar a 25 €. Para p = 0.2, ¿qué decisión minimiza ahora el coste esperado?", "Pasar cuesta 20 € en esperanza; revisar, 25 €. Cambia la acción sin que cambien la predicción ni los pesos."],
    glossary: [["Falso negativo (false negative)", "Defecto real no detectado."], ["Falso positivo (false positive)", "Alarma sobre una pieza buena."], ["Esperanza (expected value)", "Suma de cada resultado numérico por su probabilidad."]],
    quiz: [
      { prompt: "Se detectan 9 de 10 defectos y se emiten 30 alarmas en total. ¿Cuál es la precisión?", choices: [["9 / 30 = 30 %", "El denominador de precision son todas las alarmas."], ["9 / 10 = 90 %", "Esa es la sensibilidad."], ["10 / 30", "Los defectos no detectados no son verdaderos positivos."]], correct: 0 },
      { prompt: "¿Cuándo usarías 0.7 como probabilidad para calcular un coste esperado?", choices: [["Siempre que salga de softmax", "La normalización no garantiza frecuencias reales."], ["Tras verificar calibración en casos representativos", "El cálculo necesita probabilidades que correspondan con el uso real."], ["Solo si el umbral es 0.7", "Umbral y calibración responden a preguntas distintas."]], correct: 1 },
      { prompt: "Dos máscaras se cruzan en 6 píxeles y su unión tiene 10. ¿Qué significa IoU = 0.6?", choices: [["60 % de las piezas están bien clasificadas", "IoU no mide exactitud de clase del conjunto."], ["La red tiene 60 % de confianza", "No es una puntuación de confianza."], ["El 60 % de la unión es compartido", "Compara la geometría de estas regiones."]], correct: 2 },
    ],
    further: [["02.10", "Probabilidad y esperanza"], ["10.04", "Precisión y sensibilidad"], ["10.06", "Calibración"], ["10.07", "Costes y desbalance"]],
  },
  {
    id: "despliegue", title: "Del experimento al uso real",
    question: "¿Seguirá funcionando con la cámara y el plazo de la línea real?",
    goal: "Verificar el sistema completo y decidir cuándo volver a los datos o al modelo.",
    lesson: [
      ["La predicción es solo una parte", "En inferencia (inference) se ejecuta el forward con pesos fijos. El sistema también captura, decodifica, preprocesa, interpreta la salida y actúa. Guarda imágenes de referencia y resultados intermedios esperados para comprobar que producción respeta el contrato de entrenamiento."],
      ["Medir el plazo real", "Latencia es el tiempo de una decisión; rendimiento (throughput), cuántas decisiones se terminan por segundo. Acumular imágenes en lotes puede mejorar el segundo y perjudicar el primero. Mide bajo carga desde cámara hasta actuación, no solo el promedio del forward."],
      ["Cerrar el ciclo", "Con una cámara nueva o luz de invierno cambia la distribución (drift). Monitoriza entradas, alarmas y resultados confirmados. Ver scores distintos no demuestra pérdida de precisión: necesita etiquetas nuevas. Si vuelve el fallo, separa captura, preprocesamiento, modelo y decisión antes de reentrenar."],
    ],
    pieces: [
      ["Dispositivo o servidor (edge / server)", "Acerca la inferencia a la cámara o centraliza potencia de cálculo.", "Si la red es intermitente y la cinta no puede esperar, ensaya un modelo local pequeño.", "El dispositivo limita memoria y potencia; el servidor añade transporte y dependencia de red.", "Mide de extremo a extremo, incluidos colas y desconexiones."],
      ["Cuantización del modelo (model quantization)", "Representa pesos o activaciones con menor precisión para reducir tamaño y, en hardware compatible, tiempo.", "Prueba una versión INT8 si el modelo de referencia no cabe en la cámara.", "La aceleración no está garantizada. Puede empeorar la detección de defectos raros.", "Compara el modelo convertido sobre el dispositivo con las mismas piezas y límites de calidad."],
      ["Monitorizar o reentrenar (monitoring / retraining)", "Monitorizar busca cambios; reentrenar modifica los parámetros.", "Si suben las alarmas justo tras sustituir la cámara, revisa primero color, iluminación y entradas de referencia.", "Reentrenar para compensar un canal invertido oculta un error y exige etiquetas.", "Reproduce el fallo etiquetado, corrige una causa cada vez y conserva un modelo al que volver."],
    ],
    worked: { title: "Una red rápida que llega tarde", given: "Una pieza debe revisarse antes de 100 ms. Para una misma pieza se miden 25 ms de captura, 20 de cola, 40 de inferencia y 25 de actuación.",
      steps: ["Latencia de esa pieza = 25 + 20 + 40 + 25 = 110 ms.", "Aunque el modelo solo tarda 40 ms, el sistema llega 10 ms tarde.", "Mide la distribución de latencia extremo a extremo bajo carga y prueba si reducir cola resuelve el problema sin afectar a la calidad."],
      conclusion: "No sumes percentiles aislados como si fueran el percentil del recorrido. Cronometra cada pieza completa." },
    transfer: ["De repente hay más alarmas, pero todavía no hay etiquetas del nuevo turno. ¿Puedes afirmar que cayó la precisión?", "No. Podrían haber cambiado la prevalencia, la cámara o el software. Compara entradas conocidas, muestrea piezas con y sin alarma y consigue referencias antes de reentrenar."],
    glossary: [["Inferencia (inference)", "Usar el modelo para predecir sin actualizar pesos."], ["Latencia (latency)", "Tiempo desde la entrada hasta el resultado o la actuación definidos."], ["Cambio de distribución (distribution shift)", "Los datos de uso difieren de los usados en desarrollo."]],
    quiz: [
      { prompt: "Una prueba en portátil dice 15 ms por forward. ¿Qué falta para aceptar el sistema?", choices: [["Solo el número de parámetros", "No mide el coste real."], ["Latencia completa bajo carga en el destino", "Incluye captura, cola, preparación, inferencia y actuación."], ["Elegir un optimizador más rápido", "El optimizador no se ejecuta al predecir."]], correct: 1 },
      { prompt: "Cambia la cámara y aumentan las alarmas. ¿Qué harías antes de reentrenar?", choices: [["Comparar entradas y etiquetar una muestra representativa", "Distingue cambio de datos, error del contrato y cambio de prevalencia."], ["Declarar que todas son falsos positivos", "Sin la verdad de referencia no se sabe."], ["Bajar el umbral sin medir", "Podría incrementar todavía más las alarmas."]], correct: 0 },
      { prompt: "INT8 cabe en memoria pero pierde grietas finas. ¿Basta con el ahorro?", choices: [["Sí, siempre que quepa", "La capacidad de detectar sigue siendo un requisito."], ["Sí, porque cambió únicamente el formato", "Cuantizar puede afectar las predicciones."], ["No: verifica calidad y plazo contra los requisitos", "Solo despliega si cumple ambos en datos y hardware representativos."]], correct: 2 },
    ],
    further: [["16.01", "Contrato de inferencia"], ["16.04", "Monitorización"], ["14.01", "Ampliación: vídeo"], ["17.06", "Diseño integrador"], ["18.06", "Defender una solución"]],
  },
];
