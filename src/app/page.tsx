import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* La sección de Carta (con BranchedMenu) llega en la Fase 3 */}
      <section id="carta" className="min-h-screen" />
    </main>
  );
}