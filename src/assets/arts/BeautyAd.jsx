export default function BeautyAd({ width = "100%", height = "100%", className = "" }) {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"
         width={width} height={height} className={className}>
      <defs>
        <linearGradient id="ba-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1a0020"/>
          <stop offset="50%"  stopColor="#2d0040"/>
          <stop offset="100%" stopColor="#0f0015"/>
        </linearGradient>
        <linearGradient id="ba-bottle1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#9333ea"/>
          <stop offset="40%"  stopColor="#c084fc"/>
          <stop offset="100%" stopColor="#7e22ce"/>
        </linearGradient>
        <linearGradient id="ba-bottle2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#db2777"/>
          <stop offset="40%"  stopColor="#f472b6"/>
          <stop offset="100%" stopColor="#be185d"/>
        </linearGradient>
        <linearGradient id="ba-mirror" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1a1a2e"/>
          <stop offset="100%" stopColor="#0d0d1a"/>
        </linearGradient>
        <radialGradient id="ba-glow-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#9333ea" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#9333ea" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="ba-glow-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ec4899" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="ba-shine" cx="30%" cy="20%" r="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <filter id="ba-blur"><feGaussianBlur stdDeviation="15"/></filter>
        <filter id="ba-blur-sm"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="ba-glow">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="ba-clip"><rect width="800" height="500"/></clipPath>
      </defs>

      <g clipPath="url(#ba-clip)">
        <rect width="800" height="500" fill="url(#ba-bg)"/>

        <ellipse cx="250" cy="250" rx="200" ry="200" fill="url(#ba-glow-l)" filter="url(#ba-blur)"/>
        <ellipse cx="580" cy="280" rx="180" ry="180" fill="url(#ba-glow-r)" filter="url(#ba-blur)"/>

        {Array.from({length:40},(_,i) => {
          const angle = (i/40)*Math.PI*2
          const r = 320
          const x = 400 + Math.cos(angle)*r
          const y = 250 + Math.sin(angle)*r*0.5
          return <circle key={i} cx={x} cy={y} r="1" fill="white" opacity={0.15+Math.sin(i)*0.1}/>
        })}

        <g transform="translate(290,80)">
          <rect x="0" y="0" width="58" height="210" rx="29"
                fill="url(#ba-bottle1)" opacity="0.9"/>
          <rect x="0" y="0" width="58" height="210" rx="29"
                fill="url(#ba-shine)"/>
          <rect x="18" y="-20" width="22" height="28" rx="5" fill="#a855f7"/>
          <rect x="22" y="-28" width="14" height="12" rx="3" fill="#c084fc"/>
          <rect x="8" y="60" width="42" height="60" rx="4"
                fill="rgba(0,0,0,0.25)"/>
          <text x="29" y="85" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="7" fontWeight="700" fill="white" opacity="0.8">SERUM</text>
          <text x="29" y="97" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="6" fill="white" opacity="0.6">VITAMIN C</text>
          <text x="29" y="108" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="6" fill="white" opacity="0.5">30ml</text>
          <ellipse cx="15" cy="40" rx="4" ry="25" fill="white" opacity="0.15"/>
        </g>

        <g transform="translate(360,60)">
          <rect x="0" y="10" width="65" height="240" rx="8"
                fill="url(#ba-bottle2)" opacity="0.95"/>
          <rect x="0" y="10" width="65" height="240" rx="8"
                fill="url(#ba-shine)"/>
          <ellipse cx="32" cy="8" rx="16" ry="6" fill="#db2777"/>
          <rect x="14" y="0" width="36" height="12" rx="6" fill="#be185d"/>
          <rect x="8" y="80" width="49" height="80" rx="5"
                fill="rgba(0,0,0,0.2)"/>
          <text x="32" y="110" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="8" fontWeight="700" fill="white">HYDRA</text>
          <text x="32" y="124" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="8" fontWeight="700" fill="white">BOOST</text>
          <text x="32" y="140" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="7" fill="white" opacity="0.6">MOISTURIZER</text>
          <ellipse cx="18" cy="60" rx="5" ry="35" fill="white" opacity="0.12"/>
        </g>

        <g transform="translate(440,95)">
          <rect x="0" y="0" width="52" height="195" rx="26"
                fill="#1e1b4b" opacity="0.95" stroke="#6366f1" strokeWidth="1.5"/>
          <rect x="0" y="0" width="52" height="195" rx="26"
                fill="url(#ba-shine)"/>
          <rect x="15" y="-18" width="22" height="25" rx="4" fill="#4338ca"/>
          <rect x="20" y="-24" width="12" height="10" rx="3" fill="#6366f1"/>
          <rect x="6" y="55" width="40" height="55" rx="4"
                fill="rgba(99,102,241,0.2)"/>
          <text x="26" y="76" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="7" fontWeight="700" fill="white">RETINOL</text>
          <text x="26" y="90" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="6" fill="white" opacity="0.6">NIGHT OIL</text>
          <ellipse cx="14" cy="35" rx="3" ry="22" fill="white" opacity="0.12"/>
        </g>

        <ellipse cx="380" cy="295" rx="180" ry="20"
                 fill="#000" opacity="0.4" filter="url(#ba-blur-sm)"/>

        <g transform="translate(90,130)">
          <circle cx="60" cy="60" r="55" fill="url(#ba-mirror)" stroke="#9333ea" strokeWidth="1.5" strokeOpacity="0.5"/>
          <circle cx="60" cy="60" r="55" fill="url(#ba-shine)" opacity="0.3"/>
          <text x="60" y="52" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="11" fontWeight="700" fill="#c084fc">BEAUTY</text>
          <text x="60" y="68" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="11" fontWeight="700" fill="#f472b6">DEALS</text>
          <rect x="10" y="114" width="100" height="3" rx="1.5" fill="#9333ea" opacity="0.5"/>
          <circle cx="60" cy="124" r="5" fill="#9333ea" opacity="0.7"/>
        </g>

        <g>
          <text x="70" y="360" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="80" fill="none"
                stroke="#9333ea" strokeWidth="1" strokeOpacity="0.25">
            GLOW
          </text>
          <text x="70" y="360" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="80" fill="white" opacity="0.9">
            GLOW
          </text>
          <text x="70" y="410" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="80" fill="#ec4899" opacity="0.85">
            UP
          </text>
        </g>

        <g transform="translate(570,340)">
          <rect x="0" y="0" width="185" height="130" rx="16"
                fill="rgba(0,0,0,0.5)" stroke="rgba(147,51,234,0.3)" strokeWidth="1.5"/>
          <text x="92" y="30" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="10" fill="rgba(255,255,255,0.4)" letterSpacing="3">DESCUENTO HOY</text>
          <text x="92" y="76" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="52" fill="white">40%</text>
          <text x="92" y="98" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="12" fill="#c084fc">en productos seleccionados</text>
          <rect x="20" y="108" width="145" height="14" rx="7" fill="#9333ea" opacity="0.7"/>
          <text x="92" y="120" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="9" fontWeight="600" fill="white">COMPRAR AHORA</text>
        </g>

        {[
          [50,60,6],[750,80,4],[700,420,5],[80,450,4],[400,30,5],
          [600,50,3],[150,400,5],[720,300,3],
        ].map(([x,y,r],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={i%2===0?"#9333ea":"#ec4899"} opacity="0.5" filter="url(#ba-blur-sm)"/>
            <circle cx={x} cy={y} r={r/2} fill="white" opacity="0.7"/>
          </g>
        ))}

        <text x="400" y="485" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontSize="11" fill="rgba(255,255,255,0.2)" letterSpacing="5">
          LA CUPONERA · BELLEZA &amp; CUIDADO PERSONAL
        </text>
      </g>
    </svg>
  )
}
