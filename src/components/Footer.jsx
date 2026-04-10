import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
)
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconPhone = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .13h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.14-1.14a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
)
const IconMapPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-white/50 hover:text-[#C9A84C] transition-colors duration-200 flex items-center gap-1.5"
    >
      <span className="text-[#C9A84C]/40 text-xs">›</span>
      {children}
    </Link>
  )
}

function SocialButton({ href, icon, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center
                 text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/40
                 transition-all duration-200 hover:bg-[rgba(201,168,76,0.08)]"
    >
      {icon}
    </a>
  )
}

export default function Footer() {
  const { user } = useAuth()
  const year = new Date().getFullYear()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <footer className="relative border-t border-white/6 bg-[#060E1A]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <div className="lg:col-span-1">
            <Link to="/comprar" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#A8873A]
                              flex items-center justify-center text-[#060E1A] font-black text-sm">
                C
              </div>
              <span className="font-heading font-bold text-base text-white">
                La <span className="text-gradient-gold">Cuponera</span>
              </span>
            </Link>
            <p className="text-sm text-white/45 leading-relaxed mb-5">
              Conectamos clientes con los mejores descuentos exclusivos en El Salvador.
            </p>
            <div className="flex gap-2">
              <SocialButton href="#" icon={<IconInstagram />} label="Instagram" />
              <SocialButton href="#" icon={<IconFacebook />} label="Facebook" />
              <SocialButton href="#" icon={<IconLinkedIn />} label="LinkedIn" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><FooterLink to="/comprar">Comprar cupones</FooterLink></li>
              {user ? (
                <li><FooterLink to="/mis-cupones">Mis cupones</FooterLink></li>
              ) : (
                <>
                  <li><FooterLink to="/login">Iniciar sesión</FooterLink></li>
                  <li><FooterLink to="/registro">Registrarse</FooterLink></li>
                </>
              )}
              <li><FooterLink to="/terminos">Términos y condiciones</FooterLink></li>
              <li><FooterLink to="/privacidad">Privacidad</FooterLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/50">
              <li className="flex items-center gap-2.5">
                <span className="text-[#C9A84C]"><IconMail /></span>
                soporte@lacuponera.com
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#C9A84C]"><IconPhone /></span>
                +503 7000-0000
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#C9A84C]"><IconMapPin /></span>
                San Salvador, El Salvador
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">
              Newsletter
            </h3>
            <p className="text-sm text-white/45 mb-4 leading-relaxed">
              Recibe ofertas exclusivas en tu correo.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-[#00B4D8]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                ¡Gracias por suscribirte!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-3 py-2.5 rounded-l-lg text-sm
                             bg-white/5 border border-white/10 border-r-0
                             text-white placeholder-white/30
                             focus:outline-none focus:border-[#C9A84C]/50
                             transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-[#C9A84C] to-[#A8873A]
                             text-[#060E1A] text-sm font-semibold rounded-r-lg
                             hover:from-[#E2C36A] hover:to-[#C9A84C] transition-all"
                >
                  →
                </button>
              </form>
            )}
            {user && (
              <p className="mt-3 text-xs text-white/25 truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/25">
            © {year} La Cuponera. Todos los derechos reservados.
          </p>
          <div className="flex gap-5 text-xs text-white/35">
            <Link to="/terminos" className="hover:text-[#C9A84C] transition-colors">Términos</Link>
            <Link to="/privacidad" className="hover:text-[#C9A84C] transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
