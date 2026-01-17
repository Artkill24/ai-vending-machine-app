'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterInsightProps {
  text: string;
  onComplete?: () => void;
}

export default function TypewriterInsight({ text, onComplete }: TypewriterInsightProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Speed: 15ms per character (cyberpunk fast typing)

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, isComplete, onComplete]);

  return (
    <div className="relative">
      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.8 }}
        animate={{ 
          opacity: [0.8, 0.3, 0.8],
          backgroundPosition: ['0% 0%', '0% 100%']
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03) 0px, transparent 1px, transparent 2px, rgba(0, 255, 255, 0.03) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Glitch overlay */}
      {!isComplete && (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          animate={{
            opacity: [0, 0.3, 0, 0.2, 0],
            x: [0, -2, 2, -1, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <div className="absolute inset-0 bg-cyan-400/10" style={{ clipPath: 'inset(20% 0 60% 0)' }} />
          <div className="absolute inset-0 bg-pink-400/10" style={{ clipPath: 'inset(60% 0 20% 0)' }} />
        </motion.div>
      )}

      {/* Text with neon glow */}
      <motion.div
        className="relative text-white leading-relaxed text-lg whitespace-pre-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="relative inline-block">
          {displayedText}
          {!isComplete && (
            <motion.span
              className="inline-block w-2 h-5 bg-cyan-400 ml-1"
              animate={{
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
              }}
            />
          )}
        </span>
      </motion.div>

      {/* Completion effect */}
      {isComplete && (
        <motion.div
          className="absolute -inset-4 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 1.5]
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-xl" />
        </motion.div>
      )}
    </div>
  );
}
