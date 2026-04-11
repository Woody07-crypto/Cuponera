import { useState } from "react"
import { auth, db } from "../firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { fetchRoleAndProfile, rutaTrasLogin } from "../services/perfilService"

import { useNavigate, Link } from "react-router-dom"

const IcEye = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IcEyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const IcMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IcLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)
const IcCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IcAlert = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IcTicket = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)
const IcStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IcArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const STATS = [
  { value: "10K+", label: "Usuarios activos" },
  { value: "500+", label: "Ofertas publicadas" },
  { value: "85%",  label: "Ahorro promedio" },
]

const FEATURES = [
  { icon: "🎯", text: "Descuentos exclusivos verificados" },
  { icon: "⚡", text: "Compra y descarga en segundos" },
  { icon: "🔒", text: "Pagos 100% seguros" },
  { icon: "📱", text: "Funciona en todos tus dispositivos" },
]

function validarEmail(v)    { return !v ? "Requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Correo inválido" : "" }
function validarPassword(v) { return !v ? "Requerido" : v.length < 6 ? "Mínimo 6 caracteres" : "" }

function Field({ label, error, success, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
      {children}
      {error   && <span className="field-error"><IcAlert />{error}</span>}
      {!error && success && <span className="field-ok"><IcCheck />{success}</span>}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPw,   setShowPw]   = useState(false)
  const [touched,  setTouched]  = useState({ email: false, password: false })
  const [srvErr,   setSrvErr]   = useState("")
  const [loading,  setLoading]  = useState(false)

  const emailErr    = touched.email    ? validarEmail(email)       : ""
  const passwordErr = touched.password ? validarPassword(password) : ""

  const cls = (f, extra = "") => {
    const err   = f === "email" ? emailErr    : passwordErr
    const touch = touched[f]
    const val   = f === "email" ? email       : password
    return `input-field pl-11 ${extra} ${touch && err ? "invalid" : ""} ${touch && !err && val ? "valid" : ""}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (validarEmail(email) || validarPassword(password)) return
    setSrvErr("")
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const { role: r } = await fetchRoleAndProfile(db, cred.user.uid, cred.user.email)
      navigate(rutaTrasLogin(r))
    } catch { setSrvErr("Correo o contraseña incorrectos.") }
    finally  { setLoading(false) }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between px-12 py-14 overflow-hidden"
           style={{ background: "linear-gradient(160deg, #0E1117 0%, #07090F 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
               style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)", transform: "translate(-40%, -40%)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15"
               style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)", transform: "translate(30%, 30%)" }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <IcTicket />
            </div>
            <span className="font-heading font-bold text-lg text-white">La <span className="text-grad">Cuponera</span></span>
          </div>

          <div className="mb-10">
            <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
              Ahorra en cada<br />
              <span className="text-grad">compra que haces</span>
            </h2>
            <p className="text-white/45 text-sm leading-relaxed">
              La plataforma de cupones más completa de El Salvador.
              Miles de descuentos en restaurantes, servicios y entretenimiento.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {STATS.map(s => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="font-heading font-bold text-2xl text-grad">{s.value}</span>
                <span className="text-xs text-white/35">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {FEATURES.map(f => (
              <div key={f.text} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                   style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-base">{f.icon}</span>
                <span className="text-sm text-white/55">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-1.5 mt-8">
          {[1,2,3,4,5].map(i => <IcStar key={i} className="text-yellow-400" />)}
          <span className="text-xs text-white/40 ml-1">4.9 · más de 2,000 reseñas</span>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 sm:px-12 py-14"
           style={{ background: "linear-gradient(180deg, #0A0C14 0%, #07090F 100%)" }}>
        <div className="w-full max-w-md animate-fade-in-up">

          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <IcTicket />
            </div>
            <span className="font-heading font-bold text-base text-white">La <span className="text-grad">Cuponera</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
            <p className="text-sm text-white/40">Ingresa tus credenciales para continuar</p>
          </div>

          {srvErr && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm animate-fade-in"
                 style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}>
              <IcAlert />
              {srvErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Field label="Correo electrónico" error={emailErr}
                   success={!emailErr && touched.email && email ? "✓ Correo válido" : ""}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"><IcMail /></span>
                <input type="email" placeholder="tu@correo.com" value={email}
                       onChange={e => setEmail(e.target.value)}
                       onBlur={() => setTouched(t => ({ ...t, email: true }))}
                       className={cls("email")} autoComplete="email" />
              </div>
            </Field>

            <Field label="Contraseña" error={passwordErr}
                   success={!passwordErr && touched.password && password ? "✓ Contraseña válida" : ""}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"><IcLock /></span>
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                       onChange={e => setPassword(e.target.value)}
                       onBlur={() => setTouched(t => ({ ...t, password: true }))}
                       className={cls("password", "pr-12")} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                  {showPw ? <IcEyeOff /> : <IcEye />}
                </button>
              </div>
            </Field>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin-slow" />
                  Ingresando…
                </span>
              ) : (
                <span className="flex items-center gap-2">Ingresar <IcArrow /></span>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="divider" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                             px-3 text-xs text-white/25"
                  style={{ background: "#0A0C14" }}>
              ¿Eres nuevo?
            </span>
          </div>

          <Link to="/registro"
                className="btn-ghost w-full py-3.5 flex items-center justify-center gap-2">
            Crear una cuenta gratis
            <IcArrow />
          </Link>

          <p className="mt-8 text-center text-xs text-white/20">
            Al continuar aceptas nuestros{" "}
            <Link to="/terminos"   className="text-white/35 hover:text-purple-400 transition-colors">Términos</Link>
            {" "}y{" "}
            <Link to="/privacidad" className="text-white/35 hover:text-purple-400 transition-colors">Privacidad</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
