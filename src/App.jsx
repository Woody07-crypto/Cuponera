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

const IconTicket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)

const NAV_LINKS = [
  { to: "/comprar",         label: "Explorar",       roles: null },
  { to: "/mis-cupones",     label: "Mis Cupones",    roles: ["cliente"] },
  { to: "/admin",           label: "Panel Admin",    roles: ["admin"] },
  { to: "/empresa/ofertas", label: "Mis Ofertas",    roles: ["admin_empresa"] },
  { to: "/canjear",         label: "Canjear",        roles: ["empleado"] },
]

function NavLink({ to, children, onClick }) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-all duration-200 px-1 py-0.5 relative group ${
        active ? "text-white" : "text-white/45 hover:text-white/80"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-0 right-0 h-px rounded-full"
              style={{ background: "linear-gradient(90deg, #7C3AED, #06B6D4)" }} />
      )}
    </Link>
  )
}

function NavBar() {
  const { user, logout, role, profileLoading } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const linksVisibles = NAV_LINKS.filter(l => {
    if (!l.roles) return true
    if (!user || profileLoading) return false
    return l.roles.includes(role)
  })

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(7,9,15,0.88)] backdrop-blur-2xl border-b border-white/6 shadow-[0_2px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link to="/comprar" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                   style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
                <IconTicket />
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ boxShadow: "0 0 20px rgba(124,58,237,0.7)" }} />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                La <span className="text-grad">Cuponera</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {linksVisibles.map(l => (
                <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                    Entrar
                  </Link>
                  <Link to="/registro" className="btn-primary text-sm py-2 px-5">
                    Registrarse
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-white/35 truncate max-w-[150px]">{user.email}</span>
                    <span className="text-xs font-medium" style={{ color: "#22D3EE" }}>{role}</span>
                  </div>
                  <button onClick={logout}
                          className="btn-ghost text-sm py-2 px-3 text-red-400 border-red-500/20 hover:bg-red-500/8 hover:text-red-300">
                    Salir
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMenuAbierto(v => !v)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl"
              aria-label="Menú"
            >
              <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuAbierto ? "rotate-45 translate-y-[5px]" : ""}`} />
              <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuAbierto ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuAbierto ? "-rotate-45 -translate-y-[5px]" : ""}`} />
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="md:hidden border-t border-white/6 bg-[rgba(7,9,15,0.97)] backdrop-blur-2xl px-6 py-5 flex flex-col gap-3 animate-fade-in">
            {linksVisibles.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuAbierto(false)}
                    className="text-sm font-medium text-white/55 hover:text-white py-2 border-b border-white/5 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMenuAbierto(false)} className="btn-ghost text-sm py-2.5 w-full">Entrar</Link>
                  <Link to="/registro" onClick={() => setMenuAbierto(false)} className="btn-primary text-sm py-2.5 w-full">Registrarse</Link>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/35 truncate">{user.email}</span>
                  <button onClick={() => { logout(); setMenuAbierto(false) }} className="text-sm text-red-400 font-medium">Salir</button>
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
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin-slow" />
          <span className="text-sm text-white/35">Verificando acceso…</span>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(role)) return <Navigate to="/comprar" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col page-bg">
            <NavBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to="/comprar" replace />} />
                <Route path="/comprar"   element={<MostrarOfertas />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/registro"  element={<Registro />} />
                <Route path="/terminos"  element={<Terminos />} />
                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="/mis-cupones" element={<RutaProtegida><RutaPorRol roles={["cliente"]}><CouponsDashboard /></RutaPorRol></RutaProtegida>} />
                <Route path="/admin" element={<RutaProtegida><RutaPorRol roles={["admin"]}><AdminPanel /></RutaPorRol></RutaProtegida>} />
                <Route path="/empresa/ofertas" element={<RutaProtegida><RutaPorRol roles={["admin_empresa"]}><GestionOfertasEmpresa /></RutaPorRol></RutaProtegida>} />
                <Route path="/canjear" element={<RutaProtegida><RutaPorRol roles={["empleado"]}><CanjearCupon /></RutaPorRol></RutaProtegida>} />
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
