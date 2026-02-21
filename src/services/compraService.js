import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

// Guarda el cupón comprado en Firestore
export const guardarCompra = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "misCupones"), {
      ...data,
      fechaCompra: serverTimestamp(),
      estado: "activo"
    });

    return docRef.id;
  } catch (error) {
    console.error("Error guardando compra:", error);
    throw error;
  }
};