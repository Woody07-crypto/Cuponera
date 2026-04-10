import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const IcDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const IcTicket = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)
const IcCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const ESTADO = {
  disponible: { label:"Activo",   dot:"glow-dot-green",  text:"#34D399", bg:"rgba(16,185,129,0.1)",  border:"rgba(16,185,129,0.2)"  },
  canjeado:   { label:"Canjeado", dot:"glow-dot-cyan",   text:"#22D3EE", bg:"rgba(6,182,212,0.1)",   border:"rgba(6,182,212,0.2)"   },
  vencido:    { label:"Vencido",  dot:"glow-dot-purple", text:"#F87171", bg:"rgba(239,68,68,0.08)",  border:"rgba(239,68,68,0.18)"  },
}

export default function CouponCard({ cupon }) {
  const estado = cupon.estadoMostrar ?? cupon.estado
  const cfg    = ESTADO[estado] ?? ESTADO.vencido
  const isDisponible = estado === "disponible"
  const printRef = useRef()
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2, backgroundColor: '#07090F', useCORS: true
      })
      const pdf = new jsPDF('landscape','mm','a5')
      const w   = pdf.internal.pageSize.getWidth()
      const h   = (canvas.height * w) / canvas.width
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h)
      pdf.save(`cupon-${cupon.codigo}.pdf`)
    } finally { setDownloading(false) }
  }

  return (
    <div className={`flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
      isDisponible ? "hover:-translate-y-1" : "opacity-60"
    }`}
         style={{
           background: "linear-gradient(160deg, rgba(19,23,32,0.9), rgba(7,9,15,0.95))",
           border: `1px solid ${isDisponible ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)"}`,
           boxShadow: isDisponible ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
         }}>

      <div ref={printRef} className="p-6" style={{ background:"linear-gradient(160deg,#0E1117,#07090F)" }}>

        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background:"linear-gradient(135deg,#7C3AED,#06B6D4)" }}>
              <IcTicket />
            </div>
            <div>
              <p className="font-heading text-xs font-bold text-white/70">La Cuponera</p>
              <p className="text-xs text-white/35">{cupon.nombreEmpresa || cupon.empresa || "—"}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, color:cfg.text }}>
            <span className={`glow-dot ${cfg.dot}`} style={{ width:6, height:6 }} />
            {cfg.label}
          </span>
        </div>

        <h3 className="font-heading text-lg font-bold text-white leading-snug mb-5">
          {cupon.titulo || "Sin título"}
        </h3>

        <div className="relative rounded-2xl p-4 text-center mb-5"
             style={{ background:"rgba(124,58,237,0.06)", border:"1.5px dashed rgba(124,58,237,0.25)" }}>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
               style={{ background:"#07090F", border:"1px solid rgba(124,58,237,0.2)" }} />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
               style={{ background:"#07090F", border:"1px solid rgba(124,58,237,0.2)" }} />
          <p className="text-xs text-white/25 uppercase tracking-widest mb-1.5 font-mono">Código</p>
          <p className="font-mono text-2xl font-bold tracking-widest text-grad">
            {cupon.codigo}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <span style={{ color:"#7C3AED" }}><IcCalendar /></span>
          Válido hasta:{" "}
          <span className="text-white/55 font-medium">{cupon.fechaVencimiento || "—"}</span>
        </div>
      </div>

      {isDisponible && (
        <div className="px-6 pb-6 pt-1">
          <button onClick={handleDownloadPDF} disabled={downloading} className="btn-primary w-full py-3 text-sm">
            {downloading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin-slow" />
                Generando…
              </span>
            ) : (
              <span className="flex items-center gap-2"><IcDownload /> Descargar PDF</span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
