export function useGenerarCodigo() {
  const generarCodigo = (codigoEmpresa) => {
    const pref = String(codigoEmpresa || "").trim().toUpperCase();
    const n = Math.floor(Math.random() * 10_000_000);
    const sufijo = String(n).padStart(7, "0");
    return `${pref}${sufijo}`;
  };

  return { generarCodigo };
}


//Código empresa, numero aleatorio de 7 dígitos