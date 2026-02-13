"use client";

import { motion } from "framer-motion";

interface AnimatePageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatePage({ children, className, delay = 0 }: AnimatePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
