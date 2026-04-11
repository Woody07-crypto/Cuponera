import { useState } from 'react'
import CouponCard from './CouponCard'
import { useMisCupones } from '../hooks/useMisCupones'
import { SkeletonCouponGrid } from './ui/SkeletonCard'

const IcTicket = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/>
  </svg>
)
const IcCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)
const IcClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IcArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const TABS = [
  { key:"disponible", label:"Activos",   icon:<IcTicket />, dotClass:"glow-dot-green",  color:"#10B981" },
  { key:"canjeado",   label:"Canjeados", icon:<IcCheck  />, dotClass:"glow-dot-cyan",   color:"#06B6D4" },
  { key:"vencido",    label:"Vencidos",  icon:<IcClock  />, dotClass:"glow-dot-purple", color:"#EF4444" },
]

export default function CouponsDashboard() {
  const { cupones, loading } = useMisCupones()
  const [activeTab, setActiveTab] = useState('disponible')

  const conteos   = TABS.reduce((a,t) => ({ ...a, [t.key]: cupones.filter(c => c.estadoMostrar===t.key).length }), {})
  const filtrados  = cupones.filter(c => c.estadoMostrar === activeTab)
  const tabActual = TABS.find(t => t.key === activeTab)

  if (loading) {
    return (
      <div className="page-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-10 w-52 rounded-xl mb-3" />
          <div className="skeleton h-5 w-40 rounded mb-10" />
          <div className="flex gap-3 mb-10">
            {[1,2,3].map(i=><div key={i} className="skeleton h-11 w-32 rounded-xl"/>)}
          </div>
          <SkeletonCouponGrid count={3} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-4xl font-bold text-white">Mis Cupones</h1>
            <span className="badge badge-purple text-xs">
              {cupones.length} total{cupones.length!==1?"es":""}
            </span>
          </div>
          <p className="text-white/35 text-sm">Gestiona tus cupones activos, canjeados y vencidos</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-10 animate-fade-in">
          {TABS.map(tab => {
            const active = activeTab === tab.key
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium
                                  transition-all duration-200 border ${
                        active
                          ? "text-white border-transparent"
                          : "text-white/40 border-white/8 hover:text-white/65 hover:bg-white/4"
                      }`}
                      style={active
                        ? { background:"linear-gradient(135deg,#7C3AED,#06B6D4)", boxShadow:"0 4px 20px rgba(124,58,237,0.3)" }
                        : {}}>
                <span style={{ color: active ? "white" : tab.color }}>{tab.icon}</span>
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${
                  active ? "bg-white/20 text-white" : "bg-white/6 text-white/35"
                }`}>
                  {conteos[tab.key]}
                </span>
              </button>
            )
          })}
        </div>

        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtrados.map((cupon, idx) => (
              <div key={cupon.id} className="animate-fade-in-up"
                   style={{ animationDelay:`${idx*55}ms` }}>
                <CouponCard cupon={cupon} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center rounded-3xl animate-fade-in"
               style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-5xl mb-5">
              {activeTab==="disponible" ? "🎫" : activeTab==="canjeado" ? "✅" : "⌛"}
            </div>
            <p className="font-heading text-xl font-bold text-white/60 mb-2">
              Sin cupones {tabActual?.label.toLowerCase()}
            </p>
            <p className="text-sm text-white/30 mb-7">
              {activeTab==="disponible" ? "Compra una oferta y aparecerá aquí." : "Aquí verás tu historial."}
            </p>
            {activeTab==="disponible" && (
              <a href="/comprar" className="btn-primary inline-flex text-sm py-3 px-7">
                Ver ofertas <IcArrow />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
