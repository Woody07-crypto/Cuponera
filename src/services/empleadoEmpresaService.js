import { collection, getDocs, query, where } from "firebase/firestore";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { empresaIdAString } from "./empresaService";
import { ROLES } from "./perfilService";

/**
 * Lista perfiles con rol empleado vinculados a la misma empresa (empresaId o nombreEmpresa).
 */
export async function listarEmpleadosEmpresa(db, { empresaId, nombreEmpresa }) {
  const out = [];
  const eidStr = empresaId ? empresaIdAString(empresaId) : null;
  if (eidStr) {
    const q = query(collection(db, "perfiles"), where("role", "==", ROLES.EMPLEADO), where("empresaId", "==", eidStr));
    const snap = await getDocs(q);
    snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
  }
  if (nombreEmpresa && (!eidStr || out.length === 0)) {
    const q2 = query(
      collection(db, "perfiles"),
      where("role", "==", ROLES.EMPLEADO),
      where("nombreEmpresa", "==", nombreEmpresa)
    );
    const snap2 = await getDocs(q2);
    snap2.forEach((d) => {
      if (!out.some((x) => x.id === d.id)) out.push({ id: d.id, ...d.data() });
    });
  }
  return out;
}

/**
 * Crea/actualiza perfil de empleado (UID debe existir en Authentication).
 */
export async function upsertEmpleadoPerfil(db, uid, { nombres, apellidos, correo, empresaId, nombreEmpresa }) {
  const id = uid.trim();
  if (id.length < 20) throw new Error("UID inválido.");
  await setDoc(
    doc(db, "perfiles", id),
    {
      role: ROLES.EMPLEADO,
      nombres: (nombres || "").trim(),
      apellidos: (apellidos || "").trim(),
      correo: (correo || "").trim(),
      empresaId: empresaId || null,
      nombreEmpresa: (nombreEmpresa || "").trim() || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function quitarEmpleadoPerfil(db, uid) {
  await deleteDoc(doc(db, "perfiles", uid));
}
