import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

const IcX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

function estadoMostrar(c) {
  if (c.estado === "canjeado") return "canjeado";
  if (c.estado === "vencido") return "vencido";
  const lim = c.fechaLimiteCupon?.toDate ? c.fechaLimiteCupon.toDate() : c.fechaLimiteCupon ? new Date(c.fechaLimiteCupon) : null;
  if (lim && lim < new Date()) return "vencido";
  return "disponible";
}

export default function AdminClienteCuponesModal({ cliente, onClose }) {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cliente?.id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "cupones"), where("clienteUid", "==", cliente.id));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (alive) setCupones(list);
      } catch (e) {
        console.error(e);
        if (alive) setCupones([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [cliente]);

  if (!cliente) return null;

  const disp = cupones.filter((c) => estadoMostrar(c) === "disponible");
  const canj = cupones.filter((c) => estadoMostrar(c) === "canjeado");
  const venc = cupones.filter((c) => estadoMostrar(c) === "vencido");

  const bloque = (titulo, arr) => (
    <div className="mb-5">
      <h4 className="text-xs font-bold uppercase tracking-wide text-white/50 mb-2">
        {titulo} ({arr.length})
      </h4>
      {arr.length === 0 ? (
        <p className="text-xs text-[var(--faint)]">Ninguno</p>
      ) : (
        <ul className="space-y-1.5 text-xs">
          {arr.map((c) => (
            <li key={c.id} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 font-mono text-cyan-200/85">
              {c.codigo} · {c.titulo || "—"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-[#07090F]/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg max-h-[min(88vh,640px)] flex flex-col glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden animate-fade-in-up">
        <div className="h-1 w-full bg-gradient-brand shrink-0" aria-hidden />
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.06] shrink-0">
          <h3 className="text-lg font-heading font-bold text-white">
            Cupones — {[cliente.nombres, cliente.apellidos].filter(Boolean).join(" ") || cliente.correo || cliente.id}
          </h3>
          <button type="button" onClick={onClose} className="shrink-0 p-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white" aria-label="Cerrar">
            <IcX />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <p className="text-sm text-[var(--muted)]">Cargando…</p>
          ) : (
            <>
              {bloque("Disponibles", disp)}
              {bloque("Canjeados", canj)}
              {bloque("Vencidos", venc)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
