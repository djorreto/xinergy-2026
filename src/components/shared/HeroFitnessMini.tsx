/** Miniatura estática del gráfico “fitness” — solo móvil, debajo del copy */
export function HeroFitnessMini({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative mt-5 h-[3.75rem] w-full overflow-hidden lg:hidden ${className}`}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[#2e2838] to-transparent" />
      <svg
        viewBox="0 0 360 76"
        preserveAspectRatio="none"
        className="h-full w-full opacity-[0.72]"
      >
        <defs>
          <linearGradient id="mini-spend-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="45%" stopColor="rgba(232,92,78,0.08)" />
            <stop offset="100%" stopColor="rgba(88,178,118,0.1)" />
          </linearGradient>
          <linearGradient id="mini-ebitda-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(110,200,140,0.06)" />
            <stop offset="100%" stopColor="rgba(110,200,140,0.12)" />
          </linearGradient>
        </defs>

        {/* Rejilla sutil */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v-${i}`}
            x1={i * 60}
            y1={0}
            x2={i * 60}
            y2={76}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 28 + 8}
            x2={360}
            y2={i * 28 + 8}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
        ))}

        {/* GASTO */}
        <path
          d="M0,52 C40,50 70,48 90,54 S130,68 144,62 S170,44 158,38 S200,58 220,64 S260,70 280,48 S320,28 360,34 L360,76 L0,76 Z"
          fill="url(#mini-spend-fill)"
        />
        <path
          d="M0,52 C40,50 70,48 90,54 S130,68 144,62 S170,44 158,38 S200,58 220,64 S260,70 280,48 S320,28 360,34"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* EBITDA */}
        <path
          d="M0,38 C50,36 90,34 120,40 S150,52 158,48 S175,28 168,32 S195,18 220,22 S250,30 280,18 S310,8 360,14 L360,76 L0,76 Z"
          fill="url(#mini-ebitda-fill)"
        />
        <path
          d="M0,38 C50,36 90,34 120,40 S150,52 158,48 S175,28 168,32 S195,18 220,22 S250,30 280,18 S310,8 360,14"
          fill="none"
          stroke="rgba(125,215,155,0.75)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* SLA */}
        <path
          d="M0,44 C60,42 100,40 130,46 S160,54 168,50 S190,36 210,38 S250,42 290,32 S330,24 360,28"
          fill="none"
          stroke="rgba(150,195,255,0.55)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* Punto Xinergy */}
        <circle cx={158} cy={32} r={5} fill="rgba(252,161,0,0.35)" />
        <circle cx={158} cy={32} r={2.5} fill="rgba(255,220,160,0.9)" />

        {/* Labels mini */}
        <text x={8} y={18} fill="rgba(140,225,170,0.55)" fontSize={7} fontWeight={600}>
          EBITDA
        </text>
        <text x={52} y={18} fill="rgba(170,210,255,0.45)" fontSize={7} fontWeight={600}>
          SLA
        </text>
        <text x={8} y={66} fill="rgba(255,255,255,0.35)" fontSize={7} fontWeight={600}>
          GASTO
        </text>
      </svg>
    </div>
  );
}
