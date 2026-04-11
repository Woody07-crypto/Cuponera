import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible,  setVisible]  = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
      setVisible(scrollTop > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  const r    = 18
  const circ = 2 * Math.PI * r
  const dash = circ - (progress / 100) * circ

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className="fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center
                 rounded-full animate-fade-in transition-all duration-300
                 hover:scale-110 group"
      style={{
        background: "rgba(7,9,15,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <circle cx="24" cy="24" r={r} fill="none"
                stroke="url(#grad)" strokeWidth="2" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={dash}
                style={{ transition:"stroke-dashoffset 0.2s ease" }} />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
           stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
           className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-200 opacity-70 group-hover:opacity-100">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
