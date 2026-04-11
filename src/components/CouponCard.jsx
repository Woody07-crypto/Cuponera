import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useAuth } from "../context/AuthContext";

const IcDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IcTicket = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
  </svg>
);
const IcCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ESTADO = {
  disponible: { label: "Activo", dot: "glow-dot-green", text: "#34D399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  canjeado: { label: "Canjeado", dot: "glow-dot-cyan", text: "#22D3EE", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)" },
  vencido: { label: "Vencido", dot: "glow-dot-purple", text: "#F87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)" },
};

function formatFechaCompra(ts) {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-SV", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PdfVoucherHero() {
  return (
    <svg
      width="100%"
      height="120"
      viewBox="0 0 760 120"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="vh" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="45%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="760" height="120" fill="url(#vh)" />
      <rect width="760" height="120" fill="url(#grid)" />
      <circle cx="620" cy="20" r="80" fill="rgba(6,182,212,0.12)" />
      <circle cx="120" cy="100" r="60" fill="rgba(124,58,237,0.15)" />
      <g transform="translate(620, 58)" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2">
        <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
      </g>
      <text x="40" y="52" fill="#fff" fontSize="26" fontFamily="system-ui, Segoe UI, sans-serif" fontWeight="700">
        La Cuponera
      </text>
      <text x="40" y="82" fill="rgba(255,255,255,0.75)" fontSize="13" fontFamily="system-ui, sans-serif">
        Comprobante oficial de cupón digital
      </text>
    </svg>
  );
}

export default function CouponCard({ cupon }) {
  const { user } = useAuth();
  const estado = cupon.estadoMostrar ?? cupon.estado;
  const cfg = ESTADO[estado] ?? ESTADO.vencido;
  const isDisponible = estado === "disponible";
  const printRef = useRef();
  const pdfRef = useRef();
  const [downloading, setDownloading] = useState(false);

  const precioStr =
    cupon.precio != null && !Number.isNaN(Number(cupon.precio))
      ? `$${Number(cupon.precio).toFixed(2)} USD`
      : "—";

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      const data = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      let imgW = maxW;
      let imgH = (canvas.height * imgW) / canvas.width;
      if (imgH > maxH) {
        imgH = maxH;
        imgW = (canvas.width * imgH) / canvas.height;
      }
      const x = margin + (maxW - imgW) / 2;
      const y = margin + (maxH - imgH) / 2;
      pdf.addImage(data, "PNG", x, y, imgW, imgH);
      pdf.save(`LaCuponera-${cupon.codigo}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
          isDisponible ? "hover:-translate-y-1" : "opacity-60"
        }`}
        style={{
          background: "linear-gradient(160deg, rgba(19,23,32,0.9), rgba(7,9,15,0.95))",
          border: `1px solid ${isDisponible ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)"}`,
          boxShadow: isDisponible ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div ref={printRef} className="p-6" style={{ background: "linear-gradient(160deg,#0E1117,#07090F)" }}>
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#7C3AED,#06B6D4)" }}
              >
                <IcTicket />
              </div>
              <div>
                <p className="font-heading text-xs font-bold text-white/70">La Cuponera</p>
                <p className="text-xs text-white/35">{cupon.nombreEmpresa || cupon.empresa || "—"}</p>
              </div>
            </div>
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}
            >
              <span className={`glow-dot ${cfg.dot}`} style={{ width: 6, height: 6 }} />
              {cfg.label}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-white leading-snug mb-5">
            {cupon.titulo || "Sin título"}
          </h3>

          <div
            className="relative rounded-2xl p-4 text-center mb-5"
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1.5px dashed rgba(124,58,237,0.25)",
            }}
          >
            <div
              className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{ background: "#07090F", border: "1px solid rgba(124,58,237,0.2)" }}
            />
            <div
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{ background: "#07090F", border: "1px solid rgba(124,58,237,0.2)" }}
            />
            <p className="text-xs text-white/25 uppercase tracking-widest mb-1.5 font-mono">Código</p>
            <p className="font-mono text-2xl font-bold tracking-widest text-grad">{cupon.codigo}</p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/35">
            <span style={{ color: "#7C3AED" }}>
              <IcCalendar />
            </span>
            Válido hasta:{" "}
            <span className="text-white/55 font-medium">{cupon.fechaVencimiento || "—"}</span>
          </div>
        </div>

        {isDisponible && (
          <div className="px-6 pb-6 pt-1">
            <button type="button" onClick={handleDownloadPDF} disabled={downloading} className="btn-primary w-full py-3 text-sm">
              {downloading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin-slow" />
                  Generando…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <IcDownload /> Descargar PDF
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Plantilla solo para PDF */}
      <div
        ref={pdfRef}
        className="fixed left-[-10000px] top-0 w-[760px] bg-white text-slate-800 shadow-none"
        aria-hidden
        style={{ fontFamily: "system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <PdfVoucherHero />

        <div style={{ padding: "28px 36px 36px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                Documento de compra
              </p>
              <p style={{ margin: "6px 0 0", fontSize: "22px", fontWeight: 700, color: "#0f172a" }}>
                {cupon.titulo || "Cupón digital"}
              </p>
            </div>
            <div
              style={{
                textAlign: "right",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ margin: 0, fontSize: "10px", color: "#64748b", textTransform: "uppercase" }}>Estado</p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "14px",
                  fontWeight: 700,
                  color:
                    estado === "canjeado" ? "#1d4ed8" : estado === "vencido" ? "#b91c1c" : "#0f766e",
                }}
              >
                {String(estado).toUpperCase()}
              </p>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "24px" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 8px 10px 0", color: "#64748b", width: "38%" }}>Referencia interna</td>
                <td
                  style={{
                    padding: "10px 0",
                    fontWeight: 600,
                    color: "#0f172a",
                    fontFamily: "ui-monospace, monospace",
                    fontSize: "12px",
                  }}
                >
                  {cupon.id}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>Fecha de emisión</td>
                <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a" }}>{formatFechaCompra(cupon.fechaCompra)}</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>Titular (cuenta)</td>
                <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}>
                  {user?.email || "—"}
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>Comercio / empresa</td>
                <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a" }}>
                  {cupon.nombreEmpresa || cupon.empresa || "—"}
                </td>
              </tr>
              {cupon.ofertaId ? (
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>ID de oferta</td>
                  <td
                    style={{
                      padding: "10px 0",
                      fontWeight: 500,
                      color: "#334155",
                      fontSize: "12px",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {cupon.ofertaId}
                  </td>
                </tr>
              ) : null}
              {cupon.rubro ? (
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>Categoría</td>
                  <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a" }}>{cupon.rubro}</td>
                </tr>
              ) : null}
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>Importe abonado</td>
                <td style={{ padding: "10px 0", fontWeight: 700, color: "#0369a1", fontSize: "15px" }}>{precioStr}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 8px 10px 0", color: "#64748b" }}>Canjear cupón antes del</td>
                <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a" }}>{cupon.fechaVencimiento || "—"}</td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              borderRadius: "12px",
              border: "2px dashed #94a3b8",
              background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
              padding: "22px 20px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#64748b",
                fontWeight: 600,
              }}
            >
              Código de canje — presentar en el establecimiento
            </p>
            <p
              style={{
                margin: "14px 0 0",
                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#0f172a",
              }}
            >
              {cupon.codigo}
            </p>
          </div>

          <div
            style={{
              marginTop: "22px",
              padding: "14px 16px",
              borderRadius: "8px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              fontSize: "11px",
              lineHeight: 1.55,
              color: "#78350f",
            }}
          >
            <strong>Importante:</strong> este documento acredita la compra del cupón en La Cuponera. El canje está sujeto a
            disponibilidad y condiciones del comercio. Conserve este archivo o imprímalo para presentarlo junto con una
            identificación válida si el comercio lo solicita.
          </div>

          <p
            style={{
              margin: "18px 0 0",
              fontSize: "10px",
              color: "#94a3b8",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            La Cuponera · Cupón digital verificado · Documento generado electrónicamente
            <br />
            No válido como factura fiscal salvo que el comercio la emita aparte.
          </p>
        </div>
      </div>
    </>
  );
}
