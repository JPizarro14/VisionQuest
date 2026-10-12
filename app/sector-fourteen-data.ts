import { buildSector, type DraftLesson } from "@/app/sector-builder";
const draft: DraftLesson[]=[
{
id:"14.01",navTitle:"Tiempo y muestreo",title:"Los fotogramas no son fotos independientes",
objective:"Calcular muestreo temporal y evitar fuga entre secuencias.",
lead:"El vídeo añade continuidad y redundancia; saltar frames ahorra cómputo, pero puede perder eventos breves.",
keyIdea:"Si se procesa 1 de cada k frames a F fps, la frecuencia analizada es F/k; el hueco temporal entre muestras es k/F segundos.",
sections:[["Frecuencia","30 fps muestreado cada 5 frames da 6 muestras por segundo y 0,167 s entre ellas.","Un evento de 0,1 s puede caer entre muestras; analiza duración y velocidad."],["Tiempo real","La latencia incluye captura, cola, preproceso, modelo, postproceso y entrega.","FPS medio no demuestra que el peor caso cumpla plazo."],["Split","Fotogramas vecinos comparten escena y sujetos. Divide por vídeo, evento, cámara o sujeto según la generalización deseada.","Una partición aleatoria por frame puede inflar test."]],
takeaways:["Muestreo intercambia coste y cobertura.","Mide latencia completa.","Divide por secuencia de origen."],
questions:[
["30 fps, un frame de cada 5: frecuencia...",["6 fps","5 fps","30 fps","150 fps"],0,["Correcto: 30/5.","Es salto.","Sin salto.","Multiplicaste."]],
["Para evitar fuga, divide...",["Vídeos o grupos de origen","Frames al azar","Píxeles alternos","Por score"],0,["Correcto: vecinos quedan juntos.","Mezcla escenas.","No tiene sentido.","No es origen."]],
["FPS medio basta para garantizar límite de latencia?",["No","Sí siempre","Solo con GPU","Solo con OCR"],0,["Correcto: colas y colas largas importan.","No cubre extremos.","No garantiza.","Otra tarea."]]
],labTitle:"Salta frames",labInstruction:"Cambia el salto k en una cámara de 30 fps.",source:["OpenCV · VideoCapture","https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html"]
},
{
id:"14.02",navTitle:"Flujo óptico",title:"Movimiento aparente entre frames",
objective:"Interpretar vector de flujo y límites por oclusión y movimiento de cámara.",
lead:"El flujo estima desplazamiento aparente en la imagen; no es directamente velocidad 3D del objeto.",
keyIdea:"Un punto en (x,y) con flujo (u,v) se proyecta aproximadamente a (x+u,y+v) en el siguiente frame.",
sections:[["Hipótesis","Métodos clásicos usan constancia de brillo local y regularidad; iluminación, oclusión y grandes saltos rompen supuestos.","Piramidizar puede ayudar con movimientos grandes, pero no recupera texturas invisibles."],["Cámara","Una cámara que se desplaza genera flujo incluso con escena estática.","Para separar movimiento propio y de objetos, estima movimiento de cámara o usa geometría."],["Medir","Compara puntos con anotaciones, revisa bordes y zonas sin textura.","Nunca infieras metros por segundo de píxeles por frame sin escala, geometría y tiempo."]],
takeaways:["Flujo es desplazamiento de imagen.","Oclusión rompe correspondencia.","Movimiento de cámara importa."],
questions:[
["Punto (10,20), flujo (3,−2): posición siguiente aproximada",["(13,18)","(7,22)","(30,−40)","(3,−2)"],0,["Correcto: suma componentes.","Restaste.","Multiplicaste.","Eso es desplazamiento."]],
["Escena quieta con cámara móvil puede mostrar flujo?",["Sí","No","Solo en RGB","Solo con NMS"],0,["Correcto: es aparente.","Cámara mueve proyección.","No depende.","No es detección."]],
["Píxeles/frame son directamente m/s?",["No","Sí","Solo en HD","Solo en estéreo"],0,["Correcto: requiere escala y tiempo.","Falta geometría.","Resolución no basta.","Estéreo también requiere calibración."]]
],labTitle:"Sigue un punto",labInstruction:"Cambia desplazamiento horizontal y observa su posición en el frame siguiente.",source:["OpenCV · optical flow","https://docs.opencv.org/4.x/d4/dee/tutorial_optical_flow.html"]
},
{
id:"14.03",navTitle:"Seguimiento de objetos",title:"Mantener una identidad en el tiempo",
objective:"Distinguir detección, asociación e ID switch.",
lead:"Detectar una persona en cada frame no basta para saber que es la misma persona.",
keyIdea:"Tracking asocia detecciones a trayectorias usando posición, apariencia y tiempo; oclusiones y cruces pueden causar cambios de ID.",
sections:[["Asociar","Predice posición, calcula costes entre detecciones y tracks y asigna bajo una puerta de distancia.","No emparejes una detección con dos trayectorias a la vez."],["Pérdidas","Un detector que omite frames interrumpe el track; un reidentificador puede recuperar identidad con incertidumbre.","Conserva política para iniciar, mantener y cerrar tracks."],["Métricas","Separa calidad de detección y asociación; cuenta ID switches y fragmentaciones, además de métricas de tracking definidas.","Un alto recall de cajas no garantiza IDs estables."]],
takeaways:["Tracking añade identidad.","Asociación suele ser uno a uno.","Mide switches y huecos."],
questions:[
["Dos frames con cajas correctas prueban ID estable?",["No","Sí","Solo con IoU 1","Solo con 30 fps"],0,["Correcto: falta asociación.","Podría cambiar ID.","No basta.","No basta."]],
["ID switch significa...",["Una trayectoria cambia identidad asignada","Una clase cambia de nombre en dataset","Se invierte RGB","Se altera GT"],0,["Correcto: error de asociación.","Es otra inconsistencia.","No corresponde.","No necesariamente."]],
["Un frame sin detección puede...",["Interrumpir trayectoria","Probar ausencia real siempre","Mejorar AP automáticamente","Eliminar oclusión"],0,["Correcto: gestiona huecos.","Puede ser FN.","No automáticamente.","No."]]
],labTitle:"Tolera huecos",labInstruction:"Aumenta frames perdidos y compara con una tolerancia de tres.",source:["MOTChallenge · métricas","https://motchallenge.net/"]
},
{
id:"14.04",navTitle:"Cámara y proyección",title:"Del punto 3D al píxel",
objective:"Interpretar intrínsecos, profundidad y coordenadas de cámara.",
lead:"El punto 3D no se proyecta igual sin conocer parámetros y pose de la cámara.",
keyIdea:"En un modelo pinhole sin distorsión, para un punto en coordenadas de cámara con Z>0, x_img=f_x X/Z+c_x; la profundidad Z cambia la escala aparente.",
sections:[["Intrínsecos","f_x y f_y expresan focal en píxeles; c_x,c_y fijan punto principal.","La distorsión de lente requiere calibración o corrección si es relevante."],["Extrínsecos","Rotación y traslación transforman coordenadas del mundo a cámara según convención.","No mezcles metros del mundo con píxeles de imagen."],["Ambigüedad","Una sola proyección 2D no fija distancia métrica Z sin información adicional.","Conoce unidades, convención de ejes y margen de error."]],
takeaways:["Proyección divide por Z.","Calibración fija parámetros.","Una foto no fija escala absoluta."],
questions:[
["Con fx=100, X=1, Z=2 y cx=0: x aproximado",["50 px","200 px","2 px","100 px"],0,["Correcto: 100·1/2.","Multiplicaste por Z.","No.","Olvidaste Z."]],
["Si Z se duplica con X fijo, desplazamiento desde centro...",["Se reduce a mitad","Se duplica","No cambia","Se hace negativo"],0,["Correcto: es inversamente proporcional.","Al revés.","Sí cambia.","No necesariamente."]],
["Una foto sola sin escala adicional da profundidad métrica única?",["No","Sí","Solo si es RGB","Solo con NMS"],0,["Correcto: ambigüedad de escala.","Falta información.","No basta.","No corresponde."]]
],labTitle:"Mueve profundidad",labInstruction:"Varía Z con fx=100, X=1 y cx=0.",source:["OpenCV · camera calibration","https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html"]
},
{
id:"14.05",navTitle:"Estéreo y disparidad",title:"Dos vistas aportan escala",
objective:"Relacionar disparidad, baseline y profundidad bajo hipótesis rectificadas.",
lead:"En dos cámaras calibradas y rectificadas, un punto cercano cambia más su posición horizontal entre vistas.",
keyIdea:"Con focal f en píxeles, baseline B en metros y disparidad d en píxeles, Z=fB/d en el caso ideal d>0.",
sections:[["Triangulación","Con f=800 px, B=0,1 m y d=40 px, Z=2 m.","B y Z comparten unidad; no mezcles centímetros y metros."],["Error","Disparidad cercana a cero vuelve Z grande y sensible al error.","Regiones lisas, reflejos y oclusiones dificultan correspondencia."],["Calibración","La fórmula simplificada requiere rectificación y parámetros conocidos.","Valida error de profundidad por distancia, no solo imagen visualmente agradable."]],
takeaways:["Z inversa a d.","Unidades importan.","Disparidad pequeña es frágil."],
questions:[
["f=800 px, B=0,1 m, d=40 px: Z",["2 m","20 m","0,05 m","320 m"],0,["Correcto: 80/40.","Error de escala.","Inverso.","Multiplicaste."]],
["Si d se duplica con f y B fijos, Z...",["Se reduce a mitad","Se duplica","No cambia","Se vuelve cero"],0,["Correcto: Z=fB/d.","Al revés.","No.","No exactamente."]],
["d≈0 exige...",["Cuidado por gran incertidumbre de profundidad","Profundidad exactamente cero","Ignorar calibración","Clasificar la imagen"],0,["Correcto: división inestable.","Es contrario.","Se necesita.","Otra tarea."]]
],labTitle:"Calcula profundidad",labInstruction:"Ajusta disparidad de 5 a 80 px para f=800 px, B=0,1 m.",source:["OpenCV · profundidad estéreo","https://docs.opencv.org/4.x/dd/d53/tutorial_py_depthmap.html"]
},
{
id:"14.06",navTitle:"Caso de vídeo",title:"Alertas útiles de una cámara",
objective:"Diseñar evaluación de detección más tracking bajo plazos.",
lead:"Un sistema de seguridad podría requerir detectar una entrada, seguir identidad y alertar en menos de un segundo.",
keyIdea:"Elige métricas a nivel de evento y latencia extremo a extremo, además de AP por frame y errores de ID.",
sections:[["Evento","Define inicio, fin, tolerancia temporal y duplicado de alerta antes de medir.","Varias cajas del mismo evento no deben convertirse en varias alarmas."],["Presupuesto","Suma captura, espera, inferencia y entrega; prueba p95/p99 según requisito.","Muestrear frames afecta recall de eventos breves."],["Prueba","Separa cámaras/días, reporta fallos por luz y densidad, y revisa privacidad del vídeo.","Un test por frames del mismo clip no verifica generalización."]],
takeaways:["Mide evento completo.","Latencia incluye cola.","Evalúa cámaras y condiciones nuevas."],
questions:[
["Diez detecciones del mismo ingreso deben contar como...",["Un evento según regla definida","Diez eventos siempre","Diez GT nuevos","Diez cámaras"],0,["Correcto: deduplica evento.","Duplicaría alarmas.","No.","No."]],
["Para plazo máximo, además de FPS medio mide...",["Latencia de extremo a extremo y percentiles","Solo parámetros","Solo loss","Solo IoU de una caja"],0,["Correcto: incluye cola y variabilidad.","No es plazo.","No es inferencia.","No basta."]],
["Para nueva cámara, test ideal separa...",["Cámara o sesión de captura","Frames vecinos al azar","Píxeles alternos","Scores"],0,["Correcto: mide cambio de dominio.","Los frames vecinos comparten escena y condiciones; repartirlos entre train y test puede filtrar información.","Píxeles de una misma escena no son unidades independientes de evaluación.","Un score no identifica la cámara ni una sesión independiente."]]
],labTitle:"Presupuesto temporal",labInstruction:"Cambia cola de espera con captura e inferencia fijas.",source:["OpenCV · VideoCapture","https://docs.opencv.org/4.x/d8/dfe/classcv_1_1VideoCapture.html"]
}
];
export const sectorFourteenLessons=buildSector(draft);
