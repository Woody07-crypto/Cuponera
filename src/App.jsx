import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ToastProvider } from "./components/ui/Toast"
import ScrollToTop from "./components/ui/ScrollToTop"
import MostrarOfertas from "./components/MostrarOfertas"
import CouponsDashboard from "./components/CouponsDashboard"
import Login from "./components/Login"
import Registro from "./components/Registro"
import Footer from "./components/Footer"
import Terminos from "./components/Terminos"
import Privacidad from "./components/Privacidad"
import AdminPanel from "./components/AdminPanel"
import GestionOfertasEmpresa from "./components/GestionOfertasEmpresa"
import CanjearCupon from "./components/CanjearCupon"

const NAV_LINKS = [
  { to: "/comprar",        label: "Comprar Cupones", roles: null },
  { to: "/mis-cupones",    label: "Mis Cupones",     roles: ["cliente"] },
  { to: "/admin",          label: "Administración",  roles: ["admin"] },
  { to: "/empresa/ofertas",label: "Mis Ofertas",     roles: ["admin_empresa"] },
  { to: "/canjear",        label: "Canjear Cupón",   roles: ["empleado"] },
]

function NavLink({ to, children, onClick }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors duration-200 group ${
        active ? "text-[#C9A84C]" : "text-white/60 hover:text-white"
      }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[#C9A84C] to-[#E2C36A]
                        transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
    </Link>
  )
}

function NavBar() {
  const { user, logout, role, profileLoading } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const cerrarMenu = () => setMenuAbierto(false)

  const linksVisibles = NAV_LINKS.filter(link => {
    if (!link.roles) return true
    if (!user || profileLoading) return false
    return link.roles.includes(role)
  })

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(6,14,26,0.92)] backdrop-blur-xl border-b border-white/8 shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link to="/comprar" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8873A]
                              flex items-center justify-center text-[#060E1A] font-black text-base
                              shadow-[0_2px_12px_rgba(201,168,76,0.4)]
                              group-hover:shadow-[0_4px_20px_rgba(201,168,76,0.6)] transition-shadow">
                C
              </div>
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                La <span className="text-gradient-gold">Cuponera</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {linksVisibles.map(link => (
                <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="btn-gold text-sm py-2 px-5"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-white/40 leading-tight truncate max-w-[160px]">
                      {user.email}
                    </span>
                    <span className="text-xs text-[#00B4D8] leading-tight font-medium">
                      {role || "conectado"}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-white/50 hover:text-red-400
                               border border-white/10 hover:border-red-400/40
                               px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5
                         rounded-lg hover:bg-white/8 transition-colors"
              aria-label="Menú"
            >
              <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${
                menuAbierto ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${
                menuAbierto ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${
                menuAbierto ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="md:hidden bg-[rgba(6,14,26,0.97)] backdrop-blur-xl
                          border-t border-white/8 px-6 py-5 flex flex-col gap-4
                          animate-fade-in">
            {linksVisibles.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={cerrarMenu}
                className="text-white/70 hover:text-white font-medium text-sm py-1
                           border-b border-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={cerrarMenu}
                    className="text-center text-sm font-medium text-white/60 hover:text-white
                               py-2 border border-white/10 rounded-xl transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    onClick={cerrarMenu}
                    className="btn-gold text-sm py-2.5 w-full"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40 truncate max-w-[180px]">{user.email}</span>
                  <button
                    onClick={() => { logout(); cerrarMenu() }}
                    className="text-sm text-red-400 font-medium"
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  )
}

function RutaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function RutaPorRol({ children, roles }) {
  const { user, role, loading, profileLoading } = useAuth()
  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C]/30
                          border-t-[#C9A84C] animate-spin" />
          <span className="text-sm text-white/50">Cargando sesión…</span>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(role)) return <Navigate to="/comprar" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col page-bg">
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
                      <RutaPorRol roles={["cliente"]}>
                        <CouponsDashboard />
                      </RutaPorRol>
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RutaProtegida>
                      <RutaPorRol roles={["admin"]}>
                        <AdminPanel />
                      </RutaPorRol>
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/empresa/ofertas"
                  element={
                    <RutaProtegida>
                      <RutaPorRol roles={["admin_empresa"]}>
                        <GestionOfertasEmpresa />
                      </RutaPorRol>
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/canjear"
                  element={
                    <RutaProtegida>
                      <RutaPorRol roles={["empleado"]}>
                        <CanjearCupon />
                      </RutaPorRol>
                    </RutaProtegida>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
