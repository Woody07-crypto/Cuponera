import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { empresaIdAString } from "./empresaService";

export const guardarCompra = async (data) => {
  const empresaIdNorm =
    data.empresaId != null && data.empresaId !== ""
      ? empresaIdAString(data.empresaId) ?? null
      : null;
  const docRef = await addDoc(collection(db, "cupones"), {
    clienteUid: data.uid,
    ofertaId: data.ofertaId,
    titulo: data.titulo,
    nombreEmpresa: data.nombreEmpresa,
    empresaId: empresaIdNorm,
    precio: data.precio,
    codigo: data.codigo,
    clienteDui: data.clienteDui,
    fechaLimiteCupon: data.fechaLimiteCupon ?? null,
    fechaCompra: serverTimestamp(),
    estado: "disponible",
  });
  return docRef.id;
};

export const incrementarCuponesVendidos = async (ofertaId, cantidad) => {
  if (!ofertaId || cantidad < 1) return;
  await updateDoc(doc(db, "ofertas", ofertaId), {
    cuponesVendidos: increment(cantidad),
  });
};
