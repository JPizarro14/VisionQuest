import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
  {
    id:"09.01",navTitle:"Convolución aprendida",title:"El filtro deja de estar escrito a mano",
    objective:"Explicar pesos compartidos, canales y mapas de características.",
    lead:"Un detector Sobel tiene pesos fijos. Una CNN ajusta filtros con datos para extraer patrones útiles a la tarea.",
    keyIdea:"Cada filtro combina un vecindario de todos los canales de entrada y se reutiliza espacialmente para producir un mapa de salida.",
    sections:[
      ["Peso compartido","Un filtro de 3×3 conectado a C canales tiene 9C pesos, más un sesgo opcional. Se usan los mismos 9C pesos tanto en la primera ventana de la imagen como en la última.","En una capa densa cada posición de salida tendría sus propias conexiones, incluso con entradas lejanas. En la convolución no se necesita otro conjunto de pesos por desplazar el filtro a una posición nueva."],
      ["Múltiples filtros","En Conv2d de PyTorch sin grupos, el tensor de pesos tiene ejes (canales de salida, canales de entrada, alto del filtro, ancho del filtro). Cada filtro de salida tiene una matriz espacial por canal de entrada.","Para producir un valor de salida en una imagen RGB, se suman los productos de esas matrices con los parches de rojo, verde y azul. No se obtienen tres salidas independientes por el hecho de tener tres canales de entrada."],
      ["Aprendizaje","Un peso compartido participa en la respuesta de muchas posiciones. Al retropropagar, las contribuciones de todas ellas se suman en el gradiente de ese único peso; no se aprende una copia por posición.","Una activación alta indica que ese filtro respondió a un patrón local. El mismo patrón puede aparecer en objetos diferentes; la clase depende de cómo se combinen esa respuesta y las demás en capas posteriores."]
    ],
    takeaways:["Los pesos del filtro se aprenden.","Un filtro estándar combina todos los canales de entrada.","Compartir pesos reduce parámetros."],
    questions:[
      ["Una convolución sin grupos usa un único filtro de 3×3 sobre tres canales de entrada. Sin contar sesgo, ¿cuántos pesos aprende?",["9","27","3","81"],1,["Nueve es el número de pesos por canal de entrada.","Correcto: 3·3 posiciones por cada uno de los tres canales dan 27 pesos.","Solo has contado los canales, no las posiciones del filtro.","Esa cifra correspondería a tres filtros de salida, no a uno."]],
      ["En una convolución, ¿qué significa que los pesos se comparten espacialmente?",["El mismo filtro se aplica en distintas posiciones","Todos los filtros de salida tienen pesos idénticos","El filtro usa el mismo valor en todas sus celdas","Los pesos permanecen fijos durante el entrenamiento"],0,["Correcto: mover la ventana no crea un nuevo conjunto de parámetros.","Distintos filtros de salida pueden aprender patrones distintos.","Compartir entre ventanas no obliga a igualar las celdas de una ventana.","Un peso compartido puede actualizarse con los gradientes de muchos usos."]],
      ["¿Cómo calcula un filtro de una convolución estándar, sin grupos, un valor de salida sobre una imagen de tres canales de color?",["Elige el canal de mayor intensidad","Suma contribuciones ponderadas de los tres canales del parche","Promedia antes los canales con pesos fijos","Devuelve tres valores separados, uno por canal"],1,["El filtro no selecciona un único canal por su intensidad.","Correcto: sus pesos abarcan tanto las posiciones del parche como los tres canales.","No exige convertir primero a gris; las ponderaciones se aprenden.","Un filtro de salida produce un solo valor en esa posición."]]
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
      ["Dilatación","Un filtro con k posiciones y dilatación d tiene k−1 intervalos de d píxeles entre la primera y la última. Su ancho efectivo es K = d(k−1)+1, aunque solo se muestrean k posiciones.","Con longitud de entrada L, relleno p a cada lado y paso s, salen ⌊(L + 2p − K)/s⌋ + 1 posiciones, siempre que el filtro quepa. La parte entera cuenta solo ventanas completas."]
    ],
    takeaways:["Shape depende de kernel, padding, stride y dilatación.","Stride mayor reduce posiciones.","El borde exige una convención."],
    questions:[
      ["Sobre una fila de ocho píxeles deslizas una ventana de tres píxeles contiguos, de uno en uno y sin relleno. ¿Cuántas posiciones completas caben?",["5","6","8","10"],1,["Hay cinco desplazamientos después de la primera posición.","Correcto: la ventana puede empezar en los índices 0 a 5, ambos incluidos.","Ocho posiciones requerirían permitir extensión fuera de la fila.","Sin relleno no se pueden crear posiciones adicionales en los bordes."]],
      ["Una convolución recorre un eje de longitud 8 con relleno de un píxel por lado, filtro de 3 contiguos y paso 2. ¿Cuántos valores produce en ese eje?",["4","8","5","3"],0,["Correcto: en el eje rellenado de longitud 10, la ventana cabe empezando en 0, 2, 4 y 6.","Ocho sería el resultado con paso 1.","Una quinta ventana empezaría en 8 y rebasaría el eje rellenado.","Tres son los saltos entre las cuatro posiciones válidas."]],
      ["Un filtro toma tres muestras en una fila con dilatación 2: sus índices avanzan de dos en dos. ¿Qué ancho abarca, incluidos los extremos?",["3 píxeles","5 píxeles","6 píxeles","4 píxeles"],1,["Tres es el número de posiciones activas, no su extensión.","Correcto: con muestras en 0, 2 y 4 se cubre desde 0 hasta 4 inclusive.","Hay dos intervalos de longitud dos, no tres.","Cuatro es la distancia entre los centros extremos; falta contar la primera posición."]]
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
      ["Una cadena simple","En el interior, una salida de la segunda capa usa tres posiciones contiguas de la primera por eje. Cada una abarca tres píxeles de entrada; sus ventanas se solapan y su unión mide 3+2 = 5 píxeles por eje, no 9.","Esto supone filtros 3×3, paso 1 y dilatación 1. En otras cadenas hay que seguir el ancho efectivo del filtro y la separación acumulada entre posiciones tras cada convolución o reducción."],
      ["Teórico y efectivo","Estar dentro del campo teórico significa que existe una ruta de dependencia, no que todos los píxeles tengan igual influencia.","La distribución efectiva depende de pesos y entrenamiento; una región enorme no garantiza captar el objeto completo."],
      ["Escala del objeto","Al reducir la resolución se puede saltar o diluir un objeto de pocos píxeles antes de que llegue a producir una respuesta distinguible. En el extremo contrario, una salida con poco contexto puede ver fragmentos de un objeto grande sin reconocer su forma completa.","Ajusta la resolución de entrada y los niveles de la red a los tamaños reales, y comprueba por separado omisiones y errores de localización en cada escala."]
    ],
    takeaways:["Campo teórico indica alcance posible.","Tres capas 3×3 de stride 1 alcanzan 7×7.","La influencia efectiva puede ser menor."],
    questions:[
      ["Encadenas dos convoluciones de 3×3, ambas de paso 1 y sin dilatación, y ninguna otra operación espacial. ¿Qué campo receptivo teórico tiene una salida interior?",["3×3","5×5","6×6","9×9"],1,["Ese sería el campo de la primera capa.","Correcto: por eje, la segunda capa extiende el alcance de tres a cinco píxeles.","Sumar ambos anchos sin descontar el solapamiento sobrecuenta posiciones.","Las ventanas se solapan; sus anchos no se multiplican."]],
      ["¿Qué afirma el campo receptivo teórico sobre un píxel incluido en él?",["Su influencia es igual a la de los demás","Existe una ruta por la que puede afectar a la salida","Su activación siempre cambia la clase predicha","Su gradiente debe ser distinto de cero en toda imagen"],1,["Los pesos y activaciones pueden dar a cada ruta una influencia distinta.","Correcto: la arquitectura permite la dependencia, pero no garantiza su magnitud.","Un cambio local puede no alterar la decisión.","Una ruta posible puede tener peso o derivada local nulos."]],
      ["Un defecto ocupa dos píxeles en la entrada de una red. ¿Qué riesgo supone reducir mucho la resolución en la primera capa?",["Diluir o saltarse la señal antes de representarla","Reducir únicamente el número de canales","Conservar necesariamente el defecto si el campo teórico es grande","Poder reconstruir siempre sus bordes interpolando la salida"],0,["Correcto: al agrupar o saltar posiciones se puede perder un detalle tan pequeño.","La operación descrita reduce posiciones espaciales.","Un campo amplio no recupera una señal descartada.","Interpolar añade muestras, no información perdida."]]
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
      ["Agregación","Para una ventana con filas (1, 2) y (3, 9), el máximo es 9 y la media es (1+2+3+9)/4 = 3,75.","Si solo se conserva el valor agregado, no se sabe en qué celda estaba el 9: permutar los valores conserva tanto el máximo como la media. Esa pérdida de localización importa al predecir una máscara."],
      ["Dilatación no es stride","Stride cambia el salto entre salidas; dilatación cambia el espaciado de posiciones muestreadas dentro del kernel.","Un kernel 3 con dilatación 2 cubre ancho efectivo 5, pero sigue teniendo tres posiciones activas por eje."],
      ["Elegir escala","Para clasificar una imagen puede bastar saber que un patrón está presente aunque se pierda su posición exacta. Para segmentar hay que asignar una clase a cada píxel; resumir varias posiciones en una puede borrar un borde o una estructura estrecha.","Volver a ampliar el mapa no recupera por sí solo el detalle descartado. Comprueba los contornos y los objetos pequeños al elegir cuántas reducciones aplicar."]
    ],
    takeaways:["Max y media responden distinto.","Dilatación amplía alcance sin añadir pesos por filtro.","Reducir resolución puede dañar localización."],
    questions:[
      ["Una capa de agrupación por máximo (max pooling) recibe una ventana 2×2 con valores 1, 2, 3 y 9. ¿Qué valor devuelve?",["3,75","9","15","1"],1,["3,75 es la media de los cuatro valores.","Correcto: conserva el mayor valor de la ventana, 9.","15 es la suma, antes de cualquier promedio.","1 es el mínimo, no el máximo."]],
      ["Un filtro unidimensional tiene tres pesos y dilatación 2. Si el primer peso lee la posición x, ¿dónde leen los otros dos en esa misma ventana?",["x+2 y x+4","x+1 y x+2","x+2 y x+3","x+3 y x+6"],0,["Correcto: la separación interna es dos; no depende del paso entre ventanas.","Eso describe un filtro sin dilatación.","La dilatación fija el mismo intervalo entre muestras sucesivas.","Esos saltos corresponderían a dilatación 3."]],
      ["Un segmentador debe dibujar contornos de un píxel. ¿Qué efecto puede tener aplicar repetidamente agrupación espacial (pooling) con paso 2?",["Perder la posición fina de los contornos","Conservar cada borde por tomar el máximo","Recuperar toda la geometría con solo ampliar al tamaño original","Reducir canales sin cambiar la rejilla espacial"],0,["Correcto: resumir varias posiciones en una hace más difícil distinguir bordes próximos.","Conservar un valor alto no conserva necesariamente dónde estaba.","Ampliar un mapa grueso no reconstruye por sí solo la información descartada.","El paso 2 reduce el muestreo espacial, no solo el tamaño del tensor en canales."]]
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
      ["La suma","Con atajo de identidad, el bloque devuelve x + F(x). Si F(x)=0, devuelve exactamente x; con x=3 y F(x)=−0,5 devuelve 2,5.","Si las formas difieren, el atajo puede proyectar x con una convolución de 1×1 y el paso necesario para igualar canales y resolución. En ese caso, anular F deja la proyección de x, no necesariamente x."],
      ["Gradiente","En el caso escalar, la derivada de x + F(x) es 1 + F′(x); para vectores, la identidad se suma a la matriz de derivadas de F. Hay una contribución que no debe atravesar todas las operaciones de la rama F.","Ese camino directo puede facilitar el ajuste, pero las contribuciones también pueden cancelarse o crecer demasiado. Siguen importando los datos, la inicialización y la tasa de aprendizaje."],
      ["ResNet y transferencia","Una ResNet puede actuar como extractor común de características. Se le añade una cabeza para predecir clases, otra para localizar cajas o un decodificador para producir máscaras.","Antes de elegirla, comprueba que la resolución de sus mapas conserve los detalles que necesita la tarea, mide los errores en tu dominio y contrasta latencia y memoria con el presupuesto disponible."]
    ],
    takeaways:["Suma residual = entrada + corrección.","Shapes deben permitir sumar.","La ruta directa ayuda al flujo de señal."],
    questions:[
      ["Un bloque residual devuelve y = x + F(x). Si x=3 y la rama F devuelve −0,5, ¿cuánto vale y?",["−1,5","2,5","3,5","−0,5"],1,["Multiplicar las ramas da −1,5; aquí se suman.","Correcto: 3 + (−0,5) = 2,5.","Has cambiado el signo de la corrección.","Ese es solo el resultado de F; falta el atajo."]],
      ["Una rama residual se suma a su atajo elemento a elemento, sin difusión de dimensiones. ¿Qué condición necesitan sus mapas?",["Coincidir en dimensiones espaciales y canales","Tener solo el mismo número total de valores","Usar exactamente los mismos pesos","Tener valores idénticos antes de la suma"],0,["Correcto: se suma cada posición y canal con su correspondiente; si hace falta se proyecta el atajo.","Igual número de valores no garantiza que coincidan los ejes.","Las ramas pueden tener parámetros distintos o ninguna parametrización.","Se suman señales compatibles, no necesariamente iguales."]],
      ["Un bloque tiene un atajo de identidad y devuelve x + F(x), sin activación posterior. Si la rama residual da cero, ¿qué sale?",["La entrada x sin cambios","Un tensor de ceros","El opuesto de x","El doble de x"],0,["Correcto: el atajo conserva x y la corrección es nula.","Solo se anuló la rama F, no el atajo.","El bloque no niega la entrada.","Para duplicar x se necesitaría F(x)=x."]]
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
      ["Primera referencia","Conserva el extractor preentrenado, congela sus pesos y sustituye la capa de salida por una cabeza que prediga las clases de tu tarea. Entrena solo esa cabeza y mide su rendimiento en validación como primera referencia.","Respeta el tamaño, el orden de canales, el rango y la normalización esperados por los pesos. De lo contrario, un fallo del preprocesado puede parecer un fallo de la transferencia."],
      ["Descongelar","Si la cabeza por sí sola se queda corta en validación y dispones de datos representativos, prueba a descongelar los últimos bloques con una tasa moderada. Una tasa excesiva puede destruir características preentrenadas útiles.","En PyTorch, requires_grad=False bloquea gradientes de parámetros, pero las medias y varianzas acumuladas de BatchNorm son estado, no parámetros aprendidos por gradiente. En modo entrenamiento pueden cambiar; usa modo evaluación en esas capas si quieres conservarlas."],
      ["Evaluación","Entrena una referencia desde cero y otra con pesos transferidos usando la misma tarea, grupos, métrica y un presupuesto de ajuste comparable. Selecciona en validación y contrasta los modelos fijados en la prueba reservada.","Una pérdida de entrenamiento menor no garantiza menos errores en el nuevo dominio. Desglosa los resultados por clase y condición de captura para ver dónde ayuda o perjudica la transferencia."]
    ],
    takeaways:["Cabeza y backbone se pueden entrenar por separado.","Preprocesado de pesos preentrenados importa.","Congelar pesos no congela todo comportamiento de capas."],
    questions:[
      ["Entrenas una cabeza nueva con el extractor de características preentrenado congelado. ¿Qué significa congelar sus parámetros?",["Usar el extractor sin actualizar sus pesos","Omitir el extractor en la pasada hacia delante","Reiniciar el extractor con pesos aleatorios en cada lote","Impedir que la cabeza aprenda pesos nuevos"],0,["Correcto: la cabeza aprende a partir de las activaciones que el extractor sigue produciendo.","Sin la pasada del extractor no se obtendrían sus características.","Reiniciarlo destruiría la representación preentrenada.","La restricción se aplica al extractor, no a la cabeza nueva."]],
      ["Vas a usar pesos preentrenados con imágenes de otra cámara. ¿Qué contrato de entrada debes revisar antes de interpretar el rendimiento?",["Orden de canales, rango, tamaño y normalización esperados","Solo que la imagen se pueda mostrar en pantalla","Solo que coincida la extensión del archivo","Solo que se conserve el número de píxeles"],0,["Correcto: los filtros aprendidos reciben tensores preparados según esas convenciones.","Una imagen visible puede llegar al modelo con canales invertidos.","La extensión no fija el rango del tensor ni su normalización.","Dos tensores de igual tamaño pueden representar colores y escalas distintos."]],
      ["¿Cuándo tiene sentido probar un ajuste fino de parte del extractor, en lugar de entrenar solo la cabeza?",["Las características congeladas se quedan cortas y hay datos del nuevo dominio para adaptar y validar","Se necesita que el extractor permanezca idéntico","Todavía se desconoce el orden de canales que espera el modelo","Se quiere elegir el mejor peso mirando la prueba final"],0,["Correcto: descongelar permite adaptar la representación y medir si beneficia a casos nuevos.","El ajuste fino modifica los pesos que se descongelan.","Primero descarta un error en el preprocesado.","La prueba debe quedar fuera de la selección."]]
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
      ["Dos operaciones","Sin sesgos, la convolución estándar tiene 3·3·16 pesos por filtro y 32 filtros: 4608 pesos. En la variante separable se aplica primero un filtro espacial por canal (depthwise): 3·3·16 = 144 pesos.","Una convolución de 1×1 (pointwise) mezcla los 16 canales en 32 salidas: 16·32 = 512 pesos. La separable suma 144 + 512 = 656; no multiplica ambos recuentos."],
      ["Menos no siempre más rápido","Un recuento de operaciones no mide las transferencias de memoria, el paralelismo ni la calidad de la implementación. Por ejemplo, dos operaciones ligeras que escriben y releen un mapa intermedio pueden tardar más que una operación densa bien optimizada.","Mide la latencia con las mismas entradas y lotes en el dispositivo de destino; compara también la calidad con los mismos casos."],
      ["Opciones de diseño","Compara variantes cambiando primero una dimensión: canales por capa (ancho), número de bloques (profundidad) o resolución de entrada. Mantén los mismos datos de evaluación y un presupuesto de ajuste comparable.","Mide en el dispositivo el coste y desglosa los errores por tamaño de objeto y grupo. Una media parecida no compensa necesariamente que una variante barata deje de detectar los defectos más pequeños."]
    ],
    takeaways:["Separar espacio y mezcla de canales reduce parámetros.","Latencia se mide en hardware objetivo.","Precisión y coste se evalúan juntos."],
    questions:[
      ["Una convolución estándar de 3×3, sin grupos ni sesgos, recibe 16 canales y produce 32. ¿Cuántos pesos tiene?",["656","4608","144","512"],1,["656 correspondería a un filtro espacial por entrada seguido de una mezcla 1×1.","Correcto: 9·16 pesos por filtro, multiplicados por 32 filtros.","Eso solo cuenta un filtro de 3×3 por canal de entrada.","16·32 solo cuenta una mezcla 1×1."]],
      ["Tras filtrar cada canal por separado, aplicas una convolución 1×1 estándar de paso 1. ¿Qué función cumple?",["Mezcla los canales en cada posición","Mezcla solo píxeles vecinos del mismo canal","Duplica la resolución espacial","Reduce cada mapa a su promedio global"],0,["Correcto: una salida pondera varios canales de la misma coordenada.","Un filtro 1×1 no alcanza la posición vecina.","Con paso 1 y sin relleno añadido no aumenta la rejilla.","Una mezcla por posición conserva un mapa, no un escalar global."]],
      ["Una red tiene menos pesos que otra. ¿Cómo comprobarías si de verdad responde antes en el móvil de destino?",["Medir latencia con iguales entradas y lote en ese móvil","Comparar solo los tamaños de los archivos de pesos","Comparar solo los tiempos de entrenamiento","Contar capas y elegir la red menos profunda"],0,["Correcto: el movimiento de memoria y las operaciones disponibles afectan al tiempo real.","Almacenar menos pesos no implica ejecutar más deprisa.","Entrenamiento e inferencia realizan trabajo distinto.","Dos capas pueden tener costes muy distintos."]]
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
      ["Resolución","Para dimensiones pares, pasar de H×W a (H/2)×(W/2) deja H·W/4 posiciones. Un objeto de dos píxeles por eje pasa a ocupar aproximadamente uno y puede dejar de distinguirse.","No todo el tiempo depende del número de posiciones: hay costes fijos de ejecución, transferencias de memoria y operaciones finales que no se reducen en esa proporción."],
      ["Backbone y cabeza","Un extractor común produce mapas de características; la cabeza determina si se obtiene una clase, cajas o una máscara. Se puede reutilizar la base sin imponer la misma salida a las tres tareas.","Las capas tempranas suelen conservar detalle espacial y las profundas abarcan más contexto a menor resolución. Fusionar niveles ayuda a localizar objetos pequeños sin renunciar a indicios sobre qué son."],
      ["Medida real","En el dispositivo final mide memoria máxima y latencia por imagen, desde el redimensionado y la división en recortes hasta la unión y el posprocesado de las predicciones. Usa cargas y tamaños de lote representativos.","Informa la mediana y el percentil 95 de latencia para distinguir la respuesta típica de la cola lenta. Compara también el tamaño del modelo y los errores por escala: reducir la entrada puede ahorrar tiempo a costa de objetos pequeños."]
    ],
    takeaways:["El resize cambia señal y coste.","Distintas tareas requieren salidas distintas.","Evalúa pipeline completo en dispositivo objetivo."],
    questions:[
      ["Reduces a la mitad tanto el alto como el ancho de una imagen de dimensiones pares. ¿Qué fracción de posiciones espaciales queda?",["La mitad","Un cuarto","La misma cantidad","Un octavo"],1,["Reducir solo un eje a la mitad daría esa fracción.","Correcto: el área se multiplica por 1/2·1/2 = 1/4.","Ambos ejes tienen ahora menos posiciones.","Solo se han reducido dos dimensiones; no hay un tercer factor 1/2."]],
      ["En una prueba dominan los objetos grandes. Tras reducir la resolución, apenas cambia el porcentaje global de aciertos. ¿Qué comprobarías antes de aceptar el cambio?",["El rendimiento desglosado por tamaño de objeto","Solo la métrica global con más decimales","Solo el rendimiento en objetos grandes","Solo la pérdida final en entrenamiento"],0,["Correcto: una caída en los objetos pequeños puede quedar diluida en el resultado global.","Más decimales no separan los grupos.","Revisar solo la mayoría volvería a ocultar la minoría.","La pérdida de entrenamiento no mide qué escalas fallan en la prueba."]],
      ["Dos modelos tienen calidad suficiente para una aplicación móvil. ¿Qué medición permite decidir si cumplen el presupuesto de ejecución?",["Latencia de extremo a extremo y memoria máxima en el móvil de destino","Solo operaciones teóricas por imagen","Solo latencia del modelo en una estación de trabajo","Solo tamaño del archivo con los pesos"],0,["Correcto: el dispositivo ejecutará también el preprocesado y el posprocesado.","El recuento no mide transferencias ni tiempos de ejecución.","El hardware y las operaciones disponibles pueden ser distintos.","Los pesos no incluyen la memoria ocupada por activaciones y otras etapas."]]
    ],
    labTitle:"Ajusta resolución",labInstruction:"Reduce ambos ejes y calcula cuántas posiciones espaciales quedan.",
    source:["TorchVision · Models and weights","https://docs.pytorch.org/vision/stable/models.html"]
  }
];
export const sectorNineLessons=buildSector(draft);
