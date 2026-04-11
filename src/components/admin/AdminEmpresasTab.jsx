import { useState } from "react";
import { crearEmpresa, actualizarEmpresa, eliminarEmpresa, validarCodigoEmpresa } from "../../services/empresaService";
import { db } from "../../firebase/config";

const empty = {
  nombre: "",
  codigoEmpresa: "",
  direccion: "",
  nombreContacto: "",
  telefono: "",
  correo: "",
  rubro: "",
  porcentajeComision: "10",
};

export default function AdminEmpresasTab({ empresas, rubrosActivos, onRecargar, onVerDetalle, onVistaOperativa }) {
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const reset = () => {
    setForm(empty);
    setEditId(null);
  };

  const iniciarEdicion = (e, row) => {
    e.stopPropagation();
    setEditId(row.id);
    setForm({
      nombre: row.nombre || row.nombreComercial || "",
      codigoEmpresa: row.codigoEmpresa || "",
      direccion: row.direccion || "",
      nombreContacto: row.nombreContacto || row.contacto || "",
      telefono: row.telefono || "",
      correo: row.correo || row.email || row.emailContacto || "",
      rubro: row.rubro || "",
      porcentajeComision: String(row.porcentajeComision ?? "10"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    const v = validarCodigoEmpresa(form.codigoEmpresa);
    if (!v.ok) {
      setMsg({ tipo: "err", text: v.error });
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await actualizarEmpresa(db, editId, {
          nombre: form.nombre.trim(),
          codigoEmpresa: form.codigoEmpresa.trim(),
          direccion: form.direccion.trim(),
          nombreContacto: form.nombreContacto.trim(),
          telefono: form.telefono.trim(),
          correo: form.correo.trim(),
          rubro: form.rubro.trim(),
          porcentajeComision: form.porcentajeComision,
        });
        setMsg({ tipo: "ok", text: "Empresa actualizada." });
      } else {
        await crearEmpresa(db, {
          nombre: form.nombre.trim(),
          codigoEmpresa: form.codigoEmpresa.trim(),
          direccion: form.direccion.trim(),
          nombreContacto: form.nombreContacto.trim(),
          telefono: form.telefono.trim(),
          correo: form.correo.trim(),
          rubro: form.rubro.trim(),
          porcentajeComision: form.porcentajeComision,
        });
        setMsg({ tipo: "ok", text: "Empresa creada." });
      }
      reset();
      await onRecargar();
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "err", text: err.message || "Error al guardar." });
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (e, id) => {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta empresa? Solo si no tiene dependencias críticas en producción.")) return;
    setSaving(true);
    try {
      await eliminarEmpresa(db, id);
      if (editId === id) reset();
      await onRecargar();
      setMsg({ tipo: "ok", text: "Empresa eliminada." });
    } catch (err) {
      console.error(err);
      setMsg({ tipo: "err", text: "No se pudo eliminar." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {msg && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            msg.tipo === "ok"
              ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-100"
              : "border-red-500/40 bg-red-500/10 text-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="glass rounded-3xl border border-white/[0.08] shadow-glass p-6 sm:p-8 space-y-4"
      >
        <h3 className="text-lg font-heading font-bold text-white">
          {editId ? "Editar empresa" : "Registrar empresa"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre comercial</label>
            <input className="input-field" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
          </div>
          <div>
            <label className="label">Código empresa (AAA000)</label>
            <input
              className="input-field font-mono uppercase"
              value={form.codigoEmpresa}
              onChange={(e) => set("codigoEmpresa", e.target.value.toUpperCase())}
              placeholder="ABC001"
              required
              maxLength={6}
            />
          </div>
          <div className="md:col-span-2">
            <label className="label">Dirección</label>
            <input className="input-field" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} required />
          </div>
          <div>
            <label className="label">Nombre contacto</label>
            <input className="input-field" value={form.nombreContacto} onChange={(e) => set("nombreContacto", e.target.value)} required />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input-field" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} required />
          </div>
          <div>
            <label className="label">Correo</label>
            <input type="email" className="input-field" value={form.correo} onChange={(e) => set("correo", e.target.value)} required />
          </div>
          <div>
            <label className="label">Rubro</label>
            <select
              className="input-field"
              value={form.rubro}
              onChange={(e) => set("rubro", e.target.value)}
              required
            >
              <option value="">— Elegir —</option>
              {rubrosActivos.map((r) => (
                <option key={r.id} value={r.nombre}>
                  {r.nombre}
                </option>
              ))}
            </select>
            {rubrosActivos.length === 0 && (
              <p className="text-xs text-amber-200/80 mt-1">Crea rubros en la pestaña Rubros primero.</p>
            )}
          </div>
          <div>
            <label className="label">% comisión (0–100)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              className="input-field"
              value={form.porcentajeComision}
              onChange={(e) => set("porcentajeComision", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Guardando…" : editId ? "Guardar cambios" : "Crear empresa"}
          </button>
          {editId && (
            <button type="button" className="btn-ghost" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase">Código</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase hidden md:table-cell">Rubro</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase">Comisión</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase w-56">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] cursor-pointer"
                  onClick={() => onVerDetalle(row)}
                >
                  <td className="px-4 py-3 font-medium text-white">{row.nombre || row.nombreComercial || row.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-200/90">{row.codigoEmpresa || "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-white/70">{row.rubro || "—"}</td>
                  <td className="px-4 py-3 text-white/80">{row.porcentajeComision != null ? `${row.porcentajeComision}%` : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/6"
                        onClick={(e) => iniciarEdicion(e, row)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="text-xs px-3 py-1.5 rounded-lg border border-brand-purple/30 text-cyan-200/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVistaOperativa(row);
                        }}
                      >
                        Vista operativa
                      </button>
                      <button
                        type="button"
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200"
                        onClick={(e) => borrar(e, row.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {empresas.length === 0 && (
          <p className="text-sm text-[var(--muted)] px-4 py-8 text-center">No hay empresas. Usa el formulario superior.</p>
        )}
      </div>
    </div>
  );
}
