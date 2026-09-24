import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { AccountMenu, MobileAccountLinks } from "./AccountMenu";

export const NAV_LINKS = [
  { label: "Inicio", to: "/" },
  { label: "Servicios", to: "/servicios" },
  { label: "Áreas de trabajo", to: "/proyectos" },
  { label: "Equipo EEIVA", to: "/sobre-nosotros" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
        scrolled || open ? "border-line bg-canvas/85" : "border-transparent bg-canvas/40"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm xl:gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  className="text-text-muted transition-colors duration-200 hover:text-text"
                  activeProps={{ className: "text-text font-medium" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/contacto" className="btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            Solicitar consulta
          </Link>
          <AccountMenu />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-text lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-movil"
          aria-label="Navegación móvil"
          className="border-t border-line lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-text-muted transition-colors hover:text-text"
                  activeProps={{ className: "text-text font-medium" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 sm:hidden">
              <Link
                to="/contacto"
                onClick={() => setOpen(false)}
                className="btn-primary w-full px-5 py-3 text-sm"
              >
                Solicitar consulta
              </Link>
            </li>
            <MobileAccountLinks onNavigate={() => setOpen(false)} />
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
