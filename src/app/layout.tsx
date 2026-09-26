import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Calle Fuego | Smashburgers en Barcelona",
  description:
    "Smashburgers, patatas trufadas y actitud gamberra en el corazón de El Born, Barcelona.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${bebasNeue.variable} ${inter.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}