export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <nav className="footer__links" aria-label="Footer">
          <a href="#home">Home</a>
          <a href="#resume">Resume</a>
          <a href="#">LinkedIn</a>
        </nav>
        <small className="footer__copy">© {new Date().getFullYear()} Yumi</small>
      </div>
    </footer>
  );
}

export default Footer;

