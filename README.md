# VisionQuest

VisionQuest es una plataforma interactiva para aprender **Computer Vision desde los fundamentos hasta el diseño de sistemas reales y las entrevistas técnicas exigentes**.

La idea no es memorizar preguntas aisladas. Cada concepto se presenta de forma progresiva, con lenguaje coloquial, modelos mentales, ejemplos cotidianos, pequeñas simulaciones y preguntas de refuerzo.

## Objetivo

El recorrido está pensado para desarrollar tres capacidades:

1. comprender qué ocurre dentro de los modelos, no limitarse a utilizarlos;
2. elegir datos, operaciones, arquitecturas, métricas e infraestructura con criterio;
3. defender esas decisiones en una entrevista técnica o ante un equipo de ingeniería.

## Estado del proyecto

La versión actual contiene el **Sector 01 completo: «La imagen como dato»**.

Sus siete misiones son:

1. píxeles y matrices;
2. forma y coordenadas;
3. profundidad de bits, tipos y rangos;
4. canales de color;
5. espacios de color;
6. muestreo, resolución y aliasing;
7. tensores, lotes y contratos de entrada.

Incluye:

- siete explicaciones progresivas, desde la intuición hasta el vocabulario técnico;
- siete microlaboratorios manipulables, uno por misión;
- 21 preguntas de razonamiento con explicación específica para cada opción;
- desbloqueo secuencial con criterio de dominio de 3/3 por misión;
- guardado local del progreso y reanudación desde la última misión;
- cuaderno de apuntes personales sin modificar el contenido verificado;
- modo de lectura cálido y oscuro;
- tamaño de texto regulable y modo concentración;
- navegación por el plan maestro de 18 sectores;
- diseño responsive para ordenador, tableta y móvil;
- dirección visual de ciencia ficción cinematográfica y pixel art original.

La versión privada publicada puede abrirse en [VisionQuest](https://vision-quest.jabilopz.chatgpt.site).

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

Los siguientes sectores permanecerán bloqueados hasta que sus contenidos y criterios de dominio estén implementados y revisados.

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
pnpm install
pnpm dev
```

Después, abre la dirección local indicada en la consola.

Para comprobar una compilación de producción:

```bash
pnpm build
```

## Estructura principal

```text
app/
  course-data.ts     Contenido, preguntas y fuentes del Sector 01
  lesson-labs.tsx    Siete laboratorios interactivos
  globals.css        Tema visual y diseño responsive
  layout.tsx         Metadatos y estructura raíz
  page.tsx           Navegación, progreso, evaluaciones y apuntes
components/ui/       Componentes de interfaz reutilizables
public/              Icono y arte visual del proyecto
```

## Persistencia y privacidad

En esta primera versión, los apuntes, las preferencias de lectura y el progreso se guardan mediante `localStorage`. Permanecen únicamente en el navegador y dispositivo utilizados; no se envían a ningún servidor.

## Próximos pasos

- construir el Sector 02 sobre las matemáticas necesarias;
- definir objetivos y prueba de dominio para cada sector;
- añadir repetición espaciada y registro de errores frecuentes;
- preparar bloques específicos de diseño de sistemas y entrevistas técnicas.

## Arte

`public/observation-deck.webp` es una ilustración original generada específicamente para VisionQuest. No reproduce personajes, niveles, logotipos ni recursos de ningún videojuego existente.
