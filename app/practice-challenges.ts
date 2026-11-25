export type PracticeChallenge = { prompt: string; check: string };
export const practiceChallenges: Record<string, PracticeChallenge> = {
  "11.01": {
    prompt: "Un recorte empieza en (100,40) de la foto. El detector devuelve (12,7,20,10): esquina superior izquierda, ancho y alto en píxeles del recorte. ¿Cuáles son las dos esquinas en la foto original? Repite si esos mismos números se midieron tras reducir el recorte al 50 % en ambos ejes, sin relleno.",
    check: "Sin reducción, las esquinas locales son (12,7) y (32,17); al sumar el origen queda (112,47,132,57). Con reducción, primero duplica las coordenadas locales y luego suma el origen: (124,54,164,74). El origen de la foto no se duplica.",
  },
  "11.02": {
    prompt: "Dos cajas de 10×10 píxeles están a la misma altura. Una está desplazada 5 píxeles a la derecha de la otra. ¿Cuál es su intersección sobre unión (IoU)? ¿Es ese valor la confianza del detector?",
    check: "Se superponen en 5×10=50 píxeles cuadrados; la unión mide 100+100−50=150. IoU=50/150=1/3. Es una medida geométrica entre dos cajas, no la puntuación que el modelo asignó a una de ellas.",
  },
  "11.03": {
    prompt: "Una foto contiene una única válvula anotada. El detector devuelve tres cajas para esa válvula; las tres tienen la clase correcta y superan el umbral de solapamiento. Si la evaluación empareja cada objeto una sola vez y no ignora cajas, ¿cuántos aciertos y falsas alarmas cuenta?",
    check: "Un verdadero positivo y dos falsos positivos. Una caja se empareja con la única válvula; las otras son detecciones duplicadas, no dos válvulas más.",
  },
  "11.04": {
    prompt: "El detector coloca una caja en cada una de dos personas distintas. Sus cajas tienen IoU 0,6 y puntuaciones 0,9 y 0,8. Si la supresión de duplicados (NMS) descarta cajas de la misma clase con IoU superior a 0,5, ¿qué ocurre y qué error buscarías?",
    check: "NMS conserva la caja de 0,9 y suprime la de 0,8. La segunda persona pasa a ser una omisión. Compararía cuántas personas próximas se pierden y cuántos duplicados quedan al variar el umbral en validación.",
  },
  "11.05": {
    prompt: "Un detector usa cajas de referencia cuadradas (anchors) y omite muchas piezas alargadas. ¿Cómo comprobarías si el problema son esas cajas, antes de sustituir el detector?",
    check: "Separaría los resultados por tamaño y relación ancho/alto. Para cada pieza alargada anotada mediría el solapamiento con su mejor anchor y si alguna caja se asignó como positiva en entrenamiento. Poco solapamiento justificaría probar otras proporciones.",
  },
  "11.06": {
    prompt: "Una marca mide 8 píxeles de ancho en el original. Antes de pasar la foto al detector divides alto y ancho entre cuatro. ¿Qué tamaño recibe la red? ¿Puede su pirámide de características (FPN) recuperar la forma original?",
    check: "Recibe una marca de unos 2 píxeles de ancho. La pirámide combina detalle y contexto de varias capas, pero no recupera muestras que ya no estaban en la entrada. Probaría un recorte del original que conserve más resolución.",
  },
  "11.07": {
    prompt: "Sobre las mismas imágenes sube la precisión media del detector si basta un solapamiento de 0,50 con la anotación (AP@0,50), pero baja si exiges 0,75. ¿Qué fallo sospecharías y cómo lo comprobarías?",
    check: "Podría encontrar más objetos sin ajustar bien los bordes de sus cajas. Miraría las cajas sobre la imagen y compararía el solapamiento por tamaño y a igual nivel de falsas alarmas. Las dos cifras por sí solas no demuestran la causa.",
  },
  "11.08": {
    prompt: "Dos recortes solapados contienen la misma válvula. Cada recorte se amplió y luego recibió un margen de relleno antes de detectar. ¿En qué orden convertirías las dos cajas al sistema de la foto para poder compararlas?",
    check: "Para cada caja resta el relleno, divide las coordenadas por el factor de escala y suma el origen de su recorte. Solo entonces calcula el solapamiento en la foto y fusiona duplicados de la misma clase.",
  },
  "12.01": {
    prompt: "En una foto aparecen una carretera y dos coches. ¿Qué anotarías con segmentación semántica y qué añadirías si necesitas contar los coches por separado?",
    check: "La máscara semántica asigna una clase a cada píxel: ambos coches comparten la clase «coche». Para contarlos necesitas identidades distintas, por ejemplo una máscara de instancia para cada coche. La carretera conserva su clase; no necesita un ID por objeto.",
  },
  "12.02": {
    prompt: "En una máscara, la región real ocupa 10 píxeles y la predicha 8; tienen 6 en común. Calcula IoU y Dice. Si en otra foto ambas regiones estuvieran vacías, ¿qué tendrías que decidir antes de promediar?",
    check: "IoU = 6/(10+8−6) = 0,5. Dice = 2×6/(10+8) ≈ 0,667. Con ambas máscaras vacías las dos fórmulas dan 0/0: acuerda si excluir ese caso o asignarle un valor y usa la misma regla para todos los modelos.",
  },
  "12.03": {
    prompt: "En una segmentación binaria, el 99 % de los píxeles es fondo. El modelo marca todo como fondo. ¿Qué dos cifras mostrarías juntas para que el porcentaje de píxeles acertados no oculte el fallo?",
    check: "Acierta el 99 % de todos los píxeles, pero detecta el 0 % de los píxeles de defecto: no marca ni uno. Mostraría la exactitud global junto a la sensibilidad de la clase «defecto», indicando cuántos píxeles de esa clase se evaluaron.",
  },
  "12.04": {
    prompt: "Creas un ejemplo de entrenamiento reflejando horizontalmente una foto de una persona. Sus muñecas están anotadas por lado anatómico en columnas de 0 a W−1. ¿Cómo transformas esos puntos para que las etiquetas describan a la persona reflejada?",
    check: "Para cada punto uso x′=W−1−x y mantengo y. Intercambio las etiquetas izquierda y derecha según el esquema de pose; la marca de visibilidad acompaña a su punto. Sin ese intercambio, una muñeca tendría el nombre de la contraria.",
  },
  "12.05": {
    prompt: "Un lector de documentos (OCR) transcribe bien cada palabra aislada, pero intercambia dos líneas al generar el texto final. ¿Cómo distinguirías un error de reconocimiento de uno de orden de lectura?",
    check: "Compararía las palabras de cada recorte con su transcripción de referencia. Después compararía la secuencia de líneas de la página con el orden correcto. Si las palabras coinciden una a una pero la secuencia no, el fallo es de orden.",
  },
  "12.06": {
    prompt: "De los textos reales, el detector localiza el 80 %. El OCR transcribe bien el 90 % de esos textos localizados. Solo se leen textos pasando por ambas etapas. ¿Qué fracción de los textos reales se lee bien? ¿Es también la precisión del sistema?",
    check: "El 72% de los textos reales: de cada 100, localiza 80 y lee bien 72. No es la precisión entre todas las lecturas emitidas: para eso también hay que contar las salidas equivocadas, incluidos los falsos positivos.",
  },
  "13.01": {
    prompt: "Un transformer divide una foto de 224×224 píxeles en parches cuadrados sin solapamiento ni tokens adicionales. Si pasas de parches de 16×16 a 8×8, ¿cuántos tokens tendrás y cuántas veces crece el número de entradas de una matriz de atención densa?",
    check: "Pasas de 14×14=196 a 28×28=784 tokens. Hay cuatro veces más tokens; como la matriz tiene una fila y una columna por token, contiene 4²=16 veces más entradas. Eso no implica que toda la inferencia tarde 16 veces más.",
  },
  "13.02": {
    prompt: "En una cabeza de atención, una consulta asigna peso 0,8 al fondo y 0,2 al objeto. ¿Demuestra eso que el fondo causó la clasificación?",
    check: "No. Esos pesos describen una combinación interna, no el efecto causal sobre la salida final. Compararía la predicción al cambiar solo el fondo, manteniendo el mismo objeto, en varias fotos.",
  },
  "13.03": {
    prompt: "Un detector DETR tiene 100 consultas (queries) y cada una puede emitir como máximo una caja. Hay 130 objetos anotados en una foto. ¿Cuál es el máximo de objetos distintos que puede detectar en una pasada?",
    check: "Como máximo 100; al menos 30 quedarán sin caja, incluso sin errores de clase o posición. Para medir si ese límite importa, compararía la sensibilidad en escenas con distinta densidad.",
  },
  "13.04": {
    prompt: "Una herramienta genera máscaras a partir de una caja dibujada por una persona. Tres máscaras parecen buenas a simple vista. ¿Basta para usar sus salidas como etiquetas de prueba y evaluar otro modelo?",
    check: "No. Compararía muestras representativas con máscaras humanas independientes, incluidas las piezas difíciles. Antes de aceptar una etiqueta de prueba corregiría errores sistemáticos; de lo contrario, podría premiar al modelo que repita los errores de la herramienta.",
  },
  "13.05": {
    prompt: "Para una foto fija, softmax asigna 0,9 a «grieta» frente a «sin grieta». Añades la opción «rayón» sin cambiar las puntuaciones originales y baja la probabilidad de «grieta». ¿Demuestra que el modelo reconoce peor las grietas?",
    check: "No. Al añadir otra opción crece el denominador de softmax aunque la puntuación original de «grieta» no cambie. Para saber si reconoce peor, compara predicciones con etiquetas usando las mismas clases candidatas.",
  },
  "13.06": {
    prompt: "Tienes un modelo preentrenado y 100 fotos etiquetadas de piezas, algunas de la misma pieza. ¿Cómo compararías entrenar solo una cabeza de clasificación frente a reajustar también parte del modelo?",
    check: "Separaría las fotos por pieza. Con el mismo reparto, entrenaría primero solo la cabeza y después compararía con descongelar el último bloque. Elegiría en validación y mediría una vez en el test reservado; con pocas piezas, informaría los aciertos y el tamaño de la muestra.",
  },
  "14.01": {
    prompt: "Una cámara toma muestras instantáneas cada 1/6 de segundo. Un defecto solo está a la vista durante 100 ms. ¿Podría pasar sin aparecer en ningún fotograma? ¿Qué cambiarías?",
    check: "Sí. Entre muestras pasan unos 167 ms: el defecto puede entrar y salir en ese hueco. Probaría una cadencia con intervalos menores de 100 ms o un disparo sincronizado y contaría eventos reales omitidos.",
  },
  "14.02": {
    prompt: "El flujo óptico indica que una pared inmóvil se desplaza entre dos fotogramas. ¿Qué causa física lo explicaría y cómo la pondrías a prueba?",
    check: "Puede haberse movido la cámara: el flujo mide desplazamientos en la imagen, no solo de objetos. Repetiría la toma con la cámara fija o estimaría el movimiento común de puntos del fondo y vería si al compensarlo desaparece el flujo de la pared.",
  },
  "14.03": {
    prompt: "Un sistema sigue a dos personas a lo largo de un vídeo. Sus cajas son correctas incluso cuando se cruzan, pero después del cruce la primera persona recibe el identificador de la segunda. ¿Qué error contarías que la calidad de las cajas no recoge?",
    check: "Un cambio de identidad (ID switch) en la trayectoria afectada. Compararía los identificadores asignados con las trayectorias anotadas antes y después del cruce. Una métrica de detección por fotograma no comprueba esa continuidad.",
  },
  "14.04": {
    prompt: "En una cámara ideal, la columna de un punto es x=fx·X/Z+cx. El punto está X=1 m a la derecha del eje óptico; la focal horizontal fx es 100 px y el centro cx está en 0 px. ¿En qué columna aparece a profundidades Z=2 m y Z=4 m? Si solo ves la columna y no conoces X, ¿puedes deducir Z?",
    check: "A 2 m aparece en x=100×1/2=50 px; a 4 m, en 25 px. La columna solo fija la razón X/Z: tanto (X=1 m, Z=2 m) como (X=2 m, Z=4 m) dan 50 px. Necesitarías otra medida de escala o una segunda vista de geometría conocida.",
  },
  "14.05": {
    prompt: "Dos cámaras rectificadas tienen focal de 800 px y están separadas 0,1 m. Un punto cambia de columna entre las fotos: ese desplazamiento es la disparidad d. Con Z=fB/d, ¿qué profundidad obtienes para 40 px y para 20 px? ¿Por qué importa más un error de 1 px cuando d es pequeña?",
    check: "Z=80/40=2 m y Z=80/20=4 m. Si mides un píxel de más, obtienes 80/41≈1,95 m o 80/21≈3,81 m: el mismo fallo produce unos 5 cm de error en el primer caso y 19 cm en el segundo.",
  },
  "14.06": {
    prompt: "Una alarma de vídeo debe avisar una sola vez por entrada y hacerlo en menos de 250 ms en el 99 % de los eventos. Una nueva versión detecta mejor por fotograma, pero duplica avisos y su latencia p99 supera 250 ms. ¿La aceptarías?",
    check: "No. La mejora por fotograma no satisface los dos requisitos del sistema. Contaría avisos por entrada real y mediría desde el inicio de cada evento hasta el primer aviso, bajo la carga prevista.",
  },
  "15.01": {
    prompt: "Tienes cinco fotos de cada pieza y 20 recortes de cada foto. Quieres medir si un modelo funcionará sobre piezas que nunca ha visto. ¿Qué repartirías al crear entrenamiento, validación y prueba?",
    check: "Repartiría identificadores de pieza, no fotos ni recortes. Las cinco vistas y sus 100 recortes quedan en una única partición; comprobaría que ningún ID de pieza se repite entre particiones.",
  },
  "15.02": {
    prompt: "Dos personas anotan el mismo defecto, pero una incluye la sombra en la máscara y la otra la excluye. ¿Cómo distinguirías una regla ambigua de un error de anotación?",
    check: "Buscaría en la guía una regla y ejemplos que decidan si la sombra cuenta. Si falta, acordaría el criterio y repetiría la anotación a ciegas. Si la regla ya era clara, corregiría la máscara que la incumple; cambiar la métrica no resuelve dos definiciones distintas del defecto.",
  },
  "15.03": {
    prompt: "Una cinta inspeccionó 2.000 piezas de día y 25 de noche. Se equivocó en 20 piezas de cada turno. ¿En qué turno es mayor la tasa de error y por qué no basta contar los 20 fallos?",
    check: "De día: 20/2.000=1 %. De noche: 20/25=80 %. Los numeradores son iguales, no el número de oportunidades. Revisaría el turno nocturno sin asumir que el 80 % es una estimación precisa con solo 25 piezas.",
  },
  "15.04": {
    prompt: "Tras cambiar una cámara, las fotos de la nueva muestra tienen intensidades más altas. Todavía no sabes qué piezas tenían defectos. ¿Qué puedes concluir sobre la entrada y qué te falta para evaluar el detector?",
    check: "Ha cambiado el brillo observado, no necesariamente la capacidad de detectar. Etiquetaría una muestra representativa con y sin alarma y compararía aciertos y errores por cámara manteniendo el mismo detector.",
  },
  "15.05": {
    prompt: "Un test contiene 1.000 recortes procedentes de 10 fotos independientes. Para estimar por remuestreo la incertidumbre del rendimiento en fotos nuevas, ¿sortearías recortes sueltos o fotos completas?",
    check: "Sortearía fotos completas, con reemplazo y manteniendo juntos sus recortes. Los recortes hermanos comparten escena; contarlos como 1.000 observaciones independientes puede dar un intervalo demasiado estrecho. Diez fotos siguen siendo pocas.",
  },
  "15.06": {
    prompt: "Procesar una segunda rejilla de recortes desplazada permite detectar más defectos cerca de los bordes, pero duplica las falsas alarmas y el tiempo por pieza. ¿Qué límites usarías para decidir si compensa?",
    check: "Fijaría la sensibilidad mínima cerca de los bordes, las falsas alarmas admisibles por turno y el plazo por pieza. Compararía las dos rejillas con una sola sobre las mismas piezas de validación; no aceptaría la mejora si incumple un límite obligatorio.",
  },
  "16.01": {
    prompt: "El modelo tarda 20 ms en procesar una imagen, pero entre capturarla y mostrar la decisión pasan 150 ms. ¿Cómo localizarías los 130 ms restantes?",
    check: "Pondría marcas de tiempo con el mismo ID de imagen al entrar y salir de captura, cola, preproceso, modelo, postproceso y entrega. Así distinguiría, por ejemplo, esperar la GPU de ejecutar el modelo en ella.",
  },
  "16.02": {
    prompt: "Llegan 120 imágenes/s a un servidor que completa 100/s. Al empezar no hay trabajo pendiente; las tasas son constantes, sin descarte. ¿Cuántas imágenes se acumulan en 30 s y qué pasa si las tasas no cambian?",
    check: "Se acumulan (120−100)×30=600 imágenes. La cola sigue creciendo a 20 imágenes/s mientras la llegada supere la capacidad.",
  },
  "16.03": {
    prompt: "Tras convertir los pesos de FP32 a INT8 ocupan la cuarta parte, pero en la cámara la decisión no llega antes. Da dos causas posibles y una medición que las distinga.",
    check: "La cámara quizá no acelera las operaciones INT8, o quizá el tiempo se va en captura y preproceso. Mediría por separado la inferencia y la latencia completa con ambas versiones en la misma cámara y carga.",
  },
  "16.04": {
    prompt: "Solo etiquetas las piezas con alarma y las 100 revisadas son defectuosas. ¿Puedes afirmar que la sensibilidad (recall) es alta?",
    check: "No: sabes que esas 100 alarmas eran correctas, pero no cuántos defectos pasaron sin alarma. Etiquetaría también piezas no alarmadas. Si muestreo los dos grupos en proporciones distintas, tendría en cuenta esas proporciones al estimar el recall.",
  },
  "16.05": {
    prompt: "Necesitas investigar por qué un detector de vídeo empezó a fallar, pero no puedes conservar grabaciones completas. ¿Qué registrarías y cuándo borrarías la información?",
    check: "Registraría versión, hora, cámara, fallos de captura y tiempos. Si hace falta imagen, guardaría solo recortes autorizados de una muestra, con acceso limitado y el plazo acordado para investigar el fallo. Al vencerlo borraría el material, incluidos sus metadatos identificativos.",
  },
  "16.06": {
    prompt: "Una cinta debe activar una alarma local en 200 ms incluso cuando se corta Internet durante una hora. ¿Puede depender exclusivamente de un detector remoto? ¿Qué alternativa probarías?",
    check: "No: sin red no recibe la decisión a tiempo. Probaría detección y actuación local, guardando los avisos para enviarlos después. Mediría el plazo de captura a alarma con la red desconectada, no solo con una conexión rápida.",
  },
  "17.01": {
    prompt: "Un cliente acepta una inspección si «acierta el 95 %». ¿Qué tres preguntas le harías para convertir esa frase en un criterio que puedas probar?",
    check: "¿Contamos por foto o por pieza, y qué piezas representan el uso real? ¿Cuántos defectos podemos dejar pasar y cuántas falsas alarmas caben por turno? ¿Cuánto tiempo hay desde la captura hasta que debe actuar la cinta?",
  },
  "17.02": {
    prompt: "Una cámara ve 100 mm de una placa frontal en 2.000 píxeles de ancho. En ese plano, el grosor horizontal de una grieta es 0,2 mm. ¿Cuántos píxeles de grosor esperas y qué dos problemas podrían impedir verla?",
    check: "La escala es 2.000/100=20 px/mm; el grosor esperado es 0,2×20=4 px. El desenfoque puede difuminar los bordes y un reflejo puede ocultar el contraste. Tener cuatro muestras no garantiza que la grieta se distinga.",
  },
  "17.03": {
    prompt: "Una imagen tiene 1.000 columnas. La recorres de izquierda a derecha con recortes de 400 columnas que empiezan en 0 y avanzan de 300 en 300, sin salir de la imagen. ¿Dónde empiezan? ¿Cubren el borde derecho? ¿Qué problema puede causar el solapamiento al contar objetos?",
    check: "Empiezan en 0, 300 y 600. El último cubre desde 600 hasta 999, así que no queda hueco. Una pieza en el solapamiento puede contarse dos veces: pasa las detecciones a coordenadas de la imagen antes de fusionarlas.",
  },
  "17.04": {
    prompt: "El detector A supera en 2 puntos de precisión media (AP) a B, pero tarda el doble y encuentra menos grietas pequeñas. Si esas grietas son críticas, ¿qué compararías antes de elegir?",
    check: "En las mismas piezas mediría qué fracción de grietas pequeñas recupera cada uno al mismo presupuesto de falsas alarmas. Comprobaría además la latencia en la cinta. Dos puntos más de AP global no compensan por sí solos un fallo crítico o un plazo incumplido.",
  },
  "17.05": {
    prompt: "Deben llegar 1.000 fotos, una por pieza. La cámara entrega 800 y hay alarma en 50. ¿Qué mide 50/800 y por qué no dice cuántas piezas defectuosas se dejaron pasar?",
    check: "Mide la fracción de fotos recibidas con alarma (6,25 %), no el acierto. Faltan 200 capturas y faltan etiquetas para saber qué alarmas eran correctas y qué defectos pasaron sin alarma. Informaría por separado cobertura (80 %) y errores de inspección.",
  },
  "17.06": {
    prompt: "Una fábrica quiere detectar grietas finas y retirar las piezas dañadas sin parar la cinta. Resume un diseño inicial en cinco decisiones: captura, datos, detector, aceptación y actuación ante un fallo.",
    check: "Compruebo el grosor visible en fotos reales. Separo las imágenes por pieza antes de entrenar. Comparo un detector sencillo con otro que conserve resolución en la grieta. Exijo sensibilidad suficiente sin superar las alarmas ni el plazo admitidos. Si falla la cámara, desvío la pieza a revisión en vez de darla por buena.",
  },
  "18.01": {
    prompt: "En una imagen NumPy de al menos 20 filas y 50 columnas recortas img[10:20,30:50]. ¿Cuántas filas y columnas quedan? ¿Cómo conviertes un punto (x,y) del recorte a coordenadas de la imagen?",
    check: "La forma espacial es (10,20): los extremos finales del corte se excluyen. La primera columna del recorte era la 30 y la primera fila era la 10; por eso el punto pasa a (x+30,y+10).",
  },
  "18.02": {
    prompt: "De 100 piezas, una está defectuosa. Da un ejemplo de un clasificador que acierte el 99 % y no sirva para encontrar defectos. ¿Qué dos cifras mostrarías junto a la exactitud?",
    check: "Decir «buena» siempre acierta en las 99 buenas, pero detecta 0 de 1 defectos. Mostraría sensibilidad de la clase defecto (0 %) y defectos omitidos (1 de 1). Si se informa precisión de las alarmas, aquí no se puede calcular: no hubo ninguna.",
  },
  "18.03": {
    prompt: "Un detector mejora ocho puntos de precisión media al evaluarlo con recortes de fotos que también se usaron para entrenar. Además se eligió el umbral de supresión de cajas mirando ese test. ¿Cómo repetirías la comparación?",
    check: "Haría un nuevo reparto por foto original o pieza, antes de generar recortes. Ajustaría el umbral en validación. Compararía ambos detectores ya congelados sobre las mismas piezas de un test nuevo; el anterior ya se usó para elegir.",
  },
  "18.04": {
    prompt: "Una marca mide 10 píxeles de ancho en una foto de 4.000 píxeles de ancho. Reduces toda la foto a 640 píxeles de ancho sin deformarla. ¿Qué ancho le queda a la marca y qué dos alternativas conservarían más detalle?",
    check: "Le quedan 10×640/4.000=1,6 píxeles de ancho: el contorno puede perderse. Si su ubicación es fija, recortaría esa zona del original; si puede estar en cualquier sitio, procesaría recortes solapados de toda la foto.",
  },
  "18.05": {
    prompt: "Tras actualizar el firmware de una cámara hay menos alarmas y se procesan más fotogramas por segundo. ¿Qué cuatro comprobaciones distinguirían una mejora de un fallo de captura o de detección?",
    check: "1) Comparar fotogramas esperados, recibidos y descartados. 2) Revisar resolución, exposición y orden de canales. 3) Reprocesar una captura conocida con las dos versiones. 4) Etiquetar piezas con y sin alarma y comparar los fallos en las mismas condiciones.",
  },
  "18.06": {
    prompt: "Inspeccionas 10.000 piezas al día, el 2 % defectuosas, con un aviso por pieza. El objetivo es detectar el 90 % de los defectos y avisar en 250 ms o menos en el 95 % de los casos. ¿Cuántas piezas defectuosas pasarían al día al alcanzar ese objetivo? ¿Qué más comprobarías antes de ponerlo en marcha con una cámara de 30 fotogramas/s?",
    check: "Esperaría 200 piezas defectuosas y 20 omisiones diarias. Acordaría si ese coste y el volumen de falsas alarmas son aceptables. En lotes nuevos comprobaría grietas finas y plazos desde captura hasta actuación. A 30 fotogramas/s llega uno cada 33,3 ms: además de latencia hay que medir colas y decidir qué hacer si falta una captura.",
  },
};
