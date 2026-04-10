import { useState, useEffect, useMemo } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import CompraForm from "./CompraForm"
import { SkeletonGrid } from "./ui/SkeletonCard"

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
]

const ICONOS_RUBRO = {
  "Restaurantes": "🍽️",
  "Entretenimiento": "🎬",
  "Belleza": "💇",
  "Salud": "🏥",
  "Viajes": "✈️",
  "Tecnología": "💻",
  "Moda": "👗",
  "Deportes": "🏋️",
  "Educación": "📚",
}

function imagenParaOferta(oferta) {
  if (oferta.imagenUrl) return oferta.imagenUrl
  let h = 0
  const id = oferta.id || ""
  for (let i = 0; i < id.length; i++) h += id.charCodeAt(i)
  return FALLBACK_IMAGES[h % FALLBACK_IMAGES.length]
}

function calcularDescuento(regular, oferta) {
  if (!regular || regular === 0) return 0
  return Math.round(((regular - oferta) / regular) * 100)
}

function formatFecha(fecha) {
  if (!fecha) return "—"
  const d = fecha?.toDate ? fecha.toDate() : new Date(fecha)
  return d.toLocaleDateString("es-SV", { day: "2-digit", month: "short", year: "numeric" })
}

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)
const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconTicket = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)

function TarjetaOferta({ oferta, imagenSrc, descuento, user, onComprar }) {
  const [hovered, setHovered] = useState(false)
  const cuponesDisponibles = oferta.cantidadLimite != null
    ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0)
    : null

  const porcentajeStock = cuponesDisponibles !== null && oferta.cantidadLimite
    ? (cuponesDisponibles / oferta.cantidadLimite) * 100
    : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card-premium flex flex-col rounded-2xl overflow-hidden group"
      style={{ animationFillMode: "both" }}
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={imagenSrc}
          alt={oferta.titulo}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060E1A] via-[#060E1A]/30 to-transparent" />

        {descuento > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black
                          bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-[#060E1A]
                          shadow-[0_2px_12px_rgba(201,168,76,0.5)]">
            -{descuento}%
          </div>
        )}

        {oferta.rubro && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium
                          bg-[rgba(10,22,40,0.8)] backdrop-blur-sm border border-white/10 text-white/70">
            {ICONOS_RUBRO[oferta.rubro] || "🏷️"} {oferta.rubro}
          </div>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
          {oferta.nombreEmpresa || "Empresa"}
        </span>

        <h3 className="font-heading text-lg font-bold text-white leading-snug line-clamp-2">
          {oferta.titulo}
        </h3>

        <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
          {oferta.descripcion}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-white/35 line-through text-sm">
            ${Number(oferta.precioRegular).toFixed(2)}
          </span>
          <span className="font-heading text-3xl font-bold text-gradient-gold">
            ${Number(oferta.precioOferta).toFixed(2)}
          </span>
        </div>

        {porcentajeStock !== null && (
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span className="flex items-center gap-1"><IconTicket /> {cuponesDisponibles} disponibles</span>
              <span>{Math.round(porcentajeStock)}% restante</span>
            </div>
            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${porcentajeStock}%`,
                  background: porcentajeStock > 50 ? "#22c55e" : porcentajeStock > 20 ? "#C9A84C" : "#ef4444"
                }}
              />
            </div>
          </div>
        )}

        <div className="border-t border-white/6 pt-3 flex flex-col gap-1.5 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <IconCalendar />
            Vigente hasta: <strong className="text-white/60">{formatFecha(oferta.fechaFin)}</strong>
          </span>
          {oferta.fechaLimiteCupon && (
            <span className="flex items-center gap-1.5">
              <IconTag />
              Canjear antes de: <strong className="text-white/60">{formatFecha(oferta.fechaLimiteCupon)}</strong>
            </span>
          )}
        </div>

        {user ? (
          <button
            onClick={onComprar}
            className="btn-gold w-full mt-auto py-3"
          >
            Comprar cupón
          </button>
        ) : (
          <div className="mt-auto flex flex-col gap-2">
            <p className="text-center text-xs text-white/40 bg-white/4 border border-white/8 rounded-xl px-3 py-2">
              Inicia sesión para comprar este cupón
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login"
                    className="btn-gold text-sm py-2.5 text-center">
                Entrar
              </Link>
              <Link to="/registro"
                    className="btn-outline text-sm py-2.5 text-center">
                Registro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MostrarOfertas() {
  const { user } = useAuth()
  const [ofertasPorRubro, setOfertasPorRubro] = useState({})
  const [rubroActivo, setRubroActivo] = useState(null)
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => { cargarOfertas() }, [])

  async function cargarOfertas() {
    try {
      setLoading(true)
      const q = query(collection(db, "ofertas"), where("estado", "==", "aprobada"))
      const snapshot = await getDocs(q)
      const agrupadas = {}
      const hoy = new Date()

      snapshot.forEach((docSnap) => {
        const oferta = { id: docSnap.id, ...docSnap.data() }
        const inicio = oferta.fechaInicio?.toDate ? oferta.fechaInicio.toDate() : new Date(oferta.fechaInicio)
        const fin    = oferta.fechaFin?.toDate    ? oferta.fechaFin.toDate()    : new Date(oferta.fechaFin)
        if (inicio > hoy || fin < hoy) return
        if (oferta.cantidadLimite != null && (oferta.cuponesVendidos || 0) >= oferta.cantidadLimite) return
        const rubro = oferta.rubro || "Sin categoría"
        if (!agrupadas[rubro]) agrupadas[rubro] = []
        agrupadas[rubro].push({ ...oferta, fechaInicio: inicio, fechaFin: fin })
      })

      setOfertasPorRubro(agrupadas)
      const rubros = Object.keys(agrupadas)
      if (rubros.length > 0) setRubroActivo(rubros[0])
    } catch {
      setError("No se pudieron cargar las ofertas.")
    } finally {
      setLoading(false)
    }
  }

  const rubros = Object.keys(ofertasPorRubro)
  const sinOfertas = rubros.length === 0

  const ofertasFiltradas = useMemo(() => {
    if (!rubroActivo || !ofertasPorRubro[rubroActivo]) return []
    const q = busqueda.toLowerCase().trim()
    if (!q) return ofertasPorRubro[rubroActivo]
    return ofertasPorRubro[rubroActivo].filter(o =>
      o.titulo?.toLowerCase().includes(q) ||
      o.descripcion?.toLowerCase().includes(q) ||
      o.nombreEmpresa?.toLowerCase().includes(q)
    )
  }, [rubroActivo, ofertasPorRubro, busqueda])

  const totalOfertas = rubros.reduce((acc, r) => acc + ofertasPorRubro[r].length, 0)

  if (loading) {
    return (
      <div className="page-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-52 rounded-2xl mb-10" />
          <div className="flex gap-3 mb-10">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-9 w-24 rounded-lg" />)}
          </div>
          <SkeletonGrid count={6} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-white/60 text-lg">{error}</p>
          <button onClick={cargarOfertas} className="btn-gold mt-6">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <section className="relative rounded-2xl overflow-hidden mb-10 min-h-[220px] sm:min-h-[260px] flex items-stretch border border-gold/10 shadow-card animate-fade-in">
          <img
            src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1600&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0"
               style={{ background: "linear-gradient(110deg, rgba(6,14,26,0.97) 0%, rgba(10,22,40,0.85) 50%, rgba(0,180,216,0.08) 100%)" }} />
          <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-20"
               style={{ background: "radial-gradient(ellipse at right, #C9A84C, transparent 70%)" }} />
          <div className="relative z-10 px-8 sm:px-12 py-10 max-w-2xl flex flex-col justify-center gap-4">
            <span className="badge-gold w-fit">Ofertas activas</span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight">
              Ofertas para <span className="text-gradient-gold">todos</span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed">
              Explora {totalOfertas} cupones vigentes.{" "}
              <span className="text-[#00B4D8] font-medium">
                Solo necesitas cuenta al momento de comprar.
              </span>
            </p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8 animate-fade-in">
          <h2 className="font-heading text-2xl font-bold text-white">
            Ofertas por rubro
          </h2>
          <div className="relative w-full sm:w-72">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar oferta o empresa..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="input-premium pl-11 pr-10 py-2.5 text-sm"
            />
            {busqueda && (
              <button onClick={() => setBusqueda("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <IconX />
              </button>
            )}
          </div>
        </div>

        {sinOfertas ? (
          <div className="max-w-xl mx-auto rounded-2xl border border-white/8 bg-white/4 p-10 text-center animate-fade-in">
            <div className="text-5xl mb-4">🎫</div>
            <p className="text-white/70 text-lg font-semibold mb-2">Sin ofertas disponibles</p>
            <p className="text-white/40 text-sm leading-relaxed">
              No hay cupones aprobados en este momento. Vuelve pronto.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
              {rubros.map(rubro => (
                <button
                  key={rubro}
                  onClick={() => { setRubroActivo(rubro); setBusqueda("") }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                              transition-all duration-200 border ${
                    rubroActivo === rubro
                      ? "bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-[#060E1A] border-transparent shadow-gold"
                      : "bg-white/4 text-white/55 border-white/8 hover:bg-white/8 hover:text-white hover:border-white/15"
                  }`}
                >
                  <span>{ICONOS_RUBRO[rubro] || "🏷️"}</span>
                  {rubro}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    rubroActivo === rubro ? "bg-[#060E1A]/20 text-[#060E1A]/70" : "bg-white/8 text-white/40"
                  }`}>
                    {ofertasPorRubro[rubro].length}
                  </span>
                </button>
              ))}
            </div>

            {busqueda && (
              <p className="text-sm text-white/40 mb-6">
                {ofertasFiltradas.length} resultado{ofertasFiltradas.length !== 1 ? "s" : ""} para
                {" "}<span className="text-[#C9A84C]">"{busqueda}"</span>
              </p>
            )}

            {ofertasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ofertasFiltradas.map((oferta, idx) => (
                  <div key={oferta.id} className="animate-fade-in-up"
                       style={{ animationDelay: `${idx * 60}ms` }}>
                    <TarjetaOferta
                      oferta={oferta}
                      imagenSrc={imagenParaOferta(oferta)}
                      descuento={calcularDescuento(oferta.precioRegular, oferta.precioOferta)}
                      user={user}
                      onComprar={() => setOfertaSeleccionada(oferta)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center animate-fade-in">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white/50">No hay resultados para "{busqueda}"</p>
                <button onClick={() => setBusqueda("")} className="btn-outline text-sm mt-4 py-2 px-5">
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {ofertaSeleccionada && user && (
        <CompraForm
          oferta={ofertaSeleccionada}
          formatFecha={formatFecha}
          onClose={() => setOfertaSeleccionada(null)}
        />
      )}
    </div>
  )
}
