import { Link } from "react-router-dom"

/**
 * Mensaje de éxito alineado al modal de compra (`CompraForm`).
 * Útil si en algún flujo se confirma la compra fuera del modal.
 */
export default function ConfirmacionCompra({ codigo }) {
  return (
    <div
      className="mt-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 text-center shadow-glass animate-fade-in-up"
      role="status"
    >
      <div className="text-4xl mb-3" aria-hidden>
        🎉
      </div>
      <h3 className="text-xl font-heading font-bold text-grad mb-2">¡Compra exitosa!</h3>
      <p className="text-[var(--muted)] text-sm mb-4">Tu código de cupón es:</p>
      <div className="rounded-2xl border border-brand-purple/30 bg-brand-card/80 px-4 py-3 font-mono text-lg font-semibold tracking-[0.2em] text-cyan-300">
        {codigo}
      </div>
      <p className="text-xs text-[var(--faint)] mt-4 mb-5">
        También lo encontrarás en Mis cupones, con opción de descargar PDF.
      </p>
      <Link to="/mis-cupones" className="btn-primary inline-flex justify-center text-sm py-2.5 px-6">
        Ver mis cupones
      </Link>
    </div>
  )
}
