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
const ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;

/** Alinea textos para comparar nombres (espacios raros, mayúsculas). */
export function normalizarNombreEmpresaBusqueda(s) {
  return String(s ?? "")
    .replace(ZERO_WIDTH, "")
    .replace(/\u00A0/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Nombre comercial en la oferta (Firestore a veces usa distintas claves). */
export function nombreEmpresaEnOferta(oferta) {
  if (!oferta || typeof oferta !== "object") return "";
  const n = oferta.nombreEmpresa ?? oferta.NombreEmpresa ?? oferta.nombre ?? "";
  return String(n).replace(ZERO_WIDTH, "").trim();
}

export function validarCodigoEmpresa(codigo) {
  let c = String(codigo ?? "")
    .replace(ZERO_WIDTH, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!CODIGO_EMPRESA.test(c)) return { ok: false, error: "Código: 3 letras + 3 dígitos (ej. ABC001)." };
  return { ok: true, value: c };
}

/** Lee el código desde el documento aunque el campo venga con otro nombre o tipo. */
export function leerCodigoEmpresaDeData(data) {
  if (!data || typeof data !== "object") return null;
  const raw = data.codigoEmpresa ?? data.CodigoEmpresa ?? data.codigo_empresa;
  if (raw == null || raw === "") return null;
  const v = validarCodigoEmpresa(raw);
  return v.ok ? v.value : null;
}

/** Firestore a veces guarda empresaId como string o como referencia. */
function empresaIdAString(empresaId) {
  if (empresaId == null || empresaId === "") return null;
  if (typeof empresaId === "string") return empresaId;
  if (typeof empresaId === "object" && typeof empresaId.id === "string") return empresaId.id;
  return null;
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
 * Busca codigoEmpresa en `empresas` por nombre (exacto y luego sin distinguir mayúsculas).
 * Si hay varios documentos con el mismo nombre, usa el primero que tenga código válido.
 */
async function codigoEmpresaDesdeCorreo(db, correoRaw) {
  const trimmed = String(correoRaw ?? "").trim();
  if (!trimmed || !trimmed.includes("@")) return null;
  const variants = [...new Set([trimmed, trimmed.toLowerCase()])];
  for (const correo of variants) {
    const q = query(collection(db, "empresas"), where("correo", "==", correo), limit(1));
    const qs = await getDocs(q);
    if (!qs.empty) {
      const c = leerCodigoEmpresaDeData(qs.docs[0].data());
      if (c) return c;
    }
  }
  return null;
}

async function codigoEmpresaDesdeNombre(db, nombreRaw) {
  const nombre = String(nombreRaw ?? "")
    .replace(ZERO_WIDTH, "")
    .trim();
  if (!nombre) return null;
  const q = query(collection(db, "empresas"), where("nombre", "==", nombre), limit(1));
  const qs = await getDocs(q);
  if (!qs.empty) {
    const c = leerCodigoEmpresaDeData(qs.docs[0].data());
    if (c) return c;
  }
  const needle = normalizarNombreEmpresaBusqueda(nombre);
  if (!needle) return null;
  const todas = await getDocs(collection(db, "empresas"));
  const coinciden = todas.docs.filter(
    (d) => normalizarNombreEmpresaBusqueda(d.data()?.nombre) === needle
  );
  for (const d of coinciden) {
    const c = leerCodigoEmpresaDeData(d.data());
    if (c) return c;
  }
  return null;
}

/**
 * Resuelve el código AAA000 de la empresa asociada a una oferta (catálogo / compra).
 */
export async function obtenerCodigoEmpresaParaOferta(db, oferta) {
  const deOferta = leerCodigoEmpresaDeData(oferta);
  if (deOferta) return deOferta;

  if (oferta?.correoEmpresa) {
    const porCorreo = await codigoEmpresaDesdeCorreo(db, oferta.correoEmpresa);
    if (porCorreo) return porCorreo;
  }

  const eid = empresaIdAString(oferta?.empresaId);
  if (eid) {
    const snap = await getDoc(doc(db, "empresas", eid));
    if (snap.exists()) {
      const data = snap.data();
      const delDoc = leerCodigoEmpresaDeData(data);
      if (delDoc) return delDoc;
      const porNombreDoc = await codigoEmpresaDesdeNombre(db, data?.nombre);
      if (porNombreDoc) return porNombreDoc;
    }
  }

  return codigoEmpresaDesdeNombre(db, nombreEmpresaEnOferta(oferta));
}

/**
 * Busca el id del documento en `empresas` por nombre (exacto o normalizado).
 */
export async function buscarEmpresaIdPorNombre(db, nombreRaw) {
  const nombre = String(nombreRaw ?? "")
    .replace(ZERO_WIDTH, "")
    .trim();
  if (!nombre) return null;
  const q = query(collection(db, "empresas"), where("nombre", "==", nombre), limit(1));
  const qs = await getDocs(q);
  if (!qs.empty) return qs.docs[0].id;
  const needle = normalizarNombreEmpresaBusqueda(nombre);
  if (!needle) return null;
  const todas = await getDocs(collection(db, "empresas"));
  const hit = todas.docs.find(
    (d) => normalizarNombreEmpresaBusqueda(d.data()?.nombre) === needle
  );
  return hit ? hit.id : null;
}
