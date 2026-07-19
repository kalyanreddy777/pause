import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";

const effectsData = [
  {
    title: "Sleep",
    subtitle: "Your brain never clocks out.",
    content: "Blue light and endless scroll convince your body it's still daytime — long after your mind needed to rest.",
    icon: "🌙"
  },
  {
    title: "Attention Span",
    subtitle: "Built for seconds, not stories.",
    content: "Every swipe trains your brain to expect the next hit faster — until stillness feels unbearable.",
    icon: "⏱️"
  },
  {
    title: "Dopamine",
    subtitle: "The reward that never arrives.",
    content: "Each notification promises satisfaction. Each one leaves you wanting the next.",
    icon: "⚡"
  },
  {
    title: "Memory",
    subtitle: "Nothing sticks anymore.",
    content: "When everything is one tap away, your brain stops bothering to hold on to it.",
    icon: "🧠"
  },
  {
    title: "Relationships",
    subtitle: "Present, but not really.",
    content: "You're in the room. Your attention is somewhere else — refreshing, checking, waiting.",
    icon: "👥"
  },
  {
    title: "Anxiety",
    subtitle: "Silence feels like a threat.",
    content: "The itch to check, refresh, scroll — even when there's nothing new to see.",
    icon: "😰"
  },
  {
    title: "Self-Perception",
    subtitle: "Comparing yourself into a corner.",
    content: "A curated highlight reel becomes the measuring stick for an uncurated life.",
    icon: "🪞"
  }
];

function EffectCard({ effect, i, smoothProgress, totalCards }: { key?: React.Key, effect: any, i: number, smoothProgress: any, totalCards: number }) {
  const step = 0.8 / totalCards;
  const enterStart = 0.1 + i * step;
  const enterEnd = enterStart + step;

  const yInputs = [0, enterStart, enterEnd];
  const { innerHeight = 800 } = typeof window !== 'undefined' ? window : {};
  const startY = innerHeight * 1.5;
  const yOutputs = [startY, startY, 0];

  const scaleInputs = [0, enterStart, enterEnd];
  const scaleOutputs = [1, 1, 1];

  for (let j = i + 1; j < totalCards; j++) {
    const jEnd = 0.1 + (j + 1) * step;
    yInputs.push(jEnd);
    yOutputs.push(yOutputs[yOutputs.length - 1] - 32);

    scaleInputs.push(jEnd);
    scaleOutputs.push(scaleOutputs[scaleOutputs.length - 1] - 0.04);
  }

  yInputs.push(1);
  yOutputs.push(yOutputs[yOutputs.length - 1]);

  scaleInputs.push(1);
  scaleOutputs.push(scaleOutputs[scaleOutputs.length - 1]);

  const y = useTransform(smoothProgress, yInputs, yOutputs);
  const scrollScale = useTransform(smoothProgress, scaleInputs, scaleOutputs);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const hoverScale = useMotionValue(1);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.2 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springHoverScale = useSpring(hoverScale, springConfig);

  useEffect(() => {
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e; 
      if (beta !== null && gamma !== null) {
        // Map beta (-45 to 45) to -15 to 15 degrees
        const normalizedBeta = Math.max(-45, Math.min(45, beta - 45)) / 45; // Assume holding phone at 45 deg
        // Map gamma (-45 to 45) to -15 to 15 degrees
        const normalizedGamma = Math.max(-45, Math.min(45, gamma)) / 45;
        
        const rotateAmplitude = 14;
        rotateX.set(normalizedBeta * -rotateAmplitude);
        rotateY.set(normalizedGamma * rotateAmplitude);
      }
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [rotateX, rotateY]);

  const handleMouse = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotateAmplitude = 14;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  };

  const handleMouseEnter = () => {
    hoverScale.set(1.05);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    hoverScale.set(1);
  };

  return (
    <motion.div 
      className="absolute top-0 w-full h-[400px] md:h-[450px] [perspective:1000px] pointer-events-auto"
      style={{ 
        zIndex: i,
        transformOrigin: "top center",
        y,
        scale: scrollScale,
        willChange: "transform"
      }}
    >
      <motion.div
        className="w-full h-full flex flex-col justify-center bg-white text-[#1a1a1a] rounded-[32px] p-8 md:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-black/5"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springHoverScale,
          willChange: "transform"
        }}
        onPointerMove={handleMouse}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
      >
        <div className="flex flex-col gsap-fade-section">
          <div className="flex items-center gap-5 mb-6 md:mb-8 gsap-fade-item">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#F3F4ED] rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-inner shrink-0">
              {effect.icon}
            </div>
            <h3 className="font-instrument text-[36px] md:text-[56px] leading-none tracking-tight">{effect.title}</h3>
          </div>
          <h4 className="font-sans text-[20px] md:text-[26px] font-medium mb-3 md:mb-4 text-[#1a1a1a] gsap-fade-item">{effect.subtitle}</h4>
          <p className="font-sans text-[16px] md:text-[20px] text-[#6b7280] leading-[1.6] md:leading-[1.7] max-w-full md:max-w-[90%] gsap-fade-item">{effect.content}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EffectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001
  });

  const circleScale = useTransform(smoothProgress, [0, 0.1], [0, 3]);

  return (
    <div id="impact" className="relative w-full bg-white z-10 max-w-none">
      <div ref={containerRef} className="h-[700vh] w-full relative">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-12">

          <motion.div 
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full z-0 pointer-events-none" 
            style={{ 
              scale: circleScale,
              background: 'radial-gradient(circle, #DEF0FC 0%, rgba(222,240,252,0) 70%)'
            }}
          />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pointer-events-none pt-24 pb-12">
             <div className="relative w-full max-w-[750px] h-[400px] md:h-[450px]">
                {effectsData.map((effect, i) => (
                  <EffectCard 
                    key={i} 
                    effect={effect} 
                    i={i} 
                    smoothProgress={scrollYProgress} 
                    totalCards={effectsData.length} 
                  />
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
