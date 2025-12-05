// src/shared/components/Preloader.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

const TOTAL_LOAD_TIME = 2500; // 2.5 seconds
const EXIT_DURATION = 0.5;    // Fade-out transition time

// Framer Motion Variants for Text Animation
const containerVariants : Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.6,
    },
  },
};

const itemVariants : Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// 🛑 FIX: Define the props interface explicitly
interface PreloaderProps {
  children: React.ReactNode; // Must explicitly accept children
}

// 🛑 FIX: Apply the props interface to the component function
const Preloader = ({ children }: PreloaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Lock body scroll immediately
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      // Step 1: Trigger the fade-out animation
      setIsLoading(false); 
      
      // Step 2: Wait for the CSS exit animation to complete, then unlock scroll
      const unlockTimer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, EXIT_DURATION * 1000); 

      return () => clearTimeout(unlockTimer);
    }, TOTAL_LOAD_TIME);

    // Cleanup
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-gray-900"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: EXIT_DURATION, ease: "easeInOut" }
            }}
            role="status" 
            aria-live="polite"
          >
            {/* Logo and Text Animation Code (omitted for brevity, assume yours is here) */}
            <div className="flex items-center justify-center gap-1">
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: 0,
                  transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }
                }}
              >
                <Image src="/assets/WiggleLogo.png" alt="E" width={70} height={70} className="object-contain" priority />
              </motion.div>

              <motion.div 
                className="text-5xl font-extrabold text-[#3C48F6] flex overflow-hidden pb-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {"asyPost".split("").map((char, index) => (
                  <motion.span key={index} variants={itemVariants}>{char}</motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Renders the children (the rest of your application) */}
      {children}
    </>
  );
};

export default Preloader;