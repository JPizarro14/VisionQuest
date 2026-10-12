import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
{
id:"18.01",navTitle:"Explicar fundamentos",title:"Defiende una decisión con números",
objective:"Responder preguntas básicas de imagen, tensor y geometría sin memorizar eslóganes.",
lead:"En una entrevista técnica se espera que expliques cómo una decisión cambia los datos, no solo nombres una API.",
keyIdea:"Declara convención, realiza una cuenta pequeña, explica el caso límite y cómo lo comprobarías.",
sections:[["Forma","Imagen (H, W, C) = (480, 640, 3) frente a tensor (N, C, H, W) = (1, 3, 480, 640): se reordenan los ejes y se añade lote. H = Height (alto), W = Width (ancho), C = Channels (canales).","No confundas Width/ancho con la primera dimensión de una imagen NumPy en esta disposición: primero va Height/alto."],["ROI","Un recorte [y1:y2,x1:x2] usa extremos exclusivos; box xyxy continuo tiene ancho x2−x1.","Una ROI local debe devolver resultados al marco global."],["Respuesta","Explica supuesto, cálculo, prueba y riesgo; reconoce convenciones que varían entre librerías.","Una afirmación absoluta sin unidades es más frágil que un ejemplo verificable."]],
takeaways:["Di shape y ejes.","Declara convenciones.","Calcula y valida."],
questions:[
["(H, W, C) = (480,640,3) a (N, C, H, W) con batch 1...",["(1,3,480,640)","(1,480,640,3)","(3,640,480,1)","(640,480,3)"],0,["Correcto: lote, C = Channels/canales, H = Height/alto, W = Width/ancho.","Es NHWC.","Invierte ejes.","Falta lote."]],
["img[10:20,30:50] contiene...",["10 filas y 20 columnas","11 y 21","20 y 10","10 y 50"],0,["Correcto: extremos exclusivos de fila y columna.","Incluir ambos extremos daría 11 y 21, pero Python excluye el superior.","El primer eje son filas y el segundo, columnas.","50 es el extremo final de columna, no el número de columnas."]],
["Caja local x=5 con tile origen x=100: x global...",["105","95","5","100"],0,["Correcto: suma origen.","Restaste.","Falta origen.","Ignora local."]]
],labTitle:"Transforma coordenadas",labInstruction:"Mueve origen y convierte una ROI local en global.",source:["NumPy · indexing","https://numpy.org/doc/stable/user/basics.indexing.html"]
},
{
id:"18.02",navTitle:"Diagnóstico de métricas",title:"Detectar el número engañoso",
objective:"Elegir métricas para positivos raros y distinguir IoU, AP y recall.",
lead:"Un candidato dice «99% accuracy» en inspección de defectos del 1%; ¿qué pedirías después?",
keyIdea:"Solicita matriz de confusión, prevalencia, recall de defecto, FP por volumen y desempeño por tamaño/condición.",
sections:[["Desglose","Predicción siempre fondo logra 99% accuracy con 0% recall positivo.","Para segmentación pide IoU/Dice de defecto; para detección, AP y un punto operativo a FP admisibles."],["IoU","IoU compara regiones y puede ser umbral de matching; score de confianza es otra magnitud.","AP agrega ranking bajo un protocolo."],["Decisión","Un coste FN alto puede exigir recall mayor aun con FP adicionales, si operación lo admite.","Explica supuestos y ajusta umbral solo en validación."]],
takeaways:["Accuracy puede ocultar clase rara.","No mezcles score e IoU.","Mide punto operativo."],
questions:[
["1% defectos, todo fondo: recall del defecto...",["0%","99%","1%","100%"],0,["Correcto: no encuentra ninguno de los positivos reales.","99% es la accuracy global en este ejemplo, no el recall positivo.","1% es la prevalencia, no la proporción de defectos encontrados.","El recall sería 100% solo si encontrase todos los defectos."]],
["Una caja tiene IoU 0,8 con GT y score 0,2. ¿Qué concluyes?",["Buena localización en ese ejemplo, pero score bajo","80% de probabilidad calibrada de acertar","El score debe ser 0,8","El GT es erróneo porque los números difieren"],0,["Correcto: IoU mide solapamiento geométrico y score es una salida distinta del detector.","Un IoU de una caja frente al GT no calibra su score como probabilidad.","No existe obligación de que el score coincida numéricamente con IoU.","La diferencia entre métricas no demuestra un error de anotación."]],
["¿Dónde elegir umbral de alarma?",["Validación","Test final repetidamente","En la etiqueta GT","Por tamaño de archivo"],0,["Correcto: se selecciona en validación y se reserva test para estimación final.","Repetir la selección en test adapta el sistema a sus ejemplos.","GT aporta verdad de referencia, no un score de alarma.","El tamaño de archivo no mide el equilibrio entre FN y FP."]]
],labTitle:"Error de base",labInstruction:"Varía prevalencia con predictor todo negativo.",source:["scikit-learn · confusion matrix","https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html"]
},
{
id:"18.03",navTitle:"Diseño experimental",title:"Encontrar una mejora que sea real",
objective:"Detectar fuga, confusión de factores y selección sobre test.",
lead:"Un colega obtiene mAP +8 tras dividir aleatoriamente tiles de las mismas imágenes y ajustar NMS sobre test.",
keyIdea:"Antes de celebrar, rehace split por origen, fija umbrales en validación y repite comparación en test congelado.",
sections:[["Fuga","La textura compartida por tiles hermanos puede elevar resultados sin generalizar.","Busca duplicados y familias de muestras entre particiones."],["Ablación","Modelo, tamaño de tile y NMS cambiados juntos impiden atribuir mejora.","Una tabla de versiones y un factor principal por ensayo aclaran causa."],["Incertidumbre","Informa conteos por clase, intervalos por unidad independiente y resultados en nuevos lotes.","Un +8 con test pequeño puede ser inestable."]],
takeaways:["Split por origen.","Test final intacto.","Descompón mejoras."],
questions:[
["Train y test contienen tiles de la misma fotografía. ¿Qué puede inflar el resultado?",["Texturas y condiciones compartidas entre particiones","Una cuantización aplicada por igual a todos los tiles","Un umbral de score congelado antes del test","Un protocolo que agrupa todas las fotos por pieza"],0,["Correcto: tiles hermanos comparten escena y pueden causar fuga de información.","La cuantización común no explica la dependencia entre train y test.","Un umbral fijado antes de test no causa esa fuga.","Agrupar por pieza evita que sus fotos y tiles crucen particiones."]],
["Ajustar NMS en test convierte test en...",["Conjunto de selección","GT","Datos sin etiqueta","Entrenamiento de pesos"],0,["Correcto: se elige configuración mirando el resultado en test.","GT son las anotaciones de referencia, no el conjunto usado para elegir NMS.","Si comparas métricas de NMS en test, has usado sus etiquetas.","No actualizas pesos, pero sí ajustas una decisión del sistema."]],
["Una mejora aparece en un solo lote de ocho piezas. ¿Qué la haría más creíble?",["Repetir en lotes independientes con baseline e incertidumbre","Elegir el mejor umbral en esas ocho piezas y reportarlo como test final","Multiplicar los tiles de esas piezas y contarlos como observaciones independientes","Eliminar del informe el lote que no mejoró"],0,["Correcto: la evidencia debe incluir unidades independientes y comparación con baseline.","Seleccionar sobre el mismo test sobreestima la mejora.","Los tiles de una pieza comparten origen; no aumentan la evidencia como piezas nuevas.","Excluir a posteriori un lote desfavorable sesga la evaluación."]]
],labTitle:"Sensibilidad a un caso",labInstruction:"Varía n y observa cuánto cambia una tasa por un acierto.",source:["scikit-learn · GroupKFold","https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html"]
},
{
id:"18.04",navTitle:"Arquitectura bajo plazo",title:"Una respuesta de diseño completa",
objective:"Proponer pipeline con captura, tiles, postproceso y límites de latencia.",
lead:"Una cámara de 4000×3000 ve objetos de 10 px; bajar a 640 puede borrarlos.",
keyIdea:"Estima tamaño tras resize, prueba tiles o óptica alternativa y calcula coste de inferencias y fusión global.",
sections:[["Resolución","Reducción horizontal 4000→640 da factor 0,16; un objeto de 10 px queda en ~1,6 px.","Considera sensor y ROI antes de elegir solo modelo."],["Tiles","Cuenta tiles y overlap; convierte cajas a global antes de NMS.","Mide recall cerca de costuras y latencia p95 con colas."],["Tradeoff","Más tiles puede aumentar recall y superar plazo; acuerda qué requisito manda.","Defiende baseline, experimento y fallback."]],
takeaways:["Calcula tamaño final.","Cuenta inferencias.","Mide costuras y plazo."],
questions:[
["Objeto 10 px al pasar ancho 4000→640 queda...",["1,6 px aprox.","10 px","62,5 px","640 px"],0,["Correcto: 10·640/4000=1,6 px si el escalado es uniforme.","El objeto también se reduce al aplicar el resize.","Has invertido el factor 640/4000.","640 px es el ancho de toda la imagen resultante."]],
["Comparar cajas de tiles para NMS exige...",["Coordenadas globales","Solo x local","Solo logits","Solo GT"],0,["Correcto: primero invierte resize y suma el origen de cada tile.","Dos valores locales iguales pueden referirse a lugares distintos.","Los logits no sustituyen la ubicación de las cajas para calcular IoU.","GT permite evaluar, pero NMS fusiona predicciones durante inferencia."]],
["Tiles elevan recall de 85% a 92%, pero la latencia p95 sube de 180 a 310 ms con límite de 250 ms. ¿Qué procede?",["Optimizar o rediseñar y volver a medir contra ambos límites","Aceptar 92% porque el promedio de recall pesa más que p95","Reportar solo el tiempo del modelo sin cola ni fusión","Medir latencia en una única imagen para descartar el p95"],0,["Correcto: se deben cumplir el criterio de calidad y el plazo extremo a extremo.","El límite p95 acordado sigue incumplido aunque mejore el recall.","El tiempo parcial no representa la latencia del sistema.","Un caso aislado no estima el percentil 95 bajo carga."]]
],labTitle:"Objeto tras resize",labInstruction:"Cambia ancho final de una imagen de 4000 px.",source:["TorchVision · resize","https://docs.pytorch.org/vision/stable/generated/torchvision.transforms.functional.resize.html"]
},
{
id:"18.05",navTitle:"Fallo de producción",title:"Investigar una caída de calidad",
objective:"Ordenar diagnóstico ante cambio de cámara y datos.",
lead:"Tras actualizar el firmware hay menos alarmas, aunque el FPS y la latencia parecen mejores.",
keyIdea:"Comprueba primero si llegan frames, tamaño, color, exposición y preproceso; después evalúa con etiquetas y compara versión anterior.",
sections:[["Observabilidad","Menos alarmas puede deberse a menos piezas capturadas o umbral distinto.","Revisa conteos de entradas, rechazos y errores, no solo salidas positivas."],["Reproducir","Toma muestras autorizadas de antes/después, fija modelo y compara pipeline y resultados.","Versiona firmware, calibración, normalización y postproceso."],["Mitigar","Si se confirma pérdida crítica, activa rollback o inspección manual según plan.","No reentrenes a ciegas sobre datos sin etiqueta."]],
takeaways:["Comprueba entrada antes que modelo.","Mide con etiquetas.","Ten rollback."],
questions:[
["Menos alarmas y menos frames recibidos sugieren...",["Fallo de captura posible","Mejora de precisión demostrada","Recall mayor","mAP perfecto"],0,["Correcto: revisa recepción y cobertura antes de comparar alarmas.","Menos alarmas no demuestra que una mayor fracción sea correcta.","Sin GT en los frames perdidos no se conoce el recall.","mAP requiere un conjunto etiquetado y protocolo de evaluación."]],
["Cambio RGB/BGR tras firmware puede...",["Alterar predicciones","No tener efecto nunca","Cambiar GT","Corregir NMS"],0,["Correcto: permuta canales respecto a lo que esperaba el modelo.","Puede alterar la entrada aunque algunas imágenes parezcan similares.","GT describe la escena y no cambia por el orden de canales.","NMS actúa sobre cajas, no corrige canales permutados."]],
["Primer resultado operativo ante calidad crítica degradada...",["Seguir política de fallback/rollback","Esperar meses sin medir","Ocultar logs","Usar test para entrenamiento"],0,["Correcto: contiene el riesgo según el protocolo acordado.","Una degradación crítica exige una respuesta operativa inmediata.","Sin registros no podrás reconstruir causa ni cobertura.","Entrenar con test rompe su independencia y no resuelve la incidencia inmediata."]]
],labTitle:"Tasa real de alarmas",labInstruction:"Cambia frames recibidos manteniendo 50 alarmas y 1000 frames esperados.",source:["Google · ML Test Score","https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/"]
},
{
id:"18.06",navTitle:"Examen integrador",title:"Explica tu propuesta y sus límites",
objective:"Resolver un caso nuevo y justificar decisiones reproducibles.",
lead:"Caso: detectar grietas finas en una línea nueva con 30 fps, 2% de positivos, presupuesto de 250 ms y revisión humana limitada.",
keyIdea:"Una buena respuesta une señal capturable, datos sin fuga, métrica del defecto, pipeline medido y una vía para errores y cambio de dominio.",
sections:[["Propuesta","Estima píxeles por grieta; recoge datos por lotes y turnos; define guía de etiqueta y baseline.","Evalúa ROI/tiles con pruebas de costura e iluminación."],["Decisión","Con 2% de positivos, informa recall/FP por volumen, AP o IoU según salida, y latencia extremo a extremo.","Ajusta umbral en validación y congela test por lotes."],["Defensa","Explica qué no sabes: prevalencia por turno, coste FN y tiempos de actuación reales.","Propón experimento que reduzca esa incertidumbre y una política de fallback."]],
takeaways:["Explica supuestos.","Cuantifica unidades y coste.","Declara evidencia que falta."],
questions:[
["De 10 000 piezas, 2% son defectuosas. Con recall 90%, ¿cuántos defectos se omiten aproximadamente?",["20","200","180","9800"],0,["Correcto: 200 positivos · (1−0,90) = 20 falsos negativos.","200 es el total de positivos, antes de aplicar recall.","180 son los verdaderos positivos detectados.","9800 son las piezas buenas, no los defectos omitidos."]],
["Para 30 fps, intervalo entre frames...",["33,3 ms aprox.","30 ms exactos","250 ms","3,3 ms"],0,["Correcto: 1000/30.","Aproximación errónea.","Es presupuesto.","Sería 300 fps."]],
["Evaluación más defendible...",["Split por lote/turno y test final congelado","Aleatoria por tile","Umbral ajustado en test","Solo una demo"],0,["Correcto: refleja dominio y evita fuga.","Los tiles de la misma pieza/lote comparten origen; repartirlos entre train y test filtra información.","Ajustar el umbral con el test usa el conjunto final para seleccionar el modelo y sesga el resultado.","Una demo no estima falsos negativos ni variación entre lotes o turnos."]]
],labTitle:"Presupuesto de respuesta",labInstruction:"Cambia tiempo de inferencia y compáralo con 250 ms totales.",source:["NIST · AI Risk Management Framework","https://www.nist.gov/itl/ai-risk-management-framework"]
}
];
export const sectorEighteenLessons=buildSector(draft);
