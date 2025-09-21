import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="brand" href="#home">Yumi</a>

        <nav className="nav__links" aria-label="Primary">
          <a href="#home" className="nav__link">Home</a>
          <details className="nav__link nav__dropdown">
            <summary>
              Portfolio
              <span aria-hidden>▾</span>
            </summary>
            <div className="nav__dropdown-menu">
              <a href="#projects">Projects</a>
            </div>
          </details>
          <a href="#resume" className="nav__link">Resume</a>
        </nav>

        <button className="nav__hamburger" aria-label="Menu" onClick={() => setIsMenuOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>

        {isMenuOpen && (
          <div className="nav__mobile">
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)}>Portfolio</a>
            <a href="#resume" onClick={() => setIsMenuOpen(false)}>Resume</a>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;

