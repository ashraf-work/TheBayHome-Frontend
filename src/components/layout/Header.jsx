"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  LogOut,
  Settings,
  CalendarCheck,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

const NAV = [
  { href: "/properties", label: "Properties" },
  { href: "/things-to-do", label: "Things to do" },
  { href: "/blogs", label: "Blogs" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));


  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <>
      {/* Top contact bar — NOT sticky */}
      <div
        className="bg-[var(--color-teal-top)] text-white text-sm"
        data-testid="header-top-bar"
      >
        <div className="mx-auto max-w-7xl px-5 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="tel:+13052656226"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              305.265.6226
            </a>

            <a
              href="mailto:hello@thekeysvibe.com"
              className="hidden sm:flex items-center gap-2 hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              hello@thekeysvibe.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="hover:opacity-90">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:opacity-90">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="TikTok" className="hover:opacity-90">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M16 3v3.2a5.8 5.8 0 0 0 4 1.6v3.1c-1.5 0-2.9-.4-4-1.2v6.5A6 6 0 1 1 10 10v3.2a3 3 0 1 0 3 3V3h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav — sticky */}
      <header className="sticky top-0 z-999 bg-white border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl px-5 h-20 flex items-center justify-between gap-6">
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

          <nav
            className="hidden lg:flex items-center gap-8"
            data-testid="primary-nav"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors relative py-2",
                  isActive(item.href) && "text-[var(--color-primary)]",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[var(--color-primary)] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
           

            {loading ? (
              <div className="flex items-center gap-3">

                {/* Button Skeleton */}
                <div className="h-11 w-28 rounded-full bg-gray-200 animate-pulse" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-28 flex items-center justify-end">
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                    data-testid="profile-menu-trigger"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback>
                        {<User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-[var(--color-foreground)]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem  onClick={() => router.push("/bookings")}>
                    <CalendarCheck className="h-4 w-4" />
                    My Bookings
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="h-4 w-4" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="outline"
                size="lg"
                data-testid="header-login-btn"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-secondary)]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile drawer — right side se slide */}
        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer panel */}
        <div
          className={cn(
            "lg:hidden fixed top-0 right-0 z-50 h-full w-full max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
          data-testid="mobile-menu"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-20 border-b border-[var(--color-border)]">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={80}
                style={{ width: "auto", height: "40px" }}
              />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-[var(--color-secondary)]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Drawer links */}
          <div className="px-5 py-6 space-y-1 overflow-y-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-lg text-base font-medium transition-colors hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]",
                  isActive(item.href)
                    ? "text-[var(--color-primary)] bg-[var(--color-secondary)]"
                    : "text-[var(--color-foreground)]",
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-4">
              
              {user ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/bookings" onClick={() => setMobileOpen(false)}>
                      My Bookings
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/settings" onClick={() => setMobileOpen(false)}>
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await logout();
                      setMobileOpen(false);
                      router.push("/");
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
