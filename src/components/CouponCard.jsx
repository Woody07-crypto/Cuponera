import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const ESTADO_CONFIG = {
  disponible: { label: "Disponible", bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  canjeado:   { label: "Canjeado",   bg: "bg-blue-500/15",    text: "text-blue-400",    border: "border-blue-500/30",    dot: "bg-blue-400" },
  vencido:    { label: "Vencido",    bg: "bg-red-500/15",     text: "text-red-400",     border: "border-red-500/30",     dot: "bg-red-400" },
}

export default function CouponCard({ cupon }) {
  const estado = cupon.estadoMostrar ?? cupon.estado
  const config = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.vencido
  const isDisponible = estado === "disponible"
  const printRef = useRef()
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      const element = printRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0A1628',
        useCORS: true,
      })
      const data = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'mm', 'a5')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`cupon-${cupon.codigo}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
      isDisponible
        ? "border-[#C9A84C]/25 hover:border-[#C9A84C]/50 shadow-card hover:shadow-card-hover"
        : "border-white/8 opacity-70"
    }`}
         style={{ background: "linear-gradient(160deg, rgba(15,32,64,0.8), rgba(6,14,26,0.9))" }}>

      <div ref={printRef}
           className="p-6"
           style={{ background: "linear-gradient(160deg, #0A1628, #060E1A)" }}>

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8873A]
                            flex items-center justify-center text-[#060E1A] font-black text-sm shrink-0">
              C
            </div>
            <span className="font-heading font-bold text-white text-sm">La Cuponera</span>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                            border shrink-0 ${config.bg} ${config.text} ${config.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        <h3 className="font-heading text-xl font-bold text-white leading-snug mb-1">
          {cupon.titulo || "Sin título"}
        </h3>
        <p className="text-sm text-[#C9A84C] font-medium mb-4">
          {cupon.nombreEmpresa || cupon.empresa || "—"}
        </p>

        <div className="relative rounded-xl border border-dashed border-[#C9A84C]/30
                        bg-[rgba(201,168,76,0.04)] p-4 text-center mb-4">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#060E1A] border border-[#C9A84C]/20" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#060E1A] border border-[#C9A84C]/20" />
          <p className="text-xs text-white/35 mb-1 uppercase tracking-widest">Código del cupón</p>
          <p className="font-mono text-2xl font-bold tracking-widest text-gradient-gold">
            {cupon.codigo}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Válido hasta:{" "}
          <span className="text-white/60 font-medium">{cupon.fechaVencimiento || "—"}</span>
        </div>
      </div>

      {isDisponible && (
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="btn-gold w-full py-3 gap-2"
          >
            {downloading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-[#060E1A]/30 border-t-[#060E1A] animate-spin" />
                Generando PDF...
              </span>
            ) : (
              <>
                <IconDownload />
                Descargar cupón PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
