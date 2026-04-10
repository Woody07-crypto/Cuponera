export default function HeroBanner({ width = "100%", height = "100%", className = "" }) {
  return (
    <svg viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg"
         width={width} height={height} className={className}>
      <defs>
        <linearGradient id="hb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#07090F"/>
          <stop offset="100%" stopColor="#0E1117"/>
        </linearGradient>
        <linearGradient id="hb-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#7C3AED"/>
          <stop offset="50%"  stopColor="#EC4899"/>
          <stop offset="100%" stopColor="#06B6D4"/>
        </linearGradient>
        <linearGradient id="hb-card1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(124,58,237,0.15)"/>
          <stop offset="100%" stopColor="rgba(124,58,237,0.05)"/>
        </linearGradient>
        <linearGradient id="hb-card2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(6,182,212,0.12)"/>
          <stop offset="100%" stopColor="rgba(6,182,212,0.04)"/>
        </linearGradient>
        <linearGradient id="hb-card3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="rgba(245,158,11,0.13)"/>
          <stop offset="100%" stopColor="rgba(245,158,11,0.04)"/>
        </linearGradient>
        <radialGradient id="hb-orb1" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="hb-orb2" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="hb-orb3" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#EC4899" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0"/>
        </radialGradient>
        <filter id="hb-blur-xl"><feGaussianBlur stdDeviation="40"/></filter>
        <filter id="hb-blur"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="hb-blur-sm"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="hb-glow">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="hb-clip"><rect width="1200" height="480"/></clipPath>
        <clipPath id="hb-card-clip1"><rect x="660" y="60" width="240" height="130" rx="16"/></clipPath>
        <clipPath id="hb-card-clip2"><rect x="640" y="215" width="200" height="100" rx="14"/></clipPath>
        <clipPath id="hb-card-clip3"><rect x="870" y="180" width="210" height="180" rx="16"/></clipPath>
      </defs>

      <g clipPath="url(#hb-clip)">
        <rect width="1200" height="480" fill="url(#hb-bg)"/>

        <ellipse cx="300" cy="240" rx="350" ry="320" fill="url(#hb-orb1)" filter="url(#hb-blur-xl)"/>
        <ellipse cx="900" cy="300" rx="280" ry="260" fill="url(#hb-orb2)" filter="url(#hb-blur-xl)"/>
        <ellipse cx="650" cy="100" rx="200" ry="180" fill="url(#hb-orb3)" filter="url(#hb-blur-xl)"/>

        {Array.from({length:16},(_,row) =>
          Array.from({length:20},(_,col) => (
            <rect key={`${row}-${col}`}
                  x={col*65-5} y={row*32-5} width="58" height="26" rx="3"
                  fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
          ))
        )}

        {[
          [80,60],[200,30],[380,80],[100,200],[50,320],[180,380],[300,440],[400,20],
          [1100,50],[1050,180],[1150,300],[1080,420],[950,460],[1170,140],
        ].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={i%3===0?2.5:1.5}
                  fill="white" opacity={0.2+Math.sin(i*1.3)*0.15}/>
        ))}

        <g transform="translate(60,80)">
          <text fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="88"
                fill="none" stroke="url(#hb-accent)" strokeWidth="1" strokeOpacity="0.2">
            <tspan x="0" dy="0">LA</tspan>
          </text>
          <text fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="88"
                fill="white" opacity="0.97">
            <tspan x="0" dy="0">LA</tspan>
          </text>
          <text x="0" y="90" fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="88"
                fill="none" stroke="url(#hb-accent)" strokeWidth="1" strokeOpacity="0.2">
            CUPONERA
          </text>
          <text x="0" y="90" fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="88"
                filter="url(#hb-glow)">
            <tspan fill="url(#hb-accent)">CUPONERA</tspan>
          </text>

          <rect x="2" y="108" width="480" height="3" rx="1.5" fill="url(#hb-accent)" opacity="0.6"/>

          <text x="2" y="145" fontFamily="'DM Sans',sans-serif" fontSize="20"
                fill="rgba(255,255,255,0.5)" letterSpacing="1">
            Descuentos exclusivos · El Salvador
          </text>

          <g transform="translate(0,175)">
            {[
              {label:"Cupones activos", value:"500+", color:"#7C3AED"},
              {label:"Usuarios",        value:"10K+", color:"#06B6D4"},
              {label:"Ahorro promedio", value:"65%",  color:"#F59E0B"},
            ].map((s,i) => (
              <g key={s.label} transform={`translate(${i*165},0)`}>
                <text fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="42" fill={s.color} filter="url(#hb-glow)">
                  {s.value}
                </text>
                <text x="0" y="28" fontFamily="'DM Sans',sans-serif" fontSize="13"
                      fill="rgba(255,255,255,0.35)">{s.label}</text>
                <rect x="0" y="33" width="60" height="2" rx="1" fill={s.color} opacity="0.3"/>
              </g>
            ))}
          </g>

          <g transform="translate(0,275)">
            <rect x="0" y="0" width="200" height="52" rx="26"
                  fill="url(#hb-accent)" opacity="0.95"/>
            <text x="100" y="32" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontWeight="700" fontSize="16" fill="white">Ver ofertas →</text>

            <rect x="218" y="0" width="180" height="52" rx="26" fill="none"
                  stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <text x="308" y="32" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontWeight="600" fontSize="16" fill="rgba(255,255,255,0.6)">Crear cuenta</text>
          </g>
        </g>

        <g filter="url(#hb-blur-sm)">
          <rect x="660" y="60" width="240" height="130" rx="16"
                fill="url(#hb-card1)" stroke="rgba(124,58,237,0.3)" strokeWidth="1.5"/>
        </g>
        <rect x="660" y="60" width="240" height="130" rx="16"
              fill="url(#hb-card1)" stroke="rgba(124,58,237,0.35)" strokeWidth="1.5"/>
        <text x="680" y="92" fontFamily="'DM Sans',sans-serif" fontSize="11"
              fill="rgba(255,255,255,0.35)" letterSpacing="2">ENTRETENIMIENTO</text>
        <text x="680" y="124" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="26" fill="white">60% OFF</text>
        <text x="680" y="148" fontFamily="'DM Sans',sans-serif" fontSize="13" fill="rgba(255,255,255,0.45)">2 entradas de cine</text>
        <circle cx="870" cy="100" r="22" fill="rgba(124,58,237,0.25)" stroke="rgba(124,58,237,0.5)" strokeWidth="1"/>
        <text x="870" y="106" textAnchor="middle" fontSize="18">🎬</text>
        <rect x="660" y="170" width="90" height="10" rx="5" fill="rgba(124,58,237,0.4)"/>
        <rect x="660" y="170" width="60" height="10" rx="5" fill="#7C3AED"/>

        <rect x="640" y="215" width="200" height="100" rx="14"
              fill="url(#hb-card2)" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5"/>
        <text x="658" y="243" fontFamily="'DM Sans',sans-serif" fontSize="10"
              fill="rgba(255,255,255,0.35)" letterSpacing="2">GASTRONOMÍA</text>
        <text x="658" y="270" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="24" fill="white">50% OFF</text>
        <text x="658" y="292" fontFamily="'DM Sans',sans-serif" fontSize="12" fill="rgba(255,255,255,0.4)">Mejores restaurantes</text>
        <circle cx="816" cy="260" r="18" fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.4)" strokeWidth="1"/>
        <text x="816" y="265" textAnchor="middle" fontSize="14">🍕</text>

        <rect x="870" y="180" width="210" height="180" rx="16"
              fill="url(#hb-card3)" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5"/>
        <text x="890" y="215" fontFamily="'DM Sans',sans-serif" fontSize="11"
              fill="rgba(255,255,255,0.35)" letterSpacing="2">BELLEZA</text>
        <text x="890" y="255" fontFamily="'Space Grotesk',sans-serif" fontWeight="800" fontSize="44" fill="#F59E0B" filter="url(#hb-glow)">40%</text>
        <text x="890" y="280" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="20" fill="rgba(255,255,255,0.7)">DESCUENTO</text>
        <text x="890" y="305" fontFamily="'DM Sans',sans-serif" fontSize="13" fill="rgba(255,255,255,0.4)">Salones y spas</text>
        <rect x="890" y="320" width="170" height="28" rx="14" fill="rgba(245,158,11,0.2)"
              stroke="rgba(245,158,11,0.4)" strokeWidth="1"/>
        <text x="975" y="339" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
              fontSize="11" fontWeight="600" fill="#F59E0B">USAR CUPÓN</text>
        <circle cx="1052" cy="230" r="20" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.35)" strokeWidth="1"/>
        <text x="1052" y="236" textAnchor="middle" fontSize="16">💄</text>

        <ellipse cx="780" cy="390" rx="5" ry="5" fill="#7C3AED" opacity="0.9" filter="url(#hb-blur-sm)"/>
        <circle  cx="780" cy="390" r="2.5" fill="#c084fc"/>
        <ellipse cx="620" cy="420" rx="4" ry="4" fill="#06B6D4" opacity="0.8" filter="url(#hb-blur-sm)"/>
        <circle  cx="620" cy="420" r="2" fill="#22d3ee"/>
        <ellipse cx="1100" cy="80" rx="5" ry="5" fill="#F59E0B" opacity="0.8" filter="url(#hb-blur-sm)"/>
        <circle  cx="1100" cy="80" r="2.5" fill="#fcd34d"/>

        {Array.from({length:6},(_,i) => {
          const positions = [[100,460],[250,450],[450,470],[700,450],[950,460],[1150,445]]
          const [x,y] = positions[i]
          return (
            <g key={i} opacity="0.5">
              <line x1={x} y1={y-6} x2={x} y2={y+6} stroke="white" strokeWidth="1"/>
              <line x1={x-6} y1={y} x2={x+6} y2={y} stroke="white" strokeWidth="1"/>
            </g>
          )
        })}

        <rect x="0" y="474" width="1200" height="6"
              fill="url(#hb-accent)" opacity="0.6"/>
      </g>
    </svg>
  )
}
