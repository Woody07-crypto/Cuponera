import CompraForm from "./components/compraForm";
import ConfirmacionCompra from "./components/ConfirmacionCompra";
import { useCompra } from "./hooks/useCompra";

function App() {
  const { cantidad, setCantidad, comprar, codigoGenerado } = useCompra();

  const handleComprar = () => {
    comprar("RES"); // código empresa ejemplo
  };

  return (
    <>
      <CompraForm
        cantidad={cantidad}
        setCantidad={setCantidad}
        onComprar={handleComprar}
      />

      {codigoGenerado && (
        <ConfirmacionCompra codigo={codigoGenerado} />
      )}
    </>
  );
}

export default App;
