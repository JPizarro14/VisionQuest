import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
  {
    id:"10.01",navTitle:"Multiclase y multietiqueta",title:"¿Una clase o varias a la vez?",
    objective:"Elegir salida y pérdida según etiquetas excluyentes o simultáneas.",
    lead:"Una foto puede ser «gato» o «perro», pero también «persona» y «bicicleta» a la vez.",
    keyIdea:"Multiclase excluyente suele usar softmax entre clases; multietiqueta permite sigmoid y umbral por clase.",
    sections:[
      ["Exclusión","Si cada ejemplo pertenece exactamente a una de K clases, una distribución softmax suma uno. Puede haber clase «ninguna» si la tarea la incluye.","Argmax elige la puntuación mayor, aunque todas las clases tengan evidencia débil."],
      ["Etiquetas simultáneas","En multietiqueta, cada clase es una decisión binaria y pueden activarse varias o ninguna.","Una sigmoid por clase no obliga a que las probabilidades sumen uno; el umbral puede variar por clase."],
      ["Etiquetas y métrica","Define cómo se anotan ausencias y casos ambiguos. Exact-match accuracy es severa si exige acertar todas las etiquetas de una muestra.","F1 micro/macro y métricas por clase revelan errores que un promedio global oculta."]
    ],
    takeaways:["Multiclase y multietiqueta no comparten necesariamente pérdida.","Softmax suma uno; sigmoid independiente no.","Decide qué hacer con «ninguna» y ambigüedad."],
    questions:[
      ["Una foto contiene persona y bicicleta. ¿Qué formulación permite ambas?",["Multiclase exclusiva","Multietiqueta","Regresión de profundidad","Umbral Otsu"],1,["Solo elegiría una.","Correcto: dos etiquetas simultáneas.","No son distancias.","No reconoce clases."]],
      ["Dos sigmoid independientes pueden sumar...",["Exactamente uno siempre","Más o menos de uno","Siempre cero","Igual que IoU"],1,["No están acopladas.","Correcto: cada salida es independiente.","Pueden ser positivas.","No es una métrica de solapamiento."]],
      ["En multiclase exclusiva, argmax...",["Elige puntuación mayor","Garantiza certeza","Da IoU","Calibra el modelo"],0,["Correcto: compara logits o scores.","Puede elegir entre opciones malas.","No hay regiones.","No calibra."]]
    ],
    labTitle:"Activa etiquetas",labInstruction:"Cambia el umbral para dos puntuaciones independientes.",
    source:["scikit-learn · Multilabel classification","https://scikit-learn.org/stable/modules/multiclass.html"]
  },
  {
    id:"10.02",navTitle:"Puntuación y umbral",title:"Pasar de score a decisión",
    objective:"Diferenciar ranking, probabilidad calibrada y corte operativo.",
    lead:"Un modelo devuelve una puntuación; la decisión de inspeccionar o ignorar exige una regla.",
    keyIdea:"Mover el umbral cambia positivos predichos y tradeoff de errores; calibración y umbral responden preguntas distintas.",
    sections:[
      ["Score no es clase","Un logit puede transformarse con sigmoid, pero la salida no está necesariamente calibrada.","Un umbral de 0,5 es una convención posible, no siempre la decisión óptima."],
      ["Costes","Si perder un defecto cuesta mucho, quizá se use un umbral menor y se acepten más falsas alarmas.","El umbral se elige en validación con costes y capacidad operativa, nunca ajustándolo repetidamente en test."],
      ["Ranking y decisión","Un modelo puede ordenar casos correctamente pero ofrecer probabilidades mal calibradas. Cambiar umbral no reentrena la representación.","Registra prevalencia y distribución de scores al trasladar el sistema a producción."]
    ],
    takeaways:["Score, probabilidad y decisión son cosas distintas.","El umbral expresa costes.","Elige umbral sin tocar test."],
    questions:[
      ["Bajar el umbral suele...",["Aumentar positivos predichos","Reducir todos los positivos","Cambiar etiquetas reales","Asegurar calibración"],0,["Correcto: más scores lo superan.","Ocurre lo contrario.","Ground truth no cambia.","No corrige probabilidades."]],
      ["Un score sigmoid 0,8 significa necesariamente 80% de acierto?",["Sí","No, requiere evaluar calibración","Solo en RGB","Solo con batch grande"],1,["Puede estar descalibrado.","Correcto: compara frecuencia real entre casos de score semejante.","No depende de canales.","Batch no garantiza calibración."]],
      ["¿Dónde eliges el umbral operativo?",["Validación representativa","Test final en cada experimento","Train loss únicamente","Por estética"],0,["Correcto: incorpora costes y prevalencia.","Sesga test.","No expresa decisión real.","No es evidencia."]]
    ],
    labTitle:"Mueve el umbral",labInstruction:"Cambia el umbral sobre cinco puntuaciones y cuenta decisiones positivas.",
    source:["scikit-learn · Threshold tuning","https://scikit-learn.org/stable/modules/classification_threshold.html"]
  },
  {
    id:"10.03",navTitle:"Matriz de confusión",title:"Poner nombre a cada error",
    objective:"Leer TP, FP, FN y TN en una clase positiva definida.",
    lead:"La palabra «positivo» depende de la tarea. Si es «defecto», un falso negativo es una pieza defectuosa que pasó inadvertida.",
    keyIdea:"TP y FN parten de positivos reales; FP y TN de negativos reales. Cambiar umbral altera columnas de predicción, no etiquetas verdaderas.",
    sections:[
      ["Cuatro casillas","TP=defecto detectado, FN=defecto omitido, FP=alarma sobre pieza buena, TN=pieza buena descartada.","Escribe siempre qué clase se considera positiva; de otro modo los nombres se invierten."],
      ["Conteos antes de porcentajes","Con 10 defectos, detectar 8 da 8 TP y 2 FN. Si hay 90 buenas y 9 falsas alarmas, hay 9 FP y 81 TN.","Accuracy=(TP+TN)/total puede ser alta aunque el sistema ignore una clase rara."],
      ["Multiclase","Una matriz K×K muestra etiquetas reales frente a predichas según la convención elegida. Las métricas por clase usan una clase frente al resto.","Revisa normalización por filas/columnas antes de comparar gráficos."]
    ],
    takeaways:["Define clase positiva.","TP+FN es número real positivo.","Accuracy puede ocultar fallos de clase rara."],
    questions:[
      ["Pieza defectuosa predicha como buena:",["FP","FN","TP","TN"],1,["FP sería buena con alarma.","Correcto: positivo real omitido.","TP sería detectado.","TN es buena descartada."]],
      ["TP=8 y FN=2: positivos reales",["6","8","10","16"],2,["No se restan.","Faltan omitidos.","Correcto: 8+2=10.","No corresponde."]],
      ["¿Qué cambia al mover umbral con etiquetas fijas?",["Predicciones y sus casillas","La verdad terreno","El número de pacientes","La resolución"],0,["Correcto: algunos casos cruzan el corte.","No debe cambiar.","El dataset es el mismo.","No hay resize."]]
    ],
    labTitle:"Cuenta cuatro casos",labInstruction:"Cambia un falso negativo en un conjunto fijo y calcula TP, FN, FP y TN.",
    source:["scikit-learn · Confusion matrix","https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html"]
  },
  {
    id:"10.04",navTitle:"Precision, recall y F1",title:"Dos denominadores que no debes cambiar",
    objective:"Calcular métricas y distinguir alarma fiable de cobertura.",
    lead:"Precision pregunta qué parte de las alarmas es real. Recall pregunta qué parte de los defectos reales encontramos.",
    keyIdea:"Precision=TP/(TP+FP), recall=TP/(TP+FN), F1=2PR/(P+R) si los denominadores son válidos.",
    sections:[
      ["Cuentas concretas","Con TP=8, FP=2 y FN=2, precision=0,8, recall=0,8 y F1=0,8.","Con denominador cero, la métrica requiere una convención explícita de la biblioteca o del informe."],
      ["Mover umbral","Bajar umbral tiende a elevar recall y también FP; precision puede cambiar según distribución de scores y prevalencia.","No hay relación monótona universal para precision al cambiar cada punto."],
      ["F1 no conoce costes","F1 pondera armónicamente P y R, pero omite TN y no incorpora directamente coste económico.","Si FP y FN tienen costes muy distintos, evalúa utilidad o restricciones además de F1."]
    ],
    takeaways:["Precision usa positivos predichos.","Recall usa positivos reales.","F1 no resume todos los costes."],
    questions:[
      ["TP=8, FP=2: precision",["0,8","1","0,2","0,5"],0,["Correcto: 8/10.","Hay FP.","Eso es proporción FP.","No corresponde."]],
      ["TP=8, FN=2: recall",["0,8","0,2","1","0,5"],0,["Correcto: 8/10.","Eso es omisión.","Hay dos defectos omitidos.","No corresponde."]],
      ["¿Qué no usa F1 directamente?",["TN","TP","FP","FN"],0,["Correcto: combina P y R, donde no entra TN.","Sí aparece.","Sí afecta precision.","Sí afecta recall."]]
    ],
    labTitle:"Equilibra P y R",labInstruction:"Cambia FP con TP=8 y FN=2 y calcula precision, recall y F1.",
    source:["scikit-learn · Precision/Recall/F-score","https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_fscore_support.html"]
  },
  {
    id:"10.05",navTitle:"ROC y PR",title:"Mirar todos los umbrales",
    objective:"Interpretar curvas ROC y precisión-recall en clases raras.",
    lead:"Una curva resume cómo cambia el sistema al recorrer umbrales, sin obligarte a elegir 0,5 de antemano.",
    keyIdea:"ROC cruza TPR y FPR; PR cruza precision y recall. En poblaciones muy desbalanceadas, PR muestra claramente la carga de falsas alarmas.",
    sections:[
      ["Dos ejes","TPR=recall=TP/(TP+FN); FPR=FP/(FP+TN). ROC traza esas tasas.","PR traza precision frente a recall; su línea base depende de prevalencia de positivos."],
      ["Área no decide umbral","ROC AUC y average precision resumen rankings de maneras distintas. Una puntuación global no escoge el punto operativo.","Dos curvas pueden cruzarse; el coste en un rango específico de FPR puede importar más que el área."],
      ["Clase rara","Con muchos negativos, un FPR de 1% puede producir numerosas falsas alarmas absolutas. Informa conteos y precision a prevalencia real.","Comparar PR entre datasets con prevalencias distintas exige cuidado."]
    ],
    takeaways:["ROC usa FPR; PR usa precision.","Área no escoge umbral.","Prevalencia afecta lectura de PR."],
    questions:[
      ["FPR es...",["FP/(FP+TN)","FP/(FP+TP)","TP/(TP+FN)","FN/(TP+FN)"],0,["Correcto: proporción de negativos reales alarmados.","Ese denominador define precision complementaria.","Es recall.","Es tasa de omisión."]],
      ["Una ROC AUC alta determina automáticamente umbral óptimo?",["Sí","No, faltan costes y restricciones","Solo en RGB","Solo en test pequeño"],1,["Resume ranking, no decisión.","Correcto: el punto depende del uso.","No depende de canales.","Tamaño no lo resuelve."]],
      ["Con 100.000 negativos, FPR 1% significa...",["Unas 1.000 falsas alarmas","Una falsa alarma","Cero errores","Precision 99%"],0,["Correcto: 1% de 100.000.","Es mucho más.","No son cero.","Falta conocer TP."]]
    ],
    labTitle:"Cuenta falsas alarmas",labInstruction:"Cambia FPR con 100.000 negativos y observa el número absoluto de FP.",
    source:["scikit-learn · ROC and PR metrics","https://scikit-learn.org/stable/modules/model_evaluation.html"]
  },
  {
    id:"10.06",navTitle:"Calibración",title:"Que 0,8 signifique algo",
    objective:"Distinguir ranking de calibración y leer una curva por bins.",
    lead:"Si cien casos reciben alrededor de 0,8, una calibración buena espera alrededor de ochenta positivos, dentro de incertidumbre.",
    keyIdea:"Calibrar compara probabilidad predicha y frecuencia observada; necesita datos independientes del ajuste del clasificador.",
    sections:[
      ["Bins de confianza","Agrupa predicciones por score y compara media predicha con fracción positiva real. Una curva diagonal indica buena calibración en esos bins.","Binning y muestras escasas pueden producir oscilaciones; muestra tamaños e incertidumbre."],
      ["Ranking distinto","Una transformación monótona puede conservar el orden de casos y alterar probabilidades. Un modelo con AUC alta puede estar descalibrado.","Brier score y log loss evalúan aspectos probabilísticos, pero la decisión final también usa costes."],
      ["Ajustar sin fuga","Platt/sigmoid o isotonic pueden calibrar usando un conjunto apropiado que no sea el mismo con que ajustaste el modelo sin control.","Revisa de nuevo al cambiar prevalencia o distribución."]
    ],
    takeaways:["Calibración compara score con frecuencia.","Ranking y calibración no son lo mismo.","Usa datos separados para calibrar."],
    questions:[
      ["100 casos con score ≈0,8, 40 positivos reales. ¿Qué sugiere?",["Exceso de confianza en ese bin","Calibración perfecta","Recall de 0,8","IoU 0,4"],0,["Correcto: predice 80% y ocurre 40%.","La frecuencia no coincide.","Recall requiere FN.","No hay regiones."]],
      ["¿Puede AUC alta coexistir con mala calibración?",["Sí","No","Solo si hay máscaras","Solo si no hay test"],0,["Correcto: orden y probabilidad son propiedades distintas.","Una transformación monótona puede conservar ranking.","No depende de máscaras.","El fenómeno es posible igual."]],
      ["¿Dónde ajustas un calibrador?",["En datos apropiados reservados o validación cruzada","En test final repetidamente","Solo con train labels filtradas en test","Sin etiquetas"],0,["Correcto: evita fuga del test.","Sesga evaluación.","Contamina particiones.","Necesita observar resultados."]]
    ],
    labTitle:"Contrasta confianza",labInstruction:"Cambia frecuencia observada de un grupo con predicción media 0,8.",
    source:["scikit-learn · Probability calibration","https://scikit-learn.org/stable/modules/calibration.html"]
  },
  {
    id:"10.07",navTitle:"Costes y desbalance",title:"La mejor métrica depende del daño",
    objective:"Relacionar FP/FN, prevalencia, capacidad de revisión y umbral.",
    lead:"Un sistema que envía diez mil alarmas a un inspector puede ser inviable aunque su recall parezca excelente.",
    keyIdea:"La decisión se evalúa con conteos y coste esperado, no solo accuracy o F1; prevalencia cambia valor predictivo.",
    sections:[
      ["Matriz de costes","Un coste ilustrativo puede ser C=FP·c_FP + FN·c_FN. Necesitas acordar unidades y consecuencias reales.","Si un falso negativo es diez veces más costoso, el umbral que minimiza C puede diferir del que maximiza F1."],
      ["Capacidad","También puede existir un límite de alarmas diarias, y entonces precision@k o recall bajo presupuesto importan.","Cuenta falsos positivos en población completa, no solo en un test balanceado."],
      ["Cambio de prevalencia","Si la proporción de defectos cambia, precision puede cambiar aunque sensibilidad y especificidad se mantengan.","Monitoriza distribución y recalibra la política con datos recientes, sin usar etiquetas futuras indisponibles."]
    ],
    takeaways:["Coste esperado incorpora impacto de errores.","Capacidad de revisión es una restricción.","Prevalencia modifica precision."],
    questions:[
      ["FP=4, FN=2, coste FP=1, FN=10. ¿Coste?",["24","6","42","10"],0,["Correcto: 4·1+2·10=24.","Solo suma conteos.","Invierte costes.","Ignora FP y un FN."]],
      ["Bajar prevalencia suele afectar precision...",["Puede reducirla con mismas tasas de error","La garantiza constante","La vuelve recall","Elimina FN"],0,["Correcto: alarmas falsas pesan más entre alarmas.","El denominador cambia.","Son métricas distintas.","No cambia esa tasa automáticamente."]],
      ["Límite de 100 alarmas/día invita a medir...",["Rendimiento bajo ese presupuesto","Solo train loss","Solo tamaño del modelo","Solo número de clases"],0,["Correcto: la restricción es operativa.","No cuenta alarmas.","No mide calidad.","No basta."]]
    ],
    labTitle:"Pon precio al error",labInstruction:"Cambia el coste de FN con FP=4 y FN=2.",
    source:["scikit-learn · Model evaluation","https://scikit-learn.org/stable/modules/model_evaluation.html"]
  },
  {
    id:"10.08",navTitle:"Explicabilidad prudente",title:"Un mapa de calor no es una prueba",
    objective:"Interpretar Grad-CAM como pista y comprobar fallos espurios.",
    lead:"Un mapa sobre la zona del tumor puede parecer convincente, pero la red podría depender también de marcas de hospital o bordes de escáner.",
    keyIdea:"Grad-CAM combina gradientes y mapas de características para una localización aproximada de evidencia de clase; no demuestra causalidad ni calidad de segmentación.",
    sections:[
      ["Qué produce","El mapa depende de la clase y de la capa elegida, suele ser de baja resolución y se interpola para superponerlo en la imagen.","Una zona iluminada indica sensibilidad según el método, no una máscara exacta del objeto."],
      ["Comprobaciones","Prueba oclusiones, cambios de fondo, datos de otro centro y casos incorrectos. Si el modelo depende de una esquina con texto, hay una hipótesis de atajo.","Un mapa agradable no reemplaza un experimento sobre desempeño fuera de distribución."],
      ["Límites","Distintos métodos de explicación pueden discrepar y ser sensibles a preprocesado. Documenta configuración y evita atribuir intenciones al modelo.","Para una tarea médica o crítica, interpreta junto con métricas, revisión experta y errores por subgrupo."]
    ],
    takeaways:["Grad-CAM da localización aproximada.","No equivale a segmentación ni causalidad.","Contrasta explicaciones con pruebas de perturbación."],
    questions:[
      ["Un Grad-CAM colorea un área. ¿Qué prueba por sí solo?",["Que el área es la máscara verdadera","Una pista sobre evidencia según ese método","Causalidad demostrada","F1 alto"],1,["No es ground truth.","Correcto: interpretación limitada.","La superposición no lo prueba.","No evalúa dataset."]],
      ["Si un mapa resalta texto del hospital, harías...",["Probar dependencia espuria y datos de otro centro","Publicar sin revisión","Borrar el test","Subir brillo"],0,["Correcto: verifica el atajo con experimentos.","Podría fallar al cambiar origen.","Pierdes evaluación.","No aborda causalidad."]],
      ["¿Puede la capa elegida cambiar el mapa?",["Sí","No, es matemáticamente idéntico","Solo con JPEG","Solo con clases raras"],0,["Correcto: distinta resolución y representación.","El método usa activaciones elegidas.","No depende del contenedor así.","Puede ocurrir con cualquier clase."]]
    ],
    labTitle:"Perturba un atajo",labInstruction:"Cambia cuánto influye un marcador espurio en una puntuación de juguete.",
    source:["Selvaraju et al. · Grad-CAM","https://arxiv.org/abs/1610.02391"]
  }
];
export const sectorTenLessons=buildSector(draft);
