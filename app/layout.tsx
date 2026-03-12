import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://deine-domain.de"),
  title: {
    default: "KI-Story-Generator",
    template: "%s | KI-Story-Generator",
  },
  description:
    "Magische Gute-Nacht-Geschichten für Kinder – liebevoll, kreativ und in Sekunden erstellt.",
  applicationName: "KI-Story-Generator",
  keywords: [
    "KI Geschichten",
    "Gute-Nacht-Geschichte",
    "Kindergeschichte",
    "Story Generator",
    "KI für Kinder",
    "Märchen Generator"
  ],
  authors: [{ name: "KI-Story-Generator" }],
  creator: "KI-Story-Generator",
  publisher: "KI-Story-Generator",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "KI-Story-Generator",
    description:
      "Erstelle magische Gute-Nacht-Geschichten für Kinder in wenigen Sekunden.",
    siteName: "KI-Story-Generator",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KI-Story-Generator",
    description:
      "Magische Gute-Nacht-Geschichten für Kinder – kreativ und liebevoll erzeugt.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
