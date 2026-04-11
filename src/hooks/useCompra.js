import { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useGenerarCodigo } from "./useGenerarCodigo";
import { guardarCompra, incrementarCuponesVendidos } from "../services/compraService";
import { obtenerCodigoEmpresaParaOferta } from "../services/empresaService";
import { useAuth } from "../context/AuthContext";
import { app, db } from "../firebase/config";

function clienteDuiDesdePerfil(profile) {
  const raw = (profile?.dui || "").trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return raw;
}

export function useCompra() {
  const [cantidad, setCantidad] = useState(1);
  const [codigosGenerados, setCodigosGenerados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exitoso, setExitoso] = useState(false);

  const { generarCodigo } = useGenerarCodigo();
  const { user, profile } = useAuth();

  const comprar = async (oferta) => {
    if (!user) {
      setError("Debes iniciar sesión para comprar.");
      return false;
    }

    const clienteDui = clienteDuiDesdePerfil(profile);
    if (!clienteDui) {
      setError(
        "Tu cuenta no tiene un DUI válido registrado. Actualiza tus datos en registro o contacta al administrador."
      );
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      setExitoso(false);

      let codigoEmpresa = null;
      try {
        const functions = getFunctions(app, "us-central1");
        const resolver = httpsCallable(functions, "resolverCodigoEmpresaCompra");
        const res = await resolver({ ofertaId: oferta.id });
        codigoEmpresa = res.data?.codigoEmpresa ?? null;
      } catch (fnErr) {
        console.warn("resolverCodigoEmpresaCompra (servidor):", fnErr?.code || fnErr?.message || fnErr);
      }
      if (!codigoEmpresa) {
        codigoEmpresa = await obtenerCodigoEmpresaParaOferta(db, oferta);
      }
      if (!codigoEmpresa) {
        setError(
          "Esta empresa no tiene código AAA000 configurado. Un administrador debe completar los datos de la empresa antes de permitir compras."
        );
        return false;
      }

      const nuevosCodigos = [];

      for (let i = 0; i < cantidad; i++) {
        const codigo = generarCodigo(codigoEmpresa);

        await guardarCompra({
          uid: user.uid,
          ofertaId: oferta.id,
          titulo: oferta.titulo,
          nombreEmpresa: oferta.nombreEmpresa,
          empresaId: oferta.empresaId ?? null,
          precio: oferta.precioOferta,
          codigo,
          clienteDui,
          fechaLimiteCupon: oferta.fechaLimiteCupon ?? null,
        });

        nuevosCodigos.push(codigo);
      }

      await incrementarCuponesVendidos(oferta.id, cantidad);

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
    exitoso,
  };
}
