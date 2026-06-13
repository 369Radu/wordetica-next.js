import {
  SOCIAL_LINKS,
  type SocialLink,
  type SocialNetworkId,
} from "@/data/social-links.config";
import { SocialIcon } from "./SocialIcon";
import "./social-links.scss";

interface SocialLinksProps {
  /** When set, only these networks are shown (order preserved). */
  networks?: SocialNetworkId[];
  /** When set, these links are used directly (overrides global config and networks). */
  links?: SocialLink[];
  size?: "md" | "lg";
  variant?: "icon" | "pill";
}

export function SocialLinks({
  networks,
  links,
  size = "md",
  variant = "icon",
}: SocialLinksProps) {
  const visibleLinks: SocialLink[] = links?.length
    ? links
    : !networks?.length
      ? SOCIAL_LINKS
      : networks
          .map((id) => SOCIAL_LINKS.find((l) => l.id === id))
          .filter((l): l is SocialLink => !!l);

  return (
    <ul
      className={`social-links${size === "lg" ? " social-links--lg" : ""}${
        variant === "pill" ? " social-links--pill" : ""
      }`}
      role="list"
    >
      {visibleLinks.map((link) => (
        <li key={link.id} role="listitem">
          {variant === "pill" ? (
            <a
              className="social-links__pill"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <a
              className="social-links__btn"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <SocialIcon icon={link.id} />
              <span className="social-links__label">{link.label}</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
