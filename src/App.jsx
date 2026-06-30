import { useState, useEffect } from "react";
import {
  Lock, Check, Play, X, Wind, Flame, ChevronLeft, Sparkles,
  Hand, Eye, AlertTriangle, MapPin,
} from "lucide-react";

// =====================================================================
// MÓDULO 1 — Para la Longevidad (Primera aproximación al Tao y los 8 Brocados)
// =====================================================================
const ESTACIONES_LONGEVIDAD = [
  {
    id: 0,
    tipo: "intro",
    titulo: "¿Qué es el Tao?",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "El Tao no se explica, se experimenta. Antes de mover el cuerpo, hay que entender el principio: todo fluye entre dos polos que se necesitan — Yin y Yang.",
      },
      {
        tipo: "lista",
        titulo: "Práctica guiada",
        items: [
          "Siéntate con la espalda recta, sin tensión.",
          "Cierra los ojos y lleva la atención al Dan Tian (3 dedos bajo el ombligo).",
          "Respira 9 veces, contando cada exhalación.",
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Sostener el cielo",
    sub: "1er Brocado",
    free: true,
    icono: "1",
    duracion: "12 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Entrelaza los dedos frente al Dan Tian y eleva los brazos sobre la cabeza, palmas hacia el cielo, estirando toda la columna." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Inhala al subir los brazos, exhala al bajarlos. 6 repeticiones." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Estimula el Triple Calentador, mejora la oxigenación y libera tensión en hombros y columna." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Tensar el arco",
    sub: "2º Brocado",
    free: false,
    icono: "2",
    duracion: "14 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Postura de jinete. Simula tensar un arco a cada lado, alternando brazos." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Inhala al abrir el arco, exhala al recoger. 6 repeticiones por lado." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Fortalece piernas y core, abre el pecho, tonifica el meridiano de Pulmón." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Separar cielo y tierra",
    sub: "3er Brocado",
    free: false,
    icono: "3",
    duracion: "11 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Una mano empuja hacia el cielo, la otra hacia la tierra, alternando." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Inhala al extender, exhala al cambiar de lado. 6 repeticiones." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Regula el Qi de Bazo y Estómago, mejora la digestión." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Mirar hacia atrás",
    sub: "4º Brocado",
    free: false,
    icono: "4",
    duracion: "10 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Gira suavemente cabeza y torso para mirar atrás, brazos relajados a los lados." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Inhala al girar, exhala al volver al centro." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Libera tensión cervical, ayuda a disipar el calor interno y el estrés." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Sacudir la cabeza",
    sub: "5º Brocado",
    free: false,
    icono: "5",
    duracion: "9 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Postura de jinete amplia, inclinación lateral del torso con la cabeza." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Exhala con un leve sonido 'ja' al inclinar." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Drena el calor del Corazón, calma la mente." },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Tocarse los pies",
    sub: "6º Brocado",
    free: false,
    icono: "6",
    duracion: "13 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Flexión de tronco hacia adelante deslizando las manos por la espalda baja y piernas." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Exhala al bajar, inhala al subir." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Fortalece riñones y zona lumbar, tonifica el Jing." },
    ],
  },
  {
    id: 7,
    tipo: "practica",
    titulo: "Puños y mirada feroz",
    sub: "7º Brocado",
    free: false,
    icono: "7",
    duracion: "10 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Postura de jinete baja, golpes de puño alternos hacia adelante con mirada intensa." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Exhala con fuerza en cada golpe." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Activa el Qi e Hígado, desarrolla fuerza y determinación." },
    ],
  },
  {
    id: 8,
    tipo: "practica",
    titulo: "Rebotar sobre los talones",
    sub: "8º Brocado · Cierre",
    free: false,
    icono: "8",
    duracion: "7 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "De pie, talones juntos, elevación suave y caída con pequeño rebote." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Respiración libre y natural, 7 repeticiones." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Armoniza todo el Qi circulado en la sesión, cierra la práctica." },
    ],
  },
];

// =====================================================================
// MÓDULO 2 — Menstruación, Ciclo y Menopausia
// =====================================================================
const ESTACIONES_MENSTRUACION = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Comprensión energética",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Desde la medicina tradicional china, los síntomas menstruales y de la menopausia hablan siempre de un desequilibrio en tres órganos: los Riñones (reservorio del jing y del yin), el Hígado (regula el flujo de sangre y qi) y el Corazón (alberga el shen y el fuego). La sangre (xue) es la sustancia fundamental del ciclo.",
      },
      {
        tipo: "patrones",
        titulo: "Cinco patrones frecuentes",
        items: [
          { nombre: "Reglas abundantes / ciclo corto", texto: "Exceso de calor en la sangre → fuego en hígado y corazón. Objetivo: refrescar." },
          { nombre: "Reglas escasas / ciclo largo", texto: "Vacío de qi en el bazo y los riñones. Objetivo: tonificar, nutrir la sangre." },
          { nombre: "Reglas dolorosas / cólicos", texto: "Estancamiento de qi y sangre en el hígado. Objetivo: mover, liberar." },
          { nombre: "Sofocos menopáusicos", texto: "Vacío de yin en los riñones (el yin no puede contener el yang). Objetivo: nutrir el yin, apagar el fuego." },
          { nombre: "Irritabilidad premenstrual", texto: "Exceso de yang en hígado y corazón + shen agitado. Objetivo: calmar el shen." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Ventanas del rostro",
    sub: "Paso 1 · Automasaje",
    free: true,
    icono: "1",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Por qué funciona",
        texto: "En la MTC, cada zona del rostro es una 'ventana' que refleja el estado de un órgano interno. Frota antes las palmas hasta sentir calor: activa el punto Lao Gong (8MC), principal emisor de qi terapéutico.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia completa (10 min)",
        items: [
          "Ojos → Hígado: cubre los ojos cerrados con las palmas calientes, presiona suave y circularmente. 2 min.",
          "Orejas → Riñones: masajea el pabellón auricular completo, tira del lóbulo suavemente hacia abajo. 2 min.",
          "Boca / labios → Bazo: masajea alrededor de la boca con índice y corazón. 1 min.",
          "Toda la cara → Corazón: con las palmas calientes, pasa por toda la cara de abajo hacia arriba. 2 min.",
          "Cuero cabelludo → Shen: rasca y masajea con las yemas de los dedos. 1 min.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Nota para la instructora",
        texto: "Para sofocos: insiste en orejas y cara completa. Para reglas dolorosas: insiste en los ojos. Para ciclos cortos: frota el entrecejo (Yin Tang) para bajar el calor.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Masaje de dedos",
    sub: "Paso 2 · Automasaje",
    free: false,
    icono: "2",
    duracion: "5-7 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Por qué funciona",
        texto: "Las manos contienen en miniatura los meridianos completos del cuerpo. Este masaje activa la circulación en los meridianos yin que regulan el ciclo.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia paso a paso (5-7 min)",
        items: [
          "Siéntate cómodamente. Frota las palmas 9 veces hasta sentir calor.",
          "Con pulgar e índice de una mano, pellizca y desliza desde la base hasta la punta de cada dedo de la otra. Repite en ambas manos.",
          "Masajea los espacios interdigitales con movimientos circulares.",
          "Presiona el punto He Gu (LI4) entre pulgar e índice. Sostén 30 seg. por lado.",
          "Cierra los puños, pulgar dentro, presionando Lao Gong (8MC) en el centro de la palma.",
          "Finaliza rozando las manos entre sí, como lavando lentamente la energía.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Puntos clave de las manos",
        texto: "Lao Gong (8MC): emisor de calor curativo. He Gu (LI4): regula el qi, alivia cólicos — evitar en embarazo. Shao Chong (C9): calma el shen. Zu Ling Qi (VB41): equivalente en el pie, para sofocos.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Respiración y sonidos",
    sub: "Paso 3 · Respiración",
    free: false,
    icono: "3",
    duracion: "11 min",
    videoId: "",
    bloques: [
      {
        tipo: "respiracion",
        titulo: "A · Respiración abdominal yin (base)",
        texto: "De pie o sentada en Wu Ji. Inspira por la nariz expandiendo el vientre (4-5 seg), contrae suavemente el perineo, espira aún más lento (6-8 seg). Repite 9 veces, visualizando el dan tian inferior como una luna llena tibia.",
      },
      {
        tipo: "respiracion",
        titulo: "B · Sonido Xu — para el hígado",
        texto: "Inspira profundamente. Al espirar, emite el sonido 'Xu' largo y continuo mientras extiendes los brazos a los lados, palmas hacia arriba. Repite 6 veces, visualizando un verde esmeralda envolviendo el hígado. Útil para reglas dolorosas e irritabilidad.",
      },
      {
        tipo: "respiracion",
        titulo: "C · Sonido Chui — para los riñones",
        texto: "Inspira profundamente. Al espirar, emite 'Chui' suavemente mientras las manos descienden hacia los riñones, en la espalda. Repite 6 veces, visualizando un azul-negro noche nutriendo los riñones. Útil para sofocos y fatiga.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "El Ciervo",
    sub: "Paso 4 · Movimiento",
    free: false,
    icono: "4",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "movimiento",
        titulo: "La energía del Ciervo",
        texto: "Elemento Agua, órgano Riñones. Sus movimientos masajean el meridiano del riñón y favorecen la circulación pélvica — ideal para el ciclo femenino y la menopausia.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 1 — Torsión lateral (los cuernos)",
        texto: "Pies al ancho de caderas, rodillas flexionadas. Forma 'cuernos' con las manos (dobla anular y corazón). Un brazo se estira lateral, el otro se pliega cerca del cuerpo. Rota el torso hacia el lado del brazo extendido, vértebra a vértebra. 3 respiraciones, cambia de lado. 3 veces por lado.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 2 — El salto del Ciervo",
        texto: "Flexiona rodillas, los brazos suben en arco hasta el pecho mientras la espalda se redondea. Luego el ciervo se yergue: cuernos suben, columna elongada, mirada al frente. Repite 7 veces — el número taoísta del Ciervo.",
      },
      {
        tipo: "nota",
        titulo: "Variante para sofocos y menopausia",
        texto: "Hazlo muy despacio, con espiración larga. Al erguirte, imagina una lluvia fresca descendiendo desde Bai Hui hacia los riñones. Termina con ambas palmas calientes sobre los riñones, 5 respiraciones.",
      },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Puntos de acupuntura",
    sub: "Paso 5 · Automasaje de puntos",
    free: false,
    icono: "5",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Cómo masajear",
        texto: "Siempre sentada, con calma. Presión circular del pulgar, 30-60 seg por punto, en ambos lados del cuerpo.",
      },
      {
        tipo: "puntos",
        items: [
          {
            nombre: "San Yin Jiao (6Ra) · Principal",
            localizacion: "Cara interna de la pierna, 4 dedos sobre el maléolo interno, junto a la tibia.",
            indicaciones: "Todos los trastornos menstruales y la menopausia. Insomnio hormonal.",
            comoMasajear: "Sentido horario para tonificar (reglas escasas), antihorario para dispersar (abundantes). Evitar en embarazo.",
          },
          {
            nombre: "Ran Gu (R2) · Secundario",
            localizacion: "Cara interna del pie, en el hueso navicular.",
            indicaciones: "Sofocos menopáusicos, calores nocturnos, sequedad.",
            comoMasajear: "Presiones delicadas, ambos pies a la vez si es posible. Ideal antes de dormir.",
          },
          {
            nombre: "Qi Men (14F) · Complementario",
            localizacion: "Justo bajo los pezones, 6º espacio intercostal.",
            indicaciones: "Función del hígado, síndrome premenstrual, irritabilidad.",
            comoMasajear: "Presión enérgica, rotar en un sentido y luego en el otro.",
          },
          {
            nombre: "Ming Men (4VG) · Apoyo",
            localizacion: "Línea media de la espalda, entre la 2ª y 3ª lumbar.",
            indicaciones: "Vitalidad profunda, menopausia, frío pélvico.",
            comoMasajear: "Palmas calientes apoyadas sobre el punto, masaje con los nudillos en círculos.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualización del Árbol",
    sub: "Paso 6 · Cierre",
    free: false,
    icono: "6",
    duracion: "8-15 min",
    videoId: "",
    bloques: [
      {
        tipo: "visualizacion",
        titulo: "La postura",
        texto: "De pie, pies al ancho de caderas. Brazos elevados al frente como abrazando un árbol. La lengua toca el paladar, el perineo se contrae suavemente. Columna elongada desde Hui Yin hasta Bai Hui. Ojos cerrados, respiración abdominal suave.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 1 — Enraizamiento (2 min)",
        texto: "Siente el peso del cuerpo descender hacia los pies. Visualiza Yong Quan (1R) en la planta del pie, con raíces de luz bajando hacia la tierra.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 2 — El agua que sube (3-5 min)",
        texto: "Una corriente de agua fresca sube desde la tierra, entra por Yong Quan, pasa por San Yin Jiao y llega a los riñones. El yin y el yang se equilibran ahí. La energía sube por el Vaso Concepción hasta el dan tian inferior, donde se acumula como una luna tranquila.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 3 — Calmar el shen (2-3 min)",
        texto: "Desde el dan tian inferior, una pequeña parte de la energía sube hasta el dan tian superior (entrecejo). Un punto de luz azul plateada desciende con cada espiración. El fuego baja, el corazón se tranquiliza.",
      },
      {
        tipo: "visualizacion",
        titulo: "Cierre",
        texto: "Lleva las palmas al dan tian inferior (izquierda pegada al vientre, derecha encima). 36 rotaciones en sentido antihorario, luego 24 en sentido horario. Respira 3 veces profundo. Abre los ojos despacio.",
      },
    ],
  },
];

// =====================================================================
// MÓDULO 3 — Retención de Líquidos
// =====================================================================
const ESTACIONES_RETENCION = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Comprensión energética",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La retención de líquidos (edema, pesadez de piernas, hinchazón matutina, celulitis) responde a un desequilibrio en el eje Bazo-Riñón. El bazo transforma y transporta los líquidos; cuando su qi es débil, la humedad (shi) se acumula y estanca. Los riñones controlan los fluidos a nivel profundo. El objetivo: calentar el bazo, fortalecer el riñón y mover el qi para disolver la humedad.",
      },
      {
        tipo: "patrones",
        titulo: "Patrones frecuentes",
        items: [
          { nombre: "Hinchazón de piernas al final del día", texto: "Vacío de qi en el bazo. Humedad que desciende y se acumula. Objetivo: tonificar bazo, mover qi descendente." },
          { nombre: "Hinchazón matutina (cara, manos)", texto: "Vacío de yang en riñones. El agua no se transforma. Objetivo: calentar el yang renal." },
          { nombre: "Pesadez generalizada / fatiga con edema", texto: "Bloqueo combinado bazo-pulmón. Objetivo: activar la circulación y calentar el dan tian." },
          { nombre: "Celulitis / estancamiento de fluidos", texto: "Humedad crónica con estancamiento de qi y sangre. Objetivo: mover, drenar, calentar." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Ventanas del rostro",
    sub: "Paso 1 · Automasaje",
    free: true,
    icono: "1",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Dónde poner el énfasis",
        texto: "Frota las palmas vigorosamente hasta sentir calor intenso (activa Lao Gong, 8MC). El énfasis está en las ventanas del bazo (boca/labios) y los riñones (orejas).",
      },
      {
        tipo: "lista",
        titulo: "Secuencia completa (8 min)",
        items: [
          "Boca → Bazo: con índice y corazón, masajea en círculos alrededor de boca y labios. 3 min.",
          "Orejas → Riñones: masajea todo el pabellón auricular, tira del lóbulo hacia abajo 9 veces. 2 min.",
          "Nariz → Pulmones: masajea las alas de la nariz con los pulgares. 1 min.",
          "Cuero cabelludo → Vejiga/VB: peina con los dedos el cuero cabelludo completo. 2 min.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Consejo práctico",
        texto: "Hazlo antes de levantarte de la cama para combatir la hinchazón matutina. Para piernas hinchadas: al terminar, frota con fuerza la cara interna de los muslos de arriba abajo (sentido de drenaje).",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Masaje de dedos",
    sub: "Paso 2 · Automasaje",
    free: false,
    icono: "2",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Por qué funciona",
        texto: "Activa especialmente el meridiano del Triple Calentador (distribución de líquidos) y el del Bazo.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia (5 min)",
        items: [
          "Frota las palmas 9 veces hasta sentir calor en Lao Gong.",
          "Masajea cada dedo pellizcando de la base a la punta, con especial atención al meñique y al anular.",
          "Presiona He Gu (LI4, entre pulgar e índice) 30 seg por lado.",
          "Entrelaza los dedos y fricciona los nudillos con fuerza.",
          "Lleva las manos entre las rodillas (juntas) y fricciona las palmas para generar calor hacia las piernas.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Técnica clave",
        texto: "Frota los pies con las palmas calientes cada mañana: 9 rotaciones sobre Yong Quan (1R, planta del pie). Activa el yang renal y drena el agua hacia abajo y hacia fuera.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Respiración y sonidos",
    sub: "Paso 3 · Respiración",
    free: false,
    icono: "3",
    duracion: "11 min",
    videoId: "",
    bloques: [
      {
        tipo: "respiracion",
        titulo: "A · Respiración abdominal con calor en el dan tian",
        texto: "Palmas sobre el dan tian. Inspira expandiendo el vientre (5 seg), retén 2-3 seg visualizando una llama cálida que disuelve la humedad, espira lento (6-7 seg) visualizando humedad gris saliendo por las plantas de los pies. Repite 9 veces.",
      },
      {
        tipo: "respiracion",
        titulo: "B · Sonido Xi — para el bazo y páncreas",
        texto: "Inspira profundo. Al espirar, emite 'Xi' (chi suave) largo y continuo mientras los brazos se elevan a los lados, palmas hacia arriba. Visualiza el color amarillo irradiando desde el centro. Repite 6 veces, luego masajea el abdomen en sentido horario.",
      },
      {
        tipo: "respiracion",
        titulo: "C · Respiración paradójica — drenaje profundo",
        texto: "Al inspirar, contrae el vientre; al espirar, expándelo — como un fuelle que comprime la humedad hacia fuera. Practica solo 3-5 min al principio, de pie con ligera flexión de rodillas. Si hay mareos, vuelve a la respiración normal.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "El Oso",
    sub: "Paso 4 · Movimiento",
    free: false,
    icono: "4",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "movimiento",
        titulo: "La energía del Oso",
        texto: "Elemento Tierra, órgano Bazo y estómago. Sus movimientos pesados y enraizados activan el metabolismo y calientan el centro del cuerpo — ideal para retención de líquidos y pesadez.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 1 — Balanceo lateral",
        texto: "Pies más anchos que las caderas, rodillas flexionadas. Manos cuelgan pesadas a los lados. Balancea el cuerpo de izquierda a derecha dejando que el peso oscile naturalmente. El movimiento viene de la cadera, no de los hombros. Repite 12-18 veces.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 2 — El Oso que escala",
        texto: "La mano derecha sube (brazo semitendido) mientras la izquierda baja; el tronco rota suavemente hacia la derecha. El peso va al pie contrario al brazo que sube. Alterna como si escalaras lentamente. Repite 9 veces por lado.",
      },
      {
        tipo: "nota",
        titulo: "Variante de bajo impacto",
        texto: "El balanceo lateral puede hacerse sentado en una silla firme, moviendo el peso de un isquión al otro. El Oso que escala puede hacerse solo con los brazos, sin desplazamiento de peso.",
      },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Puntos de acupuntura",
    sub: "Paso 5 · Automasaje de puntos",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Cómo masajear",
        texto: "Siempre sentada, con calma. Presión circular del pulgar, 30-60 seg por punto, en ambos lados.",
      },
      {
        tipo: "puntos",
        items: [
          {
            nombre: "Yin Ling Quan (9Ra) · Principal",
            localizacion: "Cara interna de la pierna, 2 dedos bajo el pliegue de la rodilla, junto a la tibia.",
            indicaciones: "El gran punto drenante del cuerpo. Elimina la humedad, regula el bazo. Edemas, retención, pesadez.",
            comoMasajear: "Rotaciones suaves del pulgar, ambos lados a la vez si es posible. Sensible: no golpear. Diario.",
          },
          {
            nombre: "Zu San Li (36E) · Secundario",
            localizacion: "4 dedos bajo la rótula, hacia fuera de la tibia.",
            indicaciones: "Tonifica el qi del bazo y estómago. Activa el metabolismo. El punto más tonificante del cuerpo.",
            comoMasajear: "Golpeteos suaves con el puño cerrado o presión con el pulgar, 60-90 seg. Muy eficaz de pie.",
          },
          {
            nombre: "Shui Fen (9VC) · Complementario",
            localizacion: "1 dedo por encima del ombligo, línea media del abdomen.",
            indicaciones: "Su nombre lo dice: distribuye y regula el agua en el organismo. Retención, edemas, función renal.",
            comoMasajear: "Palma caliente sobre el punto, 9 rotaciones lentas en cada sentido, visualizando el agua drenando.",
          },
          {
            nombre: "Masaje de Riñones · Apoyo",
            localizacion: "Ming Men y zona lumbar.",
            indicaciones: "Activa el yang renal: el fuego que transforma el agua en vapor y permite el drenaje.",
            comoMasajear: "Frota las palmas hasta calentarlas y masajea la zona lumbar 90 veces con cada mano (técnica taoísta).",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualización del Árbol",
    sub: "Paso 6 · Cierre",
    free: false,
    icono: "6",
    duracion: "8-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "visualizacion",
        titulo: "La postura",
        texto: "De pie, pies paralelos, rodillas ligeramente flexionadas. Brazos en óvalo. Lengua al paladar, perineo suavemente contraído. Columna elongada. Ojos cerrados, respiración abdominal suave.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 1 — El fuego del centro (2 min)",
        texto: "Atención al dan tian inferior. Visualiza una llama dorada, cálida y estable. Con cada inspiración crece; con cada espiración irradia calor hacia todo el vientre, transformando el agua fría estancada en vapor que circula.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 2 — El drenaje (3-5 min)",
        texto: "Esa energía caliente desciende por la cara interna de las piernas, pasa por Yin Ling Quan y continúa hasta Yong Quan. Ahí, toda la humedad gris y pesada abandona el cuerpo hacia la tierra. Con cada espiración sale más humedad; con cada inspiración sube más calor dorado.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 3 — Ligereza (2-3 min)",
        texto: "El cuerpo se siente más ligero. Las piernas, antes pesadas, se vuelven livianas. Zu San Li vibra con vitalidad. El bazo y el estómago se activan. El qi circula libremente.",
      },
      {
        tipo: "visualizacion",
        titulo: "Cierre",
        texto: "Palmas al dan tian. 9 rotaciones horarias (tonifica). 3 respiraciones profundas. Frota las manos y pásalas por cara y cuero cabelludo para cerrar la sesión.",
      },
    ],
  },
];

// =====================================================================
// MÓDULO 4 — Falta de Energía y Fatiga Crónica
// =====================================================================
const ESTACIONES_ENERGIA = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Comprensión energética",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La fatiga crónica en MTC es siempre un vacío: de qi, de yang, de jing o de sangre. Los riñones son el 'banco de la energía vital' (yuan qi): cuando están agotados, todo el organismo sufre. El corazón (shen) y los pulmones (qi de respiración) son los otros dos pilares. Suele combinarse un vacío de yang renal (frío, pesadez, poca motivación) con un vacío de qi de bazo (digestión lenta, pensamientos circulares).",
      },
      {
        tipo: "patrones",
        titulo: "Patrones frecuentes",
        items: [
          { nombre: "Fatiga matutina / difícil despertar", texto: "Vacío de yang renal, el yang no asciende. Objetivo: calentar Ming Men, activar el Ciervo." },
          { nombre: "Fatiga de tarde / bajón a las 17h", texto: "Vacío de qi de bazo. Objetivo: tonificar el dan tian medio." },
          { nombre: "Fatiga + desmotivación", texto: "Vacío de jing renal + shen apagado. Objetivo: nutrir el jing, despertar el shen con el Tigre." },
          { nombre: "Fatiga + palpitaciones / ansiedad", texto: "Vacío de qi de corazón. Objetivo: tonificar el corazón con el sonido He." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Ventanas del rostro",
    sub: "Paso 1 · Automasaje energizante",
    free: true,
    icono: "1",
    duracion: "10 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Dónde poner el énfasis",
        texto: "Ideal al despertar. El énfasis está en los oídos (riñones, reservorio del yuan qi), el frente (shen/corazón) y los ojos (hígado).",
      },
      {
        tipo: "lista",
        titulo: "Secuencia energizante (10 min)",
        items: [
          "Cuero cabelludo completo: peina con los 10 dedos con presión fuerte desde la frente hacia la nuca, 9 veces. 3 min.",
          "Orejas → Riñones: masajea con energía todo el pabellón auricular, tira del lóbulo 9 veces. 2 min.",
          "Ojos → Hígado: cubre con las palmas calientes, luego masajea el contorno con el pulgar. 2 min.",
          "Dientes → Riñones: entrechoca los dientes 9-18 veces con firmeza. 30 seg.",
          "Cara completa → Corazón: palmas calientes, frotar de abajo a arriba. 1 min.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Añadir: Tambor Celestial",
        texto: "Tapa las orejas con las palmas, dedos en el occipucio. El índice golpea sobre el dedo corazón hacia el cráneo, 9 golpes. El sonido debe resonar en la cabeza. Clarifica la mente y combate la fatiga.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Masaje de dedos",
    sub: "Paso 2 · Automasaje energizante",
    free: false,
    icono: "2",
    duracion: "6 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Objetivo energizante",
        texto: "Activar los meridianos yang de la mano (Intestino Grueso, Triple Calentador, Intestino Delgado) para llevar calor y vitalidad a todo el cuerpo.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia energizante (6 min)",
        items: [
          "Frota las palmas con fricción rápida y vigorosa hasta sentir calor fuerte.",
          "Con los pulgares, presiona y desliza desde la base hasta la punta de cada dedo, como exprimiendo.",
          "Golpetea suavemente los nudillos de una mano contra la palma de la otra.",
          "Cierra el pulgar dentro del puño (posición de poder), sostén 30 seg por mano.",
          "Frota el dorso de una mano sobre la palma de la otra, rápido, 18 veces por lado.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Técnica complementaria",
        texto: "Masajea el cuero cabelludo con los nudillos, en círculos con fuerza. Refuerza el yang y la circulación cerebral, previene vértigos y fatiga crónica.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Qi Gong de los Riñones y sonidos",
    sub: "Paso 3 · Respiración",
    free: false,
    icono: "3",
    duracion: "12 min",
    videoId: "",
    bloques: [
      {
        tipo: "respiracion",
        titulo: "A · Qi Gong de los Riñones",
        texto: "De pie, rodillas ligeramente flexionadas, lengua al paladar. Inspira llevando las palmas al pecho mientras visualizas el qi de la tierra subiendo por Yong Quan hacia los riñones. Abre los brazos lateralmente, palmas hacia los riñones, 10 seg. Sube las palmas bajo las axilas, palmas al cielo. Gira las palmas al suelo y baja los brazos. Repite 9 veces. El más específico para la fatiga — ideal practicarlo 2 veces al día.",
      },
      {
        tipo: "respiracion",
        titulo: "B · Sonido He — para el corazón y el shen",
        texto: "Inspira. Al espirar, emite 'He' largo mientras los brazos suben lentamente sobre la cabeza, palmas al cielo. Visualiza el color rojo brillante irradiando desde el corazón. 6 repeticiones. Para fatiga con palpitaciones o shen apagado.",
      },
      {
        tipo: "respiracion",
        titulo: "C · Sonido Chui — para los riñones y el yang",
        texto: "Emite 'Chui' al espirar mientras las manos descienden hacia los riñones. Al final de cada repetición, frota las palmas en Ming Men. 6 repeticiones.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "El Tigre",
    sub: "Paso 4 · Movimiento",
    free: false,
    icono: "4",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "movimiento",
        titulo: "La energía del Tigre",
        texto: "Animal de la madera y el fuego, la fuerza y la decisión. Activa la circulación sanguínea, despierta el yang y combate la inercia de la fatiga crónica.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 1 — El Tigre eleva su presa",
        texto: "Manos-garras cuelgan al frente. Al inspirar, las garras suben lentamente como levantando una presa, hasta encima de la cabeza. Al espirar, descienden por delante del cuerpo. El movimiento más importante para activar la circulación sanguínea. Repite 9 veces.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 2 — El salto del Tigre",
        texto: "El tigre se inclina hacia delante enrollando la columna vértebra a vértebra. Las garras rozan el suelo. Al volver, despliega la columna como un resorte interno. Repite 9 veces, muy lento si hay mareos.",
      },
      {
        tipo: "nota",
        titulo: "Para fatiga severa",
        texto: "Practica solo el primer movimiento, sentado o de pie muy despacio. Empieza con 3 repeticiones y aumenta progresivamente — es el más importante para activar la circulación.",
      },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Puntos de acupuntura",
    sub: "Paso 5 · Automasaje de puntos",
    free: false,
    icono: "5",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          {
            nombre: "Qi Hai (6VC) · Principal — El Mar de la Energía",
            localizacion: "1,5 dedos bajo el ombligo, línea media del abdomen.",
            indicaciones: "El punto más tonificante del cuerpo para el yang. Fatiga, debilidad, falta de motivación, frío interno.",
            comoMasajear: "Palmas superpuestas, 9 rotaciones horarias. Visualiza calor dorado irradiando. Al inspirar, las palmas presionan suave; al espirar, relajan.",
          },
          {
            nombre: "Guan Yuan (4VC) · Secundario",
            localizacion: "3 dedos bajo el ombligo.",
            indicaciones: "Tonifica el yuan qi y consolida el yin. Enraizamiento profundo. Fatiga crónica profunda.",
            comoMasajear: "Igual que Qi Hai. Puede masajearse junto con él con la palma completa.",
          },
          {
            nombre: "Tai Xi (R3) · Complementario",
            localizacion: "Depresión entre el maléolo interno y el tendón de Aquiles.",
            indicaciones: "Nutre el yang de los riñones, favorece la fertilidad, actúa sobre el cerebro. Fatiga + vértigos + memoria débil.",
            comoMasajear: "Presión delicada del pulgar, ambos lados.",
          },
        ],
      },
      {
        tipo: "nota",
        titulo: "Masaje esencial — Los tres dan tian",
        texto: "Protocolo completo de tonificación: 6 rotaciones en cada sentido en el dan tian inferior (vital y sexual), el medio (entre pezones, emocional) y el superior (cima del cráneo, mental). Cierra inspirando contrayendo el perineo y apretando los dientes, y espirando relajando todo.",
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualización del Árbol",
    sub: "Paso 6 · Cierre",
    free: false,
    icono: "6",
    duracion: "8-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "visualizacion",
        titulo: "La postura",
        texto: "De pie (o sentado si la fatiga es severa). Brazos en óvalo. Lengua al paladar. Ojos entreabiertos. Concentra el 70% de tu atención en el dan tian inferior.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 1 — La raíz de energía (2 min)",
        texto: "El dan tian inferior es una esfera de luz dorada y caliente. Al inspirar, se llena de luz. Al espirar, esa luz se expande hacia el resto del cuerpo como ondas de calor. Solo siente el calor.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 2 — El fuego de Ming Men (3-5 min)",
        texto: "Un segundo sol detrás del dan tian, en Ming Men. Al inspirar se calienta; al espirar ese fuego sube por la columna hasta el corazón. El shen se despierta: una ligera vitalidad, un pequeño entusiasmo.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 3 — El shen despierta (2-3 min)",
        texto: "Desde el corazón, la luz cálida sube al dan tian superior (entrecejo). El shen está despierto y presente: claro y tranquilo. Visualiza un violeta suave.",
      },
      {
        tipo: "visualizacion",
        titulo: "Cierre",
        texto: "Palmas al dan tian inferior. 9 rotaciones horarias. Frota las palmas con fuerza, pásalas por la cara. 3 respiraciones profundas. Mueve suavemente dedos y pies. Abre los ojos.",
      },
    ],
  },
];

// =====================================================================
// MÓDULO 5 — Vitalidad Sexual y Energía Creativa
// =====================================================================
const ESTACIONES_VITALIDAD = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Comprensión energética",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La vitalidad sexual es expresión directa del jing: la esencia vital almacenada en los riñones. Cuando el jing es abundante, la energía sexual, creativa e intelectual florecen. Cuando se agota, todo el sistema vital se debilita. El objetivo no es estimular superficialmente: es nutrir el jing en profundidad, activar el fuego de Ming Men y hacer circular esa energía por la pequeña circulación celestial (Ren Mai / Du Mai).",
      },
      {
        tipo: "patrones",
        titulo: "Patrones frecuentes",
        items: [
          { nombre: "Deseo bajo / frialdad", texto: "Vacío de yang renal o de jing. El fuego de Ming Men está apagado. Objetivo: calentar, tonificar." },
          { nombre: "Falta de control", texto: "Vacío de yin renal. El yang no está anclado. Objetivo: nutrir el yin, consolidar el jing." },
          { nombre: "Disfunción eréctil", texto: "Vacío de yang renal + agotamiento del jing. Objetivo: masaje de riñones + dan tian + Ming Men diario." },
          { nombre: "Fertilidad reducida", texto: "Vacío de jing en ambos riñones. Objetivo: nutrir el jing, practicar el Ciervo y la pequeña circulación." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Ventanas del rostro",
    sub: "Paso 1 · Automasaje",
    free: true,
    icono: "1",
    duracion: "10 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Dónde poner el énfasis",
        texto: "El énfasis está en orejas (riñones/jing), ojos (hígado/sangre) y una técnica especial: el Dragón en el Estanque (la saliva como vehículo del qi).",
      },
      {
        tipo: "lista",
        titulo: "Secuencia (10 min)",
        items: [
          "Orejas → Riñones/Jing: masajea el pabellón auricular con firmeza, tira del lóbulo 9 veces, frota el trago. 3 min.",
          "Ojos → Hígado/Sangre: palmas calientes sobre ojos cerrados. 2 min.",
          "Dientes → Riñones: entrechoca los dientes 18 veces.",
          "Cara → Corazón: frotar toda la cara — el agua de los riñones debe refrescar el fuego del corazón.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Técnica especial — El Dragón en el Estanque",
        texto: "Lengua sobre el paladar. Golpea la lengua contra el paladar 9 veces y entrechoca los incisivos 9 veces a la vez. Deja que la saliva se acumule. Traga en 3 degluciones, sintiendo cómo desciende hasta el dan tian inferior.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Masaje de dedos",
    sub: "Paso 2 · Automasaje",
    free: false,
    icono: "2",
    duracion: "7 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Por qué funciona",
        texto: "Activa los meridianos del Riñón, del Hígado y el Vaso Concepción. El punto Lao Gong (8MC) emite el qi más potente del cuerpo.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia (7 min)",
        items: [
          "Frota las palmas con fricción fuerte hasta sentir calor vivo en Lao Gong.",
          "Masajea cada dedo. Si estás sentada, puedes masajear también los dedos de los pies a la vez.",
          "Cierra los pulgares dentro de los puños (activa Lao Gong). Sostén 30 segundos.",
          "Frota las palmas y llévalas a la zona lumbar (riñones), sintiendo el calor penetrar 30 seg.",
          "Frota de nuevo y lleva las palmas al bajo vientre (dan tian inferior). Calor 30 seg.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Técnica del masaje de la zona sexual",
        texto: "9 rotaciones en sentido horario con la palma sobre el dan tian inferior. Detener cuando aparezca un calor suave. Recomendado para impotencia, frigidez y fertilidad.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Pequeña Circulación Celestial",
    sub: "Paso 3 · Respiración",
    free: false,
    icono: "3",
    duracion: "12 min",
    videoId: "",
    bloques: [
      {
        tipo: "respiracion",
        titulo: "A · La Pequeña Circulación Celestial",
        texto: "El ejercicio más importante de este recorrido: transforma el jing en qi y lo hace circular por todo el cuerpo. De pie en Wu Ji, perineo suavemente contraído, lengua al paladar. Visualiza una bola de energía en el dan tian. Al inspirar, desciende al perineo. Al espirar lentamente, sube por la columna (Du Mai) hacia Bai Hui. Al inspirar de nuevo, desciende por el frente del cuerpo (Ren Mai) hasta el dan tian. Repite 3 círculos completos.",
      },
      {
        tipo: "respiracion",
        titulo: "B · Sonido Chui — para los riñones",
        texto: "6 repeticiones lentas. Al final de cada una, frota las palmas y apóyalas en Ming Men. Visualiza el negro-azul noche penetrando en los riñones, nutriendo el jing.",
      },
      {
        tipo: "respiracion",
        titulo: "C · Respiración abdominal con contracción de perineo",
        texto: "Al inspirar, contrae suavemente el perineo y los glúteos (como reteniendo la orina). Al espirar, relaja todo. Esta contracción sutil ancla el jing en el dan tian. 9 respiraciones lentas.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "El Ciervo y el Tigre",
    sub: "Paso 4 · Movimiento",
    free: false,
    icono: "4",
    duracion: "20 min",
    videoId: "",
    bloques: [
      {
        tipo: "movimiento",
        titulo: "El Ciervo — animal principal",
        texto: "Los mismos dos movimientos del recorrido de Menstruación y Menopausia. Movimiento 1 (torsión lateral): activa los riñones y masajea el Du Mai. Movimiento 2 (el ciervo que se yergue): activa el sacro y Ming Men. Al erguirte, contrae suavemente el perineo y visualiza la energía subiendo por la columna hacia el cerebro — el 'reciclaje' del jing.",
      },
      {
        tipo: "movimiento",
        titulo: "El Tigre — solo el primer movimiento",
        texto: "Las garras suben al inspirar, bajan al espirar. Repite 9 veces, lento y consciente. Visualiza sangre caliente fluyendo hacia la pelvis. Activa el meridiano del hígado en la cara interna de los muslos.",
      },
      {
        tipo: "nota",
        titulo: "Secuencia completa (20 min)",
        texto: "1) Ciervo movimiento 1 — 7 repeticiones. 2) Ciervo movimiento 2 — 7 repeticiones. 3) Tigre movimiento 1 — 9 repeticiones. 4) Pequeña circulación — 3 ciclos.",
      },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Puntos de acupuntura",
    sub: "Paso 5 · Automasaje de puntos",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          {
            nombre: "Ming Men (4VG) · Principal — La Puerta del Destino",
            localizacion: "Línea media de la espalda, entre la 2ª y 3ª vértebra lumbar.",
            indicaciones: "El punto más importante para la vitalidad sexual. Estimula la sexualidad, la columna y el cerebro.",
            comoMasajear: "Técnica taoísta: frota las palmas hasta calentarlas, masajea la zona lumbar 90 veces con cada mano. Luego con los puños cerrados, en círculos.",
          },
          {
            nombre: "Guan Yuan (4VC) · Secundario",
            localizacion: "3 dedos bajo el ombligo, línea media.",
            indicaciones: "Tonifica el yuan qi, consolida el yin. Fertilidad, libido, energía de base.",
            comoMasajear: "9 rotaciones horarias. Visualiza calor dorado acumulándose.",
          },
          {
            nombre: "Tai Xi (R3) · Complementario",
            localizacion: "Entre el maléolo interno y el tendón de Aquiles.",
            indicaciones: "Nutre el yang renal, favorece la fertilidad, tonifica el sistema global. Esencial para la frialdad sexual.",
            comoMasajear: "Presión delicada del pulgar, ambos pies.",
          },
          {
            nombre: "Hui Yin (1VC) · Base",
            localizacion: "Centro del suelo pélvico, entre el ano y los genitales.",
            indicaciones: "Esencial para el equilibrio genital y urinario, femenino y masculino. No se masajea directamente.",
            comoMasajear: "Se activa contrayendo suavemente el perineo al final de cada inspiración, relajando al espirar — mantenlo durante toda la sesión.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualización del Árbol",
    sub: "Paso 6 · Cierre",
    free: false,
    icono: "6",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "visualizacion",
        titulo: "La postura",
        texto: "De pie en Wu Ji. Brazos en óvalo. Lengua al paladar. Perineo contraído suavemente. Esta postura ya activa la pequeña circulación: conectada desde Hui Yin hasta Bai Hui.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 1 — El fuego de Ming Men (3 min)",
        texto: "Atención en la zona lumbar. Visualiza una llama naranja, viva y cálida. Al inspirar crece; al espirar irradia calor hacia los riñones, los genitales, el sacro.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 2 — La elevación del jing (3-5 min)",
        texto: "Esa energía cálida sube por la columna (Du Mai). Al contraer ligeramente el perineo en cada inspiración, la 'bombeas' hacia arriba, hasta el corazón y luego Bai Hui. Luego desciende por el frente del cuerpo (Ren Mai) hasta el dan tian, completando el círculo.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 3 — El jing en el corazón (2 min)",
        texto: "La energía se asienta en el dan tian inferior: el jing está custodiado, no disperso. El shen está sereno. Una vitalidad tranquila, fuerza creativa en estado latente.",
      },
      {
        tipo: "visualizacion",
        titulo: "Cierre",
        texto: "Palmas al dan tian inferior — para mujeres, mano derecha sobre la izquierda. 36 rotaciones antihorarias + 24 horarias. Tres respiraciones. Abre los ojos.",
      },
    ],
  },
];

// =====================================================================
// MÓDULO 6 — Ira, Enfado y Frustración
// =====================================================================
const ESTACIONES_IRA = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Comprensión energética",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La ira, el enfado crónico y la frustración expresan un exceso de yang en el meridiano del Hígado, el órgano que asegura el libre flujo del qi. Cuando ese flujo se bloquea, el qi se estanca y genera calor que sube hacia el corazón y la cabeza: tensión en el cuello, dolor en las sienes, ojos rojos, irritabilidad. El objetivo: mover el qi estancado, bajar el yang excesivo, enfriar el fuego y anclar el shen.",
      },
      {
        tipo: "patrones",
        titulo: "Patrones frecuentes",
        items: [
          { nombre: "Irritabilidad / nerviosismo crónico", texto: "Estancamiento de qi en el hígado. Objetivo: mover con el Tigre, liberar con el sonido Xu." },
          { nombre: "Tensión de cuello/sienes + mal humor", texto: "Yang ascendente del hígado. Objetivo: bajar el yang con Tai Chong y Yong Quan." },
          { nombre: "Frustración creativa / proyectos bloqueados", texto: "El hígado rige los tendones y proyectos vitales. Objetivo: liberar el flujo." },
          { nombre: "Ira explosiva / arrebatos", texto: "Fuego de hígado agudo. Objetivo: enfriar de inmediato con Wu Ji + Xu + Yong Quan." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Ventanas del rostro",
    sub: "Paso 1 · Automasaje calmante",
    free: true,
    icono: "1",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Dónde poner el énfasis",
        texto: "El énfasis total está en los ojos (ventana del hígado). Es el gesto más inmediato para calmar el fuego hepático.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia calmante (8 min)",
        items: [
          "Ojos → Hígado (prioridad): palmas MUY calientes sobre los ojos, presión suave, masaje de párpados con el pulgar. 4 min.",
          "Cara completa → Corazón: palmas hacia abajo, frotar de abajo a arriba. 2 min.",
          "Cuero cabelludo → Vasos: presión fuerte de delante hacia atrás, alivia migrañas e irritabilidad. 1 min.",
          "Boca → Bazo: masajea alrededor de la boca — la tierra controla la madera. 1 min.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Técnica de emergencia (crisis de ira aguda)",
        texto: "Aplica las palmas calientes sobre los ojos durante 5 minutos. Solo eso. Respira por la nariz, muy despacio, sin pensar. Este gesto simple puede interrumpir el ciclo de la ira en 2-3 minutos.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Masaje de dedos",
    sub: "Paso 2 · Automasaje descendente",
    free: false,
    icono: "2",
    duracion: "6 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Objetivo",
        texto: "Bajar el yang que sube. La energía excesiva del hígado tiende a acumularse en el cuello, la cabeza y el pecho.",
      },
      {
        tipo: "lista",
        titulo: "Secuencia descendente (6 min)",
        items: [
          "Frota las palmas hasta sentir calor.",
          "Masajea vigorosamente el cuero cabelludo (como champú), 2 min — empieza a dispersar el yang.",
          "Masajea el cuello y los trapecios con firmeza — ahí se acumula la tensión del hígado.",
          "Sigue bajando: hombros, brazos, antebrazos, manos.",
          "Termina con los dedos del pie, con atención al espacio entre el 1º y 2º dedo (donde está Tai Chong).",
          "Presiona Yong Quan (planta del pie) con el pulgar, 30 seg por pie, anclando el yang a la tierra.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Clave para la ira",
        texto: "El masaje siempre va de arriba a abajo: cuero cabelludo → cuello → hombros → brazos → manos → pies. Este sentido descendente 'baja' el yang excesivo.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Wu Ji y sonidos",
    sub: "Paso 3 · Respiración",
    free: false,
    icono: "3",
    duracion: "13 min",
    videoId: "",
    bloques: [
      {
        tipo: "respiracion",
        titulo: "A · Wu Ji + respiración larga",
        texto: "Antes de cualquier cosa: Wu Ji 5 minutos. De pie, pies paralelos, manos sueltas. Inspira 5 seg, espira 8-10 seg — la espiración muy larga es lo que baja el yang. Después de 5 minutos, el fuego ha bajado.",
      },
      {
        tipo: "respiracion",
        titulo: "B · Sonido Xu — el antídoto del hígado",
        texto: "Inspira profundamente. Al espirar, emite 'Xu' (chu) muy largo, como un suspiro profundo y suave, mientras los brazos se elevan lateralmente, palmas hacia arriba. Visualiza el verde envolviendo el hígado. Repite 9 veces mínimo — hasta 18-27 si la ira es intensa.",
      },
      {
        tipo: "respiracion",
        titulo: "C · Sonido He — calmar el corazón",
        texto: "El fuego del hígado siempre inflama el corazón. 6 repeticiones lentas: brazos suben al inspirar, bajan al espirar con 'He'. Visualiza el rojo volviéndose rosa más suave.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "El Tigre y el Árbol",
    sub: "Paso 4 · Movimiento",
    free: false,
    icono: "4",
    duracion: "15-20 min",
    videoId: "",
    bloques: [
      {
        tipo: "movimiento",
        titulo: "El principio del Tigre para la ira",
        texto: "La ira es fuego atascado: el Tigre lo mueve, pero con máxima conciencia. El secreto: hacer los movimientos MUY despacio. Al ralentizar un movimiento naturalmente rápido, la ira se transforma en poder concentrado.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 1 — El Tigre eleva",
        texto: "Garras hacia abajo al frente. Muy lento: suben durante 10 segundos completos hacia el cielo. Sostén 3-5 seg en la cima. Baja muy lento durante 10 segundos, visualizando que la tensión se va a la tierra. 9 repeticiones.",
      },
      {
        tipo: "movimiento",
        titulo: "Movimiento 2 — El brinco",
        texto: "El tigre baja enrollando la columna, llevando conscientemente la ira hacia abajo. En el punto más bajo, sostén 3 respiraciones. Al desplegarte hacia arriba, esa energía se transforma en poder y claridad. 9 repeticiones lentas.",
      },
      {
        tipo: "nota",
        titulo: "Transición: Abrazar el Árbol (5-10 min)",
        texto: "De pie, brazos en óvalo, ojos cerrados — crucial para consolidar el trabajo del Tigre. Visualiza el qi del hígado volviendo a su lugar natural: fluido, libre, verde y suave.",
      },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Puntos de acupuntura",
    sub: "Paso 5 · Automasaje de puntos",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          {
            nombre: "Tai Chong (3F) · Principal — El Asalto Supremo",
            localizacion: "Dorso del pie, entre el 1er y 2º dedo, algunos cm antes de la articulación.",
            indicaciones: "El punto más importante para regular el yang del hígado. Ira, estrés, tensión en pecho y cuello.",
            comoMasajear: "Presión circular del pulgar. Si duele mucho, es señal de estancamiento real. 60 seg por pie.",
          },
          {
            nombre: "Yong Quan (1R) · Secundario",
            localizacion: "Centro de la planta del pie, primer tercio desde los dedos.",
            indicaciones: "Ancla el yang que sube. Apacigua el espíritu y lleva las energías negativas hacia la tierra.",
            comoMasajear: "Presiones firmes con el pulgar, ambos pies. Caminar descalzo sobre hierba o tierra también lo activa.",
          },
          {
            nombre: "Qi Men (14F) · Complementario",
            localizacion: "Bajo los pezones, 6º espacio intercostal.",
            indicaciones: "Regula todo el flujo del meridiano del hígado. Libera el estancamiento en el tórax, sensación de nudo en el pecho, ira reprimida.",
            comoMasajear: "Presión enérgica, rotar en ambos sentidos. Luego pasar los cantos de las manos del centro hacia los flancos.",
          },
          {
            nombre: "Qu Quan (8F) · Apoyo",
            localizacion: "Cara interna de la rodilla, entre dos tendones al flexionar.",
            indicaciones: "Nutre la sangre y el hígado. Ligado a las perturbaciones de tipo ira y frustración.",
            comoMasajear: "Rotaciones suaves o golpeteos con la palma ligeramente hueca, sentada con las piernas estiradas.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualización del Árbol",
    sub: "Paso 6 · Cierre",
    free: false,
    icono: "6",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      {
        tipo: "visualizacion",
        titulo: "La postura",
        texto: "De pie. Brazos en óvalo. Ojos cerrados — crucial para la ira: cerrar los ojos desconecta el estímulo del hígado. Lengua al paladar, mandíbula relajada.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 1 — Bajar la energía (2 min)",
        texto: "Atención en los pies, sintiendo el contacto con el suelo. Imagina que la ira es agua caliente que desciende desde la cabeza, el cuello, el pecho, el vientre, las piernas, los pies... y penetra en la tierra, donde es absorbida y transformada.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 2 — El árbol en el viento (3-5 min)",
        texto: "El árbol (tú) tiene raíces profundas, el tronco firme. Las ramas (los brazos) se mueven con el viento sin que el árbol caiga. La ira es el viento: puede soplar. El árbol no juzga el viento, simplemente permanece. Observas la ira sin ser la ira.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 3 — El verde del hígado (2-3 min)",
        texto: "El hígado, bajo el pecho derecho, es una esfera verde. La ira estancada era verde oscuro, espeso. Con cada respiración se vuelve más luminoso y fluido — el qi circula libremente, la emoción ya no está bloqueada.",
      },
      {
        tipo: "visualizacion",
        titulo: "Cierre",
        texto: "Palmas al dan tian inferior. 9 rotaciones. Tres respiraciones. Abre los ojos despacio. No te muevas durante 30 segundos: deja que el nuevo estado se consolide.",
      },
    ],
  },
];

// =====================================================================
// MÓDULO 7 — Digestiones Pesadas e Hinchazón de Vientre
// =====================================================================
const ESTACIONES_DIGESTION = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Comprensión energética",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Las digestiones pesadas, los gases, la hinchazón abdominal y el colon irritable combinan dos patrones: vacío de qi del bazo (el fuego digestivo está débil) e invasión del hígado (el exceso de qi del hígado presiona el estómago y el bazo). Los síntomas empeoran con el estrés y las comidas copiosas o frías. El objetivo: calentar y tonificar el bazo, liberar el hígado del estómago y activar el peristaltismo energético.",
      },
      {
        tipo: "patrones",
        titulo: "Patrones frecuentes",
        items: [
          { nombre: "Hinchazón postprandial / gases", texto: "Vacío de qi del bazo + humedad. El bazo no transforma. Objetivo: calentar el centro, sonido Hu." },
          { nombre: "Colon irritable / digestión nerviosa", texto: "Invasión del hígado sobre el estómago. Objetivo: calmar el hígado con Wu Ji + Xu." },
          { nombre: "Digestión muy lenta / estreñimiento funcional", texto: "Vacío de yang del bazo, frío en el centro. Objetivo: calentar fuerte con masaje y 3er Ba Duan Jin." },
          { nombre: "Estómago ácido / ardor + hinchazón", texto: "Fuego de hígado en el estómago. Objetivo: enfriar el hígado, regular el estómago." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Ventanas del rostro",
    sub: "Paso 1 · Automasaje digestivo",
    free: true,
    icono: "1",
    duracion: "10 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Dónde poner el énfasis",
        texto: "Ideal 30 min antes de comer o al inicio de los síntomas. El énfasis está en la boca/labios (ventana del bazo), la nariz (pulmones/intestino) y el Dragón en el Estanque (saliva digestiva).",
      },
      {
        tipo: "lista",
        titulo: "Secuencia digestiva (10 min)",
        items: [
          "Boca/labios → Bazo: masajea en círculos con índice y corazón, 3 min — prioridad absoluta en este recorrido.",
          "Ojos → Hígado: palmas calientes sobre los ojos cerrados, alivia el ardor y los espasmos. 2 min.",
          "Nariz → Pulmones/Intestino: masajea las alas de la nariz con la base de los pulgares. 1 min.",
          "Cuero cabelludo completo: peinado enérgico con los 10 dedos. 1 min.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Técnica especial — El Dragón en el Estanque",
        texto: "Golpea la lengua sobre el paladar 9 veces, entrechoca los incisivos 9 veces. Deja acumularse la saliva y traga en 3 degluciones, sintiendo cómo baja al estómago. La saliva contiene las primeras enzimas digestivas.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Masaje gastro-intestinal",
    sub: "Paso 2 · Automasaje",
    free: false,
    icono: "2",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Masaje de dedos (3 min)",
        texto: "Frota las palmas hasta calentarlas bien. Masajea los dedos del pie, especialmente el 1º (meridiano del bazo y estómago), el 2º (fin del meridiano del estómago) y el 4º (vesícula biliar). Presiona Zu San Li con golpeteos suaves del puño, 60 seg por pierna.",
      },
      {
        tipo: "lista",
        titulo: "Masaje Gastro-intestinal (7-10 min) — sentada, espalda recta",
        items: [
          "Palmas sobre el punto 12VC (entre ombligo y esternón): 36 rotaciones en un sentido, 36 en el otro.",
          "Baja las palmas justo por encima del ombligo: 36 rotaciones en cada sentido.",
          "Palmas sobre el dan tian (ombligo y debajo): 36 rotaciones en cada sentido.",
          "Baja hasta el pubis: 36 rotaciones en cada sentido.",
          "Masajea todo el abdomen en círculos grandes: 12 antihorario (para hinchazón/gases), 12 horario (para estreñimiento).",
        ],
      },
      {
        tipo: "nota",
        titulo: "No practicar en embarazo ni en menstruación dolorosa",
        texto: "Antihorario: dispersa, elimina, desbloquea → gases, hinchazón aguda. Horario: tonifica, calienta, activa → digestión lenta, estreñimiento.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Wu Ji y sonidos",
    sub: "Paso 3 · Respiración",
    free: false,
    icono: "3",
    duracion: "16 min",
    videoId: "",
    bloques: [
      {
        tipo: "respiracion",
        titulo: "A · Wu Ji largo — calmar el shen",
        texto: "Practica Wu Ji 5 minutos antes de comenzar, para calmar totalmente el espíritu: muchos trastornos digestivos están ligados a la actividad mental.",
      },
      {
        tipo: "respiracion",
        titulo: "B · Sonido Hu — para el bazo y el estómago",
        texto: "El sonido digestivo por excelencia. Inspira profundamente. Al espirar, emite 'Hu' largo y continuo como un soplo cálido, con las manos sobre el abdomen. Visualiza el amarillo irradiando calor desde el centro. Repite 9 veces, luego masajea el abdomen en círculos.",
      },
      {
        tipo: "respiracion",
        titulo: "C · Sonido Xi — para el bazo/páncreas y la humedad",
        texto: "6 repeticiones del sonido 'Xi' (chi). Completa el trabajo del bazo y elimina la humedad digestiva.",
      },
      {
        tipo: "respiracion",
        titulo: "D · Respiración abdominal post-comida",
        texto: "Tumbada boca arriba, rodillas flexionadas, manos sobre el abdomen, 5 minutos, 30 minutos después de comer. El diafragma masajea los órganos digestivos con cada respiración.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "El Oso y el 3º y 4º Brocado",
    sub: "Paso 4 · Movimiento",
    free: false,
    icono: "4",
    duracion: "15-18 min",
    videoId: "",
    bloques: [
      {
        tipo: "movimiento",
        titulo: "El Oso",
        texto: "Su balanceo masajea directamente el bazo y el estómago. Movimiento 1 (balanceo lateral): masajea por el movimiento de la cadera. Movimiento 2 (el Oso que escala): activa el meridiano del estómago en la cara anterior del tronco. Visualiza el calor distribuyéndose en el abdomen con cada oscilación. 18 repeticiones por movimiento.",
      },
      {
        tipo: "movimiento",
        titulo: "3er Brocado — Separar el Cielo y la Tierra",
        texto: "Una mano sube hacia el cielo (palma arriba), la otra empuja hacia la tierra (palma abajo). Estiramiento máximo en la espiración, alterna los lados en cada inspiración. Repite 9 veces por lado — masajea el hígado y el estómago entre los dos brazos.",
      },
      {
        tipo: "movimiento",
        titulo: "4º Brocado — Mirar Detrás",
        texto: "Las manos suben a la altura del pecho, palmas al cielo. La cabeza y el tronco rotan hacia un lado (columna lumbar inmóvil), 3 respiraciones, vuelve al centro y repite hacia el otro lado. Masajea toda la esfera digestiva. 9-24 veces por lado.",
      },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Puntos de acupuntura",
    sub: "Paso 5 · Automasaje de puntos",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          {
            nombre: "Zu San Li (36E) · Principal — Las Tres Millas",
            localizacion: "4 dedos bajo la rótula, hacia el exterior de la tibia.",
            indicaciones: "El punto digestivo más importante del cuerpo. Tonifica el bazo y estómago. Digestión lenta, acidez, gas, diarrea o estreñimiento.",
            comoMasajear: "Golpeteos suaves con el puño semicerrado, 60-90 seg por pierna, o presión sostenida del pulgar. Ideal de pie.",
          },
          {
            nombre: "Zhong Wan (12VC) · Secundario",
            localizacion: "Mitad exacta entre el ombligo y el esternón.",
            indicaciones: "El punto central del estómago. Hinchazón, náuseas, digestión lenta, ardores.",
            comoMasajear: "Palma superpuesta: 36 rotaciones antihorarias (hinchazón) u horarias (vaciado lento). Lento y consciente.",
          },
          {
            nombre: "Shen Que (8VC) · Complementario",
            localizacion: "Exactamente el ombligo.",
            indicaciones: "Activa el calor, aporta yang a riñones y bazo, regula intestinos y estómago.",
            comoMasajear: "Palma caliente sobre el ombligo, sin frotar, 2-3 minutos solo calor. Luego 9 rotaciones horarias.",
          },
          {
            nombre: "Di Ji (8Ra) · Apoyo",
            localizacion: "Cara interna de la pierna, a un tercio entre rodilla y tobillo.",
            indicaciones: "Elimina la humedad y regula el bazo. Digestión lenta con pesadez y gases.",
            comoMasajear: "Rotaciones suaves del pulgar, ambas piernas. Sensible: empezar con suavidad.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualización del Árbol",
    sub: "Paso 6 · Cierre",
    free: false,
    icono: "6",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      {
        tipo: "visualizacion",
        titulo: "La postura",
        texto: "De pie o sentada, manos sobre el abdomen. Ojos cerrados. Si estás sentada, espalda recta pero no rígida, pies planos en el suelo.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 1 — El fuego del centro (2 min)",
        texto: "Visualiza el estómago y el bazo como una cocina con un fogón encendido. Cuando el fuego digestivo es fuerte, los alimentos se transforman fácilmente. Con cada inspiración, el fuego se aviva; con cada espiración, el calor se distribuye por el abdomen.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 2 — La transformación (3-5 min)",
        texto: "Los alimentos se transforman en energía limpia y clara. Lo que no sirve desciende hacia los intestinos, siguiendo la gravedad. Nada se estanca. Visualiza el qi impuro del estómago descendiendo desde el dan tian hacia los pies, pasando por Yong Quan, y volviendo a la tierra.",
      },
      {
        tipo: "visualizacion",
        titulo: "Fase 3 — La ligereza después de digerir (2-3 min)",
        texto: "El abdomen está cálido, relajado y ligero. La hinchazón se ha disuelto. El shen está tranquilo. Sientes satisfacción sin pesadez.",
      },
      {
        tipo: "visualizacion",
        titulo: "Cierre",
        texto: "Masajea el abdomen con la palma en movimiento lento horario, 9 veces. Frota las palmas, pásalas por la cara. 3 respiraciones. Abre los ojos.",
      },
    ],
  },
];

const MODULOS = [
  {
    id: "longevidad",
    titulo: "Para la Longevidad",
    subtitulo: "Primera aproximación al Tao y los 8 Brocados",
    icono: "☯",
    estaciones: ESTACIONES_LONGEVIDAD,
  },
  {
    id: "menstruacion-menopausia",
    titulo: "Menstruación, Ciclo y Menopausia",
    subtitulo: "Equilibrio del Yin, el fuego interior y el poder de los riñones",
    icono: "🌙",
    nota: "San Yin Jiao y He Gu están contraindicados durante el embarazo. En sofocos muy intensos, evita los sonidos y prioriza la respiración larga y la visualización de agua. En reglas muy abundantes, sustituye el 2º movimiento del Ciervo por la postura del Árbol estática.",
    estaciones: ESTACIONES_MENSTRUACION,
  },
  {
    id: "retencion-liquidos",
    titulo: "Retención de Líquidos",
    subtitulo: "Drenar la humedad, activar el bazo y liberar el qi del agua",
    icono: "💧",
    nota: "En edema cardíaco o renal grave, consulta médica antes de practicar. En embarazo, evita He Gu y la respiración paradójica. Con inflamación aguda de rodilla, sustituye Yin Ling Quan por Zu San Li. No retener la respiración si hay hipertensión.",
    estaciones: ESTACIONES_RETENCION,
  },
  {
    id: "falta-energia",
    titulo: "Falta de Energía y Fatiga Crónica",
    subtitulo: "Restaurar el yuan qi, tonificar los riñones y despertar el fuego del dan tian",
    icono: "🔥",
    nota: "Con fatiga extrema por enfermedad grave, empieza solo con 15-20 min (pasos 1, 5 y 6). En embarazo, evita la respiración paradójica y los movimientos enérgicos del Tigre. Con hipertensión, no retengas el aliento. No confundas fatiga funcional con anemia o hipotiroidismo: deriva al médico si persiste.",
    estaciones: ESTACIONES_ENERGIA,
  },
  {
    id: "vitalidad-sexual",
    titulo: "Vitalidad Sexual y Energía Creativa",
    subtitulo: "Nutrir el jing, despertar Ming Men y elevar el fuego vital de los riñones",
    icono: "✨",
    nota: "Con inflamación o infección genital activa, no masajear la zona sexual hasta resolución médica. En embarazo, evita la contracción sostenida del perineo y los movimientos enérgicos. Con hipertensión severa, evita la retención del aliento. Este recorrido trabaja la energía sexual desde una perspectiva taoísta de salud, no como estimulación directa.",
    estaciones: ESTACIONES_VITALIDAD,
  },
  {
    id: "ira-frustracion",
    titulo: "Ira, Enfado y Frustración",
    subtitulo: "Liberar el exceso de yang del hígado, enfriar el fuego y calmar el shen",
    icono: "🌿",
    nota: "En crisis de ira muy aguda, empieza directamente por las palmas sobre los ojos + Wu Ji, omitiendo el Tigre hasta calmarte. Con hipertensión, prioriza Wu Ji y el sonido Xu, que son siempre seguros. No confundas ira reactiva con ira crónica (posible depresión enmascarada): deriva si persiste.",
    estaciones: ESTACIONES_IRA,
  },
  {
    id: "digestiones-pesadas",
    titulo: "Digestiones Pesadas e Hinchazón",
    subtitulo: "Activar el fuego del bazo, liberar el hígado y restaurar el qi digestivo",
    icono: "🌾",
    nota: "El masaje gastro-intestinal no se hace en embarazo ni en menstruación dolorosa. Practica al menos 1 hora después de una comida grande. Con úlcera activa o inflamación grave, consulta médica antes de empezar. El Wu Ji y la respiración son siempre seguros.",
    estaciones: ESTACIONES_DIGESTION,
  },
];

export default function QigongApp() {
  const [vista, setVista] = useState("modulos"); // modulos | recorrido | sesion | paywall
  const [moduloActivo, setModuloActivo] = useState(null);
  const [activa, setActiva] = useState(null);
  const [completadas, setCompletadas] = useState({ longevidad: [0, 1] });
  const [premium, setPremium] = useState(false);
  const [avisoAceptado, setAvisoAceptado] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("progreso-qigong");
      if (guardado) {
        const datos = JSON.parse(guardado);
        if (datos.completadas) setCompletadas(datos.completadas);
        if (typeof datos.premium === "boolean") setPremium(datos.premium);
        if (typeof datos.avisoAceptado === "boolean") setAvisoAceptado(datos.avisoAceptado);
      }
    } catch (e) {
      // Sin progreso guardado todavía
    } finally {
      setCargado(true);
    }
  }, []);

  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem("progreso-qigong", JSON.stringify({ completadas, premium, avisoAceptado }));
    } catch (e) {}
  }, [completadas, premium, avisoAceptado, cargado]);

  const abrirModulo = (modulo) => {
    setModuloActivo(modulo);
    setVista("recorrido");
  };

  const abrirEstacion = (estacion) => {
    if (!estacion.free && !premium) {
      setActiva(estacion);
      setVista("paywall");
      return;
    }
    setActiva(estacion);
    setVista("sesion");
  };

  const completar = (id) => {
    setCompletadas((prev) => {
      const actuales = prev[moduloActivo.id] || [];
      if (actuales.includes(id)) return prev;
      return { ...prev, [moduloActivo.id]: [...actuales, id] };
    });
    setVista("recorrido");
  };

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: "#0F1B2D" }}>
      <div
        className="w-full max-w-sm min-h-screen relative overflow-hidden"
        style={{ background: "#F6F1E4", fontFamily: "'Georgia', serif" }}
      >
        {!cargado ? (
          <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <Taijitu />
            <p className="text-[12px]" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
              Cargando tu progreso…
            </p>
          </div>
        ) : !avisoAceptado ? (
          <AvisoMedico onAceptar={() => setAvisoAceptado(true)} />
        ) : (
          <>
            {vista === "modulos" && (
              <Modulos
                modulos={MODULOS}
                completadas={completadas}
                premium={premium}
                onAbrir={abrirModulo}
                onTogglePremium={() => setPremium((p) => !p)}
                onReiniciar={() => {
                  setCompletadas({ longevidad: [0, 1] });
                  setPremium(false);
                }}
              />
            )}
            {vista === "recorrido" && moduloActivo && (
              <Recorrido
                modulo={moduloActivo}
                completadas={completadas[moduloActivo.id] || []}
                premium={premium}
                onAbrir={abrirEstacion}
                onVolver={() => setVista("modulos")}
              />
            )}
            {vista === "sesion" && activa && (
              <Sesion estacion={activa} onCerrar={() => setVista("recorrido")} onCompletar={completar} />
            )}
            {vista === "paywall" && activa && (
              <Paywall
                estacion={activa}
                onCerrar={() => setVista("recorrido")}
                onDesbloquear={() => {
                  setPremium(true);
                  setVista("sesion");
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Aviso médico (obligatorio antes del primer uso)
// ---------------------------------------------------------------------
function AvisoMedico({ onAceptar }) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-7 py-10" style={{ background: "#F6F1E4" }}>
      <div className="flex justify-center mb-6">
        <Taijitu />
      </div>
      <h2 className="text-xl text-center mb-5" style={{ color: "#1B2A4A" }}>
        Antes de empezar
      </h2>
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col gap-3"
        style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
      >
        <div className="flex gap-2.5">
          <AlertTriangle size={18} color="#9A6B1A" className="shrink-0 mt-0.5" />
          <p className="text-[13.5px] leading-relaxed" style={{ color: "#3A3024", fontFamily: "system-ui" }}>
            El contenido de esta aplicación tiene fines exclusivamente educativos y de bienestar general.
          </p>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          El Qi Gong y las prácticas aquí descritas son de carácter <strong style={{ color: "#3A3024" }}>preventivo y complementario</strong>. No constituyen tratamiento médico, no diagnostican ninguna enfermedad y en ningún caso sustituyen la consulta, el diagnóstico o el tratamiento de un profesional sanitario.
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          Si tienes una condición médica, estás embarazada o tienes dudas sobre tu salud, consulta con tu médico antes de practicar.
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          El uso de esta aplicación es responsabilidad exclusiva de la persona que la practica. La autora no se hace responsable de un uso inadecuado del contenido.
        </p>
      </div>
      <button
        onClick={onAceptar}
        className="w-full py-3.5 rounded-full"
        style={{ background: "#1B2A4A", color: "#F6F1E4", fontFamily: "system-ui", fontWeight: 600 }}
      >
        He leído y entendido — Continuar
      </button>
    </div>
  );
}


function Modulos({ modulos, completadas, premium, onAbrir, onTogglePremium, onReiniciar }) {
  return (
    <div className="pb-12">
      <div
        className="px-6 pt-10 pb-8 relative"
        style={{ background: "linear-gradient(180deg,#16243C 0%,#1B2A4A 100%)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[15px] tracking-[0.2em] uppercase font-semibold" style={{ color: "#C9912A", fontFamily: "system-ui" }}>
              A ritmo de TAO
            </p>
            <h1 className="text-sm mt-1" style={{ color: "rgba(246,241,228,0.75)", fontFamily: "system-ui" }}>
              con Bea
            </h1>
          </div>
          <Taijitu />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onTogglePremium}
            className="text-[11px] px-3 py-1.5 rounded-full border"
            style={{
              fontFamily: "system-ui",
              borderColor: premium ? "#C9912A" : "rgba(246,241,228,0.3)",
              color: premium ? "#C9912A" : "rgba(246,241,228,0.7)",
            }}
          >
            {premium ? "✓ Cuenta Premium activa" : "Modo demo: simular Premium"}
          </button>
          <button
            onClick={onReiniciar}
            className="text-[11px] px-3 py-1.5 rounded-full border"
            style={{ fontFamily: "system-ui", borderColor: "rgba(246,241,228,0.2)", color: "rgba(246,241,228,0.5)" }}
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div className="px-6 pt-7">
        <p className="text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          Mis recorridos
        </p>
        <h2 className="text-xl mb-5" style={{ color: "#1B2A4A" }}>
          Elige tu práctica
        </h2>

        <div className="flex flex-col gap-4">
          {modulos.map((m) => {
            const hechas = (completadas[m.id] || []).length;
            const total = m.estaciones.length;
            return (
              <button
                key={m.id}
                onClick={() => onAbrir(m)}
                className="w-full text-left rounded-2xl p-5 shadow-sm flex items-start gap-4 active:scale-[0.98] transition-transform"
                style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl"
                  style={{ background: "#1B2A4A", color: "#F6F1E4" }}
                >
                  {m.icono}
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] leading-tight mb-1" style={{ color: "#1B2A4A" }}>
                    {m.titulo}
                  </h3>
                  <p className="text-[12.5px] leading-snug mb-2" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
                    {m.subtitulo}
                  </p>
                  <p className="text-[11px]" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
                    {hechas} de {total} sesiones completadas
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[10.5px] text-center mt-8 leading-snug" style={{ color: "#B0A483", fontFamily: "system-ui" }}>
          Contenido preventivo y educativo. No sustituye diagnóstico ni tratamiento médico.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Recorrido (el camino con nodos)
// ---------------------------------------------------------------------
function Recorrido({ modulo, completadas, premium, onAbrir, onVolver }) {
  const estaciones = modulo.estaciones;
  return (
    <div className="pb-12">
      <div
        className="px-6 pt-10 pb-7 relative"
        style={{ background: "linear-gradient(180deg,#16243C 0%,#1B2A4A 100%)" }}
      >
        <button onClick={onVolver} className="flex items-center gap-1 mb-4">
          <ChevronLeft size={16} color="#C9912A" />
          <span className="text-[12px]" style={{ color: "#C9912A", fontFamily: "system-ui" }}>
            Mis recorridos
          </span>
        </button>
        <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          Recorrido
        </p>
        <h2 className="text-xl" style={{ color: "#F6F1E4" }}>
          {modulo.titulo}
        </h2>
        <p className="text-[13px] mt-1" style={{ color: "rgba(246,241,228,0.7)", fontFamily: "system-ui" }}>
          {completadas.length} de {estaciones.length} sesiones completadas
        </p>
      </div>

      <div className="relative px-6 pt-9">
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width="100%"
          height={estaciones.length * 132}
          style={{ left: 0 }}
        >
          <path
            d={generarCurva(estaciones.length)}
            stroke="#D8CBA8"
            strokeWidth="3"
            fill="none"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative flex flex-col gap-[68px]" style={{ paddingTop: 8 }}>
          {estaciones.map((e, i) => {
            const hecha = completadas.includes(e.id);
            const bloqueada = !e.free && !premium;
            const lado = i % 2 === 0 ? "left" : "right";
            return (
              <div
                key={e.id}
                className="flex items-center"
                style={{ justifyContent: lado === "left" ? "flex-start" : "flex-end" }}
              >
                <button
                  onClick={() => onAbrir(e)}
                  className="flex items-center gap-3 group"
                  style={{ flexDirection: lado === "left" ? "row" : "row-reverse" }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 relative shadow-md transition-transform group-active:scale-95"
                    style={{
                      background: hecha ? "#1B2A4A" : bloqueada ? "#E4DCC6" : "#C9912A",
                      border: e.tipo === "intro" ? "2px solid #1B2A4A" : "none",
                    }}
                  >
                    {hecha ? (
                      <Check size={22} color="#F6F1E4" />
                    ) : bloqueada ? (
                      <Lock size={18} color="#9A8158" />
                    ) : e.tipo === "intro" ? (
                      <span style={{ color: "#1B2A4A", fontSize: 20 }}>{modulo.icono}</span>
                    ) : (
                      <span style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600, fontSize: 18 }}>
                        {e.icono}
                      </span>
                    )}
                  </div>
                  <div className="max-w-[155px]" style={{ textAlign: lado === "left" ? "left" : "right" }}>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
                      {e.sub} · {e.duracion}
                    </p>
                    <p className="text-[15px] leading-tight" style={{ color: "#1B2A4A" }}>
                      {e.titulo}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 mt-10 flex flex-col gap-3">
        <p className="text-[11px] text-center" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          La introducción y la 1ª práctica son gratis. El resto se desbloquea con Premium.
        </p>
        {modulo.nota && (
          <div
            className="rounded-xl p-3.5 flex gap-2.5"
            style={{ background: "#FBF3E6", border: "1px solid #E9C77B" }}
          >
            <AlertTriangle size={16} color="#9A6B1A" className="shrink-0 mt-0.5" />
            <p className="text-[11.5px] leading-snug" style={{ color: "#6B4E1A", fontFamily: "system-ui" }}>
              {modulo.nota}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function generarCurva(n) {
  let d = `M 60 20`;
  for (let i = 0; i < n; i++) {
    const y = 20 + i * 68 + 34;
    const x = i % 2 === 0 ? 60 : 280;
    d += ` Q ${i % 2 === 0 ? 280 : 60} ${y - 34}, ${x} ${y}`;
  }
  return d;
}

function Taijitu() {
  return (
    <div
      className="w-11 h-11 rounded-full relative overflow-hidden shrink-0"
      style={{ background: "#1B2A4A", border: "1.5px solid #C9912A" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, #F6F1E4 0 18%, transparent 19%), radial-gradient(circle at 50% 75%, #1B2A4A 0 18%, transparent 19%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #F6F1E4 50%, #1B2A4A 50%)",
          clipPath:
            "path('M22,1 A21,21 0 0,1 22,43 A10.5,10.5 0 0,1 22,22 A10.5,10.5 0 0,0 22,1 Z')",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Sesión
// ---------------------------------------------------------------------
function Sesion({ estacion, onCerrar, onCompletar }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F6F1E4" }}>
      <div className="px-5 pt-8 pb-5 flex items-center gap-3" style={{ background: "#1B2A4A" }}>
        <button onClick={onCerrar} className="p-1">
          <ChevronLeft color="#F6F1E4" size={22} />
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: "#C9912A", fontFamily: "system-ui" }}>
            {estacion.sub}
          </p>
          <h2 className="text-lg" style={{ color: "#F6F1E4" }}>
            {estacion.titulo}
          </h2>
        </div>
      </div>

      <div className="flex-1 px-6 py-7 flex flex-col gap-6">
        {estacion.videoId && (
          <div
            className="w-full rounded-2xl overflow-hidden shadow-md"
            style={{ aspectRatio: "9 / 16", background: "#0F1B2D" }}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${estacion.videoId}`}
              title={estacion.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        )}

        {estacion.bloques.map((b, i) => (
          <Bloque key={i} bloque={b} />
        ))}
      </div>

      <div className="px-6 pb-9">
        <button
          onClick={() => onCompletar(estacion.id)}
          className="w-full py-3.5 rounded-full flex items-center justify-center gap-2"
          style={{ background: "#C9912A", color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}
        >
          <Play size={16} fill="#1B2A4A" /> Marcar sesión como completada
        </button>
      </div>
    </div>
  );
}

const ICONOS_BLOQUE = {
  movimiento: <Sparkles size={16} />,
  respiracion: <Wind size={16} />,
  beneficios: <Flame size={16} />,
  automasaje: <Hand size={16} />,
  visualizacion: <Eye size={16} />,
};

function Bloque({ bloque }) {
  if (bloque.tipo === "texto") {
    return (
      <p className="text-[15px] leading-relaxed" style={{ color: "#3A3024" }}>
        {bloque.texto}
      </p>
    );
  }

  if (bloque.tipo === "lista") {
    return (
      <div>
        {bloque.titulo && (
          <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
            {bloque.titulo}
          </p>
        )}
        <ol className="flex flex-col gap-2">
          {bloque.items.map((p, i) => (
            <li key={i} className="text-[14px] flex gap-2" style={{ color: "#3A3024" }}>
              <span style={{ color: "#C9912A" }}>{i + 1}.</span> {p}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (bloque.tipo === "nota") {
    return (
      <div className="rounded-xl p-3.5" style={{ background: "#EFEAE0", border: "1px solid #D8CBA8" }}>
        <p className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {bloque.titulo}
        </p>
        <p className="text-[13.5px] leading-relaxed" style={{ color: "#3A3024" }}>
          {bloque.texto}
        </p>
      </div>
    );
  }

  if (bloque.tipo === "patrones") {
    return (
      <div>
        <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {bloque.titulo}
        </p>
        <div className="flex flex-col gap-2.5">
          {bloque.items.map((p, i) => (
            <div key={i} className="pl-3" style={{ borderLeft: "2px solid #C9912A" }}>
              <p className="text-[13.5px] font-semibold" style={{ color: "#1B2A4A", fontFamily: "system-ui" }}>
                {p.nombre}
              </p>
              <p className="text-[13px] leading-snug" style={{ color: "#3A3024" }}>
                {p.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bloque.tipo === "puntos") {
    return (
      <div className="flex flex-col gap-3.5">
        {bloque.items.map((p, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}>
            <p className="text-[14px] mb-2" style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}>
              {p.nombre}
            </p>
            <div className="flex gap-2 mb-1.5">
              <MapPin size={14} color="#9A8158" className="shrink-0 mt-0.5" />
              <p className="text-[12.5px] leading-snug" style={{ color: "#3A3024" }}>
                {p.localizacion}
              </p>
            </div>
            <p className="text-[12.5px] leading-snug mb-1.5" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
              <strong style={{ color: "#3A3024" }}>Indicaciones: </strong>
              {p.indicaciones}
            </p>
            <p className="text-[12.5px] leading-snug" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
              <strong style={{ color: "#3A3024" }}>Cómo masajear: </strong>
              {p.comoMasajear}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // movimiento / respiracion / beneficios / automasaje / visualizacion
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5" style={{ color: "#9A8158" }}>
        {ICONOS_BLOQUE[bloque.tipo]}
        <p className="text-[11px] uppercase tracking-wide" style={{ fontFamily: "system-ui" }}>
          {bloque.titulo}
        </p>
      </div>
      <p className="text-[14.5px] leading-relaxed" style={{ color: "#3A3024" }}>
        {bloque.texto}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Paywall
// ---------------------------------------------------------------------
function Paywall({ estacion, onCerrar, onDesbloquear }) {
  return (
    <div className="min-h-screen flex flex-col justify-end" style={{ background: "rgba(15,27,45,0.55)" }}>
      <div className="rounded-t-3xl px-7 pt-7 pb-9" style={{ background: "#F6F1E4" }}>
        <div className="flex justify-between items-start mb-5">
          <Taijitu />
          <button onClick={onCerrar}>
            <X size={20} color="#5C6B7A" />
          </button>
        </div>
        <h2 className="text-xl mb-1.5" style={{ color: "#1B2A4A" }}>
          "{estacion.titulo}" es contenido Premium
        </h2>
        <p className="text-[14px] mb-6" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          Desbloquea todos los recorridos completos, con audio guiado y seguimiento de tu progreso.
        </p>

        <div className="flex flex-col gap-2.5 mb-7">
          {["Todos los recorridos y sesiones", "Audio guiado por Bea", "Nuevos recorridos cada mes"].map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <Check size={16} color="#C9912A" />
              <span className="text-[13.5px]" style={{ color: "#3A3024", fontFamily: "system-ui" }}>
                {t}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onDesbloquear}
          className="w-full py-3.5 rounded-full mb-3"
          style={{ background: "#1B2A4A", color: "#F6F1E4", fontFamily: "system-ui", fontWeight: 600 }}
        >
          Hazte Premium — 6,99 € / mes
        </button>
        <button onClick={onCerrar} className="w-full text-center text-[13px] py-1" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          Seguir con el plan gratuito
        </button>
      </div>
    </div>
  );
}
