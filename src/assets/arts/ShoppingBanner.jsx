export default function ShoppingBanner({ width = "100%", height = "100%", className = "" }) {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg"
         width={width} height={height} className={className}>
      <defs>
        <linearGradient id="sb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#000d1a"/>
          <stop offset="50%"  stopColor="#001428"/>
          <stop offset="100%" stopColor="#000a14"/>
        </linearGradient>
        <linearGradient id="sb-bag1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#06B6D4"/>
          <stop offset="100%" stopColor="#0e7490"/>
        </linearGradient>
        <linearGradient id="sb-bag2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7C3AED"/>
          <stop offset="100%" stopColor="#5b21b6"/>
        </linearGradient>
        <linearGradient id="sb-bag3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#b45309"/>
        </linearGradient>
        <radialGradient id="sb-glow-c" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#06B6D4" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="sb-shine" cx="20%" cy="15%" r="60%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <filter id="sb-blur"><feGaussianBlur stdDeviation="18"/></filter>
        <filter id="sb-blur-sm"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="sb-shadow">
          <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#000" floodOpacity="0.6"/>
        </filter>
        <filter id="sb-glow">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="sb-clip"><rect width="800" height="500"/></clipPath>
      </defs>

      <g clipPath="url(#sb-clip)">
        <rect width="800" height="500" fill="url(#sb-bg)"/>

        <ellipse cx="400" cy="250" rx="250" ry="220" fill="url(#sb-glow-c)" filter="url(#sb-blur)"/>

        {Array.from({length:8},(_,row) =>
          Array.from({length:10},(_,col) => (
            <rect key={`${row}-${col}`}
                  x={col*90-20} y={row*65-15}
                  width="70" height="50" rx="4"
                  fill="rgba(255,255,255,0.015)"
                  stroke="rgba(6,182,212,0.06)" strokeWidth="1"/>
          ))
        )}

        <g filter="url(#sb-shadow)">
          <g transform="translate(160,90)">
            <path d="M10 50 Q10 0 60 0 Q110 0 110 50 L120 220 Q120 240 100 240 L20 240 Q0 240 0 220 Z"
                  fill="url(#sb-bag1)" opacity="0.95"/>
            <path d="M10 50 Q10 0 60 0 Q110 0 110 50 L120 220 Q120 240 100 240 L20 240 Q0 240 0 220 Z"
                  fill="url(#sb-shine)"/>
            <path d="M28 50 Q28 18 60 18 Q92 18 92 50" fill="none"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="5" strokeLinecap="round"/>
            <rect x="20" y="100" width="80" height="70" rx="5"
                  fill="rgba(0,0,0,0.2)"/>
            <text x="60" y="130" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontSize="10" fontWeight="700" fill="white" opacity="0.9">FASHION</text>
            <text x="60" y="148" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                  fontSize="9" fill="white" opacity="0.6">STORE</text>
            <ellipse cx="22" cy="100" rx="5" ry="35" fill="white" opacity="0.12"/>
          </g>

          <g transform="translate(310,60)">
            <path d="M8 45 Q8 0 55 0 Q102 0 102 45 L112 230 Q112 250 92 250 L18 250 Q-2 250 -2 230 Z"
                  fill="url(#sb-bag2)" opacity="0.95"/>
            <path d="M8 45 Q8 0 55 0 Q102 0 102 45 L112 230 Q112 250 92 250 L18 250 Q-2 250 -2 230 Z"
                  fill="url(#sb-shine)"/>
            <path d="M25 45 Q25 16 55 16 Q85 16 85 45" fill="none"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="5" strokeLinecap="round"/>
            <rect x="18" y="110" width="75" height="70" rx="5"
                  fill="rgba(0,0,0,0.2)"/>
            <text x="55" y="140" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontSize="10" fontWeight="700" fill="white" opacity="0.9">TECH</text>
            <text x="55" y="158" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                  fontSize="9" fill="white" opacity="0.6">STORE</text>
            <ellipse cx="20" cy="110" rx="4" ry="32" fill="white" opacity="0.12"/>
          </g>

          <g transform="translate(475,100)">
            <path d="M10 45 Q10 0 55 0 Q100 0 100 45 L110 215 Q110 232 92 232 L18 232 Q0 232 0 215 Z"
                  fill="url(#sb-bag3)" opacity="0.9"/>
            <path d="M10 45 Q10 0 55 0 Q100 0 100 45 L110 215 Q110 232 92 232 L18 232 Q0 232 0 215 Z"
                  fill="url(#sb-shine)"/>
            <path d="M26 45 Q26 17 55 17 Q84 17 84 45" fill="none"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="5" strokeLinecap="round"/>
            <rect x="18" y="95" width="73" height="70" rx="5"
                  fill="rgba(0,0,0,0.2)"/>
            <text x="55" y="125" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontSize="10" fontWeight="700" fill="#07090F" opacity="0.9">HOME</text>
            <text x="55" y="143" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                  fontSize="9" fill="#07090F" opacity="0.6">DECO</text>
          </g>
        </g>

        <ellipse cx="395" cy="342" rx="230" ry="22"
                 fill="#000" opacity="0.45" filter="url(#sb-blur-sm)"/>

        <g>
          <text x="60" y="410" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="56" fill="none"
                stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.4">SHOPPING</text>
          <text x="60" y="410" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="56" fill="white" opacity="0.9">SHOPPING</text>
          <text x="60" y="455" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="56" fill="#06B6D4" opacity="0.85" filter="url(#sb-glow)">FESTIVAL</text>
        </g>

        <g transform="translate(570,360)">
          <rect x="0" y="0" width="195" height="120" rx="18"
                fill="rgba(0,0,0,0.6)"
                stroke="rgba(6,182,212,0.35)" strokeWidth="1.5"/>
          <text x="97" y="28" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="10" fill="rgba(255,255,255,0.35)" letterSpacing="3">AHORRA HOY</text>
          <text x="97" y="70" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontWeight="800" fontSize="46" fill="#06B6D4" filter="url(#sb-glow)">30%</text>
          <text x="97" y="90" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
                fontSize="12" fill="rgba(255,255,255,0.45)">en compras seleccionadas</text>
          <rect x="25" y="100" width="145" height="14" rx="7"
                style={{ fill:"url(#sb-bag1)" }} opacity="0.8"/>
          <text x="97" y="112" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                fontSize="9" fontWeight="600" fill="#07090F">VER CUPONES</text>
        </g>

        {[
          {x:80,y:50,size:12,rot:15,color:"#06B6D4"},
          {x:700,y:40,size:10,rot:-20,color:"#F59E0B"},
          {x:720,y:340,size:8,rot:30,color:"#7C3AED"},
          {x:60,y:350,size:10,rot:-10,color:"#F59E0B"},
          {x:400,y:30,size:8,rot:45,color:"#06B6D4"},
          {x:750,y:200,size:7,rot:0,color:"#ec4899"},
        ].map((d,i) => (
          <g key={i} transform={`translate(${d.x},${d.y}) rotate(${d.rot})`} opacity="0.7">
            <polygon points={`0,-${d.size} ${d.size*0.35},-${d.size*0.35} ${d.size},0 ${d.size*0.35},${d.size*0.35} 0,${d.size} -${d.size*0.35},${d.size*0.35} -${d.size},0 -${d.size*0.35},-${d.size*0.35}`}
                     fill={d.color} opacity="0.6"/>
          </g>
        ))}

        <text x="400" y="488" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
              fontSize="11" fill="rgba(255,255,255,0.18)" letterSpacing="5">
          LA CUPONERA · COMPRAS &amp; MODA
        </text>

        <rect width="800" height="500" fill="none"
              stroke="#06B6D4" strokeWidth="1" strokeOpacity="0.07"/>
      </g>
    </svg>
  )
}
