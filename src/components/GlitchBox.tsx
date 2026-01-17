'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlitchBoxProps {
  children: ReactNode;
  delay?: number;
}

export default function GlitchBox({ children, delay = 0 }: GlitchBoxProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        y: 20,
        rotateX: -15,
      }}
      animate={{ 
        opacity: 1,
        y: 0,
        rotateX: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative"
    >
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.5, 0],
          x: [-3, 3, -2, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: 3,
          repeatDelay: 3,
        }}
      >
        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-screen" style={{ clipPath: 'inset(30% 0 50% 0)' }} />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.5, 0],
          x: [3, -3, 2, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: 3,
          repeatDelay: 3,
          delay: 0.1,
        }}
      >
        <div className="absolute inset-0 bg-pink-500/10 mix-blend-screen" style={{ clipPath: 'inset(50% 0 30% 0)' }} />
      </motion.div>
    </motion.div>
  );
}
