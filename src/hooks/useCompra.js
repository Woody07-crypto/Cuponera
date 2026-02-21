import { useState } from "react";
import { useGenerarCodigo } from "./useGenerarCodigo";
import { guardarCompra } from "../services/compraService";
import { useAuth } from "../context/AuthContext";

export function useCompra() {
  const [cantidad, setCantidad] = useState(1);
  const [codigosGenerados, setCodigosGenerados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exitoso, setExitoso] = useState(false);

  const { generarCodigo } = useGenerarCodigo();
  const { user } = useAuth();

  const comprar = async (oferta) => {
    if (!user) {
      setError("Debes iniciar sesión para comprar.");
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      setExitoso(false);

      const nuevosCodigos = [];

      for (let i = 0; i < cantidad; i++) {
        const codigo = generarCodigo(oferta.nombreEmpresa);

        // Guardar cada cupón en Firebase
        await guardarCompra({
          uid: user.uid,
          ofertaId: oferta.id,
          titulo: oferta.titulo,
          nombreEmpresa: oferta.nombreEmpresa,
          precio: oferta.precioOferta,
          codigo: codigo
        });

        nuevosCodigos.push(codigo);
      }

      setCodigosGenerados(nuevosCodigos);
      setExitoso(true);
      setCantidad(1);

      return true;

    } catch (err) {
      console.error("Error en compra:", err);
      setError("Error al procesar la compra.");
      return false;

    } finally {
      setLoading(false);
    }
  };

  return {
    cantidad,
    setCantidad,
    comprar,
    codigosGenerados,
    loading,
    error,
    exitoso
  };
}