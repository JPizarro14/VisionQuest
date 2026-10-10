import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
  {
    id:"09.01",navTitle:"Convolución aprendida",title:"El filtro deja de estar escrito a mano",
    objective:"Explicar pesos compartidos, canales y mapas de características.",
    lead:"Un detector Sobel tiene pesos fijos. Una CNN ajusta filtros con datos para extraer patrones útiles a la tarea.",
    keyIdea:"Cada filtro combina un vecindario de todos los canales de entrada y se reutiliza espacialmente para producir un mapa de salida.",
    sections:[
      ["Peso compartido","Un kernel de 3×3 con C entradas contiene 9C pesos por filtro, más sesgo opcional. Recorre muchas posiciones con esos mismos pesos.","Esto reduce parámetros frente a una capa densa de tamaño comparable y ofrece una respuesta que cambia de posición con el patrón, salvo efectos de borde y stride."],
      ["Múltiples filtros","Con C_in canales y C_out filtros, la forma habitual del peso PyTorch es (C_out,C_in,kH,kW) cuando groups=1.","Cada canal de salida mezcla canales de entrada; no es simplemente aplicar un filtro independiente a R, G y B."],
      ["Aprendizaje","El gradiente de cada uso espacial contribuye al mismo conjunto de pesos compartidos.","Una activación fuerte de un filtro no asigna por sí sola una etiqueta semántica estable a cada neurona."]
    ],
    takeaways:["Los pesos del filtro se aprenden.","Un filtro estándar combina todos los canales de entrada.","Compartir pesos reduce parámetros."],
    questions:[
      ["Filtro 3×3, 3 canales de entrada, un filtro sin sesgo: ¿pesos?",["9","27","3","81"],1,["Falta multiplicar canales.","Correcto: 3·3·3=27.","Solo cuenta canales.","No corresponde."]],
      ["¿Qué significa compartir pesos?",["Usar el mismo filtro en posiciones distintas","Copiar etiquetas","Usar siempre una sola imagen","Congelar el entrenamiento"],0,["Correcto: los mismos parámetros recorren la rejilla.","No cambia ground truth.","Puede haber lotes.","Los pesos pueden aprenderse."]],
      ["Un filtro estándar con RGB normalmente...",["Solo mira R","Combina los tres canales","Siempre convierte a HSV","No tiene gradiente"],1,["Ignora dos canales.","Correcto: el kernel tiene dimensión de entrada 3.","No es conversión obligatoria.","Sus pesos son diferenciables."]]
    ],
    labTitle:"Cuenta los pesos",labInstruction:"Cambia el número de filtros de salida de una convolución 3×3 con 3 entradas.",
    source:["PyTorch · Conv2d","https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html"]
  },
  {
    id:"09.02",navTitle:"Stride y padding",title:"Qué tamaño sale de una convolución",
    objective:"Calcular dimensiones con kernel, padding y stride.",
    lead:"Una capa no solo aprende patrones; también decide cuántas posiciones de salida existen.",
    keyIdea:"Sin dilatación, por eje la salida es floor((entrada+2·padding−kernel)/stride)+1, para parámetros válidos.",
    sections:[
      ["Ventana válida","Con ancho 8, kernel 3, padding 0 y stride 1, existen 6 posiciones de salida. Si añades padding 1, vuelven a ser 8.","El padding necesita política de borde; ceros, reflexión u otras opciones pueden afectar al contorno."],
      ["Stride salta","Con entrada 8, kernel 3, padding 1 y stride 2, salida floor((8+2−3)/2)+1=4.","Reducir resolución ahorra cómputo pero puede perder detalles pequeños. No confundir stride del filtro con el stride de tiles aunque ambos sean saltos."],
      ["Dilatación","La dilatación separa puntos activos de un kernel; su tamaño efectivo por eje es d(k−1)+1.","La fórmula completa reemplaza k por ese tamaño efectivo. Usar padding='same' depende de restricciones de implementación."]
    ],
    takeaways:["Shape depende de kernel, padding, stride y dilatación.","Stride mayor reduce posiciones.","El borde exige una convención."],
    questions:[
      ["Entrada 8, k=3, p=0, s=1. ¿Salida por eje?",["5","6","8","10"],1,["Falta una posición.","Correcto: (8−3)+1=6.","Necesitaría padding.","No corresponde."]],
      ["Entrada 8, k=3, p=1, s=2. ¿Salida?",["4","8","5","3"],0,["Correcto: floor(7/2)+1=4.","Ignora stride.","Redondea hacia arriba incorrectamente.","Falta una posición."]],
      ["Dilatación 2 con k=3: tamaño efectivo",["3","5","6","9"],1,["Ignora huecos.","Correcto: 2·(3−1)+1=5.","Multiplica sin contar extremos.","Es área, no ancho."]]
    ],
    labTitle:"Calcula la shape",labInstruction:"Cambia stride con ancho 8, kernel 3 y padding 1.",
    source:["PyTorch · Conv2d","https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html"]
  },
  {
    id:"09.03",navTitle:"Campo receptivo",title:"Qué parte de la imagen puede influir",
    objective:"Distinguir campo receptivo teórico de información efectiva.",
    lead:"Una neurona profunda puede depender de una región amplia, aunque no todos sus píxeles influyan igual.",
    keyIdea:"Con convoluciones 3×3 de stride 1 sin dilatación, cada capa añade dos píxeles al ancho del campo receptivo teórico.",
    sections:[
      ["Una cadena simple","Una capa 3×3 ve 3×3; dos capas, 5×5; tres, 7×7. La cuenta supone una cadena sin saltos ni rutas que cambien geometría.","Con stride y dilatación, hay que seguir también el salto acumulado entre posiciones de capas."],
      ["Teórico y efectivo","Estar dentro del campo teórico significa que existe una ruta de dependencia, no que todos los píxeles tengan igual influencia.","La distribución efectiva depende de pesos y entrenamiento; una región enorme no garantiza captar el objeto completo."],
      ["Escala del objeto","Objetos muy pequeños pueden desaparecer tras reducir resolución; otros enormes superan el contexto disponible.","Diseña entrada y pirámides según tamaños reales, y comprueba errores por escala."]
    ],
    takeaways:["Campo teórico indica alcance posible.","Tres capas 3×3 de stride 1 alcanzan 7×7.","La influencia efectiva puede ser menor."],
    questions:[
      ["Dos capas 3×3, stride 1: campo teórico interior",["3×3","5×5","6×6","9×9"],1,["Solo una capa.","Correcto: 3+2=5.","No corresponde.","No se multiplican anchos así."]],
      ["Dentro del campo teórico significa...",["Influencia idéntica de cada píxel","Existe ruta posible de influencia","Clase correcta asegurada","Profundidad 3D"],1,["Los pesos pueden dar influencia distinta.","Correcto: es alcance estructural.","No garantiza predicción.","Es estructura 2D."]],
      ["¿Qué riesgo tiene downsampling muy temprano para defectos minúsculos?",["Perder señal espacial","Aumentar información","Calibrar mejor siempre","Crear etiquetas"],0,["Correcto: varias muestras se agregan o saltan.","No añade mediciones.","No es universal.","No afecta ground truth de ese modo."]]
    ],
    labTitle:"Amplía el campo",labInstruction:"Cambia capas 3×3 de stride 1 y calcula el campo receptivo teórico.",
    source:["PyTorch · Conv2d","https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html"]
  },
  {
    id:"09.04",navTitle:"Pooling y dilatación",title:"Resumir sin perder el objetivo",
    objective:"Distinguir max/average pooling y dilatación del kernel.",
    lead:"Una red puede reducir una región a un valor o ampliar el alcance de un filtro sin multiplicar su número de pesos.",
    keyIdea:"Max pooling toma un máximo local; average pooling una media. Una convolución dilatada amplía el campo del kernel dejando huecos.",
    sections:[
      ["Agregación","En una ventana [1,2;3,9], max pooling produce 9 y average pooling 3,75.","Pooling reduce sensibilidad a pequeñas traslaciones, pero puede borrar localización útil en segmentación."],
      ["Dilatación no es stride","Stride cambia el salto entre salidas; dilatación cambia el espaciado de posiciones muestreadas dentro del kernel.","Un kernel 3 con dilatación 2 cubre ancho efectivo 5, pero sigue teniendo tres posiciones activas por eje."],
      ["Elegir escala","Clasificación global tolera cierta pérdida espacial; máscaras finas necesitan recuperar resolución y detalles.","Compara errores de objetos pequeños antes de acumular reducciones."]
    ],
    takeaways:["Max y media responden distinto.","Dilatación amplía alcance sin añadir pesos por filtro.","Reducir resolución puede dañar localización."],
    questions:[
      ["Max de [1,2,3,9] es...",["3,75","9","15","1"],1,["Eso es media.","Correcto: el mayor.","Eso es suma.","Es mínimo."]],
      ["Dilatación 2 con kernel 3 significa...",["Tres pesos espaciados en ancho efectivo 5","Cinco pesos seguidos","Stride 2 obligatorio","Cinco canales"],0,["Correcto: posiciones separadas.","No agrega pesos.","Son parámetros independientes.","No cambia canales."]],
      ["Pooling intenso puede perjudicar...",["Máscaras con detalle fino","Solo el nombre del archivo","La existencia de batch","La lectura del test"],0,["Correcto: pierde precisión espacial.","No afecta nombre.","Los lotes siguen existiendo.","No define test."]]
    ],
    labTitle:"Máximo o promedio",labInstruction:"Cambia el valor de un píxel en una ventana 2×2 y compara max con promedio.",
    source:["PyTorch · Pooling layers","https://docs.pytorch.org/docs/stable/nn.html#pooling-layers"]
  },
  {
    id:"09.05",navTitle:"Conexiones residuales",title:"Aprender un cambio en vez de todo",
    objective:"Leer y=x+F(x) y comprender el propósito de ResNet.",
    lead:"Una ruta directa lleva la señal de entrada alrededor de un bloque; el bloque puede aprender una corrección.",
    keyIdea:"En una suma residual, x y F(x) deben tener shapes compatibles; la ruta de identidad facilita propagación, pero no garantiza éxito.",
    sections:[
      ["La suma","Si x=3 y F(x)=−0,5, la salida es 2,5. Una red puede representar identidad si F(x) se aproxima a cero.","Cuando cambian canales o resolución, se adapta la ruta de atajo mediante una proyección u otra estrategia."],
      ["Gradiente","La derivada de x+F(x) incluye una contribución directa de identidad además de la del bloque.","Eso ayuda a optimizar redes profundas, sin eliminar la necesidad de buen entrenamiento."],
      ["ResNet y transferencia","Las familias ResNet combinan bloques residuales y suelen servir como backbones de clasificación, detección o segmentación.","La elección depende de resolución, coste y dominio; el nombre de arquitectura no sustituye evaluación."]
    ],
    takeaways:["Suma residual = entrada + corrección.","Shapes deben permitir sumar.","La ruta directa ayuda al flujo de señal."],
    questions:[
      ["x=3, F(x)=−0,5: salida residual",["−1,5","2,5","3,5","0"],1,["No es la suma.","Correcto: 3−0,5.","Signo erróneo.","No corresponde."]],
      ["¿Qué exige x+F(x)?",["Shapes compatibles","Un mismo archivo JPEG","IoU alto","Dos etiquetas"],0,["Correcto: suma elemento a elemento.","Formato de archivo no decide.","Es métrica.","No son etiquetas."]],
      ["Si F(x)=0, el bloque devuelve...",["x","0","−x","Una clase aleatoria"],0,["Correcto: ruta de identidad.","Ignora atajo.","No hay negación.","Es determinista."]]
    ],
    labTitle:"Suma el atajo",labInstruction:"Cambia la corrección F(x) para x=3.",
    source:["He et al. · Deep Residual Learning","https://arxiv.org/abs/1512.03385"]
  },
  {
    id:"09.06",navTitle:"Transfer learning",title:"Reutilizar sin asumir que todo encaja",
    objective:"Distinguir congelar backbone, entrenar cabeza y fine-tuning.",
    lead:"Un modelo preentrenado puede ofrecer features útiles con pocos datos, pero otra cámara o dominio exige comprobarlas.",
    keyIdea:"Congelar parámetros impide actualizarlos; fine-tuning permite ajustar algunos o todos con una tasa y protocolo adecuados.",
    sections:[
      ["Primera referencia","Sustituye la cabeza final por una adaptada a tus clases y empieza por entrenarla con backbone congelado si conviene.","Usa exactamente preprocesado, canales y tamaño esperados por los pesos preentrenados o documenta cambios."],
      ["Descongelar","Si el dominio difiere, puedes ajustar parte del backbone. Tasas demasiado altas pueden deteriorar representaciones útiles.","BatchNorm y modo de entrenamiento requieren atención: congelar requires_grad no equivale a congelar todas las estadísticas."],
      ["Evaluación","Compara contra entrenamiento desde cero bajo presupuesto justo. Una mejora en train no demuestra transferencia exitosa.","Mira clases y subgrupos donde las features del dominio original podrían fallar."]
    ],
    takeaways:["Cabeza y backbone se pueden entrenar por separado.","Preprocesado de pesos preentrenados importa.","Congelar pesos no congela todo comportamiento de capas."],
    questions:[
      ["Congelar backbone normalmente significa...",["No actualizar sus pesos","Borrar sus pesos","No usar sus features","Entrenar test"],0,["Correcto: aún produce activaciones.","Perderías conocimiento.","Sí se usan.","Test se reserva."]],
      ["¿Qué revisas al reutilizar pesos?",["Transformaciones de entrada esperadas","Solo el nombre de archivo","IoU en train únicamente","Que siempre sea RGB"],0,["Correcto: rango, orden y normalización importan.","No determina tensores.","No basta para validar.","Algunos modelos usan otros canales."]],
      ["Fine-tuning puede ser útil cuando...",["El dominio difiere y hay datos válidos para adaptar","Test tiene etiquetas ocultas","La entrada está corrupta","No existe conjunto de validación"],0,["Correcto: ajustas representaciones con control.","No debes usar test.","Primero arregla datos.","Necesitas evaluar."]]
    ],
    labTitle:"Congela capas",labInstruction:"Cambia cuántos bloques de un modelo de juguete se entrenan.",
    source:["PyTorch · Transfer Learning","https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"]
  },
  {
    id:"09.07",navTitle:"CNN eficientes",title:"Reducir coste de los filtros",
    objective:"Comparar convolución estándar y depthwise separable en parámetros.",
    lead:"Un filtro estándar mezcla espacio y canales a la vez. Separar esos pasos puede ahorrar muchos pesos y operaciones.",
    keyIdea:"Para kernel k×k, C entradas y O salidas: estándar tiene k²CO pesos; depthwise + pointwise tiene k²C + CO, sin sesgos.",
    sections:[
      ["Dos operaciones","Depthwise usa un filtro espacial por canal; pointwise 1×1 mezcla canales para producir salidas.","Con k=3,C=16,O=32, estándar tiene 4608 pesos; separable 144+512=656."],
      ["Menos no siempre más rápido","Coste de memoria, implementación, tamaño de lote y hardware determinan latencia real. Cuenta FLOPs y mide tiempo en el dispositivo objetivo.","Una red pequeña puede perder señales finas o precisión; compara con el mismo split."],
      ["Opciones de diseño","Ancho, resolución y profundidad cambian coste y calidad. MobileNet es un ejemplo de diseño basado en separables.","No reduzcas capacidad sin mirar errores por tamaño de objeto y subgrupo."]
    ],
    takeaways:["Separar espacio y mezcla de canales reduce parámetros.","Latencia se mide en hardware objetivo.","Precisión y coste se evalúan juntos."],
    questions:[
      ["k=3,C=16,O=32: pesos estándar sin sesgo",["656","4608","144","512"],1,["Es la alternativa separable.","Correcto: 9·16·32.","Solo depthwise.","Solo pointwise."]],
      ["¿Qué hace un 1×1 pointwise tras depthwise?",["Mezcla canales","Amplía píxeles obligatoriamente","Calcula IoU","Congela pesos"],0,["Correcto: combina canales en cada posición.","No necesariamente.","Es métrica.","No implica congelar."]],
      ["Menos parámetros garantiza menos latencia?",["No, depende de hardware e implementación","Sí, siempre","Solo en JPEG","Solo con un batch"],0,["Correcto: hay que medir.","Memoria y kernels importan.","Archivo no fija cómputo.","Batch afecta, pero no garantiza."]]
    ],
    labTitle:"Cuenta el ahorro",labInstruction:"Cambia canales de salida y compara parámetros estándar y separables con C=16, k=3.",
    source:["Howard et al. · MobileNets","https://arxiv.org/abs/1704.04861"]
  },
  {
    id:"09.08",navTitle:"Elegir arquitectura",title:"Medir escala, coste y errores",
    objective:"Elegir backbone atendiendo a resolución, latencia y casos difíciles.",
    lead:"Una arquitectura famosa no sabe si tu señal mide dos píxeles o si el dispositivo debe responder en 20 ms.",
    keyIdea:"La elección se hace con presupuesto y evaluación por escalas y condiciones; un score global puede esconder fallos sistemáticos.",
    sections:[
      ["Resolución","Reducir la entrada 2× por eje deja un cuarto de posiciones espaciales y puede borrar objetos pequeños.","El ahorro aproximado de activaciones no equivale exactamente al ahorro total de tiempo."],
      ["Backbone y cabeza","Una misma base puede alimentar clasificación, detección o segmentación con cabezas diferentes.","Las features profundas tienen contexto pero menor resolución; fusiones multiescala intentan combinar ambas propiedades."],
      ["Medida real","Anota latencia p50/p95, memoria, tamaño y métricas por tamaño de objeto en el hardware final.","Valida el pipeline completo, incluyendo resize, tiling y postproceso."]
    ],
    takeaways:["El resize cambia señal y coste.","Distintas tareas requieren salidas distintas.","Evalúa pipeline completo en dispositivo objetivo."],
    questions:[
      ["Reducir alto y ancho a la mitad deja...",["La mitad de posiciones","Un cuarto de posiciones","Mismo número","Doble"],1,["Multiplicas dos mitades.","Correcto: 1/2·1/2=1/4.","Cambia resolución.","No aumenta."]],
      ["¿Qué puede ocultar accuracy global?",["Fallos en objetos pequeños","La forma de la entrada siempre","El número de canales exacto","La existencia del optimizador"],0,["Correcto: analiza por escala.","No se deduce de accuracy.","No informa shape.","No es su función."]],
      ["Para elegir modelo en móvil, mide...",["Latencia y memoria en el dispositivo real","Solo FLOPs teóricos","Solo train loss","Solo nombre de arquitectura"],0,["Correcto: el entorno determina coste.","No captura todas las operaciones.","No evalúa uso.","No es evidencia."]]
    ],
    labTitle:"Ajusta resolución",labInstruction:"Reduce ambos ejes y calcula cuántas posiciones espaciales quedan.",
    source:["TorchVision · Models and weights","https://docs.pytorch.org/vision/stable/models.html"]
  }
];
export const sectorNineLessons=buildSector(draft);
