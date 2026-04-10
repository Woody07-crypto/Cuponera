import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  listarPerfiles,
  guardarRolPerfil,
  ROLES_ORDENADOS,
} from "../services/perfilService";

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

const roleLabels = {
  cliente: "Cliente",
  admin: "Administrador",
  admin_empresa: "Admin empresa",
  empleado: "Empleado (canje)",
};

export default function AdminPanel() {
  const [tab, setTab] = useState("empresas");
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [roleDraft, setRoleDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rolesError, setRolesError] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [nuevoUid, setNuevoUid] = useState("");
  const [nuevoRol, setNuevoRol] = useState("admin");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [savingUid, setSavingUid] = useState(null);
  const [creandoPerfil, setCreandoPerfil] = useState(false);

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

  useEffect(() => {
    if (tab !== "roles") return;
    let alive = true;
    (async () => {
      try {
        setRolesLoading(true);
        setRolesError(null);
        const list = await listarPerfiles(db);
        if (!alive) return;
        setPerfiles(list);
        setRoleDraft(
          Object.fromEntries(
            list.map((p) => [p.id, ROLES_ORDENADOS.includes(p.role) ? p.role : "cliente"])
          )
        );
      } catch (err) {
        console.error(err);
        if (alive) setRolesError("No se pudieron cargar los perfiles.");
      } finally {
        if (alive) setRolesLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tab]);

  const handleGuardarRol = async (uid) => {
    const role = roleDraft[uid];
    if (!role || !ROLES_ORDENADOS.includes(role)) return;
    setSavingUid(uid);
    setRolesError(null);
    try {
      await guardarRolPerfil(db, uid, role);
      setPerfiles((prev) =>
        prev.map((p) => (p.id === uid ? { ...p, role } : p))
      );
    } catch (err) {
      console.error(err);
      setRolesError("No se pudo guardar el rol. Revisa permisos en Firestore.");
    } finally {
      setSavingUid(null);
    }
  };

  const handleCrearPerfil = async (e) => {
    e.preventDefault();
    const uid = nuevoUid.trim();
    if (uid.length < 20) {
      setRolesError("Pega el UID completo del usuario (Firebase Authentication).");
      return;
    }
    setCreandoPerfil(true);
    setRolesError(null);
    try {
      const extra = nuevoCorreo.trim() ? { correo: nuevoCorreo.trim() } : {};
      await guardarRolPerfil(db, uid, nuevoRol, extra);
      const list = await listarPerfiles(db);
      setPerfiles(list);
      setRoleDraft(
        Object.fromEntries(
          list.map((p) => [p.id, ROLES_ORDENADOS.includes(p.role) ? p.role : "cliente"])
        )
      );
      setNuevoUid("");
      setNuevoCorreo("");
    } catch (err) {
      console.error(err);
      setRolesError("No se pudo crear el perfil.");
    } finally {
      setCreandoPerfil(false);
    }
  };

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
    tab === "empresas"
      ? "Empresas registradas"
      : tab === "clientes"
        ? "Clientes registrados"
        : "Perfiles y roles";

  return (
    <div className="min-h-screen bg-[#0f1a13] py-10 px-4 sm:px-6 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          Administración
        </h1>
        <p className="text-gray-400 mb-8">
          Consulta empresas, clientes y gestiona quién es administrador u otros roles
          desde la colección <code className="text-[#ACCC7B]">perfiles</code>.
        </p>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
          {[
            { id: "empresas", label: "Empresas" },
            { id: "clientes", label: "Clientes" },
            { id: "roles", label: "Roles" },
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

        {tab === "roles" ? (
          <div className="space-y-8">
            {rolesError && (
              <div className="rounded-lg border border-red-800/60 bg-red-950/40 text-red-300 px-4 py-3 text-sm">
                {rolesError}
              </div>
            )}

            <form
              onSubmit={handleCrearPerfil}
              className="rounded-xl border border-gray-600 bg-[#1a241b] p-6 space-y-4"
            >
              <h3 className="text-lg font-bold text-white">Asignar rol por UID</h3>
              <p className="text-sm text-gray-400">
                Crea o actualiza el documento{" "}
                <code className="text-gray-300">perfiles/&lt;uid&gt;</code>. El UID lo
                obtienes en Firebase Console → Authentication → Usuario.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>UID</label>
                  <input
                    type="text"
                    value={nuevoUid}
                    onChange={(e) => setNuevoUid(e.target.value)}
                    placeholder="Ej. AbC12xYz..."
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0f1a13] border border-gray-600 text-white text-sm"
                  />
                </div>
                <div>
                  <label className={labelClass}>Rol</label>
                  <select
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0f1a13] border border-gray-600 text-white text-sm"
                  >
                    {ROLES_ORDENADOS.map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r] || r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Correo (opcional)</label>
                <input
                  type="email"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  placeholder="referencia@sitio.com"
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-[#0f1a13] border border-gray-600 text-white text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={creandoPerfil}
                className="px-5 py-2.5 rounded-lg bg-[#668A4C] hover:bg-[#557a3d] disabled:opacity-50 font-semibold text-sm"
              >
                {creandoPerfil ? "Guardando…" : "Guardar perfil"}
              </button>
            </form>

            {rolesLoading ? (
              <p className="text-[#ACCC7B] text-sm font-medium animate-pulse">
                Cargando perfiles…
              </p>
            ) : perfiles.length === 0 ? (
              <div className="rounded-xl border border-gray-600 bg-[#1a241b] p-10 text-center text-gray-400 text-sm">
                Aún no hay documentos en <code className="text-[#ACCC7B]">perfiles</code>.
                Los nuevos registros de cliente ya crean su perfil automáticamente; para
                administradores usa el formulario de arriba.
              </div>
            ) : (
              <div className="rounded-xl border border-gray-600 overflow-hidden bg-[#1a241b]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#243028] text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">UID</th>
                      <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                        Correo
                      </th>
                      <th className="px-4 py-3 font-semibold">Rol</th>
                      <th className="px-4 py-3 font-semibold w-32">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfiles.map((row) => {
                      const rolEnFirestore = ROLES_ORDENADOS.includes(row.role)
                        ? row.role
                        : "cliente";
                      const rolSeleccionado = roleDraft[row.id] ?? rolEnFirestore;
                      return (
                        <tr
                          key={row.id}
                          className="border-b border-gray-600/80 hover:bg-white/5 transition-colors"
                        >
                          <td
                            className="px-4 py-3 font-mono text-xs text-gray-300 max-w-[140px] truncate sm:max-w-xs"
                            title={row.id}
                          >
                            {row.id}
                          </td>
                          <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">
                            {row.correo || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={rolSeleccionado}
                              onChange={(e) =>
                                setRoleDraft((d) => ({
                                  ...d,
                                  [row.id]: e.target.value,
                                }))
                              }
                              className="w-full max-w-[200px] px-2 py-1.5 rounded-lg bg-[#0f1a13] border border-gray-600 text-white text-xs"
                            >
                              {ROLES_ORDENADOS.map((r) => (
                                <option key={r} value={r}>
                                  {roleLabels[r] || r}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              disabled={
                                savingUid === row.id ||
                                rolSeleccionado === rolEnFirestore
                              }
                              onClick={() => handleGuardarRol(row.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#668A4C]/80 hover:bg-[#668A4C] disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {savingUid === row.id ? "…" : "Guardar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : lista.length === 0 ? (
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
