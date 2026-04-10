import { useState } from "react"
import { auth, db } from "../firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
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

const BENEFICIOS = [
  "Acceso a ofertas exclusivas",
  "Cupones con código único",
  "Descarga tu cupón en PDF",
  "Historial de compras",
]

const VALIDACIONES = {
  nombres:   v => !v ? "Campo requerido" : v.length < 2 ? "Mínimo 2 caracteres" : /[<>{}]/.test(v) ? "Caracteres no permitidos" : "",
  apellidos: v => !v ? "Campo requerido" : v.length < 2 ? "Mínimo 2 caracteres" : /[<>{}]/.test(v) ? "Caracteres no permitidos" : "",
  telefono:  v => !v ? "Campo requerido" : !/^\d{8,}$/.test(v.replace(/\D/g, "")) ? "Mínimo 8 dígitos" : "",
  dui:       v => !v ? "Campo requerido" : v.length !== 10 ? "Formato: 00000000-0" : "",
  correo:    v => !v ? "Campo requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Correo inválido" : "",
  direccion: v => !v ? "Campo requerido" : v.length < 5 ? "Mínimo 5 caracteres" : "",
  password:  v => !v ? "Campo requerido" : v.length < 8 ? "Mínimo 8 caracteres" : !/[A-Z]/.test(v) ? "Incluir al menos 1 mayúscula" : !/[0-9]/.test(v) ? "Incluir al menos 1 número" : "",
  confirmar: (v, form) => !v ? "Campo requerido" : v !== form.password ? "Las contraseñas no coinciden" : "",
}

function FieldWrapper({ label, error, touched, value, children }) {
  const showError   = touched && error
  const showSuccess = touched && !error && value
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label-premium">{label}</label>
      {children}
      {showError && (
        <span className="field-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
      {showSuccess && (
        <span className="field-success">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          Correcto
        </span>
      )}
    </div>
  )
}

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombres: "", apellidos: "", telefono: "",
    correo: "", direccion: "", dui: "", password: "", confirmar: ""
  })
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleBlur   = (e) => setTouched(t => ({ ...t, [e.target.name]: true }))

  const handleDuiChange = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 9)
    if (v.length > 8) v = v.slice(0, 8) + "-" + v.slice(8)
    setForm(f => ({ ...f, dui: v }))
  }

  const getError = (field) => {
    if (field === "confirmar") return VALIDACIONES.confirmar(form.confirmar, form)
    return VALIDACIONES[field]?.(form[field]) ?? ""
  }

  const inputClass = (field) => {
    const err  = getError(field)
    const touch = touched[field]
    const val  = form[field]
    return `input-premium ${touch && err ? "invalid" : ""} ${touch && !err && val ? "valid" : ""}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)
    const hasErrors = Object.keys(form).some(k => getError(k))
    if (hasErrors) return

    setServerError("")
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.correo, form.password)
      await setDoc(doc(db, "clientes", cred.user.uid), {
        nombres: form.nombres, apellidos: form.apellidos,
        telefono: form.telefono, correo: form.correo,
        direccion: form.direccion, dui: form.dui, role: "cliente"
      })
      navigate("/comprar")
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setServerError("Este correo ya está registrado.")
      else setServerError("Error al registrarse. Intenta de nuevo.")
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
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        <div className="relative z-10 w-full max-w-xs text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#A8873A]
                          flex items-center justify-center text-[#060E1A] font-black text-3xl
                          mx-auto mb-5 shadow-[0_8px_32px_rgba(201,168,76,0.4)]">
            C
          </div>
          <h2 className="font-heading text-3xl font-bold text-white mb-2">
            La <span className="text-gradient-gold">Cuponera</span>
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Únete y accede a cientos de descuentos exclusivos
          </p>
          <div className="flex flex-col gap-3 text-left">
            {BENEFICIOS.map(item => (
              <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl
                                         bg-white/5 border border-white/8">
                <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <span className="text-sm text-white/65">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 sm:px-12 py-12 overflow-y-auto"
           style={{ background: "linear-gradient(180deg, #0A1628 0%, #060E1A 100%)" }}>
        <div className="w-full max-w-xl animate-fade-in-up">

          <div className="lg:hidden text-center mb-8">
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
            <h2 className="font-heading text-3xl font-bold text-white mb-2">Crear cuenta</h2>
            <p className="text-white/45 text-sm">Completa el formulario para registrarte</p>
          </div>

          {serverError && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl
                            bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper label="Nombres" error={getError("nombres")} touched={touched.nombres} value={form.nombres}>
                <input name="nombres" type="text" placeholder="Juan Carlos"
                       value={form.nombres} onChange={handleChange} onBlur={handleBlur}
                       className={inputClass("nombres")} />
              </FieldWrapper>
              <FieldWrapper label="Apellidos" error={getError("apellidos")} touched={touched.apellidos} value={form.apellidos}>
                <input name="apellidos" type="text" placeholder="Pérez Ramos"
                       value={form.apellidos} onChange={handleChange} onBlur={handleBlur}
                       className={inputClass("apellidos")} />
              </FieldWrapper>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper label="Teléfono" error={getError("telefono")} touched={touched.telefono} value={form.telefono}>
                <input name="telefono" type="tel" placeholder="77778888"
                       value={form.telefono} onChange={handleChange} onBlur={handleBlur}
                       className={inputClass("telefono")} />
              </FieldWrapper>
              <FieldWrapper label="DUI" error={getError("dui")} touched={touched.dui} value={form.dui}>
                <input name="dui" type="text" placeholder="01234567-8"
                       value={form.dui} onChange={e => { handleDuiChange(e); handleBlur(e) }} onBlur={handleBlur}
                       maxLength={10} className={inputClass("dui")} />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Correo electrónico" error={getError("correo")} touched={touched.correo} value={form.correo}>
              <input name="correo" type="email" placeholder="tu@correo.com"
                     value={form.correo} onChange={handleChange} onBlur={handleBlur}
                     className={inputClass("correo")} autoComplete="email" />
            </FieldWrapper>

            <FieldWrapper label="Dirección" error={getError("direccion")} touched={touched.direccion} value={form.direccion}>
              <input name="direccion" type="text" placeholder="Col. Escalón, San Salvador"
                     value={form.direccion} onChange={handleChange} onBlur={handleBlur}
                     className={inputClass("direccion")} />
            </FieldWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWrapper label="Contraseña" error={getError("password")} touched={touched.password} value={form.password}>
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                         value={form.password} onChange={handleChange} onBlur={handleBlur}
                         className={`${inputClass("password")} pr-12`} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </FieldWrapper>
              <FieldWrapper label="Confirmar contraseña" error={getError("confirmar")} touched={touched.confirmar} value={form.confirmar}>
                <div className="relative">
                  <input name="confirmar" type={showConfirmar ? "text" : "password"} placeholder="••••••••"
                         value={form.confirmar} onChange={handleChange} onBlur={handleBlur}
                         className={`${inputClass("confirmar")} pr-12`} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirmar(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirmar ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </FieldWrapper>
            </div>

            <div className="text-xs text-white/35 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
              La contraseña debe tener mínimo <strong className="text-white/55">8 caracteres</strong>,
              {" "}<strong className="text-white/55">1 mayúscula</strong> y{" "}
              <strong className="text-white/55">1 número</strong>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 mt-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[#060E1A]/30 border-t-[#060E1A] animate-spin" />
                  Registrando...
                </span>
              ) : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-[#C9A84C] font-semibold hover:text-[#E2C36A] transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/6 text-center">
            <p className="text-xs text-white/25">
              Al registrarte aceptas nuestros{" "}
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
