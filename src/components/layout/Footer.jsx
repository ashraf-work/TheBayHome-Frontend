import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--color-border)] bg-white"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={100}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <p className="mt-5 text-sm text-[var(--color-muted-foreground)] max-w-xs">
            We kaboom your beauty holiday instantly and memorable.
          </p>
        </div>

        <div>
          <h4 className="text-[var(--color-primary)] font-semibold text-lg mb-5">
            Resources
          </h4>
          <ul className="space-y-3 text-sm text-[var(--color-foreground)]">
            <li>
              <Link
                href="/things-to-do"
                className="hover:text-[var(--color-primary)]"
              >
                Things to do
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="hover:text-[var(--color-primary)]"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-[var(--color-primary)]"
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                className="hover:text-[var(--color-primary)]"
              >
                Properties
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--color-primary)] font-semibold text-lg mb-5">
            Terms
          </h4>
          <ul className="space-y-3 text-sm text-[var(--color-foreground)]">
            <li>
              <Link href="/privacy-policy" className="hover:text-[var(--color-primary)]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-[var(--color-primary)]">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--color-primary)] font-semibold text-lg mb-5">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm text-[var(--color-foreground)]">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[var(--color-primary)]" />{" "}
              +17864848484
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--color-primary)]" />{" "}
              cfonte7@icloud.com
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-3 text-[var(--color-foreground)]">
            <a aria-label="Facebook" href="#" className="hover:opacity-80">
              <Facebook className="h-5 w-5" />
            </a>
            <a aria-label="Instagram" href="#" className="hover:opacity-80">
              <Instagram className="h-5 w-5" />
            </a>
            <a aria-label="X" href="#" className="hover:opacity-80">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.244 2H21l-6.52 7.46L22 22h-6.91l-4.82-6.38L4.8 22H2l7-8L2.5 2h7.05l4.35 5.83L18.244 2zm-2.43 18h1.76L7.26 4H5.38l10.43 16z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className=" py-2 text-center bg-[var(--color-teal-top)] text-white font-semibold">
        Copyright {new Date().getFullYear()} &middot; All Rights Reserved
      </div>
    </footer>
  );
}
