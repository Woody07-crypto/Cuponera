import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Footer() {
  const { user } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[#121a14]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* GRID */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <h2 className="text-xl font-extrabold text-[#9bbf7a]">
              La Cuponera
            </h2>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Plataforma digital que conecta clientes con descuentos exclusivos
              en restaurantes, entretenimiento y servicios en El Salvador.
            </p>

            {/* Redes (sin librerías) */}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/60">
              <a href="#" className="hover:text-[#9bbf7a] transition">📸 Instagram</a>
              <a href="#" className="hover:text-[#9bbf7a] transition">📘 Facebook</a>
              <a href="#" className="hover:text-[#9bbf7a] transition">💼 LinkedIn</a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Navegación</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><FooterLink to="/comprar">Comprar cupones</FooterLink></li>
              {user && <li><FooterLink to="/mis-cupones">Mis cupones</FooterLink></li>}
              {!user && (
                <>
                  <li><FooterLink to="/login">Iniciar sesión</FooterLink></li>
                  <li><FooterLink to="/registro">Registrarse</FooterLink></li>
                </>
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Contacto</h3>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">✉️ soporte@lacuponera.com</div>
              <div className="flex items-center gap-2">📞 +503 7000-0000</div>
              <div className="flex items-center gap-2">📍 San Salvador, El Salvador</div>
            </div>
          </div>

          {/* Newsletter (visual, sin backend) */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Suscríbete</h3>
            <p className="text-sm text-white/60 mb-4">
              Recibe descuentos exclusivos directamente en tu correo.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-3 py-2 rounded-l-lg bg-white/10 border border-white/10 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#9bbf7a]"
              />
              <button
                type="button"
                onClick={() => alert("¡Gracias! (demo)")}
                className="px-4 py-2 bg-[#709756] hover:bg-[#5c7d46] text-white text-sm rounded-r-lg transition"
              >
                Enviar
              </button>
            </div>

            {user && (
              <p className="mt-3 text-xs text-white/40">
                Sesión activa: <span className="text-white/60 break-all">{user.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/50">
          <p>© {year} La Cuponera. Todos los derechos reservados.</p>

          <div className="flex gap-6">
            {/* Si no tienen estas rutas, puedes cambiarlas por href="#" */}
            <Link to="/terminos" className="hover:text-[#9bbf7a] transition">
              Términos
            </Link>
            <Link to="/privacidad" className="hover:text-[#9bbf7a] transition">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="hover:text-[#9bbf7a] transition">
      {children}
    </Link>
  )
}