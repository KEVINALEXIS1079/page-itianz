"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeInView({ children, delay = 0, direction = "up", className = "" }: { children: ReactNode, delay?: number, direction?: "up" | "left" | "right" | "none", className?: string }) {
  const getVariants = () => {
    switch(direction) {
      case "up": return { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
      case "left": return { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } };
      case "right": return { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } };
      default: return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
