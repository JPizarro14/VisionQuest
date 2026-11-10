import type { SectorLesson } from "@/app/course-data";

type Q = [string, [string, string, string, string], number, [string, string, string, string]];
type S = [string, string, string];
type Draft = {
  id: string; navTitle: string; title: string; objective: string; lead: string; keyIdea: string;
  sections: [S, S, S]; takeaways: [string, string, string]; questions: [Q, Q, Q];
  lab: SectorLesson["lab"]; labTitle: string; labInstruction: string;
  source: [string, string];
};
function lesson(d: Draft): SectorLesson {
  return {
    id: d.id, navTitle: d.navTitle, title: d.title, objective: d.objective,
    lead: d.lead, keyIdea: d.keyIdea,
    sections: d.sections.map(([title, a, b]) => ({ title, paragraphs: [a, b] })),
    takeaways: d.takeaways,
    questions: d.questions.map(([prompt, options, correctIndex, feedback], i) => {
      const shift = (Number(d.id.slice(3)) * 3 + i) % options.length;
      const rotated = <T,>(items: T[]) => items.map((_, index) => items[(index - shift + items.length) % items.length]);
      return {
        id: `s5-${d.id.slice(3)}-${i + 1}`, prompt,
        options: rotated(options), correctIndex: (correctIndex + shift) % options.length,
        feedback: rotated(feedback),
      };
    }),
    lab: d.lab, labTitle: d.labTitle, labInstruction: d.labInstruction,
    sources: [{ label: d.source[0], url: d.source[1] }],
  };
}

export const sectorFiveLessons: SectorLesson[] = [
  lesson({
    id: "05.01", navTitle: "Transformaciones afines", title: "Mover puntos con una regla afín",
    objective: "Distinguir traslación, escala, rotación y transformación afín de una deformación cualquiera.",
    lead: "Un punto cambia de sitio cuando movemos la cámara, giramos una foto o corregimos una inclinación. En vez de moverlo a ojo, describimos la regla que transforma todas las coordenadas.",
    keyIdea: "Una transformación afín 2D aplica una parte lineal y una traslación. Si es invertible, conserva rectas y paralelismo, pero no necesariamente longitudes ni ángulos.",
    sections: [
      ["La regla para cada punto", "Escribe un punto como (x, y). Una matriz 2×2 puede girarlo, escalarlo o inclinarlo; después sumamos un desplazamiento (tx, ty). En OpenCV, warpAffine utiliza una matriz 2×3 para reunir ambos pasos.", "Si solo añades (3, −2), el punto (2, 4) va a (5, 2). El orden de las operaciones importa: trasladar y luego girar alrededor del origen no suele producir el mismo resultado que girar y luego trasladar."],
      ["Qué se conserva", "Si la parte lineal es invertible, las rectas siguen siendo rectas y las que eran paralelas siguen paralelas. Una transformación degenerada puede colapsar una recta en un punto. Una escala distinta en x e y puede deformar círculos en elipses y cambiar ángulos.", "Una corrección de perspectiva general no es afín: en la imagen de una vía, las líneas paralelas del mundo pueden encontrarse visualmente en un punto de fuga."],
      ["Transformar píxeles exige interpolar", "La fórmula transforma coordenadas continuas, pero la salida es una rejilla discreta. Para asignar intensidades a posiciones entre píxeles hace falta interpolación y una política para los bordes.", "Conviene registrar también el tamaño de salida y la convención de coordenadas; una transformación geométrica no garantiza que todo el contenido siga dentro del lienzo."],
    ],
    takeaways: ["Afín = parte lineal + traslación.", "Si es invertible, conserva rectas y paralelismo, pero no toda la geometría.", "El orden y el centro de transformación cambian el resultado."],
    questions: [
      ["Trasladas (2, 4) mediante (3, −2). ¿Dónde queda?", ["(5, 2)", "(−1, 6)", "(6, 8)", "(2, 4)"], 0, ["Correcto: suma componente a componente.", "Eso resta el desplazamiento.", "No se multiplican las coordenadas.", "La traslación no es la identidad."]],
      ["¿Qué propiedad conserva toda transformación afín invertible?", ["Longitud", "Ángulos", "Paralelismo", "Área exacta"], 2, ["Una escala cambia longitudes.", "Un shear cambia ángulos.", "Correcto: las rectas paralelas continúan paralelas.", "El determinante puede cambiar el área."]],
      ["¿Por qué necesita interpolación una imagen rotada?", ["Porque las coordenadas transformadas pueden caer entre píxeles", "Porque cambia de RGB a HSV", "Porque aprende una clase", "Porque calcula IoU"], 0, ["Correcto: la rejilla de salida es discreta.", "El espacio de color no determina esto.", "No hay aprendizaje en la rotación.", "IoU es una medida de solapamiento."]],
    ],
    lab: "geo-affine", labTitle: "Mueve el mismo punto", labInstruction: "Cambia la traslación y la escala; observa el punto original y el transformado.",
    source: ["OpenCV · Geometric Transformations", "https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html"],
  }),
  lesson({
    id: "05.02", navTitle: "Remuestreo e interpolación", title: "Crear una rejilla nueva con datos antiguos",
    objective: "Elegir nearest o bilineal según si remuestras intensidades o etiquetas.",
    lead: "Al ampliar una imagen, aparecen posiciones nuevas que no tenían una medida original. Hay que decidir qué valor les asignamos, y esa decisión puede inventar colores que nunca estuvieron en la máscara.",
    keyIdea: "Nearest toma una muestra existente; bilineal combina cuatro vecinas. Una máscara de clases se remuestrea normalmente con nearest para no mezclar identificadores.",
    sections: [
      ["Dos preguntas distintas", "Nearest selecciona el píxel más próximo y conserva sus valores exactos. Bilineal interpola horizontal y verticalmente entre cuatro muestras y da una transición suave.", "Para una foto, bilineal suele ser razonable al ampliar. Si una máscara guarda clase 0 y clase 2, un promedio puede crear el valor 1, una clase inexistente en esa frontera."],
      ["Al reducir, el aliasing importa", "Reducir no es simplemente tirar filas y columnas: patrones finos pueden convertirse en texturas falsas o desaparecer. Un filtro previo de paso bajo atenúa frecuencias que la nueva rejilla no puede representar.", "En OpenCV INTER_AREA suele ser una elección útil para reducir, pero la mejor opción depende de la tarea y la escala. Valida la señal pequeña que deseas conservar."],
      ["Escala de coordenadas", "Si una imagen cambia de 100×100 a 50×50, una localización en píxeles también debe transformarse. Las cajas y máscaras deben seguir exactamente la misma geometría aplicada a la imagen.", "Interpolar una imagen y olvidar sus etiquetas es una fuente directa de errores en entrenamiento y evaluación."],
    ],
    takeaways: ["Nearest conserva valores discretos.", "Bilineal interpola intensidades.", "Reducir exige vigilar aliasing y coherencia de etiquetas."],
    questions: [
      ["Entre dos etiquetas de clase 0 y 2, ¿qué método evita crear una clase 1?", ["Bilineal", "Nearest", "Promedio 5×5", "Gamma"], 1, ["Mezcla los identificadores y puede crear 1.", "Correcto: copia una etiqueta existente.", "También mezcla números de clase.", "Transforma intensidad, no la geometría de etiquetas."]],
      ["¿Por qué puede aparecer aliasing al reducir?", ["Hay detalle demasiado fino para la nueva frecuencia de muestreo", "Porque RGB tiene tres canales", "Por usar uint8", "Porque la imagen tiene un ROI"], 0, ["Correcto: la rejilla pequeña no puede representar todos los cambios espaciales.", "Los canales son otra dimensión.", "El dtype no resuelve el muestreo.", "Un ROI puede o no remuestrearse."]],
      ["Escalas una foto y su máscara. ¿Qué más debe seguir la misma transformación?", ["Las cajas y puntos anotados", "La tasa de aprendizaje", "El nombre del archivo solamente", "El número de clases"], 0, ["Correcto: las coordenadas deben permanecer alineadas.", "No describe una coordenada espacial.", "Renombrar no alinea datos.", "La escala no añade clases."]],
    ],
    lab: "geo-interpolate", labTitle: "El valor inventado", labInstruction: "Mueve la posición de muestreo y compara nearest con una interpolación lineal simplificada.",
    source: ["OpenCV · Geometric Transformations", "https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html"],
  }),
  lesson({
    id: "05.03", navTitle: "Coordenadas homogéneas", title: "Una dimensión extra para componer movimientos",
    objective: "Leer coordenadas homogéneas y normalizarlas sin confundir la escala del vector con la posición.",
    lead: "La traslación no cabe en una matriz 2×2 aplicada a (x, y). Añadir una coordenada permite expresar y combinar transformaciones como productos de matrices.",
    keyIdea: "El punto (x, y) puede representarse como (x, y, 1); en coordenadas homogéneas (u, v, w) representa (u/w, v/w) cuando w ≠ 0.",
    sections: [
      ["Trasladar con una matriz", "La matriz 3×3 con tx y ty en su última columna transforma (x, y, 1) en (x+tx, y+ty, 1). Así podemos encadenar traslación y parte lineal mediante productos.", "El orden importa: en la convención de vectores columna, B·A·p aplica A primero y B después."],
      ["No olvides dividir", "(6, 4, 2) y (3, 2, 1) describen el mismo punto euclídeo (3, 2). En una homografía general, la tercera componente de salida puede variar según la posición.", "Si w se acerca a cero, el punto proyectado puede ir muy lejos y la operación ser numéricamente delicada. No interpretes u y v sin esa división."],
      ["Para qué sirve", "Las coordenadas homogéneas aparecen en homografías, proyección de cámara y composición de transformaciones. No son un canal de color ni una dimensión física añadida a la foto.", "Hay convenciones distintas para vectores fila o columna; declara cuál usa tu fórmula antes de multiplicar matrices."],
    ],
    takeaways: ["(x, y, 1) representa un punto 2D.", "Al final se divide por w.", "El orden de multiplicación decide el orden de operaciones."],
    questions: [
      ["¿Qué punto representa (6, 4, 2)?", ["(6, 4)", "(3, 2)", "(12, 8)", "No representa ningún punto"], 1, ["Falta dividir por w.", "Correcto: 6/2 y 4/2.", "Has multiplicado por w.", "w es distinto de cero, así que sí representa un punto finito."]],
      ["Con vectores columna, B·A·p aplica...", ["B antes que A", "A antes que B", "Ambas a la vez sin orden", "Solo B"], 1, ["El producto más cercano al punto se aplica primero.", "Correcto: primero A·p, después B.", "Las matrices no suelen conmutar.", "A también participa."]],
      ["La tercera coordenada homogénea es...", ["Un tercer canal RGB", "Una herramienta matemática para representar puntos y transformaciones", "Siempre la profundidad real", "Siempre cero"], 1, ["No describe color.", "Correcto: permite traslación y proyección en forma matricial.", "La profundidad necesita un modelo de cámara, no se identifica con w.", "Un punto finito puede tener w=1 u otro valor no nulo."]],
    ],
    lab: "geo-homogeneous", labTitle: "Divide por w", labInstruction: "Cambia el factor homogéneo y comprueba cuándo dos tríos representan el mismo punto.",
    source: ["OpenCV · Homography tutorial", "https://docs.opencv.org/4.x/d9/dab/tutorial_homography.html"],
  }),
  lesson({
    id: "05.04", navTitle: "Homografías", title: "Enderezar un plano en perspectiva",
    objective: "Entender qué modela una homografía y cuándo cuatro correspondencias no bastan en la práctica.",
    lead: "La foto oblicua de una hoja puede parecer un trapecio. Una transformación proyectiva puede rectificar ese plano, pero no aplanar cualquier escena tridimensional.",
    keyIdea: "Una homografía 3×3 relaciona puntos de dos vistas de un mismo plano (o vistas bajo rotación pura de cámara), hasta una escala; necesita correspondencias no degeneradas.",
    sections: [
      ["Cuatro puntos como mínimo", "Una homografía tiene ocho grados de libertad porque su escala global es irrelevante. Cuatro pares de puntos en posición adecuada aportan ocho ecuaciones para estimarla.", "Cuatro correspondencias colineales o casi degeneradas no dan una solución robusta. Con ruido y outliers conviene usar más puntos y estimación robusta."],
      ["Qué imagen puede rectificar", "Una hoja, una pantalla o el suelo aproximadamente plano son candidatos. Un coche y edificios a distintas profundidades no quedan alineados en general con una sola homografía si hay traslación de cámara y paralaje.", "warpPerspective construye la nueva rejilla y requiere interpolación y política de borde, igual que las transformaciones anteriores."],
      ["Verifica antes de confiar", "No te quedes con que una esquina coincide: reproyecta puntos reservados, mira errores y comprueba que el cuadrilátero no se invierte ni se sale del campo útil.", "Una homografía puede ajustarse numéricamente a malas correspondencias; el contexto geométrico decide si tiene sentido físico."],
    ],
    takeaways: ["Homografía relaciona planos bajo perspectiva.", "Cuatro pares son el mínimo no degenerado, no garantía de robustez.", "Paralaje en escenas 3D limita una homografía global."],
    questions: [
      ["¿Cuántos pares puntuales no degenerados son el mínimo para una homografía 2D?", ["Dos", "Tres", "Cuatro", "Nueve"], 2, ["No aportan suficientes restricciones.", "Una afín puede determinarse con tres pares adecuados.", "Correcto: ocho ecuaciones para ocho grados de libertad.", "Usar más puede mejorar robustez, pero no es el mínimo."]],
      ["¿Qué escena suele ajustarse mejor a una sola homografía?", ["Una hoja plana fotografiada oblicuamente", "Objetos a muchas profundidades con fuerte paralaje", "Una nube 3D deformándose", "Dos escenas sin puntos comunes"], 0, ["Correcto: los puntos pertenecen aproximadamente a un plano.", "Las distintas profundidades rompen el supuesto.", "No es una transformación rígida de un plano.", "No existen correspondencias para estimarla."]],
      ["Cuatro puntos casi alineados permiten...", ["Una solución estable siempre", "Una estimación mal condicionada", "Eliminar toda distorsión óptica", "Saber la profundidad de cada píxel"], 1, ["Esa geometría es degenerada o frágil.", "Correcto: faltan restricciones independientes robustas.", "La calibración de lente es otra cuestión.", "La homografía no recupera profundidad individual."]],
    ],
    lab: "geo-homography", labTitle: "Inclina el documento", labInstruction: "Modifica la perspectiva de un cuadrilátero y observa su correspondencia con un plano rectangular.",
    source: ["OpenCV · Geometric Transformations", "https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html"],
  }),
  lesson({
    id: "05.05", navTitle: "Cámara y distorsión", title: "Del mundo 3D al píxel",
    objective: "Separar intrínsecos, extrínsecos y distorsión de lente, y reconocer los límites de una única imagen.",
    lead: "Una cámara no entrega directamente las coordenadas del mundo. Proyecta rayos sobre un sensor y su lente puede curvar las líneas: para medir bien necesitamos un modelo.",
    keyIdea: "Los intrínsecos describen escala focal y centro principal; los extrínsecos sitúan la cámara respecto al mundo; la distorsión óptica añade otra deformación.",
    sections: [
      ["Tres piezas distintas", "En un modelo pinhole, la profundidad divide las coordenadas antes de multiplicar por focal y sumar el centro principal. La matriz intrínseca contiene fx, fy, cx y cy; los extrínsecos son rotación y traslación entre sistemas.", "Un píxel aislado define un rayo, no una profundidad única. Para obtener distancia real hacen falta datos o supuestos adicionales."],
      ["Calibrar con patrones", "Fotografiar un patrón conocido desde varias posiciones permite estimar parámetros y error de reproyección. La distorsión radial puede curvar líneas rectas lejos del centro; también hay componentes tangenciales.", "Un error medio bajo es útil pero no suficiente: comprueba cobertura de todo el encuadre y casos que se parezcan a las condiciones de uso."],
      ["Medidas que cambian", "Recortar, redimensionar o cambiar de cámara altera cómo se interpretan las coordenadas intrínsecas. Los parámetros de calibración no son universales para cualquier tamaño o dispositivo.", "Antes de medir distancias sobre la imagen, establece el plano, la escala y si es necesario corregir la lente."],
    ],
    takeaways: ["Intrínsecos y extrínsecos responden preguntas diferentes.", "Un píxel no fija por sí mismo una profundidad 3D.", "La calibración debe corresponder al sistema de captura."],
    questions: [
      ["¿Qué parámetro pertenece a la matriz intrínseca típica?", ["La focal en píxeles", "La clase del objeto", "El learning rate", "El IoU"], 0, ["Correcto: fx y fy forman parte de ella.", "Es una etiqueta semántica.", "Es de entrenamiento.", "Es una métrica de solapamiento."]],
      ["Un único píxel de una cámara monocular calibrada determina...", ["Un punto 3D a distancia única", "Un rayo de posibles puntos 3D", "La textura real", "La velocidad del objeto"], 1, ["La profundidad no está fijada.", "Correcto: distintas profundidades se proyectan al mismo píxel.", "La geometría no revela la textura oculta.", "Un fotograma no proporciona esa velocidad."]],
      ["¿Qué efecto puede producir la distorsión radial?", ["Curvar líneas rectas en la imagen", "Crear clases nuevas", "Cambiar un objeto en otro", "Garantizar una homografía"], 0, ["Correcto: la desviación suele aumentar hacia la periferia.", "No interpreta clases.", "La lente cambia proyección, no identidad.", "Una homografía no modela toda distorsión radial."]],
    ],
    lab: "geo-camera", labTitle: "Proyecta un punto", labInstruction: "Cambia profundidad y focal; mira cómo el mismo punto 3D cambia de coordenada en la imagen.",
    source: ["OpenCV · Camera Calibration", "https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html"],
  }),
  lesson({
    id: "05.06", navTitle: "Esquinas y descriptores", title: "Puntos que pueden reconocerse de nuevo",
    objective: "Diferenciar detección de esquinas, descripción local e invariancia aproximada.",
    lead: "Un píxel en un cielo uniforme es difícil de localizar otra vez. Una esquina con estructura en dos direcciones suele ser más fácil de reconocer al cambiar ligeramente la cámara.",
    keyIdea: "Un detector propone posiciones repetibles; un descriptor resume su vecindario para compararlo con otra imagen. No son la misma etapa.",
    sections: [
      ["Por qué una esquina", "En una zona uniforme apenas cambian las intensidades al desplazar una ventana; en un borde cambian sobre todo en una dirección; cerca de una esquina hay cambios en dos direcciones.", "Harris mide esa estructura local. Una respuesta alta no significa que la esquina pertenezca a una clase concreta ni que sea única en la escena."],
      ["Describir después de detectar", "ORB, por ejemplo, detecta puntos y construye descriptores binarios. Podemos comparar esos vectores con distancia Hamming; descriptores float como SIFT suelen compararse de otra manera.", "La robustez a escala, rotación e iluminación es aproximada y depende del método y del cambio real. Una textura repetida puede producir descriptores parecidos en lugares equivocados."],
      ["Mide repetibilidad", "Un detector útil debería encontrar puntos correspondientes tras un cambio esperado de perspectiva o escala. Muchos puntos no implican automáticamente buenos matches.", "En una zona lisa puede no haber evidencia suficiente: no conviene inventar coordenadas precisas donde la imagen no las sostiene."],
    ],
    takeaways: ["Detector localiza; descriptor caracteriza.", "Esquina responde en dos direcciones.", "Repetibilidad y discriminación deben evaluarse por separado."],
    questions: [
      ["En una zona uniforme, ¿qué ocurre al desplazar ligeramente una ventana?", ["Cambia poco", "Cambia mucho en dos ejes", "Aparece una caja", "Se obtiene profundidad"], 0, ["Correcto: hay poca estructura para localizarla.", "Eso describe mejor una esquina.", "No hay detección semántica aquí.", "Una ventana local no recupera distancia."]],
      ["¿Qué función cumple un descriptor local?", ["Resumir el entorno de un punto para compararlo", "Contar las clases del dataset", "Modificar la focal", "Garantizar correspondencias correctas"], 0, ["Correcto: codifica apariencia local.", "No usa etiquetas globales.", "La focal es un parámetro de cámara.", "También hay falsos matches."]],
      ["Comparas descriptores binarios ORB. ¿Qué distancia es habitual?", ["Hamming", "IoU entre cajas", "Error de reproyección sin geometría", "Número de épocas"], 0, ["Correcto: cuenta bits distintos.", "IoU compara regiones.", "Primero hacen falta correspondencias y un modelo.", "No es una distancia de descriptor."]],
    ],
    lab: "geo-features", labTitle: "Busca estructura", labInstruction: "Mueve una ventana sobre una imagen sintética y compara respuesta uniforme, borde y esquina.",
    source: ["OpenCV · Harris Corner Detection", "https://docs.opencv.org/4.x/dc/d0d/tutorial_py_features_harris.html"],
  }),
  lesson({
    id: "05.07", navTitle: "Matching y RANSAC", title: "Separar correspondencias de impostores",
    objective: "Explicar distancia de descriptor, ratio test, modelo geométrico, inliers y outliers.",
    lead: "Dos imágenes pueden compartir muchas esquinas, pero no todas las parejas propuestas describen el mismo punto físico. Necesitamos combinar apariencia con coherencia geométrica.",
    keyIdea: "RANSAC prueba modelos sobre subconjuntos y busca el que tiene más correspondencias compatibles según un umbral de error; no convierte automáticamente todos los matches en verdad.",
    sections: [
      ["Proponer y filtrar", "El vecino más cercano en espacio de descriptores propone una pareja. El ratio entre mejor y segundo mejor match ayuda a descartar casos ambiguos, pero no elimina toda falsa correspondencia.", "La distancia de descriptor mide parecido visual, no que los puntos cumplan una transformación geométrica común."],
      ["Consenso geométrico", "RANSAC toma muestras mínimas, estima un modelo y cuenta inliers cuyo error de reproyección está por debajo de un umbral. Repite y retiene un modelo consistente.", "Con pocos inliers, puntos mal distribuidos o un modelo inadecuado, el consenso puede ser engañoso. Umbral y número de iteraciones afectan al resultado."],
      ["Verificación útil", "Visualiza los inliers distribuidos por el objeto, la magnitud de los residuos y si la transformación resultante es plausible. Un montón de matches concentrados en una esquina no garantiza que toda la imagen esté alineada.", "Si la escena no es aproximadamente plana y existe paralaje, estimar una homografía global puede ser la hipótesis equivocada."],
    ],
    takeaways: ["Parecido de descriptor y coherencia geométrica son filtros distintos.", "RANSAC necesita modelo y umbral de error.", "Muchos inliers no sustituyen una comprobación espacial."],
    questions: [
      ["¿Qué compara el ratio test de matches?", ["El mejor vecino con el segundo mejor", "Dos histogramas RGB", "El área de dos cajas", "Train con test"], 0, ["Correcto: descarta emparejamientos poco distintivos.", "Es otro tipo de descriptor.", "Eso sería solapamiento espacial.", "No es una partición de datos."]],
      ["En RANSAC, un inlier es una correspondencia que...", ["Cabe dentro del error permitido para el modelo", "Tiene siempre distancia cero", "Pertenece a una clase positiva", "Está en el centro de la imagen"], 0, ["Correcto: la condición depende del modelo y umbral.", "No exige igualdad exacta.", "No hay etiqueta semántica necesaria.", "La posición central no la valida."]],
      ["Una homografía tiene 100 inliers, todos en una esquina. ¿Qué conviene hacer?", ["Comprobar distribución y error fuera de esa zona", "Declararla perfecta", "Eliminar el test", "Usar gamma"], 0, ["Correcto: el resto puede no estar bien explicado.", "El conteo no garantiza cobertura.", "Sin validación pierdes evidencia.", "No verifica geometría."]],
    ],
    lab: "geo-ransac", labTitle: "Encuentra el consenso", labInstruction: "Mueve el umbral de reproyección y observa qué matches son inliers y qué precio pagas por aceptar más.",
    source: ["OpenCV · Feature Matching + Homography", "https://docs.opencv.org/4.x/d1/de0/tutorial_py_feature_homography.html"],
  }),
  lesson({
    id: "05.08", navTitle: "Flujo óptico", title: "Seguir movimiento entre fotogramas",
    objective: "Interpretar flujo local y sus hipótesis de constancia de brillo y desplazamiento pequeño.",
    lead: "Si una esquina aparece unos píxeles más a la derecha en el siguiente fotograma, podemos estimar su desplazamiento. Pero una región lisa o una oclusión deja menos pistas.",
    keyIdea: "El flujo óptico estima desplazamiento aparente en la imagen; no equivale automáticamente al movimiento 3D del objeto o de la cámara.",
    sections: [
      ["Pistas entre dos tiempos", "El método local de Lucas–Kanade supone que una pequeña vecindad comparte movimiento y que la apariencia cambia poco entre fotogramas. El gradiente temporal y los espaciales aportan restricciones.", "Un único borde no determina bien movimiento a lo largo de sí mismo: es el problema de apertura. Las esquinas aportan cambios en dos direcciones."],
      ["Pirámides y límites", "Una pirámide de resoluciones permite capturar desplazamientos mayores comenzando por una escala gruesa, pero cambios bruscos de iluminación, oclusiones y deformaciones aún producen errores.", "El flujo puede ser disperso, para puntos seleccionados, o denso, con un vector por píxel. Más vectores no implican que cada región tenga textura suficiente."],
      ["Comprobar seguimiento", "Puedes seguir un punto hacia delante y hacia atrás y medir si vuelve cerca del origen. También conviene inspeccionar pérdidas, nuevas apariciones y movimiento de cámara.", "La velocidad real requiere escala y tiempo, además de un modelo geométrico; píxeles por fotograma no son metros por segundo."],
    ],
    takeaways: ["Flujo = movimiento aparente 2D.", "Esquinas ayudan a resolver la ambigüedad local.", "Oclusión, iluminación y movimiento grande pueden romper supuestos."],
    questions: [
      ["Un flujo de (3, 0) significa directamente...", ["Tres píxeles hacia la derecha entre fotogramas", "Tres metros por segundo", "Una clase 3", "Profundidad tres"], 0, ["Correcto: está en unidades de imagen por intervalo de fotograma.", "Faltan escala y tiempo.", "No es una etiqueta.", "No mide profundidad directamente."]],
      ["¿Por qué cuesta seguir un punto en medio de un borde recto uniforme?", ["El movimiento a lo largo del borde es ambiguo", "Tiene demasiados canales", "RANSAC no existe", "La focal siempre es cero"], 0, ["Correcto: problema de apertura.", "El número de canales no resuelve la geometría local.", "No es la causa del problema.", "No se deduce de un borde."]],
      ["¿Qué ayuda a manejar desplazamientos mayores en Lucas–Kanade?", ["Pirámides de imagen", "Cambiar todas las etiquetas", "Borrar el segundo fotograma", "Usar solo una fila"], 0, ["Correcto: estiman primero a escala gruesa.", "Las etiquetas no son necesarias.", "Se necesitan ambas imágenes.", "Pierdes información espacial."]],
    ],
    lab: "geo-flow", labTitle: "Sigue el desplazamiento", labInstruction: "Cambia el desplazamiento entre fotogramas y observa el vector en píxeles por fotograma.",
    source: ["OpenCV · Optical Flow", "https://docs.opencv.org/4.x/d4/dee/tutorial_optical_flow.html"],
  }),
  lesson({
    id: "05.09", navTitle: "ROI, tiles y stride", title: "Partir una imagen grande con intención",
    objective: "Distinguir ROI de tesela y calcular cobertura y solapamiento a partir de tamaño y stride.",
    lead: "Una región de interés puede elegirse por conocimiento del problema. Si procesas toda una imagen enorme por partes, generas teselas de forma sistemática. Ambas recortan píxeles, pero responden preguntas distintas.",
    keyIdea: "Para tiles de ancho T y salto S, el solapamiento interior es T−S si 0<S≤T. Una ROI puede ser irregular; una tesela suele ser un recorte de una rejilla.",
    sections: [
      ["ROI no significa cuadrado", "Seleccionar la zona del cerebro con una máscara es definir una ROI, aunque no sea rectangular. Su bounding box puede recortarse para ahorrar cómputo, conservando la máscara para excluir el fondo dentro del rectángulo.", "En cambio, tiling recorre una imagen con ventanas predeterminadas. Un parche es el fragmento resultante; tiles describe comúnmente esa partición."],
      ["Stride y solapamiento", "Con tiles de 4 píxeles y stride 3, dos vecinos comparten 1 píxel. Con stride 4 se tocan sin solaparse. Con stride mayor que 4 pueden quedar huecos sin cubrir.", "En la última fila o columna hay que elegir una política explícita: anclar la última ventana al borde, rellenar o permitir un tile menor. No presupongas cobertura total solo por conocer el stride."],
      ["Volver a la imagen original", "Una detección en coordenada local (u, v) dentro de un tile que empieza en (x0, y0) corresponde a (x0+u, y0+v) globalmente. Al redimensionar el tile para el modelo hay que deshacer también esa escala.", "Divide train y test por imagen o sujeto de origen, nunca repartiendo tiles hermanos entre ambos: de otro modo una misma escena aparece a ambos lados y falsea la evaluación."],
    ],
    takeaways: ["ROI expresa interés; tile, partición sistemática.", "Overlap = tamaño − stride cuando stride no supera tamaño.", "Registra origen y escala para reconstruir coordenadas globales."],
    questions: [
      ["Tile de 128 px y stride de 96 px: ¿cuánto se solapan dos vecinos interiores?", ["32 px", "96 px", "128 px", "224 px"], 0, ["Correcto: 128 − 96 = 32.", "Ese es el salto entre orígenes.", "Es el tamaño completo.", "Has sumado en vez de restar."]],
      ["¿Puede una ROI tener forma no rectangular?", ["Sí, si se representa con una máscara", "No, siempre es un cuadrado", "Solo en RGB", "Solo si se usa una CNN"], 0, ["Correcto: región de interés no obliga a una forma.", "El recorte rectangular es una implementación frecuente, no la definición.", "No depende de canales.", "No requiere aprendizaje profundo."]],
      ["Un tile comienza en (100, 40) y predice un punto local (12, 7), sin resize. ¿Dónde está globalmente?", ["(112, 47)", "(12, 7)", "(88, 33)", "(100, 40)"], 0, ["Correcto: sumas el origen del tile.", "Falta el desplazamiento.", "Has restado el origen.", "Es solo la esquina del tile."]],
    ],
    lab: "geo-tiles", labTitle: "Desliza la rejilla", labInstruction: "Cambia tile y stride; mira el solapamiento y los píxeles que quedan cubiertos o sin cubrir.",
    source: ["PyTorch · Unfold", "https://docs.pytorch.org/docs/stable/generated/torch.nn.Unfold.html"],
  }),
  lesson({
    id: "05.10", navTitle: "Rejilla desplazada y fusión", title: "No perder objetos en la costura",
    objective: "Explicar el efecto de bordes, una rejilla desplazada y la fusión de predicciones duplicadas.",
    lead: "Un objeto pequeño puede quedar justo partido por el borde de dos tiles. Desplazar la rejilla o introducir solapamiento aumenta la probabilidad de verlo completo, a cambio de repetir trabajo.",
    keyIdea: "La cobertura mejora con solapamiento y rejillas desplazadas, pero las predicciones repetidas deben devolverse a coordenadas globales y fusionarse con una regla evaluable.",
    sections: [
      ["La costura es una zona de riesgo", "Un modelo entrenado con objetos completos puede fallar si solo recibe media figura. Un tile con margen o una segunda rejilla corrida permite que ese objeto caiga lejos del borde en alguna vista.", "No garantiza resolverlo siempre: un objeto mayor que el tile, o un recorte mal anclado al límite de la imagen, puede seguir incompleto."],
      ["Duplica cómputo y candidatos", "Procesar vistas solapadas aumenta inferencias, memoria y predicciones duplicadas. Convierte las cajas locales a globales antes de comparar candidatas y aplica una política como NMS o fusión ponderada; IoU y NMS se estudian con detalle en detección.", "La confianza no es un sustituto de geometría y una caja truncada puede recibir una puntuación engañosa. Mide recall cerca de bordes por separado."],
      ["Validar el conjunto", "Compara coste, cobertura, recall y falsas duplicaciones con el mismo conjunto de imágenes. No elijas overlap solo porque el mosaico se vea más continuo.", "Al reconstruir una máscara, los píxeles compartidos necesitan una regla explícita: promedio de probabilidades, pesos por posición o una elección entre tiles, según la tarea."],
    ],
    takeaways: ["Desplazar la rejilla puede rescatar objetos partidos.", "Más cobertura implica más coste y duplicados.", "Fusiona predicciones después de volver a coordenadas globales."],
    questions: [
      ["¿Por qué desplazar una segunda rejilla de tiles?", ["Para que un objeto cortado pueda aparecer entero en otra vista", "Para aumentar la profundidad real", "Para cambiar RGB a HSV", "Para eliminar todas las falsas alarmas"], 0, ["Correcto: cambias dónde caen las costuras.", "No añade datos 3D.", "Es una operación espacial.", "También puede producir duplicados."]],
      ["Antes de fusionar cajas de tiles distintos, debes...", ["Convertirlas a coordenadas globales", "Borrar sus puntuaciones", "Igualar sus etiquetas a cero", "Ordenar los píxeles por color"], 0, ["Correcto: solo así se pueden comparar posiciones.", "La puntuación puede ser necesaria.", "Perderías las clases.", "No alinea cajas."]],
      ["¿Qué coste tiene aumentar el solapamiento?", ["Más regiones procesadas y posibles duplicados", "Menos muestras siempre", "La imagen pierde píxeles", "NMS deja de existir"], 0, ["Correcto: cubres posiciones varias veces.", "Suele aumentar el número de ventanas.", "No tiene por qué descartar información.", "La fusión se vuelve más relevante."]],
    ],
    lab: "geo-shifted-grid", labTitle: "Rescata el objeto cortado", labInstruction: "Mueve el objeto y activa una segunda rejilla para comprobar si alguna tesela lo contiene completo.",
    source: ["PyTorch · Unfold", "https://docs.pytorch.org/docs/stable/generated/torch.nn.Unfold.html"],
  }),
];
