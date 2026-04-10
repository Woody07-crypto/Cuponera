import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";
const rowClass =
  "border-b border-gray-600/80 hover:bg-white/5 cursor-pointer transition-colors";

function DetalleModal({ titulo, data, onClose }) {
  if (!data) return null;
  const entries = Object.entries(data).filter(
    ([k]) => k !== "id" && !String(k).startsWith("_")
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1e2a22] border border-[#668A4C] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
          <h3 className="text-lg font-bold text-white">{titulo}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3 text-sm">
          {entries.length === 0 ? (
            <p className="text-gray-400">Sin datos adicionales.</p>
          ) : (
            entries.map(([key, val]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <span className={labelClass}>{key}</span>
                <span className="sm:col-span-2 text-gray-200 break-words">
                  {val && typeof val === "object" && val.toDate
                    ? val.toDate().toLocaleString("es-SV")
                    : String(val ?? "—")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState("empresas");
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [eSnap, cSnap] = await Promise.all([
          getDocs(collection(db, "empresas")),
          getDocs(collection(db, "clientes")),
        ]);
        if (!alive) return;
        setEmpresas(
          eSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
        setClientes(
          cSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      } catch (err) {
        console.error(err);
        if (alive) setError("No se pudieron cargar los datos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#ACCC7B] text-lg font-semibold animate-pulse">
          Cargando panel…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const lista = tab === "empresas" ? empresas : clientes;
  const tituloPrincipal =
    tab === "empresas" ? "Empresas registradas" : "Clientes registrados";

  return (
    <div className="min-h-screen bg-[#0f1a13] py-10 px-4 sm:px-6 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Administración
        </h1>
        <p className="text-gray-400 mb-8">
          Consulta el detalle de empresas y clientes registrados en la plataforma.
        </p>

        <div className="flex gap-2 mb-8 border-b border-gray-700 pb-4">
          {[
            { id: "empresas", label: "Empresas" },
            { id: "clientes", label: "Clientes" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                tab === t.id
                  ? "bg-[#668A4C] text-white shadow-lg"
                  : "text-gray-400 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">{tituloPrincipal}</h2>

        {lista.length === 0 ? (
          <div className="rounded-xl border border-gray-600 bg-[#1a241b] p-10 text-center text-gray-400">
            No hay registros en la colección{" "}
            <span className="text-[#ACCC7B]">{tab}</span>. Tu equipo puede
            cargar datos en Firestore (colecciones{" "}
            <code className="text-gray-300">empresas</code> y{" "}
            <code className="text-gray-300">clientes</code>).
          </div>
        ) : (
          <div className="rounded-xl border border-gray-600 overflow-hidden bg-[#1a241b]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#243028] text-gray-400">
                <tr>
                  {tab === "empresas" ? (
                    <>
                      <th className="px-4 py-3 font-semibold">Nombre</th>
                      <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                        Contacto
                      </th>
                      <th className="px-4 py-3 font-semibold hidden md:table-cell">
                        Rubro
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 font-semibold">Nombre</th>
                      <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                        Correo
                      </th>
                      <th className="px-4 py-3 font-semibold hidden md:table-cell">
                        Teléfono
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tab === "empresas"
                  ? empresas.map((row) => (
                      <tr
                        key={row.id}
                        className={rowClass}
                        onClick={() => setDetalle({ tipo: "Empresa", row })}
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {row.nombre || row.nombreComercial || row.id}
                        </td>
                        <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">
                          {row.email || row.correo || row.emailContacto || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-300 hidden md:table-cell">
                          {row.rubro || "—"}
                        </td>
                      </tr>
                    ))
                  : clientes.map((row) => (
                      <tr
                        key={row.id}
                        className={rowClass}
                        onClick={() => setDetalle({ tipo: "Cliente", row })}
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {[row.nombres, row.apellidos].filter(Boolean).join(" ") ||
                            row.id}
                        </td>
                        <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">
                          {row.correo || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-300 hidden md:table-cell">
                          {row.telefono || "—"}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 px-4 py-3 border-t border-gray-700">
              Toca una fila para ver todos los campos guardados en Firestore.
            </p>
          </div>
        )}
      </div>

      {detalle && (
        <DetalleModal
          titulo={`${detalle.tipo}: ${
            detalle.row.nombre ||
            detalle.row.nombres ||
            detalle.row.correo ||
            detalle.row.id
          }`}
          data={detalle.row}
          onClose={() => setDetalle(null)}
        />
      )}
    </div>
  );
}
