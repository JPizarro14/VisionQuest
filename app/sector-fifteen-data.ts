import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
{
id:"15.01",navTitle:"Unidad de independencia",title:"El split empieza en el origen",
objective:"Elegir la unidad de separación para imágenes, tiles, pacientes y vídeos.",
lead:"Un test aparentemente nuevo puede incluir recortes de la misma foto vista en entrenamiento.",
keyIdea:"Agrupa por la entidad que podría compartir información espuria: imagen fuente, pieza, paciente, vídeo, cámara o fecha según el objetivo.",
sections:[["Fuga de parentesco","Tiles hermanos comparten iluminación y textura; frames vecinos comparten escena.","Hash, metadatos y agrupación ayudan a detectar duplicados y casi duplicados."],["Generalización objetivo","Si desplegarás en cámaras nuevas, deja cámaras completas fuera. Si solo cambian días, prueba por fecha.","El split debe simular el uso real, no solo producir un porcentaje bonito."],["Tres conjuntos","Entrena en train, elige configuración en validación y reserva test para estimación final.","Reusar test para escoger umbral convierte test en validación."]],
takeaways:["Define grupo antes de dividir.","Partición refleja despliegue.","Test se consulta al final."],
questions:[
["Dos tiles de una imagen fuente deben estar...",["En la misma partición","Uno en train y otro en test","Siempre en test","Solo en validación"],0,["Correcto: comparten origen.","Fuga probable.","No es necesario.","No es necesario."]],
["Objetivo: generalizar a hospitales nuevos. Split más informativo...",["Por hospital","Por píxel","Aleatorio por tile","Por score"],0,["Correcto: deja instituciones enteras fuera.","No son muestras.","Fuga.","No corresponde."]],
["Elegir umbral mirando test repetidamente...",["Sesga estimación final","Asegura independencia","Repara anotaciones","No tiene efecto"],0,["Correcto: seleccionas sobre test.","No.","No.","Sí tiene efecto."]]
],labTitle:"Detecta fugas",labInstruction:"Varía el número de tiles hermanos que cruzan particiones.",source:["scikit-learn · GroupKFold","https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html"]
},
{
id:"15.02",navTitle:"Calidad de etiquetas",title:"Desacuerdo que aporta información",
objective:"Separar ambigüedad de anotación, error y convención.",
lead:"Dos anotadores discrepan en el borde de una grieta; quizá el problema sea la definición del borde.",
keyIdea:"Escribe reglas de anotación, revisa desacuerdos con expertos y mide concordancia por clase o región antes de culpar al modelo.",
sections:[["Especificación","Define si sombras, oclusiones, reflejos y objetos truncados se anotan.","Una guía con ejemplos difíciles reduce variación sistemática."],["Auditoría","Muestrea etiquetas, ciega revisión y guarda versión y motivo de cambio.","Consenso no equivale automáticamente a verdad física; registra incertidumbre cuando existe."],["Métrica","Un IoU bajo en bordes ambiguos debe interpretarse junto al desacuerdo entre anotadores.","No corrijas anotaciones del test mirando predicciones selectivamente."]],
takeaways:["La etiqueta tiene proceso.","Desacuerdo puede señalar ambigüedad.","Audita sin contaminar test."],
questions:[
["Anotadores difieren en sombras: primer paso...",["Precisar política y revisar ejemplos","Aumentar learning rate","Eliminar test","Promediar cajas sin mirar"],0,["Correcto: define criterio.","No resuelve verdad.","No.","Puede ocultar discrepancia."]],
["Dos anotadores coinciden en todas las máscaras de un lote, pero usaron la misma guía que omite sombras. ¿Qué concluyes?",["La concordancia puede coexistir con un sesgo común","La verdad física está probada por el acuerdo","No hace falta auditar ejemplos difíciles","El IoU del modelo será necesariamente alto"],0,["Correcto: acuerdo entre personas no prueba que la definición de etiqueta sea correcta.","Ambos pueden seguir una misma regla equivocada.","La auditoría de sombras y casos límite sigue siendo necesaria.","La concordancia de etiquetas no predice por sí sola el IoU del modelo."]],
["Corregir solo GT donde falla modelo en test puede...",["Sesgar evaluación","Garantizar justicia","Aumentar resolución","Eliminar drift"],0,["Correcto: selección influida por predicción.","No.","No.","No."]]
],labTitle:"Revisa etiquetas",labInstruction:"Cambia desacuerdos en una muestra de 100 etiquetas.",source:["COCO · formato de anotaciones","https://cocodataset.org/#format-data"]
},
{
id:"15.03",navTitle:"Taxonomía de errores",title:"Contar causas, no solo fallos",
objective:"Construir una matriz de errores accionable por clase, tamaño y condición.",
lead:"Un AP bajo no dice si fallas por baja luz, objetos pequeños o confusión entre clases.",
keyIdea:"Clasifica errores con reglas mutuamente comprensibles y reporta denominadores para priorizar intervenciones.",
sections:[["Cortes","Separa FN por tamaño y borde, FP por reflejos, duplicados o clase, y casos ignorados.","Un error puede tener varias causas; define si etiquetas de causa son excluyentes."],["Denominador","«20 fallos nocturnos» carece de contexto si hay 20 o 2000 escenas nocturnas.","Informa tasa y cantidad; los grupos pequeños tienen mayor incertidumbre."],["Experimento","Si predominan costuras, prueba overlap o rejilla desplazada manteniendo test fijo.","Una intervención debe atacar una hipótesis y medirse en subgrupo y global."]],
takeaways:["Desagrega por causa.","Muestra tasas y conteos.","Prueba hipótesis aisladas."],
questions:[
["Una pieza defectuosa por escena: 20 FN de 25 escenas nocturnas frente a 20 de 2000 diurnas implican...",["Tasas muy diferentes","Mismo rendimiento","No hace falta denominador","Solo cambia FPS"],0,["Correcto: la tasa de omisión es 80% de los objetivos nocturnos frente a 1% de los diurnos.","Los conteos de FN iguales ocultan denominadores muy distintos.","Sin el número de objetivos por grupo no puedes calcular la tasa de omisión.","FPS no explica la diferencia entre 20/25 y 20/2000."]],
["Muchos fallos en costuras sugieren probar...",["Overlap y fusión global controlados","Más dropout sin diagnóstico","Quitar GT","Solo cambiar nombres"],0,["Correcto: intervención ligada a causa.","No ataca directamente.","No.","No."]],
["Una mejora global que empeora grupo crítico...",["Requiere revisar criterio de aceptación","Es siempre aceptable","Prueba que GT es malo","Elimina necesidad de desglose"],0,["Correcto: evalúa coste por grupo.","Puede ser inaceptable.","No necesariamente.","Al contrario."]]
],labTitle:"Calcula tasas",labInstruction:"Cambia el denominador de 20 fallos y observa la tasa.",source:["scikit-learn · classification report","https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html"]
},
{
id:"15.04",navTitle:"Drift y cambio de dominio",title:"Cuando cambia la cámara",
objective:"Distinguir cambios de entrada y cambios de relación etiqueta-entrada.",
lead:"Nueva iluminación, lente o población puede degradar un modelo entrenado antes.",
keyIdea:"Monitoriza distribución de entrada y resultados etiquetados; un cambio de histograma no demuestra por sí solo caída de calidad.",
sections:[["Qué cambia","Covariate shift modifica características de entrada; también puede cambiar prevalencia o definición de etiquetas.","El mismo brillo medio puede ocultar cambio de defectos."],["Señales","Compara métricas de calidad de captura y distribuciones por cámara, con tasas de rechazo y alarmas.","Una alerta de drift debe activar muestreo etiquetado y análisis de rendimiento, no reentrenamiento ciego."],["Evaluar","Congela baseline y prueba con datos de la nueva cámara, separados temporalmente.","Documenta si mejoras el dominio nuevo a costa del anterior."]],
takeaways:["Drift de entrada no equivale a error.","Necesitas etiquetas para medir calidad.","Compara dominios antiguos y nuevos."],
questions:[
["Tras cambiar la cámara, se desplaza el histograma de brillo sin etiquetas nuevas. ¿Qué sabes?",["Cambió la entrada; falta evaluación etiquetada para afirmar caída de AP","El AP cayó en la misma proporción que el brillo medio","El AP mejoró porque la nueva imagen tiene más contraste","No hay drift si el número de píxeles es el mismo"],0,["Correcto: detectas un cambio de distribución, no su efecto en calidad.","El histograma no permite calcular AP sin predicciones y GT.","Más contraste no demuestra mejor detección.","Igual resolución no implica igual distribución visual."]],
["Nueva cámara exige evaluación...",["Con muestras etiquetadas de esa cámara","Solo train loss antiguo","Solo número de píxeles","Solo puntuación media"],0,["Correcto: mide rendimiento real.","No refleja cambio.","No basta.","No garantiza."]],
["Reentrenar solo con dominio nuevo puede...",["Dañar el antiguo","Garantizar ambos","Eliminar ruido sensor","Aumentar focal"],0,["Correcto: prueba regresiones.","No.","No.","No."]]
],labTitle:"Compara prevalencia",labInstruction:"Cambia la tasa de positivos nueva y estima alertas a sensibilidad fija.",source:["scikit-learn · model evaluation","https://scikit-learn.org/stable/modules/model_evaluation.html"]
},
{
id:"15.05",navTitle:"Incertidumbre y muestra",title:"No ocultar el tamaño del test",
objective:"Relacionar tamaño de muestra con variación de proporciones y reportar intervalos.",
lead:"Una accuracy del 90% sobre diez imágenes no significa lo mismo que sobre diez mil.",
keyIdea:"Un acierto cambia la tasa 100/n puntos; los intervalos dependen de muestreo, agrupación y método elegido.",
sections:[["Sensibilidad","Con n=20, un caso cambia 5 puntos porcentuales; con n=200 cambia 0,5.","Si hay 20 tiles de una sola foto, no hay 20 escenas independientes."],["Intervalos","Bootstrap debe remuestrear unidades independientes como pacientes o vídeos cuando corresponda.","Un intervalo no elimina sesgo por muestreo no representativo."],["Informe","Da numerador, denominador, criterio de inclusión y dispersión entre grupos o semillas.","Un único promedio puede esconder peores condiciones."]],
takeaways:["Cuenta unidades independientes.","Reporta incertidumbre.","Intervalo no corrige sesgo."],
questions:[
["Un acierto sobre 20 cambia proporción...",["5 puntos","0,5 puntos","20 puntos","50 puntos"],0,["Correcto: 100/20.","Eso sería n=200.","No.","No."]],
["Un test tiene 1000 tiles de 10 fotos. Para estimar incertidumbre de generalización a fotos nuevas, remuestrea...",["Fotos completas y todos sus tiles juntos","1000 tiles independientes","Píxeles al azar entre las diez fotos","Solo los diez scores más altos"],0,["Correcto: respeta la dependencia de los tiles de cada foto.","Contar tiles hermanos como independientes subestima incertidumbre.","Píxeles del mismo origen también comparten condiciones.","Seleccionar scores altos sesga el intervalo."]],
["Intervalo estrecho de muestra sesgada garantiza generalización?",["No","Sí","Solo con mAP","Solo con 1000 tiles"],0,["Correcto: precisión no corrige selección.","No.","No.","Tiles pueden depender."]]
],labTitle:"Peso de un caso",labInstruction:"Cambia el número de unidades independientes del test.",source:["scikit-learn · cross-validation","https://scikit-learn.org/stable/modules/cross_validation.html"]
},
{
id:"15.06",navTitle:"Ciclo de mejora",title:"Del fallo a un experimento limpio",
objective:"Diseñar una intervención medible sin adaptar test.",
lead:"La mejora real exige decidir una hipótesis, construir datos adecuados y conservar comparación honesta.",
keyIdea:"Guarda versión de dataset, código, split y umbral; cambia un factor principal por experimento y evalúa test al cierre.",
sections:[["Hipótesis","Si omite objetos pequeños en bordes, prueba una estrategia de tiles y mide recall por borde.","No declares éxito porque una demo concreta se vea mejor."],["Validación","Usa validación para elegir tamaño, overlap y umbral. Congela configuración antes del test.","Versiona anotaciones y compara con baseline bajo el mismo protocolo."],["Decisión","Acepta si mejora grupo objetivo sin exceder límites de FP, latencia o privacidad.","Documenta resultados negativos y casos todavía abiertos."]],
takeaways:["Hipótesis concreta primero.","Congela antes de test.","Aceptación usa múltiples restricciones."],
questions:[
["Elegir overlap entre cinco opciones usando test...",["Contamina test","Es la única vía","No afecta","Asegura estabilidad"],0,["Correcto: es selección.","Usa validación.","Sí afecta.","No."]],
["Cambias modelo y anotaciones a la vez: comparación...",["Es difícil atribuir causa","Aísla causa","Siempre mejora","Evita versionar"],0,["Correcto: varían dos factores.","No.","No.","Al contrario."]],
["Una variante sube recall de 80% a 90% y triplica alarmas por turno. ¿Qué haces?",["Compara coste y límites acordados por turno antes de aceptar","Acepta por el recall global sin revisar la operación","Ajusta umbral en test hasta desaparecer los FP","Reporta solo AP, que reemplaza la carga de revisión"],0,["Correcto: decide en el punto operativo con costes de FN, FP y latencia.","Un recall mayor no satisface automáticamente el límite de falsas alarmas.","Elegir umbral en test contamina la estimación final.","AP no cuantifica por sí solo alarmas a un umbral desplegado."]],
],labTitle:"Balancea una mejora",labInstruction:"Aumenta recall en un escenario donde también crecen falsos positivos.",source:["scikit-learn · Precision-Recall","https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html"]
}
];
export const sectorFifteenLessons=buildSector(draft);
