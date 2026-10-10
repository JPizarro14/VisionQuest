import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
{
id:"16.01",navTitle:"Pipeline de inferencia",title:"El modelo es una etapa",
objective:"Calcular latencia y reconocer contratos de pre/postproceso.",
lead:"Una predicción útil llega después de capturar, transformar, ejecutar y devolver un resultado interpretable.",
keyIdea:"El contrato de inferencia fija tamaño, canales, escala, normalización, versiones y transformación inversa de coordenadas.",
sections:[["Entrada","La normalización usada en entrenamiento se reproduce en producción; RGB/BGR y letterbox importan.","Una caja debe invertirse al sistema de coordenadas original."],["Salida","Umbral, NMS y fusión de tiles forman parte del sistema que se evalúa.","Registra versión de modelo y preproceso con cada salida para poder reproducirla."],["Tiempo","Suma captura, transferencia, cola, modelo y postproceso para latencia extremo a extremo.","Una inferencia de 20 ms no implica respuesta total de 20 ms."]],
takeaways:["Contrato reproducible.","Transforma resultados de vuelta.","Mide toda la ruta."],
questions:[
["Modelo 20 ms y resto 80 ms: latencia mínima secuencial...",["100 ms","20 ms","80 ms","4 ms"],0,["Correcto: 20+80.","Ignora etapas.","Ignora modelo.","No corresponde."]],
["Si entrenas RGB y sirves BGR sin conversión...",["Cambias entrada y puedes degradar calidad","No importa nunca","Mejoras mAP automáticamente","Cambias GT"],0,["Correcto: orden de canales afecta.","Puede importar.","No.","No."]],
["NMS usado en producción debería...",["Incluirse en evaluación del sistema","Ocultarse en test","Aplicarse a GT","Ser fijo universal"],0,["Correcto: afecta salida final.","Impide reproducir.","No corresponde.","Ajusta con validación."]]
],labTitle:"Suma etapas",labInstruction:"Varía cola de espera y observa latencia total.",source:["PyTorch · inference_mode","https://docs.pytorch.org/docs/stable/generated/torch.inference_mode.html"]
},
{
id:"16.02",navTitle:"Batch y throughput",title:"Más imágenes por lote no siempre ayuda",
objective:"Distinguir throughput, latencia individual y utilización.",
lead:"Un batch puede amortizar costes y aumentar imágenes por segundo, pero hace esperar a las primeras peticiones.",
keyIdea:"Throughput=imágenes procesadas/tiempo; latencia por petición incluye espera de formar lote y ejecución, no se deduce solo del throughput.",
sections:[["Lote","Un lote de 8 en 80 ms ofrece 100 imágenes/s durante ejecución, si no hay otros cuellos.","Una petición puede esperar por las otras siete y exceder SLA."],["Saturación","Con llegada superior a capacidad, la cola crece; limita admisión o escala recursos.","Mide p50/p95/p99 con tráfico representativo y arranque en frío."],["Decisión","En inspección de flujo continuo, throughput puede dominar; en alarma urgente importa plazo por objeto.","Elige batch con perfiles reales y memoria disponible."]],
takeaways:["Throughput no es latencia.","Cola crece al saturar.","Perfil con carga real."],
questions:[
["8 imágenes en 80 ms de ejecución: throughput ideal...",["100 imágenes/s","8 imágenes/s","10 imágenes/s","640 imágenes/s"],0,["Correcto: 8/0,08.","Confunde lote.","Es lotes/s.","Multiplicaste."]],
["Si llegan 120 imágenes/s a capacidad 100/s sostenida...",["Cola tiende a crecer","Cola desaparece","Latencia siempre baja","AP cambia automáticamente"],0,["Correcto: 20/s excedente.","No.","No.","No necesariamente."]],
["Batch 8 aumenta throughput, pero la primera petición espera a siete más. ¿Qué puede ocurrir?",["Mayor latencia individual aunque suba throughput","Latencia de cada petición exactamente igual a 80/8 ms","Desaparece toda espera de cola","Se garantiza el mismo p95 con cualquier tasa de llegada"],0,["Correcto: formación de lote y cola se suman al tiempo de ejecución.","Dividir el tiempo del lote no incluye espera ni etapas compartidas.","Agrupar peticiones puede aumentar la espera de la primera.","El p95 depende de carga, política de batch y variabilidad."]],
],labTitle:"Carga y capacidad",labInstruction:"Cambia tasa de llegada ante capacidad fija de 100 imágenes/s.",source:["NVIDIA · Triton batching","https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/batcher.html"]
},
{
id:"16.03",navTitle:"Cuantización",title:"Menos bits, otra curva de error",
objective:"Evaluar memoria, latencia y calidad tras reducir precisión.",
lead:"Cuantizar pesos y a veces activaciones ahorra memoria o tiempo en hardware compatible, pero altera valores.",
keyIdea:"Pasar pesos float32 a int8 reduce almacenamiento bruto de cada peso de 4 a 1 byte; tamaño total y velocidad dependen de escalas, activaciones y soporte.",
sections:[["Conversión","Calibración de activaciones puede usar un conjunto representativo sin tocar test.","PTQ y QAT son estrategias distintas; comprueba compatibilidad de operadores."],["Error","Compara métricas globales, clases raras, objetos pequeños y calibración antes/después.","Un descenso pequeño medio puede ser grave si afecta un caso crítico."],["Hardware","Benchmark en dispositivo final con batch real y etapas completas.","Más compresión no asegura menor latencia si faltan kernels eficientes."]],
takeaways:["Memoria de pesos puede bajar.","Calibra fuera de test.","Mide calidad y hardware."],
questions:[
["Peso float32 a int8, almacenamiento bruto por peso...",["Cuarta parte","Mitad","Igual","Cuatro veces"],0,["Correcto: 4 bytes a 1.","Eso sería 16 bits.","No.","Al revés."]],
["Tras cuantizar a int8, el archivo pesa menos pero el FPS no cambia. ¿Qué comprobarías?",["Kernels, transferencias y tiempo de pre/postproceso en el hardware final","Declarar fallo de la cuantización solo por tamaño de archivo","Medir únicamente número de parámetros","Suponer que cualquier GPU acelera int8 por igual"],0,["Correcto: el cuello de botella puede estar fuera de pesos o faltar kernels eficaces.","El tamaño no mide por sí solo latencia ni calidad.","Los parámetros no reflejan operador, memoria ni etapas externas.","El soporte y la eficiencia de int8 varían por hardware y operador."]],
["Calibrar cuantización sobre test final...",["Contamina test","Es obligatorio","No cambia nada","Crea GT"],0,["Correcto: test influye diseño.","Usa datos separados.","Sí puede.","No."]]
],labTitle:"Calcula memoria",labInstruction:"Cambia millones de pesos y compara float32/int8 bruto.",source:["TorchAO · quantized inference","https://docs.pytorch.org/ao/stable/workflows/inference.html"]
},
{
id:"16.04",navTitle:"Monitorización",title:"Detectar el fallo tras desplegar",
objective:"Elegir señales operativas y calidad etiquetada sin confundir score con verdad.",
lead:"Una distribución de scores estable no prueba que el sistema siga acertando.",
keyIdea:"Monitoriza disponibilidad, latencia, entradas, decisiones y una muestra etiquetada para estimar rendimiento con retraso.",
sections:[["Telemetría","Registra versión, cámara, tiempos por etapa, fallos de entrada y tasas de alarma con minimización de datos.","Una caída de frames puede parecer mejora de velocidad si se miden solo procesados."],["Calidad","Muestrea casos aceptados y rechazados; si solo revisas alarmas no estimas FN.","Separa cambios de prevalencia de cambios de sensibilidad."],["Respuesta","Define umbrales de alerta, responsable, rollback y criterio para reentrenar.","Mantén comparación con modelo anterior en grupos importantes."]],
takeaways:["Score no es etiqueta.","Muestra también negativos.","Planifica rollback."],
questions:[
["Auditas 100 alarmas y todas son verdaderos positivos. ¿Qué dato falta para estimar recall?",["Etiquetas de una muestra de casos no alarmados","El FPS medio de esas 100 alarmas","El tamaño en bytes de los pesos","La precision de las alarmas, ya observada"],0,["Correcto: los FN están entre objetivos reales sin alarma y requieren revisión de negativos.","FPS mide rendimiento temporal, no defectos omitidos.","Memoria del modelo no cuenta FN.","Precision de alarmas no determina recall en no alarmados."]],
["Fallo de captura no registrado puede...",["Ocultar eventos y distorsionar métricas","Mejorar recall","Crear GT","Calibrar scores"],0,["Correcto: falta denominador.","No.","No.","No."]],
["Un plan de rollback debe existir...",["Antes del incidente","Solo después","Solo si hay transformers","Nunca"],0,["Correcto: acorta respuesta.","Tarde.","No depende.","Sí conviene."]]
],labTitle:"Muestrea negativos",labInstruction:"Cambia negativos revisados y la probabilidad ilustrativa de ver al menos un FN.",source:["Google · ML Test Score","https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/"]
},
{
id:"16.05",navTitle:"Privacidad y trazas",title:"Guardar lo necesario para depurar",
objective:"Diseñar retención y acceso a imágenes de producción.",
lead:"Los ejemplos reales son útiles para diagnosticar, pero pueden incluir personas, matrículas o datos sensibles.",
keyIdea:"Define propósito, minimiza datos, controla acceso y plazo de retención; separa métricas agregadas de imágenes identificables.",
sections:[["Datos","Una traza puede guardar hash, versión y métricas sin conservar siempre la imagen.","Si se necesita muestra visual, aplica política específica de acceso y expiración."],["Seguridad","Evita claves en logs, permisos amplios y copias de capturas fuera del circuito autorizado.","La anonimización debe comprobarse en el contenido real, incluidos metadatos."],["Operación","Borrado y trazabilidad deben cubrir copias de evaluación y anotación.","Consulta requisitos legales aplicables con responsables de privacidad antes de poner el sistema en servicio."]],
takeaways:["Minimiza retención.","Controla acceso.","Audita copias y metadatos."],
questions:[
["Para medir latencia, ¿necesitas conservar toda imagen cruda?",["No, puede bastar telemetría","Sí siempre","Solo con OCR","Solo con GPU"],0,["Correcto: minimiza.","No siempre.","No depende.","No depende."]],
["Una captura oculta rostros, pero conserva ubicación y un ID personal en metadatos. ¿Cómo se trata?",["Sigue potencialmente identificable; revisa contenido y metadatos","Es anónima por haber borrado el rostro","Se puede retener indefinidamente si mejora el modelo","El ID deja de importar si se cifra el archivo"],0,["Correcto: otros datos permiten vincular la captura con una persona.","Eliminar un rasgo visible no elimina otros identificadores.","La utilidad del modelo no define por sí sola un plazo de retención.","Cifrar protege acceso, pero no convierte datos identificables en anónimos."]],
["La retención debería...",["Tener propósito y plazo definidos","Ser infinita por defecto","Ser igual en todos los países sin revisión","Depender de FPS"],0,["Correcto: gobernanza explícita.","No.","Requisitos varían.","No."]]
],labTitle:"Presupuesto de almacenamiento",labInstruction:"Varía capturas retenidas por día y calcula tamaño bruto mensual.",source:["NIST · AI Risk Management Framework","https://www.nist.gov/itl/ai-risk-management-framework"]
},
{
id:"16.06",navTitle:"Coste y despliegue",title:"Elegir dónde ejecutar",
objective:"Comparar edge y servidor con red, latencia, coste y mantenimiento.",
lead:"Edge reduce dependencia de red para una cámara; servidor facilita consolidar recursos, pero añade transporte.",
keyIdea:"Evalúa coste total y plazo por evento, no solo FPS de inferencia aislada.",
sections:[["Edge","Capacidad local depende de potencia, temperatura, actualizaciones y seguridad física.","Si la red falla, define si se procesan eventos o se encolan."],["Servidor","Varias cámaras comparten recursos; red y cola afectan latencia y disponibilidad.","Dimensiona picos, no solo carga media."],["Decidir","Calcula hardware, energía, red, mantenimiento, privacidad y coste de falsos positivos/negativos.","Haz una prueba con tráfico real y escenarios de fallo."]],
takeaways:["Edge y servidor tienen costes diferentes.","Incluye red y colas.","Prueba fallos reales."],
questions:[
["Inferencia 50 ms + red 100 ms + cola 30 ms: mínimo secuencial...",["180 ms","50 ms","100 ms","30 ms"],0,["Correcto: suma.","Ignora red/cola.","Ignora resto.","Ignora resto."]],
["Promedio bajo garantiza soportar picos?",["No","Sí","Solo edge","Solo con int8"],0,["Correcto: dimensiona carga alta.","No.","No universal.","No."]],
["El modelo edge funciona sin red, pero debe enviar alarmas al servidor. Si cae la conexión, ¿qué falta diseñar?",["Cola local, plazo de actuación y reconciliación al volver la red","Dar cada alarma por entregada aunque falle el envío","Reducir el umbral IoU para recuperar conectividad","Borrar eventos locales en cada reintento"],0,["Correcto: define qué se actúa localmente, qué se encola y cómo se confirma entrega.","Una alarma no recibida no puede contarse como entregada.","IoU no controla disponibilidad de red.","Borrar antes de confirmar puede perder eventos."]],
],labTitle:"Calcula latencia",labInstruction:"Cambia tiempo de red en un pipeline servidor.",source:["NVIDIA · Triton metrics","https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/metrics.html"]
}
];
export const sectorSixteenLessons=buildSector(draft);
