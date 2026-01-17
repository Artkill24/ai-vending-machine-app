'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Stat {
  label: string;
  value: string;
  color: string;
  icon: string;
}

interface AnimatedStatsProps {
  stats: Stat[];
  delay?: number;
}

export default function AnimatedStats({ stats, delay = 0 }: AnimatedStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          stat={stat} 
          delay={delay + (index * 0.15)} 
        />
      ))}
    </div>
  );
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const [count, setCount] = useState(0);
  const targetValue = parseFloat(stat.value);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1 second
    const increment = targetValue / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: 0.5,
        y: 20,
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 20px ${stat.color}40`,
      }}
    >
      <p className="text-sm text-purple-300 mb-1">{stat.label}</p>
      <motion.p
        className={`text-2xl font-bold`}
        style={{ color: stat.color }}
        animate={{
          textShadow: [
            `0 0 10px ${stat.color}`,
            `0 0 20px ${stat.color}`,
            `0 0 10px ${stat.color}`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        {stat.icon} {isNaN(count) ? stat.value : count.toFixed(1)}
        {stat.value.includes('s') && 's'}
        {stat.value.includes('$') && ''}
        {stat.value.includes('USDC') && ' USDC'}
      </motion.p>
    </motion.div>
  );
}
