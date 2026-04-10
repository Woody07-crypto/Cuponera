import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(pct)
      setVisible(scrollTop > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  const radius = 18
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <button
      onClick={scrollUp}
      aria-label="Volver arriba"
      className="fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center
                 bg-[rgba(10,22,40,0.9)] border border-white/10 rounded-full
                 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                 hover:border-[#C9A84C]/50 transition-all duration-300
                 animate-fade-in group"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.2s ease' }}
        />
      </svg>
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="#C9A84C" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        className="relative z-10 group-hover:-translate-y-0.5 transition-transform duration-200"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
