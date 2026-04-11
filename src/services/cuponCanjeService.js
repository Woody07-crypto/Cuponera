import {
  collection,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { duiCoincide } from "./empresaService";

/**
 * Canje de cupón vía Firestore (sin Cloud Functions; compatible con plan Spark).
 * Las reglas de seguridad exigen empleado de la misma empresa y DUI igual al del documento.
 */
export async function canjearCuponPorCodigo(codigo, duiPresente) {
  const code = (codigo || "").trim().toUpperCase();
  if (!code) throw new Error("Ingresá un código válido.");
  const dui = (duiPresente || "").trim();
  if (!dui) throw new Error("Ingresá el DUI de quien presenta el cupón.");

  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Debés iniciar sesión para canjear.");

  const q = query(collection(db, "cupones"), where("codigo", "==", code), limit(1));
  const qs = await getDocs(q);
  if (qs.empty) {
    throw new Error("No existe un cupón con ese código.");
  }

  const cuponRef = qs.docs[0].ref;

  try {
    const titulo = await runTransaction(db, async (transaction) => {
      const fresh = await transaction.get(cuponRef);
      if (!fresh.exists()) {
        throw new Error("Cupón no encontrado.");
      }
      const cupon = fresh.data();

      if (cupon.estado === "canjeado") {
        throw new Error("Este cupón ya fue canjeado.");
      }
      if (cupon.estado === "vencido") {
        throw new Error("Este cupón figura como vencido.");
      }
      if (cupon.estado !== "disponible") {
        throw new Error("Este cupón no se puede canjear.");
      }

      const limite = cupon.fechaLimiteCupon?.toDate
        ? cupon.fechaLimiteCupon.toDate()
        : cupon.fechaLimiteCupon
          ? new Date(cupon.fechaLimiteCupon)
          : null;
      if (limite && limite < new Date()) {
        throw new Error("Este cupón ya venció.");
      }

      if (!duiCoincide(cupon.clienteDui, dui)) {
        throw new Error("El DUI no coincide con el titular del cupón.");
      }

      transaction.update(cuponRef, {
        estado: "canjeado",
        fechaCanje: serverTimestamp(),
        canjeadoPorUid: uid,
        duiPresenteEnCanje: cupon.clienteDui,
      });

      return cupon.titulo || "";
    });

    return { ok: true, titulo, codigo: code };
  } catch (err) {
    // Errores lanzados dentro de la transacción (DUI, estado, etc.)
    if (err instanceof Error && (err.code == null || err.code === "") && err.message) {
      throw err;
    }

    const code = String(err?.code || "");
    const msgLow = String(err?.message || "").toLowerCase();

    if (code === "permission-denied" || code === "firestore/permission-denied" || code.includes("permission")) {
      throw new Error(
        "Este cupón no corresponde a tu empresa o las reglas rechazaron el canje. Ejecutá: firebase deploy --only firestore:rules"
      );
    }
    if (
      code === "internal" ||
      code.endsWith("/internal") ||
      msgLow === "internal" ||
      msgLow.includes("internal assertion")
    ) {
      throw new Error(
        "Firestore devolvió error interno (a menudo por reglas). Volvé a publicar: firebase deploy --only firestore:rules (proyecto cuponera-esen)."
      );
    }
    if (code === "aborted" || code.includes("aborted")) {
      throw new Error("Otro proceso actualizó el cupón al mismo tiempo. Intentá de nuevo.");
    }

    throw new Error(String(err?.message || "No se pudo completar el canje."));
  }
}
