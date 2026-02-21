import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MostrarOfertas from "./components/MostrarOfertas";
import CouponsDashboard from "./components/CouponsDashboard";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Footer from "./components/Footer";
import Terminos from "./components/Terminos";
import Privacidad from "./components/Privacidad";

// ═══════════════════════════════════════════════════════
//  NavBar
// ═══════════════════════════════════════════════════════
function NavBar() {
  const { user, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="bg-[#1a241b] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Marca */}
          <Link to="/comprar" className="flex items-center gap-2 shrink-0">
            <span className="text-[#709756] text-2xl"></span>
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-[#709756]">La Cuponera</span>
            </span>
          </Link>

          {/* Links — desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/comprar"
              className="text-gray-300 hover:text-[#709756] transition-colors font-semibold text-sm"
            >
              Comprar Cupones
            </Link>
            {user && (
              <Link
                to="/mis-cupones"
                className="text-gray-300 hover:text-[#709756] transition-colors font-semibold text-sm"
              >
                Mis Cupones
              </Link>
            )}
          </div>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-700">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-[#709756] transition-colors text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-[#709756] hover:bg-[#5c7d46] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 leading-tight">{user.email}</span>
                  <span className="text-xs text-[#9bbf7a] leading-tight">Conectado</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-900/40 hover:bg-red-800/60 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-800/40"
                >
                  Salir
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className={`w-5 h-0.5 bg-white transition-all duration-200 ${menuAbierto ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-white my-1 transition-all duration-200 ${menuAbierto ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-white transition-all duration-200 ${menuAbierto ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <div className="md:hidden border-t border-gray-700 bg-[#1a241b] px-4 py-4 flex flex-col gap-3">
          <Link
            to="/comprar"
            onClick={() => setMenuAbierto(false)}
            className="text-gray-300 hover:text-[#709756] font-semibold text-sm py-2"
          >
            Comprar Cupones
          </Link>
          {user && (
            <Link
              to="/mis-cupones"
              onClick={() => setMenuAbierto(false)}
              className="text-gray-300 hover:text-[#709756] font-semibold text-sm py-2"
            >
              Mis Cupones
            </Link>
          )}
          <div className="border-t border-gray-700 pt-3 flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="text-center text-gray-300 hover:text-[#709756] font-medium text-sm py-2"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMenuAbierto(false)}
                  className="text-center bg-[#709756] hover:bg-[#5c7d46] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{user.email}</span>
                <button
                  onClick={() => { logout(); setMenuAbierto(false); }}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ═══════════════════════════════════════════════════════
//  Ruta protegida
// ═══════════════════════════════════════════════════════
function RutaProtegida({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// ═══════════════════════════════════════════════════════
//  App
// ═══════════════════════════════════════════════════════
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#0f1a13]">

          <NavBar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/comprar" replace />} />
              <Route path="/comprar" element={<MostrarOfertas />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route
                path="/mis-cupones"
                element={
                  <RutaProtegida>
                    <CouponsDashboard />
                  </RutaProtegida>
                }
              />
            </Routes>
          </main>

          <Footer />

        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App;