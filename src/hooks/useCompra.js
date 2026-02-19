import { useState } from "react";
import { useGenerarCodigo } from "./useGenerarCodigo";

export function useCompra() {
  const [cantidad, setCantidad] = useState(1);
  const [codigoGenerado, setCodigoGenerado] = useState(null);

  const { generarCodigo } = useGenerarCodigo();

  const comprar = (codigoEmpresa) => {
    const codigo = generarCodigo(codigoEmpresa);

    // Aquí luego irá la llamada al backend
    console.log("Cupón generado:", codigo);

    setCodigoGenerado(codigo);
  };

  return {
    cantidad,
    setCantidad,
    comprar,
    codigoGenerado
  };
}
