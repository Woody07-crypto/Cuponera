import { useState } from "react"
import { doc, updateDoc, deleteField, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import {
  buscarEmpresaIdPorNombre,
  leerCodigoEmpresaDeData,
  nombreEmpresaEnOferta,
} from "../services/empresaService"
import { useToast } from "./ui/Toast"

const IcX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const MIN_JUSTIFICACION = 8

/**
 * Modal para que el administrador de La Cuponera apruebe o rechace una oferta pendiente.
 */
export default function AdminRevisionOferta({ oferta, formatFecha, onClose, onResuelto }) {
  const { showToast } = useToast()
  const [paso, setPaso] = useState("revision") // revision | confirmarAprobar | cartaRechazo
  const [justificacion, setJustificacion] = useState("")
  const [guardando, setGuardando] = useState(false)

  const aprobar = async () => {
    setGuardando(true)
    try {
      const updates = {
        estado: "aprobada",
        justificacionRechazo: deleteField(),
      }
      let empresaIdSync = oferta.empresaId || null
      if (empresaIdSync && typeof empresaIdSync === "object" && empresaIdSync.id) {
        empresaIdSync = empresaIdSync.id
      }
      if (!empresaIdSync) {
        try {
          empresaIdSync = await buscarEmpresaIdPorNombre(db, nombreEmpresaEnOferta(oferta))
        } catch (e) {
          console.error(e)
        }
      }
      if (empresaIdSync) {
        updates.empresaId = empresaIdSync
        try {
          const empresaSnap = await getDoc(doc(db, "empresas", empresaIdSync))
          if (empresaSnap.exists()) {
            const d = empresaSnap.data()
            const n = (d.nombre || "").trim()
            if (n) updates.nombreEmpresa = n
            const c = leerCodigoEmpresaDeData(d)
            if (c) updates.codigoEmpresa = c
            const em = (d.correo || "").trim()
            if (em) updates.correoEmpresa = em
          }
        } catch (e) {
          console.error(e)
        }
      }
      await updateDoc(doc(db, "ofertas", oferta.id), updates)
      showToast("Oferta aprobada. Ya puede publicarse en el catálogo.", "success")
      onResuelto?.()
      onClose()
    } catch (e) {
      console.error(e)
      showToast("No se pudo aprobar la oferta. Intenta de nuevo.", "error")
    } finally {
      setGuardando(false)
    }
  }

  const rechazar = async () => {
    const j = justificacion.trim()
    if (j.length < MIN_JUSTIFICACION) {
      showToast(`Escribe al menos ${MIN_JUSTIFICACION} caracteres en la justificación.`, "warning")
      return
    }
    setGuardando(true)
    try {
      await updateDoc(doc(db, "ofertas", oferta.id), {
        estado: "rechazada",
        justificacionRechazo: j,
      })
      showToast("Oferta rechazada. La empresa verá el motivo en su panel.", "success")
      onResuelto?.()
      onClose()
    } catch (e) {
      console.error(e)
      showToast("No se pudo rechazar la oferta. Intenta de nuevo.", "error")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07090F]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-revision-titulo"
      onClick={(e) => {
        if (e.target === e.currentTarget && !guardando) onClose()
      }}
    >
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <div className="absolute inset-0 rounded-4xl bg-gradient-mesh opacity-60 pointer-events-none" aria-hidden />
        <div className="relative glass rounded-4xl border border-white/[0.08] shadow-glass overflow-hidden">
          <div className="h-1 w-full bg-gradient-brand" aria-hidden />

          <div className="p-6 sm:p-8 max-h-[min(90vh,720px)] overflow-y-auto">
            {paso === "confirmarAprobar" ? (
              <div className="space-y-6">
                <h3 id="admin-revision-titulo" className="text-xl font-heading font-bold text-white">
                  ¿Confirmar aprobación?
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  La oferta <span className="text-white/80 font-medium">&quot;{oferta.titulo}&quot;</span> de{" "}
                  <span className="text-brand-cyan/90">{oferta.nombreEmpresa}</span> pasará a estado{" "}
                  <span className="text-emerald-300 font-medium">aprobada</span> y podrá mostrarse en la tienda pública
                  cuando esté en fechas vigentes.
                </p>
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={() => setPaso("revision")}
                    className="btn-ghost flex-1 justify-center"
                  >
                    Cancelar
                  </button>
                  <button type="button" disabled={guardando} onClick={aprobar} className="btn-primary flex-1 justify-center">
                    {guardando ? "Aprobando…" : "Sí, aprobar oferta"}
                  </button>
                </div>
              </div>
            ) : paso === "cartaRechazo" ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-red-500/25 bg-red-950/20 px-5 py-6 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-80"
                    style={{ background: "linear-gradient(90deg, #F87171, #7C3AED)" }}
                    aria-hidden
                  />
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-red-300/90 mb-2">
                    Carta de rechazo
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed font-serif italic border-l-2 border-red-400/40 pl-3">
                    La Cuponera informa que la promoción enviada no ha sido aceptada en esta ocasión. A continuación se
                    indica el motivo para que la empresa ofertante pueda corregir o descartar la oferta.
                  </p>
                </div>

                <div>
                  <label htmlFor="justificacion-rechazo" className="label text-xs">
                    Motivo del rechazo (visible para la empresa)
                  </label>
                  <textarea
                    id="justificacion-rechazo"
                    rows={4}
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    placeholder="Ej.: Precio inconsistente con el rubro, fechas inválidas, imágenes o textos incompletos…"
                    className="input-field mt-1.5 w-full resize-y min-h-[100px] text-sm py-3"
                  />
                  <p className="text-[var(--faint)] text-xs mt-1.5">
                    Mínimo {MIN_JUSTIFICACION} caracteres ({justificacion.trim().length}/{MIN_JUSTIFICACION})
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={() => {
                      setPaso("revision")
                      setJustificacion("")
                    }}
                    className="btn-ghost flex-1 justify-center"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    disabled={guardando || justificacion.trim().length < MIN_JUSTIFICACION}
                    onClick={rechazar}
                    className="flex-1 justify-center rounded-xl border border-red-500/35 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-100 hover:bg-red-500/25 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {guardando ? "Enviando…" : "Confirmar rechazo"}
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
                    <h3 id="admin-revision-titulo" className="text-xl sm:text-2xl font-heading font-bold text-white leading-snug pr-2">
                      {oferta.titulo}
                    </h3>
                    <span className="inline-flex mt-2 badge badge-amber text-[0.65rem]">Pendiente de aprobación</span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={guardando}
                    className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--muted)] hover:text-white hover:bg-white/[0.08] transition-colors"
                    aria-label="Cerrar"
                  >
                    <IcX />
                  </button>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-gradient-card p-4 sm:p-5 mb-6 space-y-3 text-sm">
                  <div className="flex justify-between items-baseline gap-3">
                    <span className="text-[var(--muted)]">Precio oferta</span>
                    <span className="font-heading font-bold text-lg text-grad tabular-nums">
                      ${Number(oferta.precioOferta).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-[var(--muted)]">
                    <span>Precio regular</span>
                    <span className="text-white/50 line-through">${Number(oferta.precioRegular).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-[var(--muted)]">
                    <span>Vigencia oferta</span>
                    <span className="text-white/70 text-right text-xs">
                      {formatFecha(oferta.fechaInicio)} — {formatFecha(oferta.fechaFin)}
                    </span>
                  </div>
                  {oferta.fechaLimiteCupon && (
                    <div className="flex justify-between gap-3 text-[var(--muted)]">
                      <span>Límite canje cupón</span>
                      <span className="text-white/70">{formatFecha(oferta.fechaLimiteCupon)}</span>
                    </div>
                  )}
                  {oferta.descripcion && (
                    <p className="text-xs text-white/40 pt-2 border-t border-white/[0.06] leading-relaxed">{oferta.descripcion}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={() => setPaso("cartaRechazo")}
                    className="flex-1 justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-500/18 transition-colors"
                  >
                    Rechazar oferta
                  </button>
                  <button
                    type="button"
                    disabled={guardando}
                    onClick={() => setPaso("confirmarAprobar")}
                    className="btn-primary flex-1 justify-center"
                  >
                    Aprobar oferta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
