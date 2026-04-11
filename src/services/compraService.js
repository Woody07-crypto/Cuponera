import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const guardarCompra = async (data) => {
  const docRef = await addDoc(collection(db, "cupones"), {
    clienteUid: data.uid,
    ofertaId: data.ofertaId,
    titulo: data.titulo,
    nombreEmpresa: data.nombreEmpresa,
    empresaId: data.empresaId ?? null,
    precio: data.precio,
    codigo: data.codigo,
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
