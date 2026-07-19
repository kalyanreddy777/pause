import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

function TrailDot({ mouseX, mouseY, index }: { key?: React.Key, mouseX: any, mouseY: any, index: number }) {
  const springConfig = { 
    damping: 25 + index * 5, 
    stiffness: 700 - index * 100, 
    mass: 0.1 + index * 0.1 
  };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-[#0871E7] rounded-full pointer-events-none z-[99] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        opacity: 0.6 - index * 0.1,
        scale: 0.8 - index * 0.1,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}

export function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { damping: 30, stiffness: 800, mass: 0.05 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('[role="button"]');
      scale.set(isInteractive ? 2.5 : 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, scale]);

  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TrailDot key={i} mouseX={mouseX} mouseY={mouseY} index={i} />
      ))}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[#0871E7] rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          scale,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
