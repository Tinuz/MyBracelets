import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { OrganizationSchema } from "@/components/StructuredData";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "La Nina Bracelets - Handgemaakte Sieraden",
    template: "%s | La Nina Bracelets"
  },
  description: "Ontwerp je perfecte armband met onze interactieve designer. Premium handgemaakte sieraden met bedels, kralen en kettingen.",
  keywords: ["armbanden", "sieraden", "handgemaakt", "bedels", "kralen", "designer", "gepersonaliseerd"],
  authors: [{ name: "La Nina Bracelets" }],
  creator: "La Nina Bracelets",
  publisher: "La Nina Bracelets",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://laninabracelets.com",
    siteName: "La Nina Bracelets",
    title: "La Nina Bracelets - Handgemaakte Sieraden",
    description: "Ontwerp je perfecte armband met onze interactieve designer.",
    images: [
      {
        url: "https://laninabracelets.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "La Nina Bracelets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Nina Bracelets - Handgemaakte Sieraden",
    description: "Ontwerp je perfecte armband met onze interactieve designer.",
    images: ["https://laninabracelets.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <OrganizationSchema />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
