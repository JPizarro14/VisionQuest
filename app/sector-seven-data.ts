import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[] = [
  {
    id:"07.01",navTitle:"Neuronas y parámetros",title:"Una suma que puede aprender",
    objective:"Calcular una neurona y distinguir pesos, sesgo y activación.",
    lead:"La neurona combina entradas numéricas. Sus parámetros cambian durante el entrenamiento; su arquitectura decide cómo puede usarlas.",
    keyIdea:"La preactivación es z = w·x + b. Una activación no lineal transforma z; sin ella, apilar capas afines sigue dando una función afín.",
    sections:[
      ["Pesar cada entrada","Para dos features, z = w1x1 + w2x2 + b. El sesgo desplaza la respuesta incluso con entradas nulas.","Con x=2, w=3 y b=−1, z vale 5. El peso aislado de una capa no explica causalmente una red entera."],
      ["Por qué activar","Componer matrices y sesgos sin activaciones se puede reducir a una sola transformación afín.","ReLU y otras activaciones permiten fronteras no lineales; la elección cambia el flujo de gradientes."],
      ["Salida y significado","Los parámetros se ajustan para reducir una pérdida definida sobre etiquetas. La salida cruda puede ser un logit.","Un logit no es automáticamente una probabilidad; el contexto de la capa y la calibración importan."]
    ],
    takeaways:["z combina entradas ponderadas y sesgo.","La activación introduce no linealidad.","Logit y probabilidad no son sinónimos."],
    questions:[
      ["x=2, w=3, b=−1. ¿Cuánto es z?",["5","6","−5","1"],0,["Correcto: 3·2−1=5.","Falta restar el sesgo.","El signo es incorrecto.","Falta el producto."]],
      ["Varias capas lineales sin activación equivalen a...",["Otra transformación lineal o afín","Cualquier función no lineal","Un árbol de decisión","Una probabilidad calibrada"],0,["Correcto: matrices y sesgos se componen.","Falta una no linealidad.","No aparecen reglas de árbol.","No existe esa garantía."]],
      ["¿Qué parámetros aprende una neurona habitual?",["Pesos y sesgo","Las etiquetas de test","El número de clases","El ancho de la foto"],0,["Correcto: se actualizan durante el entrenamiento.","Test se reserva.","Es parte de la tarea.","La resolución es un dato de entrada."]]
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
      ["ReLU","Deja pasar positivos y anula negativos. Es común en capas ocultas, aunque algunas unidades pueden quedarse sin gradiente útil.","Una activación ReLU no representa por sí sola la probabilidad de una clase."],
      ["Sigmoid y softmax","Sigmoid por etiqueta permite salidas multietiqueta independientes. Softmax acopla clases mutuamente excluyentes.","Que softmax dé 0,9 no asegura que nueve de cada diez predicciones semejantes sean correctas: hay que comprobar calibración."],
      ["La API de pérdida","CrossEntropyLoss de PyTorch recibe logits para el caso multiclase habitual e implementa una operación estable.","Aplicar softmax antes de ella puede ser redundante o erróneo; consulta el contrato de la función."]
    ],
    takeaways:["ReLU rectifica, no calibra.","Sigmoid y softmax responden a supuestos distintos.","Verifica si la pérdida espera logits."],
    questions:[
      ["¿Cuánto es ReLU(−3)?",["0","−3","3","0,5"],0,["Correcto: max(0,−3)=0.","ReLU anula negativos.","Es valor absoluto.","No es sigmoid."]],
      ["¿Qué normaliza clases excluyentes para sumar uno?",["ReLU","Softmax","Sigmoid independiente","Otsu"],1,["No normaliza.","Correcto: compara todos los logits.","No impone esa suma.","Es un método de umbral."]],
      ["Softmax de 0,9 significa...",["Acierto seguro","Puntuación que puede estar mal calibrada","IoU de 0,9","Pérdida cero"],1,["Todavía puede errar.","Correcto: hay que medir calibración.","IoU compara regiones.","La pérdida depende de etiqueta y puntuación."]]
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
      ["Shapes","Un lote N×F atraviesa una capa F→O y sale N×O. En PyTorch el peso se almacena con forma (O,F).","Con F=4 y O=3 hay 12 pesos y 3 sesgos. La siguiente capa debe aceptar tres features."],
      ["Composición","Alternar mezclas lineales y activaciones construye representaciones más expresivas.","Más profundidad aumenta capacidad y coste, pero no garantiza generalización."],
      ["Aplanar una imagen","Una imagen con shape (H, W, C), donde H = Height (alto), W = Width (ancho) y C = Channels (canales), puede convertirse en un vector de H·W·C valores. Se conservan los valores, pero el eje ya no expresa vecindad 2D.","Las capas densas crecen rápidamente con resolución; las CNN comparten filtros locales."]
    ],
    takeaways:["Sigue la shape por capa.","Una capa F→O tiene O(F+1) parámetros con sesgo.","Aplanar oculta estructura espacial explícita."],
    questions:[
      ["(8,4) por Linear(4,3) produce...",["(8,3)","(4,8)","(3,4)","(8,12)"],0,["Correcto: ocho muestras, tres salidas.","Invierte ejes.","Pierde lote.","12 es número de pesos."]],
      ["Parámetros de Linear(4,3) con sesgo:",["12","15","7","3"],1,["Faltan tres sesgos.","Correcto: 4·3+3.","Solo suma tamaños.","Solo cuenta sesgos."]],
      ["Aplanar una imagen deja de expresar explícitamente...",["Proximidad espacial","Número de valores","Dtype","Etiqueta"],0,["Correcto: se pierde la forma 2D en los ejes.","Los valores siguen ahí.","No cambia por aplanar.","No forma parte del array de píxeles."]]
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
      ["Logits y estabilidad","CrossEntropyLoss de PyTorch toma logits sin softmax previo y etiquetas de clase para el caso habitual.","En multietiqueta se formula normalmente una pérdida binaria por salida, con otra API."],
      ["Objetivo y decisión","Minimizar pérdida no elige automáticamente el umbral operativo ni garantiza calibración.","Comprueba métricas y errores relevantes después de entrenar."]
    ],
    takeaways:["La pérdida penaliza baja probabilidad de la clase real.","Accuracy ignora confianza.","La entrada esperada por la API importa."],
    questions:[
      ["¿Qué p real da menor −ln(p)?",["0,8","0,2","0,01","Todas igual"],0,["Correcto: −ln(0,8) es menor.","Es menos confianza.","Penaliza mucho.","La función varía."]],
      ["CrossEntropyLoss multiclase suele recibir...",["Logits","Argmax","Etiquetas predichas redondeadas","Una máscara de Otsu"],0,["Correcto: aplica una operación log-softmax estable.","Pierde gradientes.","Pierde información.","No corresponde."]],
      ["Dos modelos con igual accuracy pueden tener...",["Distinta cross-entropy","Siempre la misma pérdida","Igual calibración segura","El mismo número de parámetros"],0,["Correcto: sus confianzas pueden variar.","Accuracy es discreta.","No está garantizada.","La arquitectura puede diferir."]]
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
      ["Actualizar después","backward calcula gradientes. El optimizador modifica parámetros con step; zero_grad prepara nueva acumulación.","Descenso básico mueve en dirección opuesta al gradiente local."]
    ],
    takeaways:["Backprop organiza la regla de la cadena.","Ramas compartidas suman gradientes.","Gradiente y paso del optimizador son fases distintas."],
    questions:[
      ["dy/dz=2 y dz/dw=3. ¿dy/dw?",["5","6","1","−6"],1,["La cadena multiplica.","Correcto: 2·3=6.","No corresponde.","El producto es positivo."]],
      ["backward normalmente...",["Actualiza pesos directamente","Calcula o acumula gradientes","Divide train y test","Aplica NMS"],1,["La actualización es del optimizador.","Correcto: propaga derivadas.","Es una decisión de datos.","Es postproceso de detección."]],
      ["Un peso usado en dos ramas recibe...",["Solo una derivada","Suma de ambas contribuciones","Siempre cero","Producto de pérdidas"],1,["Ignora una ruta.","Correcto: las rutas confluyen.","El peso puede afectar salida.","No es la regla."]]
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
      ["Un paso","Con w=2, gradiente=3 y η=0,1, el peso nuevo vale 1,7.","Un gradiente negativo mueve el parámetro en sentido contrario."],
      ["Momentum y Adam","Momentum integra direcciones anteriores. Adam adapta tasas por parámetro a partir de momentos estimados.","Ninguno garantiza la mejor generalización; compara con igual presupuesto y validación."],
      ["Calendarios","Reducir η más tarde puede ayudar al refinamiento. Pérdida que explota exige revisar tasa y estabilidad.","Registra condiciones y semilla para comparar experimentos."]
    ],
    takeaways:["El signo del gradiente y η fijan un paso SGD.","Optimizadores usan distintas reglas.","Inspecciona estabilidad y validación."],
    questions:[
      ["w=2, grad=3, η=0,1: nuevo w:",["2,3","1,7","1,9","3"],1,["Sumaste.","Correcto: 2−0,3=1,7.","Usaste otro gradiente.","Falta la tasa."]],
      ["Tasa demasiado alta puede...",["Oscilar o divergir","Garantizar convergencia","Eliminar datos","Calibrar softmax"],0,["Correcto: pasos excesivos.","No hay garantía.","Siguen necesarios.","Es otra cuestión."]],
      ["Momentum incorpora...",["Gradientes pasados","Canales extra","Etiquetas de test","IoU"],0,["Correcto: historia de direcciones.","No cambia imagen.","Test no entrena.","Otra métrica."]]
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
      ["Weight decay","Una penalización L2 desalienta pesos grandes. AdamW desacopla el decaimiento, que no es idéntico a sumar L2 al gradiente de Adam.","Demasiada regularización puede provocar infraajuste."],
      ["Dropout","Durante train apaga unidades de forma aleatoria. En evaluación se desactiva o se usa la escala de inferencia de la implementación.","Olvidar model.eval afecta dropout y también capas como BatchNorm."],
      ["Datos válidos","Más ejemplos independientes y augmentations coherentes pueden ayudar a generalizar.","No arreglan etiquetas erróneas ni un split con fuga."]
    ],
    takeaways:["Regularización no garantiza mejora.","Dropout depende del modo train/eval.","AdamW y L2 clásica pueden diferir."],
    questions:[
      ["En evaluación, dropout habitual...",["Sigue aleatorio igual","Se desactiva o ajusta según implementación","Borra pesos","Crea nuevas clases"],1,["No es el comportamiento previsto.","Correcto: modo eval importa.","No elimina parámetros.","No cambia etiquetas."]],
      ["Demasiada regularización puede...",["Infraajustar","Garantizar mejora","Cambiar RGB a gris","Hacer un split correcto"],0,["Correcto: restringe demasiado.","No hay garantía.","No es conversión de color.","No separa datos."]],
      ["AdamW y L2 añadida al gradiente de Adam son...",["Siempre iguales","Distintas en general","Tipos de ROI","Métricas"],1,["Adaptación de Adam cambia el efecto.","Correcto: decaimiento desacoplado.","No son regiones.","Son técnicas de optimización."]]
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
      ["Cadena simplificada","Con factor local 0,5 durante ocho etapas, el producto es 0,0039; con 1,5 crece mucho.","Las redes reales no son cadenas escalares idénticas, pero el ejemplo muestra el riesgo."],
      ["Rutas e inicialización","He y Xavier consideran tamaños de capas y activaciones. Una conexión residual añade una ruta de identidad.","No garantizan que cualquier profundidad sea entrenable."],
      ["Diagnóstico","Registra normas de gradiente, activaciones, pérdida y NaN. Clipping acota gradientes excesivos en ciertos sistemas.","Comprueba primero si una red pequeña aprende antes de añadir profundidad."]
    ],
    takeaways:["Productos repetidos cambian escala del gradiente.","Rutas residuales pueden facilitar optimización.","Inspecciona gradientes, no solo accuracy."],
    questions:[
      ["0,5³ vale...",["0,125","1,5","3,5","0"],0,["Correcto: producto de tres mitades.","Es suma.","No corresponde.","No es exactamente cero."]],
      ["Una conexión residual aporta...",["Ruta de identidad","Una etiqueta de test","Profundidad real","Un ROI"],0,["Correcto: una vía alrededor de un bloque.","Sería fuga.","No mide distancia.","Es otra noción."]],
      ["Gradient clipping sirve para...",["Limitar gradientes excesivos","Añadir píxeles","Calibrar probabilidades","Crear etiquetas"],0,["Correcto: acota norma o valores.","No altera resolución.","No garantiza calibración.","Ground truth es externo."]]
    ],
    labTitle:"Multiplica la cadena",labInstruction:"Cambia un factor local y calcula su efecto tras seis etapas.",
    source:["PyTorch · Autograd mechanics","https://docs.pytorch.org/docs/stable/notes/autograd.html"]
  }
];
export const sectorSevenLessons = buildSector(draft);
