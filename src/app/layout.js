import { Archivo, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"]
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://thekeysvibe.com",
  ),
  title: {
    default: "The Keys Vibe | Boutique Florida Keys Rentals",
    template: "%s",
  },
  description:
    "Handpicked, dockside vacation homes in the Florida Keys. Private docks, ocean access, and a concierge that handles the rest.",
  keywords: [
    "Florida Keys vacation rentals",
    "Key Largo rentals",
    "dockside vacation homes",
    "The Keys Vibe",
  ],
  openGraph: {
    type: "website",
    siteName: "The Keys Vibe",
    title: "The Keys Vibe | Boutique Florida Keys Rentals",
    description:
      "Handpicked, dockside vacation homes in the Florida Keys with concierge support.",
    images: ["/images/hero-bg.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
