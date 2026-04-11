import { useState } from "react";
import { useGenerarCodigo } from "./useGenerarCodigo";
import { guardarCompra, incrementarCuponesVendidos } from "../services/compraService";
import {
  buscarEmpresaIdPorCodigoEmpresa,
  buscarEmpresaIdPorNombre,
  empresaIdAString,
  nombreEmpresaEnOferta,
  obtenerCodigoEmpresaParaOferta,
} from "../services/empresaService";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";

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

      const codigoEmpresa = await obtenerCodigoEmpresaParaOferta(db, oferta);
      if (!codigoEmpresa) {
        setError(
          "Esta empresa no tiene código AAA000 configurado. Un administrador debe completar los datos de la empresa antes de permitir compras."
        );
        return false;
      }

      let empresaIdCupon = empresaIdAString(oferta?.empresaId);
      if (!empresaIdCupon) {
        empresaIdCupon = await buscarEmpresaIdPorCodigoEmpresa(db, codigoEmpresa);
      }
      if (!empresaIdCupon) {
        empresaIdCupon = await buscarEmpresaIdPorNombre(db, nombreEmpresaEnOferta(oferta));
      }

      const nuevosCodigos = [];

      for (let i = 0; i < cantidad; i++) {
        const codigo = generarCodigo(codigoEmpresa);

        await guardarCompra({
          uid: user.uid,
          ofertaId: oferta.id,
          titulo: oferta.titulo,
          nombreEmpresa: oferta.nombreEmpresa,
          empresaId: empresaIdCupon,
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
