import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://calle-fuego.vercel.app"),
  title: {
    default: "Calle Fuego | Smashburgers en Barcelona",
    template: "%s · Calle Fuego",
  },
  description:
    "Smashburgers, patatas trufadas y actitud gamberra en el corazón de El Born, Barcelona. Pide en local o a domicilio y gana Fire Coins con cada pedido.",
  openGraph: {
    title: "Calle Fuego | Smashburgers en Barcelona",
    description: "Smashburgers y actitud gamberra en El Born, Barcelona.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${bebasNeue.variable} ${inter.variable} font-body antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
        <Toaster
          position="bottom-center"
          theme="dark"
          toastOptions={{
            style: {
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f5f5f5",
            },
          }}
        />
      </body>
    </html>
  );
}