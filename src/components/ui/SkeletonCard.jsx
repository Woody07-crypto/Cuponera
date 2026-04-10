/* ══════════════════════════════════════════════════════════════════
   SkeletonCard.jsx — Placeholder animado mientras cargan las cards
   Uso: <SkeletonCard /> o <SkeletonGrid count={6} />
   ══════════════════════════════════════════════════════════════════ */

// ── Skeleton de una tarjeta de oferta ───────────────────────────
export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-[rgba(15,32,64,0.5)]">
      {/* Imagen placeholder */}
      <div className="skeleton h-44 w-full" />

      {/* Línea de color */}
      <div className="h-0.5 skeleton opacity-50" />

      {/* Contenido */}
      <div className="p-6 flex flex-col gap-4">
        {/* Empresa */}
        <div className="skeleton h-3 w-24 rounded-full" />

        {/* Título */}
        <div className="flex flex-col gap-2">
          <div className="skeleton h-5 w-full rounded" />
          <div className="skeleton h-5 w-3/4 rounded" />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <div className="skeleton h-3.5 w-full rounded" />
          <div className="skeleton h-3.5 w-5/6 rounded" />
          <div className="skeleton h-3.5 w-4/6 rounded" />
        </div>

        {/* Precio */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-4 w-12 rounded" />
          <div className="skeleton h-8 w-20 rounded" />
        </div>

        {/* Separador */}
        <div className="skeleton h-px w-full opacity-30" />

        {/* Metadata */}
        <div className="flex flex-col gap-1.5">
          <div className="skeleton h-3 w-40 rounded" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>

        {/* Botón */}
        <div className="skeleton h-11 w-full rounded-xl mt-auto" />
      </div>
    </div>
  )
}

// ── Grid de skeletons ────────────────────────────────────────────
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

// ── Skeleton para el dashboard de cupones ────────────────────────
export function SkeletonCoupon() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-[rgba(15,32,64,0.5)]">
      <div className="p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        {/* Empresa */}
        <div className="skeleton h-3.5 w-28 rounded" />
        {/* Código */}
        <div className="skeleton h-16 w-full rounded-xl" />
        {/* Fecha */}
        <div className="skeleton h-3 w-36 rounded" />
      </div>
      {/* Botón */}
      <div className="px-6 pb-6">
        <div className="skeleton h-11 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonCouponGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCoupon key={i} />
      ))}
    </div>
  )
}
