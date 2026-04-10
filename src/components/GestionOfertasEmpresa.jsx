import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-[#1a241b] border border-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#668A4C]";

function toTimestamp(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  return Timestamp.fromDate(d);
}

function fromTimestamp(ts) {
  if (!ts?.toDate) return "";
  const d = ts.toDate();
  return d.toISOString().slice(0, 10);
}

const emptyForm = {
  titulo: "",
  descripcion: "",
  precioRegular: "",
  precioOferta: "",
  rubro: "",
  fechaInicio: "",
  fechaFin: "",
  fechaLimiteCupon: "",
  cantidadLimite: "",
};

export default function GestionOfertasEmpresa() {
  const { profile } = useAuth();
  const empresaId = profile?.empresaId;
  const nombreEmpresa = profile?.nombreEmpresa || "";

  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const cargar = async () => {
    if (!empresaId && !nombreEmpresa) {
      setOfertas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let snap;
      if (empresaId) {
        const q = query(
          collection(db, "ofertas"),
          where("empresaId", "==", empresaId)
        );
        snap = await getDocs(q);
      } else {
        const q = query(
          collection(db, "ofertas"),
          where("nombreEmpresa", "==", nombreEmpresa)
        );
        snap = await getDocs(q);
      }
      setOfertas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      setMensaje({ tipo: "error", text: "Error al cargar ofertas." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [empresaId, nombreEmpresa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreEmpresa && !empresaId) {
      setMensaje({
        tipo: "error",
        text: "Tu perfil debe incluir empresaId y/o nombreEmpresa en Firestore (perfiles).",
      });
      return;
    }

    setSaving(true);
    setMensaje(null);
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        precioRegular: Number(form.precioRegular),
        precioOferta: Number(form.precioOferta),
        rubro: form.rubro.trim(),
        nombreEmpresa: nombreEmpresa || form.titulo,
        empresaId: empresaId || null,
        fechaInicio: toTimestamp(form.fechaInicio),
        fechaFin: toTimestamp(form.fechaFin),
        fechaLimiteCupon: toTimestamp(form.fechaLimiteCupon),
        cantidadLimite:
          form.cantidadLimite === "" ? null : Number(form.cantidadLimite),
        cuponesVendidos: editId
          ? undefined
          : 0,
        estado: editId ? undefined : "pendiente",
      };

      if (editId) {
        const ref = doc(db, "ofertas", editId);
        const clean = Object.fromEntries(
          Object.entries(payload).filter(([, v]) => v !== undefined)
        );
        await updateDoc(ref, clean);
        setMensaje({ tipo: "ok", text: "Oferta actualizada." });
      } else {
        await addDoc(collection(db, "ofertas"), {
          ...payload,
          cuponesVendidos: 0,
          estado: "pendiente",
        });
        setMensaje({
          tipo: "ok",
          text: "Oferta creada. Queda pendiente de aprobación del administrador.",
        });
      }

      setForm(emptyForm);
      setEditId(null);
      await cargar();
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: "error", text: "No se pudo guardar la oferta." });
    } finally {
      setSaving(false);
    }
  };

  const iniciarEdicion = (o) => {
    setEditId(o.id);
    setForm({
      titulo: o.titulo || "",
      descripcion: o.descripcion || "",
      precioRegular: String(o.precioRegular ?? ""),
      precioOferta: String(o.precioOferta ?? ""),
      rubro: o.rubro || "",
      fechaInicio: fromTimestamp(o.fechaInicio),
      fechaFin: fromTimestamp(o.fechaFin),
      fechaLimiteCupon: fromTimestamp(o.fechaLimiteCupon),
      cantidadLimite:
        o.cantidadLimite != null ? String(o.cantidadLimite) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta oferta?")) return;
    try {
      await deleteDoc(doc(db, "ofertas", id));
      setMensaje({ tipo: "ok", text: "Oferta eliminada." });
      if (editId === id) {
        setEditId(null);
        setForm(emptyForm);
      }
      await cargar();
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: "error", text: "No se pudo eliminar." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#ACCC7B]">
        Cargando ofertas…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1a13] py-10 px-4 sm:px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2">Gestión de ofertas</h1>
        <p className="text-gray-400 mb-8">
          Administra las ofertas de tu empresa. Las nuevas quedan en estado{" "}
          <strong className="text-[#ACCC7B]">pendiente</strong> hasta que el
          administrador las apruebe.
        </p>

        {mensaje && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm ${
              mensaje.tipo === "ok"
                ? "bg-green-900/40 border border-green-700 text-green-200"
                : "bg-red-900/40 border border-red-700 text-red-200"
            }`}
          >
            {mensaje.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-12 p-6 rounded-2xl border border-gray-600 bg-[#1a241b]"
        >
          <h2 className="text-lg font-bold">
            {editId ? "Editar oferta" : "Nueva oferta"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Título</label>
              <input
                className={inputClass}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Descripción
              </label>
              <textarea
                className={`${inputClass} min-h-[88px]`}
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rubro</label>
              <input
                className={inputClass}
                value={form.rubro}
                onChange={(e) => setForm({ ...form, rubro: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Límite de cupones (opcional)
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={form.cantidadLimite}
                onChange={(e) =>
                  setForm({ ...form, cantidadLimite: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Precio regular
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                className={inputClass}
                value={form.precioRegular}
                onChange={(e) =>
                  setForm({ ...form, precioRegular: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Precio oferta
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                className={inputClass}
                value={form.precioOferta}
                onChange={(e) =>
                  setForm({ ...form, precioOferta: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Vigencia desde
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.fechaInicio}
                onChange={(e) =>
                  setForm({ ...form, fechaInicio: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Vigencia hasta
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.fechaFin}
                onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Canjear cupón antes de
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.fechaLimiteCupon}
                onChange={(e) =>
                  setForm({ ...form, fechaLimiteCupon: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#668A4C] hover:bg-[#557240] disabled:opacity-50 px-6 py-2.5 rounded-lg font-bold text-sm"
            >
              {saving ? "Guardando…" : editId ? "Actualizar" : "Crear oferta"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                }}
                className="border border-gray-500 px-6 py-2.5 rounded-lg font-semibold text-sm text-gray-300 hover:bg-white/5"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <h2 className="text-xl font-bold mb-4">Tus ofertas</h2>
        {ofertas.length === 0 ? (
          <p className="text-gray-500">
            Aún no hay ofertas asociadas a tu empresa en Firestore.
          </p>
        ) : (
          <ul className="space-y-3">
            {ofertas.map((o) => (
              <li
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-600 bg-[#1a241b]"
              >
                <div>
                  <p className="font-bold text-white">{o.titulo}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Estado:{" "}
                    <span className="text-[#ACCC7B] font-semibold">
                      {o.estado || "—"}
                    </span>
                    {" · "}
                    Vendidos: {o.cuponesVendidos ?? 0}
                    {o.cantidadLimite != null
                      ? ` / ${o.cantidadLimite}`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(o)}
                    className="text-sm px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(o.id)}
                    className="text-sm px-3 py-2 rounded-lg bg-red-900/50 hover:bg-red-800/60 text-red-200 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
