export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="eyebrow">Hello, I’m</p>
          <h1 className="hero__title">Yumi</h1>
          <p className="hero__subtitle">a UX/UI Product Designer based in Hong Kong</p>
          <p className="hero__desc">
            As a Product UX/UI Designer specializing in B2B solutions, I design intuitive internal
            software and systems. I translate management requirements into user‑centered solutions,
            enhancing usability and streamlining workflows through user research and iterative design.
          </p>
        </div>
        <Illustration />
      </div>
    </section>
  );
}

function Illustration() {
  return (
    <div className="hero__art" aria-hidden>
      <svg viewBox="0 0 520 320" role="img" aria-label="Design illustration">
        <defs>
          <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4b79cf" />
            <stop offset="100%" stopColor="#6aa4f8" />
          </linearGradient>
        </defs>
        <rect x="40" y="40" width="440" height="260" rx="24" fill="url(#card)" />
        <rect x="90" y="90" width="340" height="12" rx="6" fill="#d9e6ff" />
        <rect x="90" y="120" width="200" height="12" rx="6" fill="#d9e6ff" />
        <rect x="90" y="150" width="280" height="12" rx="6" fill="#d9e6ff" />
        <rect x="90" y="200" width="180" height="80" rx="12" fill="#ffffff" opacity="0.95" />
        <circle cx="420" cy="80" r="14" fill="#80d0ff" />
        <g transform="translate(350 160)">
          <rect x="-20" y="-60" width="40" height="120" rx="12" fill="#ffd2e3" />
          <rect x="-6" y="-60" width="12" height="120" rx="6" fill="#ff6aa2" />
        </g>
      </svg>
    </div>
  );
}

export default Hero;

