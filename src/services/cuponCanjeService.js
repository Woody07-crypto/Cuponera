import {
  collection,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Canjea un cupón por código. El empleado debe pertenecer a la misma empresa (empresaId o nombreEmpresa).
 */
export async function canjearCuponPorCodigo(codigo, empleado) {
  const code = (codigo || "").trim();
  if (!code) throw new Error("Ingresa un código válido.");

  const q = query(collection(db, "cupones"), where("codigo", "==", code));
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("No existe un cupón con ese código.");

  const cuponRef = snap.docs[0].ref;
  const cupon = snap.docs[0].data();

  const limite = cupon.fechaLimiteCupon?.toDate
    ? cupon.fechaLimiteCupon.toDate()
    : cupon.fechaLimiteCupon
      ? new Date(cupon.fechaLimiteCupon)
      : null;

  if (limite && limite < new Date()) {
    throw new Error("Este cupón ya venció.");
  }

  if (cupon.estado === "canjeado") {
    throw new Error("Este cupón ya fue canjeado.");
  }

  if (cupon.estado === "vencido") {
    throw new Error("Este cupón figura como vencido.");
  }

  const empMatchById =
    empleado.empresaId &&
    cupon.empresaId &&
    cupon.empresaId === empleado.empresaId;

  const empMatchByName =
    empleado.nombreEmpresa &&
    cupon.nombreEmpresa &&
    String(cupon.nombreEmpresa).trim().toLowerCase() ===
      String(empleado.nombreEmpresa).trim().toLowerCase();

  if (!empMatchById && !empMatchByName) {
    throw new Error("Este cupón no corresponde a tu empresa.");
  }

  await runTransaction(db, async (transaction) => {
    const fresh = await transaction.get(cuponRef);
    if (!fresh.exists()) throw new Error("Cupón no encontrado.");
    const data = fresh.data();
    if (data.estado === "canjeado") throw new Error("Este cupón ya fue canjeado.");
    transaction.update(cuponRef, {
      estado: "canjeado",
      fechaCanje: serverTimestamp(),
      canjeadoPorUid: empleado.uid || null,
    });
  });

  return { ok: true, titulo: cupon.titulo, codigo: cupon.codigo };
}
