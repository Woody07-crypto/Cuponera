import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  listarPerfiles,
  guardarRolPerfil,
  ROLES_ORDENADOS,
} from "../services/perfilService";
import { fetchRubrosActivos } from "../services/rubrosService";
import AdminRubrosTab from "./admin/AdminRubrosTab";
import AdminEmpresasTab from "./admin/AdminEmpresasTab";
import AdminVistaOperativaModal from "./admin/AdminVistaOperativaModal";
import AdminClienteCuponesModal from "./admin/AdminClienteCuponesModal";

const IcX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const IcInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);
const IcBuilding = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
    <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
  </svg>
);
const IcUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IcShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcTag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

function DetalleModal({ titulo, data, onClose }) {
  if (!data) return null;
  const entries = Object.entries(data).filter(
    ([k]) => k !== "id" && !String(k).startsWith("_")
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07090F]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detalle-titulo"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg animate-fade-in-up">
        <div className="absolute inset-0 rounded-4xl bg-gradient-mesh opacity-50 pointer-events-none" aria-hidden />
        <div className="relative glass rounded-4xl border border-white/[0.08] shadow-glass overflow-hidden max-h-[min(88vh,640px)] flex flex-col">
          <div className="h-1 w-full bg-gradient-brand shrink-0" aria-hidden />
          <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-white/[0.06] shrink-0">
            <h3 id="detalle-titulo" className="text-lg font-heading font-bold text-white leading-snug pr-2">
              {titulo}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--muted)] hover:text-white hover:bg-white/[0.08] transition-colors"
              aria-label="Cerrar"
            >
              <IcX />
            </button>
          </div>
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-0">
            {entries.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Sin datos adicionales.</p>
            ) : (
              <dl className="divide-y divide-white/[0.06]">
                {entries.map(([key, val]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,9rem)_1fr] gap-x-4 gap-y-1 py-3.5 first:pt-0"
                  >
                    <dt className="label !mb-0 text-[0.68rem] pt-0.5">{key}</dt>
                    <dd className="text-sm text-white/90 break-words font-mono sm:font-sans">
                      {val && typeof val === "object" && val.toDate
                        ? val.toDate().toLocaleString("es-SV")
                        : String(val ?? "—")}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const selectChevronStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundSize: "1rem",
  backgroundPosition: "right 0.65rem center",
  backgroundRepeat: "no-repeat",
};

const selectTable = "input-field cursor-pointer text-xs py-2 pr-10 appearance-none";

const roleLabels = {
  cliente: "Cliente",
  admin: "Administrador",
  admin_empresa: "Admin empresa",
  empleado: "Empleado (canje)",
};

const TABS = [
  { id: "empresas", label: "Empresas", icon: IcBuilding },
  { id: "clientes", label: "Clientes", icon: IcUsers },
  { id: "rubros", label: "Rubros", icon: IcTag },
  { id: "roles", label: "Roles", icon: IcShield },
];

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
  const [rubrosActivos, setRubrosActivos] = useState([]);
  const [vistaEmpresa, setVistaEmpresa] = useState(null);
  const [clienteCupones, setClienteCupones] = useState(null);

  const recargarEmpresasYClientes = async () => {
    const [eSnap, cSnap, rList] = await Promise.all([
      getDocs(collection(db, "empresas")),
      getDocs(collection(db, "clientes")),
      fetchRubrosActivos(db).catch(() => []),
    ]);
    setEmpresas(eSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setClientes(cSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setRubrosActivos(rList);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await recargarEmpresasYClientes();
        if (!alive) return;
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

  useEffect(() => {
    if (tab !== "empresas" && tab !== "rubros") return;
    fetchRubrosActivos(db)
      .then(setRubrosActivos)
      .catch(() => setRubrosActivos([]));
  }, [tab]);

  const handleGuardarRol = async (uid) => {
    const role = roleDraft[uid];
    if (!role || !ROLES_ORDENADOS.includes(role)) return;
    setSavingUid(uid);
    setRolesError(null);
    try {
      await guardarRolPerfil(db, uid, role);
      setPerfiles((prev) => prev.map((p) => (p.id === uid ? { ...p, role } : p)));
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
      <div className="page-bg min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
        <div className="h-9 w-9 rounded-full border-2 border-brand-purple/30 border-t-brand-cyan animate-spin" aria-hidden />
        <p className="text-sm font-medium text-[var(--muted)]">Cargando panel…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-bg min-h-[60vh] flex items-center justify-center px-4">
        <div className="glass rounded-2xl border border-red-500/30 px-6 py-4 text-red-200 text-sm max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  const lista = tab === "empresas" ? empresas : tab === "clientes" ? clientes : [];
  const tituloPrincipal =
    tab === "empresas"
      ? "Empresas registradas"
      : tab === "clientes"
        ? "Clientes registrados"
        : tab === "rubros"
          ? "Rubros del sistema"
          : "Perfiles y roles";

  return (
    <div className="page-bg min-h-screen py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight mb-3">
            Administración
          </h1>
          <p className="text-[var(--muted)] text-sm sm:text-base max-w-3xl leading-relaxed">
            Consulta empresas, clientes y gestiona quién es administrador u otros roles desde la
            colección{" "}
            <code className="badge badge-purple px-2 py-0.5 text-[0.7rem] font-mono align-middle">
              perfiles
            </code>
            .
          </p>
        </header>

        <div
          className="flex flex-wrap gap-2 p-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] mb-8 sm:mb-10 w-fit max-w-full"
          role="tablist"
          aria-label="Secciones del panel"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-brand text-white shadow-glow-purple"
                    : "text-[var(--muted)] hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Icon />
                {t.label}
              </button>
            );
          })}
        </div>

        <section aria-labelledby="admin-section-title">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
            <h2 id="admin-section-title" className="text-xl sm:text-2xl font-heading font-bold text-white">
              {tituloPrincipal}
            </h2>
            {(tab === "empresas" || tab === "clientes") && lista.length > 0 && (
              <span className="text-xs text-[var(--faint)] font-medium">
                {lista.length} registro{lista.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {tab === "rubros" ? (
            <AdminRubrosTab
              onRubrosChanged={() =>
                fetchRubrosActivos(db)
                  .then(setRubrosActivos)
                  .catch(() => {})
              }
            />
          ) : tab === "roles" ? (
            <div className="space-y-8">
              {rolesError && (
                <div
                  className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  role="alert"
                >
                  {rolesError}
                </div>
              )}

              <form
                onSubmit={handleCrearPerfil}
                className="glass rounded-3xl border border-white/[0.08] shadow-glass p-6 sm:p-8 space-y-5"
              >
                <div className="h-0.5 w-16 rounded-full bg-gradient-brand mb-1" aria-hidden />
                <h3 className="text-lg font-heading font-bold text-white">Asignar rol por UID</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Crea o actualiza el documento{" "}
                  <code className="text-cyan-300/90 font-mono text-xs">perfiles/&lt;uid&gt;</code>. El
                  UID lo obtienes en Firebase Console → Authentication → Usuario.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="label" htmlFor="admin-nuevo-uid">
                      UID
                    </label>
                    <input
                      id="admin-nuevo-uid"
                      type="text"
                      value={nuevoUid}
                      onChange={(e) => setNuevoUid(e.target.value)}
                      placeholder="Ej. AbC12xYz…"
                      className="input-field font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="admin-nuevo-rol">
                      Rol
                    </label>
                    <select
                      id="admin-nuevo-rol"
                      value={nuevoRol}
                      onChange={(e) => setNuevoRol(e.target.value)}
                      className={`${selectTable} w-full text-sm`}
                      style={selectChevronStyle}
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
                  <label className="label" htmlFor="admin-nuevo-correo">
                    Correo (opcional)
                  </label>
                  <input
                    id="admin-nuevo-correo"
                    type="email"
                    value={nuevoCorreo}
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                    placeholder="referencia@sitio.com"
                    className="input-field text-sm"
                  />
                </div>
                <button type="submit" disabled={creandoPerfil} className="btn-primary">
                  {creandoPerfil ? "Guardando…" : "Guardar perfil"}
                </button>
              </form>

              {rolesLoading ? (
                <div className="flex items-center gap-3 text-sm text-[var(--muted)] py-6">
                  <div className="h-5 w-5 rounded-full border-2 border-brand-purple/30 border-t-brand-cyan animate-spin shrink-0" />
                  Cargando perfiles…
                </div>
              ) : perfiles.length === 0 ? (
                <div className="glass rounded-3xl border border-white/[0.08] p-10 sm:p-12 text-center">
                  <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                    Aún no hay documentos en{" "}
                    <code className="text-cyan-300/90 font-mono text-xs">perfiles</code>. Los nuevos
                    registros de cliente ya crean su perfil automáticamente; para administradores usa el
                    formulario de arriba.
                  </p>
                </div>
              ) : (
                <div className="glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[520px]">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                          <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider">
                            UID
                          </th>
                          <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider hidden sm:table-cell">
                            Correo
                          </th>
                          <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider w-[min(220px,40%)]">
                            Rol
                          </th>
                          <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider w-28 text-right sm:text-left">
                            Acción
                          </th>
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
                              className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors"
                            >
                              <td
                                className="px-4 sm:px-5 py-3.5 font-mono text-xs text-white/85 max-w-[160px] sm:max-w-[220px] truncate align-middle"
                                title={row.id}
                              >
                                {row.id}
                              </td>
                              <td className="px-4 sm:px-5 py-3.5 text-white/80 hidden sm:table-cell align-middle">
                                {row.correo || "—"}
                              </td>
                              <td className="px-4 sm:px-5 py-3 align-middle">
                                <select
                                  value={rolSeleccionado}
                                  onChange={(e) =>
                                    setRoleDraft((d) => ({
                                      ...d,
                                      [row.id]: e.target.value,
                                    }))
                                  }
                                  className={`${selectTable} w-full max-w-[220px]`}
                                  style={selectChevronStyle}
                                >
                                  {ROLES_ORDENADOS.map((r) => (
                                    <option key={r} value={r}>
                                      {roleLabels[r] || r}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 sm:px-5 py-3 align-middle text-right sm:text-left">
                                <button
                                  type="button"
                                  disabled={
                                    savingUid === row.id || rolSeleccionado === rolEnFirestore
                                  }
                                  onClick={() => handleGuardarRol(row.id)}
                                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.06] text-white hover:bg-brand-purple/25 hover:border-brand-purple/40 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
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
                </div>
              )}
            </div>
          ) : tab === "empresas" ? (
            <AdminEmpresasTab
              empresas={empresas}
              rubrosActivos={rubrosActivos}
              onRecargar={recargarEmpresasYClientes}
              onVerDetalle={(row) => setDetalle({ tipo: "Empresa", row })}
              onVistaOperativa={(row) => setVistaEmpresa(row)}
            />
          ) : lista.length === 0 ? (
            <div className="glass rounded-3xl border border-white/[0.08] p-10 sm:p-14 text-center">
              <p className="text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
                No hay registros en la colección{" "}
                <span className="text-cyan-300/90 font-medium">{tab}</span>. Los clientes se crean al
                registrarse en la app.
              </p>
            </div>
          ) : (
            <div className="glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[520px]">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                      <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider hidden sm:table-cell">
                        Correo
                      </th>
                      <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider hidden md:table-cell">
                        Teléfono
                      </th>
                      <th className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--faint)] text-xs uppercase tracking-wider w-44">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.04] transition-colors group"
                      >
                        <td className="px-4 sm:px-5 py-3.5 font-semibold text-white">
                          {[row.nombres, row.apellidos].filter(Boolean).join(" ") || row.id}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 text-white/75 hidden sm:table-cell">
                          {row.correo || "—"}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 text-white/75 font-mono text-xs hidden md:table-cell tabular-nums">
                          {row.telefono || "—"}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="text-xs px-3 py-1.5 rounded-lg border border-brand-purple/35 text-cyan-200/95 hover:bg-white/6"
                              onClick={() => setClienteCupones(row)}
                            >
                              Cupones
                            </button>
                            <button
                              type="button"
                              className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/6"
                              onClick={() => setDetalle({ tipo: "Cliente", row })}
                            >
                              Ficha
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-start gap-3 px-4 sm:px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.02]">
                <span className="text-brand-cyan shrink-0 mt-0.5" aria-hidden>
                  <IcInfo />
                </span>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  <span className="font-semibold text-white/90">Tip:</span> «Cupones» agrupa por
                  disponibles / canjeados / vencidos. «Ficha» muestra todos los campos en Firestore.
                </p>
              </div>
            </div>
          )}
        </section>
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
      {vistaEmpresa && (
        <AdminVistaOperativaModal empresa={vistaEmpresa} onClose={() => setVistaEmpresa(null)} />
      )}
      {clienteCupones && (
        <AdminClienteCuponesModal cliente={clienteCupones} onClose={() => setClienteCupones(null)} />
      )}
    </div>
  );
}
