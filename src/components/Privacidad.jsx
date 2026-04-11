import { Link } from "react-router-dom";

const IcShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcDatabase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const IcTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IcLock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IcUserCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M20 8l-3 3-2-2" />
  </svg>
);

function PrivacyBlock({ icon: Icon, title, tag, children }) {
  return (
    <article className="group relative glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden animate-fade-in-up">
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none group-hover:bg-brand-cyan/15 transition-colors" aria-hidden />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand-r text-white shadow-glow-cyan">
              <Icon />
            </span>
            <div>
              {tag && (
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand-cyan/90 block mb-0.5">
                  {tag}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                {title}
              </h2>
            </div>
          </div>
        </div>
        <div className="text-[var(--muted)] text-sm sm:text-base leading-relaxed space-y-3 pl-0 sm:pl-[4.25rem] sm:border-l sm:border-white/[0.06] sm:ml-6">
          {children}
        </div>
      </div>
    </article>
  );
}

export default function Privacidad() {
  return (
    <div className="page-bg min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" aria-hidden />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20 space-y-10 sm:space-y-12">
          {/* Hero */}
          <header className="relative glass rounded-4xl border border-white/[0.1] shadow-glass overflow-hidden animate-fade-in-up">
            <div className="h-1.5 w-full bg-gradient-brand-r" aria-hidden />
            <div className="px-6 sm:px-10 py-8 sm:py-10">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  <IcShield />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="badge badge-cyan">Privacidad por diseño</span>
                    <span className="text-xs text-[var(--faint)] font-mono">Actualizado · 2026</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">
                    <span className="text-grad">Política</span> de privacidad
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
                    En <strong className="text-white/90">La Cuponera</strong> tratamos tus datos con
                    cuidado: pocos campos, finalidad clara y medidas razonables de seguridad. Esta
                    página resume qué recogemos, para qué y cómo lo protegemos.
                  </p>
                </div>
              </div>

              {/* Mini stats */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { k: "Mínimo necesario", v: "Solo datos para operar tu cuenta y compras." },
                  { k: "Sin venta de listas", v: "No vendemos tu correo a terceros." },
                  { k: "Infraestructura moderna", v: "Autenticación y base de datos en la nube." },
                ].map((item) => (
                  <div
                    key={item.k}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-left"
                  >
                    <p className="text-xs font-semibold text-cyan-200/90 mb-1">{item.k}</p>
                    <p className="text-[0.7rem] sm:text-xs text-[var(--faint)] leading-snug">{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="space-y-6 sm:space-y-7">
            <PrivacyBlock icon={IcDatabase} title="Información recopilada" tag="Qué guardamos">
              <p>
                Recopilamos datos que <strong className="text-white/90">tú nos proporcionas</strong> al
                registrarte o comprar: por ejemplo nombre, correo, teléfono o DUI cuando el formulario
                lo solicite, además de datos técnicos habituales (sesión, tipo de dispositivo) para
                mantener la app estable y segura.
              </p>
              <p>
                Las empresas asociadas pueden tener sus propias políticas cuando canjeas en tienda;
                allí aplica también lo que ellos te pidan en el punto de venta.
              </p>
            </PrivacyBlock>

            <PrivacyBlock icon={IcTarget} title="Uso de la información" tag="Finalidad">
              <p>
                Usamos tus datos <strong className="text-white/90">solo</strong> para gestionar
                autenticación, perfiles, compras de cupones, historial básico en la plataforma y
                comunicaciones relacionadas con el servicio (por ejemplo confirmación de operación).
              </p>
              <ul className="list-none space-y-2 pt-1">
                <li className="flex gap-2">
                  <span className="text-brand-purple shrink-0">✦</span>
                  <span>Mejorar la experiencia dentro de La Cuponera (búsquedas, recomendaciones futuras si las activamos).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brand-purple shrink-0">✦</span>
                  <span>Cumplir obligaciones legales aplicables en El Salvador cuando corresponda.</span>
                </li>
              </ul>
            </PrivacyBlock>

            <PrivacyBlock icon={IcLock} title="Seguridad" tag="Protección">
              <p>
                Aplicamos <strong className="text-white/90">medidas técnicas y organizativas</strong>{" "}
                razonables: conexión cifrada (HTTPS), proveedores de autenticación y base de datos con
                controles de acceso, y reglas en servidor para limitar quién lee o escribe cada
                colección.
              </p>
              <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[var(--muted)]">
                Ningún sistema es 100% invulnerable; si detectas algo raro en tu cuenta, cambia tu
                contraseña y avísanos por los canales oficiales del proyecto.
              </p>
            </PrivacyBlock>

            <PrivacyBlock icon={IcUserCheck} title="Tus derechos" tag="Control">
              <p>
                Puedes solicitar <strong className="text-white/90">acceso, rectificación o baja</strong>{" "}
                de datos personales que dependan directamente de nuestros registros, siempre que la ley
                local y la operación del servicio lo permitan (por ejemplo, debemos conservar cierta
                trazabilidad de transacciones por un tiempo razonable).
              </p>
              <p>
                Para ejercer derechos, usa el mismo correo con el que te registraste y describe tu
                solicitud; el equipo académico/proyecto te orientará en los plazos habituales del curso.
              </p>
            </PrivacyBlock>
          </div>

          <footer className="text-center">
            <div className="divider mb-6" />
            <p className="text-sm text-[var(--faint)] max-w-lg mx-auto">
              Esta política complementa los{" "}
              <Link to="/terminos" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-2">
                Términos y Condiciones
              </Link>
              . El uso continuado de La Cuponera implica que has leído y comprendido ambos documentos.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
