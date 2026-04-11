import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const CODIGO_EMPRESA = /^[A-Za-z]{3}\d{3}$/;

export function validarCodigoEmpresa(codigo) {
  const c = (codigo || "").trim().toUpperCase();
  if (!CODIGO_EMPRESA.test(c)) return { ok: false, error: "Código: 3 letras + 3 dígitos (ej. ABC001)." };
  return { ok: true, value: c };
}

export function normalizarDui(dui) {
  const d = (dui || "").replace(/\D/g, "");
  if (d.length <= 8) return d;
  return `${d.slice(0, 8)}-${d.slice(8, 9)}`;
}

export function duiCoincide(duiA, duiB) {
  return normalizarDui(duiA).replace(/\D/g, "") === normalizarDui(duiB).replace(/\D/g, "");
}

export async function crearEmpresa(db, payload) {
  const v = validarCodigoEmpresa(payload.codigoEmpresa);
  if (!v.ok) throw new Error(v.error);
  const pct = Number(payload.porcentajeComision);
  if (Number.isNaN(pct) || pct < 0 || pct > 100) throw new Error("Comisión debe ser 0–100.");
  const ref = await addDoc(collection(db, "empresas"), {
    nombre: (payload.nombre || "").trim(),
    codigoEmpresa: v.value,
    direccion: (payload.direccion || "").trim(),
    nombreContacto: (payload.nombreContacto || "").trim(),
    telefono: (payload.telefono || "").trim(),
    correo: (payload.correo || "").trim(),
    rubro: (payload.rubro || "").trim(),
    porcentajeComision: pct,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function actualizarEmpresa(db, empresaId, payload) {
  const patch = { ...payload, updatedAt: serverTimestamp() };
  if (payload.codigoEmpresa != null) {
    const v = validarCodigoEmpresa(payload.codigoEmpresa);
    if (!v.ok) throw new Error(v.error);
    patch.codigoEmpresa = v.value;
  }
  if (payload.porcentajeComision != null) {
    const pct = Number(payload.porcentajeComision);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) throw new Error("Comisión debe ser 0–100.");
    patch.porcentajeComision = pct;
  }
  await updateDoc(doc(db, "empresas", empresaId), patch);
}

export async function eliminarEmpresa(db, empresaId) {
  await deleteDoc(doc(db, "empresas", empresaId));
}

/**
 * Resuelve el código AAA000 de la empresa asociada a una oferta (catálogo / compra).
 */
export async function obtenerCodigoEmpresaParaOferta(db, oferta) {
  if (oferta?.codigoEmpresa) {
    const v = validarCodigoEmpresa(oferta.codigoEmpresa);
    if (v.ok) return v.value;
  }
  if (oferta?.empresaId) {
    const snap = await getDoc(doc(db, "empresas", oferta.empresaId));
    if (snap.exists()) {
      const v = validarCodigoEmpresa(snap.data()?.codigoEmpresa);
      if (v.ok) return v.value;
    }
  }
  const nombre = (oferta?.nombreEmpresa || "").trim();
  if (nombre) {
    const q = query(collection(db, "empresas"), where("nombre", "==", nombre), limit(1));
    const qs = await getDocs(q);
    if (!qs.empty) {
      const v = validarCodigoEmpresa(qs.docs[0].data()?.codigoEmpresa);
      if (v.ok) return v.value;
    }
  }
  return null;
}
