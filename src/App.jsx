import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MostrarOfertas from "./components/MostrarOfertas";
import CouponsDashboard from "./components/CouponsDashboard";
import Login from "./components/Login";
import Registro from "./components/Registro";


function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#1a241b] text-white p-4 flex justify-center gap-6 shadow-md items-center">
      {/* Enlace principal — visible para todos */}
      <Link
        to="/comprar"
        className="hover:text-[#709756] transition-colors font-semibold"
      >
        Comprar Cupones
      </Link>

      {/* Solo visible si el usuario está autenticado */}
      {user && (
        <Link
          to="/mis-cupones"
          className="hover:text-[#709756] transition-colors font-semibold"
        >
          Mis Cupones
        </Link>
      )}

      {/* Auth section */}
      <div className="flex gap-4 ml-4 pl-4 border-l border-gray-600 items-center">
        {!user ? (
          <>
            <Link
              to="/login"
              className="hover:text-[#709756] transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              className="bg-[#709756] px-3 py-1 rounded hover:bg-[#5c7d46] transition-colors"
            >
              Registrarse
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{user.email}</span>
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}


function RutaProtegida({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // espera a que Firebase confirme el estado

  return user ? children : <Navigate to="/login" replace />;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Redirige raíz a /comprar */}
          <Route path="/" element={<Navigate to="/comprar" replace />} />

          {/* Pública: listado de ofertas */}
          <Route path="/comprar" element={<MostrarOfertas />} />

          {/* Auth */}
          <Route path="/login"   element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Protegida: solo usuarios autenticados */}
          <Route
            path="/mis-cupones"
            element={
              <RutaProtegida>
                <CouponsDashboard />
              </RutaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;