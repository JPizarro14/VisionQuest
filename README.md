# VisionQuest

VisionQuest es una plataforma interactiva para aprender **Computer Vision desde los fundamentos hasta el diseño de sistemas reales y las entrevistas técnicas exigentes**.

La idea no es memorizar preguntas aisladas. Cada concepto se presenta de forma progresiva, con lenguaje coloquial, modelos mentales, ejemplos cotidianos, pequeñas simulaciones y preguntas de refuerzo.

## Objetivo

El recorrido está pensado para desarrollar tres capacidades:

1. comprender qué ocurre dentro de los modelos, no limitarse a utilizarlos;
2. elegir datos, operaciones, arquitecturas, métricas e infraestructura con criterio;
3. defender esas decisiones en una entrevista técnica o ante un equipo de ingeniería.

## Estado del proyecto

La versión actual contiene los dieciocho sectores del guion:

- **Sector 01 · La imagen como dato:** 7 misiones.
- **Sector 02 · Matemáticas necesarias:** 12 misiones.
- **Sector 03 · Operaciones sobre imágenes:** 12 misiones.
- **Sector 04 · Morfología e histogramas:** 12 misiones.
- **Sector 05 · Geometría y visión clásica:** 10 misiones.
- **Sector 06 · Machine learning:** 8 misiones.
- **Sector 07 · Redes neuronales:** 8 misiones.
- **Sector 08 · Entrenamiento:** 8 misiones.
- **Sector 09 · CNN y arquitecturas:** 8 misiones.
- **Sector 10 · Clasificación:** 8 misiones.
- **Sector 11 · Detección:** 8 misiones.
- **Sectores 12–18:** 6 misiones cada uno (segmentación, modelos base, vídeo/3D, datos, producción, sistemas y entrevistas).

El segundo sector cubre estructuras numéricas, broadcasting, normas y distancias, producto escalar, similitud coseno, producto matricial, rango, inversa, condicionamiento, autovalores, SVD, PCA, gradientes, regla de la cadena, probabilidad, estadística y estabilidad numérica.

En los ejemplos de NumPy se usa la notación `(H, W, C)`: H = **Height (alto)**, W = **Width (ancho)** y C = **Channels (canales)**. Las lecciones y los laboratorios muestran los nombres en ambos idiomas para fijar el orden de los ejes.

El tercer sector cubre aritmética de píxeles, curvas de intensidad, máscaras, umbrales fijos y adaptativos, Otsu, kernels, correlación y convolución, padding, suavizado, mediana, bilateral, Sobel, Scharr, Laplaciano, enfoque, Canny, Fourier y diseño de pipelines de filtrado.

El quinto sector cubre transformaciones afines, remuestreo, coordenadas homogéneas, homografías, cámara y calibración, esquinas y descriptores, matching y RANSAC, flujo óptico, ROI, tiles, stride, rejillas desplazadas y fusión de predicciones.

El cuarto sector cubre primer plano y elementos estructurantes, erosión, dilatación, apertura, cierre, gradiente morfológico, top-hat, black-hat, morfología en grises, conectividad 4/8, componentes conectados, histogramas escalares y conjuntos, ecualización global, CLAHE, comparación, retroproyección y decisiones de pipeline.

Incluye:

- 143 explicaciones progresivas, desde la intuición hasta el diseño de sistemas;
- 143 microlaboratorios manipulables, uno por misión;
- 429 preguntas con explicación específica para cada opción;
- 50 casos abiertos de transferencia con pauta de autocorrección en los sectores 11–18;
- desbloqueo secuencial con criterio de dominio de 3/3 por misión;
- desbloqueo de cada sector al dominar el anterior;
- guardado local del progreso y migración automática desde las versiones anteriores;
- cuaderno de apuntes personales sin modificar el contenido verificado;
- modo de lectura cálido y oscuro;
- tamaño de texto regulable y modo concentración;
- navegación por el plan maestro de 18 sectores;
- diseño responsive para ordenador, tableta y móvil;
- dirección visual de ciencia ficción cinematográfica y pixel art original.

El identificador del despliegue privado en ChatGPT Sites no se incluye en este repositorio.

## Método de aprendizaje

Cada lección seguirá la misma secuencia:

1. **Intuición:** explicación sencilla y ejemplo cotidiano.
2. **Concepto:** definición rigurosa sin complejidad innecesaria.
3. **Visualización:** imagen, diagrama o simulación manipulable.
4. **Práctica:** pequeño experimento para comprobar qué cambia y por qué.
5. **Recuperación activa:** preguntas que obligan a recordar y razonar.
6. **Diagnóstico:** explicación del error, no solo indicación de la respuesta correcta.
7. **Apuntes propios:** reformulación del concepto con el lenguaje del estudiante.

## Plan maestro

El temario está dividido en 18 sectores progresivos:

1. La imagen como dato
2. Matemáticas necesarias
3. Operaciones sobre imágenes
4. Morfología e histogramas
5. Geometría y visión clásica
6. Machine learning
7. Redes neuronales
8. Entrenamiento
9. CNN y arquitecturas
10. Clasificación
11. Detección
12. Segmentación, pose y OCR
13. Transformers y modelos fundacionales
14. Vídeo y visión 3D
15. Datos y diagnóstico
16. Producción
17. Arquitectura de sistemas de Computer Vision
18. Entrevistas técnicas

Los sectores se desbloquean secuencialmente al superar las misiones anteriores con 3/3. Los casos abiertos se autocorrigen; el 3/3 automático no comprueba por sí solo dominio a largo plazo.

El [guion maestro](docs/GUIÓN_MAESTRO.md) detalla los temas y prácticas de cada sector. Incluye ROI y Otsu en las misiones actuales, tiles con solapamiento y rejilla desplazada en el Sector 05, e IoU para cajas en el Sector 11 y máscaras en el Sector 12. El [plan de estudio](docs/PLAN_ESTUDIO.md) fija un ritmo inicial y sus dependencias hasta diciembre de 2026.

## Tecnologías

- Next.js 16 y React 19
- TypeScript
- Tailwind CSS
- componentes accesibles basados en Radix UI / shadcn
- almacenamiento local del navegador para preferencias, progreso y apuntes
- despliegue mediante ChatGPT Sites

La aplicación no necesita un modelo de IA ni consumir tokens durante su uso normal.

## Desarrollo local

Requisitos:

- Node.js 22.13 o superior
- pnpm 11

```bash
mkdir -p .openai
printf '{"project_id":null,"d1":null,"r2":null}\n' > .openai/hosting.json
pnpm install
pnpm dev
```

El archivo `.openai/hosting.json` queda fuera de Git. Para publicar tu propia instancia, sustituye `project_id` por el identificador de tu proyecto de Sites. Después, abre la dirección local indicada en la consola.

Para comprobar una compilación de producción:

```bash
pnpm build
```

## Estructura principal

```text
app/
  course-data.ts     Tipos compartidos y contenido del Sector 01
  sector-two-data.ts Contenido, preguntas y fuentes del Sector 02
  sector-three-data.ts Contenido, preguntas y fuentes del Sector 03
  sector-four-data.ts Contenido, preguntas y fuentes del Sector 04
  sector-five-data.ts Contenido, preguntas y fuentes del Sector 05
  sector-six-data.ts a sector-eighteen-data.ts Contenido de los Sectores 06–18
  sector-builder.ts  Estructura editorial común
  study-labs.tsx, advanced-probes.ts, final-probes.ts Simulaciones de 06–18
  detection-labs.tsx Laboratorios de IoU, NMS y tiles
  mask-iou-lab.tsx Máscara interactiva de IoU y Dice
  practice-challenges.ts Casos abiertos de los Sectores 11–18
  course-map.ts      Mapa de sectores y catálogo de lecciones
  lesson-labs.tsx    Laboratorios de fundamentos visuales
  math-labs.tsx      Doce laboratorios matemáticos
  filter-labs.tsx    Doce laboratorios de operaciones y filtrado
  morphology-labs.tsx Doce laboratorios de morfología e histogramas
  geometry-labs.tsx Diez laboratorios de geometría y teselas
  globals.css        Tema visual y diseño responsive
  layout.tsx         Metadatos y estructura raíz
  page.tsx           Navegación, progreso, evaluaciones y apuntes
components/ui/       Componentes de interfaz reutilizables
public/              Icono y arte visual del proyecto
```

## Persistencia y privacidad

En esta primera versión, los apuntes, las preferencias de lectura y el progreso se guardan mediante `localStorage`. Permanecen únicamente en el navegador y dispositivo utilizados; no se envían a ningún servidor.

## Alcance actual

El recorrido y sus 18 sectores están implementados. El progreso y los apuntes son locales por navegador, y los casos abiertos dependen de autocorrección; no hay sincronización ni repetición espaciada automática. El [plan de estudio](docs/PLAN_ESTUDIO.md) indica cómo repasar y estimar la fecha de finalización.

## Arte

`public/observation-deck.webp` es una ilustración original generada específicamente para VisionQuest. No reproduce personajes, niveles, logotipos ni recursos de ningún videojuego existente.
