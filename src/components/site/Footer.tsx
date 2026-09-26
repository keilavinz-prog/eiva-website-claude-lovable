import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS } from "./Header";
import type { CompanyInfo } from "@/lib/home-data";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/eeivainstalaciones",
    Icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100066451961767",
    Icon: Facebook,
  },
  { label: "X (Twitter)", href: "https://twitter.com/eeivainstalaci1", Icon: Twitter },
];

export function Footer({ company }: { company: CompanyInfo }) {
  const year = new Date().getFullYear();
  const contact = [
    { Icon: MapPin, value: company.address, href: undefined },
    {
      Icon: Phone,
      value: company.phone,
      href: company.phone ? `tel:${company.phone.replace(/\s+/g, "")}` : undefined,
    },
    {
      Icon: Mail,
      value: company.email,
      href: company.email ? `mailto:${company.email}` : undefined,
    },
    { Icon: Clock, value: company.schedule, href: undefined },
  ].filter((c) => c.value);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo className="text-2xl" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-muted">{company.slogan}</p>
          <ul className="mt-6 flex gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-text-muted transition-all duration-200 hover:border-electric/60 hover:text-electric hover:shadow-glow"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs text-electric">Contacto</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {contact.map(({ Icon, value, href }) => (
              <li key={value} className="flex gap-3 text-text-muted">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                {href ? (
                  <a href={href} className="transition-colors hover:text-text">
                    {value}
                  </a>
                ) : (
                  <span>{value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs text-electric">Enlaces rápidos</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-text-muted transition-colors hover:text-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-mono text-xs text-text-muted sm:flex-row sm:justify-between sm:px-8">
          <p>
            © {year} {company.name}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1">
            <Link to="/politica-privacidad" className="transition-colors hover:text-text">
              Política de Privacidad
            </Link>
            <Link to="/aviso-legal" className="transition-colors hover:text-text">
              Aviso Legal
            </Link>
            {company.cif ? <span>CIF {company.cif}</span> : null}
          </nav>
        </div>
      </div>
    </footer>
  );
}
