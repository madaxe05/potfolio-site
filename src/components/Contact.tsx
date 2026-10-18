"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  GithubLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  CopyIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { site } from "@/data/site";
import { ContactForm } from "./ContactForm";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const socials = [
  { label: "GitHub", href: site.github, Icon: GithubLogoIcon },
  { label: "LinkedIn", href: site.linkedin, Icon: LinkedinLogoIcon },
  { label: "Instagram", href: site.instagram, Icon: InstagramLogoIcon },
];

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="section-shell">
        <div className="contact-layout">
          <Reveal>
            <p className="section-eyebrow">06 / Say hello</p>
            <SectionHeading>Good things start with a hello.</SectionHeading>
            <p className="section-description">
              Have a project in mind, a role to talk about, or an interesting
              idea? I’d love to hear it.
            </p>
            <div className="contact-email">
              <EnvelopeSimpleIcon size={24} aria-hidden />
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <button
                type="button"
                className="icon-button"
                aria-label={copied ? "Email copied" : "Copy email address"}
                onClick={copyEmail}
              >
                {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
              </button>
            </div>
            <span aria-live="polite" className="copy-status">
              {copied
                ? "Email copied to clipboard."
                : copyError
                  ? "Please select and copy the email address."
                  : "Prefer email? Write to me directly."}
            </span>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="contact-phone"
            >
              <PhoneIcon size={17} aria-hidden />
              {site.phone}
            </a>
            <div className="contact-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <s.Icon size={20} aria-hidden />
                  <span>{s.label}</span>
                  <ArrowUpRightIcon size={14} aria-hidden />
                </a>
              ))}
            </div>
            <p className="contact-location">
              Kathmandu, Nepal <span>UTC +5:45</span>
            </p>
          </Reveal>
          <Reveal index={1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
