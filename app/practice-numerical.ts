import { calculatedChoice, type PracticeChoice } from "@/app/practice-types";

// Each family tests one reproducible calculation with forty distinct inputs.
// A session draws at most one variant per family before repeating a family.
const range = (build: (variant: number) => PracticeChoice) =>
  Array.from({ length: 40 }, (_, index) => build(index + 1));
const pair = (value: string | number, reason: string): [string, string] => [String(value), reason];
const q = (
  family: string, lessonId: string, variant: number, prompt: string,
  value: string | number, reason: string,
  a: [string | number, string], b: [string | number, string], d: [string | number, string],
) => calculatedChoice(
  family, lessonId, variant, prompt,
  pair(value, "Correcto: " + reason),
  [pair(a[0], a[1]), pair(b[0], b[1]), pair(d[0], d[1])],
);
const xy = (x: number, y: number) => "(" + x + ", " + y + ")";
const ratio = (a: number, b: number) => a + "/" + b;

export const numericalPractice: PracticeChoice[] = [
  ...range(v => {
    const h = 90 + v, w = 200 + 2 * v;
    return q("pixels", "01.02", v, "Una imagen de H = " + h + " (Height/alto) y W = " + w + " (Width/ancho) tiene ¿cuántos píxeles?",
      h * w, "Cuenta filas por columnas: H × W.",
      [h + w, "Sumar dimensiones no cuenta celdas de la rejilla."],
      [h * w * 3, "Eso cuenta valores de tres canales RGB, no píxeles."],
      [w, "El ancho solo cuenta los píxeles de una fila."]);
  }),
  ...range(v => {
    const h = 64 + v, w = 128 + v, pixels = h * w;
    return q("rgb-bytes", "01.03", v, "RGB uint8 sin compresión: H = " + h + ", W = " + w + ", C = 3. ¿Cuántos bytes ocupan los valores de píxel?",
      pixels * 3, "H × W × C valores de un byte cada uno; no incluye cabeceras ni metadatos.",
      [pixels, "Eso supone un único canal, pero RGB tiene tres."],
      [pixels * 8, "Has tratado bits por canal como bytes por píxel."],
      [pixels * 4, "Cuatro canales serían RGBA, no el RGB indicado."]);
  }),
  ...range(v => {
    const h = 120 + v, w = 200 + v;
    return q("broadcast", "02.02", v, "Una imagen RGB tiene shape (H, W, C) = (" + h + ", " + w + ", 3). ¿Qué shape produce sumarle un vector de shape (3,)?",
      "(" + h + ", " + w + ", 3)", "El vector se alinea desde la derecha con C = Channels/canales y se aplica a cada píxel.",
      ["(3,)", "El vector se aplica a todos los píxeles; no reduce la imagen."],
      ["(" + h + ", " + w + ")", "La suma no elimina el eje de canales."],
      ["Error por shapes", "Los últimos ejes valen 3 y 3; el resto del vector se trata como dimensiones 1."]);
  }),
  ...range(v => q("l2", "02.03", v, "Entre (0, 0) y (" + 3 * v + ", " + 4 * v + "), ¿cuál es la distancia L2?",
    5 * v, "La raíz de (3n)² + (4n)² es 5n.",
    [7 * v, "Eso es L1: sumar desplazamientos absolutos."],
    [25 * v * v, "Es la distancia al cuadrado; falta la raíz."],
    [4 * v, "Es la norma L∞, el mayor desplazamiento individual."])),
  ...range(v => q("mean-kernel", "03.04", v, "Tres intensidades consecutivas son " + v + ", " + (v + 3) + " y " + (v + 6) + ". ¿Qué devuelve su media aritmética?",
    v + 3, "Suma los tres valores y divide entre tres.",
    [3 * v + 9, "Es la suma antes de dividir por el número de valores."],
    [v, "Es el primer valor, no el promedio del vecindario."],
    [v + 6, "Es el mayor valor, no el promedio."])),
  ...range(v => {
    const x = 180 + v;
    return q("uint8-wrap", "03.01", v, "En un array NumPy uint8, el valor " + x + " se suma a 80 sin conversión ni clip. ¿Qué valor se almacena?",
      x + 80 - 256, "La aritmética uint8 vuelve a cero al superar 255: " + (x + 80) + " mod 256.",
      [255, "255 saldría de aplicar clip; aquí no se ha aplicado."],
      [x + 80, "Ese resultado excede el rango uint8 y no es el valor almacenado."],
      [x, "La suma modifica el valor; no se mantiene la entrada."]);
  }),
  ...range(v => {
    const length = 4 + v;
    return q("erode-run", "04.02", v, "Una franja 1D de " + length + " unos está rodeada de ceros. Con erosión por ventana de tres posiciones, ¿cuántos unos quedan?",
      length - 2, "Se pierden los dos extremos; solo sobreviven centros con tres vecinos positivos.",
      [length + 2, "Eso describe una dilatación del intervalo."],
      [length, "Los extremos no tienen tres unos bajo la ventana."],
      [length - 1, "La erosión elimina un extremo a cada lado."]);
  }),
  ...range(v => {
    const length = 4 + v;
    return q("dilate-run", "04.03", v, "Una franja 1D de " + length + " unos tiene ceros libres a ambos lados. ¿Cuánto mide tras dilatar con ventana de tres?",
      length + 2, "Se añade una posición a cada extremo.",
      [length - 2, "Eso es una erosión de la franja."],
      [length, "La dilatación sí alcanza los vecinos vacíos."],
      [2 * length, "El elemento estructurante no duplica toda la franja."]);
  }),
  ...range(v => {
    const x = 10 + v, y = 5 + 2 * v, dx = 3 * v, dy = -v;
    return q("translation", "05.01", v, "Aplica la traslación (" + dx + ", " + dy + ") al punto " + xy(x, y) + ". ¿Dónde queda?",
      xy(x + dx, y + dy), "Suma el desplazamiento a cada coordenada.",
      [xy(x - dx, y - dy), "Has aplicado la traslación inversa."],
      [xy(x + dy, y + dx), "Has intercambiado los desplazamientos x e y."],
      [xy(x, y), "El punto solo permanecería igual con desplazamiento cero."]);
  }),
  ...range(v => {
    const length = 1001 + 10 * v, count = Math.ceil((length - 400) / 300) + 1;
    return q("tiles-count", "05.09", v, "Eje de " + length + " px: tiles de 400 px, paso 300 px. Empieza en 0 y añade un último tile pegado al borde si hace falta. ¿Cuántos inicios distintos?",
      count, "Cuenta 0, los pasos de 300 y el último inicio en L − 400 para cubrir el borde.",
      [count - 1, "Falta el tile final que cubre el borde derecho."],
      [count + 1, "Has contado un inicio adicional después de cubrir el borde."],
      [count - 2, "Has omitido dos posiciones del recorrido solapado; la longitud no quedaría cubierta."]);
  }),
  ...range(v => {
    const patients = 4 + v;
    return q("split-groups", "06.02", v, patients + " pacientes aportan 5 imágenes cada uno. Para evitar fuga entre train y test, ¿cuántas unidades independientes hay como máximo?",
      patients, "Agrupa todas las imágenes de cada paciente antes de dividir.",
      [patients * 5, "Es el número de imágenes, pero cinco comparten el mismo paciente."],
      [patients + 1, "No existe un grupo adicional: la unidad independiente es cada paciente."],
      [1, "Hay varios pacientes independientes, no un único grupo."]);
  }),
  ...range(v => q("knn-l1", "06.04", v, "¿Cuál es la distancia L1 entre (" + v + ", 0) y (0, " + 2 * v + ")?",
    3 * v, "Suma las dos diferencias absolutas: n + 2n.",
    [Math.sqrt(5) * v + "", "Eso se aproxima a L2, que usa cuadrados y raíz."],
    [v, "Falta la diferencia del segundo eje."],
    [2 * v, "Falta la diferencia del primer eje."])),
  ...range(v => {
    const n = 3 + v, m = 4 + v % 7;
    return q("dense-params", "07.01", v, "Capa densa con " + n + " entradas, " + m + " salidas y un sesgo por salida. ¿Cuántos parámetros?",
      (n + 1) * m, "Hay n × m pesos y m sesgos.",
      [n * m, "Has omitido un sesgo para cada neurona de salida."],
      [n + m, "Sumar dimensiones no cuenta todas las conexiones."],
      [n * m + 1, "Hay m sesgos, no un único sesgo para toda la capa."]);
  }),
  ...range(v => q("relu", "07.02", v, "ReLU aplicada a (" + -v + ", 0, " + (v + 2) + ") produce...",
    "(" + 0 + ", 0, " + (v + 2) + ")", "ReLU(x) = max(0, x) en cada componente.",
    ["(" + -v + ", 0, " + (v + 2) + ")", "ReLU sustituye las entradas negativas por cero."],
    ["(" + v + ", 0, " + (v + 2) + ")", "ReLU no toma valor absoluto de los negativos."],
    ["(0, 0, 0)", "Las entradas positivas pasan sin alteración."])),
  ...range(v => {
    const n = 101 + 10 * v, batches = Math.ceil(n / 16);
    return q("steps-epoch", "08.01", v, n + " ejemplos, batch size 16, sin descartar el último batch incompleto. ¿Cuántos pasos por época?",
      batches, "El último batch también cuenta: ceil(N/16).",
      [batches - 1, "Eso descarta el último batch incompleto."],
      [n, "Un paso procesa un batch, no un solo ejemplo."],
      [batches + 1, "Has contado un batch de más tras consumir los ejemplos."]);
  }),
  ...range(v => {
    const n = 1000 + 10 * v, holdout = n / 5;
    return q("validation-count", "08.07", v, "Reservas el 20% de " + n + " muestras independientes para validación. ¿Cuántas van a validación?",
      holdout, "20% equivale a dividir entre cinco.",
      [n - holdout, "Eso es el 80% restante para entrenamiento."],
      [n / 10, "Eso sería una reserva del 10%."],
      [n, "No se reserva el conjunto completo para validación."]);
  }),
  ...range(v => {
    const n = 31 + 2 * v, output = 16 + v;
    return q("conv-output", "09.02", v, "Eje de tamaño " + n + ", kernel 3, padding 1 y stride 2. ¿Tamaño de salida de la convolución?",
      output, "floor((N + 2p − k)/s) + 1.",
      [output - 1, "Has omitido el padding o la última posición válida."],
      [n, "El stride 2 reduce la resolución."],
      [output + 1, "El cálculo de posiciones usa suelo, no techo adicional."]);
  }),
  ...range(v => {
    const cin = 2 + v;
    return q("conv-params", "09.01", v, "Convolución 3×3 de " + cin + " canales de entrada a 4 filtros de salida, con sesgo. ¿Cuántos parámetros?",
      9 * cin * 4 + 4, "3 × 3 × canales de entrada × filtros + 4 sesgos.",
      [9 * cin * 4, "Faltan los cuatro sesgos."],
      [9 * cin, "Solo has contado los pesos de un filtro, no de los cuatro."],
      [cin * 4, "Falta multiplicar por el área 3 × 3 del kernel."]);
  }),
  ...range(v => {
    const tp = 20 + v;
    return q("precision", "10.04", v, "TP = " + tp + ", FP = 10 y FN = 5. ¿Cuál es la precision de la clase positiva?",
      ratio(tp, tp + 10), "Precision = TP/(TP + FP).",
      [ratio(tp, tp + 5), "Ese denominador corresponde a recall, que usa FN."],
      [ratio(10, tp + 10), "Eso es la proporción de falsos positivos entre predicciones positivas."],
      [ratio(tp, tp + 15), "Has sumado FN aunque precision solo considera las predicciones positivas."]);
  }),
  ...range(v => {
    const tp = 20 + v;
    return q("recall", "10.04", v, "TP = " + tp + ", FP = 10 y FN = 5. ¿Cuál es el recall de la clase positiva?",
      ratio(tp, tp + 5), "Recall = TP/(TP + FN).",
      [ratio(tp, tp + 10), "Eso es precision: incluye FP en el denominador."],
      [ratio(5, tp + 5), "Es la tasa de positivos omitidos, el complemento del recall."],
      [ratio(tp, tp + 15), "FP no forma parte de los positivos reales."]);
  }),
  ...range(v => {
    const side = 100 + v, d = 20 + v, intersection = 80 * side, union = 2 * side * side - intersection;
    return q("box-iou", "11.02", v, "Dos cajas cuadradas de lado " + side + " px se desplazan " + d + " px solo en x. ¿Cuál es IoU exacta?",
      ratio(intersection, union), "Intersección = 80 × lado; unión = 2 × lado² − intersección.",
      [ratio(intersection, side * side), "Eso divide por el área de una sola caja; IoU divide por la unión."],
      [ratio(intersection, 2 * side * side), "Has sumado áreas sin restar el solape."],
      [ratio(d * side, union), "El desplazamiento no es la anchura de intersección."]);
  }),
  ...range(v => {
    const ox = 100 + v, oy = 40 + v;
    return q("tile-global", "11.01", v, "Tile con origen (" + ox + ", " + oy + "); caja xyxy local (" + v + ", " + 2 * v + ", " + (v + 20) + ", " + (2 * v + 10) + "). ¿Caja global?",
      "(" + (ox + v) + ", " + (oy + 2 * v) + ", " + (ox + v + 20) + ", " + (oy + 2 * v + 10) + ")",
      "Suma el origen a ambas esquinas, manteniendo anchura y altura.",
      ["(" + v + ", " + 2 * v + ", " + (v + 20) + ", " + (2 * v + 10) + ")", "Son coordenadas locales, sin el origen del tile."],
      ["(" + (ox + v) + ", " + (oy + 2 * v) + ", " + (v + 20) + ", " + (2 * v + 10) + ")", "También hay que trasladar la esquina inferior derecha."],
      ["(" + (ox + v) + ", " + (oy + 2 * v) + ", " + (ox + 20) + ", " + (oy + 10) + ")", "Has perdido la posición local de la esquina inferior derecha."]);
  }),
  ...range(v => {
    const tp = 10 + v;
    return q("mask-iou", "12.02", v, "Máscara binaria: TP = " + tp + ", FP = 3, FN = 5. ¿Cuál es su IoU?",
      ratio(tp, tp + 8), "IoU = TP/(TP + FP + FN).",
      [ratio(2 * tp, 2 * tp + 8), "Eso es Dice, que da doble peso a TP."],
      [ratio(tp, tp + 3), "Es precision de píxel positivo, sin contar FN."],
      [ratio(tp, tp + 5), "Es recall positivo, sin contar FP."]);
  }),
  ...range(v => {
    const length = 100 + v;
    return q("cer", "12.05", v, "Referencia OCR de " + length + " caracteres: hay " + v + " sustituciones y ninguna inserción o borrado. ¿CER?",
      ratio(v, length), "CER = distancia de edición dividida por longitud de referencia.",
      [ratio(v, 100), "El denominador es la longitud real de esta referencia, no cien por defecto."],
      [ratio(length, v), "Has invertido numerador y denominador."],
      [ratio(v, length + v), "No se divide entre la longitud conjunta de referencia y errores."]);
  }),
  ...range(v => {
    const n = 4 + v;
    return q("vit-patches", "13.01", v, "Imagen cuadrada de lado " + n * 16 + " px con parches 16×16 sin solape. ¿Cuántos tokens de parche se obtienen (sin token extra)?",
      n * n, "Hay lado/16 parches por eje; multiplica filas por columnas.",
      [n, "Solo has contado los parches de un eje."],
      [n * n + 1, "Eso incluiría un token adicional que el enunciado excluye."],
      [2 * n, "Sumar los dos ejes no cuenta todas las celdas."]);
  }),
  ...range(v => {
    const n = 20 + v;
    return q("attention-pairs", "13.02", v, "Autoatención densa sobre " + n + " tokens: ¿cuántos pares consulta-clave hay en una matriz de atención por cabeza?",
      n * n, "Cada uno de los N tokens consulta a N claves.",
      [n, "Eso cuenta consultas, no todas sus relaciones con claves."],
      [n * (n - 1) / 2, "No se restringe a pares no ordenados ni se omite la diagonal."],
      [2 * n, "La matriz tiene N filas y N columnas, no 2N entradas."]);
  }),
  ...range(v => {
    const fps = 20 + v, duration = 10 + v;
    return q("video-frames", "14.01", v, "Vídeo de " + duration + " s a " + fps + " fps constantes. ¿Cuántos frames contiene, suponiendo duración exacta?",
      duration * fps, "Multiplica frames por segundo por segundos.",
      [duration + fps, "Sumar duración y tasa mezcla unidades distintas."],
      [fps, "Es solo un segundo de vídeo."],
      [10 * fps, "Has usado diez segundos y omitido la duración indicada."]);
  }),
  ...range(v => {
    const f = 800 + 10 * v, d = 40 + v, depth = (f * 0.1 / d).toFixed(3) + " m";
    return q("stereo-depth", "14.05", v, "Estéreo rectificado: focal " + f + " px, baseline 0,1 m, disparidad " + d + " px. ¿Profundidad aproximada?",
      depth, "Z = f × baseline / disparidad; px se cancelan y quedan metros.",
      [(f * d / 0.1).toFixed(3) + " m", "Has multiplicado por la disparidad en lugar de dividir."],
      [(d / (f * 0.1)).toFixed(3) + " m", "Has invertido la relación profundidad-disparidad."],
      [(f * 0.1).toFixed(3) + " m", "Falta dividir por la disparidad medida."]);
  }),
  ...range(v => {
    const people = 12 + v;
    return q("independent-units", "15.01", v, people + " pacientes tienen 6 imágenes cada uno. ¿Cuántas unidades independientes debes considerar para un split por paciente?",
      people, "Mantén las seis imágenes de una persona en el mismo grupo.",
      [people * 6, "Eso cuenta imágenes correlacionadas como si fueran pacientes diferentes."],
      [6, "Es el número de imágenes por paciente, no el número de grupos."],
      [1, "Hay varios pacientes; la unidad es cada paciente."]);
  }),
  ...range(v => {
    const agreed = 80 + v, total = 120 + v;
    return q("label-agreement", "15.02", v, "Dos anotadores coinciden en " + agreed + " de " + total + " imágenes. ¿Cuál es el acuerdo observado (sin corrección por azar)?",
      ratio(agreed, total), "Divide coincidencias por imágenes revisadas.",
      [ratio(total - agreed, total), "Eso es la fracción de desacuerdos."],
      [ratio(agreed, 120), "El denominador debe ser el total indicado, que cambia en este caso."],
      [ratio(agreed, total * 2), "No dupliques imágenes porque haya dos anotadores."]);
  }),
  ...range(v => {
    const capture = 10 + v, pre = 5 + v, infer = 40 + v, post = 8;
    return q("request-latency", "16.01", v, "Una petición tarda " + capture + " ms en captura, " + pre + " ms en preproceso, " + infer + " ms en inferencia y 8 ms en postproceso. Sin solape, ¿latencia extremo a extremo de esta petición?",
      capture + pre + infer + post, "Suma las cuatro etapas de esa petición concreta.",
      [infer, "Eso solo mide inferencia y omite el resto del pipeline."],
      [capture + infer, "Faltan preproceso y postproceso."],
      [capture + pre + infer, "Faltan los ocho milisegundos de postproceso."]);
  }),
  ...range(v => {
    const batch = 8 + v;
    return q("batch-throughput", "16.02", v, "Un batch de " + batch + " imágenes tarda 0,2 s de extremo a extremo. En régimen continuo y sin cuello externo, ¿throughput aproximado?",
      5 * batch + " imágenes/s", "Divide imágenes del batch entre 0,2 segundos.",
      [batch / 5 + " imágenes/s", "Has multiplicado por el tiempo en vez de dividir."],
      [batch + " imágenes/s", "Ese número correspondería a un batch por segundo."],
      [5 * (batch - 1) + " imágenes/s", "No se descarta ninguna imagen del batch."]);
  }),
  ...range(v => {
    const fov = 100 + v;
    return q("crack-resolution", "17.02", v, "Una cámara ve " + fov + " mm en 2000 px de ancho. Una grieta mide 0,2 mm. ¿Cuántos píxeles ocupa en teoría?",
      (400 / fov).toFixed(2) + " px", "Píxeles = (ancho de defecto / campo de visión) × 2000.",
      [(2000 / fov).toFixed(2) + " px", "Son píxeles por milímetro; falta multiplicar por 0,2 mm."],
      [(0.2 * fov / 2000).toFixed(2) + " px", "Has invertido la conversión espacial."],
      [(400 / (2000 + v)).toFixed(2) + " px", "El denominador debe ser el campo de visión en milímetros."]);
  }),
  ...range(v => {
    const good = 1000 + 100 * v;
    return q("false-alarms", "17.05", v, "Se inspeccionan " + good + " piezas buenas al día. Con tasa de falsos positivos del 1% por pieza buena, ¿cuántas alarmas falsas esperas en promedio?",
      10 + v, "Aplica 0,01 al número de piezas realmente buenas.",
      [good, "Eso supondría alarmar en todas las piezas buenas."],
      [100 + 10 * v, "Eso sería una tasa del 10%, no del 1%."],
      [1, "Un 1% no equivale a una alarma fija si cambia el volumen."]);
  }),
  ...range(v => {
    const total = 10000 + 500 * v, positives = total * .02, missed = positives * .1;
    return q("missed-defects", "18.06", v, total + " piezas/día, 2% defectuosas y recall de defectos del 90%. ¿Cuántos defectos se omiten en promedio?",
      missed, "Hay " + positives + " positivos; el 10% no detectado son FN.",
      [positives, "Eso es el total de defectos, antes de aplicar recall."],
      [positives - missed, "Son verdaderos positivos detectados, no los omitidos."],
      [total - positives, "Son piezas buenas, no defectos perdidos."]);
  }),
  ...range(v => {
    const object = 8 + v, result = (object * 640 / 4000).toFixed(2);
    return q("resize-object", "18.04", v, "Un objeto de " + object + " px de ancho en una imagen de 4000 px se redimensiona a 640 px de ancho. Si el escalado es uniforme, ¿cuánto mide ahora?",
      result + " px", "Multiplica por el factor 640/4000 = 0,16.",
      [object + " px", "El objeto también se reduce al redimensionar toda la imagen."],
      [(object * 4000 / 640).toFixed(2) + " px", "Has invertido el factor de escala."],
      [(object * .64).toFixed(2) + " px", "El factor es 0,16, no 0,64."]);
  }),
];
