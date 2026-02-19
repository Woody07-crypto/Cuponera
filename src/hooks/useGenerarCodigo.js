export function useGenerarCodigo() {
  const generarCodigo = (codigoEmpresa) => {
    const numero = Math.floor(1000000 + Math.random() * 9000000);
    return `${codigoEmpresa}${numero}`;
  };

  return { generarCodigo };
}


//Código empresa, numero aleatorio de 7 dígitos