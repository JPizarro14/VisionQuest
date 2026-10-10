import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[] = [
{
id:"12.01",navTitle:"Qué es segmentar",title:"Una etiqueta para cada píxel",
objective:"Distinguir segmentación semántica, de instancias y panóptica.",
lead:"Una caja delimita una región aproximada; una máscara decide qué píxeles pertenecen al objeto.",
keyIdea:"Semántica asigna clase por píxel; instancia separa objetos de la misma clase; panóptica asigna cada píxel a una instancia contable (thing) o a una región de clase no contable (stuff).",
sections:[["Tres salidas","Dos coches pueden compartir clase semántica y seguir siendo dos instancias.","En segmentación panóptica, cada coche tiene su propio segmento; la carretera se representa como región de clase stuff, sin ID de objeto individual."],["Resolución","La salida del modelo puede ser más pequeña que la imagen; al remuestrear etiquetas discretas usa vecinos cercanos.","Para probabilidades continuas, interpola antes de tomar argmax y comprueba alineación."],["Anotación","Define bordes, clases y píxeles ignorados con criterios compartidos.","Una máscara bonita no demuestra que se separen objetos adyacentes."]],
takeaways:["Semántica clasifica píxeles.","Instancia separa individuos.","Alinea tamaños y etiquetas."],
questions:[
["Dos personas con la misma clase pero IDs separados requieren...",["Segmentación de instancias","Solo histograma","Solo clasificación","Una ROI fija"],0,["Correcto: cada persona tiene máscara propia.","No separa objetos.","Una etiqueta global no ubica.","No basta para separar."]],
["Para ampliar una máscara de IDs discretos usa...",["Vecino más cercano","Bilineal siempre","Normalización z","NMS"],0,["Correcto: evita inventar IDs fraccionarios.","Mezcla IDs.","No cambia resolución.","Es para cajas."]],
["En segmentación semántica, dos coches pueden...",["Compartir una etiqueta de clase","Ser obligatoriamente IDs distintos","No aparecer","Ser píxeles ignorados"],0,["Correcto: la clase no identifica instancias.","Eso exige otra salida.","Sí pueden aparecer.","No necesariamente."]]
],labTitle:"Cuenta instancias",labInstruction:"Varía el número de coches y compara clases frente a IDs.",source:["COCO · segmentación panóptica","https://cocodataset.org/workshop/coco-mapillary-eccv-2018.html"]
},
{
id:"12.02",navTitle:"IoU y Dice",title:"La intersección de dos máscaras",
objective:"Calcular IoU y Dice y manejar máscaras vacías.",
lead:"Las métricas de máscara cuentan píxeles de conjuntos, no el rectángulo que los rodea.",
keyIdea:"IoU=TP/(TP+FP+FN); Dice=2TP/(2TP+FP+FN), para denominadores no nulos.",
sections:[["Un ejemplo","GT=10 píxeles, predicción=8 y solapan 6: unión=12, IoU=0,5 y Dice=12/18≈0,667.","Aunque correlacionan, Dice e IoU no son intercambiables en un informe."],["Clases","Calcula IoU por clase y declara si incluyes fondo y cómo promedias mIoU.","Una clase ausente en GT y predicción da unión cero: la convención de omitirla o asignar valor se debe declarar."],["Bordes y tamaño","Una pequeña desviación puede castigar mucho a un objeto diminuto.","Complementa promedio global con resultados por tamaño y ejemplos de errores."]],
takeaways:["Unión=TP+FP+FN.","Dice duplica TP en numerador.","Declara clases vacías y fondo."],
questions:[
["TP=6, FP=2, FN=4: IoU",["0,5","0,667","0,75","1"],0,["Correcto: 6/12.","Eso se acerca a Dice.","No corresponde.","Hay errores."]],
["Con esos conteos, Dice es...",["0,5","0,667","0,3","1"],1,["Es IoU.","Correcto: 12/(12+2+4).","No corresponde.","Hay errores."]],
["Si ambas máscaras están vacías, IoU directo...",["Tiene denominador cero y exige convención","Siempre vale 1 por definición matemática","Siempre vale 0","Se convierte en AP"],0,["Correcto: informa la política.","Una convención posible, no universal.","Otra convención posible.","Es otra métrica."]]
],lab:"seg-mask-iou",labTitle:"Dibuja la predicción",labInstruction:"Activa y desactiva píxeles de la máscara predicha; observa TP, FP, FN, IoU y Dice.",source:["TorchMetrics · Dice para segmentación","https://github.com/Lightning-AI/torchmetrics/blob/master/src/torchmetrics/functional/segmentation/dice.py"]
},
{
id:"12.03",navTitle:"Pérdidas y desequilibrio",title:"Aprender con pocos píxeles positivos",
objective:"Relacionar cross-entropy y pérdidas de solapamiento con clases pequeñas.",
lead:"Un defecto ocupa 1% de la imagen. Acertar todo el fondo puede parecer excelente según la métrica elegida.",
keyIdea:"Las pérdidas optimizan un objetivo de entrenamiento; la evaluación debe reflejar el coste de omitir la región de interés.",
sections:[["Cross-entropy","Penaliza probabilidades asignadas a clases equivocadas por píxel; puede ponderarse por clase.","Ignorar etiquetas no fiables requiere máscara de ignore_index coherente."],["Solapamiento","Soft Dice usa probabilidades y suavizado numérico; su fórmula concreta depende de implementación.","No reemplaza sin pruebas a cross-entropy: valida la combinación sobre la tarea."],["Diagnóstico","Compara recall del defecto, IoU por clase y falsas alarmas por imagen.","Una accuracy de píxel del 99% puede coexistir con recall nulo si 99% es fondo."]],
takeaways:["Pérdida y métrica cumplen funciones distintas.","Fondos grandes pueden dominar accuracy.","Evalúa clase minoritaria."],
questions:[
["Si 99% de píxeles son fondo, predecir todo fondo da accuracy...",["99% y recall de defecto 0","1% y recall 100%","mIoU perfecto","Dice perfecto"],0,["Correcto: se ocultan positivos.","Invirtiendo clases.","No acierta defecto.","No acierta defecto."]],
["ignore_index suele servir para...",["Excluir píxeles de pérdida según convención","Eliminar todos los falsos negativos","Aumentar resolución","Hacer NMS"],0,["Correcto: no se supervisan esos píxeles.","No modifica resultados así.","No es resize.","Es detección."]],
["Una pérdida menor en train garantiza mayor IoU test?",["No","Sí, siempre","Solo si hay Dice","Solo sin fondo"],0,["Correcto: comprueba generalización y métrica.","Hay brecha train/test.","Tampoco.","No basta."]]
],labTitle:"El fondo engaña",labInstruction:"Cambia el porcentaje de defecto con un predictor que dice siempre fondo.",source:["PyTorch · CrossEntropyLoss","https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html"]
},
{
id:"12.04",navTitle:"Keypoints y pose",title:"Puntos con significado anatómico",
objective:"Distinguir localización, visibilidad y asociación de puntos a personas.",
lead:"Una pose se expresa mediante puntos como hombros y rodillas, a veces con visibilidad u oclusión.",
keyIdea:"La calidad de un punto depende de distancia y escala del objeto; en varias personas hay que asociar cada punto a su instancia.",
sections:[["Coordenadas","Un punto (x,y) debe seguir el mismo resize, recorte y flip que la imagen.","El flip horizontal también intercambia etiquetas izquierda/derecha cuando el esquema lo exige."],["Visibilidad","Oculto no significa ausente: el dataset define cómo anotar y evaluar puntos invisibles.","Un punto sin anotación no debe interpretarse automáticamente como coordenada (0,0)."],["Evaluación","PCK y OKS son familias con normalización y umbrales específicos.","No compares puntuaciones sin protocolo, escala y convención de visibilidad."]],
takeaways:["Transforma puntos junto con imagen.","Intercambia izquierda/derecha en flips.","Declara visibilidad y escala."],
questions:[
["Al voltear horizontalmente una pose, además de x hay que revisar...",["Etiquetas izquierda/derecha","Solo intensidad azul","mAP de cajas","Número de canales"],0,["Correcto: hombro izquierdo cambia de lado visual.","No basta.","Otra tarea.","No es pose."]],
["Punto ocluido equivale siempre a no anotado?",["No, depende del protocolo","Sí","Solo con RGB","Solo si y=0"],0,["Correcto: distingue estados.","Puede estar anotado.","No depende.","No es criterio."]],
["Para evaluar distancia entre puntos de tamaños distintos conviene...",["Normalizar por una escala definida","Usar distancia bruta sin contexto siempre","Ignorar las personas pequeñas","Calcular Dice de fondo"],0,["Correcto: hace comparable el error.","Sesga escala.","Pierdes casos.","No mide keypoints."]]
],labTitle:"Refleja un punto",labInstruction:"Mueve la coordenada x y observa su reflejo en una imagen de ancho 100.",source:["COCO · keypoint evaluation","https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py"]
},
{
id:"12.05",navTitle:"OCR completo",title:"De píxeles a texto verificable",
objective:"Separar detección de texto, reconocimiento y orden de lectura.",
lead:"Leer un documento requiere localizar regiones, interpretar caracteres y reconstruir el orden.",
keyIdea:"El OCR de extremo a extremo falla si la localización recorta caracteres o si el orden de líneas es incorrecto aunque cada palabra esté bien reconocida.",
sections:[["Localizar","Las cajas o polígonos ubican líneas y palabras; rotación y perspectiva complican recortes.","Una ROI fija puede funcionar en un formulario controlado pero no en documentos variados."],["Reconocer","CER cuenta inserciones, borrados y sustituciones de caracteres dividido por longitud de referencia.","WER aplica distancia de edición a palabras; puntuación y normalización cambian el resultado."],["Validar","Separa errores de detección, transcripción y orden; mide por calidad de captura e idioma.","Para campos críticos usa validaciones de formato y revisión humana cuando procede."]],
takeaways:["OCR incluye localización y orden.","CER/WER dependen de normalización.","Diagnostica etapas."],
questions:[
["Referencia ABCD, predicción ABXD: CER",["1/4","0","1","4"],0,["Correcto: una sustitución entre cuatro caracteres.","Hay un error.","No todos fallan.","Es conteo, no tasa."]],
["Texto correcto pero líneas en orden invertido puede...",["Ser un fallo del sistema documental","Garantizar WER cero","Arreglar la detección","Ser un error de color"],0,["Correcto: el orden importa.","Depende de secuencia.","No lo arregla.","No explica."]],
["¿Qué afecta CER reportado?",["Normalización de mayúsculas y puntuación","Solo FPS","Solo IoU de cajas","Solo profundidad"],0,["Correcto: define tokenización y normalización.","No mide texto.","Es geometría.","No es métrica OCR."]]
],labTitle:"Cuenta ediciones",labInstruction:"Añade errores de carácter a una palabra de diez caracteres.",source:["Tesseract · documentación","https://tesseract-ocr.github.io/tessdoc/"]
},
{
id:"12.06",navTitle:"Sistema combinado",title:"Elegir salida y métrica para la tarea",
objective:"Diseñar evaluación separada para defectos, personas y texto.",
lead:"Una misma cámara puede alimentar tareas distintas; cada salida exige anotaciones y métricas propias.",
keyIdea:"Pregunta qué decisión se tomará con la predicción antes de escoger modelo, umbral y métrica.",
sections:[["Decisión","Defecto fino: máscara y recall del defecto; personas: cajas o instancias; serie impresa: texto con CER.","No conviertas una accuracy global en promesa de calidad de todas las etapas."],["Cascada","Una detección omitida impide reconocer el texto aunque el reconocedor aislado sea perfecto.","Evalúa módulos y resultado final sobre imágenes originales."],["Revisión","Guarda ejemplos representativos, grupos difíciles y política de rechazo.","Un pequeño benchmark congelado ayuda a comparar versiones sin ajustar sobre test."]],
takeaways:["Salida responde a una decisión.","Una cascada acumula fallos.","Mide módulos y extremo a extremo."],
questions:[
["Detector recall 80%, OCR perfecto solo en recortes detectados: recall máximo de lectura",["80%","100%","20%","0%"],0,["Correcto: las omisiones no llegan al OCR.","No rescata omisiones.","Es pérdida.","Sí lee algunos."]],
["Para defectos diminutos, pixel accuracy global puede...",["Ocultar fallos","Ser siempre suficiente","Convertirse en AP","Asegurar bordes"],0,["Correcto: fondo domina.","No necesariamente.","Distinta métrica.","No garantiza."]],
["¿Dónde validar una cascada?",["Módulos y resultado final","Solo módulos aislados","Solo latencia","Solo train"],0,["Correcto: detecta acumulación de errores.","Falta sistema.","Falta calidad.","No generaliza."]]
],labTitle:"Propaga fallos",labInstruction:"Cambia recall de detección con reconocimiento condicional fijo en 90%.",source:["TorchVision · operadores de detección y segmentación","https://docs.pytorch.org/vision/stable/ops.html"]
}
];
export const sectorTwelveLessons=buildSector(draft);
