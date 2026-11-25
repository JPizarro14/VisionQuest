// Una pregunta por apartado; los casos de entrevista tienen su propia solución.
export const reasoningPrompts: Record<string, string[]> = {
  "01.01": [
    "¿Cómo se representa una imagen de grises de 8 bits como una tabla de números y qué cambia al modificar una de sus celdas?",
    "En una imagen RGB almacenada como (H, W, C), ¿qué cuenta cada eje y qué valores encontrarías en una misma posición espacial?",
    "¿En qué se diferencian un archivo JPEG o PNG y la matriz o tensor con el que trabaja un algoritmo después de decodificarlo?",
  ],
  "01.02": [
    "¿Dónde está el origen habitual de una imagen, hacia dónde crecen x e y y por qué la coordenada (x, y) se consulta como imagen[y, x]?",
    "Una imagen mide 640 píxeles de ancho y 480 de alto. Con índices desde cero, ¿cuál es su forma en orden (filas, columnas) y cuál es el último píxel en orden (x, y)? ¿Por qué difieren?",
    "En una imagen RGB de NumPy con los canales al final, tomas la región de interés imagen[10:30, 40:70]. ¿Qué devuelven shape y size del recorte? ¿Dónde cae su punto local (x, y) = (5, 2) en la imagen original?",
  ],
  "01.03": [
    "¿Cuántos niveles representa un canal uint8 y cuántos uno uint16? Distingue el número de niveles del valor máximo y de la cantidad de canales RGB.",
    "Un píxel uint8 vale 200. ¿Qué valor queda al convertirlo a float32 y qué operación adicional lleva la escala 0–255 a [0, 1]?",
    "¿Qué información puede perderse al pasar de uint16 a uint8? Explica también por qué hay que conocer la política de saturación o desbordamiento al operar con uint8.",
  ],
  "01.04": [
    "En una pantalla RGB, ¿qué color ves con rojo y verde al máximo y azul apagado? ¿Qué ves con los tres al máximo y con los tres a cero? Explica qué se está mezclando.",
    "Al componer un píxel RGBA sobre un fondo, ¿qué cambia si mantienes RGB fijo y pasas alfa de 0 a 1 en la escala normalizada?",
    "Una imagen cargada con OpenCV muestra rojo donde esperabas azul. ¿Qué comprobarías sobre RGB/BGR, el tipo de dato y el rango antes de culpar al modelo?",
  ],
  "01.05": [
    "¿Por qué RGB es adecuado para mostrar una imagen, pero puede ser poco intuitivo para detectar un objeto rojo bajo distintas condiciones de iluminación?",
    "¿Qué mide cada canal de HSV y por qué seleccionar por tono funciona mejor con un color saturado que con un gris? Indica la escala del tono en la conversión estándar de OpenCV a HSV uint8.",
    "¿Qué separan Lab y YCrCb, para qué puede servir esa separación y por qué convertir una imagen a esos espacios no recupera detalle perdido?",
  ],
  "01.06": [
    "¿Por qué ampliar una imagen borrosa aumenta su número de píxeles, pero no garantiza más detalle? Menciona factores de captura que sí afectan al detalle real.",
    "Una grieta es estrecha y apenas más oscura que el fondo. ¿De qué dos formas distintas podría perderse al reducir las dimensiones de la imagen o la profundidad de bits?",
    "¿Qué es el aliasing al reducir una imagen con texturas finas y por qué se aplica un filtro paso bajo antes o durante el remuestreo?",
  ],
  "01.07": [
    "Un píxel está en [y, x, c] en un array de ejes alto, ancho y canal. ¿Qué permutación lleva el canal al principio y por qué cambiar solo la forma con reshape puede dar valores incorrectos?",
    "¿Qué representa N en un tensor NCHW? Indica la shape de 16 imágenes RGB de 224 × 224 y explica por qué un solo ejemplo puede conservar el eje de lote.",
    "La shape coincide con la que espera el modelo, pero las predicciones son malas. ¿Qué comprobarías sobre dtype, rango, color y normalización?",
  ],
  "02.01": [
    "¿Cuántos ejes tienen un escalar, un vector y una matriz? Explica qué suele significar tensor en las bibliotecas de machine learning.",
    "Una caja xywh y un píxel RGBA tienen cuatro componentes. ¿Por qué su misma longitud no significa que representen datos intercambiables?",
    "Guardas un vector de 128 características por fila en una tabla de forma (32, 128). ¿Qué se resume si promedias entre filas y qué se resume si promedias entre columnas?",
  ],
  "02.02": [
    "Una imagen de grises es un ndarray de NumPy con dos filas, tres columnas y valores uint8. ¿Qué indican shape, ndim, dtype y size en este ejemplo?",
    "¿En qué se diferencian las shapes (3,), (1, 3) y (3, 1)? Explica por qué aparece una coma en la tupla (3,).",
    "¿Qué significa operar de forma vectorizada? Distingue la multiplicación elemento a elemento A * B del producto matricial A @ B.",
    "En NumPy sumas el vector [1, 2, 3] a la matriz [[10, 20, 30], [40, 50, 60]]. ¿Qué resultado obtienes y con qué eje se alinea el vector?",
    "¿Cómo se comprueba la compatibilidad de broadcasting desde la derecha? Explica por qué (3, 4) + (4,) funciona, (3, 4) + (3,) falla y (3, 1) permite sumar un valor por fila.",
    "En NumPy quieres sumar 20 al rojo y 10 al verde de una imagen uint8 con canales al final. ¿Cómo aplicarías un único vector a todos los píxeles sin desbordamiento? ¿Qué vector usarías en orden BGR?",
    "Promedias alto y ancho de una imagen de forma (H, W, C). ¿Qué forma tiene la media con y sin keepdims=True? ¿Cómo se resta después una media distinta por canal?",
  ],
  "02.03": [
    "Para los puntos (1, 2) y (4, 6), ¿cómo se calculan las distancias L1, L2 y L∞ y qué mide cada una?",
    "¿Por qué una característica expresada con números mucho mayores puede dominar una distancia aunque no sea más importante? Explica qué revisarías sobre escalas y unidades.",
    "¿Para qué se usan las distancias en visión? Compara los errores (4, 0) y (2, 2): ¿qué distingue L2 que no distingue L1 en este caso?",
  ],
  "02.04": [
    "¿Cómo se calcula el producto escalar de (1, 2) y (3, 4), y cómo se relaciona con las longitudes y el ángulo entre vectores?",
    "¿Por qué dos vectores no nulos con la misma dirección tienen similitud coseno 1 aunque sus longitudes sean distintas? ¿Qué problema aparece con el vector cero?",
    "¿Cómo aparecen los productos escalares en neuronas, convoluciones y atención, y cuándo puede ser útil o perjudicial ignorar la norma de un embedding?",
  ],
  "02.05": [
    "En un producto matricial A @ B, ¿qué dimensiones deben coincidir, cuáles forman la salida y cómo se obtiene el valor de su fila i y columna j?",
    "Para un solo ejemplo, x es un vector NumPy de forma (128,) e y = W @ x + b debe tener 64 componentes. ¿Qué formas necesitas para los pesos W y el vector de sesgos b? ¿Qué calcula cada fila de W?",
    "El array A de NumPy contiene las filas [1, 2, 3] y [4, 5, 6]. A.T y A.reshape(3, 2) tienen la misma forma. ¿Qué primera fila produce cada operación con el orden predeterminado y por qué?",
  ],
  "02.06": [
    "¿Qué mide el rango de una matriz y cómo puede una matriz de shape (3, 3) tener rango 2?",
    "Para una matriz cuadrada A, ¿qué dice un determinante cero sobre la inversa? Si A sí es invertible y solo buscas x en A x = b, ¿por qué usar un solucionador directo?",
    "¿Por qué una matriz invertible puede dar soluciones muy sensibles al redondeo o a pequeños cambios de entrada? Relaciónalo con el número de condición.",
  ],
  "02.07": [
    "¿Qué expresa A v = λ v para un autovector v no nulo? Usa un giro de 90° en el plano para explicar por qué una matriz real no siempre tiene una base de autovectores reales.",
    "En la descomposición en valores singulares A = U Σ Vᵀ, ¿qué papel tienen las direcciones de U y V y los valores de Σ? ¿Cómo se obtiene una aproximación de bajo rango?",
    "¿Qué busca PCA en los datos centrados y por qué podría descartar una señal con poca varianza pero importante para la etiqueta?",
  ],
  "02.08": [
    "¿Qué mide una derivada local? Usa f(x) = x² en x = 3 para distinguir la pendiente del valor de la función.",
    "¿Cómo se organizan las derivadas en un gradiente, un Jacobiano y un Hessiano, y qué información aporta cada uno?",
    "¿Qué tipos de punto pueden tener gradiente cero y por qué un paso de optimización demasiado grande puede invalidar la aproximación local?",
  ],
  "02.09": [
    "Si u = 2x + 1 e y = u², ¿cómo se obtiene dy/dx en x = 1 multiplicando derivadas locales?",
    "¿Cómo se combinan los gradientes cuando una variable participa en dos ramas que llegan a la misma pérdida y en qué sentido se recorre el grafo durante backward?",
    "¿Qué hace backward en PyTorch, qué hace el optimizador y por qué se suelen limpiar los gradientes antes del siguiente paso?",
  ],
  "02.10": [
    "¿Qué representa una distribución de probabilidad y su esperanza? Explica por qué los logits de una red no son automáticamente probabilidades calibradas.",
    "De 10.000 piezas, 10 tienen defecto. Un detector encuentra 9 de esos defectos y da 99 falsas alarmas. ¿Qué fracción de los defectos detecta y qué fracción de las alarmas es un acierto? Explica la diferencia.",
    "¿Por qué elegir un umbral requiere conocer el coste de los falsos positivos y negativos, además de las métricas del modelo?",
  ],
  "02.11": [
    "¿Cómo se diferencian media y mediana ante un valor extremo, y qué relación hay entre varianza, desviación estándar y unidades?",
    "¿Qué indica el signo de la covarianza de dos variables y qué cambia al usar la correlación de Pearson? ¿Por qué una relación positiva no prueba causalidad?",
    "Quieres fijar una media y una desviación estándar por canal para estandarizar imágenes. ¿En qué conjunto y sobre qué ejes las estimas, y cómo las usas en validación y prueba?",
  ],
  "02.12": [
    "¿Por qué sumar logaritmos puede ser más estable que multiplicar muchas probabilidades pequeñas, y qué ocurre con log(1) y log(0)?",
    "Para puntuaciones finitas, ¿cómo se usa el máximo al calcular softmax y log-sum-exp sin exponenciar números grandes? Explica por qué en un caso se cancela el factor común y en el otro hay que recuperar el máximo.",
    "¿Qué evita imponer un suelo positivo ε antes de tomar el logaritmo de una probabilidad y qué información se pierde? Si aparecen NaN o infinitos en el entrenamiento, ¿cómo localizas su origen?",
  ],
  "03.01": [
    "Un píxel vale 250 y otro 10. ¿Qué guarda cv.add con salida uint8 y qué guarda la suma de dos arrays uint8 en NumPy? ¿En qué orden convertirías, sumarías y recortarías para saturar en NumPy?",
    "Un píxel pasa de 100 a 70 entre dos fotogramas. ¿Qué indican la resta con signo (actual − anterior) y la diferencia absoluta? ¿Por qué una diferencia grande no basta para identificar un objeto nuevo?",
    "¿Qué hace una mezcla α·A + β·B + γ y cuándo necesitas una máscara para decidir dónde participa cada imagen?",
  ],
  "03.02": [
    "¿Cómo se leen identidad, brillo y contraste en una curva entrada-salida, y qué detalle puede perderse por recorte?",
    "Para intensidades en [0, 1], ¿cómo cambia un tono intermedio con salida = entrada^γ si 0 < γ < 1 o si γ > 1? ¿Por qué sería arriesgado aplicar la misma regla a otra convención de gamma?",
    "¿Cómo funciona una LUT para una imagen uint8 y por qué una tabla puntual no corrige de forma distinta dos zonas con el mismo valor?",
  ],
  "03.03": [
    "En grises, ¿qué devuelve imagen > T, también cuando la intensidad es igual a T? Con dos máscaras booleanas, ¿cómo seleccionas lo común, lo que está en al menos una o lo que está en exactamente una? ¿Cómo inviertes una máscara?",
    "Una máscara uint8 usa 0 y 255 para elegir entre dos imágenes. ¿Cómo pasarías de selección binaria a mezcla alfa si la máscara también admite grises intermedios? Explica cómo obtener e interpretar el peso.",
    "¿Cómo elige Otsu un umbral y por qué sigue pudiendo fallar con iluminación desigual? Compáralo con un umbral adaptativo.",
  ],
  "03.04": [
    "Un filtro cubre [10, 20, 50] con pesos [¼, ½, ¼] y ancla central. ¿Cómo calculas la salida, dónde la escribes y qué se mantiene al desplazar la ventana?",
    "¿Qué ocurre en una región constante si los pesos de un kernel suman 1 o suman 0, y por qué esa suma no describe todo el comportamiento del filtro?",
    "¿Qué cambia al pasar de un kernel 3×3 a uno 7×7, y cómo reduce el coste que un kernel sea separable?",
  ],
  "03.05": [
    "Con la misma ventana y ancla central, ¿qué cambia entre correlación y convolución para un kernel gaussiano centrado y para [-1, 0, 1]? ¿Cuál de las dos operaciones hace cv.filter2D?",
    "Un kernel de tres pesos cubre las columnas 10, 11 y 12. ¿Dónde se escribe la suma con ancla central y dónde con ancla izquierda? ¿Qué indica eso sobre la alineación de la respuesta?",
    "¿Cómo tratan los límites las políticas constant, replicate, reflect y valid, y qué contorno artificial puede crear el relleno con ceros?",
  ],
  "03.06": [
    "¿Cómo calcula un box blur cada salida y qué puede perderse al aumentar su ventana?",
    "En un filtro gaussiano, ¿cómo varía el peso con la distancia al centro y qué relación debe haber entre sigma y el tamaño de la ventana?",
    "¿Por qué puede ayudar suavizar antes de medir gradientes, qué riesgo tiene hacerlo en exceso y qué ventaja ofrece la separabilidad del Gaussian?",
  ],
  "03.07": [
    "En la ventana [20, 21, 22, 23, 255], ¿qué devuelven la media y la mediana? ¿Por qué su distinta respuesta al impulso puede ayudar con ruido y perjudicar la detección de un defecto puntual?",
    "¿Cómo combina el bilateral distancia espacial y parecido tonal, y qué controlan sigmaSpace y sigmaColor?",
    "¿Por qué el bilateral suele costar más que un Gaussian y cómo decidirías si preservar bordes compensa ese coste?",
  ],
  "03.08": [
    "Si la intensidad de una imagen cambia bruscamente entre columnas y apenas entre filas, ¿qué componente del gradiente de Sobel tendrá mayor magnitud y cómo estará orientado el borde?",
    "Gx y Gy son las derivadas horizontal y vertical de intensidad. Para un gradiente no nulo, ¿qué miden √(Gx² + Gy²) y atan2(Gy, Gx), y cómo obtienes la orientación del borde?",
    "¿Por qué conviene guardar las derivadas en un tipo con signo o float y qué mejora ofrece Scharr frente a Sobel 3×3?",
  ],
  "03.09": [
    "¿Qué mide el Laplaciano y por qué suele combinarse con suavizado antes de buscar contornos?",
    "¿Cómo obtiene unsharp masking la capa de detalle y qué controlan el radio y amount? Explica cómo pueden aparecer halos.",
    "Al enfocar imágenes para detectar defectos, ¿por qué una imagen visualmente más nítida podría empeorar la detección y qué medirías para comprobarlo?",
  ],
  "03.10": [
    "¿Cómo pasa el detector clásico de Canny de las intensidades de una imagen a bordes finos y conectados? Explica el orden y la función de sus cuatro etapas.",
    "Tras adelgazar los bordes en Canny, dos tramos quedan entre los umbrales. Solo uno está unido por respuestas intermedias a un borde fuerte. ¿Cuál conserva la histéresis y por qué no da lo mismo usar un único umbral?",
    "¿Qué errores causan umbrales demasiado bajos, demasiado altos o un suavizado excesivo, y con qué condiciones validarías los parámetros?",
  ],
  "03.11": [
    "¿Qué significa que una imagen contenga frecuencias espaciales bajas o altas y cómo se localizan tras centrar el espectro de Fourier?",
    "¿Cómo pueden dos imágenes desplazadas circularmente tener las mismas magnitudes de Fourier? Explica qué aporta la fase a la reconstrucción.",
    "Multiplicas los espectros discretos de una imagen y un filtro. ¿Qué convolución obtienes al transformar de vuelta sin relleno? ¿Por qué un corte abrupto en frecuencia puede dejar ondulaciones junto a un borde?",
  ],
  "03.12": [
    "¿Qué comprobarías sobre tamaño del defecto, ruido, iluminación, dtype y latencia antes de escoger un filtro?",
    "¿Por qué importa el orden entre suavizado, derivadas, umbral y enfoque, y qué contrato numérico documentarías entre etapas?",
    "¿Cómo compararías un detector con y sin filtro para saber si mejora de verdad? Explica qué mantendrías fijo y qué medirías para no ocultar errores en defectos pequeños.",
  ],
  "04.01": [
    "Una máscara tiene letras negras sobre fondo blanco y el operador trata el blanco como primer plano. ¿Por qué erosionar puede engrosar las letras y cómo prepararías la máscara para erosionar la tinta?",
    "¿Cómo determinan la forma y el tamaño del elemento estructurante qué vecinos participan y qué detalles se consideran pequeños?",
    "En una erosión binaria, ¿qué decide el ancla de la plantilla? Para una pieza blanca pegada al marco, compara rellenar el exterior con negro y replicar los píxeles del borde.",
  ],
  "04.02": [
    "¿Qué condición debe cumplir el vecindario para que un píxel blanco sobreviva a una erosión y por qué pueden desaparecer motas o puentes estrechos?",
    "¿Cómo elegirías la plantilla de erosión si debes preservar un grosor mínimo? Lejos del marco, compara dos pasadas de un cuadrado 3×3 lleno con dos de una cruz 3×3: ¿equivalen ambas a un cuadrado 5×5?",
    "¿Cómo comprobarías que una erosión elimina ruido sin borrar grietas o trazos útiles, incluidos los que tocan el borde de la imagen?",
  ],
  "04.03": [
    "En una máscara con el objeto en blanco, ¿qué basta para que la dilatación active una posición? Si dos piezas quedan conectadas, ¿qué puedes inferir sobre su separación y qué no puedes concluir?",
    "¿Por qué una cruz, un rectángulo y un disco producen expansiones distintas, y qué parámetros registrarías para reproducirlas?",
    "¿Qué ocurre con una mota blanca al dilatar y por qué una apertura puede ser más adecuada para eliminar ruido claro?",
  ],
  "04.04": [
    "Una apertura binaria borra una mota blanca aislada. ¿Por qué no la recupera la dilatación? Explica qué significa que el resultado sea anti-extensivo y que repetir la apertura sea idempotente.",
    "¿Cómo puede el cierre rellenar huecos pequeños y también fusionar objetos, alterando un recuento posterior de componentes?",
    "¿Por qué abrir y después cerrar no garantiza recuperar la imagen original? Relaciona la pérdida de información con polaridad, orientación y escala.",
  ],
  "04.05": [
    "¿Cómo se obtiene el gradiente morfológico y en qué se diferencia de un gradiente diferencial como Sobel?",
    "Un reflejo estrecho sobresale de un fondo claro que varía lentamente. ¿Qué resta calcula el white top-hat y por qué pueden responder tanto el reflejo como una mota de ruido?",
    "Sobre un fondo claro hay una raya oscura horizontal. ¿Qué resta calcula el black-hat y por qué una plantilla que cruza la raya puede destacarla mejor que una paralela?",
  ],
  "04.06": [
    "En grises, una plantilla plana cubre [20, 80, 30]. ¿Qué devuelven erosión y dilatación y por qué no se comportan como un promedio de pesos fijos?",
    "Una ventana contiene solo píxeles RGB rojos (255, 0, 0) y verdes (0, 255, 0). ¿Qué color produce una dilatación por canal? ¿Sobre qué representación operarías si solo quieres ampliar la silueta?",
    "¿Para qué sirven la reconstrucción morfológica, la esqueletización y la transformada de distancia en una forma binaria?",
  ],
  "04.07": [
    "Dos píxeles solo se tocan por una esquina. ¿Cómo los agrupan las conectividades 4 y 8 y cómo elegirías la adecuada?",
    "¿Qué identifica cada entero del mapa de cv.connectedComponentsWithStats, incluido el 0? Distingue qué miden el área, la caja y el centroide de una mancha.",
    "¿Por qué filtrar componentes por área no equivale a reconocer objetos y qué fallos previos de umbral o morfología afectan al recuento?",
  ],
  "04.08": [
    "¿Qué cambia al usar 256 o 16 bins para uint8 y por qué el rango [0, 256) incluye todas las intensidades de 0 a 255?",
    "Un intervalo del histograma contiene 20 de 100 píxeles en un recorte y 40 de 200 en otro. ¿Cómo compararías su frecuencia y qué dato guardarías para no perder la información de área?",
    "¿Por qué dos imágenes con los píxeles en lugares distintos pueden compartir histograma y qué límite impone eso a un umbral como Otsu?",
  ],
  "04.09": [
    "Quieres saber si los píxeles rojos son saturados o apagados. ¿Por qué contar por separado tono y saturación no basta? Compara el número de celdas de esos dos histogramas con el de uno conjunto de 30 × 32 intervalos.",
    "¿Por qué hay que tratar el tono como circular y desconfiar de él cuando la saturación es baja? Explica por qué HSV no elimina todos los efectos de iluminación.",
    "¿Cómo limita una máscara los píxeles que cuenta calcHist y qué convenciones deben coincidir al comparar histogramas entre imágenes?",
  ],
  "04.10": [
    "En una imagen de grises, ¿cómo obtienes del histograma la fracción de píxeles con intensidad menor o igual que t? Explica cómo usa la ecualización esa distribución acumulada y qué ocurre si muchos píxeles tienen idéntico valor.",
    "¿En qué se diferencian el estiramiento lineal de contraste y la ecualización mediante CDF, y qué detalle perdido no puede recuperar ninguno?",
    "¿Por qué una misma CDF puede mejorar una zona y perjudicar otra, y qué riesgo tiene ecualizar R, G y B por separado?",
  ],
  "04.11": [
    "En CLAHE de OpenCV, ¿qué significa tileGridSize=(8, 4)? Si aumentas el número de teselas sin cambiar la imagen, ¿qué ganas en adaptación local y qué riesgo corres?",
    "¿Cómo limita CLAHE la amplificación de contraste y por qué no conviene copiar el mismo clip limit entre bibliotecas sin comprobar su definición?",
    "Dos teselas de CLAHE asignan intensidades de salida distintas al mismo gris. ¿Qué se interpola en su frontera y por qué, aun sin costuras visibles, podrían aumentar las falsas alarmas de un detector?",
  ],
  "04.12": [
    "¿Qué significa un valor alto o bajo al comparar histogramas con correlación, intersección, chi-cuadrado o Bhattacharyya, y qué convenciones comprobarías?",
    "¿Qué devuelve la retroproyección de un histograma de color y por qué una respuesta alta no es una caja ni una probabilidad necesariamente calibrada?",
    "Quieres contar tabletas claras sobre una cinta oscura. ¿Qué aportan el umbral, la apertura, el cierre y el etiquetado de componentes? ¿Cómo distinguirías las fusiones causadas por el cierre de las tabletas que ya se tocaban?",
  ],
  "05.01": [
    "¿Cómo se expresa una transformación afín de un punto 2D? Parte del origen y compara trasladarlo por (3, −2) y girarlo 180° alrededor del origen con aplicar las mismas operaciones en orden inverso.",
    "¿Qué conserva una transformación afín invertible y por qué puede cambiar ángulos y longitudes sin modelar una perspectiva general?",
    "Al rotar una foto, ¿qué haces si un píxel de salida corresponde a una posición entre muestras de entrada? Distingue ese caso de caer fuera de la entrada y de recortar el contenido por el tamaño del lienzo.",
  ],
  "05.02": [
    "Una máscara solo contiene las clases 0 y 2. Al ampliarla, ¿cómo asignan una etiqueta el vecino más próximo y la interpolación bilineal? ¿Por qué solo el primero garantiza no inventar una clase?",
    "¿Por qué reducir una imagen puede generar aliasing y qué papel tienen un filtro paso bajo y una opción como INTER_AREA?",
    "Reduces una imagen de 100×100 a 50×50 sin recortar. Si las coordenadas son continuas desde la esquina exterior, ¿dónde queda (60, 20)? ¿Cómo mantienes alineadas las cajas y una máscara de clases?",
  ],
  "05.03": [
    "¿Cómo permite una matriz 3×3 incluir traslación y, con vectores columna, en qué orden actúan las matrices de B·A·p?",
    "En coordenadas homogéneas, ¿por qué (6, 4, 2) y (3, 2, 1) representan el mismo punto? Distingue una tercera componente pequeña respecto a las otras de una que sea exactamente cero.",
    "¿Dónde aparecen las coordenadas homogéneas en visión y por qué debes declarar si utilizas vectores fila o columna?",
  ],
  "05.04": [
    "¿Por qué cuatro pares de puntos pueden determinar una homografía entre dos imágenes? Indica la condición geométrica para esos cuatro pares y qué harías si hubiera ruido o emparejamientos falsos.",
    "¿Por qué una homografía puede rectificar una hoja plana, pero no alinear en general objetos a distintas profundidades cuando existe paralaje?",
    "Una homografía reproduce bien las cuatro esquinas con las que la ajustaste. ¿Cómo usarías otros puntos del plano y el contorno proyectado para comprobar si la rectificación es fiable?",
  ],
  "05.05": [
    "En una cámara pinhole ideal, ¿cómo intervienen la pose, las focales en píxeles y el punto principal al proyectar un punto 3D? ¿Por qué conocer el píxel resultante no fija la profundidad?",
    "¿Cómo ayuda un patrón conocido a calibrar y por qué no basta un error medio bajo sin comprobar la cobertura del encuadre?",
    "Recortas una imagen calibrada sin cambiar la escala. ¿Qué pasa con el punto principal y la focal en píxeles? Distingue ese cambio de redimensionar la imagen o sustituir la cámara.",
  ],
  "05.06": [
    "¿Cómo cambia una ventana al desplazarla en una zona uniforme, un borde o una esquina, y qué estructura local aprovecha Harris?",
    "¿Qué representa un bit de un descriptor ORB en su configuración habitual? ¿Cómo se comparan dos de esos descriptores y por qué una textura repetida puede producir parejas falsas?",
    "Conoces la transformación entre dos vistas. ¿Cómo medirías la repetibilidad de un detector en la zona visible en ambas? ¿Por qué redetectar un punto no garantiza emparejarlo bien?",
  ],
  "05.07": [
    "Para un descriptor, las dos menores distancias a candidatos son 12 y 20; para otro, 18 y 20. Con umbral 0,8 en el ratio test, ¿en qué caso conservarías el mejor candidato? ¿Qué queda por comprobar sobre la geometría?",
    "¿Cómo busca consenso RANSAC y qué papel tienen el modelo, el umbral de error, las iteraciones y la distribución de inliers?",
    "Una homografía tiene muchos inliers concentrados en una esquina. ¿Qué verificarías antes de aceptar la alineación del resto de la imagen?",
  ],
  "05.08": [
    "¿Qué suposiciones hace Lucas–Kanade sobre brillo y movimiento local, y por qué un borde aislado sufre el problema de apertura?",
    "Un punto avanza 16 píxeles entre fotogramas. ¿Por qué empezar a un cuarto de escala ayuda a Lucas–Kanade, y por qué una pirámide no resuelve por sí sola una oclusión, un cambio de luz o la falta de textura?",
    "¿Cómo comprobarías un seguimiento hacia delante y atrás, y qué información falta para convertir píxeles por fotograma a metros por segundo?",
  ],
  "05.09": [
    "¿Por qué una ROI no tiene que ser rectangular y en qué se diferencia de recorrer una imagen mediante tiles de una rejilla?",
    "En un eje, las teselas miden T píxeles y los inicios distan S > 0 píxeles. ¿Cuándo hay solape y cuándo hay huecos? Aunque S ≤ T, ¿cómo cubrirías un extremo que no coincide con la rejilla?",
    "Una tesela de origen (x0, y0) se redimensiona sin relleno multiplicando sus coordenadas locales por sx y sy. ¿Cómo llevas el punto predicho (u, v) a la imagen original? ¿Cómo repartirías las teselas entre entrenamiento y prueba sin compartir escenas?",
  ],
  "05.10": [
    "Un detector pierde objetos cuando el borde de una tesela los parte en dos. ¿Por qué una segunda rejilla desplazada podría recuperarlos y cuándo seguiría sin ver el objeto completo?",
    "¿Por qué las cajas deben pasar a coordenadas globales antes de fusionarse y qué costes y errores adicionales introducen las vistas solapadas?",
    "¿Cómo compararías dos rejillas de teselas en cobertura de objetos, detección cerca de las costuras, duplicados y tiempo total? Si además devuelven probabilidades por clase, ¿cómo reconstruirías una máscara en el solape?",
  ],
  "06.01": [
    "Un operario debe marcar cada grieta de una pieza fotografiada. ¿Qué entrada y salida especificarías, por qué no basta una clase por foto y qué dos tipos de error distinguirías?",
    "¿Qué diferencia hay entre muestra y etiqueta, y por qué varias fotos de una misma pieza no deben tratarse como piezas independientes al evaluar?",
    "¿Para qué sirve una línea base sencilla y qué protocolo fijarías antes de compararla con un modelo más complejo?",
  ],
  "06.02": [
    "¿Por qué repartir recortes vecinos de una foto entre entrenamiento y prueba puede inflar los aciertos? ¿Cómo cambiarías la partición si el objetivo fuera predecir en piezas nuevas o en capturas futuras?",
    "Quieres normalizar intensidades o aprender una proyección por componentes principales. ¿Cuándo separas los datos y qué transformación aplicas a validación y prueba?",
    "¿Cómo detectarías en una prueba copias de imágenes de entrenamiento, orígenes compartidos o metadatos que delaten la etiqueta? ¿Qué comprobarías si debe representar capturas futuras?",
  ],
  "06.03": [
    "¿Qué partición usas para ajustar pesos, cuál para elegir el umbral y cuál para estimar el rendimiento final? ¿Qué cambia si retocas el sistema tras ver esa última estimación?",
    "¿Qué aporta la validación cruzada y por qué sus pliegues deben respetar pacientes, documentos o tiempo cuando las muestras están relacionadas?",
    "Pruebas muchas configuraciones en una validación pequeña. ¿Por qué el mejor porcentaje puede ser inestable y qué información darías además de ese valor?",
  ],
  "06.04": [
    "Representas cada imagen únicamente por el área del objeto y su intensidad media. ¿Qué información pierdes y cómo puede afectar la escala de esas dos variables a la búsqueda del vecino más cercano?",
    "En clasificación por vecinos próximos, ¿qué cambia al pasar de un vecino a varios? ¿Cómo tratarías los empates y una consulta alejada de todos los ejemplos?",
    "Un clasificador por vecinos próximos conserva los ejemplos etiquetados. ¿Qué coste implica al predecir y cómo elegirías la escala, las características y el número de vecinos sin repetir pacientes entre particiones?",
  ],
  "06.05": [
    "En una máquina de vectores de soporte, ¿qué distingue a los ejemplos que fijan la frontera y por qué puede cambiar esa frontera al reescalar una variable?",
    "En una máquina de vectores de soporte de margen blando, ¿qué compromiso controla C y cómo decidirías si conviene subirlo o bajarlo?",
    "¿Cómo permite un núcleo no lineal obtener una frontera curva en una máquina de vectores de soporte? ¿Qué faltaría para interpretar su puntuación como probabilidad?",
  ],
  "06.06": [
    "En un árbol de clasificación, ¿cómo se elige una división en un nodo interno y cómo se obtiene la clase predicha al llegar a una hoja?",
    "¿Por qué un árbol profundo puede acertar casi todo el entrenamiento y fallar en casos nuevos? ¿Qué controles de complejidad compararías en validación?",
    "¿Por qué combinar árboles distintos en un bosque aleatorio puede estabilizar las predicciones sin que la importancia de una variable demuestre causalidad?",
  ],
  "06.07": [
    "Un modelo falla tanto en entrenamiento como en validación. Además de su capacidad, ¿qué revisarías en la tarea, los datos y el proceso de ajuste?",
    "Si el error de entrenamiento es bajo y el de validación alto, ¿cómo investigarías el sobreajuste y por qué repetir piezas entre ambos conjuntos podría ocultarlo?",
    "¿Cómo compararías el efecto de añadir datos con el de aumentar la capacidad del modelo? ¿Qué buscarías en las curvas de error de entrenamiento y validación?",
  ],
  "06.08": [
    "Al comparar dos clasificadores, ¿qué condiciones mantendrías iguales y dónde ajustarías sus umbrales para no confundir una mejora del algoritmo con una ventaja en los datos?",
    "Dos modelos empatan en F1 global, la media armónica de precisión y sensibilidad. ¿Qué revisarías por cámara o paciente y qué costes podrían inclinar la decisión?",
    "Dos modelos ya fijados difieren en un solo acierto sobre diez casos de prueba. ¿Cómo informarías esa ventaja y por qué no basta para afirmar que uno es superior?",
  ],
  "07.01": [
    "En una neurona que calcula z = w·x + b, ¿qué papeles tienen los pesos y el sesgo? ¿Cuánto vale z si x=2, w=3 y b=−1?",
    "¿Para qué se introduce una activación no lineal entre capas y qué ocurre si solo se componen matrices y sesgos?",
    "En un clasificador supervisado, ¿cómo se ajustan los pesos y el sesgo de una neurona y por qué su puntuación cruda no tiene por qué ser una probabilidad?",
  ],
  "07.02": [
    "¿Qué hace ReLU con valores negativos y positivos, y por qué no representa por sí sola la probabilidad de una clase?",
    "¿Cuándo usarías una sigmoide por etiqueta y cuándo un softmax entre clases? ¿Cómo comprobarías si una confianza de 0,9 está bien calibrada?",
    "¿Por qué CrossEntropyLoss de PyTorch recibe normalmente logits y qué problema puede causar aplicar softmax antes?",
  ],
  "07.03": [
    "En PyTorch, un lote de ocho muestras con cuatro características entra en Linear(4, 3). ¿Qué dimensiones tienen la salida y la matriz de pesos, y cuántos parámetros hay con sesgo?",
    "¿Qué gana una red al alternar capas afines con activaciones no lineales y por qué esa capacidad adicional no garantiza menos errores en casos nuevos?",
    "Al aplanar una imagen de altura H, anchura W y C canales, ¿qué se conserva y qué deja de estar explícito? ¿Cómo crece el número de pesos de una capa densa con la resolución?",
  ],
  "07.04": [
    "En clasificación, ¿cuánto vale la pérdida −ln(p) si la probabilidad p de la clase verdadera es 0,8 y si es 0,1? ¿Por qué el porcentaje de aciertos no refleja esa diferencia de confianza?",
    "¿Qué entradas espera CrossEntropyLoss de PyTorch en multiclase y por qué una tarea multietiqueta suele necesitar otra formulación?",
    "¿Por qué minimizar la pérdida no fija automáticamente el umbral operativo ni garantiza probabilidades calibradas?",
  ],
  "07.05": [
    "Al entrenar una red, ¿qué se calcula en la pasada hacia delante y en la retropropagación? ¿Qué efecto tienen una derivada nula o muchas derivadas de módulo pequeño en una misma ruta?",
    "¿Cómo se combinan las contribuciones de un peso usado en varias rutas y qué ocurre si no limpias gradientes entre lotes?",
    "En PyTorch, ¿qué tareas distintas realizan loss.backward(), optimizer.step() y optimizer.zero_grad()? ¿Hacia dónde se mueve un peso en descenso de gradiente básico?",
  ],
  "07.06": [
    "En descenso estocástico sin impulso, un peso vale 2, su gradiente es 3 y la tasa es 0,1. ¿Qué valor toma tras un paso? ¿En qué sentido se movería con gradiente negativo?",
    "¿Qué información histórica usan momentum y Adam, y por qué deben compararse bajo el mismo presupuesto y protocolo?",
    "¿Por qué reducirías la tasa de aprendizaje al final del entrenamiento y qué comprobarías si, en vez de estabilizarse, la pérdida se dispara?",
  ],
  "07.07": [
    "¿Por qué sumar una penalización cuadrática (L2) en Adam no equivale en general al decaimiento desacoplado de AdamW? ¿Cómo se manifiesta una regularización excesiva?",
    "En PyTorch, ¿cómo cambia Dropout entre entrenamiento e inferencia y por qué importa llamar a model.eval() si la red también usa normalización por lotes (BatchNorm)?",
    "¿Por qué pueden ayudar los ejemplos independientes y las transformaciones que preservan la etiqueta, pero no reparar etiquetas erróneas ni una partición con fuga?",
  ],
  "07.08": [
    "¿Qué ilustra multiplicar muchas derivadas locales de 0,5 o de 1,5 y por qué ese ejemplo escalar no describe toda una red real?",
    "¿Cómo eligen He y Xavier la escala inicial de los pesos? ¿Qué ruta de gradiente ofrece un atajo de identidad y por qué no garantiza por sí solo un entrenamiento estable?",
    "¿Qué medirías para localizar gradientes inestables? ¿En qué casos ayuda recortar su norma antes de actualizar los pesos y en cuáles no?",
  ],
  "08.01": [
    "Recorres una vez 100 ejemplos, sin reemplazo, en lotes de hasta 32 y conservas el último. ¿Cuántos lotes hay y por qué podrían hacerse menos actualizaciones que lotes?",
    "¿Cómo afecta el tamaño de lote a la memoria y a la variabilidad del gradiente? ¿En qué condiciones acumular gradientes de lotes pequeños se aproxima a usar uno grande?",
    "¿Por qué dos entrenamientos de diez épocas pueden tener costes distintos? ¿Qué diferencias de orden y preprocesado esperarías entre entrenamiento y validación?",
  ],
  "08.02": [
    "Solo el 1 % de las piezas tiene defecto. ¿Por qué un lote aleatorio de 16 piezas puede no contener ninguno y qué se gana, y qué no, al repetir fotos de defectos?",
    "Para entrenar con defectos raros, ¿en qué se diferencian muestrear más positivos y darles más peso en la pérdida? ¿Qué riesgo tiene hacer ambas cosas a la vez?",
    "¿Qué distribución de prueba necesitas para estimar la proporción de alarmas correctas en producción? ¿Por qué no puedes trasladar directamente ese valor desde una prueba equilibrada al 50 %?",
  ],
  "08.03": [
    "Reflejas horizontalmente una foto con cajas y una máscara de clases. ¿Cómo mantienes la alineación y qué interpolación conviene para la máscara si además cambias su tamaño?",
    "¿Por qué una rotación válida para células puede ser incorrecta para dígitos, y qué debe preservar una simulación de ruido o color?",
    "¿Por qué se reservan normalmente para entrenamiento las transformaciones aleatorias de imagen? Si el sistema combina varias vistas en inferencia, ¿qué tendrías que fijar al evaluarlo?",
  ],
  "08.04": [
    "Una intensidad es 150 y su canal tiene media 100 y desviación estándar 25 en entrenamiento. ¿Qué valor da al estandarizarla y cómo tratarías un canal con desviación cero?",
    "Para estandarizar una colección de imágenes por canal, ¿sobre qué imágenes y ejes estimas la media y la desviación? ¿Qué comprobarías antes de usar esas constantes con otra cámara?",
    "¿Por qué hay que respetar canales, rango y normalización de unos pesos preentrenados, y en qué se diferencia normalizar por imagen de usar estadísticas globales?",
  ],
  "08.05": [
    "Un calendario multiplica por 0,1 una tasa de aprendizaje inicial de 0,1. ¿Qué tasa queda tras un descenso y qué eventos pueden hacer avanzar otros calendarios?",
    "¿Qué pasa si haces avanzar un calendario de tasa de aprendizaje después de cada lote cuando estaba previsto hacerlo después de cada época? ¿Cómo lo detectarías en el registro?",
    "¿Cómo elegirías la tasa inicial, el periodo de aumento gradual y el momento de reducir la tasa? ¿Por qué no basta una curva de entrenamiento estable?",
  ],
  "08.06": [
    "¿Qué métrica, dirección, tolerancia y paciencia definirías antes de parar un entrenamiento por validación?",
    "¿Qué guardarías para inferencia y qué estados adicionales necesitas para reanudar entrenamiento de forma consistente?",
    "¿Por qué elegir los pesos de una época según los resultados de prueba invalida esa evaluación? ¿Con qué datos elegirías la época y qué dejarías registrado?",
  ],
  "08.07": [
    "Para poder reconstruir un entrenamiento, ¿qué guardarías sobre las imágenes, su reparto entre conjuntos, el código y la configuración de la ejecución?",
    "¿Qué fuentes de aleatoriedad pueden tener estados distintos y qué coste o límite puede tener exigir algoritmos deterministas?",
    "¿Qué averiguas al entrenar con varias semillas manteniendo fijos los datos, y por qué no debes publicar solo la ejecución que mejor salió en la prueba?",
  ],
  "08.08": [
    "Durante el entrenamiento se transforman imágenes al azar y se anulan activaciones con Dropout. ¿Por qué la pérdida puede ser mayor que en validación sin que haya fuga y cómo harías una comparación directa?",
    "¿Qué investigarías en cada caso: baja la pérdida de entrenamiento pero sube la de validación, ambas siguen altas, o la validación resulta inesperadamente perfecta?",
    "¿Cómo usarías las falsas alarmas y omisiones de validación para diseñar el siguiente experimento sin cambiar el criterio de comparación ni consultar la prueba?",
  ],
  "09.01": [
    "¿Cuántos pesos usa un filtro 3×3 con C canales de entrada y por qué reutilizarlos espacialmente reduce parámetros frente a una capa densa?",
    "En Conv2d de PyTorch sin grupos, ¿qué representan los cuatro ejes de los pesos y cómo se combinan los canales rojo, verde y azul para producir un solo canal de salida?",
    "¿Cómo contribuyen distintas posiciones al gradiente de un filtro compartido y por qué una activación fuerte no demuestra una etiqueta semántica fija?",
  ],
  "09.02": [
    "Un filtro de tres píxeles contiguos recorre con paso 1 un eje de longitud 8. ¿Cuántas ventanas caben sin relleno y cuántas si añades un píxel a cada lado?",
    "Un filtro de tres píxeles contiguos recorre con paso 2 una fila de longitud 8 con un píxel de relleno a cada lado. ¿Cuántos valores produce y qué riesgo hay para los detalles pequeños?",
    "En un eje de longitud L, una convolución usa k muestras con dilatación d, relleno p por lado y paso s. ¿Cuál es el ancho efectivo del filtro y cómo calculas la longitud de salida?",
  ],
  "09.03": [
    "¿Por qué una salida interior de dos convoluciones consecutivas de 3×3, paso 1 y sin dilatación puede depender de 5×5 píxeles? ¿Qué tendrías que seguir si cambian el paso o la dilatación?",
    "¿Por qué estar dentro del campo receptivo teórico no significa que todos los píxeles influyan igual en la salida?",
    "¿Cómo pueden fallar las predicciones si un objeto ocupa muy pocos píxeles antes de reducir la resolución o si es mayor que el campo receptivo de la red?",
  ],
  "09.04": [
    "Una ventana de 2×2 tiene filas (1, 2) y (3, 9). ¿Qué conservan, respectivamente, la agrupación por máximo y por media, y qué información espacial pierdes con ambos valores?",
    "Un filtro unidimensional toma tres muestras con dilatación 2. ¿Por qué abarca cinco posiciones sin necesitar cinco pesos y en qué se diferencia la dilatación del paso entre ventanas?",
    "¿Por qué una reducción espacial aceptable para clasificación puede borrar detalles necesarios para segmentación?",
  ],
  "09.05": [
    "Un bloque residual con atajo de identidad devuelve x + F(x). ¿Qué ocurre si F(x)=0 y qué habría que hacer con el atajo si la rama F cambia los canales o la resolución?",
    "Al derivar la salida residual x + F(x) respecto a x, ¿qué contribución evita atravesar F y por qué eso ayuda sin garantizar una optimización estable?",
    "¿Cómo reutilizarías una red residual ResNet como extractor para clasificar imágenes, detectar objetos o segmentarlos? ¿Qué comprobarías antes de escogerla?",
  ],
  "09.06": [
    "Con pocos datos etiquetados, ¿cómo construirías una primera referencia usando un extractor preentrenado y una cabeza nueva? ¿Qué preprocesado de entrada conservarías?",
    "¿Cuándo ajustarías parte del extractor preentrenado y por qué marcar sus parámetros con requires_grad=False en PyTorch no impide que cambien las estadísticas de normalización por lotes?",
    "¿Cómo distinguirías una mejora real por transferencia de pesos de una simple reducción del error de entrenamiento frente a un modelo entrenado desde cero?",
  ],
  "09.07": [
    "Con filtros de 3×3, 16 canales de entrada, 32 de salida y sin sesgos, ¿cuántos pesos necesita una convolución estándar? Compárala con un filtro espacial por entrada seguido de una mezcla 1×1.",
    "¿Por qué una red con menos parámetros y operaciones aritméticas por imagen puede tardar más en responder en el dispositivo de destino?",
    "¿Cómo compararías cambios en el número de canales, la profundidad de una red y la resolución de entrada sin ocultar errores en objetos pequeños o subgrupos?",
  ],
  "09.08": [
    "Si el alto y el ancho de una imagen son pares y los reduces a la mitad, ¿cuántas posiciones espaciales quedan respecto al original y por qué no se reduce en igual proporción todo el tiempo de ejecución?",
    "¿Cómo puede un mismo extractor de características servir para clasificar, localizar o segmentar? ¿Qué aporta combinar sus mapas de capas tempranas y profundas?",
    "Para elegir una arquitectura en el dispositivo final, ¿cómo medirías el coste del recorrido completo, incluido redimensionar, dividir en recortes y unir predicciones? ¿Qué errores compararías además?",
  ],
  "10.01": [
    "Si cada foto pertenece a una sola clase, ¿qué expresa softmax sobre sus puntuaciones? ¿Por qué elegir la mayor con argmax no permite, por sí solo, rechazar un caso dudoso?",
    "En clasificación multietiqueta, ¿cómo se pasa de una salida sigmoide por clase a predecir varias etiquetas o ninguna? ¿Por qué las salidas no tienen que sumar uno?",
    "En una tarea multietiqueta, ¿cómo distinguirías una ausencia de una anotación desconocida? ¿Qué miden la coincidencia exacta, el F1 micro y el F1 macro, y para qué revisar cada etiqueta por separado?",
  ],
  "10.02": [
    "¿Por qué transformar un logit con sigmoid no garantiza calibración ni convierte 0,5 en el umbral óptimo?",
    "Si omitir un defecto es muy costoso, ¿qué compromiso estudiarías al bajar el umbral y con qué datos lo elegirías?",
    "¿Cómo puede un detector ordenar bien las piezas por riesgo y asignarles probabilidades mal calibradas? ¿Qué contrastarías al trasladarlo a producción?",
  ],
  "10.03": [
    "Si «defecto» es la clase positiva, ¿cómo se interpretan las cuatro combinaciones entre el estado real de una pieza y la decisión de emitir una alarma o dejarla pasar?",
    "De 10 piezas defectuosas detectas 8. De 90 piezas buenas, 9 generan alarma. ¿Cuáles son los cuatro conteos de la matriz de confusión y qué puede ocultar el porcentaje global de aciertos?",
    "En una matriz con clases reales por filas y predichas por columnas, ¿qué representa cada casilla y cómo cambia la lectura si normalizas por filas o por columnas?",
  ],
  "10.04": [
    "Hay ocho defectos detectados, dos falsas alarmas y dos defectos omitidos. ¿Qué valores dan la precisión positiva, la sensibilidad y F1? ¿Cómo informarías una métrica con denominador cero?",
    "Con puntuaciones fijas, se da alarma si la puntuación alcanza el umbral. ¿Qué puede ocurrir con la sensibilidad, las falsas alarmas y la precisión positiva al bajar ese umbral?",
    "¿Por qué el F1 de la clase positiva no cambia al añadir negativos correctamente descartados y puede favorecer un umbral económicamente costoso?",
  ],
  "10.05": [
    "Al variar el umbral de un clasificador binario, ¿qué representan los ejes de la curva ROC y los de la curva precisión–sensibilidad? ¿Cuál es la referencia de precisión si se ordenan las muestras al azar?",
    "¿Por qué el área bajo la curva ROC o la precisión media no bastan para elegir un umbral, sobre todo si las curvas de dos modelos se cruzan en el rango de falsas alarmas admisible?",
    "Una inspección tiene una tasa de falsos positivos del 1 % y recibe 100 000 piezas buenas. ¿Cuántas falsas alarmas supone y por qué necesitas también los conteos y la prevalencia para interpretar el resultado?",
  ],
  "10.06": [
    "Para predicciones de probabilidad de defecto, ¿cómo construirías una curva de calibración agrupando puntuaciones similares y cómo mostrarías la incertidumbre de cada grupo?",
    "¿Cómo puede una transformación estrictamente creciente dejar intacto el orden de los casos y alterar sus probabilidades? ¿Qué penalizan la puntuación de Brier y la pérdida logarítmica?",
    "¿Con qué puntuaciones y etiquetas ajustarías un calibrador de probabilidades sin fuga y por qué lo revisarías si cambia la prevalencia de defectos?",
  ],
  "10.07": [
    "Cada falsa alarma cuesta 1 unidad y cada omisión cuesta 10. ¿Qué coste tienen cuatro falsas alarmas y dos omisiones, y por qué minimizarlo puede llevar a otro umbral que maximizar F1?",
    "Un inspector solo puede revisar las k piezas de mayor puntuación cada día. ¿Qué conteos y proporciones usarías para saber si se aprovechan esas revisiones y cuántos defectos quedan fuera?",
    "Si disminuye la proporción de defectos, ¿por qué puede bajar la fracción de alarmas correctas aunque sensibilidad y especificidad no cambien? ¿Qué revisarías en producción?",
  ],
  "10.08": [
    "¿Por qué el mapa de activación por gradientes Grad-CAM puede cambiar según la clase y la capa elegidas? ¿Qué impide interpretarlo como contorno exacto o como prueba de causalidad?",
    "Un mapa de explicación de un clasificador de radiografías resalta el nombre del hospital. ¿Cómo comprobarías si el modelo depende de ese texto y si el efecto se mantiene en otro centro?",
    "Dos métodos de explicación resaltan regiones distintas en una misma foto. ¿Por qué pueden discrepar y qué documentarías y revisarías antes de interpretar esos mapas?",
  ],
  "11.01": [
    "¿Qué guarda cada formato xyxy, xywh y cxcywh y cómo se calculan ancho y alto de (10, 20, 30, 50) en xyxy continuo?",
    "Un recorte empieza en (100, 40) de la imagen. Su caja, en píxeles locales y como dos esquinas, es (5, 7, 25, 17). ¿Cuál es la caja global? ¿Qué habría que invertir primero si la red hubiera visto un recorte redimensionado?",
    "Una caja debe quedar dentro de una imagen de ancho W y alto H. ¿Cómo comprobarías el orden y los límites de sus bordes continuos y cómo convertirías coordenadas normalizadas a píxeles?",
  ],
  "11.02": [
    "Dos cajas de 100 px² cada una comparten 60 px². ¿Cuál es el área de su unión y cuál es su intersección sobre unión (IoU)? ¿Qué valores de IoU corresponden a cajas disjuntas o idénticas de área positiva?",
    "Dadas dos cajas por sus bordes continuos, ¿cómo calculas el ancho, el alto y el área de intersección sin obtener longitudes negativas? ¿Qué harías al calcular la intersección sobre unión si la unión vale cero?",
    "¿Qué mide la intersección sobre unión de una caja y su referencia, qué no dice sobre la confianza y los errores del detector, y por qué pesa más un desplazamiento de dos píxeles en una caja pequeña?",
  ],
  "11.03": [
    "Al evaluar cajas con asignación uno a uno, ¿por qué se recorren de mayor a menor confianza y qué condiciones debe cumplir una anotación para emparejarse con una predicción?",
    "Varias cajas de una clase cubren el mismo objeto anotado. ¿Por qué no son varios aciertos y en qué se diferencia suprimir duplicados de emparejar predicciones con anotaciones?",
    "En detección por clase, ¿cómo cuentas un objeto sin caja válida y una predicción sin referencia válida? ¿Qué errores produce una caja bien localizada que anuncia la clase equivocada?",
  ],
  "11.04": [
    "En la supresión no máxima de cajas (NMS), ¿para qué se usan la confianza y la intersección sobre unión? ¿Qué efecto tiene bajar el umbral de solapamiento?",
    "¿Qué cajas compiten cuando un detector aplica supresión no máxima por clase? ¿Por qué hay que comprobar su posprocesado antes de explicar una omisión o un duplicado?",
    "¿Cómo puede la supresión no máxima eliminar una de dos personas bien detectadas y próximas entre sí? ¿Qué compararías en escenas concurridas para medir ese riesgo?",
  ],
  "11.05": [
    "¿Cómo se usan las cajas de referencia o anclas al entrenar un detector y por qué sus tamaños y proporciones pueden perjudicar a objetos de geometría poco habitual?",
    "¿Cómo reconstruye el detector FCOS una caja desde un punto del mapa sin anclas? ¿Qué decisiones de asignación y posprocesado siguen haciendo falta?",
    "¿Qué compararías sobre tamaño de objeto, latencia, pérdidas y asignación antes de concluir que una familia de detectores es superior?",
  ],
  "11.06": [
    "¿Cómo combina una pirámide de características (FPN) el detalle de los mapas finos con el contexto de los profundos? ¿Por qué eso no recupera un objeto ya borrado al reducir la imagen?",
    "¿Qué diferencia organizativa hay entre Faster R-CNN y un detector de una etapa, y por qué eso no determina por sí solo la velocidad?",
    "¿Cómo evaluarías la detección por tamaño de objeto si un sistema trabaja con imágenes completas y otro con recortes? ¿En qué marco compararías sus predicciones?",
  ],
  "11.07": [
    "Para una clase y un solapamiento mínimo fijados, ¿cómo construyes la curva de precisión y sensibilidad de un detector? ¿Por qué la precisión media (AP) no es el producto de ambas ni el F1 de un solo corte?",
    "Al evaluar cajas, ¿qué cambia entre AP@0,50 y AP@0,75, y qué se promedia en la medida principal de precisión media del protocolo COCO?",
    "Para comparar la precisión media entre clases (mAP) de dos detectores, ¿qué datos y reglas deben ser comunes, qué ajustes deben declararse y qué fallos por tamaño puede ocultar el promedio?",
  ],
  "11.08": [
    "Un recorte se redimensionó y después se añadió relleno para pasarlo al detector. ¿Cómo llevas cada esquina de una caja, en píxeles de esa entrada, hasta las coordenadas de la imagen completa?",
    "Al detectar objetos por recortes, ¿cómo ayudan el solapamiento o una segunda rejilla desplazada a los objetos cortados y por qué debes convertir las cajas a un marco común antes de eliminar duplicados?",
    "¿Cómo compararías tamaños y solapamientos de recortes teniendo en cuenta los objetos omitidos cerca de las costuras, los duplicados, el tiempo y la memoria? ¿Cómo separarías entrenamiento y prueba?",
  ],
  "12.01": [
    "Dos coches circulan por una carretera. ¿Qué información conservarías en una máscara semántica, en máscaras de instancias y en una segmentación panóptica? Distingue objetos contables (things) de superficies como la carretera (stuff).",
    "Un segmentador produce un mapa más pequeño que la imagen. ¿Cómo lo ampliarías si ya contiene identificadores de clase? ¿Qué harías si aún contiene una probabilidad por clase y píxel, y cómo comprobarías que el resultado no se desplazó?",
    "¿Por qué hay que acordar bordes, clases y píxeles ignorados al anotar, y por qué una máscara plausible no garantiza separar objetos adyacentes?",
  ],
  "12.02": [
    "La máscara de referencia marca 10 píxeles de defecto; la predicción marca 8. Hay 6 píxeles comunes. ¿Cuántos píxeles tiene la unión y qué valores dan IoU y Dice? Explica por qué no se puede informar uno con el nombre del otro.",
    "Quieres informar la IoU media entre clases (mIoU) de un segmentador. ¿Cómo calcularías esa media y qué declararías sobre el fondo y sobre una clase que no aparece en ninguna máscara, real ni predicha?",
    "Dos máscaras bien ajustadas, una de un objeto diminuto y otra de uno grande, se desplazan un píxel respecto a sus referencias. ¿Por qué puede caer mucho más la IoU del objeto diminuto y cómo lo harías visible en el informe?",
  ],
  "12.03": [
    "En una segmentación hay pocos píxeles de defecto y algunos bordes sin etiqueta fiable. ¿Qué mide la entropía cruzada por píxel? Distingue dar más peso a la clase defecto de excluir un píxel mediante ignore_index.",
    "Quieres entrenar un segmentador con Soft Dice. ¿Por qué se usan probabilidades en vez de etiquetas duras? ¿Qué detalles de su cálculo revisarías y cómo comprobarías si conviene combinarlo con entropía cruzada?",
    "En un conjunto de máscaras, el 99% de los píxeles son fondo y el resto son defecto. ¿Cómo podría un segmentador conseguir un 99% de exactitud sin detectar ningún defecto? ¿Qué medidas de la clase defecto lo revelarían?",
  ],
  "12.04": [
    "Tienes una pose anotada con puntos (x, y). ¿Cómo actualizarías los puntos al cambiar el tamaño, recortar o reflejar horizontalmente la imagen? En el reflejo, explica también qué ocurre con etiquetas anatómicas como hombro izquierdo y derecho.",
    "¿Por qué un punto ocluido, uno ausente y uno sin anotación no deben interpretarse automáticamente igual ni convertirse en (0, 0)?",
    "Al evaluar una pose, 5 píxeles de error pueden ser muchos para una persona lejana y pocos para una cercana. ¿Cómo tiene en cuenta la escala el porcentaje de puntos correctos (PCK) frente a la similitud de puntos de objeto (OKS)? ¿Qué fijarías para comparar dos resultados?",
  ],
  "12.05": [
    "Un lector automático recorta siempre el mismo rectángulo de la página para leer un campo. ¿Cuándo basta ese recorte fijo y qué harías si cambia el diseño o la página llega inclinada?",
    "¿Cómo se calculan la tasa de error por carácter (CER) y la tasa de error por palabra (WER) de una transcripción? Explica por qué hay que acordar antes qué cuenta como palabra y cómo se tratan mayúsculas, espacios y puntuación.",
    "Un lector de documentos devuelve un campo equivocado. ¿Cómo distinguirías una línea mal localizada, un texto mal transcrito y un error en el orden de lectura? ¿Qué protección añadirías si el campo es crítico?",
  ],
  "12.06": [
    "Una cámara debe delimitar grietas finas, contar personas y transcribir números de serie. ¿Qué salida y qué medida usarías para cada decisión? Explica por qué una exactitud global no evalúa bien las tres.",
    "Un sistema primero localiza líneas y solo después lee los recortes detectados. ¿Por qué un lector perfecto sobre recortes no garantiza leer todos los textos de una página? Distingue cómo evaluarías al lector aislado y al sistema completo.",
    "Vas a comparar dos versiones de un sistema que segmenta grietas, cuenta personas y lee series. ¿Qué muestra y qué casos difíciles conservarías? Si puede rechazar imágenes dudosas, ¿cómo evitarías premiar a la versión que más rechaza?",
  ],
  "13.01": [
    "Un transformador divide una imagen de 224×224 píxeles en parches de 16×16 sin relleno ni solape. ¿Cuántos tokens obtiene si usa uno por parche y ninguno adicional? ¿Qué riesgo tendría usar parches mayores para detectar un trazo fino?",
    "Dos parches de una imagen tienen el mismo contenido, pero están en lugares distintos. ¿Por qué necesita un transformador visual información de posición y qué puede pasar con una tabla de posiciones aprendida si cambias la resolución de entrada?",
    "¿Cómo crece la matriz de atención densa con el número de tokens y por qué ese crecimiento no determina exactamente la latencia?",
  ],
  "13.02": [
    "En una cabeza de autoatención, ¿cómo se pasa de consultas (Q) y claves (K) a una combinación de valores (V)? Explica por qué un peso de atención alto no prueba que ese parche haya causado la decisión final.",
    "¿Cómo impide una máscara de atención que el relleno de una secuencia influya en los tokens válidos? Contrasta ese uso con ocultar posiciones futuras al generar texto: ¿por qué no es necesario ocultarlas al clasificar una imagen completa?",
    "En un transformador visual, ¿qué pueden aprender varias cabezas de autoatención al proyectar de manera distinta los mismos tokens? Explica cómo se combinan sus salidas y por qué añadir cabezas no garantiza una mejor predicción.",
  ],
  "13.03": [
    "En el detector DETR original, ¿qué produce cada consulta de objeto, para qué sirve la clase «sin objeto» y qué límite impone usar 100 consultas por imagen?",
    "En DETR se emparejan propuestas y objetos anotados al entrenar. ¿Qué coste y qué restricción rigen ese emparejamiento? Distingue su finalidad de la asignación de aciertos al evaluar precisión media (AP).",
    "Un detector se anuncia como «variante de DETR». ¿Por qué no basta ese nombre para deducir cómo se entrena o si suprime cajas duplicadas, y cómo lo compararías con el original en imágenes con objetos pequeños?",
  ],
  "13.04": [
    "¿Cómo ayudan puntos positivos, negativos o una caja a indicar la región deseada, y qué errores puede conservar una máscara visualmente plausible?",
    "Antes de adoptar un segmentador asistido por puntos o cajas en otro tipo de imágenes, ¿cómo comprobarías que sus máscaras son correctas y que realmente ahorra tiempo frente a anotarlas a mano?",
    "Un anotador dibuja puntos o cajas y corrige las máscaras propuestas por un modelo. ¿Qué guardarías para reconstruir cada etiqueta? Si esas máscaras se usan como referencia de prueba, ¿por qué es necesaria una revisión independiente?",
  ],
  "13.05": [
    "Un modelo puntúa una imagen por similitud con varios textos y aplica softmax a esas puntuaciones. ¿Por qué reformular un texto o añadir otro candidato puede cambiar los pesos resultantes sin modificar la imagen?",
    "Un modelo imagen-texto se anuncia como zero-shot para defectos industriales. ¿Qué se ha aprendido antes y qué entrenamiento no se hace en la tarea nueva? ¿Cómo comprobarías si reconoce grietas pequeñas y vocabulario técnico en esa fábrica?",
    "¿Con qué clasificador de referencia compararías un modelo que asigna clases por semejanza con descripciones de texto sin entrenarse en la tarea nueva? ¿Por qué fijarías los textos antes de la prueba final?",
  ],
  "13.06": [
    "Tienes un extractor visual preentrenado y pocas etiquetas de una cámara nueva. ¿Qué ganas y qué arriesgas al entrenar solo la capa final frente a permitir que cambien también algunas capas del extractor?",
    "Vas a comparar dos formas de adaptar el mismo modelo. Hay varios recortes de cada foto y varios fotogramas de cada vídeo. ¿Qué mantendrías fijo, qué muestras deberían seguir juntas y para qué repetirías con varias semillas?",
    "Un detector adaptado sube una décima de punto en precisión media entre clases (mAP). ¿Qué comprobarías sobre la fiabilidad de esa diferencia, los subgrupos, el coste de uso y el origen y la licencia de los pesos antes de desplegarlo?",
  ],
  "14.01": [
    "Si tomas uno de cada cinco frames de un vídeo a 30 fps, ¿qué frecuencia e intervalo quedan y por qué puedes perder un evento de 0,1 segundos?",
    "Un procesador de vídeo termina muchos fotogramas por segundo, pero algunas alertas llegan tarde. ¿Desde cuándo hasta cuándo medirías la latencia, qué etapas incluirías y por qué el ritmo medio de salida no comprueba el plazo?",
    "¿Por qué los frames vecinos no son muestras independientes y cómo elegirías el grupo adecuado para dividir vídeos entre train y test?",
  ],
  "14.02": [
    "Al estimar el movimiento aparente de un punto entre fotogramas, ¿qué falla si cambia la luz, el punto queda oculto o su desplazamiento es grande? Explica qué problema ayuda a resolver comparar imágenes a varias escalas y cuál no.",
    "¿Por qué una escena estática puede producir flujo cuando se mueve la cámara y cómo separarías movimiento de cámara y de objetos?",
    "¿Cómo evaluarías los desplazamientos en píxeles que predice un método de flujo óptico, incluidos bordes y zonas sin textura? Si necesitas velocidad en metros por segundo respecto al mundo, ¿qué más debes conocer?",
  ],
  "14.03": [
    "Un seguidor mantiene varias trayectorias y recibe nuevas cajas. ¿Cómo usarías la posición prevista, una distancia máxima y un coste de asociación para decidir las parejas sin asignar una detección a dos personas?",
    "¿Qué ocurre con una trayectoria cuando faltan detecciones y qué políticas necesitas para iniciarla, mantenerla o cerrarla?",
    "Un detector localiza bien a dos personas mientras se cruzan. ¿Cómo puede aun así fallar el seguimiento? Distingue intercambiar sus identificadores de interrumpir y recuperar una trayectoria.",
  ],
  "14.04": [
    "En el modelo de cámara sin distorsión, x = f_x·X/Z + c_x e y = f_y·Y/Z + c_y. ¿Qué representan los cuatro parámetros f_x, f_y, c_x y c_y y qué deformación de una lente real no explican?",
    "Conoces la posición de un punto en metros respecto al mundo. ¿Qué hacen la rotación y la traslación de mundo a cámara y qué paso falta para obtener columna y fila en la imagen?",
    "En una cámara ideal calibrada conoces el píxel donde se proyecta un objeto. ¿Por qué no basta para obtener su profundidad en metros? Da un ejemplo de información que sí añadiría escala y especifica en qué marco medirías.",
  ],
  "14.05": [
    "En un par estéreo rectificado, la focal es f=800 px, las cámaras están separadas B=0,1 m y el mismo punto de la escena tiene una disparidad horizontal d=40 px. ¿Qué diferencia de coordenadas representa d y qué profundidad resulta de Z=fB/d? Justifica la unidad.",
    "En estéreo rectificado se estima la profundidad como Z=fB/d, con focal f y separación B fijas. ¿Por qué un error de un píxel en la disparidad d afecta más a un punto lejano que a uno cercano? ¿Dónde cuesta encontrar la misma parte de la escena en las dos vistas?",
    "Para estimar profundidad con dos cámaras usas Z=fB/d: f es la focal en píxeles, B la separación entre cámaras y d la diferencia de columnas. Las dos imágenes se suponen rectificadas, pero la misma esquina física de un tablero aparece en filas distintas. ¿Qué comprobarías o corregirías antes de usar d? ¿Cómo medirías el error de profundidad a varias distancias conocidas?",
  ],
  "14.06": [
    "Una cámara debe avisar una vez por cada entrada de una persona por una puerta. ¿Qué regla fijarías para el inicio y el fin de una entrada, el plazo de la alerta y las detecciones repetidas mientras la persona sigue dentro?",
    "Una cámara alerta cuando una persona cruza una línea, pero el sistema analiza solo algunos fotogramas. ¿Cómo medirías el retraso desde el cruce hasta el aviso y, por separado, los eventos breves que no producen aviso alguno?",
    "¿Qué reservarías para probar un sistema de vídeo en cámaras nuevas o en sesiones futuras de cámaras conocidas? ¿Cómo informarías los fallos por luz y densidad de personas sin conservar imágenes identificables innecesarias?",
  ],
  "15.01": [
    "Tienes recortes de las mismas fotos y fotogramas consecutivos de varios vídeos. ¿Qué información podrían compartir entrenamiento y prueba si repartes los ejemplos al azar? ¿Cómo detectarías duplicados y organizarías los grupos antes de dividir?",
    "¿Cómo cambiaría tu split si quieres generalizar a cámaras nuevas en lugar de a días nuevos de una misma cámara?",
    "¿Qué decisiones corresponden a train, validación y test y qué cambia si usas test repetidamente para elegir el umbral?",
  ],
  "15.02": [
    "Dos personas van a anotar la parte visible de grietas en fotografías. ¿Qué reglas y ejemplos les darías para tratar sombras, reflejos, tramos ocultos y grietas cortadas por el borde de la foto?",
    "¿Cómo auditarías etiquetas de forma ciega y versionada, y por qué el consenso entre anotadores no garantiza ausencia de sesgo?",
    "La máscara de un modelo tiene poco solapamiento (IoU) con la referencia en un borde donde tampoco coinciden dos anotadores. ¿Qué puedes concluir y cómo revisarías las etiquetas de prueba sin favorecer al modelo?",
  ],
  "15.03": [
    "En una evaluación de detección, ¿cómo distinguirías un defecto omitido (FN), una falsa detección (FP), un duplicado y un caso ignorado? Si un defecto es a la vez pequeño y cercano al borde, explica cómo evitarías contarlo dos veces en el total de omisiones.",
    "Un detector omite 20 defectos entre 25 defectos reales de noche y 20 entre 2000 de día. ¿Qué tasas compararías y qué más tendrías en cuenta antes de priorizar un grupo por su riesgo?",
    "Muchos objetos se pierden junto a los límites entre teselas. ¿Cómo pondrías a prueba la hipótesis de que el corte causa esas omisiones? Explica cómo compararías los mismos objetos de borde y el resultado global.",
  ],
  "15.04": [
    "¿Qué diferencias hay entre cambios de características de entrada, prevalencia y definición de etiqueta, y por qué el brillo medio no los resume?",
    "Tras cambiar una cámara, varían el brillo y la frecuencia de alarmas. ¿Qué registrarías para investigar el cambio y qué muestra etiquetarías antes de decidir que el modelo necesita reentrenamiento?",
    "Instalas una cámara nueva y la anterior sigue en uso. ¿Cómo usarías la versión actual del detector como referencia y cómo comprobarías que una adaptación para la cámara nueva no empeore la anterior?",
  ],
  "15.05": [
    "Una predicción pasa de fallo a acierto, sin cambiar el tamaño de la prueba. ¿Cuántos puntos porcentuales aumenta la tasa de aciertos con 20 casos y con 200? ¿Qué cambia al interpretar la incertidumbre si los 20 casos son recortes de la misma foto?",
    "Quieres un intervalo para una métrica y tienes varias imágenes por paciente o varios fotogramas por vídeo. ¿Qué sortearías con reemplazo en un bootstrap por grupos y cómo formarías el intervalo? ¿Qué sesgo no puede corregir?",
    "Un informe dice solo «se detectó el 90% de los defectos». ¿Qué conteos, reglas de inclusión y resultados por grupo añadirías? Distingue la variación entre muestras de prueba de la que observas al repetir el entrenamiento.",
  ],
  "15.06": [
    "Un detector que procesa imágenes por teselas omite objetos pequeños cerca de las costuras. ¿Qué hipótesis y qué comparación propondrías, y qué medirías para no decidir por una sola demostración?",
    "Vas a elegir tamaño y solapamiento de teselas y umbral de alarma. ¿En qué datos los elegirías y qué dejarías fijo para comparar con el sistema de referencia en la prueba final?",
    "Un cambio de detector promete reducir omisiones en una clase crítica. ¿Qué límites de falsas alarmas, carga de revisión, tiempo de respuesta y uso de imágenes acordarías para aceptarlo? ¿Para qué guardarías también los resultados negativos?",
  ],
  "16.01": [
    "Un detector se entrenó con canales RGB, una normalización fija y un cambio de tamaño con márgenes de relleno (letterbox). ¿Qué debe reproducir el servicio y cómo convertirías una caja de la imagen con márgenes a la foto original?",
    "Un detector procesa teselas y descarta algunas cajas por confianza o por solapamiento con otras (NMS). ¿Por qué hay que evaluar las cajas después de ese proceso y qué versiones y reglas vincularías con cada salida?",
    "¿Qué etapas deben sumarse para medir latencia extremo a extremo y por qué un modelo de 20 ms puede responder mucho más tarde?",
  ],
  "16.02": [
    "Un dispositivo procesa un lote de ocho imágenes en 80 ms. Sin otras etapas, ¿cuántas imágenes por segundo puede completar con lotes consecutivos? Explica por qué la primera petición de un lote puede esperar más de 80 ms.",
    "Un servicio recibe de forma sostenida 120 imágenes/s y puede procesar 100/s. Si no descarta entradas, ¿cómo evolucionan la cola y la espera? ¿Qué medirías tanto bajo tráfico real como al arrancar el servicio?",
    "¿Cómo elegirías el tamaño del lote de inferencia para una línea de inspección continua y para una alarma con plazo individual? Distingue capacidad sostenida, espera por petición y memoria disponible.",
  ],
  "16.03": [
    "Quieres convertir a enteros las activaciones de una red. ¿Qué estimas con imágenes representativas en la cuantización estática posterior al entrenamiento (PTQ) y qué se hace de otra manera en el entrenamiento consciente de cuantización (QAT)?",
    "Tras cuantizar un detector, cambia poco su puntuación media. ¿Qué compararías por clase y tamaño en el umbral de uso? ¿Cómo comprobarías, por separado, si los niveles de confianza siguen correspondiendo a frecuencias reales de acierto?",
    "¿Por qué comprimir pesos no garantiza menor latencia y qué benchmark harías en el dispositivo final?",
  ],
  "16.04": [
    "Tras un cambio en el servicio baja el tiempo de respuesta de los fotogramas procesados. ¿Qué conteos y tiempos registrarías por cámara y versión para distinguir una mejora real de la pérdida de entradas?",
    "Una fábrica revisa solo las piezas que disparan una alarma. ¿Qué defectos quedan fuera de esa revisión y cómo muestrearías para estimar recall? Si revisas distintas proporciones con alarma y sin ella, explica cómo tendrías en cuenta sus volúmenes reales.",
    "Antes de un fallo de producción, ¿qué señal y regla de aviso acordarías, quién respondería y cuándo elegirías inspección manual, vuelta a la versión anterior o reentrenamiento?",
  ],
  "16.05": [
    "Necesitas medir latencia y disponibilidad de un servicio de visión. ¿Qué puedes registrar sin guardar los píxeles? Si investigar un error exige una muestra visual, ¿qué límites aplicarías a su recogida, acceso y conservación?",
    "¿Qué revisarías en logs, permisos, copias y metadatos para evitar que una captura aparentemente anonimizada siga siendo identificable?",
    "¿Qué copias deben cubrir el borrado y la trazabilidad, y con quién validarías los requisitos de privacidad antes del servicio?",
  ],
  "16.06": [
    "Vas a procesar las imágenes en un equipo junto a la cámara (edge). ¿Cómo comprobarías sus límites de potencia y temperatura, cómo mantendrías el equipo y qué harías con las decisiones o alarmas si se cae la red?",
    "¿Cómo afectan red y recursos compartidos a un servidor de varias cámaras, y por qué no basta dimensionar la carga media?",
    "Debes elegir entre procesar junto a la cámara o enviar las imágenes a un servidor. ¿Qué costes, riesgos de privacidad y escenarios de fallo compararías con tráfico real además de la velocidad del modelo?",
  ],
  "17.01": [
    "La detección de un defecto puede detener la cinta, pedir una inspección o añadir una entrada a un informe. ¿Por qué importan esas diferencias al valorar omisiones y falsas alarmas? ¿Quién debería resolver si una marca dudosa cuenta como defecto?",
    "Una línea debe encontrar defectos finos sin generar demasiadas falsas alarmas. ¿Cómo escribirías un criterio de aceptación que especifique qué se cuenta y con qué denominador para cada límite? ¿Con quién fijarías las metas y el tamaño de la muestra?",
    "Antes de elegir una red que inspeccione piezas en una cinta, ¿qué comprobarías sobre velocidad, luz y detalle mínimo visible? ¿Qué límites de acceso a imágenes, etiquetas y equipo podrían descartar una arquitectura?",
  ],
  "17.02": [
    "En el plano de una pieza, 2000 píxeles cubren 100 mm con escala uniforme. ¿Cuántos píxeles de ancho ocuparía una grieta de 0,2 mm en esa dirección y por qué eso no basta para garantizar que se vea nítida?",
    "¿Cómo comprobarías que la iluminación mantiene contraste útil frente a reflejos, cambios de turno o suciedad de cámara?",
    "¿Qué calibración y pruebas de posición o distorsión necesitas antes de convertir píxeles a medidas físicas?",
  ],
  "17.03": [
    "Una línea inspecciona una zona de una pieza cuya posición puede variar. ¿Cuándo sirve un recorte fijo y cuándo debes localizar o alinear primero la pieza? Si necesitas cubrirla con teselas, explica qué ganas y qué pagas al solaparlas o añadir una rejilla desplazada.",
    "Cubres un eje de longitud L con teselas de ancho T y paso S, donde L≥T y 0<S≤T. Empiezas en 0, sin relleno, y si el último avance se pasa, anclas la última tesela al borde. ¿Cuántas teselas necesitas y por qué? Contrasta esta regla con descartar o rellenar el tramo final.",
    "Un detector devuelve cajas en las coordenadas de cada tesela redimensionada. ¿Cómo las llevarías a la foto completa para eliminar duplicados? ¿Cómo evaluarías los fallos de costura sin colocar recortes de una misma foto en entrenamiento y prueba?",
  ],
  "17.04": [
    "Antes de entrenar un detector grande para una línea de inspección, ¿qué probarías con una regla visual sencilla o un modelo pequeño, y cómo usarías sus errores y su coste como referencia?",
    "Dos detectores ordenan cajas por confianza. ¿Por qué una mejor precisión media (AP) no implica detectar más defectos al límite acordado de falsas alarmas por 1000 piezas buenas? Explica cómo compararías los umbrales de uso sin ajustarlos en la prueba final.",
    "Han cambiado el recorte, el solapamiento entre teselas y el extractor de características de un detector. ¿Cómo organizarías ensayos para aislar sus efectos y qué registrarías para poder repetirlos?",
  ],
  "17.05": [
    "Un inspector no ha generado ninguna alarma para una pieza. ¿Cómo distinguirías captura perdida, imagen rechazada, fallo al ejecutar el modelo y decisión válida sin defecto? ¿Cuál de esos casos cuenta como predicción negativa?",
    "La inspección automática no logra decidir sobre una pieza que se acerca al expulsor. ¿Cómo elegirías entre esperar, reintentar, derivar a inspección manual o parar la cinta? ¿Qué costes y plazos acordarías con operación?",
    "Otro sistema actúa sobre las salidas del inspector. Al actualizarlo, ¿qué componentes y convenciones de salida guardarías para poder comparar versiones, volver a la anterior y evitar que un error se interprete como «pieza buena»?",
  ],
  "17.06": [
    "Una cámara fotografía placas metálicas. ¿Cómo comprobarías si la grieta más fina se distingue en la foto original con la luz de la cinta? Ahora imagina que al reducir la foto entera para el modelo, la grieta deja de verse. En una línea solo importa la soldadura del centro; en otra hay que revisar toda la placa. ¿En cuál usarías un recorte fijo (región de interés, ROI) y en cuál varios recortes (tiles)? ¿Cómo marcarías una grieta que cruza el borde de un recorte?",
    "Una cinta inspecciona 10 000 piezas al día y solo hay 300 ms entre captura y expulsor. ¿Cómo separarías los datos y medirías los defectos finos detectados al límite de falsas alarmas acordado? Por separado, ¿cómo comprobarías el plazo, las capturas perdidas y los cambios de luz entre turnos?",
    "Una cinta expulsa placas con grietas finas. ¿Qué registrarías y qué piezas revisarías para seguir su calidad sin retener todas las imágenes? Explica cuándo derivarías una pieza a inspección y cómo responderías si una actualización empeora el servicio.",
  ],
  "18.01": [
    "¿Cómo pasa una imagen (H, W, C)=(480, 640, 3) a un tensor (N, C, H, W) con lote uno y qué significa cada eje?",
    "En una imagen NumPy de al menos 20 filas y 50 columnas tomas img[10:20, 30:50] sin cambiar la escala. ¿Qué ancho y alto tiene ese recorte y qué esquinas lo delimitan en formato (x1, y1, x2, y2) con extremo superior exclusivo? ¿Cómo llevarías un punto local (x, y) a la foto original?",
    "Te dan las dos esquinas (2, 3) y (5, 7) de una caja en píxeles. ¿Qué área obtienes si el límite superior es exclusivo, cómo comprobarías la cuenta con un recorte y qué ocurriría si otra biblioteca incluyera los dos extremos?",
  ],
  "18.02": [
    "El 1% de las piezas es defectuoso. Si un inspector declara buenas todas las piezas, ¿qué exactitud global y qué sensibilidad para las defectuosas obtiene? Si además produce máscaras o cajas de las grietas, ¿cómo evaluarías esas salidas sin confundir píxeles, objetos y piezas?",
    "Un detector asigna una puntuación de confianza a cada caja. ¿En qué se diferencia esa puntuación de la IoU con una referencia? Explica cómo intervienen ambas al evaluar la precisión media (AP) de un conjunto de detecciones.",
    "Dejar pasar un defecto es costoso, pero revisar una pieza también consume tiempo. ¿Cómo justificarías el umbral de alarma que permite detectar más defectos a cambio de más falsas alarmas, y en qué datos lo elegirías?",
  ],
  "18.03": [
    "Repartes al azar teselas de las mismas fotos entre entrenamiento y prueba y obtienes una puntuación alta. ¿Por qué puede no repetirse en piezas nuevas, qué rastros buscarías y cómo rehacerías la división?",
    "Un compañero cambia el modelo, el tamaño de tesela y la supresión de cajas solapadas (NMS), y elige los ajustes mirando la prueba. ¿Cómo separarías el efecto de los cambios y recuperarías una evaluación final independiente?",
    "Un detector supera al anterior en una prueba pequeña con muchas teselas por pieza y pocas piezas por lote. ¿Qué conteos, intervalo para la diferencia y observaciones en lotes nuevos pedirías antes de dar la mejora por reproducible?",
  ],
  "18.04": [
    "Un objeto mide 10 píxeles de ancho en una foto de 4000 píxeles de ancho. Reduces toda la foto a 640 píxeles de ancho. ¿Cuánto mide ahora el objeto y cómo decidirías entre mejorar la captura, usar un recorte o cambiar el modelo?",
    "Un detector procesa cada foto como una rejilla de teselas solapadas. ¿Cómo estimarías las inferencias por foto y eliminarías cajas duplicadas entre teselas? Explica qué medirías en los bordes y en el recorrido temporal completo.",
    "Aumentar el número de teselas permite encontrar más objetos, pero la respuesta llega demasiado tarde. ¿Qué criterios de aceptación acordarías, qué alternativa compararías y qué harías si no se cumplen a la vez calidad y plazo?",
  ],
  "18.05": [
    "Después de actualizar una cámara industrial se registran menos alarmas. ¿Qué conteos y tasas por pieza comprobarías antes de atribuirlo a una mejora? ¿Qué información te permitiría saber si hay menos defectos o más omisiones?",
    "Tras actualizar el firmware de una cámara cambian las predicciones del inspector. ¿Cómo compararías capturas anteriores y nuevas, y cómo aislarías un posible cambio de procesamiento usando muestras autorizadas y versiones conocidas?",
    "Un cambio en el servicio de inspección ha aumentado las omisiones de defectos críticos. ¿Cómo protegerías las piezas que están pasando ahora, y por qué reentrenar con las imágenes nuevas sin etiquetar no sustituye al diagnóstico?",
  ],
  "18.06": [
    "En una línea nueva debes detectar grietas finas con luces distintas por turno. ¿Cómo comprobarías que la grieta se ve, qué piezas y etiquetas reunirías y con qué referencia sencilla compararías un recorte fijo o un detector por teselas?",
    "Una línea graba a 30 fotogramas/s; el 2% de las piezas es defectuoso, hay 250 ms hasta la actuación y pocas personas para revisar alarmas. ¿Cómo medirías detección por pieza, calidad de máscaras o cajas, carga de revisión y cumplimiento del plazo? Indica dónde elegirías el umbral y qué lotes reservarías.",
    "Antes de automatizar la inspección de grietas solo conoces la prevalencia media; faltan datos por turno, el coste de una omisión y el tiempo real hasta actuar. ¿Qué pedirías a operación, qué piloto harías y qué alternativa acordarías para las piezas sin decisión a tiempo?",
  ],
};
