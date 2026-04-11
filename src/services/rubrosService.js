import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";

/**
 * Rubros desde Firestore. `activo === false` se considera desactivado (soft-delete).
 */
export function ordenarRubros(lista) {
  return [...lista].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0) || (a.nombre || "").localeCompare(b.nombre || ""));
}

export async function fetchRubrosActivos(db) {
  const snap = await getDocs(collection(db, "rubros"));
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return ordenarRubros(rows.filter((r) => r.activo !== false));
}

export async function fetchRubrosTodos(db) {
  const snap = await getDocs(collection(db, "rubros"));
  return ordenarRubros(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function crearRubro(db, { nombre, orden = 0, activo = true }) {
  const ref = await addDoc(collection(db, "rubros"), {
    nombre: nombre.trim(),
    orden: Number(orden) || 0,
    activo: !!activo,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function actualizarRubro(db, id, patch) {
  await updateDoc(doc(db, "rubros", id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function eliminarRubroDoc(db, id) {
  await deleteDoc(doc(db, "rubros", id));
}
