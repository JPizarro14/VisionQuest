import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
  {
    id:"11.01",navTitle:"Cajas y coordenadas",title:"Cuatro números que deben significar lo mismo",
    objective:"Distinguir xyxy, xywh y cxcywh y convertir cajas de tiles.",
    lead:"Una caja puede expresarse por esquinas, esquina más tamaño o centro más tamaño. Confundirlas desplaza detecciones aunque el modelo sea bueno.",
    keyIdea:"En xyxy continuo, ancho=max(0,x2−x1), alto=max(0,y2−y1); especifica convención, normalización y sistema de referencia.",
    sections:[
      ["Tres formatos","xyxy=(x1,y1,x2,y2), xywh=(x,y,w,h), cxcywh=(cx,cy,w,h). Cada API puede pedir uno diferente.","Con (10,20,30,50) en xyxy, ancho=20, alto=30. No restes uno salvo que estés usando otra convención discreta e inclusiva explícita."],
      ["Local y global","Un tile con origen (100,40) y caja local (5,7,25,17) corresponde a global (105,47,125,57).","Si el tile se redimensionó, invierte esa escala antes de sumar el origen; las cajas de distintos tiles se comparan en una sola referencia."],
      ["Validación de geometría","Comprueba x2>x1, y2>y1 y límites de la imagen. Una caja válida no describe la forma exacta del objeto.","Anota si las coordenadas están en píxeles o normalizadas 0–1 y cómo se convierten."]
    ],
    takeaways:["Declara formato y convención.","Convierte cajas locales a globales.","Una caja no es una máscara."],
    questions:[
      ["xyxy=(10,20,30,50): área continua",["600","1200","20","30"],0,["Correcto: 20·30=600.","Multiplica extremos.","Solo ancho.","Solo alto."]],
      ["Tile origen (100,40), caja local (5,7,25,17): esquina global inicial",["(5,7)","(105,47)","(95,33)","(125,57)"],1,["Olvida origen.","Correcto: suma por eje.","Has restado.","Es la esquina final."]],
      ["cxcywh almacena...",["Centro y tamaño","Dos esquinas","Solo área","Clase y score"],0,["Correcto: centro x/y, ancho/alto.","Eso es xyxy.","Falta posición.","Son otras salidas."]]
    ],
    labTitle:"Convierte la caja",labInstruction:"Desplaza el origen del tile y calcula la caja global.",
    source:["TorchVision · box_convert","https://docs.pytorch.org/vision/stable/generated/torchvision.ops.box_convert.html"]
  },
  {
    id:"11.02",navTitle:"IoU entre cajas",title:"Intersección sobre unión",
    objective:"Calcular IoU y distinguir solapamiento de confianza.",
    lead:"Una caja predicha puede cubrir parte de la caja real. IoU cuantifica la geometría compartida respecto al área ocupada por al menos una.",
    keyIdea:"IoU = área(intersección) / [área(A)+área(B)−área(intersección)] para unión no vacía; vale entre 0 y 1.",
    sections:[
      ["Una cuenta","Dos cajas de área 100 con intersección 60 tienen unión 140 e IoU≈0,429, no 0,6.","Si no se tocan, IoU=0. Si coinciden exactamente y tienen área positiva, IoU=1."],
      ["Calcular intersección","Ancho solapado=max(0,min(x2A,x2B)−max(x1A,x1B)); análogo para alto. Su producto da área.","Cajas degeneradas con área cero requieren una política definida por la implementación; no dividas ciegamente por cero."],
      ["No es calidad total","IoU de una pareja no es precision del detector ni porcentaje de píxeles correctos de todo el dataset. Un umbral de 0,5 es un criterio de evaluación posible, no sinónimo universal de buena localización.","Para objetos pequeños, pocos píxeles de desplazamiento pueden cambiar mucho IoU."]
    ],
    takeaways:["La unión resta intersección contada dos veces.","IoU compara regiones, no scores.","El umbral útil depende de tarea y protocolo."],
    questions:[
      ["A=100, B=100, intersección=60. ¿IoU aproximado?",["0,60","0,43","0,30","1"],1,["Divide por área de A, no unión.","Correcto: 60/(100+100−60)=0,429.","No corresponde.","No coinciden completamente."]],
      ["Dos cajas de área positiva sin contacto tienen IoU...",["0","0,5","1","Indefinido siempre"],0,["Correcto: intersección cero, unión positiva.","No hay solapamiento.","No son iguales.","La unión sí existe."]],
      ["Una caja con IoU 0,8 implica score de confianza 0,8?",["Sí","No: confianza e IoU miden cosas distintas","Solo si hay una clase","Solo con NMS"],1,["Son variables diferentes.","Correcto: la confianza es salida del modelo; IoU requiere dos regiones.","No los iguala.","NMS los usa por separado."]]
    ],
    lab:"det-iou",labTitle:"Mueve la caja predicha",labInstruction:"Desplaza una caja respecto a la real y observa intersección, unión e IoU.",
    source:["TorchVision · box_iou","https://docs.pytorch.org/vision/stable/generated/torchvision.ops.box_iou.html"]
  },
  {
    id:"11.03",navTitle:"Matching de detecciones",title:"Cada objeto real cuenta una vez",
    objective:"Asignar predicciones a ground truth con clase, IoU y orden por score.",
    lead:"Tres cajas sobre el mismo objeto no equivalen a tres aciertos. El protocolo de evaluación necesita asignación uno a uno.",
    keyIdea:"A un umbral IoU y para una clase, la primera predicción válida puede emparejarse con un GT libre; duplicados posteriores cuentan como FP en protocolos habituales.",
    sections:[
      ["Ordenar por confianza","Las predicciones se recorren por score decreciente. Una caja de clase correcta y suficiente IoU puede emparejar un GT aún sin usar.","El detalle exacto del matching varía por benchmark, objetos ignorados y detecciones máximas; declara el protocolo."],
      ["Duplicados","Si ya emparejaste el único objeto real, otra caja sobre él no crea otro TP. Puede ser FP aunque su IoU sea alto.","NMS reduce duplicados antes de evaluar, pero no sustituye la asignación y puede eliminar objetos próximos."],
      ["Conteos","GT sin match es FN; predicción sin match válido es FP. Una caja de clase equivocada no suele contar como TP de la clase deseada.","Confianza alta no convierte una mala caja en correcta."]
    ],
    takeaways:["Matching de detección es uno a uno.","Los duplicados pueden ser FP.","Clase, IoU y score cumplen papeles distintos."],
    questions:[
      ["Un GT y dos cajas correctas que lo cubren: ¿máximo TP?",["1","2","0 siempre","Depende de píxeles RGB"],0,["Correcto: el GT se empareja una vez.","La segunda puede ser duplicado FP.","Una puede cumplir umbral.","No depende de canales."]],
      ["¿Por qué ordenar por score?",["Para construir curva precision-recall al añadir predicciones","Para cambiar GT","Para calcular resolución","Para entrenar siempre"],0,["Correcto: el orden fija cómo se acumulan TP/FP.","La verdad no cambia.","No redimensiona.","Es evaluación."]],
      ["GT sin caja válida emparejada es...",["FN","FP","TN","TP"],0,["Correcto: objeto omitido.","FP es predicción incorrecta.","TN no se cuenta como fondo exhaustivo en detección habitual.","No fue detectado."]]
    ],
    labTitle:"Asigna un objeto",labInstruction:"Aumenta duplicados sobre un GT y observa un TP máximo y FP crecientes.",
    source:["COCO · Evaluation API","https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py"]
  },
  {
    id:"11.04",navTitle:"NMS",title:"Quitar cajas repetidas",
    objective:"Simular supresión por score e IoU y reconocer riesgos para objetos cercanos.",
    lead:"Un detector suele proponer muchas cajas similares. NMS deja la más fuerte y elimina vecinas que se solapan demasiado.",
    keyIdea:"NMS ordena por score, conserva la mejor y suprime cajas de la misma clase con IoU por encima del umbral elegido; se repite con las restantes.",
    sections:[
      ["Score e IoU diferentes","Score decide qué caja considerar primero; IoU decide si otra caja parece duplicada. El umbral de score descarta candidatas débiles antes o después según pipeline.","Un umbral NMS bajo suprime agresivamente; uno alto conserva más cajas y duplicados."],
      ["Por clase","Con NMS por clase, perro y gato no compiten por la misma supresión. batched_nms admite índices de clase.","No todos los sistemas usan NMS convencional: conoce el postproceso exacto de tu modelo."],
      ["Riesgo de vecinos","Dos personas muy pegadas pueden tener cajas con IoU alto y ser objetos distintos. NMS puede borrar una verdadera detección.","Valida escenas congestionadas y compara alternativas si ese fallo importa."]
    ],
    takeaways:["Score ordena; IoU compara geometría.","El umbral NMS controla agresividad.","Objetos cercanos pueden perderse."],
    questions:[
      ["NMS suele conservar primero...",["Mayor score","Mayor área siempre","Menor IoU con GT","Primera foto"],0,["Correcto: ordena candidatos por confianza.","No es el criterio base.","GT no está en inferencia.","No es una caja."]],
      ["Umbral NMS muy bajo tiende a...",["Suprimir más cajas cercanas","Conservar todos los duplicados","Cambiar clase real","Calibrar scores"],0,["Correcto: basta menos solapamiento para borrar.","Ocurre con umbral alto.","No cambia etiquetas.","No calibra."]],
      ["Dos objetos próximos con cajas solapadas pueden...",["Provocar supresión de uno","Aumentar profundidad","Volverse un solo GT siempre","Eliminar necesidad de NMS"],0,["Correcto: es un riesgo conocido.","No es geometría 3D.","Anotaciones siguen separadas.","Hay que evaluar postproceso."]]
    ],
    lab:"det-nms",labTitle:"Suprime duplicados",labInstruction:"Cambia el umbral NMS de tres cajas con scores distintos y observa cuáles quedan.",
    source:["TorchVision · nms","https://docs.pytorch.org/vision/stable/generated/torchvision.ops.nms.html"]
  },
  {
    id:"11.05",navTitle:"Anchors y anchor-free",title:"Dos formas de proponer cajas",
    objective:"Distinguir anchors predefinidos de predicción basada en puntos sin oversimplificar modelos.",
    lead:"Para buscar objetos en muchas posiciones y tamaños, un detector necesita candidatos y reglas de asignación.",
    keyIdea:"Un método con anchors ajusta cajas de referencia; uno anchor-free puede predecir distancias desde puntos. Ambos necesitan definir positivos, negativos y pérdidas.",
    sections:[
      ["Anchors","Se sitúan cajas de tamaños y proporciones predefinidos sobre un mapa; el modelo predice ajustes y clases. La asignación a GT depende de un criterio como IoU.","Demasiados anchors aumentan candidatos y sensibilidad a escalas; un diseño inadecuado puede dificultar objetos raros."],
      ["Sin anchors","FCOS es un ejemplo que predice desde ubicaciones espaciales sin cajas de referencia explícitas.","Anchor-free no significa sin hiperparámetros, sin matching ni sin postproceso."],
      ["Comparar en tarea","Mira recall por tamaño, latencia, estrategia de asignación y pérdidas. Las etiquetas «one-stage» o «anchor-free» no garantizan rendimiento superior.","Lee la arquitectura concreta: familias modernas mezclan ideas."]
    ],
    takeaways:["Anchors son referencias geométricas.","Anchor-free todavía asigna ejemplos.","Compara por protocolo y escala."],
    questions:[
      ["¿Qué es un anchor en detección clásica?",["Caja de referencia predefinida","Etiqueta de clase","Una máscara binaria","Un score calibrado"],0,["Correcto: se ajusta para proponer una caja.","Es otro dato.","No es el anchor.","No es confianza."]],
      ["Anchor-free implica no asignar positivos a GT?",["Sí","No: sigue necesitando supervisión y asignación","Solo en vídeo","Solo si hay una clase"],1,["No desaparece el aprendizaje.","Correcto: cambia cómo se parametrizan candidatos.","No depende de vídeo.","No depende de K así."]],
      ["FCOS es un ejemplo de...",["Detector anchor-free basado en puntos","Histograma global","Método Otsu","Métrica IoU"],0,["Correcto: predice distancias desde ubicaciones.","No cuenta tonos.","No umbraliza así.","IoU evalúa regiones."]]
    ],
    labTitle:"Cubre escalas",labInstruction:"Cambia tamaño de objeto y compara con anchors de referencia de 16, 32 y 64 px.",
    source:["Tian et al. · FCOS","https://arxiv.org/abs/1904.01355"]
  },
  {
    id:"11.06",navTitle:"Pirámides y etapas",title:"Buscar objetos de varios tamaños",
    objective:"Distinguir propuestas de dos etapas y predicción densa de una etapa.",
    lead:"Un objeto de ocho píxeles y otro de ochocientos no se resuelven igual si solo miras un mapa de baja resolución.",
    keyIdea:"Una pirámide de características fusiona mapas de distinta escala; one-stage y two-stage difieren en la organización de propuestas, sin una regla universal de velocidad.",
    sections:[
      ["Pirámide","Mapas tempranos conservan resolución; profundos aportan contexto. FPN combina información para detectar a varias escalas.","No recupera información que el resize de entrada ya eliminó."],
      ["Una o dos etapas","Faster R-CNN suele generar propuestas y después clasificarlas/refinarlas. Detectores de una etapa predicen densamente sin esa fase separada.","El tiempo depende de implementación, tamaño, hardware y postproceso; la etiqueta no basta para estimar latencia."],
      ["Validación por escala","Reporta métricas para objetos pequeños, medianos y grandes según definiciones del benchmark. Inspecciona los que caen cerca del límite de resolución.","Si procesas por tiles, reconstruye coordenadas y evalúa el sistema completo."]
    ],
    takeaways:["FPN ayuda a combinar escalas.","Las etapas describen estructura, no rendimiento garantizado.","Mide errores por tamaño."],
    questions:[
      ["FPN intenta combinar...",["Resolución y contexto de niveles distintos","Train y test","IoU y FPS como una sola métrica","Canales RGB en HSV"],0,["Correcto: explota jerarquía multiescala.","Sería fuga.","Son medidas distintas.","No define FPN."]],
      ["Un detector two-stage típico...",["Genera propuestas y luego clasifica/refina","Siempre es más lento sin excepción","No usa cajas","No necesita GT"],0,["Correcto: describe dos fases.","Depende de implementación.","Sí predice cajas.","Entrena con anotaciones."]],
      ["¿Qué análisis revela un fallo en objetos pequeños?",["Métricas y ejemplos por escala","Solo AP global","Solo train loss","Solo número de capas"],0,["Correcto: desagrega.","Puede esconder el grupo.","No evalúa generalización.","No prueba desempeño."]]
    ],
    labTitle:"Cambia escala",labInstruction:"Reduce un objeto en un mapa con stride 8 y observa cuántas celdas ocupa aproximadamente.",
    source:["Lin et al. · Feature Pyramid Networks","https://arxiv.org/abs/1612.03144"]
  },
  {
    id:"11.07",navTitle:"AP y mAP",title:"Evaluar un ranking de detecciones",
    objective:"Interpretar AP, mAP y múltiples umbrales IoU sin confundirlos con accuracy.",
    lead:"Una única configuración de score no resume cómo ordena el detector sus candidatas. AP integra rendimiento al variar el corte de confianza.",
    keyIdea:"AP resume precision-recall para una clase y umbral de IoU según un protocolo; mAP promedia AP entre clases, y COCO AP promedia también umbrales 0,50:0,95.",
    sections:[
      ["Curva por clase","Ordena detecciones por score y acumula TP/FP según matching. Al añadir predicciones cambian precision y recall; AP resume esa curva.","Interpolación, máximo de detecciones y objetos ignorados son parte del protocolo. AP no es simplemente P·R ni F1."],
      ["Umbral geométrico","AP@0,50 permite cierto error de caja. AP@0,75 exige mejor localización, aunque ambos usan la misma lista de scores.","COCO AP habitual promedia diez umbrales de 0,50 a 0,95 cada 0,05, además de clases."],
      ["Cuidado al comparar","Informa benchmark, versión de anotaciones, tamaño de imagen y postproceso. Un mAP mayor en otro dataset no demuestra mejor modelo.","AP global puede ocultar mala detección de objetos pequeños."]
    ],
    takeaways:["AP integra un ranking bajo reglas de matching.","mAP promedia clases y, según protocolo, IoU.","No compares números sin protocolo."],
    questions:[
      ["¿Qué representa AP@0,50?",["AP con matching a IoU 0,50","Precision a score 0,50","Accuracy 50%","Una única caja"],0,["Correcto: el 0,50 es umbral geométrico.","Score se recorre para curva.","No es accuracy.","Se evalúan muchas detecciones."]],
      ["COCO AP usual promedia umbrales IoU...",["Solo 0,50","0,50 a 0,95 en pasos de 0,05","0 a 1 cada 0,5","No usa IoU"],1,["Eso es AP@0,50.","Correcto: diez umbrales de localización.","No corresponde.","IoU es central."]],
      ["¿Se pueden comparar mAP de datasets distintos sin más?",["Sí, siempre","No: cambian datos y protocolo","Solo si ambos usan RGB","Solo si hay NMS"],1,["La escala y anotación importan.","Correcto: especifica conjunto y reglas.","No basta.","NMS no iguala benchmarks."]]
    ],
    labTitle:"Exige más IoU",labInstruction:"Cambia el umbral de matching de cuatro detecciones con IoU conocido.",
    source:["COCO · Evaluation API","https://github.com/cocodataset/cocoapi/blob/master/PythonAPI/pycocotools/cocoeval.py"]
  },
  {
    id:"11.08",navTitle:"Detección por tiles",title:"Volver a unir la escena",
    objective:"Transformar cajas locales, gestionar costuras y deduplicar en coordenadas globales.",
    lead:"El mismo objeto puede aparecer en dos tiles solapados. Si fusionas antes de devolver coordenadas, compararás números que pertenecen a regiones diferentes.",
    keyIdea:"Invierte resize, suma origen del tile y después fusiona predicciones por clase, geometría y score; mide recall cerca de costuras.",
    sections:[
      ["Ruta de coordenadas","Caja local en entrada de modelo → deshacer letterbox/resize → coordenada de tile original → sumar (x0,y0).","Un error en un solo paso desplaza cajas y falsea IoU/NMS."],
      ["Costuras y duplicados","Solapamiento y rejilla desplazada pueden rescatar objetos cortados, pero generan predicciones repetidas.","NMS global u otra fusión se aplica después de la conversión. Un objeto truncado puede tener score engañoso."],
      ["Evaluar el coste","Compara recall por distancia a borde, FP duplicados, tiempo y memoria a varios tamaños/overlaps.","Separa imágenes originales, no tiles hermanos, entre train y test."]
    ],
    takeaways:["Corrige escala antes de sumar origen.","Fusiona en coordenadas globales.","Evalúa bordes y coste."],
    questions:[
      ["Tile con origen x=100, caja local x1=12 sin resize: x1 global",["12","88","112","100"],2,["Falta origen.","Restaste.","Correcto: 100+12.","Ignora posición local."]],
      ["¿Cuándo aplicar NMS entre tiles?",["Después de convertir a coordenadas globales","Antes, sin origen","En píxeles de cada tile por separado únicamente","Sobre GT"],0,["Correcto: cajas deben compartir marco.","No son comparables.","No elimina duplicados entre tiles.","GT no es inferencia."]],
      ["¿Qué partición evita fuga de tiles hermanos?",["Por imagen original o sujeto","Aleatoria por tile","Por fila de píxeles","Solo por score"],0,["Correcto: conserva origen unido.","Mezcla escenas.","No define muestras independientes.","Score no agrupa origen."]]
    ],
    lab:"det-tiles",labTitle:"Recompón dos cajas",labInstruction:"Mueve el origen del segundo tile y compara cajas tras pasarlas a coordenadas globales.",
    source:["TorchVision · batched_nms","https://docs.pytorch.org/vision/stable/generated/torchvision.ops.batched_nms.html"]
  }
];
export const sectorElevenLessons=buildSector(draft);
