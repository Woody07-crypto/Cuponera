/**
 * Sincroniza usuarios de Firebase Authentication → Firestore colección `perfiles`.
 *
 * - Crea `perfiles/{uid}` con role "cliente" y correo si el documento no existe.
 * - Si el perfil ya existe, no cambia `role` (no pisa un admin).
 * - Opcional: actualiza `correo` si falta en el perfil.
 *
 * Requisitos:
 * 1. En Firebase Console → Project settings → Service accounts → Generate new private key
 * 2. Guarda el JSON fuera del repo o añádelo a .gitignore (nunca lo subas a Git).
 *
 * Uso:
 *   set GOOGLE_APPLICATION_CREDENTIALS=C:\ruta\a\serviceAccount.json
 *   npm run sync:auth-perfiles
 *
 * O:
 *   node scripts/syncAuthToPerfiles.mjs C:\ruta\a\serviceAccount.json
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function defaultProjectId() {
  const env =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT;
  if (env) return env;
  try {
    const rc = join(__dirname, "..", ".firebaserc");
    if (existsSync(rc)) {
      const j = JSON.parse(readFileSync(rc, "utf8"));
      return j.projects?.default ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function initAdmin() {
  const argPath = process.argv[2];
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const keyFile = argPath ? resolve(process.cwd(), argPath) : envPath ? resolve(envPath) : null;

  if (keyFile && existsSync(keyFile)) {
    const serviceAccount = JSON.parse(readFileSync(keyFile, "utf8"));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log("Credenciales: archivo de cuenta de servicio\n");
    return;
  }

  const projectId = defaultProjectId();
  try {
    const opts = { credential: applicationDefault() };
    if (projectId) opts.projectId = projectId;
    initializeApp(opts);
    console.log(
      `Credenciales: Application Default (gcloud / entorno)${projectId ? `  [${projectId}]` : ""}\n`
    );
  } catch {
    console.error(`
No se pudo inicializar Firebase Admin.

Opciones:
  1) Descarga la clave JSON (Firebase Console → Project settings → Service accounts).
  2) Ejecuta:
       set GOOGLE_APPLICATION_CREDENTIALS=ruta\\al-archivo.json
       npm run sync:auth-perfiles

  3) O pasa la ruta como argumento:
       node scripts/syncAuthToPerfiles.mjs ruta\\al-archivo.json
`);
    process.exit(1);
  }
}

async function main() {
  initAdmin();

  const auth = getAuth();
  const db = getFirestore();

  let nextPageToken;
  let total = 0;
  let creados = 0;
  let actualizadosCorreo = 0;
  let sinCambios = 0;

  do {
    const page = await auth.listUsers(1000, nextPageToken);
    for (const user of page.users) {
      total++;
      const uid = user.uid;
      const email = user.email || null;
      const ref = db.collection("perfiles").doc(uid);
      const snap = await ref.get();

      if (!snap.exists) {
        await ref.set({
          role: "cliente",
          correo: email,
          syncedFromAuthAt: FieldValue.serverTimestamp(),
        });
        creados++;
        console.log(`+ creado perfiles/${uid}  (${email || "sin email"})`);
        continue;
      }

      const data = snap.data() || {};
      const updates = {};

      if (email && !data.correo) {
        updates.correo = email;
      }
      if (Object.keys(updates).length > 0) {
        updates.syncedFromAuthAt = FieldValue.serverTimestamp();
        await ref.set(updates, { merge: true });
        actualizadosCorreo++;
        console.log(`~ actualizado correo perfiles/${uid}`);
      } else {
        sinCambios++;
        console.log(`= sin cambios perfiles/${uid}  (role: ${data.role ?? "—"})`);
      }
    }
    nextPageToken = page.pageToken;
  } while (nextPageToken);

  console.log(`
Listo.
  Usuarios en Auth revisados: ${total}
  Perfiles nuevos:            ${creados}
  Solo correo actualizado:    ${actualizadosCorreo}
  Sin cambios:                ${sinCambios}

Para dar admin a alguien: en Firestore edita perfiles/<uid> y pon role = "admin", o usa el panel Roles.
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
