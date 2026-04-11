import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { duiCoincide, empresaIdAString } from "./empresaService";

/**
 * Canje de cupón vía Firestore (sin Cloud Functions; compatible con plan Spark).
 * Las reglas de seguridad exigen empleado de la misma empresa y DUI igual al del documento.
 *
 * @param {object} [opciones]
 * @param {string|null} [opciones.empresaId] — id string del doc `empresas` (mejora consultas y permisos).
 */
export async function canjearCuponPorCodigo(codigo, duiPresente, opciones = {}) {
  const code = (codigo || "").trim().toUpperCase();
  if (!code) throw new Error("Ingresá un código válido.");
  const dui = (duiPresente || "").trim();
  if (!dui) throw new Error("Ingresá el DUI de quien presenta el cupón.");

  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Debés iniciar sesión para canjear.");

  const empresaIdStr =
    opciones.empresaId != null && opciones.empresaId !== ""
      ? empresaIdAString(opciones.empresaId) || String(opciones.empresaId).trim() || null
      : null;

  try {
    let cuponRef = null;
    let lastQueryError = null;

    const tryQuery = async (q) => {
      try {
        const qs = await getDocs(q);
        if (!qs.empty) return qs.docs[0].ref;
      } catch (e) {
        lastQueryError = e;
      }
      return null;
    };

    if (empresaIdStr) {
      const empRef = doc(db, "empresas", empresaIdStr);
      cuponRef = await tryQuery(
        query(collection(db, "cupones"), where("codigo", "==", code), where("empresaId", "==", empRef), limit(1))
      );
      if (!cuponRef) {
        cuponRef = await tryQuery(
          query(collection(db, "cupones"), where("codigo", "==", code), where("empresaId", "==", empresaIdStr), limit(1))
        );
      }
    }
    if (!cuponRef) {
      cuponRef = await tryQuery(query(collection(db, "cupones"), where("codigo", "==", code), limit(1)));
    }

    if (!cuponRef) {
      if (lastQueryError) throw lastQueryError;
      throw new Error("No existe un cupón con ese código.");
    }

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
    // Errores de negocio (sin código Firebase) lanzados en la transacción
    if (err instanceof Error && (err.code == null || err.code === "") && err.message) {
      throw err;
    }

    const code = String(err?.code || "");
    const msgLow = String(err?.message || "").toLowerCase();

    if (
      code === "permission-denied" ||
      code === "firestore/permission-denied" ||
      code.includes("permission") ||
      msgLow.includes("missing or insufficient permissions")
    ) {
      throw new Error(
        "No tenés permiso para ver o canjear este cupón. Comprobá que tu perfil sea «empleado» vinculado a la empresa correcta (empresaId en el perfil, o nombreEmpresa, o que el código empiece con el codigoEmpresa de esa empresa en Firestore) y que las reglas estén actualizadas."
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
