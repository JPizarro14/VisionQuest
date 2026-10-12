import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
{
id:"13.01",navTitle:"Tokens visuales",title:"De imagen a secuencia de parches",
objective:"Calcular número de parches y reconocer pérdida de detalle por tamaño.",
lead:"Un ViT divide la imagen en parches y proyecta cada parche a un vector.",
keyIdea:"Para una imagen (H, W), H = Height (alto) y W = Width (ancho). Con parches P×P que dividen exactamente ambos ejes, el número de tokens de parches es (H/P)·(W/P).",
sections:[["Tokenizar","Una imagen 224×224 con P=16 produce 14×14=196 parches, antes de tokens adicionales.","Un parche grande reduce secuencia pero puede esconder detalles pequeños."],["Posición","La atención no conoce por sí misma la ubicación espacial; se incorpora información de posición según la arquitectura.","Cambiar resolución puede requerir adaptar embeddings o mecanismo posicional."],["Coste","La atención densa escala cuadráticamente con longitud de secuencia en su matriz de scores.","No infieras tiempo exacto solo de esa complejidad: proyecciones, memoria y hardware importan."]],
takeaways:["P determina cantidad de tokens.","La posición requiere representación.","Más resolución suele costar memoria."],
questions:[
["224×224 con parches 16×16 produce...",["196 parches","16","224","256"],0,["Correcto: 14·14.","Es lado del parche.","Es lado imagen.","Sería 16·16 tokens."]],
["Parches más pequeños a igual imagen implican...",["Más tokens","Menos píxeles originales","Igual coste siempre","Menos detalle"],0,["Correcto: más subdivisiones.","La imagen no cambia.","Coste depende.","Preservan más detalle espacial."]],
["La atención densa forma una matriz entre...",["Pares de tokens","Solo clases","Solo canales RGB","Tiles de train/test"],0,["Correcto: relaciona posiciones de secuencia.","No exclusivamente.","No son necesariamente canales.","No es split."]]
],labTitle:"Divide la imagen",labInstruction:"Cambia el tamaño del parche de 224×224 y cuenta tokens.",source:["Dosovitskiy et al. · ViT","https://arxiv.org/abs/2010.11929"]
},
{
id:"13.02",navTitle:"Autoatención",title:"Preguntas, claves y valores",
objective:"Interpretar pesos de atención y su normalización.",
lead:"Cada token consulta otros tokens mediante semejanzas entre Q y K y combina sus V.",
keyIdea:"Attention(Q,K,V)=softmax(QKᵀ/√d_k)V; los pesos de una consulta suman 1 sobre claves válidas.",
sections:[["Tres proyecciones","Q pregunta, K permite comparar y V aporta contenido; se aprenden a partir de representaciones.","Un peso alto no es por sí solo una explicación causal del modelo."],["Máscaras","Una máscara puede impedir atender a posiciones de padding u otras posiciones prohibidas.","En clasificación visual bidireccional no se exige la máscara causal de generación de texto."],["Cabezas","Varias cabezas proyectan subespacios distintos y concatenan resultados.","Más cabezas no garantizan mejor calidad; comprueba capacidad y coste."]],
takeaways:["QK produce scores.","Softmax normaliza por consulta.","Atención no prueba causalidad."],
questions:[
["Si dos pesos normalizados son 0,2 y 0,8, su suma...",["1","0,6","2","Depende de RGB"],0,["Correcto: distribución sobre dos claves.","Suma mal.","No está normalizado.","No corresponde."]],
["¿Qué vector se combina con pesos de atención?",["V","Q exclusivamente","GT","Gradiente"],0,["Correcto: valores.","Consulta origina scores.","No es anotación.","No define salida."]],
["Un mapa de atención alto demuestra causalidad?",["No, requiere pruebas adicionales","Sí siempre","Solo con softmax","Solo con 16 parches"],0,["Correcto: correlación de pesos no basta.","No prueba efecto.","Softmax no prueba.","No cambia."]]
],labTitle:"Pondera valores",labInstruction:"Cambia un peso entre dos valores y observa la suma ponderada.",source:["Vaswani et al. · Attention Is All You Need","https://arxiv.org/abs/1706.03762"]
},
{
id:"13.03",navTitle:"DETR y asignación",title:"Predicciones como conjunto",
objective:"Explicar matching bipartito y la diferencia con NMS convencional.",
lead:"DETR formula un conjunto de predicciones y empareja predicciones con objetos reales durante entrenamiento.",
keyIdea:"Un matching uno a uno y clase «sin objeto» penalizan duplicados; el DETR original no requiere NMS clásico en su diseño.",
sections:[["Consultas","Un número fijo de object queries produce posibles objetos, incluidos muchos «sin objeto».","El número de consultas limita el máximo representable en una pasada de esa configuración."],["Matching","Una asignación bipartita minimiza un coste que considera clase y caja.","No confundas el matching de entrenamiento con AP de evaluación."],["Comparar","El DETR original es un diseño concreto; variantes pueden cambiar entrenamiento y postproceso.","Evalúa objetos pequeños y coste en la misma tarea antes de elegirlo."]],
takeaways:["Matching uno a uno limita duplicados.","«Sin objeto» absorbe consultas libres.","Diseño y variante importan."],
questions:[
["Con 100 queries fijas, el máximo de predicciones no vacías por pasada es...",["100","Infinito","1","Depende de canales"],0,["Correcto: una salida por query.","No en esa configuración.","Pueden ser varias.","No depende así."]],
["En DETR original el matching de entrenamiento es...",["Uno a uno","Cada predicción con todos los GT","Solo por color","NMS antes de GT"],0,["Correcto: asignación bipartita.","Provocaría duplicados.","No basta.","NMS no es matching."]],
["El diseño original exige NMS clásico?",["No","Sí siempre","Solo en OCR","Solo con dos clases"],0,["Correcto: predicción de conjunto evita esa etapa.","No en el original.","Otra tarea.","No depende."]]
],labTitle:"Asigna consultas",labInstruction:"Aumenta objetos reales frente a diez consultas disponibles.",source:["Carion et al. · DETR","https://arxiv.org/abs/2005.12872"]
},
{
id:"13.04",navTitle:"Segmentación con prompts",title:"Pedir una máscara con una pista",
objective:"Distinguir prompt, máscara candidata y validación de dominio.",
lead:"Un punto o caja puede orientar un modelo de segmentación general hacia una región.",
keyIdea:"Un modelo base condicionado por prompts ofrece máscaras candidatas; la utilidad en un dominio específico debe medirse con anotaciones propias.",
sections:[["Prompts","Un punto positivo indica región deseada; puntos negativos o caja reducen ambigüedad según la interfaz.","Una máscara generada puede incluir sombra o excluir borde aunque se vea plausible."],["Evaluación","Compara IoU, tiempo de anotación y correcciones humanas sobre imágenes representativas.","No presentes un modelo preentrenado como garantía de rendimiento en microscopía o defectos."],["Uso","Mantén trazabilidad de prompt, versión y anotador cuando generes etiquetas asistidas.","Si etiquetas asistidas alimentan test sin revisión independiente, la evaluación puede heredarlas."]],
takeaways:["Prompt condiciona salida.","Candidato requiere verificación.","Mide ahorro y calidad."],
questions:[
["Una caja prompt es...",["Una pista espacial para máscara","Siempre GT perfecto","Una métrica AP","Un batch"],0,["Correcto: condiciona salida.","Puede ser aproximada.","No es métrica.","No es lote."]],
["¿Cómo validar en dominio nuevo?",["Máscaras GT representativas y protocolo","Solo una demo vistosa","Solo tamaño del modelo","Solo prompt más largo"],0,["Correcto: mide utilidad.","Una demo elegida a mano no estima el rendimiento en una muestra representativa del dominio nuevo.","No garantiza.","No basta."]],
["Etiquetas generadas automáticamente para test sin revisar pueden...",["Sesgar evaluación","Asegurar independencia","Eliminar clases raras","Aumentar resolución"],0,["Correcto: se heredan errores.","No necesariamente.","No corrige cobertura.","No es resize."]]
],labTitle:"Corrige máscara",labInstruction:"Cambia falsos positivos de una máscara candidata de diez píxeles reales.",source:["Kirillov et al. · Segment Anything","https://arxiv.org/abs/2304.02643"]
},
{
id:"13.05",navTitle:"Embeddings y zero-shot",title:"Comparar imagen y texto en un espacio",
objective:"Separar similitud relativa de probabilidad calibrada.",
lead:"Un modelo contrastivo puede puntuar una imagen frente a descripciones textuales sin entrenar una cabeza para cada etiqueta.",
keyIdea:"La similitud entre embeddings ordena candidatos del conjunto de prompts; una softmax sobre esos candidatos no garantiza probabilidades calibradas en el mundo real.",
sections:[["Prompts","«Grieta», «superficie intacta» y otras descripciones compiten según cómo se redacten.","Cambiar el conjunto de textos puede cambiar el score normalizado sin cambiar la imagen."],["Distribución","Zero-shot no significa sin datos previos: el modelo fue preentrenado.","En un dominio raro verifica vocabulario, sesgo, objetos pequeños y fallos de dominio."],["Baselines","Compara con un clasificador supervisado pequeño, calidad por clase y coste.","Fija prompts antes de test; afinarlos sobre test es selección de modelo."]],
takeaways:["Score depende de candidatos.","Zero-shot usa preentrenamiento.","Calibración exige evaluación."],
questions:[
["Agregar otro prompt puede cambiar probabilidades softmax entre textos?",["Sí","No nunca","Solo con NMS","Solo con vídeo"],0,["Correcto: cambia el denominador.","Puede cambiar.","No hay cajas.","No depende."]],
["Zero-shot significa modelo sin preentrenamiento?",["No","Sí","Solo si hay dos clases","Solo en RGB"],0,["Correcto: reutiliza aprendizaje previo.","No.","No define.","No define."]],
["Elegir prompts usando test...",["Contamina la evaluación","Es siempre inocuo","Mejora GT","Reduce resolución"],0,["Correcto: test deja de ser final.","Hay selección.","GT no cambia.","No es imagen."]]
],labTitle:"Añade candidato",labInstruction:"Varía score de un tercer texto y observa normalización relativa.",source:["Radford et al. · CLIP","https://arxiv.org/abs/2103.00020"]
},
{
id:"13.06",navTitle:"Adaptación responsable",title:"Qué congelar y qué medir",
objective:"Planificar fine-tuning y evaluación de un modelo preentrenado.",
lead:"Una representación general puede necesitar adaptación; cuanto menos dato, mayor riesgo de sobreajuste y fuga.",
keyIdea:"Compara baseline congelado, cabeza entrenada y fine-tuning parcial bajo el mismo split por origen y test intacto.",
sections:[["Opciones","Extraer embeddings y entrenar cabeza es un baseline barato; descongelar más capas permite adaptar representación.","Tamaño de dataset, memoria y desplazamiento de dominio guían la elección."],["Validación","Fija preprocesamiento y datos de cada versión, informa múltiples semillas si la muestra es pequeña.","No mezcles tiles o fotogramas hermanos entre particiones."],["Decisión","No elijas por una décima de mAP sin intervalo, error por subgrupo y coste.","Recuerda licencias, origen del preentrenamiento y restricciones del caso."]],
takeaways:["Compara baselines con mismo split.","Más entrenamiento aumenta coste.","Mide incertidumbre y subgrupos."],
questions:[
["Baseline razonable con pocos datos...",["Embeddings congelados más cabeza","Entrenar un ViT enorme desde cero siempre","Mezclar test en train","Solo mirar loss"],0,["Correcto: controla coste y fuga.","No siempre.","Incluir ejemplos de test en entrenamiento invalida una evaluación independiente y exagera el rendimiento.","Falta métrica." ]],
["Dos modelos en splits distintos se comparan limpiamente?",["No","Sí, siempre","Solo si son transformers","Solo con NMS"],0,["Correcto: cambia dificultad.","No.","No depende arquitectura.","No basta."]],
["Mejora mínima de AP justifica desplegar sin medir coste?",["No","Sí, siempre","Solo con zero-shot","Solo con 100 prompts"],0,["Correcto: hay restricciones reales.","No siempre.","No resuelve.","No resuelve."]]
],labTitle:"Compara coste",labInstruction:"Varía cantidad de capas entrenables de doce y observa un presupuesto conceptual.",source:["PyTorch · transfer learning tutorial","https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"]
}
];
export const sectorThirteenLessons=buildSector(draft);
