"use client";
 
import { motion } from "motion/react";
import Grainient from "@/components/ui/Grainient";
import GradientText from "@/components/ui/GradientText";
 
export default function Hero() {
  return (
    <section id="inicio" className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Grainient
          color1="#ff8a00"
          color2="#1a0500"
          color3="#4d1300"
          timeSpeed={0.2}
          warpStrength={1.2}
          warpAmplitude={40}
          grainAmount={0.08}
          contrast={1.4}
          zoom={1.1}
        />
      </div>
 
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-background" /> 
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-fire-300"
        >
          Smashburgers · El Born, Barcelona
        </motion.span>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <GradientText
            colors={["#ff4d1c", "#ffb703", "#ff4d1c", "#ff8a00"]}
            animationSpeed={4}
            className="font-display text-6xl leading-none sm:text-8xl"
          >
            CALLE FUEGO
          </GradientText>
        </motion.div>
 
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-xl font-body text-lg text-foreground/80"
        >
          Doble smash, queso derretido y sin postureo. Así se hace una burger de verdad.
        </motion.p>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#carta"
            className="rounded-full bg-fire-500 px-8 py-3 font-semibold text-background transition-transform hover:scale-105"
          >
            Ver la carta
          </a>
          <a
            href="https://glovoapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-8 py-3 font-semibold text-foreground transition-colors hover:border-fire-500 hover:text-fire-500"
          >
            Pedir a domicilio
          </a>
        </motion.div>
      </div>
    </section>
  );
}
 