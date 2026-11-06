# Apuntes de entrevista por sectores

Respuestas y explicaciones para repasar los conceptos del curso. Cada tema se guarda en el sector al que pertenece.

## Sector 01 · Imagen como dato

### Misión 01.02 · Forma y coordenadas

#### Shape, size y región de interés

**Shape** describe las dimensiones de un array. Por ejemplo, una imagen RGB con `shape (480, 640, 3)` tiene 480 filas (H, alto), 640 columnas (W, ancho) y 3 canales. En NumPy, **size** cuenta todos los elementos: en este caso, `480 × 640 × 3`.

Una **región de interés (ROI)** es la zona de la imagen que queremos analizar. Puede definirse con un rectángulo, un polígono o una máscara. Un recorte rectangular en NumPy suele escribirse `imagen[y1:y2, x1:x2]`.

Esto importa para seleccionar los píxeles correctos, por ejemplo, antes de analizar una zona o pasarla a un modelo. Hay que distinguir las coordenadas `(x, y)` del acceso a la matriz `[y, x]`: `x` identifica la columna y `y` la fila. En los recortes, el límite final (`y2`, `x2`) queda excluido. Las coordenadas dentro de un recorte son locales; para volver a la imagen original se suma el desplazamiento `(x1, y1)`.

**Matiz:** `size` no significa lo mismo en todas las bibliotecas. En NumPy cuenta el total de elementos; en OpenCV se usa también para referirse al ancho y alto de una imagen.

#### Respuesta tipo entrevista

> Shape indica las dimensiones de la imagen y, en NumPy, size el número total de elementos. Una ROI es la zona que quiero analizar y puedo extraerla mediante un recorte. Antes comprobaría el orden de los ejes: las coordenadas se expresan como `(x, y)`, pero la matriz se indexa `[y, x]`. También tendría en cuenta que el límite final de un recorte se excluye y que las coordenadas de la ROI son locales; para volver a la imagen original hay que sumar su desplazamiento. Además, verificaría qué significa `size` en la biblioteca que estoy usando.

#### Para recordar

- En `(H, W, C)`, H son filas, W columnas y C canales.
- En NumPy, `size` cuenta elementos; no lo confundas con el ancho y alto de OpenCV.
- La matriz se indexa `[y, x]`; las coordenadas suelen escribirse `(x, y)`.
- En `imagen[y1:y2, x1:x2]`, los límites finales se excluyen.
- Para pasar de coordenadas locales de la ROI a globales, suma `(x1, y1)`.

### Misión 01.03 · Bits y tipos

**Objetivo:** Entender profundidad de bits, `dtype`, rango y pérdida de precisión al convertir datos.

#### Explicación

Los bits y el tipo de dato determinan qué valores puede guardar cada elemento y con qué precisión. Un bit tiene dos estados (`0` o `1`); con `n` bits se pueden representar `2ⁿ` combinaciones.

- Un entero sin signo de 8 bits (`uint8`) representa valores de `0` a `255`: `2⁸ = 256` niveles.
- Un entero con signo de 8 bits (`int8`) representa valores de `−128` a `127`.
- Un entero sin signo de 16 bits (`uint16`) representa valores de `0` a `65 535`.

En una imagen en escala de grises de 8 bits, cada píxel puede tomar uno de 256 niveles. En una imagen RGB de 8 bits, cada canal tiene 256 niveles independientes.

El `dtype` indica cómo se almacena e interpreta cada valor, por ejemplo `uint8`, `int16` o `float32`. El tipo define aspectos como el rango representable y la precisión; no define por sí solo el significado de los valores. Por ejemplo, `float32` permite fracciones y un rango numérico amplio, pero no garantiza que una imagen esté en `[0, 1]`: el rango depende de la convención del pipeline o del modelo.

#### Conversiones y pérdida de precisión

Convertir un dato puede cambiar o perder información:

- Al reducir la profundidad, por ejemplo de 16 a 8 bits, hay que representar muchos más valores posibles con solo 256 niveles. Se cuantizan valores y puede perderse detalle; esa información no se recupera al volver a un tipo de más bits.
- Al convertir de flotante a entero se pierde la parte fraccionaria o se redondea, según la operación y la librería utilizadas.
- Si un valor no cabe en el tipo de destino, puede recortarse, saturarse o desbordarse, según la operación y la librería. Conviene definir explícitamente cómo tratarlo.
- Convertir `uint8` a `float32` cambia el tipo, pero no escala el valor: `255` pasa a `255.0`. Para normalizar a `[0, 1]`, una operación habitual es convertir a flotante y dividir entre `255`.

**Ejemplo:** un píxel `128` en `uint8` pasa a `128.0` al convertirlo a `float32`; al dividirlo entre `255`, queda aproximadamente `0.502`.

#### Respuesta tipo entrevista

> La profundidad de bits determina cuántos valores distintos puede representar un dato: con `n` bits hay `2ⁿ` combinaciones. El `dtype` indica cómo se almacenan e interpretan esos valores, y determina su rango y precisión. Por ejemplo, un canal `uint8` representa 256 niveles, de 0 a 255. Un tipo flotante permite fracciones, pero no impone un rango de imagen concreto: un `float32` no significa automáticamente que los valores estén entre 0 y 1. Al convertir datos puedo perder precisión, por ejemplo al reducir de 16 a 8 bits o al pasar de flotante a entero. También debo comprobar el rango de destino y distinguir entre cambiar el tipo y escalar los valores; para normalizar un píxel `uint8` a `[0,1]`, normalmente lo convierto a flotante y lo divido entre 255.

#### Para recordar

- `n` bits → `2ⁿ` combinaciones.
- `uint8` → 256 valores: de 0 a 255.
- `dtype` y rango semántico no son lo mismo.
- Cambiar `dtype` no implica normalizar.
- Reducir la profundidad puede cuantizar y destruir información.

### Misión 01.04 · Canales de color

#### Mezcla aditiva

Imagina tres focos de luz —uno rojo, uno verde y uno azul— apuntando al mismo sitio. Donde se superponen sus luces, el ojo ve un solo color: si enciendes el rojo y el verde, ves amarillo; si enciendes los tres con intensidad máxima, ves blanco; si no enciendes ninguno, ves negro. Se llama **aditiva** porque al añadir luz de distintos colores se forma el color que percibimos.

Una pantalla hace algo parecido en cada píxel: combina intensidades de luz roja, verde y azul. En un valor RGB, cada número indica cuánta intensidad aporta ese canal; no son tres colores pintados uno encima de otro.

Esto importa porque una imagen RGB está formada por tres matrices alineadas, no por colores indivisibles. Entender la mezcla ayuda a interpretar o inspeccionar cada canal y a razonar sobre operaciones de color: cada canal aporta una intensidad distinta al color final.

Antes de aplicarlo, comprobaría el **orden real de los canales**. RGB y BGR contienen los mismos tres componentes, pero en posiciones distintas: OpenCV suele cargar imágenes en BGR, mientras que muchas otras herramientas esperan RGB. Confundirlos intercambia rojo y azul y produce colores incorrectos. También tendría en cuenta que esta mezcla aditiva describe luz (por ejemplo, pantallas), no la mezcla sustractiva de pigmentos o tintas.

#### Respuesta tipo entrevista

> La mezcla aditiva es combinar luces: como tres focos rojo, verde y azul que iluminan el mismo punto. Rojo más verde se ve amarillo; los tres al máximo se ven blancos; sin luz se ve negro. Una pantalla combina esas intensidades en cada píxel RGB. Antes de trabajar con ellas comprobaría el orden esperado: OpenCV suele entregar BGR, no RGB, así que confundirlos intercambia rojo y azul. Esta idea describe luz, no pintura.

#### Para recordar

- RGB es mezcla aditiva de luz: `(0, 0, 0)` es negro y los tres máximos dan blanco.
- Rojo + verde intensos producen amarillo.
- Comprueba RGB frente a BGR antes de interpretar o combinar canales.
- No confundas mezcla aditiva de luz con mezcla sustractiva de pigmentos.

#### Alfa no es otro color

El canal alfa de una imagen RGBA no representa un cuarto color: indica la opacidad del píxel, es decir, cuánto se ve ese píxel frente al fondo. En la convención habitual, alfa 0 es totalmente transparente y el valor máximo (por ejemplo, 1.0 o 255) es opaco. Al componer la imagen sobre un fondo, alfa determina cuánto contribuye el píxel y cuánto se deja ver el fondo.

Esto importa al superponer imágenes: las zonas transparentes permiten ver lo que hay detrás, en lugar de cubrirlo con un color sólido.

Antes de aplicarlo, comprobaría la convención de la herramienta: el rango de alfa y si se interpreta como opacidad o transparencia. También verificaría si espera alfa *straight* (RGB sin multiplicar por alfa) o *premultiplied* (RGB ya multiplicado por alfa); confundir estas representaciones puede producir bordes o colores incorrectos al componer la imagen.

#### Respuesta tipo entrevista

> Alfa no es un cuarto color: en una imagen RGBA indica la opacidad de cada píxel, o cuánto deja ver el fondo. En la convención habitual, alfa cero es transparente y el valor máximo es opaco. Importa al superponer imágenes porque permite que se vea el fondo a través de las zonas transparentes. Antes de usarlo comprobaría el rango y la convención de la librería, y si espera alfa straight o premultiplied, porque una interpretación distinta puede causar artefactos en los bordes.

#### Para recordar

- RGB define el color; alfa suele controlar la opacidad.
- Comprueba el rango y la convención de alfa de la herramienta.
- Verifica si los colores usan alfa *straight* o *premultiplied*.

## Sector 02 · Matemáticas necesarias

## Sector 03 · Operaciones sobre imágenes

## Sector 04 · Morfología e histogramas

## Sector 05 · Geometría y visión clásica

## Sector 06 · Machine learning

## Sector 07 · Redes neuronales

## Sector 08 · Entrenamiento

## Sector 09 · CNN y arquitecturas

## Sector 10 · Clasificación

## Sector 11 · Detección

## Sector 12 · Segmentación, pose y OCR

## Sector 13 · Transformers y modelos base

## Sector 14 · Vídeo y visión 3D

## Sector 15 · Datos y diagnóstico

## Sector 16 · Producción

## Sector 17 · Arquitectura de sistemas CV

## Sector 18 · Entrevistas técnicas
