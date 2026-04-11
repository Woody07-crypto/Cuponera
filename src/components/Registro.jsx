import { useState } from "react"
import { auth, db } from "../firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, writeBatch } from "firebase/firestore"
import { ROLES } from "../services/perfilService"
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)
const IcArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IcShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const VALIDACIONES = {
  nombres:   v => !v ? "Requerido" : v.length < 2 ? "Mínimo 2 caracteres" : /[<>{}]/.test(v) ? "Caracteres no permitidos" : "",
  apellidos: v => !v ? "Requerido" : v.length < 2 ? "Mínimo 2 caracteres" : /[<>{}]/.test(v) ? "Caracteres no permitidos" : "",
  telefono:  v => !v ? "Requerido" : !/^\d{8,}$/.test(v.replace(/\D/g,"")) ? "Mínimo 8 dígitos" : "",
  dui:       v => !v ? "Requerido" : v.length !== 10 ? "Formato: 00000000-0" : "",
  correo:    v => !v ? "Requerido" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Correo inválido" : "",
  direccion: v => !v ? "Requerido" : v.length < 5 ? "Mínimo 5 caracteres" : "",
  password:  v => !v ? "Requerido" : v.length < 8 ? "Mínimo 8 caracteres" : !/[A-Z]/.test(v) ? "Falta 1 mayúscula" : !/[0-9]/.test(v) ? "Falta 1 número" : "",
  confirmar: (v, form) => !v ? "Requerido" : v !== form.password ? "No coinciden" : "",
}

function Field({ label, error, touched, value, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">{label}</label>
      {children}
      {touched && error   && <span className="field-error"><IcAlert />{error}</span>}
      {touched && !error && value && <span className="field-ok"><IcCheck />Correcto</span>}
    </div>
  )
}

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { ok: password.length >= 8,    text: "8+ caracteres" },
    { ok: /[A-Z]/.test(password),  text: "Mayúscula" },
    { ok: /[0-9]/.test(password),  text: "Número" },
    { ok: /[^A-Za-z0-9]/.test(password), text: "Símbolo" },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ["#EF4444","#F59E0B","#F59E0B","#10B981","#10B981"]
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1.5">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
               style={{ background: i < score ? colors[score] : "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map(c => (
          <span key={c.text} className="text-xs flex items-center gap-1"
                style={{ color: c.ok ? "#34D399" : "rgba(248,250,252,0.25)" }}>
            {c.ok ? <IcCheck /> : "·"} {c.text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombres:"", apellidos:"", telefono:"",
    correo:"", direccion:"", dui:"", password:"", confirmar:""
  })
  const [touched,      setTouched]      = useState({})
  const [showPw,       setShowPw]       = useState(false)
  const [showConfirmar,setShowConfirmar]= useState(false)
  const [srvErr,       setSrvErr]       = useState("")
  const [loading,      setLoading]      = useState(false)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const onBlur   = e => setTouched(t => ({ ...t, [e.target.name]: true }))

  const onDuiChange = e => {
    let v = e.target.value.replace(/\D/g,"").slice(0,9)
    if (v.length > 8) v = v.slice(0,8) + "-" + v.slice(8)
    setForm(f => ({ ...f, dui: v }))
  }

  const getErr = field =>
    field === "confirmar" ? VALIDACIONES.confirmar(form.confirmar, form) : (VALIDACIONES[field]?.(form[field]) ?? "")

  const cls = (field, extra = "") => {
    const err   = getErr(field)
    const touch = touched[field]
    const val   = form[field]
    return `input-field ${extra} ${touch && err ? "invalid" : ""} ${touch && !err && val ? "valid" : ""}`
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const allTouched = Object.keys(form).reduce((a,k) => ({...a,[k]:true}), {})
    setTouched(allTouched)
    if (Object.keys(form).some(k => getErr(k))) return
    setSrvErr("")
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.correo, form.password)
      const uid = cred.user.uid
      const batch = writeBatch(db)
      batch.set(doc(db, "clientes", uid), {
        nombres: form.nombres, apellidos: form.apellidos,
        telefono: form.telefono, correo: form.correo,
        direccion: form.direccion, dui: form.dui,
      })
      batch.set(doc(db, "perfiles", uid), {
        role: ROLES.CLIENTE,
        correo: form.correo,
        nombres: form.nombres,
        apellidos: form.apellidos,
      })
      await batch.commit()
      navigate("/comprar")
    } catch (err) {
      setSrvErr(err.code === "auth/email-already-in-use" ? "Este correo ya está registrado." : "Error al registrarse. Intenta de nuevo.")
    } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">

      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-center px-12 py-14 overflow-hidden"
           style={{ background: "linear-gradient(160deg, #0E1117 0%, #07090F 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-15"
               style={{ background: "radial-gradient(circle, #7C3AED, transparent 70%)", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-12"
               style={{ background: "radial-gradient(circle, #06B6D4, transparent 70%)", transform: "translate(-30%,30%)" }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <IcTicket />
            </div>
            <span className="font-heading font-bold text-lg text-white">La <span className="text-grad">Cuponera</span></span>
          </div>

          <h2 className="font-heading text-4xl font-bold text-white mb-4 leading-tight">
            Únete y empieza<br />
            <span className="text-grad">a ahorrar hoy</span>
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-10">
            Crea tu cuenta gratis en segundos y accede a cientos de descuentos exclusivos.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: "🎫", title: "Cupones únicos",        desc: "Cada cupón tiene un código exclusivo para ti" },
              { icon: "📥", title: "Descarga en PDF",       desc: "Guarda y presenta tus cupones offline" },
              { icon: "🔄", title: "Historial completo",    desc: "Revisa todas tus compras en un solo lugar" },
              { icon: "🔔", title: "Ofertas personalizadas",desc: "Recibe alertas de descuentos para ti" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3.5 p-4 rounded-2xl"
                   style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white/80">{item.title}</p>
                  <p className="text-xs text-white/35 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 sm:px-12 py-12 overflow-y-auto"
           style={{ background: "linear-gradient(180deg, #0A0C14 0%, #07090F 100%)" }}>
        <div className="w-full max-w-xl animate-fade-in-up">

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
              <IcTicket />
            </div>
            <span className="font-heading font-bold text-base text-white">La <span className="text-grad">Cuponera</span></span>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Crear cuenta</h1>
            <p className="text-sm text-white/40">Completa el formulario para registrarte gratis</p>
          </div>

          {srvErr && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm animate-fade-in"
                 style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#F87171" }}>
              <IcAlert />{srvErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombres" error={getErr("nombres")} touched={touched.nombres} value={form.nombres}>
                <input name="nombres" type="text" placeholder="Juan Carlos"
                       value={form.nombres} onChange={onChange} onBlur={onBlur}
                       className={cls("nombres")} />
              </Field>
              <Field label="Apellidos" error={getErr("apellidos")} touched={touched.apellidos} value={form.apellidos}>
                <input name="apellidos" type="text" placeholder="Pérez Ramos"
                       value={form.apellidos} onChange={onChange} onBlur={onBlur}
                       className={cls("apellidos")} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Teléfono" error={getErr("telefono")} touched={touched.telefono} value={form.telefono}>
                <input name="telefono" type="tel" placeholder="77778888"
                       value={form.telefono} onChange={onChange} onBlur={onBlur}
                       className={cls("telefono")} />
              </Field>
              <Field label="DUI" error={getErr("dui")} touched={touched.dui} value={form.dui}>
                <input name="dui" type="text" placeholder="01234567-8"
                       value={form.dui}
                       onChange={e => { onDuiChange(e); setTouched(t => ({...t, dui: true})) }}
                       onBlur={onBlur} maxLength={10} className={cls("dui")} />
              </Field>
            </div>

            <Field label="Correo electrónico" error={getErr("correo")} touched={touched.correo} value={form.correo}>
              <input name="correo" type="email" placeholder="tu@correo.com"
                     value={form.correo} onChange={onChange} onBlur={onBlur}
                     className={cls("correo")} autoComplete="email" />
            </Field>

            <Field label="Dirección" error={getErr("direccion")} touched={touched.direccion} value={form.direccion}>
              <input name="direccion" type="text" placeholder="Col. Escalón, San Salvador"
                     value={form.direccion} onChange={onChange} onBlur={onBlur}
                     className={cls("direccion")} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Contraseña" error={getErr("password")} touched={touched.password} value={form.password}>
                <div className="relative">
                  <input name="password" type={showPw ? "text" : "password"} placeholder="••••••••"
                         value={form.password} onChange={onChange} onBlur={onBlur}
                         className={cls("password","pr-12")} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                    {showPw ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
                {touched.password && <PasswordStrength password={form.password} />}
              </Field>
              <Field label="Confirmar contraseña" error={getErr("confirmar")} touched={touched.confirmar} value={form.confirmar}>
                <div className="relative">
                  <input name="confirmar" type={showConfirmar ? "text" : "password"} placeholder="••••••••"
                         value={form.confirmar} onChange={onChange} onBlur={onBlur}
                         className={cls("confirmar","pr-12")} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirmar(v => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                    {showConfirmar ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
              </Field>
            </div>

            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs text-white/35"
                 style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <IcShield className="shrink-0 mt-0.5" style={{ color:"#22D3EE" }} />
              <span>Tu información está protegida con cifrado SSL de extremo a extremo.</span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin-slow" />
                  Creando cuenta…
                </span>
              ) : (
                <span className="flex items-center gap-2">Crear cuenta gratis <IcArrow /></span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/35">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
          <p className="mt-5 text-center text-xs text-white/20">
            Al registrarte aceptas nuestros{" "}
            <Link to="/terminos"   className="text-white/35 hover:text-purple-400 transition-colors">Términos</Link>
            {" "}y{" "}
            <Link to="/privacidad" className="text-white/35 hover:text-purple-400 transition-colors">Privacidad</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
