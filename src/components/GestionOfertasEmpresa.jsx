import { useCallback, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { fetchRubrosActivos } from "../services/rubrosService";
import {
  listarEmpleadosEmpresa,
  upsertEmpleadoPerfil,
  quitarEmpleadoPerfil,
} from "../services/empleadoEmpresaService";
import {
  buscarEmpresaIdPorNombre,
  empresaIdAString,
  leerCodigoEmpresaDeData,
} from "../services/empresaService";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

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
  imagenUrl: "",
};

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

const IcImage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);
const IcTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" />
  </svg>
);

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
  const [imagenUploading, setImagenUploading] = useState(false);
  const [ofertaAccionId, setOfertaAccionId] = useState(null);
  const fileInputRef = useRef(null);
  const [rubrosLista, setRubrosLista] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [empleadosLoading, setEmpleadosLoading] = useState(false);
  const [empleadoForm, setEmpleadoForm] = useState({
    uid: "",
    nombres: "",
    apellidos: "",
    correo: "",
  });
  const [empleadoGuardando, setEmpleadoGuardando] = useState(false);

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
        const q = query(collection(db, "ofertas"), where("empresaId", "==", empresaId));
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

  useEffect(() => {
    let cancel = false;
    fetchRubrosActivos(db)
      .then((rows) => {
        if (!cancel) setRubrosLista(rows);
      })
      .catch(() => {
        if (!cancel) setRubrosLista([]);
      });
    return () => {
      cancel = true;
    };
  }, []);

  const cargarEmpleados = useCallback(async () => {
    if (!empresaId && !nombreEmpresa) {
      setEmpleados([]);
      return;
    }
    setEmpleadosLoading(true);
    try {
      const rows = await listarEmpleadosEmpresa(db, { empresaId, nombreEmpresa });
      setEmpleados(rows);
    } catch (e) {
      console.error(e);
      setMensaje({ tipo: "error", text: "No se pudo cargar la lista de empleados." });
    } finally {
      setEmpleadosLoading(false);
    }
  }, [empresaId, nombreEmpresa]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const resolverEmpresaIdParaEmpleado = async () => {
    const fromPerfil = empresaIdAString(profile?.empresaId);
    if (fromPerfil) return fromPerfil;
    const nom = (nombreEmpresa || "").trim();
    if (nom) {
      const byName = await buscarEmpresaIdPorNombre(db, nom);
      if (byName) return byName;
    }
    for (const o of ofertas) {
      const oid = empresaIdAString(o.empresaId);
      if (oid) return oid;
    }
    return null;
  };

  const guardarEmpleado = async (e) => {
    e.preventDefault();
    if (!empresaId && !nombreEmpresa) return;
    setEmpleadoGuardando(true);
    setMensaje(null);
    try {
      const empresaIdVinculo = await resolverEmpresaIdParaEmpleado();
      await upsertEmpleadoPerfil(db, empleadoForm.uid, {
        nombres: empleadoForm.nombres,
        apellidos: empleadoForm.apellidos,
        correo: empleadoForm.correo,
        empresaId: empresaIdVinculo,
        nombreEmpresa: (nombreEmpresa || "").trim() || null,
      });
      setEmpleadoForm({ uid: "", nombres: "", apellidos: "", correo: "" });
      setMensaje({
        tipo: "ok",
        text: empresaIdVinculo
          ? `Empleado registrado con empresaId «${empresaIdVinculo}» (necesario para canjear). El UID debe coincidir con Firebase Authentication.`
          : "Empleado registrado solo con nombre de empresa (sin empresaId en Firestore). Si el canje falla, asigná empresaId al admin de empresa o vinculá una oferta con empresaId.",
      });
      await cargarEmpleados();
    } catch (err) {
      console.error(err);
      setMensaje({
        tipo: "error",
        text: err.message || "No se pudo guardar el empleado. Revisa UID y permisos.",
      });
    } finally {
      setEmpleadoGuardando(false);
    }
  };

  const eliminarEmpleado = async (uid) => {
    if (!confirm("¿Quitar acceso de canje a este empleado?")) return;
    try {
      await quitarEmpleadoPerfil(db, uid);
      setMensaje({ tipo: "ok", text: "Empleado eliminado del panel de canje." });
      await cargarEmpleados();
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: "error", text: "No se pudo eliminar el empleado." });
    }
  };

  const handleImagenFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMensaje({ tipo: "error", text: "El archivo debe ser una imagen (JPG, PNG, WebP…)." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setMensaje({ tipo: "error", text: "La imagen no puede superar 4 MB." });
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setMensaje({ tipo: "error", text: "Debes iniciar sesión para subir imágenes." });
      return;
    }
    setImagenUploading(true);
    setMensaje(null);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const pathRef = ref(storage, `ofertas/${uid}/${safe}`);
      await uploadBytes(pathRef, file, { contentType: file.type || "image/jpeg" });
      const url = await getDownloadURL(pathRef);
      setForm((f) => ({ ...f, imagenUrl: url }));
    } catch (err) {
      console.error(err);
      setMensaje({
        tipo: "error",
        text:
          "No se pudo subir la imagen. Verifica reglas de Storage en Firebase o usa la URL manual abajo.",
      });
    } finally {
      setImagenUploading(false);
    }
  };

  const quitarImagen = () => {
    setForm((f) => ({ ...f, imagenUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      let nombreEmpresaFinal = (nombreEmpresa || "").trim();
      let codigoEmpresaOferta;
      let correoEmpresaOferta;
      if (empresaId) {
        const empresaSnap = await getDoc(doc(db, "empresas", empresaId));
        if (empresaSnap.exists()) {
          const d = empresaSnap.data();
          const n = (d.nombre || "").trim();
          if (n) nombreEmpresaFinal = n;
          const c = leerCodigoEmpresaDeData(d);
          if (c) codigoEmpresaOferta = c;
          const em = (d.correo || "").trim();
          if (em) correoEmpresaOferta = em;
        }
      }
      if (!nombreEmpresaFinal) nombreEmpresaFinal = form.titulo.trim();

      const imagenUrl = form.imagenUrl.trim() || null;
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        precioRegular: Number(form.precioRegular),
        precioOferta: Number(form.precioOferta),
        rubro: form.rubro.trim(),
        nombreEmpresa: nombreEmpresaFinal,
        empresaId: empresaId || null,
        fechaInicio: toTimestamp(form.fechaInicio),
        fechaFin: toTimestamp(form.fechaFin),
        fechaLimiteCupon: toTimestamp(form.fechaLimiteCupon),
        cantidadLimite: form.cantidadLimite === "" ? null : Number(form.cantidadLimite),
        imagenUrl,
        cuponesVendidos: editId ? undefined : 0,
        estado: editId ? undefined : "pendiente",
      };
      if (codigoEmpresaOferta) payload.codigoEmpresa = codigoEmpresaOferta;
      if (correoEmpresaOferta) payload.correoEmpresa = correoEmpresaOferta;

      if (editId) {
        const refDoc = doc(db, "ofertas", editId);
        const clean = Object.fromEntries(
          Object.entries(payload).filter(([, v]) => v !== undefined)
        );
        await updateDoc(refDoc, clean);
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
      if (fileInputRef.current) fileInputRef.current.value = "";
      await cargar();
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: "error", text: "No se pudo guardar la oferta." });
    } finally {
      setSaving(false);
    }
  };

  const reenviarRevision = async (id) => {
    if (
      !confirm(
        "¿Enviar de nuevo esta oferta al administrador? Pasará a estado «pendiente» y se limpiará el motivo de rechazo anterior."
      )
    )
      return;
    setOfertaAccionId(id);
    setMensaje(null);
    try {
      await updateDoc(doc(db, "ofertas", id), {
        estado: "pendiente",
        justificacionRechazo: deleteField(),
      });
      setMensaje({ tipo: "ok", text: "Oferta enviada de nuevo a revisión." });
      if (editId === id) {
        setEditId(null);
        setForm(emptyForm);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      await cargar();
    } catch (e) {
      console.error(e);
      setMensaje({ tipo: "error", text: "No se pudo reenviar la oferta. Revisa permisos o conexión." });
    } finally {
      setOfertaAccionId(null);
    }
  };

  const marcarDescartada = async (id) => {
    if (
      !confirm(
        "¿Marcar esta oferta como descartada? No se publicará en la tienda y quedará archivada para tu empresa."
      )
    )
      return;
    setOfertaAccionId(id);
    setMensaje(null);
    try {
      await updateDoc(doc(db, "ofertas", id), { estado: "descartada" });
      setMensaje({ tipo: "ok", text: "Oferta marcada como descartada." });
      if (editId === id) {
        setEditId(null);
        setForm(emptyForm);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      await cargar();
    } catch (e) {
      console.error(e);
      setMensaje({ tipo: "error", text: "No se pudo actualizar el estado." });
    } finally {
      setOfertaAccionId(null);
    }
  };

  const iniciarEdicion = (o) => {
    if (o.estado === "descartada") {
      setMensaje({
        tipo: "error",
        text: "Las ofertas descartadas no se pueden editar. Puedes eliminarlas si ya no las necesitas.",
      });
      return;
    }
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
      cantidadLimite: o.cantidadLimite != null ? String(o.cantidadLimite) : "",
      imagenUrl: o.imagenUrl || "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      await cargar();
    } catch (err) {
      console.error(err);
      setMensaje({ tipo: "error", text: "No se pudo eliminar." });
    }
  };

  if (loading) {
    return (
      <div className="page-bg min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4">
        <div className="h-9 w-9 rounded-full border-2 border-brand-purple/30 border-t-brand-cyan animate-spin" aria-hidden />
        <p className="text-sm font-medium text-[var(--muted)]">Cargando ofertas…</p>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-tight mb-3">
            Gestión de <span className="text-grad">ofertas</span>
          </h1>
          <p className="text-[var(--muted)] text-sm sm:text-base leading-relaxed max-w-2xl">
            Administra las ofertas de tu empresa. Las nuevas quedan en estado{" "}
            <span className="badge badge-amber font-semibold">pendiente</span> hasta que el
            administrador las apruebe.
          </p>
        </header>

        {mensaje && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              mensaje.tipo === "ok"
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-100"
                : "border-red-500/40 bg-red-500/10 text-red-200"
            }`}
            role="status"
          >
            {mensaje.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden mb-12 animate-fade-in-up"
        >
          <div className="h-1 w-full bg-gradient-brand" aria-hidden />
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
              {editId ? "Editar oferta" : "Nueva oferta"}
            </h2>

            {/* Imagen */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <span className="text-brand-cyan">
                  <IcImage />
                </span>
                Foto de la oferta
              </div>
              <p className="text-xs text-[var(--faint)] leading-relaxed">
                Se mostrará en el catálogo público. Formatos de imagen; máximo 4 MB. Si no subes
                archivo, puedes pegar una URL pública.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                <div className="flex-1 min-w-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    id="oferta-imagen-file"
                    onChange={handleImagenFile}
                  />
                  <label
                    htmlFor="oferta-imagen-file"
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-8 text-center cursor-pointer transition-colors hover:border-brand-purple/40 hover:bg-brand-purple/[0.06] ${imagenUploading ? "opacity-60 pointer-events-none" : ""}`}
                  >
                    <span className="text-[var(--muted)] text-sm">
                      {imagenUploading ? "Subiendo imagen…" : "Clic para elegir una imagen desde tu dispositivo"}
                    </span>
                    <span className="btn-ghost text-xs py-2 px-4 pointer-events-none">Seleccionar imagen</span>
                  </label>
                </div>
                {form.imagenUrl ? (
                  <div className="relative w-full sm:w-44 shrink-0 rounded-2xl border border-white/[0.1] overflow-hidden bg-black/30 aspect-video sm:aspect-square sm:h-36">
                    <img
                      src={form.imagenUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={quitarImagen}
                      className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-red-200 hover:bg-red-900/50 transition-colors"
                      aria-label="Quitar imagen"
                    >
                      <IcTrash />
                    </button>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="label" htmlFor="oferta-imagen-url">
                  URL de imagen (opcional)
                </label>
                <input
                  id="oferta-imagen-url"
                  type="url"
                  className="input-field text-sm"
                  placeholder="https://ejemplo.com/mi-banner.jpg"
                  value={form.imagenUrl}
                  onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="oferta-titulo">
                  Título
                </label>
                <input
                  id="oferta-titulo"
                  className="input-field"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="oferta-desc">
                  Descripción
                </label>
                <textarea
                  id="oferta-desc"
                  className="input-field min-h-[100px] resize-y"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="oferta-rubro">
                  Rubro
                </label>
                {rubrosLista.length > 0 ? (
                  <select
                    id="oferta-rubro"
                    className="input-field"
                    value={form.rubro}
                    onChange={(e) => setForm({ ...form, rubro: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Seleccioná un rubro
                    </option>
                    {rubrosLista.map((r) => (
                      <option key={r.id} value={r.nombre || r.id}>
                        {r.nombre || r.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="oferta-rubro"
                    className="input-field"
                    value={form.rubro}
                    onChange={(e) => setForm({ ...form, rubro: e.target.value })}
                    placeholder="Pedí al admin que cargue rubros, o escribí uno"
                    required
                  />
                )}
                {rubrosLista.length === 0 ? (
                  <p className="mt-1.5 text-xs text-[var(--faint)]">
                    Si el catálogo está vacío, el administrador puede crear rubros en el panel admin.
                  </p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="oferta-limite">
                  Límite de cupones (opcional)
                </label>
                <input
                  id="oferta-limite"
                  type="number"
                  min={1}
                  className="input-field"
                  value={form.cantidadLimite}
                  onChange={(e) => setForm({ ...form, cantidadLimite: e.target.value })}
                />
              </div>
              <div>
                <label className="label" htmlFor="oferta-precio-reg">
                  Precio regular
                </label>
                <input
                  id="oferta-precio-reg"
                  type="number"
                  step="0.01"
                  min={0}
                  className="input-field"
                  value={form.precioRegular}
                  onChange={(e) => setForm({ ...form, precioRegular: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="oferta-precio-of">
                  Precio oferta
                </label>
                <input
                  id="oferta-precio-of"
                  type="number"
                  step="0.01"
                  min={0}
                  className="input-field"
                  value={form.precioOferta}
                  onChange={(e) => setForm({ ...form, precioOferta: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="oferta-ini">
                  Vigencia desde
                </label>
                <input
                  id="oferta-ini"
                  type="date"
                  className="input-field"
                  value={form.fechaInicio}
                  onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="oferta-fin">
                  Vigencia hasta
                </label>
                <input
                  id="oferta-fin"
                  type="date"
                  className="input-field"
                  value={form.fechaFin}
                  onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="oferta-limite-cupon">
                  Canjear cupón antes de
                </label>
                <input
                  id="oferta-limite-cupon"
                  type="date"
                  className="input-field max-w-xs"
                  value={form.fechaLimiteCupon}
                  onChange={(e) => setForm({ ...form, fechaLimiteCupon: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={saving || imagenUploading} className="btn-primary">
                {saving ? "Guardando…" : editId ? "Actualizar oferta" : "Crear oferta"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm(emptyForm);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="btn-ghost"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </div>
        </form>

        <section className="relative glass rounded-3xl border border-white/[0.08] shadow-glass overflow-hidden mb-12 p-6 sm:p-8">
          <div className="h-1 w-full bg-gradient-brand rounded-full mb-6" aria-hidden />
          <h2 className="text-lg sm:text-xl font-heading font-bold text-white mb-2">
            Empleados de canje
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] mb-6 leading-relaxed">
            Registrá el <strong className="text-white/90">UID</strong> de Firebase Authentication del
            colaborador (debe existir la cuenta). Recibirá rol <code className="text-cyan-300/90">empleado</code>{" "}
            y podrá canjear cupones en la ruta Canjear. Se intenta guardar siempre un{" "}
            <strong className="text-white/90">empresaId</strong> (documento en <code className="text-cyan-300/90">empresas</code>
            ) buscándolo en tu perfil, por nombre de empresa o en tus ofertas; sin eso el canje suele fallar por reglas de
            seguridad.
          </p>
          <form onSubmit={guardarEmpleado} className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="emp-uid">
                UID (Firebase Auth)
              </label>
              <input
                id="emp-uid"
                className="input-field font-mono text-sm"
                value={empleadoForm.uid}
                onChange={(e) => setEmpleadoForm((f) => ({ ...f, uid: e.target.value.trim() }))}
                placeholder="Ej. AbCdEf1234567890..."
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="emp-nom">
                Nombres
              </label>
              <input
                id="emp-nom"
                className="input-field"
                value={empleadoForm.nombres}
                onChange={(e) => setEmpleadoForm((f) => ({ ...f, nombres: e.target.value }))}
              />
            </div>
            <div>
              <label className="label" htmlFor="emp-ape">
                Apellidos
              </label>
              <input
                id="emp-ape"
                className="input-field"
                value={empleadoForm.apellidos}
                onChange={(e) => setEmpleadoForm((f) => ({ ...f, apellidos: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="emp-mail">
                Correo (referencia)
              </label>
              <input
                id="emp-mail"
                type="email"
                className="input-field"
                value={empleadoForm.correo}
                onChange={(e) => setEmpleadoForm((f) => ({ ...f, correo: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={empleadoGuardando} className="btn-primary">
                {empleadoGuardando ? "Guardando…" : "Guardar empleado"}
              </button>
            </div>
          </form>
          <h3 className="text-sm font-semibold text-white/90 mb-3">Listado</h3>
          {empleadosLoading ? (
            <p className="text-sm text-[var(--muted)]">Cargando empleados…</p>
          ) : empleados.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay empleados registrados para tu empresa.</p>
          ) : (
            <ul className="space-y-2">
              {empleados.map((emp) => (
                <li
                  key={emp.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {(emp.nombres || "") + " " + (emp.apellidos || "")}
                    </p>
                    <p className="text-xs font-mono text-cyan-200/80 truncate">{emp.id}</p>
                    {emp.correo ? (
                      <p className="text-xs text-[var(--faint)] truncate">{emp.correo}</p>
                    ) : null}
                    {emp.empresaId ? (
                      <p className="text-xs font-mono text-emerald-200/80 truncate" title="empresaId en Firestore">
                        empresaId: {emp.empresaId}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-200/80">Sin empresaId — el canje puede fallar</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarEmpleado(emp.id)}
                    className="text-xs px-3 py-2 rounded-lg border border-red-500/35 text-red-200 hover:bg-red-500/10 shrink-0"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <h2 className="text-xl font-heading font-bold text-white mb-4">Tus ofertas</h2>
        {ofertas.length === 0 ? (
          <p className="text-sm text-[var(--muted)] rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-8 text-center">
            Aún no hay ofertas asociadas a tu empresa en Firestore.
          </p>
        ) : (
          <ul className="space-y-3">
            {ofertas.map((o) => (
              <li
                key={o.id}
                className="glass rounded-2xl border border-white/[0.08] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
              >
                <div className="flex gap-4 min-w-0">
                  {o.imagenUrl ? (
                    <img
                      src={o.imagenUrl}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl border border-dashed border-white/15 bg-white/[0.04] flex items-center justify-center text-[var(--faint)] shrink-0">
                      <IcImage />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-white truncate">{o.titulo}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      Estado:{" "}
                      <span className="text-cyan-300/90 font-semibold">{o.estado || "—"}</span>
                      {" · "}
                      Vendidos: {o.cuponesVendidos ?? 0}
                      {o.cantidadLimite != null ? ` / ${o.cantidadLimite}` : ""}
                    </p>
                    {o.estado === "rechazada" && o.justificacionRechazo && (
                      <div className="mt-3 rounded-xl border border-red-500/25 bg-red-950/25 px-3 py-2.5 text-xs text-red-100/95 leading-relaxed">
                        <span className="font-semibold text-red-200/90">Motivo del rechazo: </span>
                        {o.justificacionRechazo}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 shrink-0 items-stretch sm:items-center">
                  {o.estado === "rechazada" && (
                    <>
                      <button
                        type="button"
                        disabled={ofertaAccionId === o.id}
                        onClick={() => reenviarRevision(o.id)}
                        className="text-sm px-4 py-2 rounded-xl border border-emerald-500/35 bg-emerald-500/12 text-emerald-100 font-semibold hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
                      >
                        {ofertaAccionId === o.id ? "…" : "Reenviar a revisión"}
                      </button>
                      <button
                        type="button"
                        disabled={ofertaAccionId === o.id}
                        onClick={() => marcarDescartada(o.id)}
                        className="text-sm px-4 py-2 rounded-xl border border-white/[0.12] bg-white/[0.06] text-white/80 font-semibold hover:bg-white/10 transition-colors disabled:opacity-40"
                      >
                        Descartar
                      </button>
                    </>
                  )}
                  {o.estado === "pendiente" && (
                    <button
                      type="button"
                      disabled={ofertaAccionId === o.id}
                      onClick={() => marcarDescartada(o.id)}
                      className="text-sm px-4 py-2 rounded-xl border border-white/[0.12] bg-white/[0.06] text-white/80 font-semibold hover:bg-white/10 transition-colors disabled:opacity-40"
                    >
                      Descartar solicitud
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={o.estado === "descartada"}
                    onClick={() => iniciarEdicion(o)}
                    className="text-sm px-4 py-2 rounded-xl border border-white/[0.12] bg-white/[0.06] text-white font-semibold hover:bg-white/10 transition-colors disabled:opacity-35 disabled:pointer-events-none"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(o.id)}
                    className="text-sm px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 font-semibold hover:bg-red-500/20 transition-colors"
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
