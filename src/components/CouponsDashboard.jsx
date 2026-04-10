import { useState } from 'react'
import CouponCard from './CouponCard'
import { useMisCupones } from '../hooks/useMisCupones'
import { SkeletonCouponGrid } from './ui/SkeletonCard'

const TABS = [
  { key: 'disponible', label: 'Disponibles', color: 'emerald' },
  { key: 'canjeado',   label: 'Canjeados',   color: 'blue' },
  { key: 'vencido',    label: 'Vencidos',    color: 'red' },
]

export default function CouponsDashboard() {
  const { cupones, loading } = useMisCupones()
  const [activeTab, setActiveTab] = useState('disponible')

  const conteos = TABS.reduce((acc, tab) => {
    acc[tab.key] = cupones.filter(c => c.estadoMostrar === tab.key).length
    return acc
  }, {})

  const filtrados = cupones.filter(c => c.estadoMostrar === activeTab)

  if (loading) {
    return (
      <div className="page-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-10 w-48 rounded-xl mb-3" />
          <div className="skeleton h-5 w-64 rounded mb-10" />
          <div className="flex gap-3 mb-10">
            {[1,2,3].map(i => <div key={i} className="skeleton h-10 w-28 rounded-xl" />)}
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
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Mis Cupones</h1>
          <p className="text-white/45 text-base">
            Tienes <span className="text-[#C9A84C] font-semibold">{cupones.length}</span> cupón{cupones.length !== 1 ? "es" : ""} en total
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 animate-fade-in">
          {TABS.map(tab => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold
                            transition-all duration-200 border ${
                  active
                    ? "bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-[#060E1A] border-transparent shadow-gold"
                    : "bg-white/4 text-white/55 border-white/8 hover:bg-white/8 hover:text-white hover:border-white/15"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                  active ? "bg-[#060E1A]/20 text-[#060E1A]/70" : "bg-white/8 text-white/50"
                }`}>
                  {conteos[tab.key]}
                </span>
              </button>
            )
          })}
        </div>

        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtrados.map((cupon, idx) => (
              <div key={cupon.id} className="animate-fade-in-up"
                   style={{ animationDelay: `${idx * 60}ms` }}>
                <CouponCard cupon={cupon} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-white/8 bg-white/3 animate-fade-in">
            <div className="text-5xl mb-4">
              {activeTab === 'disponible' ? '🎫' : activeTab === 'canjeado' ? '✅' : '⌛'}
            </div>
            <p className="text-white/50 text-lg font-medium">
              No tienes cupones {TABS.find(t => t.key === activeTab)?.label.toLowerCase()}
            </p>
            {activeTab === 'disponible' && (
              <a href="/comprar" className="btn-gold inline-flex mt-6 py-2.5 px-6 text-sm">
                Ver ofertas disponibles
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
