import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion } from 'framer-motion';

const FlipCover = ({ isBack = false, frontContent, backQuote, isFlipped, setIsFlipped }: any) => {
  return (
    <div 
      className="absolute inset-0 cursor-pointer"
      style={{ perspective: 1200 }}
      onPointerDown={(e) => {
        // Prevent page turn when clicking the center to flip
        // (will still allow page turn if dragging from the very edge where this div might not cover, but inset-0 covers all)
        // Actually, we shouldn't stop pointerDown blindly, otherwise users can't swipe the cover to open the book!
        // Let's just use onClick, and if the user drags, the click won't fire.
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? (isBack ? -180 : 180) : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Front */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          {frontContent}
          <div className="absolute bottom-6 left-0 w-full flex justify-center z-40">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500/70 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
              Tap to reveal
            </span>
          </div>
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 bg-[#f4f4f5] text-gray-900 flex flex-col items-center justify-center px-8 text-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"
          style={{ backfaceVisibility: 'hidden', transform: isBack ? "rotateY(-180deg)" : "rotateY(180deg)" }}
        >
          {/* Subtle texture for the back as well */}
          <div className="absolute inset-0 z-0 opacity-[0.3] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
          
          <p className="font-instrument italic text-[24px] md:text-[32px] leading-relaxed relative z-10 drop-shadow-sm mix-blend-multiply">
            "{backQuote}"
          </p>
          <span className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[#0871E7] font-bold relative z-10 mix-blend-multiply">
            {isBack ? "End of Journey" : "Before you begin"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

const steps = [
  {
    num: "01",
    title: "Notice",
    subtitle: "Awareness",
    text: "Before anything changes, you have to see it. Track where the hours actually go — not where you think they go.",
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "02",
    title: "Name the Trigger",
    subtitle: "Understand",
    text: "Boredom, anxiety, silence — something reaches for the phone before you decide to. Find that moment. That's where control starts.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "03",
    title: "Create Friction",
    subtitle: "Interrupt",
    text: "Move the app off your home screen. Turn off the badge. Charge the phone in another room. Small friction breaks big habits.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "04",
    title: "Replace, Don't Remove",
    subtitle: "Rebuild",
    text: "An empty habit slot gets filled again — usually by the same habit. Put something else there on purpose.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop"
  },
  {
    num: "05",
    title: "Protect the Quiet",
    subtitle: "Sustain",
    text: "Balance isn't a one-time fix. It's a boundary you keep choosing — one scroll-free hour, one real conversation, at a time.",
    image: "https://images.unsplash.com/photo-1445384763658-0400939829cd?q=80&w=800&auto=format&fit=crop"
  }
];

const Page = React.forwardRef((props: any, ref) => {
  return (
    <div className="page bg-white border border-black/10 overflow-hidden relative shadow-lg" ref={ref as any}>
      {/* Binding shadow - on mobile always left, on desktop dynamic */}
      <div className={`absolute top-0 bottom-0 from-black/10 to-transparent pointer-events-none z-10 w-[20px] md:w-[30px] transition-all duration-300 ${
        props.isLeft 
          ? 'left-0 bg-gradient-to-r md:left-auto md:right-0 md:bg-gradient-to-l' 
          : 'left-0 bg-gradient-to-r'
      }`} />
      
      <div className="w-full h-full flex flex-col bg-[#FAFAFA]">
        {props.children}
      </div>
      
      {/* Page number - on mobile always right, on desktop dynamic */}
      {props.number && (
        <div className={`absolute bottom-4 md:bottom-6 text-gray-400 font-mono text-xs z-20 transition-all duration-300 ${
          props.isLeft
            ? 'right-6 md:right-auto md:left-6'
            : 'right-6'
        }`}>
          {props.number}
        </div>
      )}
    </div>
  );
});

export function BalanceSection() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isFrontCoverFlipped, setIsFrontCoverFlipped] = React.useState(false);
  const [isBackCoverFlipped, setIsBackCoverFlipped] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div id="balance" className="relative w-full bg-[#f4f4f5] text-gray-900 py-32 md:py-48 overflow-hidden z-10 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 relative flex flex-col items-center">
        
        <div className="mb-20 text-center gsap-fade-section">
          <h2 className="font-instrument text-[48px] md:text-[80px] leading-none tracking-tight mb-6 text-gray-900 gsap-fade-item">
            The Path to Balance
          </h2>
          <p className="text-gray-600 text-[18px] md:text-[22px] max-w-[600px] mx-auto font-sans gsap-fade-item">
            Flip through the guide to reclaiming your time.
          </p>
        </div>

        <div className="w-full max-w-[1000px] mx-auto flex justify-center items-center relative z-20 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          {/* @ts-ignore */}
          <HTMLFlipBook 
            width={isMobile ? 320 : 450} 
            height={isMobile ? 480 : 600} 
            size="stretch"
            minWidth={300}
            maxWidth={500}
            minHeight={450}
            maxHeight={700}
            maxShadowOpacity={0.3}
            showCover={true}
            mobileScrollSupport={true}
            usePortrait={true}
            className="mx-auto"
            style={{ margin: '0 auto' }}
          >
            {/* Cover */}
            <Page number="" isLeft={false}>
               <FlipCover
                 isBack={false}
                 isFlipped={isFrontCoverFlipped}
                 setIsFlipped={setIsFrontCoverFlipped}
                 backQuote="The space between stimulus and response is where your power lies."
                 frontContent={
                   <div className="absolute inset-0 bg-[#e8e8e8] z-20 text-gray-900 flex flex-col items-center justify-center text-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none">
                     
                     {/* Texture Layer */}
                     <div className="absolute inset-0 z-0 opacity-[0.3] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                     
                     {/* Base Gradient Layer */}
                     <div className="absolute inset-0 bg-gradient-to-r from-[#d4d4d4] via-[#f0f0f0] to-[#e8e8e8] z-0 opacity-80" />
                     
                     {/* Light Refraction / Glare */}
                     <div className="absolute -inset-1/2 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-60 z-10 transform rotate-12 translate-y-10 mix-blend-screen" />
                     <div className="absolute inset-0 bg-gradient-to-bl from-white/30 to-transparent z-10 mix-blend-screen" />
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.7)_0%,_transparent_50%)] z-10 mix-blend-screen" />

                     {/* Spine crease and shadow */}
                     <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-black/20 via-black/5 to-transparent z-30 mix-blend-multiply" />
                     <div className="absolute top-0 bottom-0 left-[2px] w-[2px] bg-white/70 z-30 mix-blend-overlay" />
                     <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-black/20 z-30 shadow-[1px_0_3px_rgba(255,255,255,0.8)]" />
                     
                     {/* Decorative Border */}
                     <div className="absolute inset-8 md:inset-10 border border-black/10 z-20 mix-blend-overlay" />

                     <div className="relative z-30 flex flex-col items-center px-4 ml-6">
                       <h1 className="font-instrument text-[70px] md:text-[90px] text-[#0871E7] leading-none drop-shadow-sm mix-blend-multiply">pause.</h1>
                       <div className="w-12 h-[2px] bg-[#0871E7]/40 my-6 md:my-8" />
                       <p className="text-gray-700 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold leading-loose drop-shadow-sm mix-blend-multiply">A Guide to Reclaiming<br/>Your Time</p>
                     </div>
                   </div>
                 }
               />
            </Page>

            {/* Intro Page (Inside Cover) */}
            <Page number="i" isLeft={true}>
              <div className="h-full flex flex-col justify-center px-8 md:px-12">
                <h2 className="font-instrument text-[32px] mb-6 text-gray-800">Introduction</h2>
                <p className="text-gray-500 text-[15px] leading-[1.8]">
                  Every notification is an interruption. Every infinite scroll is a trap designed to capture your most valuable resource: your attention.
                </p>
                <div className="w-8 h-[1px] bg-gray-200 my-6" />
                <p className="text-gray-500 text-[15px] leading-[1.8]">
                  This guide outlines the 5 essential boundaries required to take back control of your digital life.
                </p>
              </div>
            </Page>

            {/* Steps (5 pages) */}
            {steps.map((step, i) => {
               // Indices: Cover=0, Intro=1, Steps=2,3,4,5,6
               // Left pages are odd indices: 1, 3, 5
               // Right pages are even indices: 2, 4, 6
               const isLeft = (i + 2) % 2 !== 0; 
               return (
                 <Page key={i} number={i + 1} isLeft={isLeft}>
                   <div className="flex flex-col h-full relative">
                     <div className="h-2/5 w-full relative">
                        <img src={step.image} alt={step.title} className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAFAFA]" />
                     </div>
                     <span className="font-instrument text-[100px] text-[#0871E7] leading-none opacity-10 absolute top-4 left-4 pointer-events-none">
                        {step.num}
                     </span>
                     
                     <div className="flex-1 px-8 md:px-12 pb-12 flex flex-col justify-end relative z-10">
                       <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#0871E7] font-bold mb-3 block">
                          {step.subtitle}
                       </span>
                       <h3 className="font-instrument text-[28px] md:text-[32px] leading-[1.1] text-gray-900 mb-4 md:mb-6">
                          {step.title}
                       </h3>
                       <p className="font-sans text-[14px] md:text-[15px] leading-[1.6] md:leading-[1.8] text-gray-600">
                          {step.text}
                       </p>
                     </div>
                   </div>
                 </Page>
               );
            })}
            
            {/* Blank / Quote (Index 7, Left) */}
            <Page number="" isLeft={true}>
              <div className="w-full h-full flex flex-col items-center justify-center px-8 md:px-12 text-center">
                <p className="text-gray-800 font-instrument text-[28px] md:text-[32px] italic leading-relaxed">"Balance is a boundary<br/>you keep choosing."</p>
              </div>
            </Page>

            {/* Inside Back Cover (Index 8, Right) */}
            <Page number="" isLeft={false}>
              <div className="w-full h-full bg-[#FAFAFA]" />
            </Page>

            {/* Back Cover (Index 9, Left) */}
            <Page number="" isLeft={true}>
               <FlipCover
                 isBack={true}
                 isFlipped={isBackCoverFlipped}
                 setIsFlipped={setIsBackCoverFlipped}
                 backQuote="Take your time back. The world will wait."
                 frontContent={
                  <div className="absolute inset-0 bg-[#e8e8e8] z-20 flex items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none">
                     
                     {/* Texture Layer */}
                     <div className="absolute inset-0 z-0 opacity-[0.3] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
                     
                     {/* Base Gradient Layer */}
                     <div className="absolute inset-0 bg-gradient-to-l from-[#d4d4d4] via-[#f0f0f0] to-[#e8e8e8] z-0 opacity-80" />
                     
                     {/* Light Refraction / Glare */}
                     <div className="absolute -inset-1/2 bg-gradient-to-tl from-transparent via-white/50 to-transparent opacity-60 z-10 transform -rotate-12 translate-y-10 mix-blend-screen" />
                     <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent z-10 mix-blend-screen" />

                     {/* Spine crease and shadow */}
                     <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-black/20 via-black/5 to-transparent z-30 mix-blend-multiply" />
                     <div className="absolute top-0 bottom-0 right-[2px] w-[2px] bg-white/70 z-30 mix-blend-overlay" />
                     <div className="absolute top-0 bottom-0 right-6 w-[1px] bg-black/20 z-30 shadow-[-1px_0_3px_rgba(255,255,255,0.8)]" />

                     {/* Decorative Border */}
                     <div className="absolute inset-8 md:inset-10 border border-black/10 z-20 mix-blend-overlay" />
                     <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.3em] uppercase relative z-30 mr-6 font-bold mix-blend-multiply drop-shadow-sm">pause. © 2026</p>
                  </div>
                 }
               />
            </Page>
          </HTMLFlipBook>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-12 md:mt-16 italic">Drag corners or tap to flip pages</p>

      </div>
    </div>
  );
}
