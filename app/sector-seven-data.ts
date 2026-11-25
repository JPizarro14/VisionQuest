import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[] = [
  {
    id:"07.01",navTitle:"Neuronas y parámetros",title:"Una suma que puede aprender",
    objective:"Calcular una neurona y distinguir pesos, sesgo y activación.",
    lead:"La neurona combina entradas numéricas. Sus parámetros cambian durante el entrenamiento; su arquitectura decide cómo puede usarlas.",
    keyIdea:"La preactivación es z = w·x + b. Una activación no lineal transforma z; sin ella, apilar capas afines sigue dando una función afín.",
    sections:[
      ["Pesar cada entrada","Cada peso multiplica su entrada: su signo y magnitud determinan cómo contribuye a la suma. El sesgo se suma una sola vez y fija el valor de la preactivación cuando las entradas valen cero.","Para una entrada, z = wx + b. Con x=2, w=3 y b=−1, resulta z = 3·2 − 1 = 5."],
      ["Por qué activar","Componer matrices y sesgos sin activaciones se puede reducir a una sola transformación afín.","ReLU y otras activaciones permiten fronteras no lineales; la elección cambia el flujo de gradientes."],
      ["Salida y significado","En aprendizaje supervisado se compara la predicción con la etiqueta mediante una pérdida. La retropropagación calcula su gradiente y el optimizador actualiza pesos y sesgos para tratar de reducirla.","La salida sin normalizar de un clasificador puede ser un logit: admite cualquier valor real. Una sigmoide en clasificación binaria lo lleva al intervalo de probabilidades; su calibración se comprueba con datos representativos."]
    ],
    takeaways:["z combina entradas ponderadas y sesgo.","La activación introduce no linealidad.","Logit y probabilidad no son sinónimos."],
    questions:[
      ["Una neurona calcula z = wx + b antes de la activación. Si x=2, w=3 y b=−1, ¿cuánto vale z?",["5","6","7","3"],0,["Correcto: 3·2 + (−1) = 5.","Ese es el producto antes de sumar el sesgo.","El sesgo es negativo: resta uno, no lo suma.","El peso no multiplica al sesgo: se suma después del producto."]],
      ["Se encadenan dos capas afines, cada una con pesos y sesgo, sin activación entre ellas. ¿A qué equivale el conjunto?",["A una sola transformación afín","A una función cuadrática de la entrada","A una transformación necesariamente sin sesgo","A una rectificación de los valores negativos"],0,["Correcto: los pesos se multiplican entre sí y los sesgos se combinan en un único término constante.","La entrada no se multiplica por sí misma.","Los términos constantes no tienen por qué cancelarse.","Ninguna capa aplica una rectificación."]],
      ["En una neurona z = w·x + b con activación fija, ¿qué aprende el optimizador durante el entrenamiento habitual?",["Los pesos w y el sesgo b","Las entradas x y sus etiquetas","El número de componentes de x","La función de activación y el número de salidas"],0,["Correcto: son los parámetros ajustables que intervienen en la suma.","Las observaciones y etiquetas son los datos de ajuste.","El tamaño de la entrada está fijado por la arquitectura.","La activación y la estructura se han fijado antes de ajustar los pesos."]]
    ],
    labTitle:"Pesa la entrada",labInstruction:"Cambia w y calcula z y ReLU(z) para x=2 y b=−1.",
    source:["PyTorch · Build the Neural Network","https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html"]
  },
  {
    id:"07.02",navTitle:"Activaciones",title:"Doblar la respuesta",
    objective:"Comparar ReLU, sigmoid y softmax según el tipo de salida.",
    lead:"Una preactivación puede rectificarse, comprimirse entre cero y uno o compararse con otros logits.",
    keyIdea:"ReLU(z)=max(0,z); sigmoid actúa por logit; softmax normaliza un vector para que sus elementos sumen uno.",
    sections:[
      ["ReLU","La activación rectificada ReLU devuelve max(0, z): anula los negativos y deja intactos el cero y los positivos. En la rama negativa el gradiente local es cero.","Puede devolver valores mayores que uno y no normaliza entre clases; por sí sola no representa una probabilidad."],
      ["Sigmoid y softmax","Una sigmoide por etiqueta transforma cada puntuación por separado: varias etiquetas pueden recibir valores altos a la vez. Softmax normaliza las puntuaciones entre las clases de una decisión excluyente: al aumentar una, disminuye la proporción de las demás.","Ni estar entre cero y uno ni sumar uno demuestra calibración. Comprueba si las predicciones de confianza cercana a 0,9 aciertan aproximadamente el 90 % de las veces."],
      ["La API de pérdida","Para clases excluyentes, CrossEntropyLoss de PyTorch recibe las puntuaciones crudas (logits) y calcula internamente el logaritmo de softmax de forma numéricamente estable.","Si le pasas probabilidades, las interpreta como logits y vuelve a normalizarlas: la pérdida y los gradientes ya no corresponden a las puntuaciones originales."]
    ],
    takeaways:["ReLU rectifica, no calibra.","Sigmoid y softmax responden a supuestos distintos.","Verifica si la pérdida espera logits."],
    questions:[
      ["¿Qué devuelve la activación rectificada ReLU para una entrada de −3?",["0","−3","3","0,5"],0,["Correcto: max(0, −3) = 0.","ReLU no conserva la rama negativa.","Tomar el valor absoluto reflejaría el signo en lugar de anular el valor.","0,5 es la salida de una sigmoide en cero, no la rectificación de −3."]],
      ["Un clasificador asigna una puntuación a cada clase excluyente. ¿Qué operación las convierte en valores positivos cuya suma es uno?",["Rectificar cada puntuación con ReLU","Aplicar softmax al vector de puntuaciones","Aplicar una sigmoide por separado a cada puntuación","Restar la media de las puntuaciones"],1,["Rectificar no ajusta la suma y puede dar ceros.","Correcto: divide cada exponencial por la suma de las exponenciales de todas las clases.","Cada salida queda entre cero y uno, pero no se impone una suma común.","Centrarlas da suma cero, no una distribución entre clases."]],
      ["Un clasificador asigna 0,9 tras softmax a su clase ganadora. Sin datos de calibración, ¿qué puedes afirmar?",["Que acertará en nueve de cada diez casos semejantes","Que es una puntuación normalizada, no una frecuencia de acierto verificada","Que la clase ganadora es necesariamente la verdadera","Que las probabilidades de las demás clases valen cero"],1,["Esa correspondencia debe comprobarse con etiquetas representativas.","Correcto: para interpretar el 0,9 como confianza empírica, contrástalo con los aciertos en casos de puntuación similar.","Un modelo puede equivocarse con puntuación alta.","Las demás clases suman aproximadamente 0,1, no cero."]]
    ],
    labTitle:"Compara activaciones",labInstruction:"Mueve z y compara ReLU y sigmoid.",
    source:["PyTorch · Activations","https://docs.pytorch.org/docs/stable/nn.html#non-linear-activations"]
  },
  {
    id:"07.03",navTitle:"Capas y dimensiones",title:"Componer representaciones",
    objective:"Seguir shapes y contar parámetros de una capa densa.",
    lead:"Una capa transforma un vector en otro; sus tamaños tienen que encajar antes de que comience el entrenamiento.",
    keyIdea:"Linear(F,O) lleva (N,F) a (N,O) y contiene O·F pesos más O sesgos si bias está activado; aquí O es el número de salidas.",
    sections:[
      ["Shapes","Linear(4, 3) aplica la misma transformación a cada muestra. Un lote de forma (8, 4) conserva sus ocho muestras y sale con forma (8, 3).","En PyTorch la matriz de pesos tiene forma (salidas, entradas), aquí (3, 4). Con un sesgo por salida hay 3·4 + 3 = 15 parámetros; el lote no multiplica esa cifra."],
      ["Composición","Cada capa afín mezcla las características de la anterior. Una activación no lineal entre mezclas permite construir respuestas que una sola capa afín no podría expresar.","Más profundidad puede facilitar una representación útil, pero también encarece el ajuste y permite aprender particularidades del entrenamiento. Comprueba en validación si la capacidad añadida ayuda en casos nuevos."],
      ["Aplanar una imagen","Una imagen de altura H, anchura W y C canales se convierte en un vector de H·W·C valores. Ningún píxel desaparece, pero ya no hay ejes separados de fila y columna que hagan explícita la vecindad espacial.","Una capa densa con O salidas necesita O·H·W·C pesos más O sesgos. Duplicar altura y anchura cuadruplica los pesos si se mantienen canales y salidas; una convolución comparte su filtro entre posiciones."]
    ],
    takeaways:["Sigue la shape por capa.","Una capa F→O tiene O(F+1) parámetros con sesgo.","Aplanar oculta estructura espacial explícita."],
    questions:[
      ["En PyTorch, un lote de ocho muestras con cuatro características pasa por Linear(4, 3). En orden (muestras, características), ¿qué forma tiene la salida?",["(8, 3)","(3, 8)","(3, 4)","(8, 12)"],0,["Correcto: cada una de las ocho muestras produce tres valores.","Has invertido los ejes de lote y características.","Esa es la forma de los pesos, no la de la salida.","Doce es el número de pesos; cada muestra produce solo tres valores."]],
      ["Una capa densa tiene cuatro entradas, tres salidas y un sesgo por salida. ¿Cuántos parámetros entrenables tiene?",["12","15","7","3"],1,["Faltan los tres sesgos.","Correcto: son 4·3 pesos más 3 sesgos.","Las conexiones se cuentan multiplicando entradas por salidas, no sumándolas.","Solo has contado los sesgos."]],
      ["Al aplanar una imagen en un vector sin reordenar ni descartar valores, ¿qué deja de estar explícito en sus ejes?",["La vecindad en dos dimensiones","El número total de intensidades","El tipo numérico de los valores","El valor máximo de intensidad"],0,["Correcto: para reconstruir filas y columnas hace falta conocer la forma original.","La longitud del vector es el número de valores originales.","Cambiar la forma no convierte el tipo de dato.","El conjunto de valores no cambia y conserva su máximo."]]
    ],
    labTitle:"Cuenta parámetros",labInstruction:"Cambia O, el número de unidades de salida, y calcula parámetros y shape resultante.",
    source:["PyTorch · Linear","https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html"]
  },
  {
    id:"07.04",navTitle:"Pérdidas",title:"Penalizar la confianza equivocada",
    objective:"Leer cross-entropy y distinguirla de accuracy.",
    lead:"Dos modelos pueden acertar la misma clase y tener pérdidas distintas según la confianza que asignan.",
    keyIdea:"Para una clase verdadera con probabilidad p, la contribución de cross-entropy es −ln(p).",
    sections:[
      ["Probabilidad verdadera","Si p=0,8, la pérdida es aproximadamente 0,223. Si p=0,1, sube a 2,303.","Accuracy solo comprueba si la clase correcta gana; la pérdida conserva información de confianza."],
      ["Logits y estabilidad","Con una única clase verdadera por imagen, CrossEntropyLoss de PyTorch toma un vector de logits por imagen y, en el caso habitual, el índice entero de su clase. La normalización entre clases se calcula dentro de la pérdida.","En multietiqueta pueden coexistir varias clases: competir en un único softmax no refleja ese objetivo. Es habitual usar un indicador binario por etiqueta y BCEWithLogitsLoss sobre sus logits."],
      ["Objetivo y decisión","La pérdida de entrenamiento puntúa las salidas del modelo; no especifica cuánto cuesta una falsa alarma frente a una omisión en producción. Elige el umbral en validación según esos costes y los errores observados.","Una pérdida baja tampoco demuestra que, entre los casos con confianza 0,8, el 80 % sean aciertos. Comprueba esa correspondencia con datos representativos."]
    ],
    takeaways:["La pérdida penaliza baja probabilidad de la clase real.","Accuracy ignora confianza.","La entrada esperada por la API importa."],
    questions:[
      ["La pérdida para una imagen es −ln(p), donde p es la probabilidad asignada a su clase verdadera. ¿Qué valor de p da la menor pérdida?",["0,8","0,2","0,01","0,5"],0,["Correcto: −ln(0,8) ≈ 0,223; la pérdida baja al aumentar p.","−ln(0,2) ≈ 1,609, mayor que la pérdida con 0,8.","Una probabilidad tan baja para la clase verdadera recibe la mayor penalización de las cuatro.","−ln(0,5) ≈ 0,693, mayor que la pérdida con 0,8."]],
      ["Además de la etiqueta correcta, ¿qué salida de un clasificador multiclase se entrega a CrossEntropyLoss de PyTorch?",["El vector de puntuaciones crudas (logits)","El índice de la clase predicha","Las probabilidades después de softmax","Un vector que solo marca con uno la clase ganadora"],0,["Correcto: la pérdida calcula internamente un log-softmax estable.","El índice descarta las puntuaciones que necesita la pérdida.","Las volvería a normalizar como si fueran logits.","Marcar solo la clase ganadora elimina la información de confianza."]],
      ["Dos clasificadores aciertan exactamente las mismas imágenes. ¿Por qué puede diferir su entropía cruzada media?",["Asignan probabilidades distintas a las clases verdaderas","Tienen necesariamente distinta exactitud","La entropía cruzada solo cuenta errores de clase","La entropía cruzada divide por el número de parámetros"],0,["Correcto: −ln(p) depende de la probabilidad, no solo de qué clase gana.","Acertar las mismas imágenes implica igual proporción de aciertos.","El coste de cada caso varía con la confianza asignada a su clase real.","La media se toma sobre las muestras, no sobre los parámetros."]]
    ],
    labTitle:"Penaliza la confianza",labInstruction:"Cambia p de la clase real y observa −ln(p).",
    source:["PyTorch · CrossEntropyLoss","https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html"]
  },
  {
    id:"07.05",navTitle:"Backpropagation",title:"El error viaja hacia atrás",
    objective:"Aplicar regla de la cadena y distinguir gradiente de actualización.",
    lead:"Necesitamos saber cuánto cambia la pérdida si cambia un peso al principio de la red.",
    keyIdea:"Backprop multiplica derivadas locales a lo largo de una cadena y suma aportes de ramas que confluyen.",
    sections:[
      ["Forward y backward","El forward calcula activaciones y pérdida; el backward recorre el grafo para acumular derivadas respecto a parámetros.","Una derivada local cero corta su ruta. Muchos factores pequeños pueden atenuar una señal."],
      ["Pesos compartidos","Si un parámetro interviene en varias rutas, sus contribuciones se suman.","Los gradientes pueden acumularse entre lotes si no se limpian, deliberadamente o por error."],
      ["Actualizar después","En PyTorch, loss.backward() acumula las derivadas de la pérdida. optimizer.step() usa esos gradientes para modificar los parámetros; optimizer.zero_grad() limpia los gradientes anteriores para que no se mezclen con la siguiente acumulación.","El descenso básico resta al peso la tasa de aprendizaje multiplicada por su gradiente. Con una tasa positiva avanza en dirección opuesta al gradiente local."]
    ],
    takeaways:["Backprop organiza la regla de la cadena.","Ramas compartidas suman gradientes.","Gradiente y paso del optimizador son fases distintas."],
    questions:[
      ["En la cadena escalar w → z → y, sin otras rutas, dy/dz = 2 y dz/dw = 3. ¿Cuánto vale dy/dw?",["5","6","2/3","−6"],1,["Has sumado dos factores que están en serie.","Correcto: la regla de la cadena da (dy/dz)·(dz/dw) = 6.","Las derivadas locales se multiplican; no se dividen.","Ambos factores son positivos; aquí no se está actualizando un peso."]],
      ["En PyTorch, ¿qué hace loss.backward() al entrenar una red?",["Actualiza los pesos con la tasa de aprendizaje","Calcula y acumula los gradientes de la pérdida","Pone a cero los gradientes anteriores","Cambia la red al modo de evaluación"],1,["La actualización corresponde al paso del optimizador.","Correcto: recorre el grafo hacia atrás; por sí solo no cambia los pesos.","Para limpiar los gradientes se llama a zero_grad().","El modo de evaluación se activa con model.eval()."]],
      ["Un peso compartido influye en una pérdida por dos ramas. Las contribuciones al gradiente son 3 y −1. ¿Qué gradiente total recibe el peso?",["3","2","−3","1"],1,["Eso ignora la contribución negativa de la segunda rama.","Correcto: las rutas confluyen en el mismo parámetro, así que 3 + (−1) = 2.","La regla de la cadena multiplica factores en serie, no contribuciones de ramas paralelas.","No se promedian por el mero hecho de que haya dos ramas."]]
    ],
    labTitle:"Propaga una derivada",labInstruction:"Cambia un factor local y multiplica una cadena corta.",
    source:["PyTorch · Autograd","https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html"]
  },
  {
    id:"07.06",navTitle:"Optimizadores",title:"Dar pasos sobre la pérdida",
    objective:"Calcular SGD y entender tasa de aprendizaje.",
    lead:"El gradiente ofrece una dirección local; el optimizador decide el tamaño y la historia del paso.",
    keyIdea:"SGD básico actualiza w_nuevo = w − η·gradiente; η demasiado grande puede oscilar y demasiado pequeño avanzar lentamente.",
    sections:[
      ["Un paso","El descenso estocástico básico actualiza w restando la tasa por el gradiente. Con w=2, gradiente=3 y tasa 0,1, queda w = 2 − 0,1·3 = 1,7.","Con una tasa positiva y un gradiente negativo, restas un número negativo: el peso aumenta. Si el gradiente fuese −3, pasaría a 2,3."],
      ["Momentum y Adam","Momentum acumula una dirección a partir de los gradientes recientes. Adam estima tanto una media móvil del gradiente como una de su cuadrado; con ellas adapta la actualización de cada parámetro.","Compara con los mismos datos, presupuesto de ajuste y criterio de validación: de otro modo podrías atribuir al optimizador una ventaja que procede de más pasos o de una búsqueda más amplia."],
      ["Calendarios","Reducir la tasa más adelante permite dar pasos finos en una región de baja pérdida. Si la pérdida se dispara, comprueba si el paso es excesivo y examina la escala de entradas, activaciones y gradientes.","Localiza el primer lote que produce valores no finitos y repite en condiciones registradas. Bajar la tasa no corrige, por ejemplo, una entrada que ya contiene un valor no válido."]
    ],
    takeaways:["El signo del gradiente y η fijan un paso SGD.","Optimizadores usan distintas reglas.","Inspecciona estabilidad y validación."],
    questions:[
      ["En descenso de gradiente sin impulso ni regularización, un peso vale 2, su gradiente es 3 y la tasa es 0,1. ¿Cuánto vale tras un paso?",["2,3","1,7","1,9","−1"],1,["Has sumado el incremento en vez de restarlo.","Correcto: 2 − 0,1·3 = 1,7.","Restar solo la tasa equivale a usar gradiente 1.","Restar el gradiente completo equivale a usar tasa 1."]],
      ["En descenso de gradiente, ¿qué puede ocurrir si la tasa de aprendizaje es excesiva?",["Los pasos saltan de un lado a otro del mínimo o divergen","Cada paso reduce la pérdida en la misma proporción","El gradiente calculado se hace cero antes del paso","El método equivale a usar un lote más grande"],0,["Correcto: avanzar demasiado en una dirección local de descenso puede aumentar la pérdida.","La aproximación local no garantiza mejora para pasos grandes.","La tasa escala la actualización, no anula la derivada calculada.","Cambiar la tasa no añade ejemplos a la estimación del gradiente."]],
      ["¿Qué información añade el impulso (momentum) al descenso que solo usa el gradiente del lote actual?",["Una dirección acumulada de gradientes anteriores","La exactitud en el conjunto de prueba","Los ejemplos de todos los lotes anteriores sin resumir","La segunda derivada exacta de la pérdida"],0,["Correcto: una fracción de la actualización anterior persiste en la nueva dirección.","La prueba no guía los pasos de entrenamiento.","Se mantiene un acumulador, no una copia de todas las muestras.","El impulso se calcula a partir de gradientes, no de la curvatura exacta."]]
    ],
    labTitle:"Da un paso SGD",labInstruction:"Cambia η y calcula w nuevo para w=2 y gradiente=3.",
    source:["PyTorch · Optimization","https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html"]
  },
  {
    id:"07.07",navTitle:"Regularización",title:"Poner límites al aprendizaje",
    objective:"Distinguir dropout, weight decay y modo de evaluación.",
    lead:"Una red flexible puede seguir accidentes de train; la regularización modifica qué soluciones se favorecen.",
    keyIdea:"Dropout omite activaciones aleatoriamente durante entrenamiento; en inferencia cambia su comportamiento. Weight decay limita pesos según la implementación.",
    sections:[
      ["Weight decay","Con una penalización cuadrática (L2), el término proporcional al peso se suma al gradiente y pasa por la adaptación por parámetro de Adam. AdamW contrae el peso por separado de esa adaptación: en general no producen el mismo paso.","Un decaimiento excesivo puede reducir tanto los pesos que la red ya no ajuste ni los patrones útiles del entrenamiento."],
      ["Dropout","Durante el entrenamiento, Dropout de PyTorch anula activaciones al azar y reescala las que conserva. En inferencia ordinaria, model.eval() desactiva ese muestreo y la capa deja pasar su entrada.","Con BatchNorm en su configuración habitual, eval() también indica que se usen las estadísticas acumuladas en entrenamiento en vez de las del lote actual. Desactivar el cálculo de gradientes no cambia por sí solo el modo de estas capas."],
      ["Datos válidos","Los ejemplos independientes aportan variaciones nuevas; las transformaciones válidas enseñan qué cambios debería tolerar el modelo sin cambiar la etiqueta. Ambos pueden reducir la memorización.","Transformar una foto mal etiquetada multiplica el error, no lo corrige. Si distintas vistas de una pieza cruzan particiones, la validación sigue midiendo en parte reconocimiento de esa pieza; hay que separarlas por origen."]
    ],
    takeaways:["Regularización no garantiza mejora.","Dropout depende del modo train/eval.","AdamW y L2 clásica pueden diferir."],
    questions:[
      ["¿Qué hace una capa Dropout estándar de PyTorch tras llamar a model.eval()?",["Sigue sorteando la misma proporción de activaciones","Deja pasar la entrada sin anular activaciones","Pone a cero los pesos que no se usaron en el último lote","Multiplica la entrada por la probabilidad de descarte"],1,["El muestreo aleatorio corresponde al entrenamiento.","Correcto: en evaluación es la identidad; el reescalado ya se hizo durante el entrenamiento.","Dropout enmascara activaciones, no elimina pesos.","En evaluación no se aplica ese factor adicional."]],
      ["Al aumentar mucho la penalización de los pesos, empeoran entrenamiento y validación. ¿Qué explicación encaja?",["La regularización impide aprender incluso patrones útiles","La penalización aumenta la capacidad de memorización","El conjunto de validación pasa a formar parte del gradiente","Reducir el tamaño de los pesos garantiza menor error"],0,["Correcto: una restricción excesiva puede causar infraajuste.","La penalización restringe las soluciones de pesos grandes.","La penalización se calcula sobre los pesos, no sobre los casos de validación.","Pesos más pequeños no son un fin útil si se pierde la señal predictiva."]],
      ["¿En qué difiere AdamW de sumar una penalización cuadrática (L2) al objetivo de Adam?",["Ambos aplican siempre la misma actualización","AdamW separa el decaimiento del peso de la adaptación del gradiente","AdamW deja de usar el historial de gradientes","La L2 de Adam solo afecta a la pérdida que se muestra"],1,["Con L2 el término de penalización entra en las estimaciones adaptativas; en AdamW no.","Correcto: la contracción del peso se aplica aparte de la actualización adaptativa.","AdamW sigue estimando momentos de los gradientes.","La derivada de la penalización sí modifica el paso."]]
    ],
    labTitle:"Apaga unidades",labInstruction:"Cambia la tasa de dropout y estima activaciones presentes de 20.",
    source:["PyTorch · Dropout","https://docs.pytorch.org/docs/stable/generated/torch.nn.Dropout.html"]
  },
  {
    id:"07.08",navTitle:"Gradientes estables",title:"Que la señal no se apague",
    objective:"Reconocer gradientes que se desvanecen o explotan.",
    lead:"Multiplicar una señal repetidamente por 0,5 la atenúa; por 1,5 puede hacerla crecer sin control.",
    keyIdea:"Inicialización, activaciones, normalización y rutas residuales influyen en el flujo de gradientes; hay que medirlo.",
    sections:[
      ["Cadena simplificada","En ocho etapas, un gradiente inicial de 1 se multiplica por 0,5⁸ ≈ 0,0039 o por 1,5⁸ ≈ 25,63. Un mismo número de factores puede atenuar o amplificar mucho la señal.","En una red real intervienen matrices de derivadas, activaciones dependientes de los datos y ramas que suman contribuciones. El producto escalar ilustra un mecanismo, no predice el gradiente de toda la red."],
      ["Rutas e inicialización","Xavier ajusta la escala inicial de los pesos según el número de entradas y salidas; He tiene en cuenta la rectificación de activaciones como ReLU y suele usar el número de entradas. El objetivo es que la señal no cambie drásticamente de escala entre capas.","Si el bloque devuelve x + F(x), el atajo aporta al gradiente una ruta de identidad que no atraviesa F. Facilita la propagación, pero la tasa, los datos y las demás rutas siguen influyendo en la estabilidad."],
      ["Diagnóstico","Registra por capa la norma del gradiente antes de recortarlo, las magnitudes de las activaciones y el primer lote con pérdida no finita. Así podrás localizar dónde empieza la inestabilidad.","El recorte de gradientes limita su norma o sus componentes antes del paso; no recupera gradientes desvanecidos ni corrige una tasa excesiva o entradas inválidas. Registra también con qué frecuencia actúa el recorte."]
    ],
    takeaways:["Productos repetidos cambian escala del gradiente.","Rutas residuales pueden facilitar optimización.","Inspecciona gradientes, no solo accuracy."],
    questions:[
      ["En una cadena escalar sin ramas hay tres derivadas locales iguales a 0,5. Si la señal de gradiente que entra es 1, ¿qué señal sale?",["0,125","1,5","0,5","0"],0,["Correcto: la regla de la cadena multiplica: 1×0,5×0,5×0,5=0,125.","Sumarías contribuciones de ramas, no factores en serie.","Solo has atravesado un eslabón.","El gradiente se reduce, pero no se anula."]],
      ["Un bloque residual devuelve x + F(x) sin proyectar la entrada. ¿Qué aporta el término x al retropropagar?",["Una ruta de identidad que no atraviesa F","Un gradiente total siempre igual a uno","Una garantía de que F no necesita entrenamiento","Un producto adicional por la derivada de F en todas las rutas"],0,["Correcto: el gradiente tiene una contribución directa además de la que atraviesa F.","La contribución de F puede modificar el gradiente total.","Los parámetros de F siguen recibiendo gradientes.","El atajo suma una ruta; no multiplica todas por la derivada de F."]],
      ["¿Qué problema aborda directamente el recorte de gradientes por norma antes del paso del optimizador?",["Una norma de gradiente excesiva","La falta de señal cuando el gradiente es cero","La mala calibración de las probabilidades","La ausencia de ejemplos de una clase"],0,["Correcto: si supera el límite, se reescala el gradiente para acotar su norma.","Acotar un vector nulo no crea señal.","El recorte no contrasta puntuaciones con frecuencias de acierto.","El recorte no cambia la composición de los lotes."]]
    ],
    labTitle:"Multiplica la cadena",labInstruction:"Cambia un factor local y calcula su efecto tras seis etapas.",
    source:["PyTorch · Autograd mechanics","https://docs.pytorch.org/docs/stable/notes/autograd.html"]
  }
];
export const sectorSevenLessons = buildSector(draft);
