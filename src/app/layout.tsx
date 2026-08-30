import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Software Engineer at Octacore Solutions, Kathmandu. Android apps and games live on Google Play, plus Godot games, Ethereum contracts and machine learning work.";

export const metadata: Metadata = {
  // TODO Sohan: set NEXT_PUBLIC_SITE_URL to your real domain on Vercel so
  // the Open Graph image resolves to an absolute URL.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sohandhungel.vercel.app"
  ),
  title: {
    default: `${site.name} - Software Developer`,
    template: `%s - ${site.name}`,
  },
  description,
  authors: [{ name: site.name, url: site.github }],
  keywords: [
    "Sohan Dhungel",
    "Software Developer",
    "Flutter developer",
    "Software Engineer Nepal",
    "Octacore Solutions",
    "Kathmandu",
    "Nepal",
    "Godot",
    "Solidity",
    "Firebase",
  ],
  openGraph: {
    type: "profile",
    title: `${site.name} - Software Developer`,
    description,
    images: [{ url: "/portrait.jpg", width: 1080, height: 1080, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before paint so the stored theme never flashes. Kept inline
            (not a module) so it blocks nothing and runs before hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}",
          }}
        />
        {/* Reveals start at opacity 0 and are animated in by JS. Without JS
            they would never appear, so force them visible instead. */}
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-full bg-ink text-fg">{children}</body>
    </html>
  );
}
