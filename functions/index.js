import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: "us-central1" });
initializeApp();
const db = getFirestore();

function duiSoloDigitos(dui) {
  return String(dui || "").replace(/\D/g, "");
}

function duiCoincide(a, b) {
  const na = duiSoloDigitos(a);
  const nb = duiSoloDigitos(b);
  return na.length >= 8 && nb.length >= 8 && na === nb;
}

function empleadoMismaEmpresa(perfil, cupon) {
  const pid = perfil.empresaId;
  const pname = perfil.nombreEmpresa;
  const byId = pid != null && cupon.empresaId != null && cupon.empresaId === pid;
  const byName =
    pname != null &&
    cupon.nombreEmpresa != null &&
    String(cupon.nombreEmpresa).trim().toLowerCase() === String(pname).trim().toLowerCase();
  return byId || byName;
}

export const canjearCupon = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Debés iniciar sesión para canjear.");
  }
  const uid = request.auth.uid;
  const codigo = String(request.data?.codigo || "").trim().toUpperCase();
  const dui = String(request.data?.dui || "").trim();
  if (!codigo) throw new HttpsError("invalid-argument", "Código requerido.");
  if (!dui) throw new HttpsError("invalid-argument", "DUI del presente requerido.");

  const perfilSnap = await db.collection("perfiles").doc(uid).get();
  if (!perfilSnap.exists) {
    throw new HttpsError("permission-denied", "Perfil no encontrado.");
  }
  const perfil = perfilSnap.data();
  if (perfil.role !== "empleado") {
    throw new HttpsError("permission-denied", "Solo personal autorizado puede canjear.");
  }

  const q = await db.collection("cupones").where("codigo", "==", codigo).limit(1).get();
  if (q.empty) {
    throw new HttpsError("not-found", "No existe un cupón con ese código.");
  }

  const cuponRef = q.docs[0].ref;
  const cupon = q.docs[0].data();

  if (!empleadoMismaEmpresa(perfil, cupon)) {
    throw new HttpsError("permission-denied", "Este cupón no corresponde a tu empresa.");
  }

  const limite = cupon.fechaLimiteCupon?.toDate
    ? cupon.fechaLimiteCupon.toDate()
    : cupon.fechaLimiteCupon
      ? new Date(cupon.fechaLimiteCupon)
      : null;
  if (limite && limite < new Date()) {
    throw new HttpsError("failed-precondition", "Este cupón ya venció.");
  }
  if (cupon.estado === "canjeado") {
    throw new HttpsError("failed-precondition", "Este cupón ya fue canjeado.");
  }
  if (cupon.estado === "vencido") {
    throw new HttpsError("failed-precondition", "Este cupón figura como vencido.");
  }
  if (!duiCoincide(cupon.clienteDui, dui)) {
    throw new HttpsError("permission-denied", "El DUI no coincide con el titular del cupón.");
  }

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(cuponRef);
    if (!fresh.exists) throw new HttpsError("not-found", "Cupón no encontrado.");
    const data = fresh.data();
    if (data.estado === "canjeado") {
      throw new HttpsError("failed-precondition", "Este cupón ya fue canjeado.");
    }
    tx.update(cuponRef, {
      estado: "canjeado",
      fechaCanje: FieldValue.serverTimestamp(),
      canjeadoPorUid: uid,
    });
  });

  return { ok: true, titulo: cupon.titulo, codigo: cupon.codigo };
});

/**
 * Cola para la extensión oficial "Trigger Email from Firestore" (colección `mail`).
 * Si la extensión no está instalada, los documentos quedan creados sin efecto visible.
 */
export const encolarCorreoTrasCompra = onDocumentCreated("cupones/{cuponId}", async (event) => {
  const snap = event.data;
  if (!snap) return;
  const data = snap.data();
  const clienteUid = data.clienteUid;
  if (!clienteUid) return;

  try {
    const user = await getAuth().getUser(clienteUid);
    const email = user.email;
    if (!email) return;

    const codigo = data.codigo || "";
    const titulo = data.titulo || "tu cupón";
    const empresa = data.nombreEmpresa || "";

    await db.collection("mail").add({
      to: email,
      message: {
        subject: "La Cuponera — confirmación de compra",
        text: `Hola,\n\nGracias por tu compra en La Cuponera.\n\nCupón: ${codigo}\nOferta: ${titulo}\nEmpresa: ${empresa}\n\nGuardá el código para presentarlo al canjear.\n`,
      },
    });
  } catch (e) {
    console.error("encolarCorreoTrasCompra", e);
  }
});
