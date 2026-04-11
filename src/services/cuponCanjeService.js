import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../firebase/config";

/**
 * Canjea un cupón por código (Cloud Function con validación de DUI y empresa).
 */
export async function canjearCuponPorCodigo(codigo, duiPresente) {
  const code = (codigo || "").trim().toUpperCase();
  if (!code) throw new Error("Ingresá un código válido.");
  const dui = (duiPresente || "").trim();
  if (!dui) throw new Error("Ingresá el DUI de quien presenta el cupón.");

  const functions = getFunctions(app, "us-central1");
  const callable = httpsCallable(functions, "canjearCupon");
  try {
    const res = await callable({ codigo: code, dui });
    return res.data;
  } catch (err) {
    const codeStr = err?.code || "";
    const raw = String(err?.message || "");

    if (codeStr === "functions/not-found" || raw.includes("NOT_FOUND")) {
      throw new Error(
        "El servicio de canje no está disponible. Desplegá las Cloud Functions (ver README)."
      );
    }
    if (
      codeStr === "functions/permission-denied" ||
      codeStr === "functions/failed-precondition" ||
      codeStr === "functions/invalid-argument"
    ) {
      const cleaned = raw.replace(/^Firebase:\s*/i, "").replace(/\s*\([^)]*\)\s*$/, "").trim();
      throw new Error(cleaned || "No se pudo completar el canje.");
    }

    throw new Error(raw || "Error al canjear.");
  }
}
