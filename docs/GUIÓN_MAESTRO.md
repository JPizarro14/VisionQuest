# VisionQuest · guion maestro

Actualizado el 28 de septiembre de 2026. Este documento es el mapa de los **18 sectores y 143 misiones**. Cada misión tiene explicación, experimento y tres preguntas con diagnóstico; las 50 misiones de los sectores 11–18 añaden un caso abierto con pauta de autocorrección.

## Criterio de cada misión

1. Una intuición comprensible y una definición precisa, con convención y límites explícitos.
2. Un ejemplo numérico o visual que el estudiante pueda manipular y del que pueda anticipar el resultado.
3. Tres preguntas de razonamiento, con distractores verosímiles y explicación individual para cada opción; dominio 3/3 sin penalización por repetir.
4. Fuente técnica primaria, caso límite y, en los sectores avanzados, transferencia a una situación distinta de las preguntas cerradas.
5. No alterar identificadores ya publicados ni borrar el progreso o los apuntes existentes.

**Estado del contenido:** sectores 01–18 implementados (143 misiones). El desbloqueo en el sitio sigue siendo secuencial por dominio, no por fecha de publicación. Los sectores 11–18 tienen 50 laboratorios y 50 casos abiertos.

## Convención para las dimensiones de imagen

Al introducir o recuperar la forma de una imagen NumPy, escribe **`(H, W, C)`** junto con los nombres de los ejes: **H = Height (alto, filas)**, **W = Width (ancho, columnas)** y **C = Channels (canales)**. Una imagen RGB de 640 píxeles de ancho y 480 de alto tiene `shape (480, 640, 3)`; una imagen de grises sin eje de canal explícito tiene `(H, W)`. Para lotes, añade **N = número de imágenes (batch)** y aclara si la disposición es `(N, H, W, C)` o `(N, C, H, W)`. Repite la equivalencia inglés/español en los ejemplos, preguntas y laboratorios donde pueda confundirse el orden. Las coordenadas `(x, y)` y el acceso `imagen[y, x]` se explican por separado.

## Itinerario de 18 sectores

| Sector | Estado | Contenidos y práctica que deben quedar cubiertos |
|---|---|---|
| 01 · Imagen como dato | Disponible | Píxeles, ejes, dtype, canales, espacios de color, muestreo, tensores. **ROI** como región elegida, recorte rectangular `imagen[y1:y2, x1:x2]`, máscara y retorno de coordenadas locales a globales. |
| 02 · Matemáticas necesarias | Disponible | Álgebra de arrays, distancias, producto escalar y matricial, rango, SVD/PCA, gradientes, probabilidad, estadística y estabilidad. |
| 03 · Operaciones sobre imágenes | Disponible | Aritmética, gamma, máscaras, filtros, bordes, Canny y frecuencia. Umbral fijo, **Otsu** (varianza intraclase ponderada), umbral adaptativo; comparar resultados bajo ruido e iluminación desigual. |
| 04 · Morfología e histogramas | Disponible | Erosión, dilatación, apertura, cierre, componentes, histogramas, ecualización y CLAHE. Interpretar el histograma que usa Otsu; distinguir teselas de CLAHE de parches de inferencia. |
| 05 · Geometría y visión clásica | Disponible | Coordenadas homogéneas, transformaciones afines y proyectivas, interpolación, homografías, cámara y calibración, esquinas/descriptores/matching, flujo óptico básico. **ROI, crop, patch, tile, stride y overlap**: recorte manual o por máscara frente a partición sistemática; objetos partidos en bordes, rejilla desplazada, coordenadas locales/globales y fusión de resultados. Laboratorio de teselas superpuestas. |
| 06 · Machine learning | Disponible | Formulación supervisada, split y fuga de datos, features, k-NN/SVM/árboles como referencias, sesgo-varianza y evaluación. |
| 07 · Redes neuronales | Disponible | Perceptrón, capas, activaciones, pérdida, backpropagation, optimizadores y regularización. |
| 08 · Entrenamiento | Disponible | Batch/epoch, augmentations coherentes con etiquetas, normalización, learning rate, checkpoints, reproducibilidad y sobreajuste. |
| 09 · CNN y arquitecturas | Disponible | Convolución aprendida, receptive field, stride/padding/dilation, pooling, residual connections, transfer learning y eficiencia. |
| 10 · Clasificación | Disponible | Multiclase/multietiqueta, logits, calibración, matriz de confusión, precision/recall/F1, umbrales, desbalance y explicabilidad prudente. |
| 11 · Detección | Disponible · 8 | Bounding boxes y convenciones, anchors y anchor-free, matching, NMS, AP/mAP. **IoU = intersección / unión** para cajas, distinto de score. Detección por tiles, bordes y fusión en coordenadas globales. Laboratorios específicos de IoU, NMS y tiles. |
| 12 · Segmentación, pose y OCR | Disponible · 6 | Semántica, instancias y panóptica (**things** con instancia; **stuff** por región), **IoU por clase / mIoU y Dice**, clases ausentes y fondo, pérdidas, keypoints, OCR y evaluación de cascadas. |
| 13 · Transformers y modelos base | Disponible · 6 | Atención y tokens visuales, ViT, DETR, segmentación condicionada, embeddings, zero-shot, adaptación y límites de dominio. |
| 14 · Vídeo y visión 3D | Disponible · 6 | Muestreo temporal, flujo, seguimiento, asociación, proyección pinhole sin distorsión, rectificación estéreo y profundidad. |
| 15 · Datos y diagnóstico | Disponible · 6 | Etiquetado, desacuerdo, drift, subgrupos, incertidumbre y validación sin fuga de tiles ni frames. |
| 16 · Producción | Disponible · 6 | Contrato de inferencia, batch/latencia, cuantización, monitorización, privacidad, edge/servidor y costes. |
| 17 · Arquitectura de sistemas CV | Disponible · 6 | Requisitos, captura, ROI/tiles, baseline, evaluación y fiabilidad de un pipeline bajo restricciones reales. Declarar el denominador de FPR (piezas buenas) y de recall (defectos reales). |
| 18 · Entrevistas técnicas | Disponible · 6 | Casos de fundamentos, métricas, experimentos, arquitectura y producción; propuesta integradora con cálculo de FN por volumen y presupuesto de latencia bajo carga. |

## Relaciones que no deben confundirse

- **ROI** indica qué región interesa; **crop** es una operación que extrae un rectángulo; una ROI puede representarse también con una máscara no rectangular.
- **Patch/tile** es un fragmento de imagen. **Stride** es el salto de la ventana; cuando es menor que su tamaño, hay solapamiento. Una segunda rejilla desplazada es una estrategia concreta para mejorar la cobertura de los bordes.
- Las teselas de **CLAHE** se usan para histogramas locales e interpolación; las teselas de inferencia son entradas de un modelo. Comparten el nombre y una partición espacial, no el objetivo.
- **Otsu** elige un umbral global; el umbral adaptativo varía según la posición. Ninguno conoce por sí solo la semántica del objeto.
- **IoU** mide solapamiento de dos regiones, no «porcentaje de aciertos» del modelo entero. El valor 0,5 no es universalmente bueno: depende del objeto, la anotación y el protocolo. En segmentación, aclarar el tratamiento de clases sin píxeles antes de promediar.

## Cómo recorrerlo

1. Sectores 01–05: aprende representación, matemáticas, filtros, morfología, geometría y el papel de ROI, crop y tiles.
2. Sectores 06–10: pasa de datos y entrenamiento a CNN y métricas de clasificación.
3. Sectores 11–14: practica IoU con cajas y máscaras, detección, modelos base, vídeo y geometría 3D.
4. Sectores 15–18: diseña experimentos y sistemas reales; explica decisiones con números, límites y planes de verificación.

La ruta se desbloquea misión a misión tras 3/3. Los casos abiertos tienen pauta de autocorrección y no se califican automáticamente: úsalos para comprobar retención y razonamiento, no solo reconocimiento de opciones. El [plan de estudio](PLAN_ESTUDIO.md) compara un ritmo sostenible con el exigente objetivo de diciembre.
