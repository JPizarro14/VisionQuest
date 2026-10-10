import { buildSector, type DraftLesson } from "@/app/sector-builder";

const draft: DraftLesson[] = [
  {
    id:"06.01", navTitle:"Definir la tarea", title:"Antes del modelo: ¿qué predices?",
    objective:"Distinguir unidad de predicción, entrada, etiqueta y criterio de éxito.",
    lead:"Una imagen puede pedir una clase, una caja, una máscara o una medida. Especificar la salida correcta evita entrenar el problema equivocado.",
    keyIdea:"La unidad de predicción y la etiqueta deben corresponder a la decisión que se tomará en uso real.",
    sections:[
      ["Una decisión concreta","Clasificar una imagen como defectuosa no localiza la grieta. Si la acción requiere marcar dónde está, necesitas anotaciones y salida espacial, aunque un clasificador global obtenga buena accuracy.","Define qué recibe el sistema, qué entrega, cuándo se evalúa y cuánto cuesta cada error. Una métrica sin ese contexto puede favorecer la solución equivocada."],
      ["De muestra a etiqueta","Una muestra puede ser una foto, un frame, un paciente o una pieza. Una etiqueta puede ser de imagen completa o de una región; confundir niveles introduce supervisión débil o información falsa.","Si varias fotos representan la misma pieza, son observaciones relacionadas. Registra identificadores de origen para separarlas al evaluar."],
      ["Línea base antes de complejidad","Un umbral, un histograma o un modelo clásico sencillo ofrecen una referencia. Un modelo más grande debe justificar su mejora frente a coste, latencia y errores críticos.","Escribe un protocolo de evaluación antes de elegir arquitectura: conjunto independiente, métricas y casos difíciles."],
    ],
    takeaways:["La salida debe servir a la decisión real.","La unidad de muestra determina cómo dividir datos.","Una línea base convierte la mejora en una afirmación medible."],
    questions:[
      ["Quieres señalar la posición de cada grieta. ¿Qué salida responde mejor?",["Una etiqueta por imagen","Cajas o máscaras localizadas","Solo la media de brillo","El nombre del archivo"],1,["No dice dónde está la grieta.","Correcto: la salida conserva localización.","Puede ayudar como feature, pero no localiza por sí sola.","No es una predicción visual."]],
      ["Cinco fotos de la misma pieza son...",["Cinco observaciones relacionadas","Cinco piezas independientes","Siempre cinco clases","Cinco píxeles"],0,["Correcto: comparten origen y pueden generar fuga si se separan al azar.","El origen es el mismo.","Clase y muestra son conceptos distintos.","Cada foto contiene muchos píxeles."]],
      ["¿Para qué sirve una línea base simple?",["Para demostrar que no hace falta test","Para tener una referencia de rendimiento y coste","Para reemplazar siempre a una CNN","Para eliminar las etiquetas"],1,["La evaluación sigue siendo necesaria.","Correcto: permite medir si la complejidad aporta algo.","Puede ser superada de forma justificada.","También necesita verdad terreno para compararse."]],
    ], labTitle:"Decide la salida", labInstruction:"Cambia el tamaño mínimo del defecto y compara una regla global con una decisión localizada.",
    source:["scikit-learn · Supervised learning","https://scikit-learn.org/stable/supervised_learning.html"],
  },
  {
    id:"06.02", navTitle:"Dividir sin fuga", title:"La prueba debe ser realmente nueva",
    objective:"Evitar que tiles, pacientes o piezas relacionados crucen de train a test.",
    lead:"Un modelo puede parecer brillante porque ya ha visto casi la misma escena. Dividir filas aleatoriamente no asegura independencia.",
    keyIdea:"Agrupa por la unidad que se repetirá en uso real; cualquier preprocesado aprendido se ajusta solo con entrenamiento.",
    sections:[
      ["La fuga por parentesco","Dos tiles vecinos de una misma foto comparten luz, textura y fondo. Si uno cae en train y otro en test, el test puede medir memoria de escena en vez de generalización.","Usa grupos por imagen, sujeto, pieza o sesión según el dominio. Una división temporal puede ser más realista cuando cambian cámaras o condiciones."],
      ["La fuga de estadísticas","Calcular media, desviación, PCA o selección de variables sobre todo el dataset antes de dividir deja entrar información del test en la transformación.","Primero separa. Ajusta cada transformación en train y aplícala sin reajustar a validación y test. Un pipeline encadena esas operaciones en la partición correcta."],
      ["Diagnosticar parecidos","Busca duplicados, nombres de archivo correlacionados y metadatos que revelen la etiqueta. Examina los grupos y fechas en cada split.","Un test más difícil pero limpio es mejor guía para producción que uno artificialmente alto."],
    ],
    takeaways:["Separa por origen cuando hay muestras emparentadas.","Fita estadísticas solo en train.","La fuga infla métricas y no se arregla con más épocas."],
    questions:[
      ["Tiles de una misma resonancia están en train y test. ¿Qué riesgo aparece?",["Fuga de información entre particiones","Aumenta automáticamente la resolución","Desaparecen los falsos positivos","La clase se vuelve continua"],0,["Correcto: comparten características de origen.","No cambia el tamaño del píxel.","La evaluación puede parecer mejor sin mejorar los errores reales.","La etiqueta no cambia por dividir."]],
      ["¿Cuándo calculas la media para normalizar?",["Antes de dividir con todos los datos","Solo con train, y aplicas la misma a val/test","Con test y luego con train","Una media nueva por cada imagen siempre"],1,["Permite que test influya en el pipeline.","Correcto: los parámetros aprendidos no usan los datos de evaluación.","Invierte la relación correcta.","Esa es otra técnica, no reemplaza la regla de separación."]],
      ["Si tienes varios pacientes, ¿qué split suele evaluar generalización a pacientes nuevos?",["Aleatorio por píxel","Por paciente","Por tile sin grupos","Solo el primer frame"],1,["Los píxeles no son pacientes independientes.","Correcto: ningún paciente aparece en ambos lados.","Tiles hermanos pueden cruzar.","No define un conjunto de pacientes nuevos."]],
    ], labTitle:"Encuentra la fuga", labInstruction:"Modifica cuántos tiles de un mismo origen se mezclan entre train y test.",
    source:["scikit-learn · Common pitfalls","https://scikit-learn.org/stable/common_pitfalls.html"],
  },
  {
    id:"06.03", navTitle:"Train, validación y test", title:"Tres papeles para los datos",
    objective:"Separar ajuste de parámetros, elección de hiperparámetros y estimación final.",
    lead:"Si pruebas veinte configuraciones mirando siempre el test, ese test acaba formando parte de tu proceso de entrenamiento aunque nunca hagas backpropagation con él.",
    keyIdea:"Train ajusta parámetros; validación guía decisiones; test reservado estima rendimiento después de congelar el procedimiento.",
    sections:[
      ["Funciones diferentes","El entrenamiento aprende pesos o reglas. La validación compara opciones, decide parada y umbrales. El test se consulta al final, después de fijar modelo y protocolo.","Si vuelves a rediseñar el sistema después de mirar el test, necesitas reconocer que ya no es una estimación independiente de ese nuevo diseño."],
      ["Pocos datos","La validación cruzada rota los datos de entrenamiento entre pliegues para estimar sensibilidad a la partición. El test final sigue aparte si se necesita una evaluación final independiente.","Los pliegues deben respetar grupos o tiempo; un KFold ingenuo puede repetir exactamente la fuga que pretendías evitar."],
      ["Variabilidad","Un único porcentaje sin intervalo o distribución por grupos puede ocultar mucha incertidumbre. Registra tamaño, prevalencia y cambios entre particiones.","No ajustes mil hiperparámetros sobre un conjunto de validación diminuto y esperes que el mejor valor sea estable."],
    ],
    takeaways:["Test no es un panel de control para iterar.","La validación cruzada no elimina la necesidad de grupos correctos.","Repetir elecciones sobre los mismos datos también sobreajusta."],
    questions:[
      ["¿Dónde eliges el learning rate entre varios candidatos?",["En el test final","En validación","En el conjunto sin etiquetas","Por orden alfabético"],1,["Mirarlo repetidamente sesga el test.","Correcto: esa es una decisión de modelo.","Sin respuesta no puedes comparar rendimiento supervisado.","No es un criterio empírico."]],
      ["Después de ver el test, cambias umbral y vuelves a medir en él. ¿Qué ha pasado?",["El test dejó de ser completamente independiente","Mejoraste automáticamente la generalización","El test pasó a ser train por definición","No afecta a nada"],0,["Correcto: lo usaste para decidir.","Podrías haber ajustado solo a ese conjunto.","No entrenaste pesos, pero sí optimizaste una decisión con test.","La evaluación ya está condicionada."]],
      ["¿Qué exige cross-validation con varios pacientes?",["Mantener las fotos del mismo paciente en un mismo lado por pliegue","Mezclar sus tiles entre pliegues","Eliminar todos los pacientes raros","Ignorar etiquetas"],0,["Correcto: conserva independencia entre grupos.","Produce fuga.","Puede sesgar la población.","Las etiquetas siguen necesarias."]],
    ], labTitle:"Resiste la tentación del test", labInstruction:"Aumenta los intentos de configuración y observa cómo crece la oportunidad de seleccionar ruido.",
    source:["scikit-learn · Cross-validation","https://scikit-learn.org/stable/modules/cross_validation.html"],
  },
  {
    id:"06.04", navTitle:"Features y vecinos", title:"Una línea base con distancias",
    objective:"Construir features sencillas y entender la decisión por vecinos próximos.",
    lead:"Antes de entrenar una red, prueba a representar cada imagen con tamaño, brillo o textura y compara esas medidas con ejemplos etiquetados.",
    keyIdea:"k-NN asigna una clase a partir de los vecinos en espacio de features; la escala y la elección de features deciden qué significa «cerca».",
    sections:[
      ["Representar antes de comparar","Un vector como [área, intensidad media] comprime una imagen. Puede bastar para una tarea simple, pero pierde localización y estructuras que no estén codificadas.","Si área varía entre 0 y 10.000 y brillo entre 0 y 255, una distancia euclídea sin escalar puede quedar dominada por área."],
      ["Votar entre vecinos","Con k=1 decides según el ejemplo más cercano; con k mayor votan varios. Un k pequeño puede reaccionar mucho a ruido y uno grande puede suavizar fronteras útiles.","La votación puede ser uniforme o ponderada por distancia. Empates y regiones sin ejemplos cercanos merecen una regla explícita."],
      ["Coste y comprobación","k-NN guarda ejemplos y puede ser costoso al consultar muchos puntos; índices aproximados o reducción de datos cambian ese coste.","Valida escala, k y features con datos independientes. Una métrica alta por haber incluido el mismo paciente entre vecinos y test es fuga, no mérito del método."],
    ],
    takeaways:["Features definen lo que un modelo puede ver.","La escala afecta a distancias.","k controla sensibilidad local y suavizado."],
    questions:[
      ["Una feature varía 0–10000 y otra 0–1. ¿Qué problema tiene k-NN sin escalar?",["La primera puede dominar la distancia","Se vuelve una CNN","No puede tener etiquetas","Calcula IoU"],0,["Correcto: la magnitud numérica inclina la comparación.","k-NN sigue siendo k-NN.","Necesita ejemplos etiquetados para clasificar.","IoU no surge de distancia euclídea."]],
      ["¿Qué hace k=1 en k-NN?",["Vota todo train","Usa el vecino más próximo","Crea una nueva capa","Ajusta un margen máximo"],1,["Eso no es k=1.","Correcto: un solo ejemplo decide.","No es una red neuronal.","Eso se asocia a SVM."]],
      ["Un histograma global es una feature que...",["Conserva cada coordenada","Resume distribución y pierde ubicación","Da profundidad exacta","Garantiza robustez"],1,["El histograma no guarda mapa espacial.","Correcto: dos imágenes distintas pueden compartirlo.","No mide 3D.","Su utilidad depende de la tarea."]],
    ], labTitle:"Vota con k vecinos", labInstruction:"Cambia k y observa el voto de los puntos más próximos de una línea.",
    source:["scikit-learn · Nearest Neighbors","https://scikit-learn.org/stable/modules/neighbors.html"],
  },
  {
    id:"06.05", navTitle:"SVM y margen", title:"Una frontera con espacio de seguridad",
    objective:"Explicar margen, vectores de soporte y el papel de C sin prometer separación perfecta.",
    lead:"Separar dos clases con una línea no consiste solo en acertar los ejemplos disponibles; una frontera con más espacio alrededor puede generalizar mejor.",
    keyIdea:"Una SVM de margen blando equilibra amplitud del margen y penalización por violaciones; C controla ese compromiso, no la calidad garantizada.",
    sections:[
      ["Los puntos que importan","Los vectores de soporte están sobre o dentro de la zona que determina la frontera. Mover un ejemplo lejano suele no cambiar la solución tanto como mover uno cercano al margen.","Escalar features es importante porque la geometría del margen depende de sus unidades."],
      ["Margen blando","Si las clases se solapan, exigir separación perfecta puede ser imposible o sobreajustar. C grande penaliza más violaciones; C pequeño permite más a cambio de regularización.","Ni un C grande ni un kernel sofisticado reemplazan un test limpio. La elección se hace con validación."],
      ["Kernel sin magia","Un kernel permite una frontera no lineal en el espacio original mediante semejanzas. Puede capturar patrones útiles, pero cambia coste y sensibilidad a parámetros.","Las puntuaciones de decisión de una SVM no son probabilidades calibradas por definición."],
    ],
    takeaways:["El margen depende de la escala de features.","C grande penaliza más violaciones.","La salida de decisión no es probabilidad automáticamente."],
    questions:[
      ["¿Qué ejemplos influyen especialmente en la frontera SVM?",["Los cercanos al margen","Solo los del test","Solo los de brillo máximo","Todos exactamente igual"],0,["Correcto: los vectores de soporte.","El test no ajusta la frontera.","Brillo no determina por sí solo influencia.","Los puntos lejanos pueden no definir el margen."]],
      ["En una SVM de margen blando, C grande tiende a...",["Penalizar más las violaciones","Eliminar todas las features","Aumentar siempre el margen","Convertir scores en probabilidades"],0,["Correcto: el optimizador tolera menos errores de entrenamiento.","No cambia el número de features así.","Puede estrechar el margen para ajustar más.","La calibración es otra operación."]],
      ["¿Por qué escalar features antes de SVM?",["Porque el margen depende de distancias y unidades","Porque necesita imágenes cuadradas","Porque reduce clases","Porque altera el ground truth"],0,["Correcto: unidades desiguales deforman la geometría.","No exige esa forma.","Las clases siguen siendo las mismas.","No debes cambiar etiquetas."]],
    ], labTitle:"Ajusta el margen", labInstruction:"Cambia la penalización y observa un compromiso ilustrativo entre margen y violaciones.",
    source:["scikit-learn · Support Vector Machines","https://scikit-learn.org/stable/modules/svm.html"],
  },
  {
    id:"06.06", navTitle:"Árboles y ensambles", title:"Reglas que parten el espacio",
    objective:"Entender splits de árbol y por qué profundidad y ensambles afectan varianza.",
    lead:"Un árbol puede preguntar «¿área > 20?» y luego «¿brillo < 80?». Sus reglas son fáciles de inspeccionar, pero crecer sin control puede memorizar accidentes.",
    keyIdea:"Los árboles particionan espacio de features; limitar complejidad o agregar varios reduce algunos tipos de sobreajuste sin garantizar justicia o robustez.",
    sections:[
      ["Cada nodo elige una pregunta","Una división busca reducir impureza o error en train. Una hoja predice según las muestras que llegan a ella; las fronteras de un árbol clásico son escalonadas y alineadas con ejes.","Una feature irrelevante puede recibir una división espuria si buscas lo suficiente sobre pocos datos."],
      ["Profundidad","Un árbol profundo puede ajustar train casi perfectamente y variar mucho al cambiar unas pocas muestras. Profundidad máxima, mínimo por hoja o poda limitan esa complejidad.","Un árbol demasiado pequeño también puede no captar la relación real: hay que comparar en validación."],
      ["Votar con varios árboles","Un random forest entrena árboles variados y agrega sus votos, lo que suele estabilizar predicciones frente a un árbol individual. No recupera una señal ausente de las features.","La importancia de variables estimada por árboles puede ser engañosa con features correlacionadas; no la confundas con causalidad."],
    ],
    takeaways:["Árbol = reglas condicionales sobre features.","La profundidad controla capacidad y fragilidad.","Un ensamble puede reducir variación, no inventar información."],
    questions:[
      ["¿Qué indica una hoja de árbol?",["Un grupo de muestras con una predicción","Una coordenada de cámara","Un pixel individual siempre","Una convolución"],0,["Correcto: es el resultado de una secuencia de reglas.","Es otro modelo.","Puede incluir muchas muestras.","No es una operación de filtro."]],
      ["Train casi perfecto y validación mala en un árbol muy profundo sugiere...",["Sobreajuste","Fuga arreglada","Que faltan más hojas","Accuracy perfecta en producción"],0,["Correcto: memorizó patrones particulares.","No se deduce que la fuga esté resuelta.","Más hojas suelen aumentar capacidad.","Validación advierte lo contrario."]],
      ["¿Qué aporta típicamente un random forest frente a un solo árbol?",["Agregación de árboles variados","Anotación automática perfecta","Profundidad física","IoU sin cajas"],0,["Correcto: promedia o vota para reducir variación.","Sigue necesitando datos etiquetados.","No mide 3D.","IoU requiere regiones."]],
    ], labTitle:"Profundidad y fragilidad", labInstruction:"Aumenta complejidad y compara error ilustrativo en train y validación.",
    source:["scikit-learn · Decision Trees","https://scikit-learn.org/stable/modules/tree.html"],
  },
  {
    id:"06.07", navTitle:"Sesgo y varianza", title:"Ni demasiado simple ni demasiado flexible",
    objective:"Relacionar capacidad con errores de train y validación sin tomar las curvas como ley universal.",
    lead:"Una regla rígida puede fallar en todos los datos; un modelo muy flexible puede aprender cada pequeña irregularidad de train. La evaluación revela qué régimen domina.",
    keyIdea:"El sesgo y la varianza ofrecen un marco de diagnóstico; las curvas observadas dependen de datos, regularización y protocolo, no solo del tamaño del modelo.",
    sections:[
      ["Infraajuste","Si tanto train como validación fallan, puede faltar capacidad, información o una formulación correcta. Añadir capas no es la única respuesta: revisa etiquetas y features.","El error de entrenamiento alto no prueba por sí solo que sea sesgo puro; optimización insuficiente también puede explicarlo."],
      ["Sobreajuste","Una brecha grande entre train bajo y validación alta sugiere memorizar detalles específicos. Más datos independientes, regularización, augmentations válidas o simplificación son experimentos posibles.","La fuga también puede esconder el problema, dando una validación falsamente buena."],
      ["Cambiar una cosa cada vez","Registra hipótesis y compara en el mismo protocolo. Las curvas de aprendizaje al aumentar datos o capacidad ayudan a decidir dónde invertir esfuerzo.","No elijas un modelo solo por minimizar el error en train: esa curva premia memorizar."],
    ],
    takeaways:["Train alto + val alto exige diagnóstico de capacidad, datos y optimización.","Train bajo + val alto sugiere sobreajuste.","Los patrones son pistas, no diagnósticos automáticos."],
    questions:[
      ["Train bajo y validación mucho peor. ¿Primera hipótesis razonable?",["Sobreajuste o diferencia de distribución","Éxito garantizado","Que el test debe entrenarse","Menos datos siempre"],0,["Correcto: investiga brecha y partición.","El rendimiento fuera de train importa.","Contamina la evaluación.","Menos datos puede agravar varianza."]],
      ["Train y validación altos. ¿Qué revisarías?",["Formulación, features y optimización además de capacidad","Solo el color del gráfico","Borrar validación","Duplicar train en test"],0,["Correcto: varias causas pueden producir esa señal.","No altera el modelo.","Pierdes medida independiente.","Crea fuga."]],
      ["¿Por qué no optimizar únicamente el error de train?",["Porque puede premiar memorizar","Porque train no tiene etiquetas","Porque siempre es mayor que val","Porque no existe regularización"],0,["Correcto: la meta es generalizar.","En aprendizaje supervisado suele tenerlas.","No hay esa relación universal.","La regularización puede aplicarse."]],
    ], labTitle:"Dibuja la brecha", labInstruction:"Cambia capacidad y observa un ejemplo de error train/validación, sin tomarlo como ley universal.",
    source:["scikit-learn · Validation curves","https://scikit-learn.org/stable/modules/learning_curve.html"],
  },
  {
    id:"06.08", navTitle:"Elegir una línea base", title:"Decide con datos, no con prestigio",
    objective:"Comparar líneas base bajo un mismo protocolo y reconocer incertidumbre en muestras pequeñas.",
    lead:"Un modelo clásico puede ganar a una red si hay pocos ejemplos y features adecuadas. También puede perder cuando la información espacial no cabe en sus resúmenes.",
    keyIdea:"Compara métodos con los mismos grupos, datos y métricas; reserva un test final y analiza errores relevantes para el uso.",
    sections:[
      ["Misma pista para todos","Si un método recibe recortes mejores, más datos o un umbral afinado sobre test, la comparación deja de atribuirse solo al algoritmo.","Usa pipelines independientes pero un protocolo común de split y métrica, con ajustes sobre validación."],
      ["Mira más que el promedio","Desglosa resultados por cámara, paciente o condición. Un promedio puede ocultar un grupo con fallos inaceptables.","El coste de inferencia, memoria y mantenimiento importa cuando dos sistemas rinden de forma parecida."],
      ["Conclusión provisional","En conjuntos pequeños una diferencia de uno o dos errores puede mover mucho el porcentaje. Informa conteos y variabilidad antes de declarar ganador.","La elección es una hipótesis revisable; monitoriza el sistema cuando cambien los datos."],
    ],
    takeaways:["Un protocolo compartido hace comparables los métodos.","Compara también subgrupos y coste.","Diferencias pequeñas con pocas muestras son inciertas."],
    questions:[
      ["Modelo A usa test para ajustar umbral y B no. ¿Es justa la comparación?",["No: A aprovechó información del test","Sí, porque ambos usan imágenes","Sí, si A es una CNN","No importa el umbral"],0,["Correcto: los procedimientos de selección son distintos.","Compartir imágenes no corrige la fuga.","La arquitectura no cambia la regla.","El umbral puede cambiar métricas mucho."]],
      ["Dos modelos empatan en F1 global pero uno falla en una cámara concreta. ¿Qué haces?",["Analizas rendimiento por cámara","Miras solo el promedio","Eliminas esa cámara del informe","Sustituyes F1 por train loss"],0,["Correcto: el caso de uso puede depender de ese grupo.","Oculta el fallo.","Sesga la conclusión.","La pérdida de train no mide el problema operativo."]],
      ["Con un test de diez casos, una diferencia de un acierto es...",["Diez puntos porcentuales y potencialmente inestable","Una prueba definitiva","Cero puntos","Una mejora de latencia"],0,["Correcto: informa conteos e incertidumbre.","El tamaño es demasiado pequeño para tanta certeza.","1/10 = 10%.","No mide tiempo de inferencia."]],
    ], labTitle:"Compara con incertidumbre", labInstruction:"Cambia el tamaño del test y observa cuánto mueve un solo acierto el porcentaje.",
    source:["scikit-learn · Model selection","https://scikit-learn.org/stable/model_selection.html"],
  },
];

export const sectorSixLessons = buildSector(draft);
