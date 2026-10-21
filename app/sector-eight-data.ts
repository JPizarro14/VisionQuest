import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[] = [
  {
    id:"08.01",navTitle:"Batch y épocas",title:"Cuántas veces ve el modelo los datos",
    objective:"Calcular pasos por época y distinguir lote, época y actualización.",
    lead:"No es igual procesar 1.000 imágenes de una vez que hacerlo en lotes de 20; cambia cuántos pasos da el optimizador.",
    keyIdea:"En un recorrido de train sin reemplazo y sin drop_last, N ejemplos con lote B dan ceil(N/B) lotes. Las actualizaciones dependen también de la acumulación de gradientes.",
    sections:[
      ["La unidad de trabajo","Un batch contiene muestras procesadas juntas. Con N=100 y B=32, hay cuatro batches: tres de 32 y uno de 4 si no se descarta el último.","Una época no implica un número fijo de actualizaciones sin conocer batch, drop_last y acumulación de gradientes."],
      ["Gradiente de lote","Cada lote estima un gradiente sobre sus muestras. Un lote pequeño introduce variabilidad; uno grande consume más memoria y cambia la dinámica.","Acumular gradientes puede simular un lote efectivo mayor, pero hay detalles de normalización y capas dependientes del batch."],
      ["Comparar presupuesto","Compara modelos por ejemplos vistos, pasos y coste, no solo épocas. Un dataset grande hace que una época sea mucho más trabajo.","Shuffle en train modifica el orden; en validación mantén evaluación determinista y sin augmentations aleatorias de entrenamiento."]
    ],
    takeaways:["Batch es un grupo; época es un recorrido.","Pasos ≈ ceil(N/B) si no descartas resto.","Épocas no bastan para comparar presupuestos."],
    questions:[
      ["100 ejemplos, batch 32, sin drop_last. ¿Cuántos lotes?",["3","4","32","100"],1,["Falta el lote final de cuatro.","Correcto: 32+32+32+4.","Es el tamaño del batch.","Es N."]],
      ["¿Qué cambia si duplicas B con N fijo?",["Suelen bajar los pasos por época","Se duplica N","Se crean etiquetas","Se garantiza mejor generalización"],0,["Correcto: hay menos lotes.","N no cambia.","No modifica ground truth.","No existe garantía."]],
      ["Una época significa...",["Una actualización siempre","Un recorrido del conjunto de train según el cargador","Una validación completa siempre","Un píxel visto"],1,["Hay varios lotes normalmente.","Correcto: puede incluir muchos pasos.","Es otro conjunto.","No define la época."]]
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
      ["Lotes con clases raras","Si solo 1% de piezas son defectuosas, un lote de 16 puede contener cero positivos. Los resultados varían entre lotes.","Un sampler puede repetir positivos o seleccionar grupos, pero duplicar imágenes no crea información nueva."],
      ["Dos mecanismos","Weighted sampling cambia qué ejemplos entran con mayor frecuencia; class weights cambian cuánto cuesta cada error en la pérdida.","Pueden combinarse con cuidado, pero usar ambos sin medir puede sobrerrepresentar demasiado una clase."],
      ["Evaluación honesta","No balances artificialmente test si deseas estimar precisión bajo la prevalencia de uso. Informa también recall y conteos.","Si el escenario de producción cambia, recalibra o revisa umbrales con datos representativos."]
    ],
    takeaways:["Rareza afecta composición de lotes.","Sampler y pesos no son idénticos.","La evaluación debe reflejar el uso previsto."],
    questions:[
      ["Duplicas una foto positiva diez veces. ¿Qué ganas?",["Diez pacientes nuevos","Más presencia de esa foto, no información independiente","Calibración perfecta","Más resolución"],1,["El origen sigue siendo uno.","Correcto: repetir no crea diversidad.","No se deduce.","Los píxeles no cambian."]],
      ["¿Qué modifica class weighting?",["Coste de errores por clase","Tamaño del sensor","IDs de pacientes","Número de tiles"],0,["Correcto: cambia contribución a la pérdida.","No es captura.","No altera grupos.","No particiona imágenes."]],
      ["Para estimar precision en producción con 1% de positivos, test debe...",["Ser representativo de esa población o ajustar interpretación","Estar balanceado 50/50 siempre","Contener solo positivos","Repetir train"],0,["Correcto: prevalencia afecta valor predictivo.","Puede inflar precision aparente.","No mide falsos positivos.","Produce fuga."]]
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
      ["Geometría alineada","Si volteas horizontalmente una imagen, las cajas cambian de x y la máscara se voltea igual. Interpola intensidades y etiquetas con métodos apropiados.","TorchVision v2 puede manejar imágenes, cajas y máscaras conjuntamente, pero verifica el formato y el resultado."],
      ["Semántica de la tarea","Un giro de 180° puede ser válido para células y absurdo para dígitos 6/9 o señales con orientación. Una transformación visualmente bonita puede cambiar etiqueta.","El ruido o color simulado debe aproximar variaciones plausibles del dispositivo, no borrar el defecto que quieres detectar."],
      ["Solo en train","Las augmentations aleatorias se aplican durante entrenamiento. Val/test deben seguir un preprocesado fijo, salvo un protocolo explícito de test-time augmentation.","Guardar semilla y parámetros ayuda a reproducir un caso problemático."]
    ],
    takeaways:["Transforma etiquetas espaciales junto con imagen.","Validez depende del dominio.","Val/test usan protocolo fijo."],
    questions:[
      ["Volteas imagen con una caja en x=10...20. ¿Qué haces?",["Dejas la caja intacta","Transformas la caja con el mismo flip","Cambias la clase siempre","Borras la caja"],1,["Quedará desalineada.","Correcto: conserva correspondencia espacial.","Un flip no cambia toda clase.","Pierdes anotación."]],
      ["¿Es siempre válido girar cualquier imagen 180°?",["Sí","No: puede cambiar el significado de la etiqueta","Solo para JPEG","Si hay más de 3 canales"],1,["Un 6 puede parecer un 9.","Correcto: depende del dominio.","El contenedor no decide validez.","Los canales no resuelven semántica."]],
      ["¿Dónde aplicas augmentations aleatorias habituales?",["En train","En test para elegir hiperparámetros","En etiquetas pero no imagen","En ninguno"],0,["Correcto: aumentan variación de entrenamiento.","Contamina evaluación si no es protocolo explícito.","Rompe alineación.","Pueden ser útiles si son válidas."]]
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
      ["Una cuenta simple","Con x=150, media train=100 y desviación train=25, el valor normalizado es 2.","Si σ=0, la operación necesita una política especial para evitar división por cero."],
      ["Fijar parámetros","Calcula estadísticas solo con train, siguiendo canal y rango correctos. Al cambiar de cámara o dominio, comprueba si esas estadísticas siguen siendo útiles.","Calcular μ sobre todas las imágenes antes del split introduce información del conjunto de evaluación."],
      ["Entradas y pesos preentrenados","Un modelo preentrenado puede exigir orden de canales, rango y normalización concretos. Cambiarlos sin revisar la documentación altera distribución de entrada.","Normalización por imagen individual es otra política; no se confunde con usar estadísticas globales de train."]
    ],
    takeaways:["Ajusta μ y σ en train.","Aplica lo mismo a val/test.","Verifica la normalización esperada por el modelo."],
    questions:[
      ["x=150, μ=100, σ=25. ¿z-score?",["2","50","6","0,5"],0,["Correcto: (150−100)/25=2.","Falta dividir.","No es el cálculo.","No corresponde."]],
      ["¿Qué media usas en test?",["La calculada con train","Una nueva sobre test","La mezcla de ambos","Cero siempre"],0,["Correcto: mantiene el protocolo sin fuga.","Usa información de evaluación.","También filtra información.","No es universal."]],
      ["σ_train=0. ¿Qué ocurre?",["División no definida sin política especial","Todo se vuelve uno","Se añade un canal","El test es perfecto"],0,["Correcto: necesitas manejar la feature constante.","No sale de la fórmula.","No afecta canales.","No mide rendimiento."]]
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
      ["Registra el paso","Loguea la tasa real junto con pérdida. Si el scheduler avanza por batch cuando esperabas por época, el descenso se acelera mucho.","Comprueba el orden recomendado por la versión de framework."],
      ["Decidir con validación","La tasa inicial, warmup y fecha de descenso se eligen con experimentos limpios. Una curva estable de train no garantiza mejora fuera de train.","Evalúa coste total: más épocas con tasa baja todavía consumen cómputo."]
    ],
    takeaways:["El calendario define cuándo cambia η.","Batch y época cambian escala temporal.","Registra tasa real y valida."],
    questions:[
      ["η=0,1, gamma=0,1 tras un descenso: nueva η",["0,01","1","0,2","0"],0,["Correcto: multiplicación por 0,1.","Has dividido al revés.","Has sumado.","No llega a cero."]],
      ["Scheduler previsto por época pero llamado por batch produce...",["Descenso más rápido","La misma tasa","Etiquetas nuevas","Más píxeles"],0,["Correcto: avanza más veces.","El número de llamadas cambió.","No modifica ground truth.","No cambia resolución."]],
      ["¿Dónde seleccionas el calendario?",["Validación y protocolo consistente","Mirando test cada paso","Solo por loss train","Por nombre del modelo"],0,["Correcto: evita sobreajustar test.","Contamina evaluación.","Puede ocultar mala generalización.","No es evidencia."]]
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
      ["Qué significa mejor","Define dirección, métrica, frecuencia y tolerancia de mejora. Con validación ruidosa, parar por una sola subida puede ser precipitado.","Si pruebas muchas políticas en el mismo val, también puedes sobreajustarlo."],
      ["Guardar el estado","Para inferencia bastan habitualmente pesos y configuración de arquitectura/preprocesado. Para reanudar añade estado del optimizador, scheduler, época y, si importa reproducibilidad, generadores aleatorios.","Después de cargar, usa modo evaluación para inferencia y comprueba versión y mapa de clases."],
      ["No tocar test","Elegir el checkpoint mirando test le convierte en validación. Selección con val; test después de congelar la decisión.","Registra qué criterio produjo el archivo publicado."]
    ],
    takeaways:["Mejor val puede preceder a última época.","Reanudar exige más estado que inferir.","El test no selecciona checkpoint."],
    questions:[
      ["Val mejora en época 8 y empeora hasta 20. ¿Qué checkpoint usarías normalmente?",["El de 8 según criterio definido","Siempre el de 20","El de test mejor","Ninguno"],0,["Correcto: selección por validación.","La última no es necesariamente mejor.","Eso sesga test.","Puedes guardar el mejor."]],
      ["Para reanudar Adam, además de pesos suelen hacer falta...",["Estado del optimizador y progreso","Solo nombre del archivo","IoU","Una captura"],0,["Correcto: momentos y paso influyen.","No reconstruye estado.","Es una métrica.","No contiene parámetros."]],
      ["Early stopping usa...",["Métrica de validación predefinida","El test final cada época","Solo el reloj","El mayor loss train"],0,["Correcto: con paciencia y criterio.","Contamina test.","No detecta generalización.","Optimizar para mayor pérdida no es objetivo."]]
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
      ["Qué registrar","Guarda IDs de train/val/test, hash o versión de datos, hiperparámetros, semillas y código. Una métrica sin ese contexto es difícil de auditar.","No basta anotar «seed 42» si el split se regeneró con otros archivos."],
      ["Aleatoriedad múltiple","Python, NumPy, PyTorch, DataLoader y backend pueden tener estados distintos. Algunas operaciones GPU no son deterministas por defecto.","Activar algoritmos deterministas puede reducir velocidad o revelar operaciones sin variante determinista."],
      ["Variación como señal","Repite con varias semillas cuando una pequeña mejora pueda ser azar. Informa dispersión y no selecciones la semilla favorable mirando test.","Reproducibilidad no sustituye validez del split ni calidad de etiquetas."]
    ],
    takeaways:["Registra datos y código además de seed.","Hay varias fuentes de aleatoriedad.","Mide variación entre ejecuciones."],
    questions:[
      ["¿Basta guardar solo seed=42?",["No: faltan datos, código y entorno","Sí, garantiza bit a bit","Solo si es RGB","Sí, elimina fuga"],0,["Correcto: otros estados y versiones importan.","No hay tal garantía.","El color no lo resuelve.","El split puede estar contaminado."]],
      ["Cambias los archivos y mantienes la semilla. ¿Es el mismo experimento?",["No necesariamente","Sí, siempre","Solo cambia el nombre","La pérdida debe ser idéntica"],0,["Correcto: el conjunto de datos cambió.","La semilla no fija datos externos.","Puede cambiar contenido.","No hay garantía."]],
      ["Varias semillas ayudan a...",["Estimar sensibilidad a aleatoriedad","Evitar test","Crear más clases","Cambiar IoU"],0,["Correcto: informa estabilidad.","Test sigue necesario.","No genera etiquetas.","No altera definición de métrica."]]
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
      ["Curvas comparables","Train suele incorporar augmentations y dropout; val no. Una pérdida train mayor que val no prueba por sí sola una fuga.","Registra también métricas sobre train en modo evaluación si necesitas una comparación directa."],
      ["Hipótesis","Train baja y val empeora sugiere sobreajuste o cambio de distribución. Ambas pérdidas altas pueden indicar optimización, capacidad o datos insuficientes.","Val extrañamente perfecta invita a revisar duplicados, grupos y fuga."],
      ["Experimento siguiente","Formula un cambio comprobable y conserva el mismo protocolo. Una galería de falsos positivos y negativos suele orientar mejor que solo una línea.","Congela test mientras experimentas; usa val para decidir."]
    ],
    takeaways:["Las curvas requieren condiciones de medición claras.","Una tendencia admite varias causas.","Revisa ejemplos de error y split."],
    questions:[
      ["Train con dropout y val sin él: val loss menor implica fuga siempre?",["No, las condiciones de medición difieren","Sí, necesariamente","Solo con Adam","Si es uint8"],0,["Correcto: compara en modo coherente antes de concluir.","No se deduce.","Optimizador no define ese efecto.","Dtype no basta."]],
      ["Val casi perfecta inesperada: primera comprobación útil",["Duplicados y grupos entre splits","Añadir capas","Mirar test cada época","Aumentar contraste visual"],0,["Correcto: fuga es una posibilidad seria.","No diagnostica origen.","Contamina test.","No resuelve protocolo."]],
      ["Para comparar un cambio, conviene...",["Mantener split y métrica","Cambiar todo a la vez","Evaluar solo train","Eliminar errores difíciles"],0,["Correcto: atribuyes diferencias con más claridad.","Impide interpretar efecto.","No mide generalización.","Sesga resultados."]]
    ],
    labTitle:"Lee la curva",labInstruction:"Cambia la época en una curva ilustrativa y observa cuándo val deja de mejorar.",
    source:["PyTorch · Optimization","https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html"]
  }
];
export const sectorEightLessons=buildSector(draft);
