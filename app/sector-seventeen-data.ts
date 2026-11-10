import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
{
id:"17.01",navTitle:"Requisitos medibles",title:"Convertir «funciona» en contrato",
objective:"Traducir necesidades a métricas, población y límites.",
lead:"«Detectar defectos» deja abiertas clases, tamaños, consecuencias y plazo.",
keyIdea:"Un requisito útil fija qué evento, sobre qué población, con qué tolerancia a FN/FP, latencia y unidad de medida.",
sections:[["Objeto de decisión","¿Detener cinta, pedir inspección o generar informe? Cada decisión admite costes distintos.","Define la verdad de referencia y quién resuelve casos ambiguos."],["Aceptación","Ejemplo: recall por defecto minúsculo ≥ objetivo y ≤ límite de falsas alarmas por 1000 piezas.","Los valores se acuerdan con operación y validan con tamaño de muestra suficiente."],["Restricciones","Anota velocidad, iluminación, acceso a datos y política de privacidad desde inicio.","No elijas arquitectura antes de saber qué se puede capturar y medir."]],
takeaways:["Define evento y denominador.","Equilibra FN/FP.","Escribe restricciones."],
questions:[
["«Accuracy 95%» sin prevalencia ni coste...",["Puede ser insuficiente","Define sistema completo","Prueba recall raro","Garantiza latencia"],0,["Correcto: falta contexto.","No.","No.","No."]],
["Cinta a 10 piezas/s con 200 ms hasta expulsor: plazo debe incluir...",["Captura a actuación","Solo modelo","Solo UI","Solo entrenamiento"],0,["Correcto: extremo a extremo.","Faltan etapas.","No basta.","No."]],
["Quién decide ambigüedad de GT debería...",["Estar definido en protocolo","Ser el modelo","Ser aleatorio","Cambiar en test según predicción"],0,["Correcto: evita inconsistencia.","No es árbitro.","No.","Sesga."]]
],labTitle:"Volumen de errores",labInstruction:"Cambia falsas alarmas por cada mil piezas para un turno de diez mil.",source:["NIST · AI Risk Management Framework","https://www.nist.gov/itl/ai-risk-management-framework"]
},
{
id:"17.02",navTitle:"Captura y geometría",title:"Diseñar la imagen antes del modelo",
objective:"Relacionar campo de visión, resolución, óptica e iluminación.",
lead:"Si una grieta de 0,2 mm ocupa menos de un píxel, ningún backbone recuperará su forma real.",
keyIdea:"Píxeles por milímetro≈ancho de imagen en píxeles / ancho de escena en milímetros, bajo un modelo local simple.",
sections:[["Escala","Con 2000 px para 100 mm hay 20 px/mm; 0,2 mm ocupa unos 4 px.","Perspectiva, desenfoque y la capacidad de la óptica para conservar contraste reducen detalle útil; la cifra geométrica es solo punto de partida."],["Iluminación","Diseña contraste estable para defecto y fondo; prueba reflejos y cambios de turno.","Un benchmark de laboratorio no representa una cámara sucia."],["Calibración","Si se mide tamaño físico, calibra y vigila distorsión y posición del objeto.","Define pruebas de captura antes de invertir en modelos."]],
takeaways:["Calcula píxeles por defecto.","Prueba iluminación real.","Calibra para medidas físicas."],
questions:[
["2000 px cubren 100 mm. Defecto 0,2 mm ocupa...",["4 px aproximadamente","20 px","0,2 px","400 px"],0,["Correcto: 20 px/mm · 0,2.","Es px/mm.","No.","No."]],
["Una grieta subpíxel se recupera exactamente con upsampling?",["No","Sí","Solo con ViT","Solo con CLAHE"],0,["Correcto: interpolar no crea detalle medido.","No.","No garantiza.","No garantiza."]],
["Medir mm desde píxeles requiere...",["Calibración geométrica adecuada","Solo softmax","NMS","Dropout"],0,["Correcto: establece escala y distorsión.","No.","No.","No."]]
],labTitle:"Presupuesto de píxeles",labInstruction:"Cambia ancho de escena con sensor fijo de 2000 px.",source:["OpenCV · camera calibration","https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html"]
},
{
id:"17.03",navTitle:"ROI y tiles",title:"Conservar objetos pequeños sin perder contexto",
objective:"Escoger ROI, tamaño de tile, overlap y reconstrucción.",
lead:"Una imagen gigante puede procesarse por regiones; el recorte también puede cortar el defecto justo en el borde.",
keyIdea:"Tile y overlap controlan cobertura y coste; todas las predicciones deben volver a coordenadas globales y deduplicarse.",
sections:[["Plan de cobertura","ROI fija sirve si la pieza siempre está alineada; de otro modo detecta o registra la pieza primero.","Overlap o rejilla desplazada rescatan bordes a cambio de más inferencias."],["Coste","Para L≥T y 0<S≤T, si incluyes el último tile pegado al borde, una pauta de posiciones usa ceil((L−T)/S)+1 tiles por eje.","La última posición puede desplazarse respecto a la rejilla regular; padding y política de extremos cambian el recuento."],["Fusión","Invierte escalado, suma origen, fusiona por clase y evalúa costuras como subgrupo.","Separa tiles hermanos por imagen origen en splits."]],
takeaways:["ROI necesita alineación.","Overlap sube coste.","Fusiona en global."],
questions:[
["Imagen 1000 px, tile 400, paso 300: posiciones mínimas por eje cubriendo borde...",["3","2","4","10"],0,["Correcto: 0,300,600 cubren hasta 1000.","Queda borde.","No hace falta.","No."]],
["Duplicados de dos tiles se comparan...",["En coordenadas globales","En x local sin origen","Contra train","Solo por color"],0,["Correcto: mismo marco.","Orígenes difieren.","No.","No basta."]],
["Solapamiento mayor tiende a...",["Más tiles y más coste","Menos tiles siempre","Eliminar todo FP","Cambiar GT"],0,["Correcto: paso menor.","Al revés.","No garantiza.","No."]]
],labTitle:"Cuenta tiles",labInstruction:"Varía paso para L=1000 y T=400 con cobertura del borde.",source:["TorchVision · batched_nms","https://docs.pytorch.org/vision/stable/generated/torchvision.ops.batched_nms.html"]
},
{
id:"17.04",navTitle:"Modelo y evaluación",title:"Comparar candidatos en el mismo terreno",
objective:"Diseñar baseline y comparación justa.",
lead:"Una arquitectura de moda carece de sentido si no mejora el criterio de aceptación sobre el mismo test.",
keyIdea:"Mantén dataset, splits, resolución y protocolo; compara calidad por subgrupos, latencia y coste.",
sections:[["Baselines","Empieza por regla clásica o modelo preentrenado pequeño cuando sea plausible.","Un baseline interpretable revela si el problema exige complejidad adicional."],["Comparación","Ajusta umbrales en validación y evalúa todos los candidatos bajo mismo límite de FP.","AP libre de umbral y rendimiento en punto operativo responden preguntas distintas."],["Ablación","Cambia ROI, overlap o backbone de uno en uno y mide efecto en grupo objetivo.","Controla semillas y versiones para reproducibilidad."]],
takeaways:["Mismo protocolo.","Compara punto operativo.","Ablación explica ganancias."],
questions:[
["Modelo A gana 3 puntos AP, pero supera el plazo p95 acordado. ¿Qué decisión está justificada?",["Comparar en un punto operativo viable y medir alternativas","Elegir A por AP aunque la actuación llegue tarde","Comparar solo tiempo de inferencia sin cola ni captura","Reducir el tamaño de test hasta cumplir p95"],0,["Correcto: calidad y plazo deben validarse juntos en el sistema completo.","El AP no compensa automáticamente incumplir el tiempo de actuación.","Omitir etapas subestima la latencia real.","Cambiar test para aparentar cumplimiento invalida la comparación."]],
["A y B tienen umbrales distintos. Para comparar recall a igual carga de revisión, fija...",["Falsas alarmas por 1000 piezas buenas","El mismo umbral numérico de score para ambos","La misma accuracy global en train","El mismo número de parámetros"],0,["Correcto: compara el recall bajo el mismo presupuesto operativo de FP.","Scores de modelos distintos no tienen por qué estar calibrados igual.","Accuracy en train no fija la carga de revisión en producción.","Los parámetros no determinan cuántas falsas alarmas se generan."]],
["Cambias ROI, backbone y NMS y mejora el recall. ¿Qué falta para atribuir la ganancia?",["Ablaciones controladas con protocolo fijo","Una única demo del modelo nuevo","Más épocas solo para el candidato nuevo","Volver a elegir el umbral en test"],0,["Correcto: aislar cambios permite saber qué componente produjo el efecto.","Una demo no separa las causas ni mide generalización.","Dar más entrenamiento solo a uno introduce otra diferencia.","Seleccionar sobre test contamina la estimación final."]],
],labTitle:"Punto operativo",labInstruction:"Cambia umbral y observa un tradeoff de juguete entre recall y FP.",source:["scikit-learn · Precision-Recall","https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html"]
},
{
id:"17.05",navTitle:"Fiabilidad del sistema",title:"Diseñar para fallos y cambios",
objective:"Definir observabilidad, fallback y actualización.",
lead:"Una cámara desconectada puede dar cero alarmas: sin telemetría, eso podría interpretarse erróneamente como cero defectos.",
keyIdea:"Separa «no se observó defecto» de «no se pudo observar» y versiona cada etapa del pipeline.",
sections:[["Estados","Entrada válida, rechazo por baja calidad, error de inferencia y salida válida son estados distintos.","No emitas predicción de «pieza buena» si nunca se recibió imagen."],["Fallback","Define cola, reintento, inspección manual o parada segura con operación según consecuencia.","Los plazos y costes de cada vía se miden."],["Cambios","Despliega con comparación y posibilidad de rollback, detecta drift y audita datos.","Incluye contrato de esquema de salida para sistemas consumidores."]],
takeaways:["Error no equivale a negativo.","Fallback explícito.","Versiona y revierte."],
questions:[
["La cámara no entregó 200 imágenes y el detector emitió cero cajas. ¿Qué registrarías?",["200 observaciones perdidas; estado de captura fallida","200 piezas buenas porque no hubo alarmas","Recall perfecto porque no hay falsos negativos registrados","200 verdaderos negativos si el FPS nominal era estable"],0,["Correcto: sin entrada no hay predicción válida sobre esas piezas.","La ausencia de alarmas no certifica que las piezas eran buenas.","No se puede medir recall sin verdad de referencia y cobertura.","El FPS nominal no sustituye las imágenes ni sus etiquetas."]],
["Una imagen llega borrosa y no se puede clasificar. ¿Qué salida preserva la incertidumbre?",["Rechazo por calidad distinto de pieza buena","Pieza buena con score cero","Pieza defectuosa para contarla como alarma","Omitirla silenciosamente del total esperado"],0,["Correcto: registra un estado de rechazo y aplica el fallback acordado.","Score cero podría confundirse con una predicción negativa válida.","Marcar defecto tampoco describe lo ocurrido en captura.","Omitirla esconde una pérdida de cobertura."]],
["Una actualización empeora recall. Para volver a una versión comprobada necesitas...",["Artefactos, configuración y datos de validación versionados","Solo recordar la fecha de la actualización","Cambiar las etiquetas del test hasta reproducir la cifra anterior","Reentrenar desde cero sin guardar preproceso"],0,["Correcto: volver implica restaurar modelo y contrato de entrada/salida reproducibles.","La fecha no recupera pesos, umbral y preproceso.","Editar GT sesga la comparación y no revierte el servicio.","Sin artefactos guardados no puedes garantizar la versión anterior."]],
],labTitle:"Cuenta observaciones",labInstruction:"Aumenta imágenes perdidas y diferencia tasa sobre recibidas y esperadas.",source:["Google · ML Test Score","https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/"]
},
{
id:"17.06",navTitle:"Diseño integrador",title:"Defender un sistema completo",
objective:"Construir una propuesta trazable desde requisito a monitorización.",
lead:"Caso: una cinta inspecciona 10 000 piezas al día, con defectos finos, luz cambiante y un expulsor a 300 ms.",
keyIdea:"Una propuesta sólida enlaza captura, datos agrupados, baseline, modelo, evaluación de defectos pequeños, latencia, fallback y revisión humana.",
sections:[["Diseñar","Estima píxeles por defecto, prueba iluminación, define clase y política de bordes.","Elige ROI o tiles según cobertura y presupuesto de cómputo."],["Validar","Separa por lote/día/pieza, mide recall del defecto a FP admisibles y latencia p95.","Prueba fallos de captura y dominio nuevo antes de prometer despliegue."],["Operar","Registra versiones y eventos sin retener más imagen de la necesaria; planifica muestra etiquetada y rollback.","Documenta límites conocidos y criterio para pedir inspección."]],
takeaways:["Traza requisito a métrica.","Valida sistema completo.","Explica fallos y fallback."],
questions:[
["Una grieta de 8 px en 4000 px se reduce a 640 px de ancho. ¿Qué comprobar primero?",["Queda cerca de 1,3 px y puede perder señal","Subir el umbral de alarma sin revisar imágenes","Cambiar NMS para agrandar la señal de entrada","Interpretar el AP global como garantía de grietas finas"],0,["Correcto: 8·640/4000=1,28 px; revisa captura, ROI y resolución.","Un umbral mayor normalmente omite más predicciones débiles.","NMS elimina cajas, no restaura detalle borrado por resize.","AP global puede ocultar fallos de objetos pequeños."]],
["Diez mil piezas buenas/día con una tasa de falsos positivos (FPR) del 1% generan...",["100 falsas alarmas/día","1","10","1000"],0,["Correcto: 0,01·10 000 negativos = 100 falsas alarmas al día.","Una alarma entre 10 000 sería una FPR del 0,01%.","Diez alarmas equivaldrían al 0,1% de los negativos.","Mil alarmas equivaldrían al 10% de los negativos."]],
["Plazo 300 ms se evalúa con...",["Latencia extremo a extremo y distribución","Solo tiempo de red","Solo FLOPs","Solo AP"],0,["Correcto: incluye variabilidad.","Faltan etapas.","No da plazo.","Es calidad."]]
],labTitle:"Presupuesto integral",labInstruction:"Cambia la tasa de falsos positivos en 10 000 piezas buenas diarias.",source:["NIST · AI Risk Management Framework","https://www.nist.gov/itl/ai-risk-management-framework"]
}
];
export const sectorSeventeenLessons=buildSector(draft);
