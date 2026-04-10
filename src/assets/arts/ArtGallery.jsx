import { useState } from "react"
import ConcertPoster  from "./ConcertPoster"
import FoodPromo      from "./FoodPromo"
import BeautyAd       from "./BeautyAd"
import ShoppingBanner from "./ShoppingBanner"
import SportsAd       from "./SportsAd"
import HeroBanner     from "./HeroBanner"

const ARTS = [
  { id:"hero",     label:"Hero Banner",         component: HeroBanner,     tag:"Principal" },
  { id:"concert",  label:"Conciertos & Eventos", component: ConcertPoster,  tag:"Entretenimiento" },
  { id:"food",     label:"Promo Restaurantes",   component: FoodPromo,      tag:"Gastronomía" },
  { id:"beauty",   label:"Belleza & Cuidado",    component: BeautyAd,       tag:"Belleza" },
  { id:"shopping", label:"Shopping Festival",    component: ShoppingBanner, tag:"Compras" },
  { id:"sports",   label:"Deportes & Fitness",   component: SportsAd,       tag:"Deportes" },
]

const IcChevronL = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)
const IcChevronR = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)
const IcExpand = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
  </svg>
)

export default function ArtGallery() {
  const [active,   setActive]   = useState(0)
  const [expanded, setExpanded] = useState(false)

  const prev = () => setActive(a => (a - 1 + ARTS.length) % ARTS.length)
  const next = () => setActive(a => (a + 1) % ARTS.length)

  const Art = ARTS[active].component

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-white">{ARTS[active].label}</h3>
          <span className="badge badge-purple text-xs">{ARTS[active].tag}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(v => !v)}
                  className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
            <IcExpand /> {expanded ? "Reducir" : "Expandir"}
          </button>
          <button onClick={prev}
                  className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center
                             text-white/50 hover:text-white hover:border-white/20 transition-all">
            <IcChevronL />
          </button>
          <span className="text-xs text-white/30 tabular-nums">{active+1}/{ARTS.length}</span>
          <button onClick={next}
                  className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center
                             text-white/50 hover:text-white hover:border-white/20 transition-all">
            <IcChevronR />
          </button>
        </div>
      </div>

      <div className={`w-full rounded-2xl overflow-hidden border border-white/8 transition-all duration-500 ${
        expanded ? "h-[500px]" : "h-56 sm:h-72"
      }`}>
        <Art width="100%" height="100%" />
      </div>

      <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
        {ARTS.map((art, i) => (
          <button key={art.id} onClick={() => setActive(i)}
                  className={`shrink-0 w-16 h-10 rounded-lg overflow-hidden border transition-all duration-200 ${
                    i === active ? "border-purple-500 scale-105" : "border-white/8 opacity-50 hover:opacity-80"
                  }`}>
            <art.component width="100%" height="100%" />
          </button>
        ))}
      </div>
    </div>
  )
}
