import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-secondary/50 rounded-full h-3 mb-8 overflow-hidden relative">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-white/10" />
    </div>
  );
}
