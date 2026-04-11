import { useState, useEffect, useMemo } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import CompraForm from "./CompraForm"
import { SkeletonGrid } from "./ui/SkeletonCard"
import HeroBanner     from "../assets/arts/HeroBanner"
import ConcertPoster  from "../assets/arts/ConcertPoster"
import FoodPromo      from "../assets/arts/FoodPromo"
import BeautyAd       from "../assets/arts/BeautyAd"
import ShoppingBanner from "../assets/arts/ShoppingBanner"
import SportsAd       from "../assets/arts/SportsAd"

const RUBRO_ART = {
  "Entretenimiento": ConcertPoster,
  "Restaurantes":    FoodPromo,
  "Comida":          FoodPromo,
  "Belleza":         BeautyAd,
  "Compras":         ShoppingBanner,
  "Shopping":        ShoppingBanner,
  "Moda":            ShoppingBanner,
  "Deportes":        SportsAd,
  "Fitness":         SportsAd,
}

const LOCAL_IMAGES = {
  "Restaurantes":   "/images/restaurant.jpg",
  "Comida":         "/images/food.jpg",
  "Entretenimiento":"/images/entertainment.jpg",
  "Belleza":        "/images/beauty.jpg",
  "Deportes":       "/images/sports.jpg",
  "Compras":        "/images/shopping.jpg",
  "Shopping":       "/images/shopping.jpg",
}

const FALLBACK = [
  "/images/food.jpg",
  "/images/restaurant.jpg",
  "/images/shopping.jpg",
  "/images/entertainment.jpg",
  "/images/beauty.jpg",
]

const RUBRO_ICON = {
  "Restaurantes":"🍽️","Comida":"🍕","Entretenimiento":"🎬",
  "Belleza":"💇","Salud":"🏥","Viajes":"✈️",
  "Tecnología":"💻","Moda":"👗","Deportes":"🏋️","Educación":"📚",
}

const RUBRO_GRADIENT = {
  "Restaurantes": "from-orange-500/20 to-red-500/10",
  "Comida":       "from-yellow-500/20 to-orange-500/10",
  "Entretenimiento":"from-purple-500/20 to-pink-500/10",
  "Belleza":      "from-pink-500/20 to-rose-500/10",
  "Deportes":     "from-blue-500/20 to-cyan-500/10",
  "Viajes":       "from-cyan-500/20 to-teal-500/10",
}

function getImagen(oferta) {
  if (oferta.imagenUrl) return oferta.imagenUrl
  if (LOCAL_IMAGES[oferta.rubro]) return LOCAL_IMAGES[oferta.rubro]
  let h = 0
  for (let i = 0; i < (oferta.id || "").length; i++) h += oferta.id.charCodeAt(i)
  return FALLBACK[h % FALLBACK.length]
}

function calcularDescuento(regular, oferta) {
  if (!regular) return 0
  return Math.round(((regular - oferta) / regular) * 100)
}

function formatFecha(fecha) {
  if (!fecha) return "—"
  const d = fecha?.toDate ? fecha.toDate() : new Date(fecha)
  return d.toLocaleDateString("es-SV", { day:"2-digit", month:"short", year:"numeric" })
}

const IcSearch = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
)
const IcX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)
const IcCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IcUsers = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
)
const IcArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IcTag = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

function TarjetaOferta({ oferta, imagenSrc, descuento, user, onComprar }) {
  const [hovered, setHovered] = useState(false)
  const disponibles = oferta.cantidadLimite != null
    ? oferta.cantidadLimite - (oferta.cuponesVendidos || 0)
    : null
  const stockPct = disponibles !== null && oferta.cantidadLimite
    ? (disponibles / oferta.cantidadLimite) * 100
    : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card flex flex-col overflow-hidden group cursor-pointer"
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        {RUBRO_ART[oferta.rubro] ? (
          <div className={`w-full h-full transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"}`}>
            {(() => { const A = RUBRO_ART[oferta.rubro]; return <A width="100%" height="100%" /> })()}
          </div>
        ) : (
          <img
            src={imagenSrc}
            alt={oferta.titulo}
            onError={e => { e.target.src = "/images/food.jpg" }}
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
          />
        )}
        <div className="absolute inset-0"
             style={{ background: "linear-gradient(to top, rgba(7,9,15,0.95) 0%, rgba(7,9,15,0.3) 50%, transparent 100%)" }} />

        {descuento > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-black text-white"
               style={{ background:"linear-gradient(135deg,#7C3AED,#06B6D4)", boxShadow:"0 2px 12px rgba(124,58,237,0.5)" }}>
            -{descuento}%
          </div>
        )}

        {oferta.rubro && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white/70"
               style={{ background:"rgba(7,9,15,0.75)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.08)" }}>
            {RUBRO_ICON[oferta.rubro] || "🏷️"} {oferta.rubro}
          </div>
        )}

        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-bold uppercase tracking-widest"
                style={{ color:"#06B6D4" }}>
            {oferta.nombreEmpresa || "Empresa"}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-heading text-base font-bold text-white leading-snug line-clamp-2">
          {oferta.titulo}
        </h3>

        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{oferta.descripcion}</p>

        <div className="flex items-baseline gap-2.5">
          <span className="text-white/30 line-through text-xs">
            ${Number(oferta.precioRegular).toFixed(2)}
          </span>
          <span className="font-heading text-2xl font-bold text-grad">
            ${Number(oferta.precioOferta).toFixed(2)}
          </span>
        </div>

        {stockPct !== null && (
          <div>
            <div className="flex justify-between text-xs text-white/35 mb-1.5">
              <span className="flex items-center gap-1"><IcUsers /> {disponibles} disponibles</span>
              <span>{Math.round(stockPct)}% restante</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                   style={{
                     width: `${stockPct}%`,
                     background: stockPct > 50 ? "linear-gradient(90deg,#10B981,#059669)"
                               : stockPct > 20 ? "linear-gradient(90deg,#F59E0B,#D97706)"
                               :                 "linear-gradient(90deg,#EF4444,#DC2626)",
                   }} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5 pt-2 border-t text-xs text-white/30"
             style={{ borderColor:"rgba(255,255,255,0.06)" }}>
          <span className="flex items-center gap-1.5">
            <IcCalendar /> Válido hasta: <span className="text-white/50">{formatFecha(oferta.fechaFin)}</span>
          </span>
          {oferta.fechaLimiteCupon && (
            <span className="flex items-center gap-1.5">
              <IcTag /> Canjear antes: <span className="text-white/50">{formatFecha(oferta.fechaLimiteCupon)}</span>
            </span>
          )}
        </div>

        {user ? (
          <button onClick={onComprar} className="btn-primary w-full mt-auto py-2.5 text-sm">
            Comprar cupón <IcArrow />
          </button>
        ) : (
          <div className="mt-auto flex flex-col gap-2">
            <p className="text-center text-xs text-white/35 px-3 py-2 rounded-xl"
               style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              Necesitas cuenta para comprar
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login"    className="btn-primary text-sm py-2.5 text-center">Entrar</Link>
              <Link to="/registro" className="btn-ghost text-sm py-2.5 text-center">Registro</Link>
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
  const [rubroActivo,     setRubroActivo]     = useState(null)
  const [seleccionada,    setSeleccionada]    = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)
  const [busqueda,        setBusqueda]        = useState("")

  useEffect(() => { cargarOfertas() }, [])

  async function cargarOfertas() {
    try {
      setLoading(true)
      const q   = query(collection(db,"ofertas"), where("estado","==","aprobada"))
      const snap = await getDocs(q)
      const agruped = {}
      const hoy  = new Date()
      snap.forEach(docSnap => {
        const o = { id: docSnap.id, ...docSnap.data() }
        const ini = o.fechaInicio?.toDate ? o.fechaInicio.toDate() : new Date(o.fechaInicio)
        const fin = o.fechaFin?.toDate    ? o.fechaFin.toDate()    : new Date(o.fechaFin)
        if (ini > hoy || fin < hoy) return
        if (o.cantidadLimite != null && (o.cuponesVendidos||0) >= o.cantidadLimite) return
        const r = o.rubro || "Otros"
        if (!agruped[r]) agruped[r] = []
        agruped[r].push({ ...o, fechaInicio:ini, fechaFin:fin })
      })
      setOfertasPorRubro(agruped)
      const rubros = Object.keys(ofertasPorRubro).sort((a, b) => a.localeCompare(b))
      if (rubros.length) setRubroActivo(rubros[0])
    } catch { setError("No se pudieron cargar las ofertas.") }
    finally  { setLoading(false) }
  }

  const rubros = Object.keys(ofertasPorRubro)
  const total  = rubros.reduce((a,r) => a + ofertasPorRubro[r].length, 0)

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

  if (loading) {
    return (
      <div className="page-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-64 rounded-3xl mb-10" />
          <div className="flex gap-2 mb-8">{[1,2,3,4].map(i=><div key={i} className="skeleton h-9 w-28 rounded-xl"/>)}</div>
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
          <p className="text-white/50">{error}</p>
          <button onClick={cargarOfertas} className="btn-primary mt-6">Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <section className="relative rounded-3xl overflow-hidden mb-12 animate-fade-in"
                 style={{ border:"1px solid rgba(124,58,237,0.2)" }}>
          <HeroBanner width="100%" height="100%" />
        </section>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-white">
            {rubroActivo ? `${RUBRO_ICON[rubroActivo]||"🏷️"} ${rubroActivo}` : "Todas las categorías"}
          </h2>
          <div className="relative w-full sm:w-72">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"><IcSearch /></span>
            <input type="text" placeholder="Buscar oferta o empresa…"
                   value={busqueda} onChange={e => setBusqueda(e.target.value)}
                   className="input-field pl-11 pr-10 py-2.5 text-sm" />
            {busqueda && (
              <button onClick={() => setBusqueda("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors">
                <IcX />
              </button>
            )}
          </div>
        </div>

        {rubros.length === 0 ? (
          <div className="py-20 text-center rounded-3xl"
               style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-5xl mb-4">🎫</div>
            <p className="text-white/50 font-medium">Sin ofertas disponibles por ahora</p>
            <p className="text-white/25 text-sm mt-1">Vuelve pronto para ver nuevos descuentos</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              {rubros.map(rubro => (
                <button key={rubro}
                        onClick={() => { setRubroActivo(rubro); setBusqueda("") }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                    transition-all duration-200 border ${
                          rubroActivo === rubro
                            ? "text-white border-transparent"
                            : "text-white/45 border-white/8 hover:text-white/75 hover:border-white/15 hover:bg-white/4"
                        }`}
                        style={rubroActivo === rubro
                          ? { background:"linear-gradient(135deg,#7C3AED,#06B6D4)", boxShadow:"0 4px 20px rgba(124,58,237,0.35)" }
                          : {}}>
                  {RUBRO_ICON[rubro]||"🏷️"} {rubro}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    rubroActivo === rubro ? "bg-white/20 text-white" : "bg-white/6 text-white/35"
                  }`}>{ofertasPorRubro[rubro].length}</span>
                </button>
              ))}
            </div>

            {rubroActivo && RUBRO_ART[rubroActivo] && !busqueda && (() => {
              const ArtComp = RUBRO_ART[rubroActivo]
              return (
                <div className="mb-8 rounded-2xl overflow-hidden animate-fade-in"
                     style={{ border:"1px solid rgba(255,255,255,0.07)", height:"220px" }}>
                  <ArtComp width="100%" height="100%" />
                </div>
              )
            })()}

            {busqueda && (
              <p className="text-sm text-white/35 mb-5">
                {ofertasFiltradas.length} resultado{ofertasFiltradas.length!==1?"s":""} para
                {" "}<span style={{ color:"#A78BFA" }}>"{busqueda}"</span>
              </p>
            )}

            {ofertasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {ofertasFiltradas.map((oferta, idx) => (
                  <div key={oferta.id} className="animate-fade-in-up"
                       style={{ animationDelay:`${idx * 55}ms` }}>
                    <TarjetaOferta
                      oferta={oferta}
                      imagenSrc={getImagen(oferta)}
                      descuento={calcularDescuento(oferta.precioRegular, oferta.precioOferta)}
                      user={user}
                      onComprar={() => setSeleccionada(oferta)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center animate-fade-in">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-white/45">Sin resultados para "{busqueda}"</p>
                <button onClick={() => setBusqueda("")} className="btn-ghost text-sm mt-4 py-2 px-5">
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {seleccionada && user && (
        <CompraForm oferta={seleccionada} formatFecha={formatFecha} onClose={() => setSeleccionada(null)} />
      )}
    </div>
  )
}
