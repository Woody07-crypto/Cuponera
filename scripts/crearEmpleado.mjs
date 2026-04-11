/**
 * Crea un usuario en Firebase Auth y el documento perfiles/{uid} con rol empleado,
 * empresaId y nombreEmpresa tomados del documento empresas/{empresaId}.
 *
 * Así el empleado puede canjear cupones (las reglas exigen empresaId o coincidencia de nombre / prefijo).
 *
 * Requisito: cuenta de servicio (mismo flujo que sync:auth-perfiles).
 *
 * Uso:
 *   set GOOGLE_APPLICATION_CREDENTIALS=C:\ruta\serviceAccount.json
 *   node scripts/crearEmpleado.mjs empleado.test@tu-dominio.com TuPasswordSegura EMPRESA_FIRESTORE_DOC_ID
 *
 * Si el primer argumento es un .json existente, se usa como clave:
 *   node scripts/crearEmpleado.mjs C:\ruta\key.json email pass EMPRESA_DOC_ID
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
    process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
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

function initAdmin(keyFileArg) {
  const keyFile = keyFileArg ? resolve(process.cwd(), keyFileArg) : null;
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : null;
  const pathToUse = keyFile && existsSync(keyFile) ? keyFile : envPath && existsSync(envPath) ? envPath : null;

  if (pathToUse) {
    const serviceAccount = JSON.parse(readFileSync(pathToUse, "utf8"));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log("Firebase Admin: cuenta de servicio\n");
    return;
  }

  const projectId = defaultProjectId();
  initializeApp({
    credential: applicationDefault(),
    ...(projectId ? { projectId } : {}),
  });
  console.log(`Firebase Admin: Application Default${projectId ? ` [${projectId}]` : ""}\n`);
}

function parseArgs() {
  const a = process.argv.slice(2);
  let keyJson = null;
  let i = 0;
  if (a[0] && (a[0].endsWith(".json") || existsSync(resolve(process.cwd(), a[0])))) {
    keyJson = a[0];
    i = 1;
  }
  const email = a[i];
  const password = a[i + 1];
  const empresaId = a[i + 2];
  return { keyJson, email, password, empresaId };
}

async function main() {
  const { keyJson, email, password, empresaId } = parseArgs();
  if (!email || !password || !empresaId) {
    console.error(`
Faltan argumentos.

  node scripts/crearEmpleado.mjs [clave.json] <email> <password> <empresaDocumentId>

El empresaDocumentId es el ID del documento en la colección "empresas" (Firestore).
Copialo desde la consola de Firebase → Firestore → empresas → documento.
`);
    process.exit(1);
  }

  initAdmin(keyJson);

  const auth = getAuth();
  const db = getFirestore();

  const empRef = db.collection("empresas").doc(empresaId);
  const empSnap = await empRef.get();
  if (!empSnap.exists) {
    console.error(`No existe empresas/${empresaId}. Revisá el ID en Firestore.`);
    process.exit(1);
  }
  const emp = empSnap.data() || {};
  const nombreEmpresa = typeof emp.nombre === "string" ? emp.nombre.trim() || null : null;

  let uid;
  try {
    const created = await auth.createUser({
      email,
      password,
      emailVerified: false,
      displayName: nombreEmpresa ? `Empleado ${nombreEmpresa}` : "Empleado",
    });
    uid = created.uid;
    console.log(`Usuario Auth creado: ${email}  uid=${uid}\n`);
  } catch (e) {
    if (e?.code === "auth/email-already-exists") {
      const u = await auth.getUserByEmail(email);
      uid = u.uid;
      console.log(`El correo ya existía en Auth; se actualiza solo perfiles/${uid}\n`);
    } else {
      console.error(e);
      process.exit(1);
    }
  }

  await db
    .collection("perfiles")
    .doc(uid)
    .set(
      {
        role: "empleado",
        correo: email,
        empresaId,
        nombreEmpresa,
        nombres: "",
        apellidos: "",
        empleadoCreadoScriptAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  console.log(`Listo: perfiles/${uid}`);
  console.log(`  role: empleado`);
  console.log(`  empresaId: ${empresaId}`);
  console.log(`  nombreEmpresa: ${nombreEmpresa ?? "—"}`);
  console.log(`
Iniciá sesión en la app con ese correo y contraseña y probá Canjear.
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
