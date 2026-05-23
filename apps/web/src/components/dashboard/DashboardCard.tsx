import { motion } from "framer-motion";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;

  className?: string;
}

export default function DashboardCard({
  children,

  className = "",
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      whileHover={{
        y: -4,
      }}
      className={`rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </motion.div>
  );
}
