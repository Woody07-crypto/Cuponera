export default function FoodPromo({ width = "100%", height = "100%", className = "" }) {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"
         width={width} height={height} className={className}>
      <defs>
        <linearGradient id="fp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1a0800"/>
          <stop offset="50%"  stopColor="#2d1000"/>
          <stop offset="100%" stopColor="#1a0500"/>
        </linearGradient>
        <linearGradient id="fp-plate" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#f97316"/>
          <stop offset="100%" stopColor="#c2410c"/>
        </linearGradient>
        <linearGradient id="fp-bowl" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#d97706"/>
        </linearGradient>
        <radialGradient id="fp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#f97316" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="fp-plate-shine" cx="35%" cy="30%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <filter id="fp-blur">
          <feGaussianBlur stdDeviation="12"/>
        </filter>
        <filter id="fp-blur-sm">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
        <filter id="fp-shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#000" floodOpacity="0.5"/>
        </filter>
        <clipPath id="fp-clip"><rect width="800" height="500"/></clipPath>
      </defs>

      <g clipPath="url(#fp-clip)">
        <rect width="800" height="500" fill="url(#fp-bg)"/>

        <circle cx="420" cy="280" r="200" fill="url(#fp-glow)" filter="url(#fp-blur)"/>

        {Array.from({length:20},(_,i) => {
          const angle = (i/20)*Math.PI*2
          const r1=80, r2=40
          const x1=400+Math.cos(angle)*r1, y1=280+Math.sin(angle)*r1
          const x2=400+Math.cos(angle+0.15)*(r1+r2), y2=280+Math.sin(angle+0.15)*(r1+r2)
          return null
        })}

        <g filter="url(#fp-shadow)">
          <ellipse cx="400" cy="295" rx="175" ry="18" fill="#000" opacity="0.6"/>
          <ellipse cx="400" cy="275" rx="170" ry="170" fill="#d97706"/>
          <ellipse cx="400" cy="275" rx="170" ry="170" fill="url(#fp-plate-shine)"/>

          <ellipse cx="400" cy="265" rx="140" ry="140" fill="#c2410c"/>
          <ellipse cx="400" cy="255" rx="120" ry="120" fill="#ea580c"/>

          <ellipse cx="395" cy="248" rx="95" ry="95" fill="#1a0800" opacity="0.3"/>

          <ellipse cx="400" cy="250" rx="85" ry="50" fill="#92400e"/>
          <ellipse cx="400" cy="248" rx="80" ry="46" fill="#a16207"/>

          {[
            {cx:385, cy:240, rx:22, ry:18, fill:"#dc2626"},
            {cx:415, cy:235, rx:20, ry:16, fill:"#b91c1c"},
            {cx:400, cy:255, rx:18, ry:15, fill:"#ef4444"},
            {cx:370, cy:255, rx:16, ry:13, fill:"#dc2626"},
            {cx:428, cy:252, rx:17, ry:14, fill:"#991b1b"},
          ].map((t,i) => (
            <ellipse key={i} cx={t.cx} cy={t.cy} rx={t.rx} ry={t.ry} fill={t.fill}/>
          ))}

          {[
            {cx:380, cy:238, w:28, h:8, fill:"#fbbf24", r:3},
            {cx:412, cy:233, w:25, h:7, fill:"#f59e0b", r:3},
            {cx:398, cy:252, w:22, h:7, fill:"#fcd34d", r:3},
          ].map((t,i) => (
            <rect key={i} x={t.cx-t.w/2} y={t.cy-t.h/2} width={t.w} height={t.h} rx={t.r} fill={t.fill} opacity="0.9"/>
          ))}

          <ellipse cx="388" cy="225" rx="6" ry="8" fill="#15803d" opacity="0.9"/>
          <ellipse cx="414" cy="222" rx="5" ry="7" fill="#166534" opacity="0.9"/>
          <ellipse cx="402" cy="220" rx="5" ry="8" fill="#15803d" opacity="0.9"/>
        </g>

        <g opacity="0.75" filter="url(#fp-blur-sm)">
          {[[380,175],[395,155],[412,168],[400,145]].map(([x,y],i) => (
            <g key={i}>
              <path d={`M${x} ${y+40} Q${x-12} ${y+20} ${x+5} ${y} Q${x+15} ${y-15} ${x-8} ${y-30}`}
                    fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round"/>
            </g>
          ))}
        </g>

        <g transform="translate(580,200)">
          <rect x="0" y="0" width="160" height="220" rx="16"
                fill="rgba(0,0,0,0.55)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5"/>
          <rect x="0" y="0" width="160" height="220" rx="16"
                fill="rgba(245,158,11,0.06)"/>

          <text x="80" y="38" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="11" fill="rgba(255,255,255,0.4)" letterSpacing="3">OFERTA ESPECIAL</text>
          <text x="80" y="80" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="56" fill="#F59E0B">50%</text>
          <text x="80" y="105" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="700" fontSize="20" fill="white">OFF</text>

          <rect x="20" y="118" width="120" height="1" fill="rgba(255,255,255,0.1)"/>

          <text x="80" y="142" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="12" fill="rgba(255,255,255,0.55)">en tu primera orden</text>
          <text x="80" y="162" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="12" fill="rgba(255,255,255,0.55)">en restaurantes</text>

          <rect x="20" y="178" width="120" height="28" rx="14"
                fill="#F59E0B"/>
          <text x="80" y="197" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="700" fontSize="12" fill="#07090F">USAR CUPÓN</text>
        </g>

        <g transform="translate(55,80)">
          <text x="0" y="0" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="70" fill="none"
                stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.3">
            SABOR
          </text>
          <text x="0" y="0" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="70" fill="white" opacity="0.95">
            SABOR
          </text>
          <text x="0" y="50" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="70" fill="#F59E0B" opacity="0.9">
            REAL
          </text>
          <text x="2" y="95" fontFamily="'DM Sans',sans-serif"
                fontSize="14" fill="rgba(255,255,255,0.45)" letterSpacing="1">
            Los mejores restaurantes
          </text>
          <text x="2" y="115" fontFamily="'DM Sans',sans-serif"
                fontSize="14" fill="rgba(255,255,255,0.45)" letterSpacing="1">
            de El Salvador
          </text>
        </g>

        {[
          {x:62, y:370, r:8, c:"#F59E0B"},
          {x:78, y:378, r:5, c:"#f97316"},
          {x:720,y:380, r:7, c:"#ef4444"},
          {x:735,y:370, r:4, c:"#F59E0B"},
          {x:350,y:400, r:6, c:"#F59E0B"},
        ].map((d,i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity="0.7"/>
        ))}

        <rect x="55" y="440" width="690" height="1" fill="rgba(245,158,11,0.15)"/>
        <text x="400" y="465" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontSize="12" fill="rgba(255,255,255,0.25)" letterSpacing="4">
          LA CUPONERA · GASTRONOMÍA
        </text>

        <rect width="800" height="500" fill="none"
              stroke="#f97316" strokeWidth="1" strokeOpacity="0.08"/>
      </g>
    </svg>
  )
}
