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
      collection(db, "misCupones"),
      where("uid", "==", user.uid)
    );

    // 🔥 Tiempo real (no necesitas recargar página)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setCupones(lista);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [user]);

  return { cupones, loading };
};