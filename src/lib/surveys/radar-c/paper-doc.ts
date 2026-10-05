import { CAPABILITIES, INITIATIVE_COPY } from "@/lib/surveys/radar-c/instrument";
import { capabilityName, initiativeName, type PaperCut } from "@/lib/surveys/radar-c/paper-cut";

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "table"; id: string; title: string; headers: string[]; rows: string[][]; note: string };

export type PaperDocument = {
  title: string;
  kicker: string;
  stamp: string;
  keywords: string[];
  abstract: string;
  blocks: Block[];
};

const ROLE: Record<string, string> = { cpo: "Compras", scm: "supply chain", cfo: "Finanzas", ceo: "dirección general", otro: "otro rol" };
const REALIZATION: Record<string, string> = { "<25": "menos de 25%", "25-50": "25 a menos de 50%", "50-75": "50 a 75%", ">75": "más de 75%", nm: "no medimos", ns: "no sé", none: "no hubo ahorro que debiera materializarse" };
const STAGE: Record<string, string> = { no: "no se usa", individual: "uso individual", piloto: "pilotos", produccion: "producción", extendido: "uso extendido", ns: "no sé" };
const BARRIER: Record<string, string> = { roi: "ROI poco claro", sistemas: "integración con sistemas", datos: "calidad o disponibilidad de datos", talento: "talento", cambio: "gestión del cambio", seguridad: "restricciones de acceso", otra: "otra", ninguna: "ninguna barrera", ns: "no se ha evaluado" };

export function paperDocument(cut: PaperCut, stamp: string): PaperDocument {
  const blocks: Block[] = [];
  const h2 = (text: string) => blocks.push({ type: "h2", text });
  const h3 = (text: string) => blocks.push({ type: "h3", text });
  const p = (text: string) => blocks.push({ type: "p", text });
  const table = (id: string, title: string, headers: string[], rows: string[][], note: string) => blocks.push({ type: "table", id, title, headers, rows, note });

  h2("1. Introducción");
  p(`Compras no elige una sola tarea. En el mismo horizonte tiene que capturar valor, liberar caja, sostener el abastecimiento, controlar el proceso, responder a exigencias de sostenibilidad y construir tecnología, innovación y talento. Esas ocho demandas no caben con la misma intensidad en el presupuesto, en el tiempo del equipo ni en la atención de Finanzas y de la dirección. El problema de gestión que examina este estudio es esa asignación: qué se declara prioritario, qué capacidad existe hoy para sostenerlo y qué decisiones ya están tomadas para los próximos 12 a 18 meses.`);
  p(`El horizonte 2027 nombra la agenda que se consulta y los escenarios con los que se comparan alternativas. No convierte el corte en un pronóstico. Tampoco describe, por sí solo, el estado de las compras en América Latina. La cobertura es la de quienes respondieron esta versión del instrumento, y las conclusiones se escriben para esa base.`);
  h3("Objetivo y qué esperamos descubrir");
  p(`El objetivo general es examinar cómo se relacionan, en un mismo alcance de Compras, las preferencias declaradas para 2027, las capacidades ancladas, la evidencia de resultados que la empresa dice poder informar y la agenda de iniciativas ya decidida. Los objetivos específicos son cinco. Primero, identificar el perfil de preferencias y su dispersión entre empresas. Segundo, distinguir ese perfil de las capacidades observadas. Tercero, calcular brechas hacia una meta de planificación común y ver dónde se concentra el producto de prioridad por brecha. Cuarto, contrastar esas brechas con la agenda aprobada y con portafolios calculados bajo recursos explícitos. Quinto, observar qué elecciones se mantienen cuando se mueven los aportes supuestos de las iniciativas.`);
  p(`Las preguntas de investigación, formuladas como exploración de este instrumento y no como un protocolo previo al corte, son estas. P1 pregunta dónde se concentran las brechas cuando prioridad y capacidad se leen juntas, y si ese orden coincide con el de las preferencias. P2 pregunta cómo se relacionan la exposición a proveedores sin alternativa y la capacidad de continuidad. P3 pregunta cómo se relacionan la preparación de datos y la etapa de uso de IA. P4 pregunta qué aporta la agenda aprobada frente a alternativas que usan un recurso equivalente. P5 pregunta qué elecciones se mantienen al variar los aportes supuestos. La contribución del trabajo es metodológica y de gestión: ofrece una lectura reproducible de un corte breve, separa lo declarado de lo modelado y evita convertir un ranking de pesos en una recomendación de inversión.`);

  h2("2. Marco conceptual y preguntas de investigación");
  p(`Prioridad estratégica, en este estudio, es el peso que un directivo asigna a un criterio frente a otros cuando no puede atenderlos todos por igual. No es el presupuesto ya aprobado ni el resultado del último año. Capacidad organizacional es la práctica habitual que la persona reconoce en anclas escritas, del nivel 1 al 5. Un peso alto y un nivel bajo pueden convivir: la empresa puede querer continuidad y, al mismo tiempo, seguir reaccionando a las fallas. Por eso una misma prioridad puede pedir intervenciones distintas. Donde la práctica ya está en el nivel de planificación, la pregunta es de sostén y de medición. Donde la práctica está por debajo, la pregunta es de construcción, y el orden de esa construcción no se deduce solo del peso.`);
  p(`La realización de valor se trata aquí como un rango declarado: la parte del ahorro negociado que Finanzas reconoce. No es una tasa media de la muestra y no se obtiene promediando los extremos del rango. La exposición de proveedores es otro rango: la parte del gasto que depende de un proveedor para el cual no hay alternativa viable en el plazo de la operación. Preparación de datos es una condición cualitativa, de base lista a base inexistente, y no un porcentaje de calidad. La elección de iniciativas es un estado: no considerada, en evaluación, aprobada, en implementación, implementada, no aplicable o desconocida. Aprobada significa decisión de ejecutar en 12 a 18 meses. Implementada pertenece al estado actual y no se vuelve a recomendar como si fuera una decisión nueva.`);
  p(`El proceso analítico jerárquico, en la forma de Saaty (2008), traduce comparaciones por pares en pesos y permite revisar si esas comparaciones se contradicen. Forman y Peniwati (1998) distinguen agregar juicios de agregar prioridades. Este estudio agrega prioridades individuales con la media aritmética, una prioridad por empresa, y no presenta esa media como consenso. La optimización que sigue no mide el retorno de una iniciativa. Evalúa combinaciones factibles bajo un presupuesto, un esfuerzo y un máximo de iniciativas, con aportes de demostración sobre las brechas. La capacidad dinámica, en el sentido de Teece, Pisano y Shuen (1997), y la ventaja que descansa en recursos difíciles de imitar, en el de Barney (1991), ayudan a leer por qué el peso no sustituye a la práctica. Kraljic (1983) recuerda que el abastecimiento cambia de naturaleza cuando el riesgo y el impacto dejan de tratarse como una compra repetida. Esas referencias enmarcan la pregunta. No aportan los coeficientes del modelo ni una cifra regional de adopción.`);

  h2("3. Metodología");
  h3("Cómo esperamos hacerlo");
  p(`El diseño es transversal y de autodeclaración. No hay un marco muestral ni una tasa de respuesta que este sistema pueda reconstruir, y no se inventan. El reclutamiento y el periodo, cuando existan en una aplicación posterior, deberán registrarse fuera de las respuestas. Esta ejecución usa las respuestas incluidas en el análisis al momento de generar el documento. Las aisladas permanecen guardadas y no entran en las bases. En este corte hay ${cut.participants} respuestas recibidas, ${cut.included} incluidas y ${cut.isolated} aisladas.`);
  p(`El instrumento tiene dos rutas. Compras y supply chain recorren comparaciones, ocho capacidades, seis indicadores de contexto y el estado de once iniciativas. Finanzas y dirección general responden las mismas comparaciones y dos preguntas de su rol. Pueden completar la ruta operativa si declaran conocer el alcance, pero eso no los convierte en la respuesta principal de la empresa. La unidad del benchmark es la empresa y el alcance, no el país ni la persona. Si dos personas del mismo rol informan el mismo alcance, la empresa queda fuera hasta que se consolide. No se elige la respuesta más reciente ni la más consistente. En esta ejecución el benchmark reúne ${cut.companies} empresas. ${cut.duplicates.length ? `${cut.duplicates.length} empresas quedaron marcadas por duplicar el mismo rol.` : "Ninguna empresa quedó fuera por duplicar el mismo rol."}`);
  p(`Las preferencias salen de diez comparaciones de Saaty, en la escala 9, 7, 5, 3, 1 y sus recíprocos. Un perfil incompleto no se completa con indiferencia. La consistencia individual clasifica el perfil: hasta 0,10 entra al promedio principal; por encima de 0,10 y hasta 0,20 queda como exploratorio; por encima de 0,20 no entra al promedio principal. El método es AHP con aclaración mediante asignación directa de pesos en los bloques que requieren revisión. Si un bloque de tres criterios supera 0,10, la persona reparte 100 puntos y esos pesos reemplazan solo ese bloque. El CR original no pasa a cero. Con la aclaración completa, el portafolio individual usa los pesos finales. Sin esa aclaración, no hay portafolio recomendado. El resto de sus respuestas válidas se conserva. La razón de consistencia del agregado no corrige a los individuos. El promedio principal es la media aritmética de los pesos globales de la respuesta operativa principal de cada empresa, con perfil principal. En esta base hay ${cut.ahp.principal} perfiles operativos principales, ${cut.expanded.n} en la base ampliada, ${cut.ahp.exploratory} exploratorios y ${cut.ahp.excluded} excluidos${cut.ahp.maxExcludedCr == null ? "" : `, con una consistencia máxima individual de ${num(cut.ahp.maxExcludedCr, 3)}`}. La base de preferencias puede ser más chica que la de capacidades, y el texto lo dice cada vez que el denominador cambia.`);
  p(`Las ocho capacidades usan anclas visibles. "No sé" es un dato faltante, no el nivel 1. La madurez de un nivel es (nivel - 1) / 4. La meta de planificación es 0,75, el nivel 4. La brecha de una dimensión es lo que falta para esa meta y no baja de cero. La brecha ponderada multiplica esa distancia por el peso de la misma empresa. El estudio promedia esos productos. No multiplica el peso medio por la brecha media ni resta un peso a una mediana. Si la brecha total de una empresa es cero, no hay un cierre porcentual y el portafolio de mejora queda vacío. Los niveles no se convierten en ahorro, horas ni dólares.`);
  p(`El portafolio es una optimización discreta por enumeración de las 2048 combinaciones, con la matriz de impacto ${cut.impact} del modelo ${cut.model}. El cierre de una combinación es multiplicativo: cada iniciativa seleccionada reduce la brecha de una dimensión por el factor (1 - aporte), y los factores se componen. No es un programa lineal que sume aportes. El objetivo es minimizar la brecha ponderada que queda, sujeto al costo, al esfuerzo y al máximo de iniciativas del escenario. Una iniciativa ya implementada, no aplicable o sin estado conocido no está disponible para una recomendación nueva. Si la condición de datos es parcial o no está lista, la iniciativa de IA solo puede entrar junto con la de gobierno de datos. Si la condición es desconocida, la IA queda fuera de la recomendación y el resto del portafolio puede calcularse. El desempate, entre cierres equivalentes, prefiere menos recurso relativo, luego menos iniciativas y luego la máscara menor. Los escenarios son tres: ajustado (costo 6, esfuerzo 7, hasta 2 iniciativas), intermedio (11, 13 y 4) y amplio (18, 20 y 6). Esos topes son supuestos de demostración, dichos una vez aquí y repetidos solo en la nota de la tabla de portafolios.`);
  p(`La agenda aprobada se compara de dos maneras. La similitud de Jaccard mira el conjunto de iniciativas, no su aporte. Si ambas agendas están vacías, la similitud no aplica. Si una está vacía, la similitud es cero. La contribución usa el sobre de costo, esfuerzo y cantidad de la propia agenda aprobada, no el presupuesto del escenario. Sin agenda aprobada nueva, la contribución no se calcula y no se imputa como cero. La sensibilidad mueve los aportes distintos de cero en más o menos 20%, con tope 0,95, en 500 corridas del escenario intermedio y semilla 2027. Los ceros de la matriz siguen en cero. La proporción de corridas que repiten el portafolio es estabilidad del modelo, no probabilidad de éxito ni incertidumbre muestral. Los rangos de ahorro, realización y exposición se tabulan como categorías. No se reemplazan por su punto medio. Las marcas de país pueden sumar más que el número de respuestas, porque un alcance puede cubrir más de un país. Los textos abiertos se cuentan por tema y no se citan de forma que identifique a una empresa. Los pares de rol solo se arman cuando hay exactamente un CFO y un CPO, ambos con perfil principal, en el mismo alcance.`);

  h2("4. Resultados");
  p(`La lectura sigue las preguntas. Cada apartado dice primero la base y después el resultado. La interpretación de gestión queda para la discusión.`);
  h3("4.1 Caracterización y cobertura");
  p(`La Tabla 1 separa personas, empresas y bases de cálculo. De ${cut.included} respuestas incluidas, ${cut.operational} son operativas y ${cut.executive} son de Finanzas o dirección. El benchmark usa ${cut.companies} empresas. El promedio de prioridades usa ${cut.ahp.principal} perfiles operativos con consistencia de hasta 0,10. Los portafolios se calculan en ${cut.motor} empresas: hace falta prioridad utilizable, las ocho capacidades numéricas, el estado de las iniciativas y una condición de datos. ${cut.emptyGap} de esas empresas tienen brecha total cero, y en ellas el cierre porcentual no se informa. Los roles incluidos son ${cut.roles.map((row) => `${ROLE[row.id] ?? row.id} ${row.n}`).join(", ")}. En la ruta operativa, ${cut.countries.mentions} marcas de país se reparten en ${cut.countries.responses} respuestas. La suma puede superar a las respuestas porque un alcance multipaís cuenta en cada país marcado y sigue siendo una sola empresa.`);
  table(
    "Tabla 1",
    "De las respuestas recibidas a las bases de cada cálculo",
    ["Base", "N", "Qué entra", "Qué queda fuera"],
    [
      ["Respuestas recibidas", String(cut.participants), "Todo lo guardado", "Nada"],
      ["Incluidas en el análisis", String(cut.included), "Evaluación incluida", `${cut.isolated} aisladas`],
      ["Ruta operativa", String(cut.operational), "Compras o supply chain", "Finanzas y dirección, salvo que hayan completado la ruta"],
      ["Empresas del benchmark", String(cut.companies), "Una respuesta operativa por alcance", "Dos del mismo rol en el mismo alcance"],
      ["Promedio de prioridades", String(cut.ahp.principal), "Perfil con consistencia hasta 0,10", `${cut.ahp.excluded} con consistencia sobre 0,20 y ${cut.ahp.exploratory} exploratorios`],
      ["Portafolio calculado", String(cut.motor), "Insumos completos y consistencia hasta 0,20", "Perfil excluido, capacidad faltante o iniciativa sin estado"],
    ],
    "Universo: respuestas de esta ejecución. Una persona puede estar en la ruta operativa y no en el promedio de prioridades.",
  );
  h3("4.2 Prioridades y heterogeneidad");
  p(cut.aip
    ? `La Figura 1 muestra el promedio aritmético de ${cut.ahp.principal} empresas. El grupo financiero pesa ${pct(cut.macro?.[0])}, el de riesgo y control ${pct(cut.macro?.[1])} y el de transformación ${pct(cut.macro?.[2])}. Entre los ocho criterios, el mayor peso medio es ${capabilityName(cut.priorityOrder[0])} (${pct(cut.aip[cut.priorityOrder[0]])}) y el menor es ${capabilityName(cut.priorityOrder[cut.priorityOrder.length - 1])} (${pct(cut.aip[cut.priorityOrder[cut.priorityOrder.length - 1]])}). Esos pesos no dicen que el criterio de menor peso sea irrelevante. Dicen cuánta atención relativa recibió en las comparaciones de esta base.`
    : "Este corte no tiene un promedio de prioridades AHP. Falta al menos una respuesta operativa principal con consistencia de hasta 0,10. La base ampliada, si existe, no se presenta como si fuera exclusivamente AHP.");
  if (cut.aip) {
    table(
      "Figura 1",
      "Peso medio y dispersión de las ocho prioridades",
      ["Criterio", "Peso medio", "Mínimo", "Máximo", "Desviación"],
      cut.aip.map((weight, index) => [capabilityName(index), pct(weight), pct(cut.dispersion[index]?.min), pct(cut.dispersion[index]?.max), pct(cut.dispersion[index]?.sd)]),
      `Base: ${cut.ahp.principal} empresas con perfil principal. La desviación es muestral de esos pesos, no un error estándar de una población. Unidades: fracción del peso global, mostrada en porcentaje.`,
    );
  }
  p(cut.leaveOneOut.companies > 1
    ? `Al dejar fuera de a una las ${cut.leaveOneOut.companies} empresas del promedio, el criterio de mayor peso ${cut.leaveOneOut.rankChanges === 0 ? "no cambia" : `cambia en ${cut.leaveOneOut.rankChanges} exclusiones`}. El mayor movimiento de un peso medio es de ${pct(cut.leaveOneOut.maxMove)}. Esa prueba mira estabilidad del ordenamiento en esta base. No mide acuerdo entre personas ni representatividad.`
    : "Con menos de dos empresas en el promedio no hay una prueba de dejar una fuera.");
  p(cut.pairs.n
    ? `Hay ${cut.pairs.n} pares con un CFO y un CPO del mismo alcance, ambos con perfil principal. En ${cut.pairs.financeHigher} de ellos el grupo financiero pesa más en Finanzas que en Compras. La distancia mediana entre los ocho pesos es ${pct(cut.pairs.medianDistance)} y la diferencia absoluta mediana del grupo financiero es ${pct(cut.pairs.medianFin)}. ${cut.pairs.n < 5 ? "Con menos de cinco pares no se narra una divergencia general entre los dos roles." : "La diferencia se lee como distancia de perfiles emparejados, no como una brecha del mercado."}`
    : "No hay un par CFO-CPO con el mismo alcance y perfil principal. La comparación de roles queda abierta.");
  h3("4.3 Capacidades y brechas");
  p(`La Tabla 2 usa las ${cut.operational} respuestas operativas para los niveles y, cuando existe, el promedio de brechas ponderadas de las empresas con perfil principal. El denominador de la mediana puede ser menor si alguien marcó "no sé". ${share(cut.costBelow4, cut.operational)} declaran costos y captura de valor bajo el nivel 4. El orden de las brechas ponderadas empieza por ${cut.gapOrder.length ? capabilityName(cut.gapOrder[0]) : "una base vacía"} y no tiene por qué repetir el orden de los pesos. ${cut.priorityOrder.join(",") === cut.gapOrder.join(",") ? "En este corte los dos órdenes coinciden." : "En este corte los dos órdenes no coinciden: la prioridad media y la brecha media no señalan el mismo criterio como primero."}`);
  table(
    "Tabla 2",
    "Nivel declarado y brecha ponderada por capacidad",
    ["Capacidad", "N de niveles", "Mediana", "Bajo nivel 4", "Niveles 1 o 2", "Brecha media", "Parte de la brecha"],
    cut.capability.map((row) => [capabilityName(row.index), String(row.n), level(row.median), String(row.below4), String(row.low), pct(row.gapMean), pct(row.gapShare)]),
    "Los niveles usan la ruta operativa. La brecha media usa solo empresas con peso principal y capacidad numérica, y es el promedio de peso por brecha calculado en cada empresa. No es el producto de los promedios.",
  );
  h3("4.4 Captura de valor");
  p(`La realización se lee como categoría, no como promedio. En la ruta operativa, ${share(cut.realizationMeasured, cut.operational)} eligen un rango de realización. ${share(cut.lowRealization, cut.operational)} quedan en los dos rangos inferiores, por debajo de 50%. De esas, ${share(cut.lowRealizationAndCostBelow4, cut.lowRealization)} también declaran costos bajo el nivel 4. ${cut.lowRealization ? "" : ""}La Tabla 3 separa el rango elegido de la capacidad. "No medimos", "no sé" y "no hubo ahorro negociado que debiera materializarse" no se tratan como realización cero.`);
  table(
    "Tabla 3",
    "Rango de realización declarado en la ruta operativa",
    ["Rango", "Respuestas"],
    ["<25", "25-50", "50-75", ">75", "nm", "ns", "none", "sin dato"]
      .filter((code) => cut.realization[code])
      .map((code) => [REALIZATION[code] ?? code, String(cut.realization[code])]),
    `Base: ${cut.operational} respuestas operativas. La columna cuenta personas que eligieron la categoría. No es el ahorro medio del corte.`,
  );
  p(`El ahorro validado del último ejercicio, también en rangos, se mantiene aparte de la realización y de la expectativa que declara Finanzas para 2027. No se resta una de la otra. Mezclar el resultado del año cerrado con la meta del año que viene produciría una brecha que el instrumento no mide.`);
  h3("4.5 Continuidad");
  p(`${share(cut.exposureHigh, cut.operational)} ubican en 25% o más el gasto sin alternativa viable en el plazo de la operación. De esas, ${share(cut.exposureHighRiskBelow4, cut.exposureHigh)} declaran riesgo y continuidad bajo el nivel 4. En el otro extremo, ${share(cut.exposureLow, cut.operational)} están por debajo de 25% de exposición, y ${share(cut.exposureLowRiskReady, cut.exposureLow)} de ellas declaran continuidad en nivel 4 o 5. La intersección importa más que los dos porcentajes por separado: la exposición alta y la capacidad más baja se leen dentro de las mismas respuestas. ${share(cut.resilienceApprovedInHigh, cut.exposureHigh)} de las respuestas con exposición alta tienen aprobada la iniciativa de riesgo y resiliencia. Aprobada no significa implementada.`);
  table(
    "Tabla 4",
    "Exposición sin alternativa y capacidad de continuidad",
    ["Grupo", "Respuestas", "Continuidad bajo nivel 4", "Resiliencia aprobada"],
    [
      ["Exposición de 25% o más", String(cut.exposureHigh), String(cut.exposureHighRiskBelow4), String(cut.resilienceApprovedInHigh)],
      ["Exposición menor de 25%", String(cut.exposureLow), String(cut.exposureLow - cut.exposureLowRiskReady), "no cruzada en este renglón"],
    ],
    "Base: ruta operativa. Exposición alta reúne los rangos 25 a 50% y más de 50%. El nivel 4 es la meta de planificación, no una certificación.",
  );
  h3("4.6 Datos e IA");
  p(`${share(cut.productive, cut.operational)} declaran IA en producción o en uso extendido. De ellas, ${share(cut.productiveReadyDigital, cut.productive)} combinan datos declarados listos con capacidad digital en nivel 4 o 5. ${share(cut.pilot, cut.operational)} están en pilotos. De ese grupo, ${share(cut.pilotPartialDigital3, cut.pilot)} declaran preparación parcial y capacidad digital en nivel 3, y ${share(cut.pilotDataAndAiApproved, cut.pilot)} tienen aprobadas a la vez la iniciativa de datos y la de IA. El cruce separa dos condiciones de agenda. No mide retorno ni calidad técnica del caso de uso.`);
  p(`Las barreras se preguntan con un máximo de dos marcas, más las opciones excluyentes de ninguna o no evaluada. En ${cut.barrierBase} respuestas operativas, ${barrierSentence(cut)}. Una marca de ROI poco claro es una percepción sobre el caso de negocio, no un retorno calculado. La etapa de IA, la condición de datos y el nivel digital siguen siendo tres variables. Ninguna reemplaza a las otras.`);
  table(
    "Tabla 5",
    "Etapa de IA, preparación de datos y capacidad digital en la misma base",
    ["Grupo", "N", "Condición que acompaña en este corte"],
    [
      ["Producción o uso extendido", String(cut.productive), `${cut.productiveReadyDigital} con datos listos y digital en nivel 4 o 5`],
      ["Pilotos", String(cut.pilot), `${cut.pilotPartialDigital3} con datos parciales y digital en nivel 3; ${cut.pilotDataAndAiApproved} con datos e IA aprobados`],
      ["Otras etapas", String(Math.max(0, cut.operational - cut.productive - cut.pilot)), "Se leen en el conteo de etapas, sin forzar el mismo cruce"],
    ],
    "Base: ruta operativa. Las condiciones de la segunda columna son intersecciones, no porcentajes paralelos de preguntas distintas.",
  );
  h3("4.7 Agenda y portafolios");
  p(cut.motor
    ? `El motor corre en ${cut.motor} empresas. La mediana de cierre modelado de la brecha hacia el nivel 4 es ${pct(closure(cut, "lean"))} en el escenario ajustado, ${pct(closure(cut, "balanced"))} en el intermedio y ${pct(closure(cut, "transformational"))} en el amplio, cada una con su propia base de empresas que tienen cierre porcentual (${cut.closures.map((row) => `${row.id} n=${row.n}`).join(", ")}). El cambio mediano al pasar del ajustado al intermedio es de ${points(cut.deltaLeanBalanced)}. Del intermedio al amplio es de ${points(cut.deltaBalancedTransformational)}. ${cut.sameBalancedTransformational} empresas conservan el mismo conjunto de iniciativas entre esos dos últimos escenarios. Ampliar el recurso no garantiza un portafolio distinto ni un cierre mucho mayor.`
    : "No hay empresas con portafolio calculado. Falta prioridad utilizable, capacidad completa, estado de iniciativas o condición de datos.");
  p(cut.motor
    ? `La similitud mediana entre la agenda aprobada y el portafolio intermedio es ${pct(cut.jaccardMedian)} en ${cut.jaccardN} empresas donde el índice aplica. La contribución mediana de esa agenda, medida con su propio recurso, es ${pct(cut.etaMedian)} en ${cut.etaN} empresas. En ${cut.etaMissing} empresas la contribución no se calcula, en general porque no hay una agenda nueva aprobada o porque no cabe en una comparación válida. No se rellena con cero. La Tabla 6 muestra, para el escenario intermedio, cuántas empresas incluyen cada iniciativa en el portafolio y cuántas ya la tienen aprobada. La frecuencia no es una recomendación para todas.`
    : "Sin portafolios no hay similitud ni contribución que informar.");
  if (cut.motor) {
    table(
      "Tabla 6",
      "Selección modelada y aprobación nueva en el escenario intermedio",
      ["Iniciativa", "En el portafolio", "Aprobada", "Base"],
      cut.selection.filter((row) => row.scenario === "balanced").map((row) => [initiativeName(row.index), String(row.selected), String(row.approved), String(row.of)]),
      "Base: empresas con portafolio calculado. Aprobada es estado de decisión para 12 a 18 meses, no implementación. Costo 11, esfuerzo 13 y hasta 4 iniciativas son supuestos de demostración.",
    );
  }
  h3("4.8 Sensibilidad");
  p(cut.sensitivity.status === "ok"
    ? `${cut.sensitivity.note} La mediana de estabilidad es ${pct(cut.sensitivity.medianStability)}. La Figura 2 resume, entre las empresas que ya incluían cada iniciativa en el portafolio base, con qué frecuencia esa iniciativa sigue presente al mover los aportes. Una tasa alta significa permanencia bajo este experimento. Una tasa baja significa que la elección depende del aporte supuesto. Ninguna de las dos es una probabilidad de que el proyecto resulte.`
    : `La sensibilidad no está en este documento. ${cut.sensitivity.note}`);
  if (cut.sensitivity.status === "ok") {
    table(
      "Figura 2",
      "Permanencia de cada iniciativa al mover los aportes un 20%",
      ["Iniciativa", "Empresas donde estaba en la base", "Frecuencia media con la que sigue"],
      cut.sensitivity.keep.filter((row) => row.base > 0).map((row) => [initiativeName(row.index), String(row.base), pct(row.rate)]),
      `Escenario intermedio, ${cut.sensitivity.runs} corridas, semilla ${cut.sensitivity.seed}, ${cut.sensitivity.companies} empresas. La frecuencia es del modelo, no del negocio.`,
    );
  }

  h2("5. Discusión");
  p(`La tesis que sostiene este corte es concreta. El promedio de prioridades describe un mandato repartido, pero la brecha que combina ese peso con la práctica de cada empresa no se concentra en el mismo lugar, y los cruces de realización, continuidad y datos muestran grupos de condición distinta dentro de la misma base operativa. El problema observable no es la ausencia de una prioridad dominante. Es la distancia entre lo que se quiere atender y lo que la práctica, la medición y la agenda ya pueden sostener.`);
  p(`El primer argumento mira P1. ${cut.hypotheses.find((item) => item.id === "H1")?.text ?? ""} Si el criterio de mayor peso no es el de mayor brecha ponderada, una dirección que invierta siguiendo solo el ranking de preferencias puede reforzar una práctica que ya está más armada y dejar quieta la dimensión donde el peso y la carencia se multiplican. La explicación alternativa es estadística y de escala: con pocas empresas, un perfil extremo mueve la media, y la prueba de dejar una fuera existe precisamente para ver si el primer puesto depende de un caso. En esta ejecución el primer puesto ${cut.leaveOneOut.rankChanges === 0 ? "se mantiene" : "no es inmune a esa exclusión"}. El mecanismo de gestión no exige aceptar una causa. Exige mirar la Tabla 2 antes de traducir la Figura 1 en un plan.`);
  p(`El segundo argumento mira la captura de valor. ${share(cut.costBelow4, cut.operational)} están bajo el nivel 4 en costos, y ${share(cut.lowRealizationAndCostBelow4, cut.operational)} combinan esa capacidad con una realización declarada por debajo de 50%. Una interpretación plausible es que la mejora negociada no llega a reconocerse: fallan la línea base, el seguimiento del volumen o la regla con la que Finanzas toma el número. Otra explicación es que el rango inferior describa categorías donde el ahorro nunca fue el resultado esperado, o donde el año no tuvo una negociación que debiera materializarse. El instrumento no separa esas historias. Lo que sí impide es tratar el rango como una tasa de pérdida y encargar, a partir de ella, una iniciativa con un ahorro prometido. La decisión que el dato autoriza es revisar, con Finanzas, la definición de ahorro y el momento de la validación, y dejar que el portafolio use el peso y la brecha de cada empresa, no el relato del promedio.`);
  p(`El tercer argumento mira la continuidad. ${cut.hypotheses.find((item) => item.id === "H2")?.text ?? ""} La pregunta operativa es si las empresas más expuestas tienen con qué responder a la pérdida de un proveedor relevante. Puede ocurrir que la categoría no tenga alternativa por razones técnicas o geográficas, aunque la gestión sea competente. También puede ocurrir que la alternativa exista y no esté preparada. La encuesta no registra incidentes ni la causa de la concentración. Por eso la exposición no se convierte en una pérdida esperada. Lo que el cruce pide es revisar las categorías críticas y contrastarlas con el estado de la iniciativa de resiliencia, que en este corte está aprobada en ${share(cut.resilienceApprovedInHigh, cut.exposureHigh)} de las respuestas más expuestas. Aprobar no sustituye el monitoreo ni el plan de contingencia.`);
  p(`El cuarto argumento mira datos e IA. ${cut.hypotheses.find((item) => item.id === "H3")?.text ?? ""} En el grupo que ya opera, las iniciativas implementadas o en curso son estado actual y no deben reaparecer como si fueran una compra nueva. En el grupo de pilotos, aprobar datos e IA al mismo tiempo abre una pregunta de secuencia: si el proyecto de datos puede dejar lista la condición que la IA necesita dentro del mismo horizonte. El modelo ya refleja una parte de esa dependencia, porque sin datos listos la IA no entra sola. Lo que el modelo no sabe es si el proyecto de datos alcanza a tiempo. ${barrierSentence(cut)} Esas marcas acotan la conversación. No la cierran.`);
  p(`El quinto argumento mira la agenda y la sensibilidad. ${cut.hypotheses.find((item) => item.id === "H4")?.text ?? ""} ${cut.hypotheses.find((item) => item.id === "H5")?.text ?? ""} Recomendar cancelar una iniciativa porque se parece poco al portafolio intermedio sería un error de comparador: la similitud no mide aporte, y el aporte de la agenda aprobada se calcula con el recurso de esa agenda, no con el del escenario. La consecuencia práctica es doble. Donde la estabilidad es alta, el conjunto merece una conversación de ejecución. Donde la estabilidad es baja, el conjunto merece una conversación sobre el aporte supuesto antes de tratarlo como prioridad firme.`);

  h2("6. Implicaciones para la gestión");
  p(`Las decisiones que siguen están atadas a una medición de este corte o a un resultado del modelo. No son un programa genérico de digitalización o de capacitación. Cada una dice qué hay que verificar, quién tiene que estar en la mesa y qué indicador diría, más adelante, si la intervención se movió.`);
  p(`Para Compras, el primer paso no es rehacer el ranking de prioridades. Es tomar las dos o tres dimensiones donde la brecha ponderada de la propia empresa sea mayor y preguntar si la agenda de 12 a 18 meses las toca. Si la dimensión de mayor brecha no tiene una iniciativa aprobada ni en implementación, la decisión es abrir esa evaluación, no heredar la iniciativa que el promedio de la muestra selecciona con más frecuencia. Finanzas entra cuando la dimensión es costo o caja: el indicador de seguimiento es el paso de un rango de realización al siguiente, o la aparición de una validación contra línea base donde hoy se declara que no existe. No es un monto de ahorro que este paper pueda prometer.`);
  p(`Donde la exposición es alta y la continuidad está bajo el nivel 4, la decisión es de secuencia. Antes de sumar una iniciativa de IA o de innovación, corresponde nombrar los proveedores sin alternativa, el plazo en el que la operación los necesita y si hay un plan de contingencia además del contrato. El indicador es la existencia de esa ficha por categoría crítica, no un porcentaje nuevo de exposición. Si la iniciativa de resiliencia ya está aprobada, el trabajo es comprobar que el alcance de esa aprobación cubre a esos proveedores.`);
  p(`Donde la IA está en piloto y los datos se declaran parciales, la decisión es de orden. El caso de uso no debería pasar a producción mientras la condición de datos siga parcial, salvo que el proyecto de datos tenga responsable, plazo y criterio de listo. El indicador es el cambio de la condición de datos, no el número de pilotos abiertos. Donde la IA ya está en producción con datos listos, la decisión es de gobierno de lo que ya opera: responsable, control y monitoreo, no una segunda recomendación de "adoptar IA".`);
  p(`La dirección general y Finanzas no deberían leer el promedio de Compras como si fuera su propio perfil. Cuando existe un par en el mismo alcance, la distancia se informa y, con pocos pares, no se generaliza. La pregunta útil en el comité es otra: en qué momento entra Compras a la decisión de presupuesto y si la expectativa de ahorro de Finanzas está definida como rango o sigue sin meta. Esas dos respuestas ya están en la ruta ejecutiva. Compararlas con el rango de realización del año cerrado, sin restarlas, evita encargar una brecha imaginaria.`);

  h2("7. Limitaciones y agenda de investigación");
  p(`Cada límite acota una inferencia distinta. La participación es la de quienes completaron el instrumento. Sin marco muestral no hay una pretensión de representar a las compras de la región, y un mínimo de cinco empresas es una regla de exhibición, no un certificado de representatividad. La autodeclaración puede alinear la capacidad, la etapa y la agenda porque las responde la misma persona en la misma sesión. Si en un corte esas piezas coinciden de forma perfecta, la coincidencia no valida el instrumento ni demuestra una causa. El diseño transversal no ordena en el tiempo la exposición y la capacidad: no sabemos qué ocurrió primero.`);
  p(`Los aportes de las iniciativas son de demostración. Moverlos un 20% prueba la estabilidad del conjunto elegido, no el retorno del proyecto. Los topes de costo y esfuerzo tampoco son el presupuesto de una empresa. Un dato futuro que mejoraría el argumento es una línea base de ahorro acordada con Finanzas, una ficha de proveedores críticos y una fecha en la que la condición de datos pasa a estar lista. Nada de eso exige alargar esta encuesta para producir un texto más largo. Exige, en una aplicación posterior, conservar el mismo motor y reemplazar las respuestas.`);

  h2("8. Conclusiones");
  p(`P1 se responde con la Figura 1 y la Tabla 2. Las preferencias se pueden promediar, y las brechas ponderadas, calculadas empresa por empresa, pueden ordenar los criterios de otra manera. P2 se responde con la Tabla 4: la exposición alta y la continuidad por debajo de la meta se cruzan en las mismas respuestas, en la proporción que la tabla muestra, y eso no equivale a una pérdida. P3 se responde con la Tabla 5: etapa, preparación de datos y nivel digital forman grupos de condición distinta, y la dependencia de la IA respecto de los datos ya entra en la factibilidad del portafolio. P4 se responde con la similitud y la contribución, que no son intercambiables. P5 se responde con la sensibilidad del escenario intermedio, cuando esa ejecución está disponible.`);
  h3("Qué preguntas e hipótesis esperamos responder con todo esto");
  p(`Lo observado es la cobertura, los pesos, los niveles, los rangos y los estados de agenda. Lo examinado mediante escenarios es el cierre modelado, la comparación con la agenda aprobada y la permanencia de las iniciativas al mover los aportes. Lo que sigue abierto es la causa de la exposición, el mecanismo por el cual el ahorro negociado no se reconoce y el plazo real de los proyectos de datos. Las hipótesis quedan en el estado que esta base permite, sin tratarlas como aceptadas ni como demostradas.`);
  for (const item of cut.hypotheses) p(`${item.id}, ${item.state}. ${item.text}`);
  p(`El estudio, en resumen, muestra un mandato de Compras que se puede describir y una capacidad que no siempre está a la altura de la dimensión que más pesa cuando se la multiplica por su propia brecha. La decisión que ese resultado habilita no es un portafolio único para la región. Es una revisión, empresa por empresa, de la dimensión donde prioridad y práctica se distancian, de la medición que permitiría saber si esa distancia se cierra, y de las iniciativas que siguen en pie cuando el aporte supuesto se mueve.`);

  h2("Referencias");
  p("Barney, J. (1991). Firm resources and sustained competitive advantage. Journal of Management, 17(1), 99-120. https://doi.org/10.1177/014920639101700108");
  p("Forman, E., y Peniwati, K. (1998). Aggregating individual judgments and priorities with the analytic hierarchy process. European Journal of Operational Research, 108(1), 165-169. https://doi.org/10.1016/S0377-2217(97)00244-0");
  p("Kraljic, P. (1983). Purchasing must become supply management. Harvard Business Review, 61(5), 109-117.");
  p("Saaty, T. L. (2008). Decision making with the analytic hierarchy process. International Journal of Services Sciences, 1(1), 83-98. https://doi.org/10.1504/IJSSCI.2008.017590");
  p("Teece, D. J., Pisano, G., y Shuen, A. (1997). Dynamic capabilities and strategic management. Strategic Management Journal, 18(7), 509-533. https://doi.org/10.1002/(SICI)1097-0266(199708)18:7<509::AID-SMJ882>3.0.CO;2-Z");

  h2("Anexo. Reglas para reconstruir el análisis");
  p(`Identificadores. La capacidad de innovación con proveedores es C7 (${CAPABILITIES[6]?.short.es ?? "innovación"}). La iniciativa del mismo nombre es I9 (${INITIATIVE_COPY[8]?.name.es ?? "innovación"}). No se intercambian. El resto de capacidades es C1 a C8 en el orden costos, caja, riesgo, control, ESG, digital, innovación y talento. Las iniciativas son I1 a I11 en el orden del instrumento.`);
  p(`Preferencias. Diez comparaciones. Consistencia individual con los umbrales 0,10 y 0,20. Agregación AIP: media aritmética de pesos globales, una empresa una vez. Este documento no usa la media geométrica de juicios de la versión A y no presenta las dos medias como una serie en el tiempo.`);
  p(`Brechas. Madurez = (nivel - 1) / 4. Meta = 0,75. Brecha = máximo entre 0 y meta menos madurez. Brecha ponderada = peso de la empresa por brecha de la empresa. Si la suma de brechas ponderadas es 0, el cierre porcentual queda vacío.`);
  p(`Portafolio. Enumeración de 2048 máscaras. Composición multiplicativa del cierre. Escenarios: ajustado 6/7/2, intermedio 11/13/4, amplio 18/20/6. Matriz ${cut.impact}, modelo ${cut.model}. IA (I6) requiere datos (I5) cuando la condición no está lista. Sensibilidad: ${cut.sensitivity.runs || 500} corridas, semilla 2027, factor uniforme de 0,80 a 1,20 sobre aportes distintos de cero, tope 0,95.`);
  p(`Lo que este anexo no contiene son nombres, correos ni citas textuales atribuibles. El detalle de software queda en el repositorio. La versión del manuscrito es ${cut.version}.`);

  return {
    title: "Prioridades, capacidades y decisiones de Compras hacia 2027: un estudio exploratorio con análisis multicriterio y escenarios de portafolio",
    kicker: "Radar Compras 2027 · C (versión oficial) · working paper",
    stamp,
    keywords: ["compras", "proceso analítico jerárquico", "capacidades", "portafolio de iniciativas", "realización del ahorro", "preparación de datos"],
    abstract: abstractOf(cut),
    blocks,
  };
}

function abstractOf(cut: PaperCut) {
  const lead = cut.aip
    ? `El mayor peso medio es ${capabilityName(cut.priorityOrder[0])} (${pct(cut.aip[cut.priorityOrder[0]])}), y el orden de las brechas ponderadas ${cut.priorityOrder[0] === cut.gapOrder[0] ? "empieza por el mismo criterio" : `empieza por ${capabilityName(cut.gapOrder[0])}`}.`
    : "El corte todavía no arma un promedio de prioridades.";
  return `Este working paper examina cómo un grupo de áreas de Compras reparte la atención entre ocho criterios y qué capacidad, medición y agenda acompañan esa preferencia. El objetivo es separar prioridad, práctica y decisión, y comparar la agenda aprobada con portafolios calculados bajo recursos de demostración. El diseño es transversal y autodeclarado. En esta ejecución hay ${cut.included} respuestas incluidas, ${cut.operational} operativas y ${cut.companies} empresas en el benchmark. El promedio de prioridades usa ${cut.ahp.principal} perfiles con consistencia de hasta 0,10. ${lead} ${share(cut.exposureHighRiskBelow4, cut.operational)} combinan exposición de 25% o más con continuidad bajo el nivel 4. ${share(cut.productive, cut.operational)} declaran IA en producción o extendida. En ${cut.motor} empresas el motor compara la agenda aprobada con tres escenarios y prueba si el conjunto se mantiene al mover los aportes. Esos resultados son del modelo: no son ahorro ni probabilidad de éxito. La conclusión es que el mandato puede describirse, y que la decisión útil ocurre donde el peso y la brecha de la propia empresa se distancian.`;
}

export function paperMarkdown(doc: PaperDocument) {
  const lines = [
    `# ${doc.title}`,
    "",
    doc.kicker,
    "",
    doc.stamp,
    "",
    `Palabras clave: ${doc.keywords.join("; ")}.`,
    "",
    "## Resumen",
    "",
    doc.abstract,
    "",
  ];
  for (const block of doc.blocks) {
    if (block.type === "h2") lines.push("", `## ${block.text}`, "");
    if (block.type === "h3") lines.push("", `### ${block.text}`, "");
    if (block.type === "p") lines.push(block.text, "");
    if (block.type === "table") {
      lines.push("", `**${block.id}. ${block.title}**`, "");
      lines.push(`| ${block.headers.join(" | ")} |`);
      lines.push(`| ${block.headers.map(() => "---").join(" | ")} |`);
      for (const row of block.rows) lines.push(`| ${row.join(" | ")} |`);
      lines.push("", block.note, "");
    }
  }
  return lines.join("\n");
}

export function paperWords(doc: PaperDocument) {
  const text = [doc.abstract, ...doc.blocks.filter((block) => block.type === "p").map((block) => block.text)].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

function pct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "no calculable";
  return `${(value * 100).toFixed(1).replace(".", ",")}%`;
}

function num(value: number, digits: number) {
  return value.toFixed(digits).replace(".", ",");
}

function points(value: number | null) {
  if (value == null) return "no calculable";
  return `${num(value, 1)} puntos`;
}

function level(value: number | null) {
  if (value == null) return "-";
  return num(value, 1);
}

function share(count: number, total: number) {
  if (!total) return "0 de 0";
  return `${count} de ${total} (${num((100 * count) / total, 1)}%)`;
}

function closure(cut: PaperCut, id: string) {
  return cut.closures.find((row) => row.id === id)?.median ?? null;
}

function barrierSentence(cut: PaperCut) {
  const rows = Object.entries(cut.barriers).sort((left, right) => right[1] - left[1]);
  if (!rows.length) return "No hay barreras marcadas en la ruta operativa.";
  return rows.map(([code, n]) => `${BARRIER[code] ?? code} en ${share(n, cut.barrierBase)}`).join("; ");
}
