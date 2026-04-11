import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { buscarEmpresaIdPorCodigoEmpresa, empresaIdAString, validarCodigoEmpresa } from "./empresaService";

/** Roles reconocidos por la app (rutas y navbar). */
export const ROLES = {
  CLIENTE: "cliente",
  ADMIN: "admin",
  ADMIN_EMPRESA: "admin_empresa",
  EMPLEADO: "empleado",
};

export const ROLES_ORDENADOS = [
  ROLES.CLIENTE,
  ROLES.ADMIN,
  ROLES.ADMIN_EMPRESA,
  ROLES.EMPLEADO,
];

/**
 * Resuelve rol y perfil: `perfiles` es la fuente de verdad del rol.
 * Si no hay perfil pero sí documento en `clientes`, se trata como cliente (datos legacy).
 */
export async function fetchRoleAndProfile(db, uid, email) {
  const perfilSnap = await getDoc(doc(db, "perfiles", uid));
  const clienteSnap = await getDoc(doc(db, "clientes", uid));

  if (perfilSnap.exists()) {
    const data = perfilSnap.data();
    const role = data.role || null;
    let profile = { id: uid, ...data };
    if (role === ROLES.CLIENTE && clienteSnap.exists()) {
      profile = { id: uid, ...clienteSnap.data(), ...data };
    }
    if (profile.empresaId != null && profile.empresaId !== "") {
      const sid = empresaIdAString(profile.empresaId);
      if (sid) profile = { ...profile, empresaId: sid };
    }
    // Confusión frecuente: guardar codigoEmpresa (EVS001) en vez del id del documento empresas/{id}
    if (
      profile.empresaId &&
      typeof profile.empresaId === "string" &&
      validarCodigoEmpresa(profile.empresaId).ok
    ) {
      const docId = await buscarEmpresaIdPorCodigoEmpresa(db, profile.empresaId);
      if (docId) profile = { ...profile, empresaId: docId };
    }
    return { role, profile };
  }

  if (clienteSnap.exists()) {
    return {
      role: ROLES.CLIENTE,
      profile: { id: uid, ...clienteSnap.data() },
    };
  }

  return {
    role: null,
    profile: { id: uid, correo: email || null },
  };
}

export function rutaTrasLogin(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.ADMIN_EMPRESA:
      return "/empresa/ofertas";
    case ROLES.EMPLEADO:
      return "/canjear";
    case ROLES.CLIENTE:
      return "/mis-cupones";
    default:
      return "/comprar";
  }
}

export async function listarPerfiles(db) {
  const snap = await getDocs(collection(db, "perfiles"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function guardarRolPerfil(db, uid, role, extra = {}) {
  if (!uid?.trim()) throw new Error("UID requerido");
  if (!ROLES_ORDENADOS.includes(role)) throw new Error("Rol no válido");
  await setDoc(
    doc(db, "perfiles", uid.trim()),
    {
      role,
      ...extra,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
