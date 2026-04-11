import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

const IcX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

function bucketOferta(o, hoy) {
  const st = o.estado || "pendiente";
  if (st === "rechazada") return "rechazadas";
  if (st === "descartada") return "descartadas";
  if (st === "pendiente") return "espera";
  if (st !== "aprobada") return "otros";
  const ini = o.fechaInicio?.toDate ? o.fechaInicio.toDate() : new Date(o.fechaInicio);
  const fin = o.fechaFin?.toDate ? o.fechaFin.toDate() : new Date(o.fechaFin);
  if (fin < hoy) return "pasadas";
  if (ini > hoy) return "futuras";
  return "activas";
}

function formatFecha(ts) {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("es-SV", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminVistaOperativaModal({ empresa, onClose }) {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresa) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const list = [];
        if (empresa.id) {
          const q1 = query(collection(db, "ofertas"), where("empresaId", "==", empresa.id));
          const s1 = await getDocs(q1);
          s1.forEach((d) => list.push({ id: d.id, ...d.data() }));
        }
        const nombre = empresa.nombre || empresa.nombreComercial;
        if (nombre) {
          const q2 = query(collection(db, "ofertas"), where("nombreEmpresa", "==", nombre));
          const s2 = await getDocs(q2);
          s2.forEach((d) => {
            if (!list.some((x) => x.id === d.id)) list.push({ id: d.id, ...d.data() });
          });
        }
        if (alive) setOfertas(list);
      } catch (e) {
        console.error(e);
        if (alive) setOfertas([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [empresa]);

  if (!empresa) return null;

  const hoy = new Date();
  const pct = Number(empresa.porcentajeComision ?? 0) / 100;
  const grupos = {
    espera: [],
    futuras: [],
    activas: [],
    pasadas: [],
    rechazadas: [],
    descartadas: [],
    otros: [],
  };
  ofertas.forEach((o) => {
    const b = bucketOferta(o, hoy);
    grupos[b].push(o);
  });

  const filaMetricas = (o) => {
    const vend = o.cuponesVendidos || 0;
    const lim = o.cantidadLimite;
    const disp = lim != null ? Math.max(0, lim - vend) : "—";
    const precio = Number(o.precioOferta) || 0;
    const ing = vend * precio;
    const cargo = ing * pct;
    return { vend, disp, ing, cargo };
  };

  const renderGrupo = (titulo, arr) =>
    arr.length === 0 ? null : (
      <div key={titulo} className="mb-6">
        <h4 className="text-sm font-bold text-white/90 mb-2">{titulo}</h4>
        <ul className="space-y-2 text-xs">
          {arr.map((o) => {
            const m = filaMetricas(o);
            return (
              <li key={o.id} className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                <span className="font-semibold text-white">{o.titulo}</span>
                <span className="text-white/35"> · </span>
                <span className="text-[var(--muted)]">
                  {o.estado} · vigencia {formatFecha(o.fechaInicio)} – {formatFecha(o.fechaFin)}
                </span>
                <div className="text-[var(--faint)] mt-1 grid grid-cols-2 sm:grid-cols-4 gap-1">
                  <span>Vendidos: {m.vend}</span>
                  <span>Disponibles: {m.disp}</span>
                  <span>Ingresos: ${m.ing.toFixed(2)}</span>
                  <span>Comisión: ${m.cargo.toFixed(2)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-[#07090F]/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[min(90vh,720px)] flex flex-col glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden animate-fade-in-up">
        <div className="h-1 w-full bg-gradient-brand shrink-0" aria-hidden />
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.06] shrink-0">
          <h3 className="text-lg font-heading font-bold text-white pr-2">
            Vista operativa — {empresa.nombre || empresa.nombreComercial || empresa.id}
          </h3>
          <button type="button" onClick={onClose} className="shrink-0 p-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white" aria-label="Cerrar">
            <IcX />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-sm">
          {loading ? (
            <p className="text-[var(--muted)]">Cargando ofertas…</p>
          ) : ofertas.length === 0 ? (
            <p className="text-[var(--muted)]">Sin ofertas vinculadas a esta empresa.</p>
          ) : (
            <>
              {renderGrupo("En espera de aprobación", grupos.espera)}
              {renderGrupo("Aprobadas futuras", grupos.futuras)}
              {renderGrupo("Activas (vigentes)", grupos.activas)}
              {renderGrupo("Pasadas", grupos.pasadas)}
              {renderGrupo("Rechazadas", grupos.rechazadas)}
              {renderGrupo("Descartadas", grupos.descartadas)}
              {renderGrupo("Otros estados", grupos.otros)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
