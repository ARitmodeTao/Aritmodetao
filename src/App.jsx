import { useState, useEffect } from "react";
import { Lock, Check, Play, X, Wind, Flame, ChevronLeft, Sparkles } from "lucide-react";

// ---- Contenido: Módulo 1 — Primera aproximación al Tao y los 8 Brocados ----
const ESTACIONES = [
  {
    id: 0,
    tipo: "intro",
    titulo: "¿Qué es el Tao?",
    sub: "Fundamentos",
    free: true,
    icono: "☯",
    duracion: "8 min",
    contenido: {
      texto:
        "El Tao no se explica, se experimenta. Antes de mover el cuerpo, hay que entender el principio: todo fluye entre dos polos que se necesitan — Yin y Yang.",
      pasos: [
        "Siéntate con la espalda recta, sin tensión.",
        "Cierra los ojos y lleva la atención al Dan Tian (3 dedos bajo el ombligo).",
        "Respira 9 veces, contando cada exhalación.",
      ],
    },
  },
  {
    id: 1,
    tipo: "brocado",
    titulo: "Sostener el cielo",
    sub: "1er Brocado",
    free: true,
    icono: "1",
    duracion: "12 min",
    contenido: {
      movimiento: "Entrelaza los dedos frente al Dan Tian y eleva los brazos sobre la cabeza, palmas hacia el cielo, estirando toda la columna.",
      respiracion: "Inhala al subir los brazos, exhala al bajarlos. 6 repeticiones.",
      beneficios: "Estimula el Triple Calentador, mejora la oxigenación y libera tensión en hombros y columna.",
    },
  },
  {
    id: 2,
    tipo: "brocado",
    titulo: "Tensar el arco",
    sub: "2º Brocado",
    free: false,
    icono: "2",
    duracion: "14 min",
    contenido: {
      movimiento: "Postura de jinete. Simula tensar un arco a cada lado, alternando brazos.",
      respiracion: "Inhala al abrir el arco, exhala al recoger. 6 repeticiones por lado.",
      beneficios: "Fortalece piernas y core, abre el pecho, tonifica el meridiano de Pulmón.",
    },
  },
  {
    id: 3,
    tipo: "brocado",
    titulo: "Separar cielo y tierra",
    sub: "3er Brocado",
    free: false,
    icono: "3",
    duracion: "11 min",
    contenido: {
      movimiento: "Una mano empuja hacia el cielo, la otra hacia la tierra, alternando.",
      respiracion: "Inhala al extender, exhala al cambiar de lado. 6 repeticiones.",
      beneficios: "Regula el Qi de Bazo y Estómago, mejora la digestión.",
    },
  },
  {
    id: 4,
    tipo: "brocado",
    titulo: "Mirar hacia atrás",
    sub: "4º Brocado",
    free: false,
    icono: "4",
    duracion: "10 min",
    contenido: {
      movimiento: "Gira suavemente cabeza y torso para mirar atrás, brazos relajados a los lados.",
      respiracion: "Inhala al girar, exhala al volver al centro.",
      beneficios: "Libera tensión cervical, ayuda a disipar el calor interno y el estrés.",
    },
  },
  {
    id: 5,
    tipo: "brocado",
    titulo: "Sacudir la cabeza",
    sub: "5º Brocado",
    free: false,
    icono: "5",
    duracion: "9 min",
    contenido: {
      movimiento: "Postura de jinete amplia, inclinación lateral del torso con la cabeza.",
      respiracion: "Exhala con un leve sonido 'ja' al inclinar.",
      beneficios: "Drena el calor del Corazón, calma la mente.",
    },
  },
  {
    id: 6,
    tipo: "brocado",
    titulo: "Tocarse los pies",
    sub: "6º Brocado",
    free: false,
    icono: "6",
    duracion: "13 min",
    contenido: {
      movimiento: "Flexión de tronco hacia adelante deslizando las manos por la espalda baja y piernas.",
      respiracion: "Exhala al bajar, inhala al subir.",
      beneficios: "Fortalece riñones y zona lumbar, tonifica el Jing.",
    },
  },
  {
    id: 7,
    tipo: "brocado",
    titulo: "Puños y mirada feroz",
    sub: "7º Brocado",
    free: false,
    icono: "7",
    duracion: "10 min",
    contenido: {
      movimiento: "Postura de jinete baja, golpes de puño alternos hacia adelante con mirada intensa.",
      respiracion: "Exhala con fuerza en cada golpe.",
      beneficios: "Activa el Qi e Hígado, desarrolla fuerza y determinación.",
    },
  },
  {
    id: 8,
    tipo: "brocado",
    titulo: "Rebotar sobre los talones",
    sub: "8º Brocado · Cierre",
    free: false,
    icono: "8",
    duracion: "7 min",
    contenido: {
      movimiento: "De pie, talones juntos, elevación suave y caída con pequeño rebote.",
      respiracion: "Respiración libre y natural, 7 repeticiones.",
      beneficios: "Armoniza todo el Qi circulado en la sesión, cierra la práctica.",
    },
  },
];

export default function QigongApp() {
  const [vista, setVista] = useState("recorrido"); // recorrido | sesion | paywall
  const [activa, setActiva] = useState(null);
  const [completadas, setCompletadas] = useState([0, 1]);
  const [premium, setPremium] = useState(false);
  const [cargado, setCargado] = useState(false);

  // Cargar progreso guardado al abrir la app
  useEffect(() => {
    try {
      const guardado = localStorage.getItem("progreso-qigong");
      if (guardado) {
        const datos = JSON.parse(guardado);
        if (Array.isArray(datos.completadas)) setCompletadas(datos.completadas);
        if (typeof datos.premium === "boolean") setPremium(datos.premium);
      }
    } catch (e) {
      // Sin progreso guardado todavía, se usa el estado inicial
    } finally {
      setCargado(true);
    }
  }, []);

  // Guardar cada vez que cambia el progreso
  useEffect(() => {
    if (!cargado) return; // evita sobrescribir antes de terminar de cargar
    try {
      localStorage.setItem("progreso-qigong", JSON.stringify({ completadas, premium }));
    } catch (e) {}
  }, [completadas, premium, cargado]);

  const abrir = (estacion) => {
    if (!estacion.free && !premium) {
      setActiva(estacion);
      setVista("paywall");
      return;
    }
    setActiva(estacion);
    setVista("sesion");
  };

  const completar = (id) => {
    if (!completadas.includes(id)) setCompletadas([...completadas, id]);
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
        ) : (
          <>
            {vista === "recorrido" && (
              <Recorrido
                estaciones={ESTACIONES}
                completadas={completadas}
                premium={premium}
                onAbrir={abrir}
                onTogglePremium={() => setPremium((p) => !p)}
                onReiniciar={() => {
                  setCompletadas([0, 1]);
                  setPremium(false);
                }}
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

function Recorrido({ estaciones, completadas, premium, onAbrir, onTogglePremium, onReiniciar }) {
  return (
    <div className="pb-12">
      {/* Header */}
      <div
        className="px-6 pt-10 pb-8 relative"
        style={{ background: "linear-gradient(180deg,#16243C 0%,#1B2A4A 100%)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase" style={{ color: "#C9912A", fontFamily: "system-ui" }}>
              A ritmo de TAO
            </p>
            <h1 className="text-2xl mt-1" style={{ color: "#F6F1E4" }}>
              con Bea
            </h1>
          </div>
          <Taijitu />
        </div>
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
          className="text-[11px] ml-2 px-3 py-1.5 rounded-full border"
          style={{
            fontFamily: "system-ui",
            borderColor: "rgba(246,241,228,0.2)",
            color: "rgba(246,241,228,0.5)",
          }}
        >
          Reiniciar progreso
        </button>
      </div>

      {/* Título del recorrido */}
      <div className="px-6 pt-7 pb-2">
        <p className="text-[11px] tracking-[0.2em] uppercase" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          Módulo 1
        </p>
        <h2 className="text-xl" style={{ color: "#1B2A4A" }}>
          Primera aproximación al Tao y los 8 Brocados
        </h2>
        <p className="text-sm mt-1" style={{ color: "#5C6B7A", fontFamily: "system-ui" }}>
          {completadas.length} de {ESTACIONES.length} sesiones completadas
        </p>
      </div>

      {/* Camino / recorrido en forma de río que serpentea */}
      <div className="relative px-6 pt-6">
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width="100%"
          height={ESTACIONES.length * 132}
          style={{ left: 0 }}
        >
          <path
            d={generarCurva(ESTACIONES.length)}
            stroke="#D8CBA8"
            strokeWidth="3"
            fill="none"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative flex flex-col gap-[68px]" style={{ paddingTop: 8 }}>
          {ESTACIONES.map((e, i) => {
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
                      <span style={{ color: "#1B2A4A", fontSize: 20 }}>☯</span>
                    ) : (
                      <span style={{ color: "#1B2A4A", fontFamily: "system-ui", fontWeight: 600, fontSize: 18 }}>
                        {e.icono}
                      </span>
                    )}
                  </div>
                  <div
                    className="max-w-[155px]"
                    style={{ textAlign: lado === "left" ? "left" : "right" }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-wide"
                      style={{ color: "#9A8158", fontFamily: "system-ui" }}
                    >
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

      <div className="px-6 mt-10 text-center">
        <p className="text-[11px]" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
          La introducción y el 1er Brocado son gratis. El resto del recorrido se desbloquea con Premium.
        </p>
      </div>
    </div>
  );
}

function generarCurva(n) {
  let d = `M 60 20`;
  for (let i = 0; i < n; i++) {
    const y = 20 + i * 68 + 34;
    const x = i % 2 === 0 ? 60 : 280;
    const xPrev = i === 0 ? 60 : i % 2 === 1 ? 60 : 280;
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

function Sesion({ estacion, onCerrar, onCompletar }) {
  const c = estacion.contenido;
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
        {estacion.tipo === "intro" ? (
          <>
            <p className="text-[15px] leading-relaxed" style={{ color: "#3A3024" }}>
              {c.texto}
            </p>
            <div>
              <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#9A8158", fontFamily: "system-ui" }}>
                Práctica guiada
              </p>
              <ol className="flex flex-col gap-2">
                {c.pasos.map((p, i) => (
                  <li key={i} className="text-[14px] flex gap-2" style={{ color: "#3A3024" }}>
                    <span style={{ color: "#C9912A" }}>{i + 1}.</span> {p}
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <>
            <Bloque icono={<Sparkles size={16} />} titulo="Movimiento" texto={c.movimiento} />
            <Bloque icono={<Wind size={16} />} titulo="Respiración" texto={c.respiracion} />
            <Bloque icono={<Flame size={16} />} titulo="Beneficios" texto={c.beneficios} />
          </>
        )}
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

function Bloque({ icono, titulo, texto }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5" style={{ color: "#9A8158" }}>
        {icono}
        <p className="text-[11px] uppercase tracking-wide" style={{ fontFamily: "system-ui" }}>
          {titulo}
        </p>
      </div>
      <p className="text-[14.5px] leading-relaxed" style={{ color: "#3A3024" }}>
        {texto}
      </p>
    </div>
  );
}

function Paywall({ estacion, onCerrar, onDesbloquear }) {
  return (
    <div
      className="min-h-screen flex flex-col justify-end"
      style={{ background: "rgba(15,27,45,0.55)" }}
    >
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
          Desbloquea los 8 Brocados completos, con audio guiado y seguimiento de tu progreso.
        </p>

        <div className="flex flex-col gap-2.5 mb-7">
          {["Las 8 sesiones del recorrido", "Audio guiado por Bea", "Nuevos módulos cada mes"].map((t) => (
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
