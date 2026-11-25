import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[] = [
  {
    id:"08.01",navTitle:"Batch y épocas",title:"Cuántas veces ve el modelo los datos",
    objective:"Calcular pasos por época y distinguir lote, época y actualización.",
    lead:"No es igual procesar 1.000 imágenes de una vez que hacerlo en lotes de 20; cambia cuántos pasos da el optimizador.",
    keyIdea:"En un recorrido de train sin reemplazo y sin drop_last, N ejemplos con lote B dan ceil(N/B) lotes. Las actualizaciones dependen también de la acumulación de gradientes.",
    sections:[
      ["La unidad de trabajo","En una pasada de 100 ejemplos sin reemplazo, con lotes de hasta 32 y conservando el último, se procesan cuatro lotes: 32, 32, 32 y 4.","Si se actualiza al terminar cada lote, hay cuatro pasos. Si se acumulan los gradientes de dos lotes antes de cada actualización, se procesan los mismos ejemplos en solo dos pasos."],
      ["Gradiente de lote","Con muestras independientes, la media de más ejemplos suele dar un gradiente menos variable, pero guardar sus activaciones simultáneamente consume más memoria. Acumular gradientes de lotes pequeños permite actualizar con más ejemplos sin almacenar todas esas activaciones a la vez.","Para reproducir la media del lote grande, pondera cada lote pequeño por su número de ejemplos y no cambies los pesos entre ellos. Aun así, la normalización por lotes usa las estadísticas de cada lote pequeño, no las del conjunto acumulado."],
      ["Comparar presupuesto","Una época en un conjunto mayor procesa más ejemplos; con lotes o acumulaciones diferentes también cambia el número de actualizaciones. Compara ejemplos vistos, pasos, tiempo y memoria, no solo épocas.","En entrenamiento suele barajarse el orden y aplicarse variación aleatoria a las imágenes. En validación, un orden reproducible y un preprocesado fijo permiten comparar modelos sobre los mismos casos y condiciones."]
    ],
    takeaways:["Batch es un grupo; época es un recorrido.","Pasos ≈ ceil(N/B) si no descartas resto.","Épocas no bastan para comparar presupuestos."],
    questions:[
      ["Recorres 100 ejemplos una vez en lotes de hasta 32 y conservas el último aunque no esté lleno. ¿Cuántos lotes procesas?",["3","4","32","100"],1,["Tres lotes completos solo cubren 96 ejemplos.","Correcto: 32 + 32 + 32 + 4 = 100.","32 es la capacidad de un lote.","100 es el número de ejemplos, no el de lotes."]],
      ["Recorres 96 imágenes una vez, con una actualización por lote. Si aumentas el lote de 16 a 32 imágenes, ¿cómo cambia el número de actualizaciones?",["Pasa de 6 a 3","Pasa de 3 a 6","Permanece en 6","Pasa de 16 a 32"],0,["Correcto: 96/16 = 6 lotes y 96/32 = 3; cada lote produce un paso.","El lote mayor necesita menos pasos para cubrir las mismas imágenes.","Mantener los ejemplos no mantiene el número de lotes.","16 y 32 cuentan imágenes por lote, no actualizaciones."]],
      ["Si el cargador recorre el conjunto de entrenamiento sin reemplazo ni descartes, ¿cuándo termina una época?",["Después de actualizar los pesos una vez","Cuando se ha procesado una vez cada ejemplo","Cuando deja de bajar la pérdida","Tras calcular un gradiente para un lote"],1,["Una época puede contener muchas actualizaciones.","Correcto: una época es la pasada completa, no un paso del optimizador.","La pérdida no determina cuánto dura el recorrido.","Un lote solo completa la época si abarca todo el conjunto."]]
    ],
    labTitle:"Cuenta los pasos",labInstruction:"Cambia batch para un dataset de 100 muestras y observa el último lote.",
    source:["PyTorch · Datasets & DataLoaders","https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html"]
  },
  {
    id:"08.02",navTitle:"Muestreo y balance",title:"Qué ve cada lote",
    objective:"Distinguir prevalencia real, muestreo balanceado y pesos de pérdida.",
    lead:"Un defecto raro puede faltar de muchos lotes. Forzar presencia en train cambia el entrenamiento, pero no la frecuencia real de producción.",
    keyIdea:"Remuestrear o ponderar clases modifica el objetivo de aprendizaje; evalúa con una distribución representativa y documenta el cambio.",
    sections:[
      ["Lotes con clases raras","Una prevalencia del 1 % es una frecuencia poblacional, no una cuota por lote. Con 16 extracciones independientes se esperan 0,16 positivos por lote y la probabilidad de no ver ninguno es 0,99¹⁶ ≈ 85 %.","Repetir fotos positivas aumenta su frecuencia durante el ajuste, pero el modelo sigue viendo las mismas piezas; no has añadido defectos distintos."],
      ["Dos mecanismos","El muestreo ponderado cambia qué ejemplos llegan a los lotes y con qué frecuencia. Ponderar la pérdida no modifica el lote: cambia cuánto aporta cada ejemplo al gradiente según su clase.","Si repites los positivos y además multiplicas su pérdida, refuerzas la misma clase dos veces. Comprueba en validación si la ganancia en defectos detectados compensa el aumento de falsas alarmas."],
      ["Evaluación honesta","La precisión positiva es la fracción de alarmas que corresponden a defectos reales. Evalúa con cámaras, condiciones y prevalencia representativas: con muchos negativos pueden acumularse bastantes falsas alarmas incluso a una tasa baja.","Si equilibras la prueba al 50 % de defectos, esa precisión ya no estima directamente la de una línea con un 1 %. Informa los conteos de errores y la sensibilidad; para trasladar resultados entre prevalencias harían falta tasas por clase representativas y una ponderación adecuada."]
    ],
    takeaways:["Rareza afecta composición de lotes.","Sampler y pesos no son idénticos.","La evaluación debe reflejar el uso previsto."],
    questions:[
      ["Repites diez veces la misma foto de un defecto en entrenamiento. ¿Qué has cambiado?",["El número de piezas independientes observadas","La frecuencia con que el modelo ve ese defecto","La prevalencia de defectos en producción","La variedad de apariencias del defecto"],1,["Todas las copias proceden de una pieza.","Correcto: repetir puede darle más peso en el ajuste sin aportar casos independientes.","La distribución de entrenamiento no modifica la línea de producción.","Las copias idénticas no añaden ángulos, fondos ni defectos nuevos."]],
      ["Sin modificar el muestreo, asignas mayor peso a la clase defectuosa en la función de pérdida. ¿Qué cambia directamente?",["La contribución de sus ejemplos a la pérdida","El número de defectos que entran en cada lote","El umbral de decisión en inferencia","La proporción de positivos de la prueba"],0,["Correcto: a igual error, un ejemplo de esa clase aporta más al objetivo.","Eso lo cambiaría el muestreador, no la ponderación.","Ponderar puede cambiar el modelo aprendido, pero no fija un nuevo umbral.","La ponderación solo interviene en el objetivo de entrenamiento."]],
      ["En producción, un 1 % de las piezas tiene defecto. ¿Qué prueba estima directamente qué fracción de las alarmas será correcta?",["Piezas nuevas con prevalencia y condiciones representativas","Una mezcla al 50 % de cada clase sin reponderar","Solo piezas defectuosas de producción","Las mismas piezas positivas usadas para entrenar"],0,["Correcto: la precisión entre las alarmas depende también de cuántas piezas sanas pueden generar falsas alarmas.","Cambiar la prevalencia cambia el valor predictivo de las alarmas.","Sin negativos no se cuentan falsas alarmas.","Repetir piezas de entrenamiento no estima el rendimiento en piezas nuevas."]]
    ],
    labTitle:"Compón un lote",labInstruction:"Cambia prevalencia y calcula positivos esperados en un batch de 20.",
    source:["PyTorch · WeightedRandomSampler","https://docs.pytorch.org/docs/stable/data.html#torch.utils.data.WeightedRandomSampler"]
  },
  {
    id:"08.03",navTitle:"Augmentations",title:"Cambiar la imagen sin cambiar la verdad",
    objective:"Aplicar transformaciones coherentes a imagen, máscara, caja y etiqueta.",
    lead:"Girar puede aportar variedad, pero una máscara o caja que no gira con la imagen deja de señalar el objeto.",
    keyIdea:"Una transformación espacial debe aplicarse con los mismos parámetros geométricos a entrada y anotaciones; su validez semántica depende del dominio.",
    sections:[
      ["Geometría alineada","Un reflejo horizontal debe usar el mismo eje en imagen, cajas y máscaras. Para cajas expresadas mediante bordes continuos entre 0 y W, el intervalo horizontal [a, b] pasa a [W−b, W−a]; los índices de columna 0…W−1 se reflejan como W−1−x.","El reflejo exacto no necesita interpolación. Si además redimensionas, puedes interpolar intensidades, pero usa vecino más próximo para una máscara de clases discretas. Superpón la anotación transformada a la imagen para verificar la alineación."],
      ["Semántica de la tarea","Un giro de 180° puede ser válido para células y absurdo para dígitos 6/9 o señales con orientación. Una transformación visualmente bonita puede cambiar etiqueta.","El ruido o color simulado debe aproximar variaciones plausibles del dispositivo, no borrar el defecto que quieres detectar."],
      ["Solo en train","Las transformaciones aleatorias amplían la variación de entrenamiento. En validación y prueba, cambiar al azar la dificultad de cada imagen de una ejecución a otra enturbia la comparación.","Si el sistema combina varias vistas en inferencia, fija antes de la prueba las transformaciones, cómo devolver las predicciones al marco original y cómo agregarlas. Aplica ese mismo protocolo al evaluar y al desplegar."]
    ],
    takeaways:["Transforma etiquetas espaciales junto con imagen.","Validez depende del dominio.","Val/test usan protocolo fijo."],
    questions:[
      ["Reflejas horizontalmente una imagen de 100 píxeles de ancho. Los bordes de una caja están en x=10 y x=20, en coordenadas continuas de 0 a 100. ¿Dónde quedan sus bordes izquierdo y derecho?",["10 y 20","80 y 90","79 y 89","90 y 80"],1,["Dejar la caja en su sitio la separa del objeto reflejado.","Correcto: el borde derecho original pasa a ser el izquierdo: 100−20 = 80; el otro queda en 100−10 = 90.","Restar de 99 corresponde a índices de píxel, no a esta convención de bordes.","Los extremos reflejados deben quedar en orden izquierdo, derecho."]],
      ["Un clasificador distingue los dígitos 6 y 9. ¿Por qué es arriesgado rotar 180° sus imágenes manteniendo las etiquetas?",["La rotación cambia siempre el número de píxeles","La imagen girada puede representar la otra clase","La validez depende solo del formato del archivo","Mantener la etiqueta garantiza que la transformación sea válida"],1,["Una rotación de media vuelta puede mantener las dimensiones.","Correcto: si cambia el significado visual, la etiqueta original puede volverse falsa.","El problema es semántico, no de codificación.","Copiar la etiqueta no conserva necesariamente la clase retratada."]],
      ["Tu modelo se desplegará con una sola vista y preprocesado fijo. ¿Dónde aplicarías transformaciones aleatorias que preservan la etiqueta?",["En entrenamiento, con validación y prueba bajo el preprocesado de uso","En prueba, eligiendo la vista con mayor acierto","Solo en las máscaras de entrenamiento","Por separado y al azar en cada evaluación"],0,["Correcto: entrenas para tolerar variación sin cambiar lo que pretende medir la evaluación.","Elegir por acierto usa la respuesta de prueba para decidir.","Si cambia la geometría de una máscara, debe cambiar igual la imagen.","Variar las condiciones de medida dificulta atribuir los cambios al modelo."]]
    ],
    labTitle:"Voltea una caja",labInstruction:"Mueve una caja en un ancho de 100 y calcula las coordenadas después de flip horizontal.",
    source:["TorchVision · Transforms v2","https://docs.pytorch.org/vision/stable/transforms.html"]
  },
  {
    id:"08.04",navTitle:"Normalización",title:"La escala que aprende train",
    objective:"Calcular una normalización y evitar estadísticas extraídas de test.",
    lead:"Restar una media y dividir por una desviación puede facilitar entrenamiento, pero esa media también es información aprendida.",
    keyIdea:"Para z-score, x'=(x−μ_train)/σ_train; se aplica la misma transformación a val y test sin volver a estimarla.",
    sections:[
      ["Una cuenta simple","Restar la media y dividir por la desviación da (150−100)/25 = 2: el valor está dos desviaciones por encima de la media de entrenamiento.","Si la desviación es cero, la variable fue constante en entrenamiento. Fija una regla, como retirarla o usar divisor 1 después de centrar; aplica la misma regla a todas las particiones."],
      ["Fijar parámetros","Para estandarizar por canal, calcula una media y una desviación por canal sobre imágenes y posiciones espaciales de entrenamiento, en el rango de intensidades que usarás en inferencia. Congélalas para validación y prueba.","Al cambiar de cámara, comprueba el rango, las distribuciones por canal y el rendimiento en capturas representativas. No reajustes las estadísticas con las imágenes reservadas para medir ese rendimiento."],
      ["Entradas y pesos preentrenados","Si unos pesos se entrenaron con un orden de canales, un rango y una normalización concretos, cambiarlos altera lo que llega a filtros ya aprendidos. Reproduce el preprocesado documentado o valida explícitamente la alternativa.","Normalizar por imagen usa estadísticas de esa imagen en cada predicción y puede eliminar diferencias de brillo entre fotos. Normalizar con estadísticas globales usa las mismas constantes de entrenamiento para todas."]
    ],
    takeaways:["Ajusta μ y σ en train.","Aplica lo mismo a val/test.","Verifica la normalización esperada por el modelo."],
    questions:[
      ["Una intensidad vale 150; su canal tiene media de entrenamiento 100 y desviación estándar 25. ¿Qué valor obtiene al estandarizarla?",["2","50","6","0,5"],0,["Correcto: (150−100)/25 = 2.","Has centrado el valor, pero falta dividir por la desviación.","150/25 omite restar la media.","Has invertido el cociente: se divide la diferencia por 25."]],
      ["Un modelo se entrenó centrando cada canal con una media global aprendida. ¿Qué media usas al evaluar imágenes nuevas?",["La misma media por canal calculada en entrenamiento","Una nueva media por canal sobre toda la prueba","La media conjunta de entrenamiento y prueba","La media propia de cada imagen"],0,["Correcto: se reutiliza la transformación con que se ajustó el modelo.","La transformación dependería del conjunto reservado para evaluarla.","La mezcla deja que la prueba influya en la transformación.","Centrar cada imagen es una política distinta de la aprendida."]],
      ["Al estandarizar una característica, su desviación de entrenamiento es cero. ¿Qué implica para (x−media)/desviación?",["La división no está definida y hay que tratar la característica constante","El resultado es cero para cualquier imagen nueva","El valor normalizado siempre coincide con x","Basta recalcular la desviación con la prueba"],0,["Correcto: retira esa característica o fija un divisor seguro con una política común.","Ni siquiera 0/0 está definido sin una regla adicional.","Dividir por cero no conserva el valor de entrada.","Usar la prueba cambiaría la transformación con datos de evaluación."]]
    ],
    labTitle:"Normaliza un valor",labInstruction:"Cambia x con μ=100 y σ=25 fijos de train.",
    source:["scikit-learn · Common pitfalls","https://scikit-learn.org/stable/common_pitfalls.html"]
  },
  {
    id:"08.05",navTitle:"Tasa y calendario",title:"El tamaño de los pasos también se programa",
    objective:"Leer un schedule y distinguir pasos de época.",
    lead:"Una tasa constante puede resultar útil al principio y demasiado brusca al final. Un calendario declara cómo cambia durante entrenamiento.",
    keyIdea:"El scheduler cambia η según pasos o épocas definidos; su posición respecto a optimizer.step y su API importa.",
    sections:[
      ["Decaimiento sencillo","Un StepLR puede multiplicar la tasa por gamma cada cierto número de épocas. Con η=0,1, gamma=0,1, tras un descenso queda 0,01.","Otros calendarios dependen de pasos, ciclos o métricas de validación; no los trates como equivalentes."],
      ["Registra el paso","Un calendario que cuenta llamadas no sabe si una llamada equivale a una época o a un lote. Con 20 lotes por época, el descenso previsto tras cinco épocas ocurriría tras solo cinco lotes si se avanza en cada uno.","Registra la tasa que usa realmente el optimizador junto con el paso y la época. Así puedes comparar cuándo cambia con el calendario previsto y verificar el orden de las llamadas."],
      ["Decidir con validación","Entrena las variantes cambiando la tasa inicial, el periodo de aumento gradual o el momento del descenso. Elige con la misma métrica de validación y un presupuesto comparable; reserva la prueba para el procedimiento ya elegido.","Una curva de entrenamiento estable solo indica cómo evoluciona el ajuste sobre ejemplos conocidos. Comprueba si la mejora alcanza a casos nuevos y cuánto cómputo cuestan las épocas adicionales."],
    ],
    takeaways:["El calendario define cuándo cambia η.","Batch y época cambian escala temporal.","Registra tasa real y valida."],
    questions:[
      ["Un calendario multiplica la tasa de aprendizaje por 0,1 en cada descenso. Si empieza en 0,1, ¿cuánto vale tras el primer descenso?",["0,01","1","0,2","0"],0,["Correcto: 0,1·0,1 = 0,01.","Dividir entre 0,1 aumentaría la tasa.","El calendario multiplica, no suma.","Multiplicar por un factor positivo no resta la tasa completa."]],
      ["Un calendario StepLR reduce la tasa cada cinco llamadas. Hay 20 lotes por época y lo llamas tras cada lote en vez de al final de cada época. ¿Cuándo ocurre el primer descenso?",["Tras el quinto lote de la primera época","Tras la quinta época","Al terminar el primer lote","Al terminar la primera época"],0,["Correcto: la quinta llamada llega al terminar el quinto lote.","Eso ocurriría con una llamada por época.","Una llamada no completa el intervalo de cinco.","Al terminar esa época ya se han hecho 20 llamadas."]],
      ["Tienes varios calendarios de tasa de aprendizaje para el mismo modelo. ¿Con qué criterio eliges uno antes de la prueba final?",["Resultados de validación con el mismo presupuesto de comparación","La mejor métrica de prueba a lo largo del entrenamiento","La menor pérdida del último lote de entrenamiento","El mayor número de descensos de la tasa"],0,["Correcto: comparas el efecto del calendario sin usar la prueba para decidir.","La prueba se convertiría en un conjunto de selección.","Un lote de entrenamiento no estima la generalización.","Contar descensos no indica si han ayudado."]]
    ],
    labTitle:"Programa la tasa",labInstruction:"Cambia el número de descensos con η inicial 0,1 y factor 0,5.",
    source:["PyTorch · Learning rate scheduling","https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate"]
  },
  {
    id:"08.06",navTitle:"Early stopping y checkpoints",title:"Conservar el mejor intento",
    objective:"Separar última época, mejor validación y estado necesario para reanudar.",
    lead:"La última época puede no ser la mejor. Guardar solo pesos tampoco basta siempre para continuar exactamente el entrenamiento.",
    keyIdea:"Early stopping observa una métrica de validación con paciencia definida; un checkpoint de reanudación incluye modelo, optimizador y estado relevante.",
    sections:[
      ["Qué significa mejor","Una regla posible: medir la pérdida de validación al final de cada época, minimizarla y contar como mejora una bajada de al menos 0,001 respecto al mejor valor aceptado. Guarda el estado que cumple el criterio.","Con paciencia de cinco evaluaciones, paras tras cinco seguidas sin mejora suficiente y recuperas el mejor estado guardado. Fijar la regla antes evita reaccionar a una sola oscilación o escogerla a la vista de la prueba."],
      ["Guardar el estado","Para inferencia guarda arquitectura, estado del modelo (pesos y estadísticas de capas), preprocesado y correspondencia entre índices y clases. Tras cargar, activa el modo de evaluación.","Para reanudar el ajuste, añade estado del optimizador, calendario de la tasa y época o paso alcanzado. Si necesitas continuar la misma secuencia, conserva los estados de los generadores aleatorios y la posición del muestreador."],
      ["No tocar test","La época es una decisión de selección: si la eliges por el mejor resultado de prueba, ese resultado favorece por construcción al estado elegido. Ya no es una estimación independiente.","Elige en validación y anota la métrica, su dirección de mejora, la regla de parada y la época guardada. Evalúa una vez el estado elegido en la prueba reservada."],
    ],
    takeaways:["Mejor val puede preceder a última época.","Reanudar exige más estado que inferir.","El test no selecciona checkpoint."],
    questions:[
      ["Guardaste el modelo al final de cada época. La menor pérdida de validación fue la de la época 8; el entrenamiento terminó en la 20. Si el criterio es minimizar esa pérdida, ¿qué estado recuperas?",["El de la época 8","El de la época 20","El de menor pérdida de entrenamiento","El de más aciertos en prueba"],0,["Correcto: es el mínimo de la métrica de selección.","El último estado no tiene por qué ser el mejor.","La pérdida de entrenamiento no es el criterio escogido.","Seleccionar con la prueba sesga la evaluación final."]],
      ["Quieres reanudar Adam sin reiniciar su dinámica. Además de los pesos del modelo, ¿qué información del optimizador necesitas?",["Los momentos acumulados y el contador de pasos","Solo la tasa inicial y el nombre Adam","Solo el último valor de la pérdida","Solo el gradiente del último lote"],0,["Correcto: la siguiente actualización depende del historial resumido y del paso alcanzado.","Eso permite crear un Adam nuevo, no reconstruir su historial.","La pérdida escalar no contiene el estado por parámetro.","Un gradiente no reconstruye las medias móviles anteriores."]],
      ["Una regla de parada temprana tiene paciencia de tres evaluaciones de validación. ¿Qué condición comprueba?",["Tres evaluaciones seguidas sin mejora según el criterio fijado","Tres lotes sin bajar la pérdida de entrenamiento","Tres aciertos consecutivos en la prueba","Tres épocas desde que comenzó el entrenamiento"],0,["Correcto: la paciencia cuenta evaluaciones sin mejora suficiente.","No se cuentan lotes de entrenamiento bajo esa regla.","La prueba no debe decidir cuándo se para.","Una mejora reinicia el contador; no es un límite fijo de duración."]]
    ],
    labTitle:"Elige checkpoint",labInstruction:"Mueve la época y compara pérdida val con el mínimo ya alcanzado.",
    source:["PyTorch · Saving and Loading Models","https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html"]
  },
  {
    id:"08.07",navTitle:"Reproducibilidad",title:"Repetir de verdad un experimento",
    objective:"Documentar semillas, datos, código, entorno y fuentes de no determinismo.",
    lead:"Una semilla sola no congela el universo. Cargadores paralelos, kernels y versiones pueden cambiar resultados.",
    keyIdea:"Una ejecución reproducible necesita conservar split, configuración, código, versiones, semillas y, para reanudar, estado; determinismo absoluto puede tener coste o no estar disponible.",
    sections:[
      ["Qué registrar","Guarda la versión o huella de los datos, los identificadores de cada partición, el código, las transformaciones, los hiperparámetros y las semillas. Así sabes qué imágenes entraron en cada conjunto y cómo se procesaron.","Anota versiones de bibliotecas, dispositivo y ajustes de determinismo: con el mismo código y semilla, cambiar archivos o implementaciones puede cambiar el resultado."],
      ["Aleatoriedad múltiple","Python, NumPy, PyTorch, DataLoader y backend pueden tener estados distintos. Algunas operaciones GPU no son deterministas por defecto.","Activar algoritmos deterministas puede reducir velocidad o revelar operaciones sin variante determinista."],
      ["Variación como señal","Con los datos y el protocolo fijos, repetir con varias semillas permite medir cuánto cambia la métrica por la inicialización y el orden de los lotes. Informa el valor típico y la dispersión para distinguir una mejora consistente de una ejecución afortunada.","Elegir la semilla que más acierta en la prueba utiliza sus resultados para seleccionar, de modo que la estimación deja de ser independiente. Repetir un reparto con fuga tampoco lo convierte en válido."]
    ],
    takeaways:["Registra datos y código además de seed.","Hay varias fuentes de aleatoriedad.","Mide variación entre ejecuciones."],
    questions:[
      ["Has anotado la semilla aleatoria de un entrenamiento. ¿Qué más necesitas para poder reconstruirlo?",["Versiones de datos y código, particiones, configuración y entorno","Solo la métrica final con más decimales","Solo el nombre del optimizador","Solo el tiempo total de ejecución"],0,["Correcto: una semilla no fija qué se ejecutó, con qué datos ni con qué versiones.","La métrica describe un resultado, no su origen.","Un mismo optimizador admite muchos ajustes y datos distintos.","El tiempo no permite reproducir el cómputo."]],
      ["Añades fotos al directorio y regeneras la partición aleatoria con la semilla original. ¿Qué debes comprobar antes de comparar el nuevo resultado con el antiguo?",["Qué archivos concretos quedaron en cada partición","Solo que el porcentaje de prueba sea el mismo","Solo que coincidan los nombres de las clases","Solo que se mantenga la resolución"],0,["Correcto: con otra lista de archivos, la misma semilla puede asignar casos distintos.","El porcentaje no identifica los casos.","Clases idénticas no implican imágenes idénticas.","La resolución no determina la composición de los conjuntos."]],
      ["Repites un entrenamiento con los mismos datos y distintas semillas. ¿Qué averiguas al informar la dispersión de las métricas?",["Cuánto varía el resultado por la aleatoriedad del ajuste","La prevalencia exacta de una cámara nueva","Si las etiquetas están necesariamente bien anotadas","Qué semilla debe elegirse mirando la prueba"],0,["Correcto: los cambios de inicialización u orden pueden producir resultados diferentes.","Ninguna semilla incorpora casos nuevos de esa cámara.","Un error de anotación puede repetirse en todas las ejecuciones.","Seleccionar la mejor semilla por la prueba sesga el resultado."]]
    ],
    labTitle:"Mide variación",labInstruction:"Cambia dispersión simulada de cinco ejecuciones alrededor del mismo promedio.",
    source:["PyTorch · Reproducibility","https://docs.pytorch.org/docs/stable/notes/randomness.html"]
  },
  {
    id:"08.08",navTitle:"Diagnóstico de entrenamiento",title:"Leer curvas antes de tocar parámetros",
    objective:"Distinguir sobreajuste, infraajuste, fuga y distribución distinta como hipótesis.",
    lead:"Una curva es una pista, no un diagnóstico cerrado. Hay que preguntar qué datos y cálculo produjeron cada punto.",
    keyIdea:"Train y val deben medirse con modo y preprocesado apropiados; compara tendencias, brechas y errores concretos antes de cambiar arquitectura.",
    sections:[
      ["Curvas comparables","Transformar las imágenes y anular activaciones al azar puede hacer más difícil el entrenamiento. En validación se usan entradas sin esas perturbaciones y el modelo en modo evaluación: las dos pérdidas no se midieron en iguales condiciones.","Para comparar, fija el mismo estado de pesos y mide en ambos conjuntos la misma pérdida, con modo evaluación y el mismo preprocesado determinista. Si queda una brecha, investiga los datos; la desigualdad inicial no prueba una fuga."],
      ["Hipótesis","Si mejora el entrenamiento y empeora la validación, contrasta sobreajuste y diferencias entre poblaciones. Si ambas pérdidas siguen altas, comprueba la señal de entrada, las etiquetas, la capacidad y si el optimizador consigue ajustar siquiera un lote pequeño.","Ante una validación inesperadamente perfecta, busca duplicados, piezas presentes en ambos conjuntos o metadatos que revelen la respuesta. Son hipótesis que hay que comprobar, no diagnósticos deducidos solo de las curvas."],
      ["Experimento siguiente","Examina falsas alarmas y omisiones en validación y busca un patrón. Si muchas omisiones son defectos diminutos, por ejemplo, prueba aumentar solo la resolución y compara con la misma partición y la misma métrica por tamaño.","Decide con validación si la mejora compensa su coste. Mantén la prueba intacta hasta fijar el procedimiento para no optimizar con sus errores."]
    ],
    takeaways:["Las curvas requieren condiciones de medición claras.","Una tendencia admite varias causas.","Revisa ejemplos de error y split."],
    questions:[
      ["La pérdida de entrenamiento se mide con Dropout activo y la de validación con Dropout desactivado. La segunda es menor. ¿Qué conclusión está justificada?",["Las condiciones difieren; conviene comparar también en modo evaluación","Eso demuestra que se filtraron imágenes","Eso descarta cualquier sobreajuste","Hay que activar Dropout al azar en producción"],0,["Correcto: anular activaciones durante entrenamiento puede dificultar la predicción.","La diferencia por sí sola no prueba una fuga.","El modo distinto puede ocultar o aumentar la brecha.","No se cambia el sistema de inferencia solo para igualar dos pérdidas."]],
      ["Un clasificador obtiene una validación casi perfecta cuando esperabas muchos errores. ¿Qué comprobación pondría a prueba la hipótesis de fuga?",["Buscar duplicados y piezas compartidas entre entrenamiento y validación","Aumentar la profundidad del clasificador","Elegir la época de mayor acierto en prueba","Contar solo los ejemplos de validación bien clasificados"],0,["Correcto: los casos emparentados podrían premiar la memorización.","Cambiar la arquitectura no comprueba qué casos se repiten.","Usar la prueba para elegir introduciría otro sesgo.","Los aciertos por sí solos no revelan si sus piezas ya se vieron."]],
      ["Quieres saber si un cambio de preprocesado mejora la generalización. ¿Cómo lo compararías con el actual?",["Con las mismas particiones, métrica y condiciones de entrenamiento","Con una partición aleatoria distinta para cada versión","Escogiendo después la métrica más favorable","Eliminando de validación los casos difíciles para la nueva versión"],0,["Correcto: así reduces explicaciones alternativas para la diferencia observada.","Podrías medir una diferencia de dificultad entre particiones.","Cambiar el criterio a posteriori favorece resultados fortuitos.","Excluir fallos sesga la comparación."]]
    ],
    labTitle:"Lee la curva",labInstruction:"Cambia la época en una curva ilustrativa y observa cuándo val deja de mejorar.",
    source:["PyTorch · Optimization","https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html"]
  }
];
export const sectorEightLessons=buildSector(draft);
