import { useState, useEffect } from "react";
import {
  Lock, Check, Play, X, Wind, Flame, ChevronLeft, Sparkles,
  Hand, Eye, AlertTriangle, MapPin, Share2,
} from "lucide-react";

// Pega aquí tu enlace de pago de Stripe (Payment Link), ej:
// "https://buy.stripe.com/aBc1234xyz"
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/dRm3cvd1IeEUgw22Wib3q00";
// Recorrido individual (4,99€, pago único)
const STRIPE_RECORRIDO_LINK = "https://buy.stripe.com/7sY8wPe5M2WccfM1Seb3q01";
// Acceso completo (19,99€, pago único)
const STRIPE_FULLACCESS_LINK = "https://buy.stripe.com/8x24gzgdU68ocfM0Oab3q02";
// Recorridos incluidos en el "Acceso completo" — es una lista fija, no se
// actualiza cuando se añadan recorridos nuevos (así se cumple la promesa de
// "acceso a los recorridos de hoy", tal como se explica en la app).
const FULL_ACCESS_MODULE_IDS = [
  "fundamentos",
  "longevidad",
  "falta-energia",
  "vitalidad-sexual",
  "retencion-liquidos",
  "digestiones-pesadas",
  "menstruacion-menopausia",
  "ira-frustracion",
];
// Pega aquí el enlace del Portal del Cliente de Stripe (Settings → Billing
// → Customer Portal → "Share this link"), para que quien ya es Premium
// pueda gestionar o cancelar su suscripción ella misma.
const STRIPE_PORTAL_LINK = "https://billing.stripe.com/p/login/dRm3cvd1IeEUgw22Wib3q00";

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
    videoId: "4EdtVPmsgVo",
    audioArchivo: "longevidad-intro.mp3",
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
    videoId: "dv8ZhgLz1RI",
    audioArchivo: "brocado1-sostener-cielo-es.mp3",
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
    sub: "2º Brocado · El arquero",
    free: true,
    icono: "2",
    duracion: "14 min",
    videoId: "QUIb5vLjMEg",
    audioArchivo: "brocado2-tensar-arco-es.mp3",
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
    free: true,
    icono: "3",
    duracion: "11 min",
    videoId: "Q7nritnHm7Q",
    audioArchivo: "brocado3-separar-cielo-tierra-es.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Una mano empuja hacia el cielo, la otra hacia la tierra, alternando." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Inhala al extender, exhala al cambiar de lado. 6 repeticiones." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Regula el Qi de Bazo y Estómago, mejora la digestión." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Puños y mirada feroz",
    sub: "4º Brocado",
    free: true,
    icono: "4",
    duracion: "10 min",
    videoId: "K3WKrcM2OKI",
    audioArchivo: "brocado4-punos-mirada-feroz-es.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Postura de jinete baja, golpes de puño alternos hacia adelante con mirada intensa." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Exhala con fuerza en cada golpe." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Activa el Qi e Hígado, desarrolla fuerza y determinación." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Mirar hacia atrás",
    sub: "5º Brocado",
    free: false,
    icono: "5",
    duracion: "9 min",
    videoId: "z52IJbuA4j4",
    audioArchivo: "brocado5-mirar-atras-es.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Gira suavemente cabeza y torso para mirar atrás, brazos relajados a los lados." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Inhala al girar, exhala al volver al centro." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Libera tensión cervical, ayuda a disipar el calor interno y el estrés." },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Sacudir la cabeza y mover la cola",
    sub: "6º Brocado",
    free: false,
    icono: "6",
    duracion: "9 min",
    videoId: "Umr0nhY-FL4",
    audioArchivo: "brocado6-sacudir-cabeza-es.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Postura de jinete amplia, inclinación lateral del torso con la cabeza." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Exhala con un leve sonido 'ja' al inclinar." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Drena el calor del Corazón, calma la mente." },
    ],
  },
  {
    id: 7,
    tipo: "practica",
    titulo: "Tocarse los pies",
    sub: "7º Brocado",
    free: false,
    icono: "7",
    duracion: "13 min",
    videoId: "Yso892fzH1I",
    audioArchivo: "brocado7-tocarse-pies-es.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Movimiento", texto: "Flexión de tronco hacia adelante deslizando las manos por la espalda baja y piernas." },
      { tipo: "respiracion", titulo: "Respiración", texto: "Exhala al bajar, inhala al subir." },
      { tipo: "beneficios", titulo: "Beneficios", texto: "Fortalece riñones y zona lumbar, tonifica el Jing." },
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
    videoId: "75L-hqudJc8",
    audioArchivo: "brocado8-rebotar-talones-es.mp3",
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
    audioArchivo: "ciclos-femeninos-intro.mp3",
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
    audioArchivo: "ventanas-rostro-ciclos-femeninos-es.mp3",
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
    videoId: "x9NIq1aNs30",
    audioArchivo: "masaje-dedos-ciclos-femeninos-es.mp3",
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
    videoId: "8d85gMOj2sw",
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
    titulo: "Puntos de acupresión",
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
            imagen: "punto-sanyinjiao-6ra.jpg",
          },
          {
            nombre: "Ran Gu (R2) · Secundario",
            localizacion: "Cara interna del pie, en el hueso navicular.",
            indicaciones: "Sofocos menopáusicos, calores nocturnos, sequedad.",
            comoMasajear: "Presiones delicadas, ambos pies a la vez si es posible. Ideal antes de dormir.",
            imagen: "punto-rangu-r2.jpg",
          },
          {
            nombre: "Qi Men (14F) · Complementario",
            localizacion: "Justo bajo los pezones, 6º espacio intercostal.",
            indicaciones: "Función del hígado, síndrome premenstrual, irritabilidad.",
            comoMasajear: "Presión enérgica, rotar en un sentido y luego en el otro.",
            imagen: "punto-qimen-14f.jpg",
          },
          {
            nombre: "Ming Men (4VG) · Apoyo",
            localizacion: "Línea media de la espalda, entre la 2ª y 3ª lumbar.",
            indicaciones: "Vitalidad profunda, menopausia, frío pélvico.",
            comoMasajear: "Palmas calientes apoyadas sobre el punto, masaje con los nudillos en círculos.",
            imagen: "punto-mingmen-4vg.jpg",
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
    imagen: "arbol-postura.jpg",
    audioArchivo: "arbol-ciclos-femeninos-es.mp3",
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
    audioArchivo: "retencion-liquidos-intro.mp3",
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
    audioArchivo: "ventanas-rostro-retencion-liquidos-es.mp3",
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
    videoId: "x9NIq1aNs30",
    audioArchivo: "masaje-dedos-retencion-liquidos-es.mp3",
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
    videoId: "-aSpXl294W8",
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
    titulo: "Puntos de acupresión",
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
            imagen: "punto-yinlingquan-9ra.jpg",
          },
          {
            nombre: "Zu San Li (36E) · Secundario",
            localizacion: "4 dedos bajo la rótula, hacia fuera de la tibia.",
            indicaciones: "Tonifica el qi del bazo y estómago. Activa el metabolismo. El punto más tonificante del cuerpo.",
            comoMasajear: "Golpeteos suaves con el puño cerrado o presión con el pulgar, 60-90 seg. Muy eficaz de pie.",
            imagen: "punto-zusanli-36e.jpg",
          },
          {
            nombre: "Shui Fen (9VC) · Complementario",
            localizacion: "1 dedo por encima del ombligo, línea media del abdomen.",
            indicaciones: "Su nombre lo dice: distribuye y regula el agua en el organismo. Retención, edemas, función renal.",
            comoMasajear: "Palma caliente sobre el punto, 9 rotaciones lentas en cada sentido, visualizando el agua drenando.",
            imagen: "punto-shuifen-9vc.jpg",
          },
          {
            nombre: "Masaje de Riñones · Apoyo",
            localizacion: "Ming Men y zona lumbar.",
            indicaciones: "Activa el yang renal: el fuego que transforma el agua en vapor y permite el drenaje.",
            comoMasajear: "Frota las palmas hasta calentarlas y masajea la zona lumbar 90 veces con cada mano (técnica taoísta).",
            imagen: "punto-mingmen-4vg.jpg",
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
    imagen: "arbol-postura.jpg",
    audioArchivo: "arbol-retencion-liquidos-es.mp3",
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
    audioArchivo: "energia-intro.mp3",
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
    audioArchivo: "ventanas-rostro-energia-es.mp3",
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
    videoId: "x9NIq1aNs30",
    audioArchivo: "masaje-dedos-energia-es.mp3",
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
    videoId: "yxfyGSNwHrM",
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
    titulo: "Puntos de acupresión",
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
            imagen: "punto-qihai-6vc.jpg",
          },
          {
            nombre: "Guan Yuan (4VC) · Secundario",
            localizacion: "3 dedos bajo el ombligo.",
            indicaciones: "Tonifica el yuan qi y consolida el yin. Enraizamiento profundo. Fatiga crónica profunda.",
            comoMasajear: "Igual que Qi Hai. Puede masajearse junto con él con la palma completa.",
            imagen: "punto-guanyuan-4vc.jpg",
          },
          {
            nombre: "Tai Xi (R3) · Complementario",
            localizacion: "Depresión entre el maléolo interno y el tendón de Aquiles.",
            indicaciones: "Nutre el yang de los riñones, favorece la fertilidad, actúa sobre el cerebro. Fatiga + vértigos + memoria débil.",
            comoMasajear: "Presión delicada del pulgar, ambos lados.",
            imagen: "punto-taixi-r3.jpg",
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
    imagen: "arbol-postura.jpg",
    audioArchivo: "arbol-energia-es.mp3",
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
    audioArchivo: "vitalidad-sexual-intro.mp3",
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
    audioArchivo: "ventanas-rostro-energia-sexual-es.mp3",
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
    videoId: "x9NIq1aNs30",
    audioArchivo: "masaje-dedos-vitalidad-sexual-es.mp3",
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
    videoId: "yxfyGSNwHrM",
    audioArchivo: "circulacion-celestial-es.mp3",
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
    titulo: "Puntos de acupresión",
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
            imagen: "punto-mingmen-4vg.jpg",
          },
          {
            nombre: "Guan Yuan (4VC) · Secundario",
            localizacion: "3 dedos bajo el ombligo, línea media.",
            indicaciones: "Tonifica el yuan qi, consolida el yin. Fertilidad, libido, energía de base.",
            comoMasajear: "9 rotaciones horarias. Visualiza calor dorado acumulándose.",
            imagen: "punto-guanyuan-4vc.jpg",
          },
          {
            nombre: "Tai Xi (R3) · Complementario",
            localizacion: "Entre el maléolo interno y el tendón de Aquiles.",
            indicaciones: "Nutre el yang renal, favorece la fertilidad, tonifica el sistema global. Esencial para la frialdad sexual.",
            comoMasajear: "Presión delicada del pulgar, ambos pies.",
            imagen: "punto-taixi-r3.jpg",
          },
          {
            nombre: "Hui Yin (1VC) · Base",
            localizacion: "Centro del suelo pélvico, entre el ano y los genitales.",
            indicaciones: "Esencial para el equilibrio genital y urinario, femenino y masculino. No se masajea directamente.",
            imagen: "punto-huiyin-1vc.jpg",
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
    imagen: "arbol-postura.jpg",
    audioArchivo: "arbol-vitalidad-sexual-es.mp3",
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
    audioArchivo: "ira-frustracion-intro.mp3",
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
    audioArchivo: "ventanas-rostro-ira-es.mp3",
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
    videoId: "x9NIq1aNs30",
    audioArchivo: "masaje-dedos-ira-es.mp3",
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
    videoId: "8d85gMOj2sw",
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
    titulo: "Puntos de acupresión",
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
            imagen: "punto-taichong-3f.jpg",
          },
          {
            nombre: "Yong Quan (1R) · Secundario",
            localizacion: "Centro de la planta del pie, primer tercio desde los dedos.",
            indicaciones: "Ancla el yang que sube. Apacigua el espíritu y lleva las energías negativas hacia la tierra.",
            comoMasajear: "Presiones firmes con el pulgar, ambos pies. Caminar descalzo sobre hierba o tierra también lo activa.",
            imagen: "punto-yongquan-1r.jpg",
          },
          {
            nombre: "Qi Men (14F) · Complementario",
            localizacion: "Bajo los pezones, 6º espacio intercostal.",
            indicaciones: "Regula todo el flujo del meridiano del hígado. Libera el estancamiento en el tórax, sensación de nudo en el pecho, ira reprimida.",
            comoMasajear: "Presión enérgica, rotar en ambos sentidos. Luego pasar los cantos de las manos del centro hacia los flancos.",
            imagen: "punto-qimen-14f.jpg",
          },
          {
            nombre: "Qu Quan (8F) · Apoyo",
            localizacion: "Cara interna de la rodilla, entre dos tendones al flexionar.",
            indicaciones: "Nutre la sangre y el hígado. Ligado a las perturbaciones de tipo ira y frustración.",
            comoMasajear: "Rotaciones suaves o golpeteos con la palma ligeramente hueca, sentada con las piernas estiradas.",
            imagen: "punto-ququan-8f.jpg",
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
    imagen: "arbol-postura.jpg",
    audioArchivo: "arbol-ira-es.mp3",
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
    audioArchivo: "digestiones-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Las digestiones pesadas, los gases, la hinchazón abdominal y el colon irritable combinan dos patrones: vacío de qi del bazo (el fuego digestivo está débil) e invasión del hígado (el exceso de qi del hígado presiona el estómago y el bazo). Los síntomas empeoran con el estrés y las comidas copiosas o frías. El objetivo: calentar y tonificar el bazo, liberar el hígado del estómago y favorecer el movimiento natural del intestino (el peristaltismo), acompañando ese movimiento físico con el del Qi digestivo.",
      },
      {
        tipo: "patrones",
        titulo: "Patrones frecuentes",
        items: [
          { nombre: "Hinchazón postprandial / gases", texto: "Vacío de qi del bazo + humedad. El bazo no transforma. Objetivo: calentar el centro, sonido Hu." },
          { nombre: "Colon irritable / digestión nerviosa", texto: "Invasión del hígado sobre el estómago. Objetivo: calmar el hígado con Wu Ji + Xu." },
          { nombre: "Digestión muy lenta / estreñimiento funcional", texto: "Vacío de yang del bazo, frío en el centro. Objetivo: calentar fuerte con masaje y 3er Brocado, explicado en la práctica para la Longevidad." },
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
    audioArchivo: "ventanas-rostro-digestiones-es.mp3",
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
    videoId: "x9NIq1aNs30",
    audioArchivo: "masaje-gastro-digestiones-es.mp3",
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
    videoId: "-aSpXl294W8",
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
    titulo: "Puntos de acupresión",
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
            imagen: "punto-zusanli-36e.jpg",
          },
          {
            nombre: "Zhong Wan (12VC) · Secundario",
            localizacion: "Mitad exacta entre el ombligo y el esternón.",
            indicaciones: "El punto central del estómago. Hinchazón, náuseas, digestión lenta, ardores.",
            comoMasajear: "Palma superpuesta: 36 rotaciones antihorarias (hinchazón) u horarias (vaciado lento). Lento y consciente.",
            imagen: "punto-zhongwan-12vc.jpg",
          },
          {
            nombre: "Shen Que (8VC) · Complementario",
            localizacion: "Exactamente el ombligo.",
            indicaciones: "Activa el calor, aporta yang a riñones y bazo, regula intestinos y estómago.",
            comoMasajear: "Palma caliente sobre el ombligo, sin frotar, 2-3 minutos solo calor. Luego 9 rotaciones horarias.",
            imagen: "punto-shenque-8vc.jpg",
          },
          {
            nombre: "Di Ji (8Ra) · Apoyo",
            localizacion: "Cara interna de la pierna, a un tercio entre rodilla y tobillo.",
            indicaciones: "Elimina la humedad y regula el bazo. Digestión lenta con pesadez y gases.",
            comoMasajear: "Rotaciones suaves del pulgar, ambas piernas. Sensible: empezar con suavidad.",
            imagen: "punto-diji-8ra.jpg",
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
    imagen: "arbol-postura.jpg",
    audioArchivo: "arbol-digestiones-es.mp3",
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

// =====================================================================
// MÓDULO 1 (FR) — Longévité
// =====================================================================
const ESTACIONES_LONGEVIDAD_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Qu'est-ce que le Tao ?",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "8 min",
    videoId: "4EdtVPmsgVo",
    audioArchivo: "longevidad-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Le Tao ne s'explique pas, il s'expérimente. Avant de faire bouger le corps, il faut comprendre le principe : tout circule entre deux pôles qui ont besoin l'un de l'autre — le Yin et le Yang.",
      },
      {
        tipo: "lista",
        titulo: "Pratique guidée",
        items: [
          "Assieds-toi le dos droit, sans tension.",
          "Ferme les yeux et porte ton attention sur le Dan Tian (3 doigts sous le nombril).",
          "Respire 9 fois, en comptant chaque expiration.",
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Soutenir le ciel",
    sub: "1er Brocart",
    free: true,
    icono: "1",
    duracion: "12 min",
    videoId: "dv8ZhgLz1RI",
    audioArchivo: "brocado1-sostener-cielo-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Entrelace les doigts devant le Dan Tian et élève les bras au-dessus de la tête, paumes vers le ciel, en étirant toute la colonne vertébrale." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Inspire en montant les bras, expire en les descendant. 6 répétitions." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Stimule le Triple Réchauffeur, améliore l'oxygénation et libère les tensions des épaules et de la colonne." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Tendre l'arc",
    sub: "2e Brocart · L'archer",
    free: true,
    icono: "2",
    duracion: "14 min",
    videoId: "QUIb5vLjMEg",
    audioArchivo: "brocado2-tensar-arco-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Position du cavalier. Simule le geste de tendre un arc de chaque côté, en alternant les bras." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Inspire en ouvrant l'arc, expire en le ramenant. 6 répétitions par côté." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Renforce les jambes et le centre du corps, ouvre la poitrine, tonifie le méridien du Poumon." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Séparer le ciel et la terre",
    sub: "3e Brocart",
    free: true,
    icono: "3",
    duracion: "11 min",
    videoId: "Q7nritnHm7Q",
    audioArchivo: "brocado3-separar-cielo-tierra-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Une main pousse vers le ciel, l'autre vers la terre, en alternance." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Inspire en étendant les bras, expire en changeant de côté. 6 répétitions." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Régule le Qi de la Rate et de l'Estomac, améliore la digestion." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Poings et regard féroce",
    sub: "4e Brocart",
    free: true,
    icono: "4",
    duracion: "10 min",
    videoId: "K3WKrcM2OKI",
    audioArchivo: "brocado4-punos-mirada-feroz-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Position du cavalier basse, coups de poing alternés vers l'avant avec un regard intense." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Expire avec force à chaque coup." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Active le Qi du Foie, développe la force et la détermination." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Regarder en arrière",
    sub: "5e Brocart",
    free: false,
    icono: "5",
    duracion: "9 min",
    videoId: "z52IJbuA4j4",
    audioArchivo: "brocado5-mirar-atras-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Tourne doucement la tête et le buste pour regarder derrière toi, les bras relâchés le long du corps." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Inspire en tournant, expire en revenant au centre." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Libère les tensions cervicales, aide à dissiper la chaleur interne et le stress." },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Secouer la tête et remuer la queue",
    sub: "6e Brocart",
    free: false,
    icono: "6",
    duracion: "9 min",
    videoId: "Umr0nhY-FL4",
    audioArchivo: "brocado6-sacudir-cabeza-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Position du cavalier large, inclinaison latérale du buste avec la tête." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Expire avec un léger son « ha » en t'inclinant." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Draine la chaleur du Cœur, apaise l'esprit." },
    ],
  },
  {
    id: 7,
    tipo: "practica",
    titulo: "Toucher ses pieds",
    sub: "7e Brocart",
    free: false,
    icono: "7",
    duracion: "13 min",
    videoId: "Yso892fzH1I",
    audioArchivo: "brocado7-tocarse-pies-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Flexion du buste vers l'avant en faisant glisser les mains le long du bas du dos et des jambes." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Expire en descendant, inspire en remontant." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Renforce les reins et le bas du dos, tonifie le Jing." },
    ],
  },
  {
    id: 8,
    tipo: "practica",
    titulo: "Rebondir sur les talons",
    sub: "8e Brocart · Clôture",
    free: false,
    icono: "8",
    duracion: "7 min",
    videoId: "75L-hqudJc8",
    audioArchivo: "brocado8-rebotar-talones-fr.mp3",
    bloques: [
      { tipo: "movimiento", titulo: "Mouvement", texto: "Debout, talons joints, légère élévation puis retombée avec un petit rebond." },
      { tipo: "respiracion", titulo: "Respiration", texto: "Respiration libre et naturelle, 7 répétitions." },
      { tipo: "beneficios", titulo: "Bienfaits", texto: "Harmonise tout le Qi mobilisé pendant la séance, clôture la pratique." },
    ],
  },
];

// =====================================================================
// MÓDULO (FR) — Manque d'Énergie et Fatigue
// =====================================================================
const ESTACIONES_ENERGIA_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Compréhension énergétique",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "energia-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La fatigue chronique, en MTC, est toujours un vide : de qi, de yang, de jing ou de sang. Les reins sont la « banque de l'énergie vitale » (yuan qi) : quand ils sont épuisés, tout l'organisme en souffre. Le cœur (shen) et les poumons (qi de la respiration) sont les deux autres piliers. On observe souvent une combinaison d'un vide de yang rénal (froid, lourdeur, manque de motivation) et d'un vide de qi de la rate (digestion lente, pensées circulaires).",
      },
      {
        tipo: "patrones",
        titulo: "Schémas fréquents",
        items: [
          { nombre: "Fatigue matinale / réveil difficile", texto: "Vide de yang rénal, le yang ne s'élève pas. Objectif : réchauffer Ming Men, activer le Cerf." },
          { nombre: "Fatigue de l'après-midi / coup de barre vers 17h", texto: "Vide de qi de la rate. Objectif : tonifier le dan tian moyen." },
          { nombre: "Fatigue + démotivation", texto: "Vide de jing rénal + shen éteint. Objectif : nourrir le jing, réveiller le shen avec le Tigre." },
          { nombre: "Fatigue + palpitations / anxiété", texto: "Vide de qi du cœur. Objectif : tonifier le cœur avec le son He." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Fenêtres du visage",
    sub: "Étape 1 · Automassage énergisant",
    free: true,
    icono: "1",
    duracion: "10 min",
    videoId: "",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Où mettre l'accent",
        texto: "Idéal au réveil. L'accent est mis sur les oreilles (reins, réservoir du yuan qi), le front (shen/cœur) et les yeux (foie).",
      },
      {
        tipo: "lista",
        titulo: "Séquence énergisante (10 min)",
        items: [
          "Cuir chevelu complet : peigne avec les 10 doigts, pression forte du front vers la nuque, 9 fois. 3 min.",
          "Oreilles → Reins : masse avec énergie tout le pavillon auriculaire, tire le lobe 9 fois. 2 min.",
          "Yeux → Foie : couvre avec les paumes chaudes, puis masse le contour avec le pouce. 2 min.",
          "Dents → Reins : entrechoque les dents 9-18 fois avec fermeté. 30 sec.",
          "Visage complet → Cœur : paumes chaudes, frotter de bas en haut. 1 min.",
        ],
      },
      {
        tipo: "nota",
        titulo: "À ajouter : le Tambour Céleste",
        texto: "Recouvre les oreilles avec les paumes, doigts sur l'occiput. L'index frappe sur le majeur en direction du crâne, 9 coups. Le son doit résonner dans la tête. Clarifie l'esprit et combat la fatigue.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Massage des doigts",
    sub: "Étape 2 · Automassage énergisant",
    free: false,
    icono: "2",
    duracion: "6 min",
    videoId: "x9NIq1aNs30",
    bloques: [
      {
        tipo: "automasaje",
        titulo: "Objectif énergisant",
        texto: "Activer les méridiens yang de la main (Gros Intestin, Triple Réchauffeur, Intestin Grêle) pour apporter chaleur et vitalité à tout le corps.",
      },
      {
        tipo: "lista",
        titulo: "Séquence énergisante (6 min)",
        items: [
          "Frotte les paumes avec une friction rapide et vigoureuse jusqu'à sentir une forte chaleur.",
          "Avec les pouces, presse et fais glisser de la base à la pointe de chaque doigt, comme pour presser un fruit.",
          "Tapote doucement les jointures d'une main contre la paume de l'autre.",
          "Ferme le pouce à l'intérieur du poing (position de pouvoir), maintiens 30 sec par main.",
          "Frotte le dos d'une main sur la paume de l'autre, rapidement, 18 fois par côté.",
        ],
      },
      {
        tipo: "nota",
        titulo: "Technique complémentaire",
        texto: "Masse le cuir chevelu avec les jointures, en cercles fermes. Renforce le yang et la circulation cérébrale, prévient les vertiges et la fatigue chronique.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Qi Gong des Reins et sons",
    sub: "Étape 3 · Respiration",
    free: false,
    icono: "3",
    duracion: "12 min",
    videoId: "yxfyGSNwHrM",
    bloques: [
      { tipo: "respiracion", titulo: "A · Qi Gong des Reins", texto: "Debout, genoux légèrement fléchis, langue au palais. Inspire en amenant les paumes vers la poitrine tout en visualisant le qi de la terre montant par Yong Quan vers les reins. Ouvre les bras latéralement, paumes vers les reins, 10 sec. Monte les paumes sous les aisselles, paumes vers le ciel. Tourne les paumes vers le sol et redescends les bras. Répète 9 fois. Le plus spécifique pour la fatigue — idéal 2 fois par jour." },
      { tipo: "respiracion", titulo: "B · Son He — pour le cœur et le shen", texto: "Inspire. En expirant, émets « He » longuement tandis que les bras montent lentement au-dessus de la tête, paumes vers le ciel. Visualise la couleur rouge éclatante rayonnant depuis le cœur. 6 répétitions. Pour la fatigue avec palpitations ou shen éteint." },
      { tipo: "respiracion", titulo: "C · Son Chui — pour les reins et le yang", texto: "Émets « Chui » en expirant tandis que les mains descendent vers les reins. À la fin de chaque répétition, frotte les paumes sur Ming Men. 6 répétitions." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Le Tigre",
    sub: "Étape 4 · Mouvement",
    free: false,
    icono: "4",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "L'énergie du Tigre", texto: "Animal du bois et du feu, de la force et de la décision. Active la circulation sanguine, réveille le yang et combat l'inertie de la fatigue chronique." },
      { tipo: "movimiento", titulo: "Mouvement 1 — Le Tigre soulève sa proie", texto: "Les mains-griffes pendent devant toi. En inspirant, les griffes montent lentement comme pour soulever une proie, jusqu'au-dessus de la tête. En expirant, elles descendent devant le corps. Le mouvement le plus important pour activer la circulation sanguine. Répète 9 fois." },
      { tipo: "movimiento", titulo: "Mouvement 2 — Le saut du Tigre", texto: "Le tigre s'incline vers l'avant en enroulant la colonne vertèbre par vertèbre. Les griffes frôlent le sol. En remontant, déploie la colonne comme un ressort interne. Répète 9 fois, très lentement en cas de vertiges." },
      { tipo: "nota", titulo: "Pour fatigue sévère", texto: "Pratique uniquement le premier mouvement, assis ou debout, très lentement. Commence par 3 répétitions et augmente progressivement — c'est le plus important pour activer la circulation." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Points d'acupression",
    sub: "Étape 5 · Automassage des points",
    free: false,
    icono: "5",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          { nombre: "Qi Hai (6VC) · Principal — La Mer de l'Énergie", localizacion: "1,5 doigt sous le nombril, ligne médiane de l'abdomen.", indicaciones: "Le point le plus tonifiant du corps pour le yang. Fatigue, faiblesse, manque de motivation, froid interne.", comoMasajear: "Paumes superposées, 9 rotations dans le sens horaire. Visualise une chaleur dorée rayonnante. En inspirant, les paumes appuient doucement ; en expirant, elles se relâchent.", imagen: "punto-qihai-6vc.jpg" },
          { nombre: "Guan Yuan (4VC) · Secondaire", localizacion: "3 doigts sous le nombril.", indicaciones: "Tonifie le yuan qi et consolide le yin. Ancrage profond. Fatigue chronique profonde.", comoMasajear: "Comme pour Qi Hai. Peut être massé en même temps, avec toute la paume.", imagen: "punto-guanyuan-4vc.jpg" },
          { nombre: "Tai Xi (R3) · Complémentaire", localizacion: "Creux entre la malléole interne et le tendon d'Achille.", indicaciones: "Nourrit le yang des reins, favorise la fertilité, agit sur le cerveau. Fatigue + vertiges + mémoire faible.", comoMasajear: "Pression délicate du pouce, des deux côtés.", imagen: "punto-taixi-r3.jpg" },
        ],
      },
      { tipo: "nota", titulo: "Massage essentiel — Les trois dan tian", texto: "Protocole complet de tonification : 6 rotations dans chaque sens sur le dan tian inférieur (vital et sexuel), le moyen (entre les tétons, émotionnel) et le supérieur (sommet du crâne, mental). Termine en inspirant en contractant le périnée et en serrant les dents, puis en expirant en relâchant tout." },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualisation de l'Arbre",
    sub: "Étape 6 · Clôture",
    free: false,
    icono: "6",
    duracion: "8-12 min",
    videoId: "",
    imagen: "arbol-postura.jpg",
    audioArchivo: "",
    bloques: [
      { tipo: "visualizacion", titulo: "La posture", texto: "Debout (ou assis si la fatigue est sévère). Bras en ovale. Langue au palais. Yeux mi-clos. Concentre 70% de ton attention sur le dan tian inférieur." },
      { tipo: "visualizacion", titulo: "Phase 1 — La racine d'énergie (2 min)", texto: "Le dan tian inférieur est une sphère de lumière dorée et chaude. En inspirant, elle se remplit de lumière. En expirant, cette lumière s'étend dans tout le corps comme des ondes de chaleur. Ressens simplement la chaleur." },
      { tipo: "visualizacion", titulo: "Phase 2 — Le feu de Ming Men (3-5 min)", texto: "Un second soleil derrière le dan tian, à Ming Men. En inspirant il se réchauffe ; en expirant ce feu remonte la colonne jusqu'au cœur. Le shen s'éveille : une légère vitalité, un petit enthousiasme." },
      { tipo: "visualizacion", titulo: "Phase 3 — Le shen s'éveille (2-3 min)", texto: "Depuis le cœur, la lumière chaude monte au dan tian supérieur (entre les sourcils). Le shen est éveillé et présent : clair et tranquille. Visualise un violet doux." },
      { tipo: "visualizacion", titulo: "Clôture", texto: "Paumes sur le dan tian inférieur. 9 rotations dans le sens horaire. Frotte les paumes avec force, passe-les sur le visage. 3 respirations profondes. Bouge doucement les doigts et les pieds. Ouvre les yeux." },
    ],
  },
];

// =====================================================================
// MÓDULO (FR) — Vitalité Sexuelle et Énergie Créative
// =====================================================================
const ESTACIONES_VITALIDAD_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Compréhension énergétique",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "vitalidad-sexual-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La vitalité sexuelle est l'expression directe du jing : l'essence vitale stockée dans les reins. Quand le jing est abondant, l'énergie sexuelle, créative et intellectuelle s'épanouit. Quand il s'épuise, tout le système vital s'affaiblit. L'objectif n'est pas de stimuler superficiellement : il s'agit de nourrir le jing en profondeur, d'activer le feu de Ming Men et de faire circuler cette énergie dans la petite circulation céleste (Ren Mai / Du Mai).",
      },
      {
        tipo: "patrones",
        titulo: "Schémas fréquents",
        items: [
          { nombre: "Désir faible / frigidité", texto: "Vide de yang rénal ou de jing. Le feu de Ming Men est éteint. Objectif : réchauffer, tonifier." },
          { nombre: "Manque de contrôle", texto: "Vide de yin rénal. Le yang n'est pas ancré. Objectif : nourrir le yin, consolider le jing." },
          { nombre: "Dysfonction érectile", texto: "Vide de yang rénal + épuisement du jing. Objectif : massage des reins + dan tian + Ming Men quotidien." },
          { nombre: "Fertilité réduite", texto: "Vide de jing dans les deux reins. Objectif : nourrir le jing, pratiquer le Cerf et la petite circulation." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Fenêtres du visage",
    sub: "Étape 1 · Automassage",
    free: true,
    icono: "1",
    duracion: "10 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Où mettre l'accent", texto: "L'accent est mis sur les oreilles (reins/jing), les yeux (foie/sang) et une technique spéciale : le Dragon dans l'Étang (la salive comme véhicule du qi)." },
      {
        tipo: "lista",
        titulo: "Séquence (10 min)",
        items: [
          "Oreilles → Reins/Jing : masse le pavillon auriculaire avec fermeté, tire le lobe 9 fois, frotte le tragus. 3 min.",
          "Yeux → Foie/Sang : paumes chaudes sur les yeux fermés. 2 min.",
          "Dents → Reins : entrechoque les dents 18 fois.",
          "Visage → Cœur : frotter tout le visage — l'eau des reins doit rafraîchir le feu du cœur.",
        ],
      },
      { tipo: "nota", titulo: "Technique spéciale — Le Dragon dans l'Étang", texto: "Langue sur le palais. Frappe la langue contre le palais 9 fois et entrechoque les incisives 9 fois en même temps. Laisse la salive s'accumuler. Avale en 3 déglutitions, en sentant sa descente jusqu'au dan tian inférieur." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Massage des doigts",
    sub: "Étape 2 · Automassage",
    free: false,
    icono: "2",
    duracion: "7 min",
    videoId: "x9NIq1aNs30",
    bloques: [
      { tipo: "automasaje", titulo: "Pourquoi ça fonctionne", texto: "Active les méridiens du Rein, du Foie et le Vaisseau Conception. Le point Lao Gong (8MC) émet le qi le plus puissant du corps." },
      {
        tipo: "lista",
        titulo: "Séquence (7 min)",
        items: [
          "Frotte les paumes avec une friction forte jusqu'à sentir une chaleur vive dans Lao Gong.",
          "Masse chaque doigt. Si tu es assise, tu peux aussi masser les orteils en même temps.",
          "Ferme les pouces à l'intérieur des poings (active Lao Gong). Maintiens 30 secondes.",
          "Frotte les paumes et amène-les sur le bas du dos (reins), en sentant la chaleur pénétrer, 30 sec.",
          "Frotte à nouveau et amène les paumes sur le bas-ventre (dan tian inférieur). Chaleur 30 sec.",
        ],
      },
      { tipo: "nota", titulo: "Technique du massage de la zone sexuelle", texto: "9 rotations dans le sens horaire avec la paume sur le dan tian inférieur. Arrête quand une chaleur douce apparaît. Recommandé pour l'impuissance, la frigidité et la fertilité." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Petite Circulation Céleste",
    sub: "Étape 3 · Respiration",
    free: false,
    icono: "3",
    duracion: "12 min",
    videoId: "yxfyGSNwHrM",
    bloques: [
      { tipo: "respiracion", titulo: "A · La Petite Circulation Céleste", texto: "L'exercice le plus important de ce parcours : il transforme le jing en qi et le fait circuler dans tout le corps. Debout en Wu Ji, périnée légèrement contracté, langue au palais. Visualise une boule d'énergie au dan tian. En inspirant, elle descend au périnée. En expirant lentement, elle monte le long de la colonne (Du Mai) vers Bai Hui. En inspirant à nouveau, elle descend le long de l'avant du corps (Ren Mai) jusqu'au dan tian. Répète 3 cercles complets." },
      { tipo: "respiracion", titulo: "B · Son Chui — pour les reins", texto: "6 répétitions lentes. À la fin de chacune, frotte les paumes et pose-les sur Ming Men. Visualise le bleu-noir de la nuit pénétrant dans les reins, nourrissant le jing." },
      { tipo: "respiracion", titulo: "C · Respiration abdominale avec contraction du périnée", texto: "En inspirant, contracte doucement le périnée et les fessiers (comme pour retenir l'urine). En expirant, relâche tout. Cette contraction subtile ancre le jing dans le dan tian. 9 respirations lentes." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Le Cerf et le Tigre",
    sub: "Étape 4 · Mouvement",
    free: false,
    icono: "4",
    duracion: "20 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Le Cerf — animal principal", texto: "Les deux mêmes mouvements que dans le parcours Cycles Féminins. Mouvement 1 (torsion latérale) : active les reins et masse le Du Mai. Mouvement 2 (le cerf qui se redresse) : active le sacrum et Ming Men. En te redressant, contracte doucement le périnée et visualise l'énergie remontant la colonne vers le cerveau — le « recyclage » du jing." },
      { tipo: "movimiento", titulo: "Le Tigre — seulement le premier mouvement", texto: "Les griffes montent en inspirant, descendent en expirant. Répète 9 fois, lentement et consciemment. Visualise le sang chaud affluant vers le bassin. Active le méridien du foie sur la face interne des cuisses." },
      { tipo: "nota", titulo: "Séquence complète (20 min)", texto: "1) Cerf mouvement 1 — 7 répétitions. 2) Cerf mouvement 2 — 7 répétitions. 3) Tigre mouvement 1 — 9 répétitions. 4) Petite circulation — 3 cycles." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Points d'acupression",
    sub: "Étape 5 · Automassage des points",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          { nombre: "Ming Men (4VG) · Principal — La Porte du Destin", localizacion: "Ligne médiane du dos, entre la 2e et la 3e vertèbre lombaire.", indicaciones: "Le point le plus important pour la vitalité sexuelle. Stimule la sexualité, la colonne et le cerveau.", comoMasajear: "Technique taoïste : frotte les paumes jusqu'à les chauffer, masse le bas du dos 90 fois avec chaque main. Puis avec les poings fermés, en cercles.", imagen: "punto-mingmen-4vg.jpg" },
          { nombre: "Guan Yuan (4VC) · Secondaire", localizacion: "3 doigts sous le nombril, ligne médiane.", indicaciones: "Tonifie le yuan qi, consolide le yin. Fertilité, libido, énergie de base.", comoMasajear: "9 rotations dans le sens horaire. Visualise une chaleur dorée s'accumulant.", imagen: "punto-guanyuan-4vc.jpg" },
          { nombre: "Tai Xi (R3) · Complémentaire", localizacion: "Entre la malléole interne et le tendon d'Achille.", indicaciones: "Nourrit le yang rénal, favorise la fertilité, tonifie l'ensemble du système. Essentiel pour la frigidité sexuelle.", comoMasajear: "Pression délicate du pouce, sur les deux pieds.", imagen: "punto-taixi-r3.jpg" },
          { nombre: "Hui Yin (1VC) · Base", localizacion: "Centre du plancher pelvien, entre l'anus et les organes génitaux.", indicaciones: "Essentiel pour l'équilibre génital et urinaire, féminin et masculin. Ne se masse pas directement.", comoMasajear: "S'active en contractant doucement le périnée à la fin de chaque inspiration, en relâchant à l'expiration — maintiens-le pendant toute la séance.", imagen: "punto-huiyin-1vc.jpg" },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualisation de l'Arbre",
    sub: "Étape 6 · Clôture",
    free: false,
    icono: "6",
    duracion: "10-12 min",
    videoId: "",
    imagen: "arbol-postura.jpg",
    audioArchivo: "",
    bloques: [
      { tipo: "visualizacion", titulo: "La posture", texto: "Debout en Wu Ji. Bras en ovale. Langue au palais. Périnée contracté doucement. Cette posture active déjà la petite circulation : connectée de Hui Yin à Bai Hui." },
      { tipo: "visualizacion", titulo: "Phase 1 — Le feu de Ming Men (3 min)", texto: "Attention sur le bas du dos. Visualise une flamme orange, vive et chaude. En inspirant elle grandit ; en expirant elle rayonne sa chaleur vers les reins, les organes génitaux, le sacrum." },
      { tipo: "visualizacion", titulo: "Phase 2 — L'élévation du jing (3-5 min)", texto: "Cette énergie chaude remonte la colonne (Du Mai). En contractant légèrement le périnée à chaque inspiration, tu la « pompes » vers le haut, jusqu'au cœur puis Bai Hui. Puis elle descend le long de l'avant du corps (Ren Mai) jusqu'au dan tian, complétant le cercle." },
      { tipo: "visualizacion", titulo: "Phase 3 — Le jing dans le cœur (2 min)", texto: "L'énergie se dépose dans le dan tian inférieur : le jing est préservé, non dispersé. Le shen est serein. Une vitalité tranquille, une force créative à l'état latent." },
      { tipo: "visualizacion", titulo: "Clôture", texto: "Paumes sur le dan tian inférieur — pour les femmes, main droite sur la gauche. 36 rotations dans le sens antihoraire + 24 dans le sens horaire. Trois respirations. Ouvre les yeux." },
    ],
  },
];

// =====================================================================
// MÓDULO (FR) — Rétention d'Eau
// =====================================================================
const ESTACIONES_RETENCION_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Compréhension énergétique",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "retencion-liquidos-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La rétention d'eau (œdème, lourdeur des jambes, gonflement matinal, cellulite) répond à un déséquilibre de l'axe Rate-Rein. La rate transforme et transporte les liquides ; quand son qi est faible, l'humidité (shi) s'accumule et stagne. Les reins contrôlent les fluides en profondeur. L'objectif : réchauffer la rate, renforcer le rein et faire circuler le qi pour dissoudre l'humidité.",
      },
      {
        tipo: "patrones",
        titulo: "Schémas fréquents",
        items: [
          { nombre: "Gonflement des jambes en fin de journée", texto: "Vide de qi de la rate. Humidité qui descend et s'accumule. Objectif : tonifier la rate, faire descendre le qi." },
          { nombre: "Gonflement matinal (visage, mains)", texto: "Vide de yang des reins. L'eau ne se transforme pas. Objectif : réchauffer le yang rénal." },
          { nombre: "Lourdeur généralisée / fatigue avec œdème", texto: "Blocage combiné rate-poumon. Objectif : activer la circulation et réchauffer le dan tian." },
          { nombre: "Cellulite / stagnation des fluides", texto: "Humidité chronique avec stagnation de qi et de sang. Objectif : mobiliser, drainer, réchauffer." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Fenêtres du visage",
    sub: "Étape 1 · Automassage",
    free: true,
    icono: "1",
    duracion: "8 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Où mettre l'accent", texto: "Frotte les paumes vigoureusement jusqu'à ressentir une forte chaleur (active Lao Gong, 8MC). L'accent est mis sur les fenêtres de la rate (bouche/lèvres) et des reins (oreilles)." },
      {
        tipo: "lista",
        titulo: "Séquence complète (8 min)",
        items: [
          "Bouche → Rate : avec l'index et le majeur, masse en cercles autour de la bouche et des lèvres. 3 min.",
          "Oreilles → Reins : masse tout le pavillon auriculaire, tire le lobe vers le bas 9 fois. 2 min.",
          "Nez → Poumons : masse les ailes du nez avec les pouces. 1 min.",
          "Cuir chevelu → Vessie/VB : peigne avec les doigts tout le cuir chevelu. 2 min.",
        ],
      },
      { tipo: "nota", titulo: "Conseil pratique", texto: "Fais-le avant de te lever du lit pour combattre le gonflement matinal. Pour les jambes gonflées : à la fin, frotte fermement la face interne des cuisses de haut en bas (sens du drainage)." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Massage des doigts",
    sub: "Étape 2 · Automassage",
    free: false,
    icono: "2",
    duracion: "5 min",
    videoId: "x9NIq1aNs30",
    bloques: [
      { tipo: "automasaje", titulo: "Pourquoi ça fonctionne", texto: "Active particulièrement le méridien du Triple Réchauffeur (distribution des liquides) et celui de la Rate." },
      {
        tipo: "lista",
        titulo: "Séquence (5 min)",
        items: [
          "Frotte les paumes 9 fois jusqu'à sentir la chaleur dans Lao Gong.",
          "Masse chaque doigt en pinçant de la base à la pointe, en portant une attention particulière à l'auriculaire et à l'annulaire.",
          "Presse He Gu (LI4, entre le pouce et l'index) 30 sec par côté.",
          "Entrelace les doigts et fais frotter les jointures avec force.",
          "Amène les mains entre les genoux (joints) et frotte les paumes pour générer de la chaleur vers les jambes.",
        ],
      },
      { tipo: "nota", titulo: "Technique clé", texto: "Frotte les pieds avec les paumes chaudes chaque matin : 9 rotations sur Yong Quan (1R, plante du pied). Active le yang rénal et draine l'eau vers le bas et vers l'extérieur." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Respiration et sons",
    sub: "Étape 3 · Respiration",
    free: false,
    icono: "3",
    duracion: "11 min",
    videoId: "-aSpXl294W8",
    bloques: [
      { tipo: "respiracion", titulo: "A · Respiration abdominale avec chaleur au dan tian", texto: "Paumes sur le dan tian. Inspire en gonflant le ventre (5 sec), retiens 2-3 sec en visualisant une flamme chaude qui dissout l'humidité, expire lentement (6-7 sec) en visualisant l'humidité grise sortant par la plante des pieds. Répète 9 fois." },
      { tipo: "respiracion", titulo: "B · Son Xi — pour la rate et le pancréas", texto: "Inspire profondément. En expirant, émets « Xi » longuement et de façon continue tandis que les bras s'élèvent latéralement, paumes vers le haut. Visualise la couleur jaune rayonnant depuis le centre. Répète 6 fois, puis masse l'abdomen dans le sens horaire." },
      { tipo: "respiracion", titulo: "C · Respiration paradoxale — drainage profond", texto: "En inspirant, contracte le ventre ; en expirant, gonfle-le — comme un soufflet qui comprime l'humidité vers l'extérieur. Pratique seulement 3-5 min au début, debout avec une légère flexion des genoux. En cas de vertiges, reviens à la respiration normale." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "L'Ours",
    sub: "Étape 4 · Mouvement",
    free: false,
    icono: "4",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "L'énergie de l'Ours", texto: "Élément Terre, organe Rate et estomac. Ses mouvements lourds et enracinés activent le métabolisme et réchauffent le centre du corps — idéal pour la rétention d'eau et la lourdeur." },
      { tipo: "movimiento", titulo: "Mouvement 1 — Balancement latéral", texto: "Pieds plus larges que les hanches, genoux fléchis. Les mains pendent, lourdes, le long du corps. Balance le corps de gauche à droite en laissant le poids osciller naturellement. Le mouvement vient de la hanche, pas des épaules. Répète 12-18 fois." },
      { tipo: "movimiento", titulo: "Mouvement 2 — L'Ours qui grimpe", texto: "La main droite monte (bras semi-tendu) tandis que la gauche descend ; le buste tourne doucement vers la droite. Le poids va vers le pied opposé au bras qui monte. Alterne comme si tu grimpais lentement. Répète 9 fois par côté." },
      { tipo: "nota", titulo: "Variante à faible impact", texto: "Le balancement latéral peut se faire assis sur une chaise stable, en déplaçant le poids d'une fesse à l'autre. L'Ours qui grimpe peut se faire uniquement avec les bras, sans déplacement de poids." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Points d'acupression",
    sub: "Étape 5 · Automassage des points",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Comment masser", texto: "Toujours assise, avec calme. Pression circulaire du pouce, 30-60 sec par point, des deux côtés." },
      {
        tipo: "puntos",
        items: [
          { nombre: "Yin Ling Quan (9Ra) · Principal", localizacion: "Face interne de la jambe, 2 doigts sous le pli du genou, contre le tibia.", indicaciones: "Le grand point drainant du corps. Élimine l'humidité, régule la rate. Œdèmes, rétention, lourdeur.", comoMasajear: "Rotations douces du pouce, des deux côtés à la fois si possible. Sensible : ne pas frapper. Quotidien.", imagen: "punto-yinlingquan-9ra.jpg" },
          { nombre: "Zu San Li (36E) · Secondaire", localizacion: "4 doigts sous la rotule, vers l'extérieur du tibia.", indicaciones: "Tonifie le qi de la rate et de l'estomac. Active le métabolisme. Le point le plus tonifiant du corps.", comoMasajear: "Tapotements doux avec le poing fermé ou pression du pouce, 60-90 sec. Très efficace debout.", imagen: "punto-zusanli-36e.jpg" },
          { nombre: "Shui Fen (9VC) · Complémentaire", localizacion: "1 doigt au-dessus du nombril, ligne médiane de l'abdomen.", indicaciones: "Son nom le dit : il distribue et régule l'eau dans l'organisme. Rétention, œdèmes, fonction rénale.", comoMasajear: "Paume chaude sur le point, 9 rotations lentes dans chaque sens, en visualisant l'eau qui se draine.", imagen: "punto-shuifen-9vc.jpg" },
          { nombre: "Massage des Reins · Soutien", localizacion: "Ming Men et bas du dos.", indicaciones: "Active le yang rénal : le feu qui transforme l'eau en vapeur et permet le drainage.", comoMasajear: "Frotte les paumes jusqu'à les chauffer et masse le bas du dos 90 fois avec chaque main (technique taoïste).", imagen: "punto-mingmen-4vg.jpg" },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualisation de l'Arbre",
    sub: "Étape 6 · Clôture",
    free: false,
    icono: "6",
    duracion: "8-12 min",
    videoId: "",
    imagen: "arbol-postura.jpg",
    audioArchivo: "",
    bloques: [
      { tipo: "visualizacion", titulo: "La posture", texto: "Debout, pieds parallèles, genoux légèrement fléchis. Bras en ovale. Langue au palais, périnée doucement contracté. Colonne étirée. Yeux fermés, respiration abdominale douce." },
      { tipo: "visualizacion", titulo: "Phase 1 — Le feu du centre (2 min)", texto: "Attention sur le dan tian inférieur. Visualise une flamme dorée, chaude et stable. À chaque inspiration elle grandit ; à chaque expiration elle rayonne sa chaleur dans tout le ventre, transformant l'eau froide stagnante en vapeur qui circule." },
      { tipo: "visualizacion", titulo: "Phase 2 — Le drainage (3-5 min)", texto: "Cette énergie chaude descend le long de la face interne des jambes, passe par Yin Ling Quan et continue jusqu'à Yong Quan. Là, toute l'humidité grise et lourde quitte le corps vers la terre. À chaque expiration, plus d'humidité sort ; à chaque inspiration, plus de chaleur dorée monte." },
      { tipo: "visualizacion", titulo: "Phase 3 — Légèreté (2-3 min)", texto: "Le corps se sent plus léger. Les jambes, auparavant lourdes, deviennent légères. Zu San Li vibre de vitalité. La rate et l'estomac s'activent. Le qi circule librement." },
      { tipo: "visualizacion", titulo: "Clôture", texto: "Paumes sur le dan tian. 9 rotations dans le sens horaire (tonifie). 3 respirations profondes. Frotte les mains et passe-les sur le visage et le cuir chevelu pour clore la séance." },
    ],
  },
];

// =====================================================================
// MÓDULO (FR) — Colère, Énervement et Frustration
// =====================================================================
const ESTACIONES_IRA_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Compréhension énergétique",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "ira-frustracion-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La colère, l'énervement chronique et la frustration expriment un excès de yang dans le méridien du Foie, l'organe qui assure la libre circulation du qi. Quand cette circulation se bloque, le qi stagne et génère une chaleur qui monte vers le cœur et la tête : tension dans le cou, douleur aux tempes, yeux rouges, irritabilité. L'objectif : mobiliser le qi stagnant, faire descendre le yang excessif, refroidir le feu et ancrer le shen.",
      },
      {
        tipo: "patrones",
        titulo: "Schémas fréquents",
        items: [
          { nombre: "Irritabilité / nervosité chronique", texto: "Stagnation de qi dans le foie. Objectif : mobiliser avec le Tigre, libérer avec le son Xu." },
          { nombre: "Tension du cou/tempes + mauvaise humeur", texto: "Yang du foie ascendant. Objectif : faire descendre le yang avec Tai Chong et Yong Quan." },
          { nombre: "Frustration créative / projets bloqués", texto: "Le foie gouverne les tendons et les projets vitaux. Objectif : libérer la circulation." },
          { nombre: "Colère explosive / emportements", texto: "Feu du foie aigu. Objectif : refroidir immédiatement avec Wu Ji + Xu + Yong Quan." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Fenêtres du visage",
    sub: "Étape 1 · Automassage apaisant",
    free: true,
    icono: "1",
    duracion: "8 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Où mettre l'accent", texto: "L'accent total est mis sur les yeux (fenêtre du foie). C'est le geste le plus immédiat pour calmer le feu du foie." },
      {
        tipo: "lista",
        titulo: "Séquence apaisante (8 min)",
        items: [
          "Yeux → Foie (priorité) : paumes TRÈS chaudes sur les yeux, pression douce, massage des paupières avec le pouce. 4 min.",
          "Visage complet → Cœur : paumes vers le bas, frotter de bas en haut. 2 min.",
          "Cuir chevelu → Vaisseaux : pression forte de l'avant vers l'arrière, soulage les migraines et l'irritabilité. 1 min.",
          "Bouche → Rate : masse autour de la bouche — la terre contrôle le bois. 1 min.",
        ],
      },
      { tipo: "nota", titulo: "Technique d'urgence (crise de colère aiguë)", texto: "Applique les paumes chaudes sur les yeux pendant 5 minutes. Rien d'autre. Respire par le nez, très lentement, sans penser. Ce geste simple peut interrompre le cycle de la colère en 2-3 minutes." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Massage des doigts",
    sub: "Étape 2 · Automassage descendant",
    free: false,
    icono: "2",
    duracion: "6 min",
    videoId: "x9NIq1aNs30",
    bloques: [
      { tipo: "automasaje", titulo: "Objectif", texto: "Faire descendre le yang qui monte. L'énergie excessive du foie tend à s'accumuler dans le cou, la tête et la poitrine." },
      {
        tipo: "lista",
        titulo: "Séquence descendante (6 min)",
        items: [
          "Frotte les paumes jusqu'à sentir la chaleur.",
          "Masse vigoureusement le cuir chevelu (comme un shampoing), 2 min — commence à disperser le yang.",
          "Masse le cou et les trapèzes avec fermeté — c'est là que s'accumule la tension du foie.",
          "Continue à descendre : épaules, bras, avant-bras, mains.",
          "Termine avec les orteils, en portant attention à l'espace entre le 1er et le 2e orteil (où se trouve Tai Chong).",
          "Presse Yong Quan (plante du pied) avec le pouce, 30 sec par pied, en ancrant le yang à la terre.",
        ],
      },
      { tipo: "nota", titulo: "Clé pour la colère", texto: "Le massage va toujours de haut en bas : cuir chevelu → cou → épaules → bras → mains → pieds. Ce sens descendant « fait descendre » le yang excessif." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Wu Ji et sons",
    sub: "Étape 3 · Respiration",
    free: false,
    icono: "3",
    duracion: "13 min",
    videoId: "8d85gMOj2sw",
    bloques: [
      { tipo: "respiracion", titulo: "A · Wu Ji + respiration longue", texto: "Avant tout : Wu Ji 5 minutes. Debout, pieds parallèles, mains détendues. Inspire 5 sec, expire 8-10 sec — l'expiration très longue est ce qui fait descendre le yang. Après 5 minutes, le feu a baissé." },
      { tipo: "respiracion", titulo: "B · Son Xu — l'antidote du foie", texto: "Inspire profondément. En expirant, émets « Xu » très longuement, comme un soupir profond et doux, tandis que les bras s'élèvent latéralement, paumes vers le haut. Visualise le vert enveloppant le foie. Répète 9 fois minimum — jusqu'à 18-27 si la colère est intense." },
      { tipo: "respiracion", titulo: "C · Son He — calmer le cœur", texto: "Le feu du foie enflamme toujours le cœur. 6 répétitions lentes : les bras montent en inspirant, descendent en expirant avec « He ». Visualise le rouge devenant un rose plus doux." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Le Tigre et l'Arbre",
    sub: "Étape 4 · Mouvement",
    free: false,
    icono: "4",
    duracion: "15-20 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "Le principe du Tigre pour la colère", texto: "La colère est un feu bloqué : le Tigre le mobilise, mais avec une conscience maximale. Le secret : faire les mouvements TRÈS lentement. En ralentissant un mouvement naturellement rapide, la colère se transforme en puissance concentrée." },
      { tipo: "movimiento", titulo: "Mouvement 1 — Le Tigre s'élève", texto: "Griffes vers le bas devant toi. Très lentement : elles montent pendant 10 secondes complètes vers le ciel. Maintiens 3-5 sec au sommet. Descends très lentement pendant 10 secondes, en visualisant que la tension part vers la terre. 9 répétitions." },
      { tipo: "movimiento", titulo: "Mouvement 2 — Le bond", texto: "Le tigre descend en enroulant la colonne, en amenant consciemment la colère vers le bas. Au point le plus bas, maintiens 3 respirations. En te déployant vers le haut, cette énergie se transforme en puissance et en clarté. 9 répétitions lentes." },
      { tipo: "nota", titulo: "Transition : Embrasser l'Arbre (5-10 min)", texto: "Debout, bras en ovale, yeux fermés — crucial pour consolider le travail du Tigre. Visualise le qi du foie revenant à sa place naturelle : fluide, libre, vert et doux." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Points d'acupression",
    sub: "Étape 5 · Automassage des points",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          { nombre: "Tai Chong (3F) · Principal — Le Grand Assaut", localizacion: "Dessus du pied, entre le 1er et le 2e orteil, quelques cm avant l'articulation.", indicaciones: "Le point le plus important pour réguler le yang du foie. Colère, stress, tension dans la poitrine et le cou.", comoMasajear: "Pression circulaire du pouce. Si ça fait très mal, c'est le signe d'une vraie stagnation. 60 sec par pied.", imagen: "punto-taichong-3f.jpg" },
          { nombre: "Yong Quan (1R) · Secondaire", localizacion: "Centre de la plante du pied, premier tiers depuis les orteils.", indicaciones: "Ancre le yang qui monte. Apaise l'esprit et emmène les énergies négatives vers la terre.", comoMasajear: "Pressions fermes avec le pouce, sur les deux pieds. Marcher pieds nus sur l'herbe ou la terre l'active aussi.", imagen: "punto-yongquan-1r.jpg" },
          { nombre: "Qi Men (14F) · Complémentaire", localizacion: "Sous les tétons, 6e espace intercostal.", indicaciones: "Régule toute la circulation du méridien du foie. Libère la stagnation dans le thorax, sensation de nœud dans la poitrine, colère refoulée.", comoMasajear: "Pression énergique, faire tourner dans les deux sens. Puis passer le bord des mains du centre vers les flancs.", imagen: "punto-qimen-14f.jpg" },
          { nombre: "Qu Quan (8F) · Soutien", localizacion: "Face interne du genou, entre deux tendons en fléchissant.", indicaciones: "Nourrit le sang et le foie. Lié aux perturbations de type colère et frustration.", comoMasajear: "Rotations douces ou tapotements avec la paume légèrement creuse, assise avec les jambes tendues.", imagen: "punto-ququan-8f.jpg" },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualisation de l'Arbre",
    sub: "Étape 6 · Clôture",
    free: false,
    icono: "6",
    duracion: "8-10 min",
    videoId: "",
    imagen: "arbol-postura.jpg",
    audioArchivo: "",
    bloques: [
      { tipo: "visualizacion", titulo: "La posture", texto: "Debout. Bras en ovale. Yeux fermés — crucial pour la colère : fermer les yeux déconnecte le stimulus du foie. Langue au palais, mâchoire relâchée." },
      { tipo: "visualizacion", titulo: "Phase 1 — Faire descendre l'énergie (2 min)", texto: "Attention sur les pieds, en sentant le contact avec le sol. Imagine que la colère est de l'eau chaude qui descend depuis la tête, le cou, la poitrine, le ventre, les jambes, les pieds... et pénètre dans la terre, où elle est absorbée et transformée." },
      { tipo: "visualizacion", titulo: "Phase 2 — L'arbre dans le vent (3-5 min)", texto: "L'arbre (toi) a des racines profondes, un tronc solide. Les branches (les bras) bougent avec le vent sans que l'arbre ne tombe. La colère est le vent : il peut souffler. L'arbre ne juge pas le vent, il reste simplement présent. Tu observes la colère sans être la colère." },
      { tipo: "visualizacion", titulo: "Phase 3 — Le vert du foie (2-3 min)", texto: "Le foie, sous la poitrine droite, est une sphère verte. La colère stagnante était vert foncé, épaisse. À chaque respiration elle devient plus lumineuse et fluide — le qi circule librement, l'émotion n'est plus bloquée." },
      { tipo: "visualizacion", titulo: "Clôture", texto: "Paumes sur le dan tian inférieur. 9 rotations. Trois respirations. Ouvre les yeux lentement. Ne bouge pas pendant 30 secondes : laisse le nouvel état se consolider." },
    ],
  },
];

// =====================================================================
// MÓDULO (FR) — Digestions Lourdes et Ballonnements
// =====================================================================
const ESTACIONES_DIGESTION_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Compréhension énergétique",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "digestiones-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Les digestions lourdes, les gaz, les ballonnements abdominaux et le côlon irritable combinent deux schémas : un vide de qi de la rate (le feu digestif est faible) et une invasion du foie (l'excès de qi du foie comprime l'estomac et la rate). Les symptômes s'aggravent avec le stress et les repas copieux ou froids. L'objectif : réchauffer et tonifier la rate, libérer le foie de l'estomac et favoriser le mouvement naturel de l'intestin (le péristaltisme), en accompagnant ce mouvement physique par celui du Qi digestif.",
      },
      {
        tipo: "patrones",
        titulo: "Schémas fréquents",
        items: [
          { nombre: "Ballonnements après repas / gaz", texto: "Vide de qi de la rate + humidité. La rate ne transforme pas. Objectif : réchauffer le centre, son Hu." },
          { nombre: "Côlon irritable / digestion nerveuse", texto: "Invasion du foie sur l'estomac. Objectif : calmer le foie avec Wu Ji + Xu." },
          { nombre: "Digestion très lente / constipation fonctionnelle", texto: "Vide de yang de la rate, froid au centre. Objectif : réchauffer fortement avec le massage et le 3e Brocart, expliqué dans le parcours Longévité." },
          { nombre: "Estomac acide / brûlures + ballonnements", texto: "Feu du foie dans l'estomac. Objectif : refroidir le foie, réguler l'estomac." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Fenêtres du visage",
    sub: "Étape 1 · Automassage digestif",
    free: true,
    icono: "1",
    duracion: "10 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Où mettre l'accent", texto: "Idéal 30 min avant de manger ou au début des symptômes. L'accent est mis sur la bouche/lèvres (fenêtre de la rate), le nez (poumons/intestin) et le Dragon dans l'Étang (salive digestive)." },
      {
        tipo: "lista",
        titulo: "Séquence digestive (10 min)",
        items: [
          "Bouche/lèvres → Rate : masse en cercles avec l'index et le majeur, 3 min — priorité absolue dans ce parcours.",
          "Yeux → Foie : paumes chaudes sur les yeux fermés, soulage les brûlures et les spasmes. 2 min.",
          "Nez → Poumons/Intestin : masse les ailes du nez avec la base des pouces. 1 min.",
          "Cuir chevelu complet : peignage énergique avec les 10 doigts. 1 min.",
        ],
      },
      { tipo: "nota", titulo: "Technique spéciale — Le Dragon dans l'Étang", texto: "Frappe la langue sur le palais 9 fois, entrechoque les incisives 9 fois. Laisse la salive s'accumuler et avale en 3 déglutitions, en sentant sa descente vers l'estomac. La salive contient les premières enzymes digestives." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Massage gastro-intestinal",
    sub: "Étape 2 · Automassage",
    free: false,
    icono: "2",
    duracion: "10-12 min",
    videoId: "x9NIq1aNs30",
    bloques: [
      { tipo: "automasaje", titulo: "Massage des doigts (3 min)", texto: "Frotte les paumes jusqu'à bien les chauffer. Masse les orteils, surtout le 1er (méridien de la rate et de l'estomac), le 2e (fin du méridien de l'estomac) et le 4e (vésicule biliaire). Presse Zu San Li avec des tapotements doux du poing, 60 sec par jambe." },
      {
        tipo: "lista",
        titulo: "Massage Gastro-intestinal (7-10 min) — assise, dos droit",
        items: [
          "Paumes sur le point 12VC (entre le nombril et le sternum) : 36 rotations dans un sens, 36 dans l'autre.",
          "Descends les paumes juste au-dessus du nombril : 36 rotations dans chaque sens.",
          "Paumes sur le dan tian (nombril et dessous) : 36 rotations dans chaque sens.",
          "Descends jusqu'au pubis : 36 rotations dans chaque sens.",
          "Masse tout l'abdomen en grands cercles : 12 dans le sens antihoraire (pour ballonnements/gaz), 12 dans le sens horaire (pour constipation).",
        ],
      },
      { tipo: "nota", titulo: "Ne pas pratiquer en cas de grossesse ni pendant des règles douloureuses", texto: "Sens antihoraire : disperse, élimine, débloque → gaz, ballonnements aigus. Sens horaire : tonifie, réchauffe, active → digestion lente, constipation." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Wu Ji et sons",
    sub: "Étape 3 · Respiration",
    free: false,
    icono: "3",
    duracion: "16 min",
    videoId: "-aSpXl294W8",
    bloques: [
      { tipo: "respiracion", titulo: "A · Wu Ji long — calmer le shen", texto: "Pratique Wu Ji 5 minutes avant de commencer, pour calmer totalement l'esprit : de nombreux troubles digestifs sont liés à l'activité mentale." },
      { tipo: "respiracion", titulo: "B · Son Hu — pour la rate et l'estomac", texto: "Le son digestif par excellence. Inspire profondément. En expirant, émets « Hu » longuement et de façon continue, comme un souffle chaud, mains sur l'abdomen. Visualise le jaune rayonnant sa chaleur depuis le centre. Répète 9 fois, puis masse l'abdomen en cercles." },
      { tipo: "respiracion", titulo: "C · Son Xi — pour la rate/pancréas et l'humidité", texto: "6 répétitions du son « Xi » (tchi). Complète le travail de la rate et élimine l'humidité digestive." },
      { tipo: "respiracion", titulo: "D · Respiration abdominale post-repas", texto: "Allongée sur le dos, genoux fléchis, mains sur l'abdomen, 5 minutes, 30 minutes après avoir mangé. Le diaphragme masse les organes digestifs à chaque respiration." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "L'Ours et le 3e et 4e Brocart",
    sub: "Étape 4 · Mouvement",
    free: false,
    icono: "4",
    duracion: "15-18 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "L'Ours", texto: "Son balancement masse directement la rate et l'estomac. Mouvement 1 (balancement latéral) : masse par le mouvement de la hanche. Mouvement 2 (l'Ours qui grimpe) : active le méridien de l'estomac sur la face avant du buste. Visualise la chaleur se répandant dans l'abdomen à chaque oscillation. 18 répétitions par mouvement." },
      { tipo: "movimiento", titulo: "3e Brocart — Séparer le Ciel et la Terre", texto: "Une main monte vers le ciel (paume vers le haut), l'autre pousse vers la terre (paume vers le bas). Étirement maximal à l'expiration, alterne les côtés à chaque inspiration. Répète 9 fois par côté — masse le foie et l'estomac entre les deux bras." },
      { tipo: "movimiento", titulo: "4e Brocart — Regarder Derrière", texto: "Les mains montent à hauteur de la poitrine, paumes vers le ciel. La tête et le buste tournent d'un côté (colonne lombaire immobile), 3 respirations, retour au centre puis répète de l'autre côté. Masse toute la sphère digestive. 9-24 fois par côté." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Points d'acupression",
    sub: "Étape 5 · Automassage des points",
    free: false,
    icono: "5",
    duracion: "8 min",
    videoId: "",
    bloques: [
      {
        tipo: "puntos",
        items: [
          { nombre: "Zu San Li (36E) · Principal — Les Trois Lieues", localizacion: "4 doigts sous la rotule, vers l'extérieur du tibia.", indicaciones: "Le point digestif le plus important du corps. Tonifie la rate et l'estomac. Digestion lente, acidité, gaz, diarrhée ou constipation.", comoMasajear: "Tapotements doux avec le poing semi-fermé, 60-90 sec par jambe, ou pression soutenue du pouce. Idéal debout.", imagen: "punto-zusanli-36e.jpg" },
          { nombre: "Zhong Wan (12VC) · Secondaire", localizacion: "Exactement à mi-chemin entre le nombril et le sternum.", indicaciones: "Le point central de l'estomac. Ballonnements, nausées, digestion lente, brûlures.", comoMasajear: "Paume superposée : 36 rotations antihoraires (ballonnements) ou horaires (vidange lente). Lentement et consciemment.", imagen: "punto-zhongwan-12vc.jpg" },
          { nombre: "Shen Que (8VC) · Complémentaire", localizacion: "Exactement le nombril.", indicaciones: "Active la chaleur, apporte du yang aux reins et à la rate, régule les intestins et l'estomac.", comoMasajear: "Paume chaude sur le nombril, sans frotter, 2-3 minutes de chaleur seulement. Puis 9 rotations dans le sens horaire.", imagen: "punto-shenque-8vc.jpg" },
          { nombre: "Di Ji (8Ra) · Soutien", localizacion: "Face interne de la jambe, au tiers entre le genou et la cheville.", indicaciones: "Élimine l'humidité et régule la rate. Digestion lente avec lourdeur et gaz.", comoMasajear: "Rotations douces du pouce, sur les deux jambes. Sensible : commencer doucement.", imagen: "punto-diji-8ra.jpg" },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualisation de l'Arbre",
    sub: "Étape 6 · Clôture",
    free: false,
    icono: "6",
    duracion: "8-10 min",
    videoId: "",
    imagen: "arbol-postura.jpg",
    audioArchivo: "",
    bloques: [
      { tipo: "visualizacion", titulo: "La posture", texto: "Debout ou assise, mains sur l'abdomen. Yeux fermés. Si tu es assise, dos droit mais non rigide, pieds bien posés au sol." },
      { tipo: "visualizacion", titulo: "Phase 1 — Le feu du centre (2 min)", texto: "Visualise l'estomac et la rate comme une cuisine avec un feu allumé. Quand le feu digestif est fort, les aliments se transforment facilement. À chaque inspiration, le feu s'anime ; à chaque expiration, la chaleur se répand dans l'abdomen." },
      { tipo: "visualizacion", titulo: "Phase 2 — La transformation (3-5 min)", texto: "Les aliments se transforment en énergie propre et claire. Ce qui ne sert pas descend vers les intestins, en suivant la gravité. Rien ne stagne. Visualise le qi impur de l'estomac descendant depuis le dan tian vers les pieds, en passant par Yong Quan, et retournant à la terre." },
      { tipo: "visualizacion", titulo: "Phase 3 — La légèreté après la digestion (2-3 min)", texto: "L'abdomen est chaud, détendu et léger. Le ballonnement s'est dissous. Le shen est tranquille. Tu ressens une satisfaction sans lourdeur." },
      { tipo: "visualizacion", titulo: "Clôture", texto: "Masse l'abdomen avec la paume en mouvement lent horaire, 9 fois. Frotte les paumes, passe-les sur le visage. 3 respirations. Ouvre les yeux." },
    ],
  },
];

// =====================================================================
// MÓDULO (FR) — Cycles Féminins
// =====================================================================
const ESTACIONES_MENSTRUACION_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Compréhension énergétique",
    sub: "Fondamentaux",
    free: true,
    icono: "☯",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "ciclos-femeninos-intro.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Selon la médecine traditionnelle chinoise, les symptômes menstruels et de la ménopause parlent toujours d'un déséquilibre dans trois organes : les Reins (réservoir du jing et du yin), le Foie (régule la circulation du sang et du qi) et le Cœur (abrite le shen et le feu). Le sang (xue) est la substance fondamentale du cycle.",
      },
      {
        tipo: "patrones",
        titulo: "Cinq schémas fréquents",
        items: [
          { nombre: "Règles abondantes / cycle court", texto: "Excès de chaleur dans le sang → feu au foie et au cœur. Objectif : rafraîchir." },
          { nombre: "Règles peu abondantes / cycle long", texto: "Vide de qi de la rate et des reins. Objectif : tonifier, nourrir le sang." },
          { nombre: "Règles douloureuses / crampes", texto: "Stagnation de qi et de sang dans le foie. Objectif : mobiliser, libérer." },
          { nombre: "Bouffées de chaleur ménopausiques", texto: "Vide de yin des reins (le yin ne peut plus contenir le yang). Objectif : nourrir le yin, éteindre le feu." },
          { nombre: "Irritabilité prémenstruelle", texto: "Excès de yang au foie et au cœur + shen agité. Objectif : calmer le shen." },
        ],
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Fenêtres du visage",
    sub: "Étape 1 · Automassage",
    free: true,
    icono: "1",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Pourquoi ça fonctionne", texto: "En MTC, chaque zone du visage est une « fenêtre » qui reflète l'état d'un organe interne. Frotte d'abord les paumes jusqu'à sentir la chaleur : active le point Lao Gong (8MC), principal émetteur de qi thérapeutique." },
      {
        tipo: "lista",
        titulo: "Séquence complète (10 min)",
        items: [
          "Yeux → Foie : couvre les yeux fermés avec les paumes chaudes, presse doucement en cercles. 2 min.",
          "Oreilles → Reins : masse tout le pavillon auriculaire, tire doucement le lobe vers le bas. 2 min.",
          "Bouche / lèvres → Rate : masse autour de la bouche avec l'index et le majeur. 1 min.",
          "Visage entier → Cœur : avec les paumes chaudes, passe sur tout le visage de bas en haut. 2 min.",
          "Cuir chevelu → Shen : gratte et masse avec le bout des doigts. 1 min.",
        ],
      },
      { tipo: "nota", titulo: "Note pour l'enseignante", texto: "Pour les bouffées de chaleur : insiste sur les oreilles et le visage entier. Pour les règles douloureuses : insiste sur les yeux. Pour les cycles courts : frotte l'espace entre les sourcils (Yin Tang) pour faire baisser la chaleur." },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Massage des doigts",
    sub: "Étape 2 · Automassage",
    free: false,
    icono: "2",
    duracion: "5-7 min",
    videoId: "x9NIq1aNs30",
    bloques: [
      { tipo: "automasaje", titulo: "Pourquoi ça fonctionne", texto: "Les mains contiennent en miniature l'ensemble des méridiens du corps. Ce massage active la circulation dans les méridiens yin qui régulent le cycle." },
      {
        tipo: "lista",
        titulo: "Séquence pas à pas (5-7 min)",
        items: [
          "Assieds-toi confortablement. Frotte les paumes 9 fois jusqu'à sentir la chaleur.",
          "Avec le pouce et l'index d'une main, pince et fais glisser de la base à la pointe de chaque doigt de l'autre main. Répète sur les deux mains.",
          "Masse les espaces entre les doigts avec des mouvements circulaires.",
          "Presse le point He Gu (LI4) entre le pouce et l'index. Maintiens 30 sec par côté.",
          "Ferme les poings, pouce à l'intérieur, en pressant Lao Gong (8MC) au centre de la paume.",
          "Termine en frottant les mains entre elles, comme pour laver lentement l'énergie.",
        ],
      },
      { tipo: "nota", titulo: "Points clés des mains", texto: "Lao Gong (8MC) : émetteur de chaleur curative. He Gu (LI4) : régule le qi, soulage les crampes — à éviter en cas de grossesse. Shao Chong (C9) : calme le shen. Zu Ling Qi (VB41) : équivalent au pied, pour les bouffées de chaleur." },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Respiration et sons",
    sub: "Étape 3 · Respiration",
    free: false,
    icono: "3",
    duracion: "11 min",
    videoId: "8d85gMOj2sw",
    bloques: [
      { tipo: "respiracion", titulo: "A · Respiration abdominale yin (base)", texto: "Debout ou assise en Wu Ji. Inspire par le nez en gonflant le ventre (4-5 sec), contracte doucement le périnée, expire encore plus lentement (6-8 sec). Répète 9 fois, en visualisant le dan tian inférieur comme une pleine lune tiède." },
      { tipo: "respiracion", titulo: "B · Son Xu — pour le foie", texto: "Inspire profondément. En expirant, émets le son « Xu » long et continu tandis que les bras s'étendent latéralement, paumes vers le haut. Répète 6 fois, en visualisant un vert émeraude enveloppant le foie. Utile pour les règles douloureuses et l'irritabilité." },
      { tipo: "respiracion", titulo: "C · Son Chui — pour les reins", texto: "Inspire profondément. En expirant, émets doucement « Chui » tandis que les mains descendent vers les reins, dans le dos. Répète 6 fois, en visualisant un bleu-noir nocturne nourrissant les reins. Utile pour les bouffées de chaleur et la fatigue." },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "Le Cerf",
    sub: "Étape 4 · Mouvement",
    free: false,
    icono: "4",
    duracion: "10-12 min",
    videoId: "",
    bloques: [
      { tipo: "movimiento", titulo: "L'énergie du Cerf", texto: "Élément Eau, organe Reins. Ses mouvements massent le méridien du rein et favorisent la circulation pelvienne — idéal pour le cycle féminin et la ménopause." },
      { tipo: "movimiento", titulo: "Mouvement 1 — Torsion latérale (les cornes)", texto: "Pieds à la largeur des hanches, genoux fléchis. Forme des « cornes » avec les mains (replie l'annulaire et le majeur). Un bras s'étend latéralement, l'autre se replie près du corps. Tourne le buste vers le côté du bras étendu, vertèbre par vertèbre. 3 respirations, change de côté. 3 fois par côté." },
      { tipo: "movimiento", titulo: "Mouvement 2 — Le saut du Cerf", texto: "Fléchis les genoux, les bras montent en arc jusqu'à la poitrine tandis que le dos s'arrondit. Puis le cerf se redresse : les cornes montent, la colonne s'allonge, le regard vers l'avant. Répète 7 fois — le nombre taoïste du Cerf." },
      { tipo: "nota", titulo: "Variante pour bouffées de chaleur et ménopause", texto: "Fais-le très lentement, avec une expiration longue. En te redressant, imagine une pluie fraîche descendant depuis Bai Hui vers les reins. Termine avec les deux paumes chaudes sur les reins, 5 respirations." },
    ],
  },
  {
    id: 5,
    tipo: "practica",
    titulo: "Points d'acupression",
    sub: "Étape 5 · Automassage des points",
    free: false,
    icono: "5",
    duracion: "8-10 min",
    videoId: "",
    bloques: [
      { tipo: "automasaje", titulo: "Comment masser", texto: "Toujours assise, avec calme. Pression circulaire du pouce, 30-60 sec par point, des deux côtés du corps." },
      {
        tipo: "puntos",
        items: [
          { nombre: "San Yin Jiao (6Ra) · Principal", localizacion: "Face interne de la jambe, 4 doigts au-dessus de la malléole interne, contre le tibia.", indicaciones: "Tous les troubles menstruels et la ménopause. Insomnie hormonale.", comoMasajear: "Sens horaire pour tonifier (règles peu abondantes), sens antihoraire pour disperser (règles abondantes). À éviter en cas de grossesse.", imagen: "punto-sanyinjiao-6ra.jpg" },
          { nombre: "Ran Gu (R2) · Secondaire", localizacion: "Face interne du pied, sur l'os naviculaire.", indicaciones: "Bouffées de chaleur ménopausiques, chaleurs nocturnes, sécheresse.", comoMasajear: "Pressions délicates, les deux pieds à la fois si possible. Idéal avant de dormir.", imagen: "punto-rangu-r2.jpg" },
          { nombre: "Qi Men (14F) · Complémentaire", localizacion: "Juste sous les tétons, 6e espace intercostal.", indicaciones: "Fonction du foie, syndrome prémenstruel, irritabilité.", comoMasajear: "Pression énergique, faire tourner dans un sens puis dans l'autre.", imagen: "punto-qimen-14f.jpg" },
          { nombre: "Ming Men (4VG) · Soutien", localizacion: "Ligne médiane du dos, entre la 2e et la 3e lombaire.", indicaciones: "Vitalité profonde, ménopause, froid pelvien.", comoMasajear: "Paumes chaudes posées sur le point, massage avec les jointures en cercles.", imagen: "punto-mingmen-4vg.jpg" },
        ],
      },
    ],
  },
  {
    id: 6,
    tipo: "practica",
    titulo: "Visualisation de l'Arbre",
    sub: "Étape 6 · Clôture",
    free: false,
    icono: "6",
    duracion: "8-15 min",
    videoId: "",
    imagen: "arbol-postura.jpg",
    audioArchivo: "",
    bloques: [
      { tipo: "visualizacion", titulo: "La posture", texto: "Debout, pieds à la largeur des hanches. Bras levés devant toi comme pour embrasser un arbre. La langue touche le palais, le périnée se contracte doucement. Colonne allongée de Hui Yin à Bai Hui. Yeux fermés, respiration abdominale douce." },
      { tipo: "visualizacion", titulo: "Phase 1 — Enracinement (2 min)", texto: "Sens le poids du corps descendre vers les pieds. Visualise Yong Quan (1R) sous la plante du pied, avec des racines de lumière descendant vers la terre." },
      { tipo: "visualizacion", titulo: "Phase 2 — L'eau qui monte (3-5 min)", texto: "Un courant d'eau fraîche monte depuis la terre, entre par Yong Quan, passe par San Yin Jiao et arrive aux reins. Le yin et le yang s'équilibrent là. L'énergie monte par le Vaisseau Conception jusqu'au dan tian inférieur, où elle s'accumule comme une lune tranquille." },
      { tipo: "visualizacion", titulo: "Phase 3 — Calmer le shen (2-3 min)", texto: "Depuis le dan tian inférieur, une petite partie de l'énergie monte jusqu'au dan tian supérieur (entre les sourcils). Un point de lumière bleu argenté descend à chaque expiration. Le feu descend, le cœur se tranquillise." },
      { tipo: "visualizacion", titulo: "Clôture", texto: "Amène les paumes au dan tian inférieur (gauche contre le ventre, droite par-dessus). 36 rotations dans le sens antihoraire, puis 24 dans le sens horaire. Respire 3 fois profondément. Ouvre les yeux lentement." },
    ],
  },
];

// =====================================================================
// LISTAS DE MÓDULOS POR IDIOMA
// =====================================================================
// =====================================================================
// MÓDULO — Fundamentos (solo teoría: Qi Gong, Tao y MTC)
// =====================================================================
const ESTACIONES_FUNDAMENTOS = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Bienvenida a los fundamentos",
    sub: "Antes de empezar",
    free: true,
    icono: "☯",
    duracion: "3 min",
    videoId: "",
    audioArchivo: "fundamentos1-es.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Este recorrido es distinto a los demás: no tiene movimientos ni puntos de acupresión. Es solo teoría, pensada para quien no sabe nada de Qi Gong ni de medicina china y quiere entender, en palabras sencillas, qué es esto que va a practicar. Cuatro paradas cortas: qué es el Qi Gong, qué es el Qi, qué es el Tao, y qué es la medicina tradicional china. Nada de memorizar — solo comprender.",
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "¿Qué es el Qi Gong?",
    sub: "Parada 1",
    free: true,
    icono: "1",
    duracion: "4 min",
    videoId: "",
    audioArchivo: "fundamentos2-es.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Qi Gong (气功) se lee, aproximadamente, \"chi kung\". Es una palabra compuesta: Qi significa \"energía vital\" y Gong significa \"habilidad cultivada con la práctica\" — como en \"Kung Fu\", que literalmente significa \"habilidad lograda con esfuerzo y tiempo\". Así que Qi Gong quiere decir, de forma sencilla: el arte de cultivar la energía vital.",
      },
      {
        tipo: "texto",
        texto:
          "En la práctica, es mucho más simple de lo que suena: son movimientos lentos, respiración consciente y atención tranquila, combinados. No hace falta creer en nada para notar sus efectos — es, ante todo, una forma de moverse y respirar con más consciencia de la que usamos en el día a día.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "¿Qué es el Qi?",
    sub: "Parada 2",
    free: true,
    icono: "2",
    duracion: "4 min",
    videoId: "",
    audioArchivo: "fundamentos3-es.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Qi (气) no tiene una traducción exacta al español. Se suele traducir como \"energía vital\" o \"fuerza vital\", pero es más una idea que una cosa: es aquello que distingue un cuerpo vivo de uno sin vida. Un cuerpo con buen Qi se mueve, respira, se recupera, digiere, piensa con claridad. Cuando el Qi está débil o bloqueado en algún lugar, aparecen el cansancio, la pesadez, el dolor o la falta de claridad mental.",
      },
      {
        tipo: "texto",
        texto:
          "No hace falta \"creer\" en el Qi como en una fe — puedes entenderlo simplemente como una forma antigua de describir la vitalidad del cuerpo: cómo de bien circula la sangre, cómo de bien respiras, cómo de despierta está tu mente. El Qi Gong trabaja, precisamente, para que esa vitalidad circule mejor.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "¿Qué es el Tao?",
    sub: "Parada 3",
    free: true,
    icono: "3",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "fundamentos4-es.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Tao (道), a veces escrito \"Dao\", significa literalmente \"el Camino\". No es una religión ni un conjunto de normas: es una forma de observar cómo funciona la naturaleza — el día se convierte en noche, el invierno en primavera, la marea sube y baja — y de intentar vivir en sintonía con ese mismo ritmo, en vez de ir a contracorriente.",
      },
      {
        tipo: "texto",
        texto:
          "Dentro del Tao está la idea del Yin y el Yang (阴阳): dos fuerzas opuestas que se necesitan mutuamente y se transforman la una en la otra — el día y la noche, el esfuerzo y el descanso, el movimiento y la quietud. Ninguna de las dos es \"mejor\": la salud, según esta idea, es el equilibrio entre ambas, no la eliminación de una de ellas.",
      },
      {
        tipo: "nota",
        titulo: "Una imagen sencilla",
        texto: "El agua no fuerza su camino cuesta abajo, y aun así siempre llega al mar. El Tao es, en el fondo, esa misma idea: fluir sin forzar.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "La medicina tradicional china",
    sub: "Parada 4 · Cierre",
    free: true,
    icono: "4",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "fundamentos5-es.mp3",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La medicina tradicional china (MTC) es un sistema de salud desarrollado en China a lo largo de miles de años. Su idea central es que el Qi circula por el cuerpo a través de unos canales llamados meridianos (algo así como \"ríos de energía\" bajo la piel). Cuando el Qi fluye bien por esos canales, hay salud. Cuando se estanca, falta o se acumula en exceso en algún punto, aparece el malestar.",
      },
      {
        tipo: "texto",
        texto:
          "De ahí vienen los puntos de acupresión que usamos en esta app: son lugares concretos de esos canales donde, con el masaje adecuado, se puede ayudar a que el Qi vuelva a circular con más facilidad.",
      },
      {
        tipo: "nota",
        titulo: "Un dato verificado: la OMS y la medicina tradicional",
        texto: "La Organización Mundial de la Salud (OMS) tiene, desde 2025, una Estrategia sobre Medicina Tradicional (2025-2034) que reconoce e impulsa la integración de estas prácticas —incluida la de origen chino— en los sistemas de salud, bajo un marco de evidencia científica. Además, desde 2022 la Clasificación Internacional de Enfermedades (CIE-11) incluye un capítulo dedicado a la medicina tradicional. Esto no significa que la OMS certifique cada práctica como tratamiento médico — significa que reconoce su importancia real para gran parte de la población mundial y trabaja para que se use con seguridad y criterios claros.",
      },
      {
        tipo: "nota",
        titulo: "Cómo encajan las tres piezas",
        texto: "El Tao es la filosofía: cómo entender el flujo de la vida. La medicina tradicional china es el mapa: cómo ese flujo se organiza dentro del cuerpo. Y el Qi Gong es la práctica: lo que puedes hacer, con tu cuerpo y tu respiración, para ayudar a que ese flujo funcione mejor. Los tres son, en el fondo, la misma idea mirada desde tres ángulos distintos.",
      },
    ],
  },
];

const MODULOS_ES = [
  {
    id: "fundamentos",
    titulo: "Fundamentos",
    subtitulo: "Qué es el Qi Gong, el Qi y el Tao — en palabras sencillas",
    icono: "📖",
    estaciones: ESTACIONES_FUNDAMENTOS,
  },
  {
    id: "longevidad",
    titulo: "Longevidad",
    subtitulo: "Movimientos suaves para cultivar energía, flexibilidad y vitalidad a largo plazo",
    icono: "☯",
    estaciones: ESTACIONES_LONGEVIDAD,
  },
  {
    id: "falta-energia",
    titulo: "Falta de Energía y Fatiga",
    subtitulo: "Ejercicios para recuperar energía, calentar el cuerpo y salir del cansancio crónico",
    icono: "🔥",
    nota: "Con fatiga extrema por enfermedad grave, empieza solo con 15-20 min (pasos 1, 5 y 6). En embarazo, evita la respiración paradójica y los movimientos enérgicos del Tigre. Con hipertensión, no retengas el aliento. No confundas fatiga funcional con anemia o hipotiroidismo: deriva al médico si persiste.",
    estaciones: ESTACIONES_ENERGIA,
  },
  {
    id: "vitalidad-sexual",
    titulo: "Vitalidad Sexual y Energía Creativa",
    subtitulo: "Ejercicios para nutrir la energía vital, el deseo y la creatividad",
    icono: "✨",
    nota: "Con inflamación o infección genital activa, no masajear la zona sexual hasta resolución médica. En embarazo, evita la contracción sostenida del perineo y los movimientos enérgicos. Con hipertensión severa, evita la retención del aliento. Este recorrido trabaja la energía sexual desde una perspectiva taoísta de salud, no como estimulación directa.",
    estaciones: ESTACIONES_VITALIDAD,
  },
  {
    id: "retencion-liquidos",
    titulo: "Retención de Líquidos",
    subtitulo: "Ejercicios para drenar líquidos, aligerar el cuerpo y activar la digestión",
    icono: "💧",
    nota: "En edema cardíaco o renal grave, consulta médica antes de practicar. En embarazo, evita He Gu y la respiración paradójica. Con inflamación aguda de rodilla, sustituye Yin Ling Quan por Zu San Li. No retener la respiración si hay hipertensión.",
    estaciones: ESTACIONES_RETENCION,
  },
  {
    id: "digestiones-pesadas",
    titulo: "Digestiones Pesadas e Hinchazón",
    subtitulo: "Ejercicios para activar la digestión y aliviar la hinchazón",
    icono: "🌾",
    nota: "El masaje gastro-intestinal no se hace en embarazo ni en menstruación dolorosa. Practica al menos 1 hora después de una comida grande. Con úlcera activa o inflamación grave, consulta médica antes de empezar. El Wu Ji y la respiración son siempre seguros.",
    estaciones: ESTACIONES_DIGESTION,
  },
  {
    id: "menstruacion-menopausia",
    titulo: "Ciclos Femeninos",
    subtitulo: "Ejercicios para equilibrar el ciclo menstrual y acompañar la menopausia",
    icono: "🌙",
    nota: "San Yin Jiao y He Gu están contraindicados durante el embarazo. En sofocos muy intensos, evita los sonidos y prioriza la respiración larga y la visualización de agua. En reglas muy abundantes, sustituye el 2º movimiento del Ciervo por la postura del Árbol estática.",
    estaciones: ESTACIONES_MENSTRUACION,
  },
  {
    id: "ira-frustracion",
    titulo: "Ira, Enfado y Frustración",
    subtitulo: "Ejercicios para soltar la tensión, calmar la mente y liberar el enfado",
    icono: "🌿",
    nota: "En crisis de ira muy aguda, empieza directamente por las palmas sobre los ojos + Wu Ji, omitiendo el Tigre hasta calmarte. Con hipertensión, prioriza Wu Ji y el sonido Xu, que son siempre seguros. No confundas ira reactiva con ira crónica (posible depresión enmascarada): deriva si persiste.",
    estaciones: ESTACIONES_IRA,
  },
];

// =====================================================================
// MÓDULO (FR) — Fondamentaux (théorie uniquement : Qi Gong, Tao et MTC)
// =====================================================================
const ESTACIONES_FUNDAMENTOS_FR = [
  {
    id: 0,
    tipo: "intro",
    titulo: "Bienvenue dans les fondamentaux",
    sub: "Avant de commencer",
    free: true,
    icono: "☯",
    duracion: "3 min",
    videoId: "",
    audioArchivo: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Ce parcours est différent des autres : il ne contient ni mouvements ni points d'acupression. C'est uniquement de la théorie, pensée pour celles et ceux qui ne connaissent rien au Qi Gong ni à la médecine chinoise et qui veulent comprendre, en mots simples, ce qu'ils s'apprêtent à pratiquer. Quatre étapes courtes : qu'est-ce que le Qi Gong, qu'est-ce que le Qi, qu'est-ce que le Tao, et qu'est-ce que la médecine traditionnelle chinoise. Rien à mémoriser — juste à comprendre.",
      },
    ],
  },
  {
    id: 1,
    tipo: "practica",
    titulo: "Qu'est-ce que le Qi Gong ?",
    sub: "Étape 1",
    free: true,
    icono: "1",
    duracion: "4 min",
    videoId: "",
    audioArchivo: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Qi Gong (气功) se prononce approximativement « tchi kong ». C'est un mot composé : Qi signifie « énergie vitale » et Gong signifie « compétence cultivée par la pratique » — comme dans « Kung Fu », qui signifie littéralement « compétence acquise par l'effort et le temps ». Qi Gong veut donc dire, simplement : l'art de cultiver l'énergie vitale.",
      },
      {
        tipo: "texto",
        texto:
          "Dans la pratique, c'est bien plus simple que ça n'en a l'air : des mouvements lents, une respiration consciente et une attention calme, combinés. Pas besoin de croire en quoi que ce soit pour en ressentir les effets — c'est avant tout une façon de bouger et de respirer avec plus de conscience qu'au quotidien.",
      },
    ],
  },
  {
    id: 2,
    tipo: "practica",
    titulo: "Qu'est-ce que le Qi ?",
    sub: "Étape 2",
    free: true,
    icono: "2",
    duracion: "4 min",
    videoId: "",
    audioArchivo: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Le Qi (气) n'a pas de traduction exacte en français. On le traduit souvent par « énergie vitale » ou « force vitale », mais c'est davantage une idée qu'une chose : c'est ce qui distingue un corps vivant d'un corps sans vie. Un corps avec un bon Qi bouge, respire, récupère, digère, pense avec clarté. Quand le Qi est faible ou bloqué quelque part, apparaissent la fatigue, la lourdeur, la douleur ou le manque de clarté mentale.",
      },
      {
        tipo: "texto",
        texto:
          "Pas besoin d'y « croire » comme à une foi — tu peux simplement le comprendre comme une façon ancienne de décrire la vitalité du corps : la qualité de la circulation sanguine, de la respiration, de l'éveil de l'esprit. Le Qi Gong travaille précisément à faire circuler cette vitalité plus librement.",
      },
    ],
  },
  {
    id: 3,
    tipo: "practica",
    titulo: "Qu'est-ce que le Tao ?",
    sub: "Étape 3",
    free: true,
    icono: "3",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Le Tao (道), parfois écrit « Dao », signifie littéralement « la Voie ». Ce n'est ni une religion ni un ensemble de règles : c'est une façon d'observer comment fonctionne la nature — le jour devient la nuit, l'hiver devient le printemps, la marée monte et descend — et d'essayer de vivre en harmonie avec ce même rythme, plutôt qu'à contre-courant.",
      },
      {
        tipo: "texto",
        texto:
          "Le Tao contient l'idée du Yin et du Yang (阴阳) : deux forces opposées qui ont besoin l'une de l'autre et se transforment l'une en l'autre — le jour et la nuit, l'effort et le repos, le mouvement et l'immobilité. Aucune des deux n'est « meilleure » : la santé, selon cette idée, est l'équilibre entre les deux, non l'élimination de l'une d'elles.",
      },
      {
        tipo: "nota",
        titulo: "Une image simple",
        texto: "L'eau ne force pas son chemin vers le bas, et pourtant elle atteint toujours la mer. Le Tao, au fond, c'est cette même idée : couler sans forcer.",
      },
    ],
  },
  {
    id: 4,
    tipo: "practica",
    titulo: "La médecine traditionnelle chinoise",
    sub: "Étape 4 · Clôture",
    free: true,
    icono: "4",
    duracion: "5 min",
    videoId: "",
    audioArchivo: "",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La médecine traditionnelle chinoise (MTC) est un système de santé développé en Chine sur des milliers d'années. Son idée centrale est que le Qi circule dans le corps à travers des canaux appelés méridiens (une sorte de « rivières d'énergie » sous la peau). Quand le Qi circule bien dans ces canaux, il y a la santé. Quand il stagne, manque ou s'accumule en excès quelque part, un mal-être apparaît.",
      },
      {
        tipo: "texto",
        texto:
          "C'est de là que viennent les points d'acupression utilisés dans cette application : ce sont des endroits précis de ces canaux où, avec le bon massage, on peut aider le Qi à circuler plus librement.",
      },
      {
        tipo: "nota",
        titulo: "Une donnée vérifiée : l'OMS et la médecine traditionnelle",
        texto: "L'Organisation Mondiale de la Santé (OMS) dispose, depuis 2025, d'une Stratégie sur la Médecine Traditionnelle (2025-2034) qui reconnaît et encourage l'intégration de ces pratiques — y compris celles d'origine chinoise — dans les systèmes de santé, sous un cadre de preuves scientifiques. De plus, depuis 2022, la Classification Internationale des Maladies (CIM-11) inclut un chapitre consacré à la médecine traditionnelle. Cela ne signifie pas que l'OMS certifie chaque pratique comme traitement médical — cela signifie qu'elle reconnaît son importance réelle pour une grande partie de la population mondiale et travaille à ce qu'elle soit utilisée en sécurité et selon des critères clairs.",
      },
      {
        tipo: "nota",
        titulo: "Comment les trois s'articulent",
        texto: "Le Tao est la philosophie : comment comprendre le flux de la vie. La médecine traditionnelle chinoise est la carte : comment ce flux s'organise dans le corps. Et le Qi Gong est la pratique : ce que tu peux faire, avec ton corps et ta respiration, pour aider ce flux à mieux fonctionner. Les trois sont, au fond, la même idée vue sous trois angles différents.",
      },
    ],
  },
];

const MODULOS_FR = [
  {
    id: "fundamentos",
    titulo: "Fondamentaux",
    subtitulo: "Qu'est-ce que le Qi Gong, le Qi et le Tao — en mots simples",
    icono: "📖",
    estaciones: ESTACIONES_FUNDAMENTOS_FR,
  },
  {
    id: "longevidad",
    titulo: "Longévité",
    subtitulo: "Des mouvements doux pour cultiver énergie, souplesse et vitalité durable",
    icono: "☯",
    estaciones: ESTACIONES_LONGEVIDAD_FR,
  },
  {
    id: "falta-energia",
    titulo: "Manque d'Énergie et Fatigue",
    subtitulo: "Des exercices pour retrouver de l'énergie, réchauffer le corps et sortir de la fatigue chronique",
    icono: "🔥",
    nota: "En cas de fatigue extrême due à une maladie grave, commence seulement par 15-20 min (étapes 1, 5 et 6). Pendant la grossesse, évite la respiration paradoxale et les mouvements énergiques du Tigre. En cas d'hypertension, ne retiens pas ton souffle. Ne confonds pas une fatigue fonctionnelle avec une anémie ou une hypothyroïdie : oriente vers un médecin si cela persiste.",
    estaciones: ESTACIONES_ENERGIA_FR,
  },
  {
    id: "vitalidad-sexual",
    titulo: "Vitalité Sexuelle et Énergie Créative",
    subtitulo: "Des exercices pour nourrir l'énergie vitale, le désir et la créativité",
    icono: "✨",
    nota: "En cas d'inflammation ou d'infection génitale active, ne masse pas la zone sexuelle avant résolution médicale. Pendant la grossesse, évite la contraction prolongée du périnée et les mouvements énergiques. En cas d'hypertension sévère, évite la rétention du souffle. Ce parcours aborde l'énergie sexuelle sous un angle taoïste de santé, non comme une stimulation directe.",
    estaciones: ESTACIONES_VITALIDAD_FR,
  },
  {
    id: "retencion-liquidos",
    titulo: "Rétention d'Eau",
    subtitulo: "Des exercices pour drainer les liquides, alléger le corps et activer la digestion",
    icono: "💧",
    nota: "En cas d'œdème cardiaque ou rénal grave, consulte un médecin avant de pratiquer. Pendant la grossesse, évite He Gu et la respiration paradoxale. En cas d'inflammation aiguë du genou, remplace Yin Ling Quan par Zu San Li. Ne retiens pas la respiration en cas d'hypertension.",
    estaciones: ESTACIONES_RETENCION_FR,
  },
  {
    id: "digestiones-pesadas",
    titulo: "Digestions Lourdes et Ballonnements",
    subtitulo: "Des exercices pour activer la digestion et soulager les ballonnements",
    icono: "🌾",
    nota: "Le massage gastro-intestinal ne se pratique pas pendant la grossesse ni pendant des règles douloureuses. Pratique au moins 1 heure après un repas copieux. En cas d'ulcère actif ou d'inflammation grave, consulte un médecin avant de commencer. Le Wu Ji et la respiration sont toujours sûrs.",
    estaciones: ESTACIONES_DIGESTION_FR,
  },
  {
    id: "menstruacion-menopausia",
    titulo: "Cycles Féminins",
    subtitulo: "Des exercices pour équilibrer le cycle menstruel et accompagner la ménopause",
    icono: "🌙",
    nota: "San Yin Jiao et He Gu sont contre-indiqués pendant la grossesse. En cas de bouffées de chaleur très intenses, évite les sons et privilégie la respiration longue et la visualisation de l'eau. En cas de règles très abondantes, remplace le 2e mouvement du Cerf par la posture statique de l'Arbre.",
    estaciones: ESTACIONES_MENSTRUACION_FR,
  },
  {
    id: "ira-frustracion",
    titulo: "Colère, Énervement et Frustration",
    subtitulo: "Des exercices pour relâcher la tension, calmer l'esprit et libérer la colère",
    icono: "🌿",
    nota: "En cas de crise de colère très aiguë, commence directement par les paumes sur les yeux + Wu Ji, en omettant le Tigre jusqu'à ce que tu sois calme. En cas d'hypertension, privilégie Wu Ji et le son Xu, qui sont toujours sûrs. Ne confonds pas une colère réactive avec une colère chronique (possible dépression masquée) : oriente vers un professionnel si cela persiste.",
    estaciones: ESTACIONES_IRA_FR,
  },
];

// Recorridos anunciados pero todavía sin contenido — se muestran como "Próximamente"
const PROXIMOS_MODULOS_ES = [
  { id: "insomnio", titulo: "Insomnio", icono: "🌌" },
  { id: "estres-mental", titulo: "Estrés y Sobrecarga Mental", icono: "🧘" },
  { id: "mantenimiento-articular", titulo: "Mantenimiento Muscular y Articulaciones", icono: "🦴" },
];

const PROXIMOS_MODULOS_FR = [
  { id: "insomnio", titulo: "Insomnie", icono: "🌌" },
  { id: "estres-mental", titulo: "Stress et Surcharge Mentale", icono: "🧘" },
  { id: "mantenimiento-articular", titulo: "Entretien Musculaire et Articulaire", icono: "🦴" },
];

// El francés tiene ya contenido completo propio. Inglés y alemán, de
// momento, muestran el contenido en español hasta que se traduzcan.
const MODULOS_POR_IDIOMA = {
  es: MODULOS_ES,
  fr: MODULOS_FR,
  en: MODULOS_ES,
  de: MODULOS_ES,
};

const PROXIMOS_POR_IDIOMA = {
  es: PROXIMOS_MODULOS_ES,
  fr: PROXIMOS_MODULOS_FR,
  en: PROXIMOS_MODULOS_ES,
  de: PROXIMOS_MODULOS_ES,
};



// =====================================================================
// TRADUCCIONES — interfaz de la app (los recorridos y sesiones quedan
// en español por ahora; solo botones, pantallas y avisos se traducen)
// =====================================================================
const TRADUCCIONES = {
  es: {
    codigo: "ES",
    demoPremiumOn: "✓ Cuenta Premium activa",
    demoPremiumOff: "Modo demo: simular Premium",
    restorePurchase: "¿Ya eres Premium? Restaurar",
    manageSubscription: "Gestionar mi suscripción",
    logOut: "Cerrar sesión",
    howItWorks: "Cómo funciona",
    comoFuncionaTitulo: "Cómo funciona la app",
    comoFuncionaSubtitulo: "Una guía rápida antes de empezar.",
    queEsUnRecorridoTitulo: "¿Qué es un recorrido?",
    queEsUnRecorridoTexto: "Un recorrido acompaña un tema concreto — la fatiga, la retención de líquidos, una digestión pesada, el ciclo femenino... Dentro, avanzas paso a paso por un camino de sesiones cortas que combinan cuatro tipos de práctica:",
    practicaMovimientoTitulo: "Movimiento",
    practicaMovimientoTexto: "Secuencias suaves inspiradas en los animales del Qi Gong tradicional, explicadas paso a paso.",
    practicaRespiracionTitulo: "Respiración",
    practicaRespiracionTexto: "Técnicas de respiración y sonidos curativos para regular el sistema nervioso.",
    practicaAutomasajeTitulo: "Automasaje",
    practicaAutomasajeTexto: "Puntos de acupresión concretos, con imagen de referencia y técnica explicada.",
    practicaVisualizacionTitulo: "Visualización",
    practicaVisualizacionTexto: "Cierre guiado en audio para asentar la práctica y calmar la mente.",
    comoFuncionaPasosTitulo: "Cómo funciona, paso a paso",
    paso1: "Elige el recorrido que necesitas hoy: energía, calma, digestión, ciclo...",
    paso2: "Sigue el camino, sesión a sesión, a tu ritmo. Tu progreso se guarda solo.",
    paso3: "Practica guiada en vídeo y audio, en español o francés.",
    paso4: "Vuelve cuando quieras — 15-20 minutos al día, sostenidos en el tiempo, marcan la diferencia.",
    gratisTitulo: "Empieza gratis",
    gratisAviso: "Los Fundamentos completos, los 4 primeros Brocados de Longevidad, y la introducción + primera sesión de cualquier otro recorrido — todo esto, sin pagar nada.",
    gratisCta: "Pruébalo ahora mismo y descubre qué más puedes desbloquear más abajo ↓",
    comparativaTitulo: "Elige cómo acceder",
    proximamente: "Próximamente",
    planGratisTitulo: "Gratis",
    planGratisPrecio: "0 €",
    planGratisDesc: "La introducción y la 1ª sesión de cada recorrido, siempre disponibles.",
    planRecorridoTitulo: "Un recorrido",
    planRecorridoPrecio: "4,99 € pago único",
    planRecorridoDesc: "Acceso de por vida a un recorrido completo, a tu elección.",
    planCompletoTitulo: "Acceso completo",
    planCompletoPrecio: "19,99 € pago único",
    planCompletoDesc: "Acceso de por vida a todos los recorridos disponibles hoy. No incluye recorridos añadidos más adelante.",
    planSuscripcionDesc: "Todos los recorridos, incluidos los que se añadan en el futuro, mientras tu suscripción esté activa.",
    precioTitulo: "Suscripción mensual",
    precioPorMes: "al mes",
    precioCancela: "Cancela cuando quieras.",
    precioLista: [
      "Los 7 recorridos completos",
      "Vídeo y audio guiado por Bea",
      "Puntos de acupresión con imagen de referencia",
      "Disponible en español y francés",
      "Nuevos recorridos cada mes",
    ],
    comoFuncionaEmpezar: "Entendido, ¡empecemos!",
    volver: "Volver",
    compartir: "Compartir",
    compartirTexto: "Descubre \"QiGong Balance\" — recorridos de Qi Gong guiados en vídeo y audio, para recuperar energía y calma en solo 15-20 minutos al día.",
    compartirCopiado: "Enlace copiado. ¡Ya puedes pegarlo donde quieras!",
    restaurarNoEncontrado: "No hemos encontrado ninguna suscripción activa con ese email.",
    emailLabel: "Tu email",
    emailInvalido: "Escribe un email válido.",
    errorPago: "No se pudo iniciar el pago. Inténtalo de nuevo.",
    cargandoPago: "Conectando con el pago…",
    elegirOpcionDesc: "Elige cómo quieres acceder a este recorrido.",
    opcionRecorridoTitulo: "Este recorrido",
    opcionRecorridoPrecio: "4,99 €",
    opcionRecorridoDesc: "Pago único. Acceso de por vida a este recorrido.",
    opcionCompletoTitulo: "Acceso completo",
    opcionCompletoPrecio: "19,99 €",
    opcionCompletoDesc: "Pago único. Todos los recorridos disponibles hoy, de por vida.",
    opcionSuscripcionTitulo: "Suscripción",
    opcionSuscripcionPrecio: "6,99 €/mes",
    opcionSuscripcionDesc: "Todo, incluidas las novedades futuras. Cancela cuando quieras.",
    continuarPago: "Continuar al pago",
    reset: "Reiniciar",
    myJourneys: "Mis recorridos",
    chooseYourPractice: "Elige tu práctica",
    sessionsCompleted: (n, total) => `${n} de ${total} sesiones completadas`,
    comingSoon: "Próximamente",
    soon: "Pronto",
    disclaimerFooter: "Contenido preventivo y educativo. No sustituye diagnóstico ni tratamiento médico.",
    loadingProgress: "Cargando tu progreso…",
    journeyLabel: "Recorrido",
    freeDisclaimer: "La introducción y la 1ª práctica son gratis. Desbloquea el resto por recorrido, con el acceso completo, o con la suscripción.",
    markCompleted: "Marcar sesión como completada",
    premiumContentTitle: (titulo) => `"${titulo}" es contenido Premium`,
    premiumDesc: "Desbloquea todos los recorridos completos, con audio guiado y seguimiento de tu progreso.",
    premiumFeatures: ["Todos los recorridos y sesiones", "Audio guiado por Bea", "Contenido siempre actualizado"],
    premiumCta: "Hazte Premium — 6,99 € / mes",
    continueFree: "Seguir con el plan gratuito",
    avisoTitle: "Antes de empezar",
    avisoP1: "El contenido de esta aplicación tiene fines exclusivamente educativos y de bienestar general.",
    avisoP2Pre: "El Qi Gong y las prácticas aquí descritas son de carácter ",
    avisoP2Bold: "preventivo y complementario",
    avisoP2Post: ". No constituyen tratamiento médico, no diagnostican ninguna enfermedad y en ningún caso sustituyen la consulta, el diagnóstico o el tratamiento de un profesional sanitario.",
    avisoP3: "Si tienes una condición médica, estás embarazada o tienes dudas sobre tu salud, consulta con tu médico antes de practicar.",
    avisoP4: "El uso de esta aplicación es responsabilidad exclusiva de la persona que la practica. La autora no se hace responsable de un uso inadecuado del contenido.",
    avisoAccept: "He leído y entendido — Continuar",
    beneficiosTitle: "Los beneficios del Qi Gong",
    beneficiosSubtitle: "Una práctica milenaria, con efectos que se sienten desde la primera sesión.",
    benefit1Titulo: "Más energía y vitalidad",
    benefit1Texto: "Activa la circulación del qi y despierta una energía sostenida durante todo el día, sin altibajos.",
    benefit2Titulo: "Calma el sistema nervioso",
    benefit2Texto: "La respiración consciente y el movimiento lento regulan el estrés y devuelven la sensación de centro.",
    benefit3Titulo: "Cuerpo más flexible y presente",
    benefit3Texto: "Mejora el equilibrio, la movilidad articular y la conciencia corporal, incluso practicando poco tiempo.",
    beneficiosBoxPre: "Con solo ",
    beneficiosBoxBold: "15-20 minutos al día",
    beneficiosBoxPost: ", sostenidos en el tiempo, tu energía, tu cuerpo y tu calma interior mejoran muchísimo.",
    beneficiosCta: "Empezar mi práctica",
  },
  fr: {
    codigo: "FR",
    demoPremiumOn: "✓ Compte Premium actif",
    demoPremiumOff: "Mode démo : simuler Premium",
    restorePurchase: "Déjà Premium ? Restaurer",
    manageSubscription: "Gérer mon abonnement",
    logOut: "Se déconnecter",
    howItWorks: "Comment ça marche",
    comoFuncionaTitulo: "Comment fonctionne l'application",
    comoFuncionaSubtitulo: "Un guide rapide avant de commencer.",
    queEsUnRecorridoTitulo: "Qu'est-ce qu'un parcours ?",
    queEsUnRecorridoTexto: "Un parcours accompagne un thème précis — la fatigue, la rétention d'eau, une digestion lourde, le cycle féminin... À l'intérieur, tu avances étape par étape sur un chemin de séances courtes qui combinent quatre types de pratique :",
    practicaMovimientoTitulo: "Mouvement",
    practicaMovimientoTexto: "Des séquences douces inspirées des animaux du Qi Gong traditionnel, expliquées étape par étape.",
    practicaRespiracionTitulo: "Respiration",
    practicaRespiracionTexto: "Des techniques de respiration et des sons curatifs pour réguler le système nerveux.",
    practicaAutomasajeTitulo: "Automassage",
    practicaAutomasajeTexto: "Des points d'acupression précis, avec une image de référence et la technique expliquée.",
    practicaVisualizacionTitulo: "Visualisation",
    practicaVisualizacionTexto: "Une clôture guidée en audio pour ancrer la pratique et calmer l'esprit.",
    comoFuncionaPasosTitulo: "Comment ça marche, étape par étape",
    paso1: "Choisis le parcours dont tu as besoin aujourd'hui : énergie, calme, digestion, cycle...",
    paso2: "Suis le chemin, séance après séance, à ton rythme. Ta progression se sauvegarde seule.",
    paso3: "Pratique guidée en vidéo et audio, en espagnol ou en français.",
    paso4: "Reviens quand tu veux — 15-20 minutes par jour, pratiquées régulièrement, font la différence.",
    gratisTitulo: "Commence gratuitement",
    gratisAviso: "Les Fondamentaux complets, les 4 premiers Brocarts de Longévité, et l'introduction + la 1ère séance de n'importe quel autre parcours — tout cela, sans rien payer.",
    gratisCta: "Essaie dès maintenant et découvre ce que tu peux débloquer plus bas ↓",
    comparativaTitulo: "Choisis ton accès",
    proximamente: "Bientôt",
    planGratisTitulo: "Gratuit",
    planGratisPrecio: "0 €",
    planGratisDesc: "L'introduction et la 1ère séance de chaque parcours, toujours disponibles.",
    planRecorridoTitulo: "Un parcours",
    planRecorridoPrecio: "4,99 € paiement unique",
    planRecorridoDesc: "Accès à vie à un parcours complet, au choix.",
    planCompletoTitulo: "Accès complet",
    planCompletoPrecio: "19,99 € paiement unique",
    planCompletoDesc: "Accès à vie à tous les parcours disponibles aujourd'hui. N'inclut pas les parcours ajoutés plus tard.",
    planSuscripcionDesc: "Tous les parcours, y compris ceux ajoutés à l'avenir, tant que ton abonnement est actif.",
    precioTitulo: "Abonnement mensuel",
    precioPorMes: "par mois",
    precioCancela: "Annule quand tu veux.",
    precioLista: [
      "Les 7 parcours complets",
      "Vidéo et audio guidés par Bea",
      "Points d'acupression avec image de référence",
      "Disponible en espagnol et en français",
      "Nouveaux parcours chaque mois",
    ],
    comoFuncionaEmpezar: "Compris, commençons !",
    volver: "Retour",
    compartir: "Partager",
    compartirTexto: "Découvre « QiGong Balance » — des parcours de Qi Gong guidés en vidéo et audio, pour retrouver énergie et calme en seulement 15-20 minutes par jour.",
    compartirCopiado: "Lien copié. Tu peux le coller où tu veux !",
    restaurarNoEncontrado: "Aucun abonnement actif trouvé avec cet email.",
    emailLabel: "Ton email",
    emailInvalido: "Saisis un email valide.",
    errorPago: "Impossible de démarrer le paiement. Réessaie.",
    cargandoPago: "Connexion au paiement…",
    elegirOpcionDesc: "Choisis comment tu veux accéder à ce parcours.",
    opcionRecorridoTitulo: "Ce parcours",
    opcionRecorridoPrecio: "4,99 €",
    opcionRecorridoDesc: "Paiement unique. Accès à vie à ce parcours.",
    opcionCompletoTitulo: "Accès complet",
    opcionCompletoPrecio: "19,99 €",
    opcionCompletoDesc: "Paiement unique. Tous les parcours disponibles aujourd'hui, à vie.",
    opcionSuscripcionTitulo: "Abonnement",
    opcionSuscripcionPrecio: "6,99 €/mois",
    opcionSuscripcionDesc: "Tout, y compris les nouveautés futures. Annule quand tu veux.",
    continuarPago: "Continuer vers le paiement",
    reset: "Réinitialiser",
    myJourneys: "Mes parcours",
    chooseYourPractice: "Choisissez votre pratique",
    sessionsCompleted: (n, total) => `${n} sur ${total} séances terminées`,
    comingSoon: "Bientôt disponible",
    soon: "Bientôt",
    disclaimerFooter: "Contenu préventif et éducatif. Ne remplace pas un diagnostic ou un traitement médical.",
    loadingProgress: "Chargement de votre progression…",
    journeyLabel: "Parcours",
    freeDisclaimer: "L'introduction et la 1ère pratique sont gratuites. Débloque le reste à l'unité, avec l'accès complet, ou avec l'abonnement.",
    markCompleted: "Marquer la séance comme terminée",
    premiumContentTitle: (titulo) => `« ${titulo} » est un contenu Premium`,
    premiumDesc: "Débloquez tous les parcours complets, avec audio guidé et suivi de votre progression.",
    premiumFeatures: ["Tous les parcours et séances", "Audio guidé par Bea", "Contenu toujours mis à jour"],
    premiumCta: "Devenir Premium — 6,99 € / mois",
    continueFree: "Continuer avec la version gratuite",
    avisoTitle: "Avant de commencer",
    avisoP1: "Le contenu de cette application a un but exclusivement éducatif et de bien-être général.",
    avisoP2Pre: "Le Qi Gong et les pratiques décrites ici sont de nature ",
    avisoP2Bold: "préventive et complémentaire",
    avisoP2Post: ". Elles ne constituent pas un traitement médical, ne diagnostiquent aucune maladie et ne remplacent en aucun cas la consultation, le diagnostic ou le traitement d'un professionnel de santé.",
    avisoP3: "Si vous avez une condition médicale, si vous êtes enceinte ou en cas de doute sur votre santé, consultez votre médecin avant de pratiquer.",
    avisoP4: "L'utilisation de cette application relève de la seule responsabilité de la personne qui la pratique. L'auteure ne peut être tenue responsable d'un usage inapproprié du contenu.",
    avisoAccept: "J'ai lu et compris — Continuer",
    beneficiosTitle: "Les bienfaits du Qi Gong",
    beneficiosSubtitle: "Une pratique millénaire, dont les effets se ressentent dès la première séance.",
    benefit1Titulo: "Plus d'énergie et de vitalité",
    benefit1Texto: "Active la circulation du qi et procure une énergie stable tout au long de la journée, sans à-coups.",
    benefit2Titulo: "Apaise le système nerveux",
    benefit2Texto: "La respiration consciente et le mouvement lent régulent le stress et restaurent le sentiment de centrage.",
    benefit3Titulo: "Un corps plus souple et plus présent",
    benefit3Texto: "Améliore l'équilibre, la mobilité articulaire et la conscience corporelle, même en peu de temps.",
    beneficiosBoxPre: "Avec seulement ",
    beneficiosBoxBold: "15 à 20 minutes par jour",
    beneficiosBoxPost: ", pratiquées régulièrement, votre énergie, votre corps et votre calme intérieur s'améliorent considérablement.",
    beneficiosCta: "Commencer ma pratique",
  },
  en: {
    codigo: "EN",
    demoPremiumOn: "✓ Premium account active",
    demoPremiumOff: "Demo mode: simulate Premium",
    restorePurchase: "Already Premium? Restore",
    manageSubscription: "Manage my subscription",
    logOut: "Log out",
    howItWorks: "How it works",
    comoFuncionaTitulo: "How the app works",
    comoFuncionaSubtitulo: "A quick guide before you start.",
    queEsUnRecorridoTitulo: "What's a journey?",
    queEsUnRecorridoTexto: "A journey addresses a specific topic — fatigue, water retention, heavy digestion, the menstrual cycle... Inside, you move step by step along a path of short sessions that combine four types of practice:",
    practicaMovimientoTitulo: "Movement",
    practicaMovimientoTexto: "Gentle sequences inspired by traditional Qi Gong animals, explained step by step.",
    practicaRespiracionTitulo: "Breathing",
    practicaRespiracionTexto: "Breathing techniques and healing sounds to regulate the nervous system.",
    practicaAutomasajeTitulo: "Self-massage",
    practicaAutomasajeTexto: "Specific acupressure points, with a reference image and technique explained.",
    practicaVisualizacionTitulo: "Visualization",
    practicaVisualizacionTexto: "A guided audio closing to settle the practice and calm the mind.",
    comoFuncionaPasosTitulo: "How it works, step by step",
    paso1: "Choose the journey you need today: energy, calm, digestion, cycle...",
    paso2: "Follow the path, session by session, at your own pace. Your progress saves itself.",
    paso3: "Guided practice in video and audio, in Spanish or French.",
    paso4: "Come back whenever you like — 15-20 minutes a day, practiced consistently, make the difference.",
    gratisTitulo: "Start for free",
    gratisAviso: "The complete Fundamentals, the first 4 Longevity Brocades, and the introduction + first session of any other journey — all free, no payment needed.",
    gratisCta: "Try it now and see what else you can unlock below ↓",
    comparativaTitulo: "Choose how to access",
    proximamente: "Coming soon",
    planGratisTitulo: "Free",
    planGratisPrecio: "€0",
    planGratisDesc: "The introduction and 1st session of every journey, always available.",
    planRecorridoTitulo: "One journey",
    planRecorridoPrecio: "€4.99 one-time",
    planRecorridoDesc: "Lifetime access to one complete journey of your choice.",
    planCompletoTitulo: "Full access",
    planCompletoPrecio: "€19.99 one-time",
    planCompletoDesc: "Lifetime access to all journeys available today. Doesn't include journeys added later.",
    planSuscripcionDesc: "All journeys, including ones added in the future, while your subscription is active.",
    precioTitulo: "Monthly subscription",
    precioPorMes: "per month",
    precioCancela: "Cancel anytime.",
    precioLista: [
      "All 7 complete journeys",
      "Video and audio guided by Bea",
      "Acupressure points with reference images",
      "Available in Spanish and French",
      "New journeys every month",
    ],
    comoFuncionaEmpezar: "Got it, let's start!",
    volver: "Back",
    compartir: "Share",
    compartirTexto: "Discover \"QiGong Balance\" — guided Qi Gong journeys in video and audio, to restore energy and calm in just 15-20 minutes a day.",
    compartirCopiado: "Link copied. You can paste it anywhere now!",
    restaurarNoEncontrado: "We couldn't find an active subscription with that email.",
    emailLabel: "Your email",
    emailInvalido: "Enter a valid email.",
    errorPago: "Couldn't start the payment. Try again.",
    cargandoPago: "Connecting to payment…",
    elegirOpcionDesc: "Choose how you'd like to access this journey.",
    opcionRecorridoTitulo: "This journey",
    opcionRecorridoPrecio: "€4.99",
    opcionRecorridoDesc: "One-time payment. Lifetime access to this journey.",
    opcionCompletoTitulo: "Full access",
    opcionCompletoPrecio: "€19.99",
    opcionCompletoDesc: "One-time payment. All journeys available today, for life.",
    opcionSuscripcionTitulo: "Subscription",
    opcionSuscripcionPrecio: "€6.99/mo",
    opcionSuscripcionDesc: "Everything, including future additions. Cancel anytime.",
    continuarPago: "Continue to payment",
    reset: "Reset",
    myJourneys: "My journeys",
    chooseYourPractice: "Choose your practice",
    sessionsCompleted: (n, total) => `${n} of ${total} sessions completed`,
    comingSoon: "Coming soon",
    soon: "Soon",
    disclaimerFooter: "Preventive and educational content. Not a substitute for medical diagnosis or treatment.",
    loadingProgress: "Loading your progress…",
    journeyLabel: "Journey",
    freeDisclaimer: "The introduction and 1st practice are free. Unlock the rest per journey, with full access, or with a subscription.",
    markCompleted: "Mark session as completed",
    premiumContentTitle: (titulo) => `"${titulo}" is Premium content`,
    premiumDesc: "Unlock all complete journeys, with guided audio and progress tracking.",
    premiumFeatures: ["All journeys and sessions", "Audio guided by Bea", "Always up-to-date content"],
    premiumCta: "Go Premium — €6.99 / month",
    continueFree: "Continue with the free plan",
    avisoTitle: "Before you begin",
    avisoP1: "The content of this app is for educational and general wellness purposes only.",
    avisoP2Pre: "Qi Gong and the practices described here are ",
    avisoP2Bold: "preventive and complementary",
    avisoP2Post: " in nature. They do not constitute medical treatment, do not diagnose any illness, and are never a substitute for consultation, diagnosis, or treatment by a healthcare professional.",
    avisoP3: "If you have a medical condition, are pregnant, or have any doubts about your health, consult your doctor before practicing.",
    avisoP4: "Use of this app is the sole responsibility of the person practicing. The author is not liable for improper use of the content.",
    avisoAccept: "I have read and understood — Continue",
    beneficiosTitle: "The benefits of Qi Gong",
    beneficiosSubtitle: "An ancient practice, with effects you can feel from the very first session.",
    benefit1Titulo: "More energy and vitality",
    benefit1Texto: "Activates qi circulation and provides steady energy throughout the day, without crashes.",
    benefit2Titulo: "Calms the nervous system",
    benefit2Texto: "Conscious breathing and slow movement regulate stress and restore a sense of center.",
    benefit3Titulo: "A more flexible, present body",
    benefit3Texto: "Improves balance, joint mobility, and body awareness, even with little practice time.",
    beneficiosBoxPre: "With just ",
    beneficiosBoxBold: "15-20 minutes a day",
    beneficiosBoxPost: ", practiced consistently, your energy, body, and inner calm improve enormously.",
    beneficiosCta: "Start my practice",
  },
  de: {
    codigo: "DE",
    demoPremiumOn: "✓ Premium-Konto aktiv",
    demoPremiumOff: "Demo-Modus: Premium simulieren",
    restorePurchase: "Bereits Premium? Wiederherstellen",
    manageSubscription: "Abo verwalten",
    logOut: "Abmelden",
    howItWorks: "So funktioniert's",
    comoFuncionaTitulo: "So funktioniert die App",
    comoFuncionaSubtitulo: "Eine kurze Anleitung, bevor es losgeht.",
    queEsUnRecorridoTitulo: "Was ist ein Programm?",
    queEsUnRecorridoTexto: "Ein Programm begleitet ein konkretes Thema — Erschöpfung, Wassereinlagerungen, schwere Verdauung, den weiblichen Zyklus... Darin gehst du Schritt für Schritt einen Weg aus kurzen Sitzungen, die vier Übungsarten kombinieren:",
    practicaMovimientoTitulo: "Bewegung",
    practicaMovimientoTexto: "Sanfte Abläufe, inspiriert von den Tieren des traditionellen Qi Gong, Schritt für Schritt erklärt.",
    practicaRespiracionTitulo: "Atmung",
    practicaRespiracionTexto: "Atemtechniken und heilende Laute zur Regulierung des Nervensystems.",
    practicaAutomasajeTitulo: "Selbstmassage",
    practicaAutomasajeTexto: "Konkrete Akupressurpunkte, mit Referenzbild und erklärter Technik.",
    practicaVisualizacionTitulo: "Visualisierung",
    practicaVisualizacionTexto: "Ein geführter Audio-Abschluss, um die Übung zu verankern und den Geist zu beruhigen.",
    comoFuncionaPasosTitulo: "So funktioniert's, Schritt für Schritt",
    paso1: "Wähle das Programm, das du heute brauchst: Energie, Ruhe, Verdauung, Zyklus...",
    paso2: "Folge dem Weg, Sitzung für Sitzung, in deinem Tempo. Dein Fortschritt speichert sich von selbst.",
    paso3: "Geführte Praxis in Video und Audio, auf Spanisch oder Französisch.",
    paso4: "Komm zurück, wann du willst — 15-20 Minuten täglich, dauerhaft praktiziert, machen den Unterschied.",
    gratisTitulo: "Kostenlos starten",
    gratisAviso: "Die vollständigen Grundlagen, die ersten 4 Brokate von Langlebigkeit, und die Einführung + 1. Sitzung jedes anderen Programms — alles kostenlos.",
    gratisCta: "Probier es gleich aus und entdecke, was du weiter unten freischalten kannst ↓",
    comparativaTitulo: "Wähle deinen Zugang",
    proximamente: "Demnächst",
    planGratisTitulo: "Kostenlos",
    planGratisPrecio: "0 €",
    planGratisDesc: "Die Einführung und die 1. Sitzung jedes Programms, immer verfügbar.",
    planRecorridoTitulo: "Ein Programm",
    planRecorridoPrecio: "4,99 € einmalig",
    planRecorridoDesc: "Lebenslanger Zugang zu einem vollständigen Programm deiner Wahl.",
    planCompletoTitulo: "Voller Zugang",
    planCompletoPrecio: "19,99 € einmalig",
    planCompletoDesc: "Lebenslanger Zugang zu allen heute verfügbaren Programmen. Später hinzugefügte Programme sind nicht enthalten.",
    planSuscripcionDesc: "Alle Programme, einschließlich zukünftig hinzugefügter, solange dein Abo aktiv ist.",
    precioTitulo: "Monatsabo",
    precioPorMes: "pro Monat",
    precioCancela: "Jederzeit kündbar.",
    precioLista: [
      "Alle 7 vollständigen Programme",
      "Video und Audio geführt von Bea",
      "Akupressurpunkte mit Referenzbild",
      "Verfügbar auf Spanisch und Französisch",
      "Neue Programme jeden Monat",
    ],
    comoFuncionaEmpezar: "Verstanden, los geht's!",
    volver: "Zurück",
    compartir: "Teilen",
    compartirTexto: "Entdecke „QiGong Balance\" — geführte Qi-Gong-Programme in Video und Audio, um in nur 15-20 Minuten am Tag Energie und Ruhe zurückzugewinnen.",
    compartirCopiado: "Link kopiert. Du kannst ihn jetzt überall einfügen!",
    restaurarNoEncontrado: "Wir haben kein aktives Abo mit dieser E-Mail gefunden.",
    emailLabel: "Deine E-Mail",
    emailInvalido: "Gib eine gültige E-Mail ein.",
    errorPago: "Zahlung konnte nicht gestartet werden. Versuch es erneut.",
    cargandoPago: "Verbindung zur Zahlung…",
    elegirOpcionDesc: "Wähle, wie du auf dieses Programm zugreifen möchtest.",
    opcionRecorridoTitulo: "Dieses Programm",
    opcionRecorridoPrecio: "4,99 €",
    opcionRecorridoDesc: "Einmalzahlung. Lebenslanger Zugang zu diesem Programm.",
    opcionCompletoTitulo: "Voller Zugang",
    opcionCompletoPrecio: "19,99 €",
    opcionCompletoDesc: "Einmalzahlung. Alle heute verfügbaren Programme, lebenslang.",
    opcionSuscripcionTitulo: "Abo",
    opcionSuscripcionPrecio: "6,99 €/Monat",
    opcionSuscripcionDesc: "Alles, inklusive zukünftiger Ergänzungen. Jederzeit kündbar.",
    continuarPago: "Weiter zur Zahlung",
    reset: "Zurücksetzen",
    myJourneys: "Meine Programme",
    chooseYourPractice: "Wähle deine Übung",
    sessionsCompleted: (n, total) => `${n} von ${total} Sitzungen abgeschlossen`,
    comingSoon: "Bald verfügbar",
    soon: "Bald",
    disclaimerFooter: "Präventiver und pädagogischer Inhalt. Kein Ersatz für ärztliche Diagnose oder Behandlung.",
    loadingProgress: "Dein Fortschritt wird geladen…",
    journeyLabel: "Programm",
    freeDisclaimer: "Die Einführung und die 1. Übung sind kostenlos. Schalte den Rest einzeln, mit vollem Zugang oder mit einem Abo frei.",
    markCompleted: "Sitzung als abgeschlossen markieren",
    premiumContentTitle: (titulo) => `„${titulo}" ist Premium-Inhalt`,
    premiumDesc: "Schalte alle vollständigen Programme frei, mit geführtem Audio und Fortschrittsverfolgung.",
    premiumFeatures: ["Alle Programme und Sitzungen", "Audio-Anleitung von Bea", "Immer aktualisierte Inhalte"],
    premiumCta: "Premium werden — 6,99 € / Monat",
    continueFree: "Mit dem kostenlosen Plan fortfahren",
    avisoTitle: "Bevor du beginnst",
    avisoP1: "Die Inhalte dieser App dienen ausschließlich Bildungs- und allgemeinen Wellnesszwecken.",
    avisoP2Pre: "Qi Gong und die hier beschriebenen Übungen sind ",
    avisoP2Bold: "präventiver und ergänzender Natur",
    avisoP2Post: ". Sie stellen keine medizinische Behandlung dar, diagnostizieren keine Krankheit und ersetzen in keinem Fall die Beratung, Diagnose oder Behandlung durch eine medizinische Fachkraft.",
    avisoP3: "Wenn du eine Erkrankung hast, schwanger bist oder Zweifel an deiner Gesundheit hast, konsultiere vor der Praxis deinen Arzt.",
    avisoP4: "Die Nutzung dieser App liegt in der alleinigen Verantwortung der ausübenden Person. Die Autorin haftet nicht für eine unsachgemäße Nutzung der Inhalte.",
    avisoAccept: "Ich habe gelesen und verstanden — Weiter",
    beneficiosTitle: "Die Vorteile von Qi Gong",
    beneficiosSubtitle: "Eine jahrtausendealte Praxis, deren Wirkung man schon ab der ersten Sitzung spürt.",
    benefit1Titulo: "Mehr Energie und Vitalität",
    benefit1Texto: "Aktiviert den Qi-Fluss und sorgt für gleichmäßige Energie über den ganzen Tag, ohne Einbrüche.",
    benefit2Titulo: "Beruhigt das Nervensystem",
    benefit2Texto: "Bewusste Atmung und langsame Bewegung regulieren Stress und stellen das Gefühl der inneren Mitte wieder her.",
    benefit3Titulo: "Ein beweglicherer, präsenterer Körper",
    benefit3Texto: "Verbessert Gleichgewicht, Gelenkbeweglichkeit und Körperbewusstsein, selbst bei kurzer Übungszeit.",
    beneficiosBoxPre: "Schon mit ",
    beneficiosBoxBold: "15-20 Minuten täglich",
    beneficiosBoxPost: ", dauerhaft praktiziert, verbessern sich deine Energie, dein Körper und deine innere Ruhe enorm.",
    beneficiosCta: "Meine Praxis beginnen",
  },
};

// Selector de idioma — pequeño y reutilizable
function SelectorIdioma({ idioma, onCambiar, oscuro }) {
  const idiomas = ["es", "fr"]; // "en" y "de" se añadirán cuando su contenido esté traducido
  return (
    <div className="flex gap-1.5">
      {idiomas.map((code) => (
        <button
          key={code}
          onClick={() => onCambiar(code)}
          className="text-[10px] px-2 py-1 rounded-full border uppercase"
          style={{
            fontFamily: "system-ui",
            fontWeight: idioma === code ? 700 : 400,
            borderColor: idioma === code ? "#C9912A" : oscuro ? "rgba(246,241,228,0.3)" : "#D8CBA8",
            color: idioma === code ? "#C9912A" : oscuro ? "rgba(246,241,228,0.7)" : "#9A8158",
            background: idioma === code ? "rgba(201,145,42,0.12)" : "transparent",
          }}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default function QigongApp() {
  const [vista, setVista] = useState("modulos"); // modulos | recorrido | sesion | paywall
  const [moduloActivo, setModuloActivo] = useState(null);
  const [activa, setActiva] = useState(null);
  const [completadas, setCompletadas] = useState({});
  const [premium, setPremium] = useState(false);
  const [accesoCompleto, setAccesoCompleto] = useState(false);
  const [recorridosComprados, setRecorridosComprados] = useState([]);
  const [email, setEmail] = useState("");
  const [comprobandoPremium, setComprobandoPremium] = useState(false);
  const [avisoAceptado, setAvisoAceptado] = useState(false);
  const [introVista, setIntroVista] = useState(false);
  const [comoFuncionaOnboardingVista, setComoFuncionaOnboardingVista] = useState(false);
  const [idioma, setIdioma] = useState("es");
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem("progreso-qigong");
      if (guardado) {
        const datos = JSON.parse(guardado);
        // El progreso de sesiones completadas ya no se recuerda a propósito:
        // cada vez que se abre la app, los recorridos empiezan "sin hacer",
        // para poder repetirlos con la misma sensación de primera vez.
        if (typeof datos.premium === "boolean") setPremium(datos.premium);
        if (typeof datos.accesoCompleto === "boolean") setAccesoCompleto(datos.accesoCompleto);
        if (Array.isArray(datos.recorridosComprados)) setRecorridosComprados(datos.recorridosComprados);
        if (typeof datos.email === "string") setEmail(datos.email);
        if (typeof datos.avisoAceptado === "boolean") setAvisoAceptado(datos.avisoAceptado);
        if (typeof datos.introVista === "boolean") setIntroVista(datos.introVista);
        if (typeof datos.comoFuncionaOnboardingVista === "boolean") setComoFuncionaOnboardingVista(datos.comoFuncionaOnboardingVista);
        if (typeof datos.idioma === "string") setIdioma(datos.idioma);
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
      localStorage.setItem("progreso-qigong", JSON.stringify({ premium, accesoCompleto, recorridosComprados, email, avisoAceptado, introVista, comoFuncionaOnboardingVista, idioma }));
    } catch (e) {}
  }, [premium, accesoCompleto, recorridosComprados, email, avisoAceptado, introVista, comoFuncionaOnboardingVista, idioma, cargado]);

  // Comprueba en Stripe si el email guardado tiene una suscripción activa
  const comprobarPremium = async (correo) => {
    if (!correo) return false;
    setComprobandoPremium(true);
    try {
      const resp = await fetch(`/api/check-subscription?email=${encodeURIComponent(correo)}`);
      const datos = await resp.json();
      const esPremium = !!datos.premium;
      const esAccesoCompleto = !!datos.accesoCompleto;
      const comprados = Array.isArray(datos.recorridosComprados) ? datos.recorridosComprados : [];
      setPremium(esPremium);
      setAccesoCompleto(esAccesoCompleto);
      setRecorridosComprados(comprados);
      return esPremium || esAccesoCompleto || comprados.length > 0;
    } catch (e) {
      // Si falla la comprobación, no cambiamos el estado actual
      return false;
    } finally {
      setComprobandoPremium(false);
    }
  };

  // ¿Está desbloqueado este recorrido? — por suscripción, por acceso
  // completo (si estaba incluido en el momento de esa compra), o por
  // haberlo comprado suelto.
  const moduloDesbloqueado = (moduloId) => {
    if (premium) return true;
    if (accesoCompleto && FULL_ACCESS_MODULE_IDS.includes(moduloId)) return true;
    if (recorridosComprados.includes(moduloId)) return true;
    return false;
  };

  // Al volver de Stripe (?premium=exito) o al abrir la app con un email
  // guardado, comprobamos el estado real de la suscripción
  useEffect(() => {
    if (!cargado) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "exito") {
      comprobarPremium(email);
      window.history.replaceState({}, "", window.location.pathname);
    } else if (email) {
      comprobarPremium(email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargado]);

  const compartirApp = async () => {
    const datos = {
      title: "QiGong Balance",
      text: t.compartirTexto,
      url: "https://aritmodetao.vercel.app",
    };
    try {
      if (navigator.share) {
        await navigator.share(datos);
      } else {
        await navigator.clipboard.writeText(datos.url);
        alert(t.compartirCopiado);
      }
    } catch (e) {
      // El usuario canceló el panel de compartir, no hacemos nada
    }
  };

  const abrirModulo = (modulo) => {
    setModuloActivo(modulo);
    setVista("recorrido");
  };

  const abrirEstacion = (estacion) => {
    const desbloqueado = estacion.free || (moduloActivo && moduloDesbloqueado(moduloActivo.id));
    if (!desbloqueado) {
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

  const t = TRADUCCIONES[idioma] || TRADUCCIONES.es;
  const modulosActivos = MODULOS_POR_IDIOMA[idioma] || MODULOS_ES;
  const proximosActivos = PROXIMOS_POR_IDIOMA[idioma] || PROXIMOS_MODULOS_ES;

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
              {t.loadingProgress}
            </p>
          </div>
        ) : !avisoAceptado ? (
          <AvisoMedico t={t} idioma={idioma} onCambiarIdioma={setIdioma} onAceptar={() => setAvisoAceptado(true)} />
        ) : !introVista ? (
          <Beneficios t={t} idioma={idioma} onCambiarIdioma={setIdioma} onContinuar={() => setIntroVista(true)} />
        ) : !comoFuncionaOnboardingVista ? (
          <ComoFunciona
            t={t}
            onContinuar={() => setComoFuncionaOnboardingVista(true)}
            textoBoton={t.comoFuncionaEmpezar}
          />
        ) : (
          <>
            {vista === "comofunciona" && (
              <ComoFunciona
                t={t}
                onContinuar={() => setVista("modulos")}
                textoBoton={t.volver}
              />
            )}
            {vista === "modulos" && (
              <Modulos
                modulos={modulosActivos}
                proximos={proximosActivos}
                completadas={completadas}
                premium={premium}
                comprobando={comprobandoPremium}
                t={t}
                idioma={idioma}
                onCambiarIdioma={setIdioma}
                onAbrir={abrirModulo}
                onAbrirComoFunciona={() => setVista("comofunciona")}
                onCompartir={compartirApp}
                onRestaurar={async (correo) => {
                  setEmail(correo);
                  return await comprobarPremium(correo);
                }}
                onCerrarSesion={() => {
                  setPremium(false);
                  setAccesoCompleto(false);
                  setRecorridosComprados([]);
                  setEmail("");
                }}
                onReiniciar={() => {
                  setCompletadas({});
                  setPremium(false);
                  setAccesoCompleto(false);
                  setRecorridosComprados([]);
                  setEmail("");
                }}
              />
            )}
            {vista === "recorrido" && moduloActivo && (
              <Recorrido
                modulo={moduloActivo}
                completadas={completadas[moduloActivo.id] || []}
                premium={moduloDesbloqueado(moduloActivo.id)}
                t={t}
                onAbrir={abrirEstacion}
                onVolver={() => setVista("modulos")}
              />
            )}
            {vista === "sesion" && activa && (
              <Sesion estacion={activa} t={t} onCerrar={() => setVista("recorrido")} onCompletar={completar} />
            )}
            {vista === "paywall" && activa && (
              <Paywall
                estacion={activa}
                moduloId={moduloActivo ? moduloActivo.id : ""}
                t={t}
                emailInicial={email}
                onEmailConfirmado={setEmail}
                onCerrar={() => setVista("recorrido")}
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
function AvisoMedico({ onAceptar, t, idioma, onCambiarIdioma }) {
  return (
    <div className="min-h-screen flex flex-col justify-center px-7 py-10" style={{ background: "#F6F1E4" }}>
      <div className="flex justify-center mb-4">
        <SelectorIdioma idioma={idioma} onCambiar={onCambiarIdioma} oscuro={false} />
      </div>
      <div className="flex justify-center mb-6">
        <Taijitu />
      </div>
      <h2 className="text-xl text-center mb-5" style={{ color: "#1B2A4A" }}>
        {t.avisoTitle}
      </h2>
      <div
        className="rounded-2xl p-5 mb-6 flex flex-col gap-3"
        style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
      >
        <div className="flex gap-2.5">
          <AlertTriangle size={18} color="#9A6B1A" className="shrink-0 mt-0.5" />
          <p className="text-[13.5px] leading-relaxed" style={{ color: "#3A3024", fontFamily: "system-ui" }}>
            {t.avisoP1}
          </p>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          {t.avisoP2Pre}<strong style={{ color: "#3A3024" }}>{t.avisoP2Bold}</strong>{t.avisoP2Post}
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          {t.avisoP3}
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          {t.avisoP4}
        </p>
      </div>
      <button
        onClick={onAceptar}
        className="w-full py-3.5 rounded-full"
        style={{ background: "#1B2A4A", color: "#F6F1E4", fontFamily: "system-ui", fontWeight: 600 }}
      >
        {t.avisoAccept}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Beneficios del Qi Gong (introducción, una sola vez)
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// Pantalla: Cómo funciona (presentación de la app y los recorridos)
// ---------------------------------------------------------------------
function ComoFunciona({ t, onContinuar, textoBoton }) {
  const practicas = [
    { icono: <Sparkles size={18} />, titulo: t.practicaMovimientoTitulo, texto: t.practicaMovimientoTexto },
    { icono: <Wind size={18} />, titulo: t.practicaRespiracionTitulo, texto: t.practicaRespiracionTexto },
    { icono: <Hand size={18} />, titulo: t.practicaAutomasajeTitulo, texto: t.practicaAutomasajeTexto },
    { icono: <Eye size={18} />, titulo: t.practicaVisualizacionTitulo, texto: t.practicaVisualizacionTexto },
  ];

  const pasos = [t.paso1, t.paso2, t.paso3, t.paso4];

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: "#F6F1E4" }}>
      <div
        className="px-7 pt-10 pb-9 text-center"
        style={{ background: "linear-gradient(180deg,#16243C 0%,#1B2A4A 100%)" }}
      >
        <div className="flex justify-center mb-5">
          <Taijitu />
        </div>
        <h2 className="text-xl mb-2" style={{ color: "#F6F1E4" }}>
          {t.comoFuncionaTitulo}
        </h2>
        <p className="text-[13.5px] leading-relaxed" style={{ color: "rgba(246,241,228,0.75)", fontFamily: "system-ui" }}>
          {t.comoFuncionaSubtitulo}
        </p>
      </div>

      <div className="px-7 py-8">
        <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {t.queEsUnRecorridoTitulo}
        </p>
        <p className="text-[14px] leading-relaxed mb-6" style={{ color: "#3A3024" }}>
          {t.queEsUnRecorridoTexto}
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {practicas.map((p, i) => (
            <div
              key={i}
              className="flex gap-3 items-start rounded-2xl p-4"
              style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#1B2A4A", color: "#C9912A" }}
              >
                {p.icono}
              </div>
              <div>
                <p className="text-[14px] mb-1" style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}>
                  {p.titulo}
                </p>
                <p className="text-[13px] leading-snug" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
                  {p.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {t.comoFuncionaPasosTitulo}
        </p>
        <div className="flex flex-col gap-3 mb-8">
          {pasos.map((paso, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[12px]"
                style={{ background: "#C9912A", color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 700 }}
              >
                {i + 1}
              </span>
              <p className="text-[13.5px] leading-relaxed pt-0.5" style={{ color: "#3A3024" }}>
                {paso}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-8" style={{ background: "#1B2A4A" }}>
          <p className="text-[13.5px] text-center leading-relaxed" style={{ color: "#F6F1E4", fontFamily: "system-ui" }}>
            {t.beneficiosBoxPre}<strong style={{ color: "#C9912A" }}>{t.beneficiosBoxBold}</strong>{t.beneficiosBoxPost}
          </p>
        </div>

        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: "#C9912A", border: "1px solid #C9912A" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[20px] shrink-0">🌱</span>
            <p className="text-[13px] uppercase tracking-wide" style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 700 }}>
              {t.gratisTitulo}
            </p>
          </div>
          <p className="text-[14px] leading-snug mb-3" style={{ color: "#1B2A4A", fontFamily: "system-ui" }}>
            {t.gratisAviso}
          </p>
          <p className="text-[12.5px] leading-snug" style={{ color: "rgba(27,42,74,0.75)", fontFamily: "system-ui", fontWeight: 600 }}>
            {t.gratisCta}
          </p>
        </div>

        <p className="text-[11px] uppercase tracking-wide mb-3" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {t.comparativaTitulo}
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {/* Un recorrido */}
          <div className="rounded-2xl p-4 relative" style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[14px]" style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 700 }}>
                {t.planRecorridoTitulo}
              </p>
              <p className="text-[13px]" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
                {t.planRecorridoPrecio}
              </p>
            </div>
            <p className="text-[12.5px] leading-snug" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
              {t.planRecorridoDesc}
            </p>
          </div>

          {/* Acceso completo (pago único) */}
          <div className="rounded-2xl p-4 relative" style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[14px]" style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 700 }}>
                {t.planCompletoTitulo}
              </p>
              <p className="text-[13px]" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
                {t.planCompletoPrecio}
              </p>
            </div>
            <p className="text-[12.5px] leading-snug" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
              {t.planCompletoDesc}
            </p>
          </div>

          {/* Suscripción — destacada, es la que funciona ya */}
          <div className="rounded-2xl p-4" style={{ background: "#1B2A4A", border: "1px solid #1B2A4A" }}>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[14px]" style={{ color: "#F6F1E4", fontFamily: "system-ui", fontWeight: 700 }}>
                {t.precioTitulo}
              </p>
              <p className="text-[13px]" style={{ color: "#C9912A", fontFamily: "system-ui", fontWeight: 600 }}>
                6,99 € {t.precioPorMes}
              </p>
            </div>
            <p className="text-[12.5px] leading-snug mb-3" style={{ color: "rgba(246,241,228,0.75)", fontFamily: "system-ui" }}>
              {t.planSuscripcionDesc}
            </p>
            <div className="flex flex-col gap-1.5">
              {t.precioLista.map((linea) => (
                <div key={linea} className="flex items-center gap-2">
                  <Check size={13} color="#C9912A" />
                  <span className="text-[12px]" style={{ color: "rgba(246,241,228,0.85)", fontFamily: "system-ui" }}>
                    {linea}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onContinuar}
          className="w-full py-3.5 rounded-full"
          style={{ background: "#C9912A", color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
}

function Beneficios({ onContinuar, t, idioma, onCambiarIdioma }) {
  const beneficios = [
    { icono: <Flame size={20} />, titulo: t.benefit1Titulo, texto: t.benefit1Texto },
    { icono: <Wind size={20} />, titulo: t.benefit2Titulo, texto: t.benefit2Texto },
    { icono: <Sparkles size={20} />, titulo: t.benefit3Titulo, texto: t.benefit3Texto },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center px-7 py-10" style={{ background: "#F6F1E4" }}>
      <div className="flex justify-center mb-4">
        <SelectorIdioma idioma={idioma} onCambiar={onCambiarIdioma} oscuro={false} />
      </div>
      <div className="flex justify-center mb-6">
        <Taijitu />
      </div>
      <h2 className="text-xl text-center mb-2" style={{ color: "#1B2A4A" }}>
        {t.beneficiosTitle}
      </h2>
      <p className="text-[13px] text-center mb-7" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
        {t.beneficiosSubtitle}
      </p>

      <div className="flex flex-col gap-3.5 mb-7">
        {beneficios.map((b, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 flex gap-3.5 items-start"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "#1B2A4A", color: "#C9912A" }}
            >
              {b.icono}
            </div>
            <div>
              <p className="text-[14.5px] mb-0.5" style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}>
                {b.titulo}
              </p>
              <p className="text-[13px] leading-snug" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
                {b.texto}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 mb-7" style={{ background: "#1B2A4A" }}>
        <p className="text-[14px] text-center leading-relaxed" style={{ color: "#F6F1E4", fontFamily: "system-ui" }}>
          {t.beneficiosBoxPre}<strong style={{ color: "#C9912A" }}>{t.beneficiosBoxBold}</strong>{t.beneficiosBoxPost}
        </p>
      </div>

      <button
        onClick={onContinuar}
        className="w-full py-3.5 rounded-full"
        style={{ background: "#C9912A", color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}
      >
        {t.beneficiosCta}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Mis recorridos
// ---------------------------------------------------------------------
function Modulos({ modulos, proximos, completadas, premium, onAbrir, onAbrirComoFunciona, onCompartir, onRestaurar, comprobando, onCerrarSesion, onReiniciar, t, idioma, onCambiarIdioma }) {
  const [mostrarRestaurar, setMostrarRestaurar] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [mensajeRestaurar, setMensajeRestaurar] = useState(null); // null | "exito" | "no-encontrado"

  const manejarRestaurar = async () => {
    setMensajeRestaurar(null);
    const encontrado = await onRestaurar(emailInput);
    setMensajeRestaurar(encontrado ? "exito" : "no-encontrado");
  };

  const frases = idioma === "fr" ? FRASES_TAO_FR : FRASES_TAO_ES;
  const diaDelMes = new Date().getDate();
  const fraseDelDia = frases[(diaDelMes - 1) % frases.length];

  return (
    <div className="pb-12">
      <div
        className="px-6 pt-10 pb-8 relative"
        style={{ background: "linear-gradient(180deg,#16243C 0%,#1B2A4A 100%)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[15px] tracking-[0.15em] uppercase font-semibold" style={{ color: "#C9912A", fontFamily: "system-ui" }}>
              QiGong Balance
            </p>
            <h1 className="text-[13px] mt-1 italic" style={{ color: "rgba(246,241,228,0.7)", fontFamily: "'Georgia', serif" }}>
              A ritmo de TAO
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onCompartir}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ border: "1px solid rgba(246,241,228,0.3)" }}
              aria-label={t.compartir}
            >
              <Share2 size={14} color="#F6F1E4" />
            </button>
            <Taijitu />
          </div>
        </div>
        <p
          className="text-[12.5px] italic leading-snug mb-5"
          style={{ color: "rgba(246,241,228,0.65)", fontFamily: "Georgia, serif" }}
        >
          {fraseDelDia}
        </p>
        <div className="flex justify-end mb-3">
          <SelectorIdioma idioma={idioma} onCambiar={onCambiarIdioma} oscuro={true} />
        </div>

        {premium ? (
          <div className="flex gap-2 items-center flex-wrap">
            <span
              className="text-[11px] px-3 py-1.5 rounded-full border"
              style={{ fontFamily: "system-ui", borderColor: "#C9912A", color: "#C9912A" }}
            >
              {t.demoPremiumOn}
            </span>
            {STRIPE_PORTAL_LINK && (
              <button
                onClick={() => (window.location.href = STRIPE_PORTAL_LINK)}
                className="text-[11px] px-3 py-1.5 rounded-full border"
                style={{ fontFamily: "system-ui", borderColor: "rgba(246,241,228,0.3)", color: "rgba(246,241,228,0.7)" }}
              >
                {t.manageSubscription}
              </button>
            )}
            <button
              onClick={onCerrarSesion}
              className="text-[11px] px-3 py-1.5 rounded-full border"
              style={{ fontFamily: "system-ui", borderColor: "rgba(246,241,228,0.2)", color: "rgba(246,241,228,0.5)" }}
            >
              {t.logOut}
            </button>
          </div>
        ) : mostrarRestaurar ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2 items-center">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setMensajeRestaurar(null);
                }}
                placeholder="tu@email.com"
                className="text-[12px] px-3 py-1.5 rounded-full flex-1 min-w-0"
                style={{ fontFamily: "system-ui", border: "1px solid rgba(246,241,228,0.3)", background: "rgba(246,241,228,0.08)", color: "#F6F1E4" }}
              />
              <button
                onClick={manejarRestaurar}
                disabled={comprobando || !emailInput.includes("@")}
                className="text-[11px] px-3 py-1.5 rounded-full shrink-0"
                style={{ fontFamily: "system-ui", background: "#C9912A", color: "#1B2A4A", fontWeight: 600, opacity: comprobando ? 0.6 : 1 }}
              >
                {comprobando ? "..." : "OK"}
              </button>
            </div>
            {mensajeRestaurar === "no-encontrado" && (
              <p className="text-[11px]" style={{ color: "#E0A96D", fontFamily: "system-ui" }}>
                {t.restaurarNoEncontrado}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setMostrarRestaurar(true)}
            className="text-[11px] px-3 py-1.5 rounded-full border"
            style={{ fontFamily: "system-ui", borderColor: "rgba(246,241,228,0.3)", color: "rgba(246,241,228,0.7)" }}
          >
            {t.restorePurchase}
          </button>
        )}
      </div>

      <div className="px-6 pt-7">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
            {t.myJourneys}
          </p>
          <button
            onClick={onAbrirComoFunciona}
            className="text-[11px] underline"
            style={{ color: "#9A8158", fontFamily: "system-ui" }}
          >
            {t.howItWorks}
          </button>
        </div>
        <h2 className="text-xl mb-5" style={{ color: "#1B2A4A" }}>
          {t.chooseYourPractice}
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
                    {t.sessionsCompleted(hechas, total)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {proximos && proximos.length > 0 && (
          <div className="mt-7">
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
              {t.comingSoon}
            </p>
            <div className="flex flex-col gap-2.5">
              {proximos.map((p) => (
                <div
                  key={p.id}
                  className="w-full rounded-2xl p-4 flex items-center gap-3.5 opacity-60"
                  style={{ background: "#FFFFFF", border: "1px dashed #D8CBA8" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
                    style={{ background: "#E4DCC6", color: "#5C6B7A" }}
                  >
                    {p.icono}
                  </div>
                  <p className="text-[14px] flex-1" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
                    {p.titulo}
                  </p>
                  <span
                    className="text-[9.5px] px-2 py-1 rounded-full uppercase tracking-wide shrink-0"
                    style={{ background: "#EFEAE0", color: "#9A8158", fontFamily: "system-ui" }}
                  >
                    {t.soon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[10.5px] text-center mt-8 leading-snug" style={{ color: "#B0A483", fontFamily: "system-ui" }}>
          {t.disclaimerFooter}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Pantalla: Recorrido (el camino con nodos)
// ---------------------------------------------------------------------
function Recorrido({ modulo, completadas, premium, onAbrir, onVolver, t }) {
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
            {t.myJourneys}
          </span>
        </button>
        <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {t.journeyLabel}
        </p>
        <h2 className="text-xl" style={{ color: "#F6F1E4" }}>
          {modulo.titulo}
        </h2>
        <p className="text-[13px] mt-1" style={{ color: "rgba(246,241,228,0.7)", fontFamily: "system-ui" }}>
          {t.sessionsCompleted(completadas.length, estaciones.length)}
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
          {t.freeDisclaimer}
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

// =====================================================================
// FRASES DEL TAO — 30 reflexiones breves, una por día del mes.
// No son citas literales de Laozi ni del Tao Te Ching (para evitar
// errores de atribución o traducción); son reflexiones originales
// inspiradas en el espíritu taoísta.
// =====================================================================
const FRASES_TAO_ES = [
  "El agua no fuerza su camino, y aun así llega a todas partes.",
  "Lo blando vence a lo duro con el tiempo, no con la fuerza.",
  "Un solo paso consciente vale más que diez pasos apresurados.",
  "El Yin y el Yang no luchan: se turnan.",
  "Respira como si nadie te observara.",
  "El árbol que se dobla con el viento no se quiebra.",
  "La quietud también es movimiento, solo que hacia dentro.",
  "No hay que empujar al río: solo dejarlo fluir.",
  "El vacío del cuenco es lo que lo hace útil.",
  "Hoy no necesitas llegar, solo estar.",
  "El Qi no se persigue, se recibe.",
  "Cede un poco y ganarás equilibrio.",
  "El silencio también enseña, si aprendes a escucharlo.",
  "Lo que no se fuerza, dura.",
  "Cada exhalación es una pequeña forma de soltar.",
  "El centro no se busca fuera: se recuerda dentro.",
  "La montaña no se apresura, y aun así siempre llega.",
  "Hay fuerza en la blandura del bambú.",
  "El Tao no se explica del todo: se camina.",
  "Un cuerpo relajado piensa con más claridad.",
  "La naturaleza no compite con nada, y por eso nada le falta.",
  "Hoy, deja que algo simplemente sea.",
  "El descanso también es parte del camino.",
  "Lo que fluye no se estanca ni se rompe.",
  "Escucha primero al cuerpo, después a la mente.",
  "El equilibrio no es estar quieto: es adaptarse sin perderse.",
  "Un gesto lento puede decir más que mil palabras rápidas.",
  "La luna no se esfuerza por brillar.",
  "Vuelve al aliento cuando todo lo demás se agite.",
  "El Tao que puede nombrarse ya no es del todo el Tao.",
];

const FRASES_TAO_FR = [
  "L'eau ne force pas son chemin, et pourtant elle atteint tout.",
  "Le doux triomphe du dur, non par la force, mais par le temps.",
  "Un seul pas conscient vaut plus que dix pas précipités.",
  "Le Yin et le Yang ne luttent pas : ils alternent.",
  "Respire comme si personne ne te regardait.",
  "L'arbre qui plie avec le vent ne se brise pas.",
  "L'immobilité est aussi un mouvement, mais vers l'intérieur.",
  "Il ne faut pas pousser la rivière : il suffit de la laisser couler.",
  "C'est le vide du bol qui le rend utile.",
  "Aujourd'hui, tu n'as pas besoin d'arriver, juste d'être.",
  "Le Qi ne se poursuit pas, il se reçoit.",
  "Cède un peu et tu gagneras en équilibre.",
  "Le silence enseigne aussi, si tu apprends à l'écouter.",
  "Ce qui n'est pas forcé dure plus longtemps.",
  "Chaque expiration est une petite façon de lâcher prise.",
  "Le centre ne se cherche pas dehors : il se rappelle dedans.",
  "La montagne ne se presse jamais, et pourtant elle arrive toujours.",
  "Il y a de la force dans la souplesse du bambou.",
  "Le Tao ne s'explique pas entièrement : il se marche.",
  "Un corps détendu pense plus clairement.",
  "La nature ne rivalise avec rien, et c'est pourquoi rien ne lui manque.",
  "Aujourd'hui, laisse simplement quelque chose être.",
  "Le repos fait aussi partie du chemin.",
  "Ce qui coule ne stagne ni ne se brise.",
  "Écoute d'abord le corps, ensuite l'esprit.",
  "L'équilibre n'est pas l'immobilité : c'est s'adapter sans se perdre.",
  "Un geste lent peut en dire plus que mille mots pressés.",
  "La lune ne s'efforce pas de briller.",
  "Reviens au souffle quand tout le reste s'agite.",
  "Le Tao que l'on peut nommer n'est déjà plus tout à fait le Tao.",
];

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
function Sesion({ estacion, onCerrar, onCompletar, t }) {
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
        {estacion.imagen ? (
          <>
            <img
              src={`/images/${estacion.imagen}`}
              alt={estacion.titulo}
              className="rounded-2xl shadow-md mx-auto"
              style={{ display: "block", width: "65%", background: "#FFFFFF", border: "1px solid #E4DCC6" }}
            />

            {estacion.audioArchivo && (
              <div
                className="w-full rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#1B2A4A" }}
                >
                  <Play size={14} fill="#C9912A" color="#C9912A" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
                    Audio guiado
                  </p>
                  <audio controls className="w-full" style={{ height: 32 }}>
                    <source src={`/audio/${estacion.audioArchivo}`} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            )}

            {estacion.bloques.map((b, i) => (
              <Bloque key={i} bloque={b} />
            ))}
          </>
        ) : (
          <>
            {estacion.bloques.map((b, i) => (
              <Bloque key={i} bloque={b} />
            ))}

            {estacion.audioArchivo && (
              <div
                className="w-full rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "#1B2A4A" }}
                >
                  <Play size={14} fill="#C9912A" color="#C9912A" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wide mb-1.5" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
                    Audio guiado
                  </p>
                  <audio controls className="w-full" style={{ height: 32 }}>
                    <source src={`/audio/${estacion.audioArchivo}`} type="audio/mpeg" />
                  </audio>
                </div>
              </div>
            )}

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
          </>
        )}
      </div>

      <div className="px-6 pb-9">
        <button
          onClick={() => onCompletar(estacion.id)}
          className="w-full py-3.5 rounded-full flex items-center justify-center gap-2"
          style={{ background: "#C9912A", color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}
        >
          <Play size={16} fill="#1B2A4A" /> {t.markCompleted}
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
          <div key={i} className="rounded-xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E4DCC6" }}>
            {p.imagen && (
              <img
                src={`/images/${p.imagen}`}
                alt={p.nombre}
                className="w-full"
                style={{ display: "block", background: "#F6F1E4" }}
              />
            )}
            <div className="p-4">
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
function Paywall({ estacion, moduloId, onCerrar, t, emailInicial, onEmailConfirmado }) {
  const [email, setEmail] = useState(emailInicial || "");
  const [error, setError] = useState("");
  const [opcion, setOpcion] = useState("recorrido"); // "recorrido" | "completo" | "suscripcion"

  const enlacePorOpcion = {
    recorrido: STRIPE_RECORRIDO_LINK,
    completo: STRIPE_FULLACCESS_LINK,
    suscripcion: STRIPE_PAYMENT_LINK,
  };
  const referenciaPorOpcion = {
    recorrido: moduloId || "",
    completo: "acceso-completo",
    suscripcion: "",
  };

  const irAPagar = () => {
    if (!email.includes("@")) {
      setError(t.emailInvalido);
      return;
    }
    const enlace = enlacePorOpcion[opcion];
    if (!enlace) {
      setError(t.errorPago);
      return;
    }
    setError("");
    onEmailConfirmado(email);
    const params = new URLSearchParams();
    params.set("prefilled_email", email);
    const referencia = referenciaPorOpcion[opcion];
    if (referencia) params.set("client_reference_id", referencia);
    const separador = enlace.includes("?") ? "&" : "?";
    window.location.href = `${enlace}${separador}${params.toString()}`;
  };

  const opciones = [
    { id: "recorrido", titulo: t.opcionRecorridoTitulo, precio: t.opcionRecorridoPrecio, desc: t.opcionRecorridoDesc },
    { id: "completo", titulo: t.opcionCompletoTitulo, precio: t.opcionCompletoPrecio, desc: t.opcionCompletoDesc },
    { id: "suscripcion", titulo: t.opcionSuscripcionTitulo, precio: t.opcionSuscripcionPrecio, desc: t.opcionSuscripcionDesc },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-end" style={{ background: "rgba(15,27,45,0.55)" }}>
      <div className="rounded-t-3xl px-7 pt-7 pb-9 max-h-[92vh] overflow-y-auto" style={{ background: "#F6F1E4" }}>
        <div className="flex justify-between items-start mb-5">
          <Taijitu />
          <button onClick={onCerrar}>
            <X size={20} color="#5C6B7A" />
          </button>
        </div>
        <h2 className="text-xl mb-1.5" style={{ color: "#1B2A4A" }}>
          {t.premiumContentTitle(estacion.titulo)}
        </h2>
        <p className="text-[13.5px] mb-5" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          {t.elegirOpcionDesc}
        </p>

        <div className="flex flex-col gap-2.5 mb-6">
          {opciones.map((op) => (
            <button
              key={op.id}
              onClick={() => setOpcion(op.id)}
              className="text-left rounded-2xl p-4 transition-colors"
              style={{
                background: opcion === op.id ? "#1B2A4A" : "#FFFFFF",
                border: opcion === op.id ? "1px solid #1B2A4A" : "1px solid #E4DCC6",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-[14px]"
                  style={{ color: opcion === op.id ? "#F6F1E4" : "#1B2A4A", fontFamily: "system-ui", fontWeight: 700 }}
                >
                  {op.titulo}
                </span>
                <span
                  className="text-[13px]"
                  style={{ color: opcion === op.id ? "#C9912A" : "#5C6B7A", fontFamily: "system-ui", fontWeight: 600 }}
                >
                  {op.precio}
                </span>
              </div>
              <p
                className="text-[12px] leading-snug"
                style={{ color: opcion === op.id ? "rgba(246,241,228,0.8)" : "#5C6B7A", fontFamily: "system-ui" }}
              >
                {op.desc}
              </p>
            </button>
          ))}
        </div>

        <label className="text-[11px] uppercase tracking-wide mb-1.5 block" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {t.emailLabel}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full mb-1.5 px-4 py-3 rounded-xl text-[14px]"
          style={{ fontFamily: "system-ui", border: "1px solid #D8CBA8", background: "#FFFFFF", color: "#3A3024" }}
        />
        {error && (
          <p className="text-[12px] mb-2" style={{ color: "#B0473F", fontFamily: "system-ui" }}>
            {error}
          </p>
        )}

        <button
          onClick={irAPagar}
          className="w-full py-3.5 rounded-full mb-3 mt-2"
          style={{ background: "#C9912A", color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600 }}
        >
          {t.continuarPago}
        </button>
        <button onClick={onCerrar} className="w-full text-center text-[13px] py-1" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          {t.continueFree}
        </button>
      </div>
    </div>
  );
}
