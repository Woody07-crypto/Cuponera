import { useState } from "react"
import { auth, db } from "../firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useNavigate, Link } from "react-router-dom"

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

const DESCUENTOS_DEMO = [
  { emoji: "🍕", texto: "50% en pizza familiar" },
  { emoji: "💇", texto: "Corte + tinte por $22" },
  { emoji: "🎬", texto: "2 entradas de cine por $7" },
  { emoji: "🏨", texto: "Hotel + desayuno $59" },
]

function validarEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) return "El correo es requerido"
  if (!re.test(value)) return "Formato de correo inválido"
  return ""
}
function validarPassword(value) {
  if (!value) return "La contraseña es requerida"
  if (value.length < 6) return "Mínimo 6 caracteres"
  return ""
}

function FieldWrapper({ label, error, success, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label-premium">{label}</label>
      {children}
      {error && (
        <span className="field-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
      {!error && success && (
        <span className="field-success">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {success}
        </span>
      )}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const emailError    = touched.email    ? validarEmail(email)    : ""
  const passwordError = touched.password ? validarPassword(password) : ""

  const inputClass = (field) => {
    const val = field === "email" ? email : password
    const err = field === "email" ? emailError : passwordError
    const touch = touched[field]
    return `input-premium pl-11 ${touch && err ? "invalid" : ""} ${touch && !err && val ? "valid" : ""}`
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (validarEmail(email) || validarPassword(password)) return
    setServerError("")
    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid
      const clienteSnap = await getDoc(doc(db, "clientes", uid))
      if (clienteSnap.exists()) { navigate("/mis-cupones"); return }
      const perfilSnap = await getDoc(doc(db, "perfiles", uid))
      if (perfilSnap.exists()) {
        const r = perfilSnap.data().role
        if (r === "admin") navigate("/admin")
        else if (r === "admin_empresa") navigate("/empresa/ofertas")
        else if (r === "empleado") navigate("/canjear")
        else navigate("/comprar")
        return
      }
      navigate("/comprar")
    } catch {
      setServerError("Correo o contraseña incorrectos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      <div className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center px-14 overflow-hidden"
           style={{ background: "linear-gradient(160deg, #0F2040 0%, #060E1A 100%)" }}>
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #00B4D8, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="relative z-10 w-full max-w-xs">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A8873A]
                            flex items-center justify-center text-[#060E1A] font-black text-3xl
                            mx-auto mb-5 shadow-[0_8px_32px_rgba(201,168,76,0.4)]">
              C
            </div>
            <h2 className="font-heading text-3xl font-bold text-white mb-2">
              La <span className="text-gradient-gold">Cuponera</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Los mejores descuentos de El Salvador en un solo lugar
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {DESCUENTOS_DEMO.map(({ emoji, texto }) => (
              <div key={texto}
                   className="flex items-center gap-3 px-4 py-3 rounded-xl
                              bg-white/5 border border-white/8 backdrop-blur-sm">
                <span className="text-lg">{emoji}</span>
                <span className="text-sm text-white/70">{texto}</span>
                <span className="ml-auto text-[#C9A84C]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 sm:px-12 py-12"
           style={{ background: "linear-gradient(180deg, #0A1628 0%, #060E1A 100%)" }}>
        <div className="w-full max-w-md animate-fade-in-up">

          <div className="lg:hidden text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A8873A]
                            flex items-center justify-center text-[#060E1A] font-black text-2xl
                            mx-auto mb-4 shadow-[0_6px_24px_rgba(201,168,76,0.4)]">
              C
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">
              La <span className="text-gradient-gold">Cuponera</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-white mb-2">
              Bienvenido de vuelta
            </h2>
            <p className="text-white/45 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          {serverError && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl
                            bg-red-500/10 border border-red-500/25 text-red-400 text-sm
                            animate-fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>

            <FieldWrapper
              label="Correo electrónico"
              error={emailError}
              success={!emailError && touched.email && email ? "Correo válido" : ""}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <IconMail />
                </span>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  className={inputClass("email")}
                  autoComplete="email"
                />
              </div>
            </FieldWrapper>

            <FieldWrapper
              label="Contraseña"
              error={passwordError}
              success={!passwordError && touched.password && password ? "Contraseña válida" : ""}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <IconLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  className={`${inputClass("password")} pr-12`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </FieldWrapper>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[#060E1A]/30 border-t-[#060E1A] animate-spin" />
                  Ingresando...
                </span>
              ) : "Ingresar"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/40">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-[#C9A84C] font-semibold hover:text-[#E2C36A] transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/6 text-center">
            <p className="text-xs text-white/25">
              Al continuar aceptas nuestros{" "}
              <Link to="/terminos" className="text-white/40 hover:text-[#C9A84C] transition-colors">Términos</Link>
              {" "}y{" "}
              <Link to="/privacidad" className="text-white/40 hover:text-[#C9A84C] transition-colors">Privacidad</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
