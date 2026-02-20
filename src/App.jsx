import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import CompraForm from "./components/compraForm";
import ConfirmacionCompra from "./components/ConfirmacionCompra";
import CouponsDashboard from "./components/CouponsDashboard";
import { useCompra } from "./hooks/useCompra";
import Login from "./components/Login";
import Registro from "./components/Registro";
import { AuthProvider, useAuth } from "./context/AuthContext";


function NavBar() {
  const { user, logout } = useAuth(); 

  return (
    <nav className="bg-[#1a241b] text-white p-4 flex justify-center gap-6 shadow-md items-center">
      <Link to="/comprar" className="hover:text-[#709756] transition-colors font-semibold">
        Comprar Cupones
      </Link>
      
    
      {user && (
        <Link to="/mis-cupones" className="hover:text-[#709756] transition-colors font-semibold">
          Mis Cupones
        </Link>
      )}

      {}
      <div className="flex gap-4 ml-4 pl-4 border-l border-gray-600">
        {!user ? (
          <>
            <Link to="/login" className="hover:text-[#709756] transition-colors">Iniciar Sesión</Link>
            <Link to="/registro" className="bg-[#709756] px-3 py-1 rounded hover:bg-[#5c7d46] transition-colors">Registrarse</Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{user.email}</span>
            <button onClick={logout} className="text-red-400 hover:text-red-300 text-sm">Salir</button>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  const { cantidad, setCantidad, comprar, codigoGenerado } = useCompra();

  const handleComprar = () => {
    comprar("RES"); 
  };

  return (
  
    <AuthProvider>
      <BrowserRouter>
        
        <NavBar />

        <Routes>
          <Route path="/" element={<Navigate to="/comprar" />} />
          
          {/* nuevas rutas alessandro*/}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/comprar"
            element={
              <div className="p-8 flex flex-col items-center">
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
    </AuthProvider>
  );
}

export default App;