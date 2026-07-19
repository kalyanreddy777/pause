import beachImage from './assets/images/regenerated_image_1783677110077.png';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Network, Sparkles, Zap, TrendingUp, Menu, X } from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const messages = ["still scrolling?", "enough", "put it down."];

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
      className="hidden md:block fixed top-0 left-0 w-4 h-4 bg-[#0871E7] rounded-full pointer-events-none z-[99] mix-blend-difference"
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

function CustomCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { damping: 30, stiffness: 800, mass: 0.05 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('[role="button"]');
      scale.set(isInteractive ? 2.5 : 1);
    };

    window.addEventListener("pointermove", handleMouseMove);
    window.addEventListener("pointerdown", handleMouseMove);
    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerdown", handleMouseMove);
    };
  }, [mouseX, mouseY, scale]);

  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TrailDot key={i} mouseX={mouseX} mouseY={mouseY} index={i} />
      ))}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-4 h-4 bg-[#0871E7] rounded-full pointer-events-none z-[100] mix-blend-difference"
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

function ScrollMessages({ progress }: { progress: any }) {
  const [text, setText] = useState(messages[0]);
  
  useMotionValueEvent(progress, "change", (latest: number) => {
    if (latest < 0.33) {
      setText(messages[0]);
    } else if (latest < 0.66) {
      setText(messages[1]);
    } else {
      setText(messages[2]);
    }
  });

  return (
    <div className="absolute left-[48.41%] -translate-x-1/2 bottom-[33.47%] z-30 flex justify-center text-center pointer-events-none">
      <div className="font-nokia text-[#2A3616] text-[clamp(11px,1.2vw,16px)] leading-tight whitespace-nowrap min-h-[1.5em] inline-flex items-center justify-center">
        <span>{text}</span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-[0.3em] h-[1em] bg-[#2A3616] ml-[0.2em] shrink-0 inline-block"
        />
      </div>
    </div>
  );
}

function Navbar() {
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { damping: 50, stiffness: 200, mass: 0.5 });
  const [vh, setVh] = useState(1000);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    
    const target = document.querySelector(href);
    if (target) {
      // @ts-ignore
      if (window.lenis) {
        // @ts-ignore
        window.lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const sections = ["hero", "about", "manifesto", "impact", "balance"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerStart = vh * 2.625; 
  const triggerEnd = vh * 3.5;

  const paddingVertical = useTransform(smoothScrollY, [triggerStart, triggerEnd], ["20px", "8px"]);
  const paddingHorizontal = useTransform(smoothScrollY, [triggerStart, triggerEnd], ["16px", "24px"]);
  
  const maxWidth = useTransform(smoothScrollY, [triggerStart, triggerEnd], ["1200px", "740px"]);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "The Problem", href: "#manifesto" },
    { label: "Effects", href: "#impact" },
    { label: "Balance", href: "#balance" },
  ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] z-50 pointer-events-none flex flex-col items-center">
      <motion.nav 
        style={{ 
          paddingTop: paddingVertical, 
          paddingBottom: paddingVertical, 
          paddingLeft: paddingHorizontal,
          paddingRight: paddingHorizontal,
          maxWidth,
          width: "100%"
        }}
        animate={{
          height: mobileMenuOpen ? "auto" : 69.6
        }}
        className="pointer-events-auto rounded-[32px] flex flex-col justify-center border border-white/40 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        <div className="flex md:grid md:grid-cols-[1fr_auto_1fr] justify-between items-center w-full relative">
          <div className="flex justify-start">
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="font-instrument text-[28px] tracking-tight text-[#1a1a1a] leading-none mb-1 flex items-center hover:opacity-80 transition-opacity shrink-0 relative z-10">
              pause<span className="text-[#0871E7]">.</span>
            </a>
          </div>
          
          <div className="hidden md:flex gap-1 lg:gap-5 items-center justify-center w-full min-w-0">
            {navLinks.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              
              return (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className={`relative font-sans text-[13px] lg:text-[14px] transition-all duration-300 transform whitespace-nowrap px-3 lg:px-4 py-1.5 rounded-full group hover:-translate-y-[2px] ${isActive ? 'text-[#0871E7]' : 'text-[#1a1a1a] hover:text-[#0871E7]'}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute -inset-x-4 -inset-y-1.5 bg-black/[0.05] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-0" />
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -inset-x-4 -inset-y-1.5 bg-black/[0.08] rounded-full z-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>
          
          <div className="flex items-center justify-end gap-2 relative z-10">
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} className="text-[#1a1a1a]" /> : <Menu size={20} className="text-[#1a1a1a]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden flex flex-col gap-4 pt-6 pb-2 px-2"
            >
              {navLinks.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="font-sans text-[16px] text-[#1a1a1a] hover:opacity-70 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

function Hero({ onVideoLoaded }: { onVideoLoaded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e; // beta: front-back (-180 to 180), gamma: left-right (-90 to 90)
      if (beta !== null && gamma !== null) {
        // map beta (-45 to 45) to -1 to 1
        const normalizedBeta = Math.max(-45, Math.min(45, beta)) / 45;
        // map gamma (-45 to 45) to -1 to 1
        const normalizedGamma = Math.max(-45, Math.min(45, gamma)) / 45;
        mouseX.set(normalizedGamma);
        mouseY.set((normalizedBeta - 0.5)); // Offset slightly for comfortable viewing angle
      }
    };

    window.addEventListener("pointermove", handleMouseMove);
    window.addEventListener("pointerdown", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);
    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerdown", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [mouseX, mouseY]);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const x = useTransform(springX, [-1, 1], [-25, 25]);
  const y = useTransform(springY, [-1, 1], [-25, 25]);

  const scrollSpring = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001
  });

  const messagesProgress = useTransform(scrollSpring, [0, 0.75], [0, 1]);
  const heroScale = useTransform(scrollSpring, [0.75, 1], [1, 0.85]);
  const heroRadius = useTransform(scrollSpring, [0.75, 1], ["0px", "40px"]);

  return (
    <div id="hero" ref={containerRef} className="h-[350vh] bg-white relative z-20">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center overflow-hidden pointer-events-none">
        <motion.div 
          style={{ scale: heroScale, borderRadius: heroRadius }}
          className="relative w-full h-full overflow-hidden flex flex-col items-center pt-[140px] md:pt-24 origin-center bg-[#F3F4ED] pointer-events-auto"
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-1/2 w-[104vw] h-[58.5vw] min-w-[177.78vh] min-h-full @container"
              style={{ left: "50%", transform: "translate(-48.41%, -50%)" }}
            >
              <video 
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_054418_a6d194f0-ac86-4df9-abe5-ded73e596d7c.mp4"
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                onCanPlayThrough={onVideoLoaded}
              />
              <div className="absolute inset-0 z-10 bg-white/5" />
              <ScrollMessages progress={messagesProgress} />
            </div>
          </div>
          
          <div className="relative z-20 pointer-events-none text-center flex flex-col items-center w-full px-6 sm:px-4">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ x, y }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-instrument text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.85] tracking-tight text-[#1a1a1a] mb-3 sm:mb-4 lg:mb-5"
            >
              Fewer scrolls. <br /> More sunsets.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-[13px] sm:text-[14px] text-[#1a1a1a]/70 leading-relaxed font-normal max-w-[300px] sm:max-w-[340px] md:max-w-[400px] mx-auto"
            >
              Every notification is a tiny tug away from your own life. pause. is a daily nudge to look up, put the phone down, and notice what you're missing.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TextRevealContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollSpring = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001
  });

  const text = "One notification becomes one minute. One minute becomes one hour. Before you know it, you're watching life through a screen instead of living it. Sometimes, all it takes is a single pause to remember what you've been missing.";
  const words = text.split(" ");

  return (
    <div ref={containerRef} className="h-[250vh] flex flex-col items-center px-6 relative z-10 gsap-fade-section">
       <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center pt-24 pb-10">
         <div 
           className="font-instrument text-[40px] md:text-[56px] lg:text-[72px] font-normal tracking-tight text-[#272727] underline mb-4 md:mb-6 gsap-fade-item"
         >
           #About
         </div>
         <div className="w-full max-w-[1100px] text-center flex flex-wrap justify-center gap-x-[8px] gap-y-[4px] md:gap-x-[12px] md:gap-y-[8px]">
          {words.map((word, i) => {
            const start = (i / words.length) * 0.5;
            const end = start + 0.1;
            const opacity = useTransform(scrollSpring, [0, start, end, 1], [0.15, 0.15, 1, 1]);
            return (
              <motion.span key={i} style={{ opacity }} className="font-instrument text-[32px] md:text-[40px] lg:text-[52px] xl:text-[64px] tracking-tight text-[#1a1a1a] leading-[1.05]">
                {word}
              </motion.span>
            );
          })}
         </div>
       </div>
    </div>
  );
}

const splitCards = [
  {
    title: "The Habit",
    description: "One notification becomes one minute. One minute becomes one hour.",
    bg: "linear-gradient(180deg, #e4e4e4 0%, #c4c4c4 100%)",
    titleColor: "#111111",
    descColor: "rgba(17, 17, 17, 0.7)",
  },
  {
    title: "The Cost",
    description: "Every scroll quietly replaces conversations, sunsets, sleep, and the moments that make life meaningful.",
    bg: "linear-gradient(180deg, #2E65E5 0%, #1742A4 100%)",
    titleColor: "#ffffff",
    descColor: "rgba(255, 255, 255, 0.8)",
  },
  {
    title: "The Pause",
    description: "A healthier digital life begins with one simple decision—to look up and live in the moment.",
    bg: "linear-gradient(180deg, #242424 0%, #111111 100%)",
    titleColor: "#ffffff",
    descColor: "rgba(255, 255, 255, 0.7)",
  }
];

function SplitCard({ card, index, progress }: { key?: React.Key, card: any, index: number, progress: any }) {
  const splitOffset = index === 0 ? '-4%' : index === 2 ? '4%' : '0%';
  // Fan the cards so they overlap like a hand of cards
  const fanX = index === 0 ? '15%' : index === 2 ? '-15%' : '0%';
  
  const x = useTransform(
    progress,
    [0, 0.15, 0.4, 0.75, 1],
    ['0%', '0%', splitOffset, fanX, fanX]
  );

  const y = useTransform(
    progress,
    [0, 0.4, 0.75, 1],
    [0, 0, index === 1 ? -15 : 20, index === 1 ? -15 : 20]
  );

  const rotateZ = useTransform(
    progress,
    [0, 0.4, 0.75, 1],
    [0, 0, index === 0 ? -12 : index === 2 ? 12 : 0, index === 0 ? -12 : index === 2 ? 12 : 0]
  );

  const rotateY = useTransform(
    progress,
    [0, 0.3, 0.75, 1],
    [0, 0, 180, 180]
  );
  
  return (
    <motion.div
      style={{
        x, y, rotateZ,
        width: '33.333%',
        height: '100%',
        position: 'absolute',
        left: `${index * 33.333}%`,
        perspective: 1200,
        zIndex: index === 1 ? 20 : 10
      }}
      className={`group hover:z-50`}
    >
      <motion.div
        whileHover={{ y: -12, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ width: '100%', height: '100%' }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            rotateY
          }}
          className="transition-shadow duration-300 group-hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)] rounded-[24px]"
        >
        {/* Front Face (Image Part) */}
        <div 
          className="absolute inset-0 overflow-hidden bg-[#e0e0e0]"
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            zIndex: 2,
            borderTopLeftRadius: index === 0 ? '24px' : '0px',
            borderBottomLeftRadius: index === 0 ? '24px' : '0px',
            borderTopRightRadius: index === 2 ? '24px' : '0px',
            borderBottomRightRadius: index === 2 ? '24px' : '0px',
          }}
        >
          <img 
            src={beachImage}
            alt=""
            className="absolute top-0 h-full w-[300%] max-w-none object-cover pointer-events-none"
            style={{
              left: index === 0 ? '0%' : index === 1 ? '-100%' : '-200%'
            }}
          />
        </div>
        
        {/* Back Face (Info Card) */}
        <div 
          className="absolute inset-0 overflow-hidden p-6 md:p-8 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/10"
          style={{
            background: card.bg,
            transform: 'rotateY(180deg)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            borderRadius: '24px',
            zIndex: 1,
            textAlign: index === 2 ? 'right' : 'left'
          }}
        >
          {index === 0 && (
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <TrendingUp className="w-6 h-6 text-black/60" />
            </div>
          )}
          {index === 1 && (
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <div className="flex flex-col items-start gap-[2px]">
                <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                <div className="flex gap-[2px]">
                  <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                  <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                </div>
              </div>
            </div>
          )}
          {index === 2 && (
            <div className="absolute top-6 right-6 md:top-8 md:right-8">
              <Sparkles className="w-6 h-6 text-white/50" />
            </div>
          )}
          
          <div className={`flex flex-col h-full w-full ${index === 2 ? 'items-end' : 'items-start'}`}>
            <div className="flex-1" />
            
            <div className="mb-[15%] md:mb-[15%]">
               <h3 className="font-instrument text-[32px] md:text-[36px] tracking-tight whitespace-pre-line leading-[1.1]" style={{ color: card.titleColor }}>
                 {card.title}
               </h3>
            </div>
            
            <div className="pb-1 md:pb-2">
               <p className="text-[13px] md:text-[15px] leading-[1.5]" style={{ color: card.descColor, maxWidth: index === 0 ? '211px' : index === 2 ? '219px' : '220px' }}>
                 {card.description}
               </p>
            </div>
          </div>
        </div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}

function CardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 50,
    stiffness: 100,
    mass: 1,
    restDelta: 0.001
  });

  const titleOpacity = useTransform(smoothProgress, [0, 0.1, 0.3, 0.4], [0, 1, 1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.1, 0.3, 0.4], [20, 0, 0, -20]);
  

  return (
    <div className="w-full relative z-10">
      <div ref={containerRef} className="hidden md:block h-[350vh] w-full relative bg-white">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="relative w-[90vw] max-w-[1000px] aspect-[4/3] md:aspect-[2.2/1] max-h-[60vh]" style={{ perspective: '2000px' }}>
            {splitCards.map((card, i) => (
              <SplitCard 
                key={i} 
                card={card} 
                index={i} 
                progress={smoothProgress} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="block md:hidden w-full relative bg-[#fcfcfc] pb-32 pt-12 gsap-fade-section">
        <div className="px-4 mb-8 gsap-fade-item">
          <h2 className="font-instrument text-[36px] tracking-tight text-[#1a1a1a] leading-none mb-2 text-center">
             Where are you in your journey?
          </h2>
        </div>
        <div className="relative flex flex-col space-y-4 px-4 pb-[10vh]">
          {splitCards.map((card, i) => (
            <div 
              key={i}
              className="sticky overflow-hidden rounded-[24px] shadow-2xl flex flex-col w-full min-h-[350px] p-6 justify-between border border-white/10 gsap-fade-item"
              style={{ 
                top: `${120 + i * 20}px`,
                background: card.bg,
                zIndex: i + 10
              }}
            >
              <div className="mb-4">
                 {i === 0 && <TrendingUp className="w-6 h-6 text-black/60 mb-6" />}
                 {i === 1 && (
                    <div className="flex flex-col items-start gap-[2px] mb-6">
                      <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                      <div className="flex gap-[2px]">
                        <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                        <div className="w-[7px] h-[7px] rounded-full border-[1.5px] border-white/80" />
                      </div>
                    </div>
                 )}
                 {i === 2 && <Sparkles className="w-6 h-6 text-white/50 mb-6" />}
                 <h3 className="font-instrument text-[32px] tracking-tight leading-[1.1] mb-2" style={{ color: card.titleColor }}>
                   {card.title}
                 </h3>
                 <p className="text-[15px] leading-[1.5]" style={{ color: card.descColor }}>
                   {card.description}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div id="about" className="bg-[#fcfcfc] relative z-10 w-full">
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} 
      />
      <TextRevealContent />
      <CardsSection />
    </div>
  );
}

import { ProblemReveal } from "./components/ProblemReveal";

import { EffectsSection } from "./components/EffectsSection";
import { BalanceSection } from "./components/BalanceSection";

function ProblemSection() {
  return (
    <div id="manifesto" className="bg-[#FFFFFF] relative z-10 w-full">
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} 
      />
      
      <div className="relative z-10">
        <ProblemReveal />
      </div>
    </div>
  );
}

export default function App() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isVideoLoaded) {
      setLoadingProgress(100);
    }
  }, [isVideoLoaded]);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    
    // @ts-ignore
    window.lenis = lenis;

    // Hook Lenis into GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global GSAP fade up stagger
    const sections = gsap.utils.toArray('.gsap-fade-section');
    sections.forEach((section: any) => {
      const items = section.querySelectorAll('.gsap-fade-item');
      if (items.length > 0) {
        gsap.fromTo(items, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      }
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CustomCursor />
      <AnimatePresence>
        {!isVideoLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#F3F4ED] flex flex-col items-center justify-center"
          >
             <div className="font-instrument text-[32px] tracking-tight text-[#1a1a1a] animate-pulse flex items-center justify-center mb-6">
               pause<span className="text-[#0871E7]">.</span>
             </div>
             
             <div className="w-[120px] h-[2px] bg-black/5 rounded-full overflow-hidden mb-3 relative">
               <motion.div 
                 className="absolute top-0 left-0 bottom-0 bg-[#0871E7] rounded-full"
                 initial={{ width: "0%" }}
                 animate={{ width: `${loadingProgress}%` }}
                 transition={{ duration: 0.1, ease: "linear" }}
               />
             </div>
             <div className="font-sans text-[11px] font-medium text-[#1a1a1a]/40 tracking-widest uppercase">
               {Math.min(loadingProgress, 100).toString().padStart(2, '0')}%
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto">
        <Hero onVideoLoaded={() => setIsVideoLoaded(true)} />
        <AboutSection />
        <ProblemSection />
      </div>
      <EffectsSection />
      <BalanceSection />
    </div>
  );
}
