export default function ConcertPoster({ width = "100%", height = "100%", className = "" }) {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"
         width={width} height={height} className={className}>
      <defs>
        <linearGradient id="cp-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0D0020"/>
          <stop offset="50%"  stopColor="#1a0040"/>
          <stop offset="100%" stopColor="#2d0060"/>
        </linearGradient>
        <linearGradient id="cp-stage" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1a1a2e"/>
          <stop offset="100%" stopColor="#0a0a1a"/>
        </linearGradient>
        <radialGradient id="cp-spot1" cx="30%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cp-spot2" cx="70%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="#EC4899" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cp-spot3" cx="50%" cy="0%" r="50%">
          <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cp-glow-l" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="cp-glow-r" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#EC4899" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0"/>
        </radialGradient>
        <filter id="cp-blur">
          <feGaussianBlur stdDeviation="8"/>
        </filter>
        <filter id="cp-blur-sm">
          <feGaussianBlur stdDeviation="3"/>
        </filter>
        <filter id="cp-glow-text">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="cp-clip">
          <rect width="800" height="500"/>
        </clipPath>
      </defs>

      <g clipPath="url(#cp-clip)">
        <rect width="800" height="500" fill="url(#cp-sky)"/>

        <ellipse cx="240" cy="0" rx="280" ry="220" fill="url(#cp-spot1)" filter="url(#cp-blur)"/>
        <ellipse cx="560" cy="0" rx="260" ry="200" fill="url(#cp-spot2)" filter="url(#cp-blur)"/>
        <ellipse cx="400" cy="0" rx="200" ry="180" fill="url(#cp-spot3)" filter="url(#cp-blur)"/>

        {[40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map((x, i) => (
          <g key={x}>
            <line x1={x} y1="0" x2={x - 30 + (i%3)*20} y2="280"
                  stroke={i%3===0 ? "#7C3AED" : i%3===1 ? "#EC4899" : "#06B6D4"}
                  strokeWidth="1.5" strokeOpacity="0.25"/>
          </g>
        ))}

        <ellipse cx="140" cy="10" rx="18" ry="18" fill="url(#cp-glow-l)" filter="url(#cp-blur-sm)" opacity="0.9"/>
        <circle  cx="140" cy="10" r="5" fill="#fff" opacity="0.95"/>
        <ellipse cx="660" cy="10" rx="18" ry="18" fill="url(#cp-glow-r)" filter="url(#cp-blur-sm)" opacity="0.9"/>
        <circle  cx="660" cy="10" r="5" fill="#fff" opacity="0.95"/>
        <ellipse cx="300" cy="5"  rx="14" ry="14" fill="url(#cp-glow-l)" filter="url(#cp-blur-sm)" opacity="0.7"/>
        <circle  cx="300" cy="5"  r="4"  fill="#fff" opacity="0.85"/>
        <ellipse cx="500" cy="5"  rx="14" ry="14" fill="url(#cp-glow-r)" filter="url(#cp-blur-sm)" opacity="0.7"/>
        <circle  cx="500" cy="5"  r="4"  fill="#fff" opacity="0.85"/>
        <ellipse cx="400" cy="0"  rx="16" ry="16" fill="white"           filter="url(#cp-blur-sm)" opacity="0.5"/>
        <circle  cx="400" cy="0"  r="5"  fill="#fff" opacity="0.9"/>

        {[
          [60,120],[120,90],[200,140],[350,80],[450,100],[580,130],[700,85],[750,110],
          [30,160],[160,170],[320,155],[480,165],[630,150],[780,145],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i%3===0?2:1.5} fill="white" opacity={0.4+Math.random()*0.4}/>
        ))}

        <rect x="0" y="320" width="800" height="180" fill="url(#cp-stage)"/>

        <rect x="50"  y="310" width="140" height="15" rx="4" fill="#7C3AED" opacity="0.7"/>
        <rect x="610" y="310" width="140" height="15" rx="4" fill="#EC4899" opacity="0.7"/>
        <rect x="220" y="315" width="80"  height="10" rx="3" fill="#06B6D4" opacity="0.5"/>
        <rect x="500" y="315" width="80"  height="10" rx="3" fill="#06B6D4" opacity="0.5"/>

        <rect x="120" y="340" width="30" height="80" rx="4" fill="#111"/>
        <rect x="160" y="350" width="25" height="70" rx="4" fill="#111"/>
        <rect x="580" y="340" width="30" height="80" rx="4" fill="#111"/>
        <rect x="615" y="355" width="25" height="65" rx="4" fill="#111"/>

        <rect x="180" y="360" width="50" height="60" rx="2" fill="#1a1a3e"/>
        <rect x="570" y="360" width="50" height="60" rx="2" fill="#1a1a3e"/>
        <rect x="355" y="340" width="90" height="80" rx="3" fill="#0d0d2e" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.5"/>

        <ellipse cx="400" cy="340" rx="80" ry="12" fill="#7C3AED" opacity="0.4" filter="url(#cp-blur-sm)"/>
        <ellipse cx="200" cy="340" rx="50" ry="8"  fill="#EC4899" opacity="0.3" filter="url(#cp-blur-sm)"/>
        <ellipse cx="600" cy="340" rx="50" ry="8"  fill="#06B6D4" opacity="0.3" filter="url(#cp-blur-sm)"/>

        <g opacity="0.85">
          {[30,50,70,90,110,130,150,170,200,220,240,260,280,300,320,340,360,380,400,
            420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720,750,770].map((x,i) => (
            <ellipse key={x} cx={x} cy={445} rx={6+i%4} ry={30+i%20}
                     fill={i%4===0?"#111":i%4===1?"#0d0d20":i%4===2?"#151525":"#0a0a18"}/>
          ))}
        </g>
        <rect x="0" y="455" width="800" height="45" fill="#07090F"/>

        <text x="400" y="170" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
              fontWeight="800" fontSize="88" fill="none"
              stroke="#7C3AED" strokeWidth="2" strokeOpacity="0.6" filter="url(#cp-blur-sm)">
          EN VIVO
        </text>
        <text x="400" y="170" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
              fontWeight="800" fontSize="88" fill="white" filter="url(#cp-glow-text)">
          EN VIVO
        </text>

        <text x="400" y="210" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontWeight="400" fontSize="18" fill="white" letterSpacing="8" opacity="0.6">
          EXPERIENCIAS ÚNICAS
        </text>

        <rect x="250" y="228" width="300" height="2" rx="1" fill="url(#cp-spot2)" opacity="0.5"/>

        <text x="400" y="278" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
              fontWeight="700" fontSize="28" fill="#EC4899" filter="url(#cp-glow-text)">
          HASTA 60% DE DESCUENTO
        </text>

        <rect x="130" y="470" width="240" height="24" rx="12" fill="#7C3AED" opacity="0.15"/>
        <text x="250" y="487" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontSize="12" fill="white" opacity="0.7" letterSpacing="2">
          CUPONES DISPONIBLES
        </text>
        <rect x="430" y="470" width="240" height="24" rx="12" fill="#EC4899" opacity="0.15"/>
        <text x="550" y="487" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontSize="12" fill="white" opacity="0.7" letterSpacing="2">
          DESCARGA YA
        </text>

        {[[50,60],[750,80],[100,200],[700,180],[400,50]].map(([x,y],i) => (
          <g key={i} opacity="0.6">
            <line x1={x} y1={y-8} x2={x} y2={y+8} stroke="white" strokeWidth="1.5"/>
            <line x1={x-8} y1={y} x2={x+8} y2={y} stroke="white" strokeWidth="1.5"/>
            <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
            <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
          </g>
        ))}

        <rect x="0" y="0" width="800" height="500" fill="none"
              stroke="white" strokeWidth="2" strokeOpacity="0.04"/>
        <rect x="10" y="10" width="780" height="480" fill="none"
              stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.2"/>
      </g>
    </svg>
  )
}
