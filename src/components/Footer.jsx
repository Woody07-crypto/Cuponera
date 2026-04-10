import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const IcInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IcTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
)
const IcFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)
const IcMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IcPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .13h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.14-1.14a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const IcPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IcTicket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)
const IcArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

function SocialBtn({ href, icon, label }) {
  return (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
       className="w-9 h-9 rounded-xl border border-white/8 flex items-center justify-center
                  text-white/35 hover:text-white hover:border-purple-500/40
                  hover:bg-purple-500/10 transition-all duration-200">
      {icon}
    </a>
  )
}

function FLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-1 group">
      <span className="text-purple-500/0 group-hover:text-purple-400 transition-colors duration-200 text-xs">›</span>
      {children}
    </Link>
  )
}

export default function Footer() {
  const { user } = useAuth()
  const year = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = e => {
    e.preventDefault()
    if (email.trim()) { setSubscribed(true); setEmail("") }
  }

  return (
    <footer className="relative" style={{ background:"#07090F", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      <div className="absolute inset-x-0 top-0 h-px"
           style={{ background:"linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.3), transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <Link to="/comprar" className="flex items-center gap-2.5 mb-5 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background:"linear-gradient(135deg,#7C3AED,#06B6D4)" }}>
                <IcTicket />
              </div>
              <span className="font-heading font-bold text-base text-white">
                La <span className="text-grad">Cuponera</span>
              </span>
            </Link>
            <p className="text-sm text-white/35 leading-relaxed mb-6">
              La plataforma de descuentos más completa de El Salvador. Ahorra en restaurantes, servicios y más.
            </p>
            <div className="flex gap-2">
              <SocialBtn href="#" icon={<IcInstagram />} label="Instagram" />
              <SocialBtn href="#" icon={<IcTwitter  />} label="Twitter"   />
              <SocialBtn href="#" icon={<IcFacebook />} label="Facebook"  />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">Plataforma</h3>
            <ul className="flex flex-col gap-3">
              <li><FLink to="/comprar">Explorar ofertas</FLink></li>
              {user ? (
                <li><FLink to="/mis-cupones">Mis cupones</FLink></li>
              ) : (
                <>
                  <li><FLink to="/login">Iniciar sesión</FLink></li>
                  <li><FLink to="/registro">Crear cuenta</FLink></li>
                </>
              )}
              <li><FLink to="/terminos">Términos</FLink></li>
              <li><FLink to="/privacidad">Privacidad</FLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">Contacto</h3>
            <ul className="flex flex-col gap-3.5">
              {[
                { icon: <IcMail />, text: "soporte@lacuponera.com" },
                { icon: <IcPhone />, text: "+503 7000-0000" },
                { icon: <IcPin />, text: "San Salvador, El Salvador" },
              ].map(item => (
                <li key={item.text} className="flex items-center gap-2.5 text-sm text-white/40">
                  <span style={{ color:"#7C3AED" }}>{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">Newsletter</h3>
            <p className="text-sm text-white/35 mb-4 leading-relaxed">
              Recibe las mejores ofertas directamente en tu correo.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm py-3 px-4 rounded-xl"
                   style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", color:"#34D399" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                ¡Suscrito correctamente!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                       placeholder="tu@email.com" required
                       className="input-field rounded-r-none text-sm py-2.5 border-r-0" />
                <button type="submit"
                        className="px-4 py-2.5 rounded-r-xl text-sm font-semibold text-white shrink-0 flex items-center"
                        style={{ background:"linear-gradient(135deg,#7C3AED,#06B6D4)", boxShadow:"0 2px 12px rgba(124,58,237,0.3)" }}>
                  <IcArrow />
                </button>
              </form>
            )}
            {user && (
              <p className="mt-2.5 text-xs text-white/20 truncate">{user.email}</p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
             style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs text-white/20">
            © {year} La Cuponera · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-1 text-xs text-white/20">
            <span>Hecho con</span>
            <span style={{ color:"#EC4899" }}>♥</span>
            <span>en El Salvador</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
