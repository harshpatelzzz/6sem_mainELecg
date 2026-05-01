import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function AnimatedNumber({ value, decimals = 1, suffix = "" }) {
  const [currentValue, setCurrentValue] = useState(value || 0);
  const spring = useSpring(currentValue, { stiffness: 50, damping: 20 });
  
  const displayValue = useTransform(spring, (current) => {
    if (isNaN(current)) return "--";
    return current.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    if (value !== undefined && !isNaN(value)) {
      setCurrentValue(value);
      spring.set(value);
    }
  }, [value, spring]);

  if (value === undefined || value === null || isNaN(value)) {
    return <span className="text-mono">--{suffix}</span>;
  }

  return <motion.span className="text-mono">{displayValue}</motion.span>;
}
