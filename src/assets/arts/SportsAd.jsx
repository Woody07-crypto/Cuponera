export default function SportsAd({ width = "100%", height = "100%", className = "" }) {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"
         width={width} height={height} className={className}>
      <defs>
        <linearGradient id="sa-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#001a05"/>
          <stop offset="50%"  stopColor="#002a08"/>
          <stop offset="100%" stopColor="#001205"/>
        </linearGradient>
        <linearGradient id="sa-neon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#10B981"/>
          <stop offset="50%"  stopColor="#06B6D4"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
        <radialGradient id="sa-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#10B981" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="sa-glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
        </radialGradient>
        <filter id="sa-blur"><feGaussianBlur stdDeviation="18"/></filter>
        <filter id="sa-blur-sm"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="sa-glow-f">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="sa-clip"><rect width="800" height="500"/></clipPath>
      </defs>

      <g clipPath="url(#sa-clip)">
        <rect width="800" height="500" fill="url(#sa-bg)"/>

        <ellipse cx="250" cy="250" rx="230" ry="220" fill="url(#sa-glow)" filter="url(#sa-blur)"/>
        <ellipse cx="580" cy="220" rx="180" ry="170" fill="url(#sa-glow2)" filter="url(#sa-blur)"/>

        {Array.from({length:15},(_,i) => {
          const y = i * 35 - 20
          return <line key={i} x1="0" y1={y} x2="800" y2={y+200}
                       stroke="rgba(16,185,129,0.04)" strokeWidth="1"/>
        })}

        <g transform="translate(270,80)" opacity="0.85">
          <line x1="90" y1="0" x2="90" y2="270" stroke="#10B981" strokeWidth="2.5" strokeOpacity="0.6"/>
          <ellipse cx="90" cy="0"   rx="10" ry="8"  fill="#10B981" opacity="0.8"/>
          <ellipse cx="90" cy="270" rx="14" ry="12" fill="#07090F" stroke="#10B981" strokeWidth="2"/>

          <line x1="90" y1="68" x2="40" y2="110" stroke="#10B981" strokeWidth="2" strokeOpacity="0.7"/>
          <line x1="90" y1="68" x2="140" y2="110" stroke="#10B981" strokeWidth="2" strokeOpacity="0.7"/>

          <rect x="40" y="108" width="25" height="90" rx="4" fill="#10B981" opacity="0.5"/>
          <rect x="53" y="108" width="12" height="90" rx="4" fill="rgba(16,185,129,0.25)"/>

          <rect x="117" y="108" width="25" height="90" rx="4" fill="#10B981" opacity="0.5"/>

          <line x1="40" y1="160" x2="20" y2="200" stroke="#10B981" strokeWidth="2" strokeOpacity="0.6"/>
          <line x1="142" y1="160" x2="162" y2="200" stroke="#10B981" strokeWidth="2" strokeOpacity="0.6"/>

          <rect x="5" y="198" width="24" height="72" rx="4" fill="#10B981" opacity="0.45"/>
          <rect x="153" y="198" width="24" height="72" rx="4" fill="#10B981" opacity="0.45"/>

          <ellipse cx="90" cy="58" rx="22" ry="22" fill="#0d1f10" stroke="#10B981" strokeWidth="2"/>
          <ellipse cx="90" cy="58" rx="16" ry="16" fill="#10B981" opacity="0.15"/>
          <text x="90" y="63" textAnchor="middle" fontSize="14">🏃</text>
        </g>

        <ellipse cx="360" cy="370" rx="100" ry="12" fill="#000" opacity="0.5" filter="url(#sa-blur-sm)"/>

        <g>
          <text x="60" y="230" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="78" fill="none"
                stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.3">
            ACTIVA
          </text>
          <text x="60" y="230" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="78" fill="white" opacity="0.95" filter="url(#sa-glow-f)">
            ACTIVA
          </text>
          <text x="60" y="305" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="78" fill="#10B981" opacity="0.9" filter="url(#sa-glow-f)">
            TU VIDA
          </text>
        </g>

        <text x="62" y="345" fontFamily="'DM Sans',sans-serif" fontSize="16"
              fill="rgba(255,255,255,0.4)" letterSpacing="1">
          Membresías · Equipamiento · Clases
        </text>

        <rect x="60" y="365" width="220" height="52" rx="26"
              fill="#10B981" opacity="0.9"/>
        <text x="170" y="397" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
              fontWeight="700" fontSize="16" fill="#07090F">Ver descuentos →</text>

        <g transform="translate(550,280)">
          <rect x="0" y="0" width="200" height="180" rx="20"
                fill="rgba(0,0,0,0.55)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5"/>
          <text x="100" y="32" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="3">PROMOCIÓN</text>

          <text x="100" y="85" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="55" fill="#10B981" filter="url(#sa-glow-f)">35%</text>

          <text x="100" y="108" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="12" fill="rgba(255,255,255,0.45)">en membresías y</text>
          <text x="100" y="125" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="12" fill="rgba(255,255,255,0.45)">clases deportivas</text>

          <rect x="20" y="142" width="160" height="26" rx="13" fill="#10B981" opacity="0.8"/>
          <text x="100" y="160" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="12" fontWeight="700" fill="#07090F">USAR CUPÓN</text>
        </g>

        {Array.from({length:8},(_,i) => {
          const positions = [[50,50],[720,60],[760,340],[40,360],[400,30],[400,460],[110,420],[680,420]]
          const [x,y] = positions[i]
          const size = 8 + (i%3)*4
          return (
            <g key={i} transform={`translate(${x},${y})`} opacity="0.5">
              <polygon points={`0,-${size} ${size*0.6},${size*0.4} -${size*0.6},${size*0.4}`}
                       fill={i%2===0?"#10B981":"#06B6D4"} opacity="0.7"/>
            </g>
          )
        })}

        <rect x="0" y="0" width="800" height="4" fill="url(#sa-neon)" opacity="0.7"/>
        <rect x="0" y="496" width="800" height="4" fill="url(#sa-neon)" opacity="0.7"/>

        <text x="400" y="480" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontSize="11" fill="rgba(255,255,255,0.18)" letterSpacing="5">
          LA CUPONERA · DEPORTES &amp; FITNESS
        </text>
      </g>
    </svg>
  )
}
