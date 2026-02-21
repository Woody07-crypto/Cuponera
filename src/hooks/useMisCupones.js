import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

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
      const lista = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Convertir fechaLimiteCupon a string legible si es Timestamp
        const fechaVencimiento = data.fechaLimiteCupon?.toDate
          ? data.fechaLimiteCupon.toDate().toLocaleDateString("es-SV", {
              day: "2-digit", month: "short", year: "numeric"
            })
          : data.fechaVencimiento || "—";

        return {
          id: doc.id,
          ...data,
          fechaVencimiento,
        };
      });

      setCupones(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { cupones, loading };
};