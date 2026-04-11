import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  actualizarRubro,
  crearRubro,
  eliminarRubroDoc,
  fetchRubrosTodos,
} from "../../services/rubrosService";

export default function AdminRubrosTab({ onRubrosChanged }) {
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [nombre, setNombre] = useState("");
  const [orden, setOrden] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  const cargar = async () => {
    setLoading(true);
    setErr("");
    try {
      const rows = await fetchRubrosTodos(db);
      setRubros(rows);
      onRubrosChanged?.();
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar los rubros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    setErr("");
    try {
      if (editId) {
        await actualizarRubro(db, editId, {
          nombre: nombre.trim(),
          orden: Number(orden) || 0,
        });
      } else {
        await crearRubro(db, { nombre: nombre.trim(), orden: Number(orden) || 0, activo: true });
      }
      setNombre("");
      setOrden(0);
      setEditId(null);
      await cargar();
    } catch (e) {
      console.error(e);
      setErr(e.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActivo = async (r) => {
    setSaving(true);
    try {
      await actualizarRubro(db, r.id, { activo: r.activo === false ? true : false });
      await cargar();
    } catch (e) {
      console.error(e);
      setErr("No se pudo actualizar.");
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar este rubro de Firestore? Las ofertas que lo usen seguirán con el texto guardado.")) return;
    setSaving(true);
    try {
      await eliminarRubroDoc(db, id);
      if (editId === id) {
        setEditId(null);
        setNombre("");
        setOrden(0);
      }
      await cargar();
    } catch (e) {
      console.error(e);
      setErr("No se pudo eliminar.");
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicion = (r) => {
    setEditId(r.id);
    setNombre(r.nombre || "");
    setOrden(r.orden ?? 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-[var(--muted)] py-10">
        <div className="h-5 w-5 rounded-full border-2 border-brand-purple/30 border-t-brand-cyan animate-spin shrink-0" />
        Cargando rubros…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {err && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          {err}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="glass rounded-3xl border border-white/[0.08] shadow-glass p-6 sm:p-8 space-y-4"
      >
        <h3 className="text-lg font-heading font-bold text-white">
          {editId ? "Editar rubro" : "Nuevo rubro"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="rubro-nombre">
              Nombre
            </label>
            <input
              id="rubro-nombre"
              className="input-field"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Gastronomía"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="rubro-orden">
              Orden (menor = primero)
            </label>
            <input
              id="rubro-orden"
              type="number"
              className="input-field"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Guardando…" : editId ? "Actualizar" : "Crear rubro"}
          </button>
          {editId && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setEditId(null);
                setNombre("");
                setOrden(0);
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase">Orden</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase">Activo</th>
                <th className="px-4 py-3 text-xs font-semibold text-[var(--faint)] uppercase w-48">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rubros.map((r) => (
                <tr key={r.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="px-4 py-3 font-medium text-white">{r.nombre}</td>
                  <td className="px-4 py-3 text-white/70">{r.orden ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={r.activo === false ? "text-amber-300/90 text-xs" : "text-emerald-300/90 text-xs"}>
                      {r.activo === false ? "No" : "Sí"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => iniciarEdicion(r)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/6 hover:bg-white/10"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => toggleActivo(r)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/15 bg-white/6 hover:bg-white/10"
                    >
                      {r.activo === false ? "Activar" : "Desactivar"}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => borrar(r.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rubros.length === 0 && (
          <p className="text-sm text-[var(--muted)] px-4 py-8 text-center">Aún no hay rubros. Crea el primero arriba.</p>
        )}
      </div>
    </div>
  );
}
