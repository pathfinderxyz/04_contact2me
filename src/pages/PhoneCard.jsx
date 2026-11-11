import { Icon } from "../icons";

function href(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function PhoneCard({ person, compact = false, children }) {
  const links = [
    person.instagram && { label: "Instagram", href: href(person.instagram) },
    person.facebook && { label: "Facebook", href: href(person.facebook) },
    person.linkedin && { label: "LinkedIn", href: href(person.linkedin) },
    person.tiktok && { label: "TikTok", href: href(person.tiktok) },
    person.calendly && { label: "Agendar", href: href(person.calendly) },
    person.web && { label: "Sitio", href: href(person.web) },
  ].filter(Boolean);

  return (
    <article className={compact ? "phone" : "phone live"}>
      <div className="phone-cover">
        <span className="avatar xl">{initials(person.nombre)}</span>
      </div>
      <div className="phone-body">
        <h2>{person.nombre}</h2>
        <p className="titular">{person.titular}</p>
        {person.bio && <p className="bio">{person.bio}</p>}
        {person.whatsapp && (
          <a className="btn whatsapp" href={`https://wa.me/${person.whatsapp}`} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} />
            WhatsApp
          </a>
        )}
        {person.correo && (
          <a className="btn ghost" href={`mailto:${person.correo}`}>
            <Icon name="mail" size={18} />
            {person.correo}
          </a>
        )}
        {links.length > 0 && (
          <div className="link-list">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        )}
        {children}
      </div>
    </article>
  );
}
