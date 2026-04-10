import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

function estadoMostrarDesde(data) {
  if (data.estado === "canjeado") return "canjeado";
  if (data.estado === "vencido") return "vencido";
  const lim = data.fechaLimiteCupon?.toDate
    ? data.fechaLimiteCupon.toDate()
    : data.fechaLimiteCupon
      ? new Date(data.fechaLimiteCupon)
      : null;
  if (lim && lim < new Date()) return "vencido";
  return "disponible";
}

export const useMisCupones = () => {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCupones([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "cupones"),
      where("clienteUid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const fechaVencimiento = data.fechaLimiteCupon?.toDate
          ? data.fechaLimiteCupon.toDate().toLocaleDateString("es-SV", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : data.fechaVencimiento || "—";

        return {
          id: docSnap.id,
          ...data,
          fechaVencimiento,
          estadoMostrar: estadoMostrarDesde(data),
        };
      });

      setCupones(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { cupones, loading };
};
