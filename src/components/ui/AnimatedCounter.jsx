import { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 1.2, formatter = (v) => v }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericTarget = typeof value === 'number' ? value : parseInt(value, 10);
    
    if (isNaN(numericTarget)) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const stepTime = 16; // ~60 FPS
    const totalSteps = Math.max(1, Math.floor((duration * 1000) / stepTime));
    const increment = (numericTarget - start) / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setDisplayValue(numericTarget);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start + increment * currentStep));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{typeof value === 'number' ? formatter(displayValue) : displayValue}</span>;
}
