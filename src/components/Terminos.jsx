import { Link } from "react-router-dom";

const IcScroll = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const IcSpark = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l1-3M19 19l-1-3" />
  </svg>
);
const IcScale = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3a6 6 0 00-6 6v12h12V9a6 6 0 00-6-6zM9 12h6M9 16h6" />
  </svg>
);
const IcRefresh = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

function SectionCard({ step, icon: Icon, title, children }) {
  return (
    <article className="group relative glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none group-hover:bg-brand-purple/15 transition-colors" aria-hidden />
      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:gap-6">
        <div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-glow-purple">
            <Icon />
          </span>
          <span className="font-mono text-[0.65rem] font-bold text-[var(--faint)] tracking-[0.2em] sm:ml-1">
            {step}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 tracking-tight">
            {title}
          </h2>
          <div className="text-[var(--muted)] text-sm sm:text-base leading-relaxed space-y-3">{children}</div>
        </div>
      </div>
    </article>
  );
}

export default function Terminos() {
  return (
    <div className="page-bg min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" aria-hidden />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 sm:pb-20 space-y-10 sm:space-y-12">
          {/* Hero */}
          <header className="relative glass rounded-4xl border border-white/[0.1] shadow-glass overflow-hidden animate-fade-in-up">
            <div className="h-1.5 w-full bg-gradient-brand" aria-hidden />
            <div className="px-6 sm:px-10 py-8 sm:py-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="badge badge-purple inline-flex items-center gap-1.5">
                  <span className="scale-90 origin-center" aria-hidden>
                    <IcSpark />
                  </span>
                  Marco legal
                </span>
                <span className="text-xs text-[var(--faint)] font-mono">v1 · 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white tracking-tight mb-4">
                Términos y{" "}
                <span className="text-grad">Condiciones</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-2xl">
                Bienvenido a <strong className="text-white/90">La Cuponera</strong>. Al usar la
                plataforma aceptas estas reglas: son el acuerdo entre tú, las empresas anunciantes y
                nosotros como intermediarios digitales.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-[var(--muted)]">
                  <span className="glow-dot glow-dot-cyan shrink-0" aria-hidden />
                  Cupones digitales verificados
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs text-[var(--muted)]">
                  <span className="glow-dot glow-dot-purple shrink-0" aria-hidden />
                  Transparencia en cada oferta
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-6 sm:space-y-7">
            <SectionCard step="01" icon={IcScroll} title="Uso de la plataforma">
              <p>
                Puedes explorar ofertas, crear una cuenta y adquirir{" "}
                <strong className="text-cyan-200/90">cupones digitales</strong> sujetos a stock,
                vigencia y condiciones publicadas en cada anuncio.
              </p>
              <ul className="list-none space-y-2 pt-1">
                <li className="flex gap-2 items-start">
                  <span className="text-brand-cyan mt-1">▸</span>
                  <span>Respetar los límites por usuario o por campaña cuando la empresa los indique.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-brand-cyan mt-1">▸</span>
                  <span>Revisar fecha de canje y restricciones antes de comprar; el código es personal e intransferible salvo que la oferta diga lo contrario.</span>
                </li>
              </ul>
            </SectionCard>

            <SectionCard step="02" icon={IcScale} title="Responsabilidad">
              <p>
                La Cuponera actúa como{" "}
                <strong className="text-white/90">intermediario tecnológico</strong>: ponemos en
                contacto a clientes con empresas. El cumplimiento del servicio descuentos, horarios,
                menús o productos físicos depende del <strong className="text-white/90">proveedor</strong>{" "}
                que publica la oferta.
              </p>
              <p>
                Si surge un conflicto con una empresa, te pedimos contactarla directamente; nosotros
                podemos orientarte según la información disponible en la plataforma.
              </p>
            </SectionCard>

            <SectionCard step="03" icon={IcRefresh} title="Modificaciones">
              <p>
                Podemos <strong className="text-white/90">actualizar estos términos</strong> para
                reflejar nuevas funciones, requisitos legales o mejoras de seguridad. Cuando el cambio
                sea relevante, lo comunicaremos en la app o por correo asociado a tu cuenta.
              </p>
              <p className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-amber-100/90 text-sm">
                <strong className="text-amber-200">Tip:</strong> guarda o imprime una copia de esta
                página si necesitas archivo personal de la versión vigente al momento de tu compra.
              </p>
            </SectionCard>
          </div>

          <footer className="text-center sm:text-left space-y-4">
            <div className="divider mb-2" />
            <p className="text-sm text-[var(--faint)]">
              ¿Dudas sobre una compra o un canje? Usa los datos de contacto del comercio en tu cupón o
              escribe desde la sección de ayuda de tu cuenta.
            </p>
            <p className="text-sm text-[var(--faint)]">
              También revisa nuestra{" "}
              <Link to="/privacidad" className="text-cyan-300/90 hover:text-cyan-200 underline underline-offset-2">
                Política de privacidad
              </Link>
              .
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
