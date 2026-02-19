import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";


import CompraForm from "./components/compraForm";
import ConfirmacionCompra from "./components/ConfirmacionCompra";
import { useCompra } from "./hooks/useCompra";
import CouponsDashboard from "./components/CouponsDashboard";

function App() {
 
  const { cantidad, setCantidad, comprar, codigoGenerado } = useCompra();

  const handleComprar = () => {
    comprar("RES"); 
  };

  return (
    <BrowserRouter>
      
      <nav className="bg-[#1a241b] text-white p-4 flex justify-center gap-6 shadow-md">
        <Link to="/comprar" className="hover:text-[#709756] transition-colors font-semibold">
          Comprar Cupones
        </Link>
        <Link to="/mis-cupones" className="hover:text-[#709756] transition-colors font-semibold">
          Mis Cupones
        </Link>
      </nav>

      <Routes>
        
        <Route path="/" element={<Navigate to="/comprar" />} />

       
        <Route
          path="/comprar"
          element={
            <div className="p-8">
              <CompraForm
                cantidad={cantidad}
                setCantidad={setCantidad}
                onComprar={handleComprar}
              />

              {codigoGenerado && (
                <div className="mt-6">
                  <ConfirmacionCompra codigo={codigoGenerado} />
                </div>
              )}
            </div>
          }
        />

       
        <Route path="/mis-cupones" element={<CouponsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
