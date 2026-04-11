/* ══════════════════════════════════════════════════════════════════
   Toast.jsx — Sistema de notificaciones tipo toast
   Uso:
     const { showToast } = useToast()
     showToast('Mensaje', 'success' | 'error' | 'warning' | 'info')

   Envolver la app con <ToastProvider> en App.jsx
   ══════════════════════════════════════════════════════════════════ */
import { createContext, useContext, useState, useCallback } from 'react'

// ── Contexto ────────────────────────────────────────────────────
const ToastContext = createContext(null)

// ── Iconos inline (sin dependencias externas) ───────────────────
const IconSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)
const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
  </svg>
)
const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)
const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

// ── Configuración por tipo ───────────────────────────────────────
const TOAST_CONFIG = {
  success: {
    icon:       <IconSuccess />,
    barColor:   '#22c55e',
    iconColor:  '#22c55e',
    iconBg:     'rgba(34,197,94,0.12)',
  },
  error: {
    icon:       <IconError />,
    barColor:   '#ef4444',
    iconColor:  '#ef4444',
    iconBg:     'rgba(239,68,68,0.12)',
  },
  warning: {
    icon:       <IconWarning />,
    barColor:   '#C9A84C',
    iconColor:  '#C9A84C',
    iconBg:     'rgba(201,168,76,0.12)',
  },
  info: {
    icon:       <IconInfo />,
    barColor:   '#00B4D8',
    iconColor:  '#00B4D8',
    iconBg:     'rgba(0,180,216,0.12)',
  },
}

// ── Componente individual de toast ───────────────────────────────
function ToastItem({ toast, onRemove }) {
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info

  return (
    <div
      style={{
        animation: toast.exiting
          ? 'toast-out 0.35s ease-in forwards'
          : 'toast-in 0.35s ease-out both',
      }}
      className="relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]
                 rounded-xl overflow-hidden
                 bg-[rgba(10,22,40,0.92)] border border-white/10
                 shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                 backdrop-blur-md px-4 py-3.5"
    >
      {/* Barra lateral de color */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: config.barColor }}
      />

      {/* Ícono */}
      <div
        className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: config.iconBg, color: config.iconColor }}
      >
        {config.icon}
      </div>

      {/* Mensaje */}
      <p className="flex-1 text-sm text-[#F8F9FA] leading-snug pt-1">
        {toast.message}
      </p>

      {/* Botón cerrar */}
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 mt-0.5 text-white/30 hover:text-white/70 transition-colors"
        aria-label="Cerrar notificación"
      >
        <IconClose />
      </button>
    </div>
  )
}

// ── Proveedor principal ──────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  // Agrega un toast nuevo
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, exiting: false }])

    // Auto-eliminar después de `duration` ms
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => t.id === id ? { ...t, exiting: true } : t)
      )
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 350)
    }, duration)
  }, [])

  // Eliminar manualmente
  const removeToast = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    )
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 350)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor de toasts — esquina inferior derecha */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end"
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ── Hook de consumo ──────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
