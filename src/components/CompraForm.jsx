import { useCompra } from "../hooks/useCompra";
import { useNavigate } from "react-router-dom";

const IcX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IcLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IcShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

export default function CompraForm({ oferta, formatFecha, onClose }) {
  const navigate = useNavigate();

  const {
    cantidad,
    setCantidad,
    comprar,
    codigosGenerados,
    loading,
    error,
    exitoso,
  } = useCompra();

  const subtotal = (Number(oferta.precioOferta) * cantidad).toFixed(2);

  const maxCupones =
    oferta.cantidadLimite != null
      ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0)
      : 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await comprar(oferta);
    if (resultado) {
      console.log("Compra exitosa");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07090F]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compra-titulo"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <div className="absolute inset-0 rounded-4xl bg-gradient-mesh opacity-60 pointer-events-none" aria-hidden />
        <div className="relative glass rounded-4xl border border-white/[0.08] shadow-glass overflow-hidden">
          <div className="h-1 w-full bg-gradient-brand" aria-hidden />

          <div className="p-6 sm:p-8 max-h-[min(90vh,720px)] overflow-y-auto">
            {exitoso ? (
              <div className="text-center flex flex-col gap-5">
                <div className="text-5xl" aria-hidden>
                  🎉
                </div>
                <h3 id="compra-titulo" className="text-2xl font-heading font-bold text-grad">
                  ¡Compra exitosa!
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  Se {codigosGenerados.length === 1 ? "generó" : "generaron"}{" "}
                  {codigosGenerados.length} cupón{codigosGenerados.length > 1 ? "es" : ""}:
                </p>
                <div className="flex flex-col gap-2.5">
                  {codigosGenerados.map((codigo) => (
                    <div
                      key={codigo}
                      className="rounded-2xl border border-brand-purple/30 bg-brand-card/80 px-4 py-3.5 font-mono text-lg sm:text-xl font-semibold tracking-[0.2em] text-center text-cyan-300 shadow-input"
                    >
                      {codigo}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--faint)]">
                  Puedes descargar el PDF de tu cupón en la sección &quot;Mis Cupones&quot;.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button type="button" onClick={() => navigate("/mis-cupones")} className="btn-primary flex-1 justify-center">
                    Ver mis cupones
                  </button>
                  <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">
                    Seguir comprando
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-brand-cyan/90 mb-1.5">
                      {oferta.nombreEmpresa}
                    </p>
                    <h3 id="compra-titulo" className="text-xl sm:text-2xl font-heading font-bold text-white leading-snug pr-2">
                      {oferta.titulo}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--muted)] hover:text-white hover:bg-white/[0.08] transition-colors"
                    aria-label="Cerrar"
                  >
                    <IcX />
                  </button>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-gradient-card p-4 sm:p-5 mb-6 space-y-3 text-sm">
                  <div className="flex justify-between items-baseline gap-3">
                    <span className="text-[var(--muted)]">Precio por cupón</span>
                    <span className="font-heading font-bold text-lg text-grad tabular-nums">
                      ${Number(oferta.precioOferta).toFixed(2)}
                    </span>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between items-baseline gap-3">
                    <span className="text-[var(--muted)]">Canjear antes de</span>
                    <span className="font-semibold text-white tabular-nums">
                      {formatFecha(oferta.fechaLimiteCupon)}
                    </span>
                  </div>
                </div>

                {error && (
                  <div
                    className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2"
                    role="alert"
                  >
                    <span className="shrink-0 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="label" htmlFor="cantidad-display">
                      Cantidad de cupones
                    </label>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="inline-flex items-center rounded-2xl border border-white/[0.1] bg-white/[0.03] p-1">
                        <button
                          type="button"
                          onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white hover:bg-brand-purple/25 border border-transparent hover:border-brand-purple/40 transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span
                          id="cantidad-display"
                          className="min-w-[2.5rem] text-center text-2xl font-heading font-extrabold text-white tabular-nums px-2"
                        >
                          {cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCantidad((c) => Math.min(maxCupones, c + 1))}
                          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white hover:bg-brand-cyan/20 border border-transparent hover:border-brand-cyan/35 transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-[var(--faint)]">
                        Máximo <span className="text-[var(--muted)] font-medium">{maxCupones}</span> por esta oferta
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2 text-emerald-300/95 text-xs font-semibold uppercase tracking-wide">
                      <IcLock />
                      Conexión segura (demo)
                    </div>
                    <div className="hidden sm:block h-4 w-px bg-white/10" aria-hidden />
                    <div className="flex items-center gap-2 text-[var(--muted)] text-xs">
                      <IcShield />
                      No guardamos datos de tarjeta
                    </div>
                  </div>

                  <fieldset className="border-0 p-0 m-0">
                    <legend className="label w-full mb-1 flex items-center gap-2 normal-case tracking-normal text-[var(--muted)]">
                      <span className="uppercase tracking-[0.06em] text-[var(--faint)] text-[0.72rem]">
                        Pago simulado
                      </span>
                    </legend>
                    <p className="text-xs text-[var(--faint)] mb-4 leading-relaxed">
                      Entorno de prueba: introduce datos ficticios. En producción aquí iría un procesador de pagos certificado (PCI-DSS).
                    </p>

                    <div className="space-y-3">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                          <IcCard />
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          name="cc-demo"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="input-field pl-11 font-mono text-[0.95rem] tracking-wide"
                          aria-label="Número de tarjeta (simulado)"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          name="cc-exp-demo"
                          placeholder="MM / AA"
                          maxLength={7}
                          className="input-field font-mono"
                          aria-label="Vencimiento (simulado)"
                          required
                        />
                        <input
                          type="password"
                          inputMode="numeric"
                          autoComplete="off"
                          name="cc-cvv-demo"
                          placeholder="CVV"
                          maxLength={4}
                          className="input-field font-mono"
                          aria-label="CVV (simulado)"
                          required
                        />
                      </div>
                    </div>
                  </fieldset>

                  <div className="flex justify-between items-end gap-4 pt-2 border-t border-white/[0.06]">
                    <span className="text-sm font-medium text-[var(--muted)]">Total a pagar</span>
                    <span className="text-3xl font-heading font-extrabold text-grad tabular-nums leading-none">
                      ${subtotal}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-base gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      "Procesando…"
                    ) : (
                      <>
                        <IcLock />
                        Confirmar compra · ${subtotal}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
