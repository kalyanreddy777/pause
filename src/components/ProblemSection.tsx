import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    id: "01",
    title: "Time Loss",
    subtitle: "Time slips away faster than you realize.",
    content: [
      "Endless scrolling turns a few minutes into hours without you noticing.",
      "Constant notifications interrupt your attention throughout the day.",
      "Reduced productivity leaves less time for work, learning, and personal growth.",
      "Hobbies and passions slowly give way to digital entertainment.",
      "Precious moments become memories that never happened."
    ],
    visual: (
      <img 
        src="https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2000&auto=format&fit=crop" 
        alt="Time Loss" 
        className="w-full h-full object-cover" 
      />
    )
  },
  {
    id: "02",
    title: "Health Issues",
    subtitle: "Your body feels the effects long before you notice them.",
    content: [
      "Digital eye strain causes tired, dry, and irritated eyes.",
      "Poor posture leads to neck, shoulder, and back pain.",
      "Blue light interferes with healthy sleep patterns.",
      "Constant stimulation contributes to mental fatigue.",
      "Reduced movement impacts long-term physical health."
    ],
    visual: (
      <img 
        src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2000&auto=format&fit=crop" 
        alt="Health Issues" 
        className="w-full h-full object-cover" 
      />
    )
  },
  {
    id: "03",
    title: "Social Isolation",
    subtitle: "Being online doesn't always mean being connected.",
    content: [
      "Family conversations become shorter and less meaningful.",
      "Time with friends is replaced by scrolling through feeds.",
      "Outdoor experiences happen less often.",
      "Digital interactions begin replacing real relationships.",
      "Loneliness can grow despite constant online activity."
    ],
    visual: (
      <img 
        src="https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=2000&auto=format&fit=crop" 
        alt="Social Isolation" 
        className="w-full h-full object-cover" 
      />
    )
  },
  {
    id: "04",
    title: "Financial Impact",
    subtitle: "Small digital habits can become costly over time.",
    content: [
      "Impulse shopping becomes easier through targeted ads.",
      "In-app purchases quietly add up.",
      "Monthly subscriptions often go unused.",
      "Flash sales encourage unnecessary spending.",
      "Small expenses accumulate into significant financial loss."
    ],
    visual: (
      <img 
        src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop" 
        alt="Financial Impact" 
        className="w-full h-full object-cover" 
      />
    )
  },
  {
    id: "05",
    title: "Lost Balance",
    subtitle: "Life becomes smaller when every moment belongs to a screen.",
    content: [
      "Constant distractions make it difficult to stay focused.",
      "Fear of missing out creates the urge to keep checking your phone.",
      "Attention spans become shorter over time.",
      "Screen dependency replaces intentional choices.",
      "Real experiences are traded for endless digital content."
    ],
    visual: (
      <img 
        src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2000&auto=format&fit=crop" 
        alt="Lost Balance" 
        className="w-full h-full object-cover" 
      />
    )
  }
];

function ProblemRow({ problem }: { key?: React.Key, problem: any }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 85%", // Starts animating when top of row hits 85% of viewport
          toggleActions: "play none none reverse",
        }
      });

      tl.from(".anim-item", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1
      });

      tl.from(".anim-visual", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.8");

      tl.from(".anim-visual-img", {
        scale: 1.1,
        duration: 1.5,
        ease: "power3.out"
      }, "<");

    }, rowRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={rowRef}
      className="w-full grid grid-cols-1 lg:grid-cols-[25%_35%_1fr] items-start border-t border-[#EAEAEA] py-8 md:py-16 gap-y-5 md:gap-y-8 gap-x-8 lg:gap-x-16"
    >
      {/* Left Column: Number & Title */}
      <div className="flex flex-col items-start pt-2">
        <span className="anim-item font-sans text-[15px] tracking-wide mb-4 text-[#111111]">
          ({problem.id})
        </span>
        <h3 className="anim-item font-sans text-[32px] md:text-[36px] lg:text-[40px] leading-[1.1] font-medium tracking-tight text-[#111111] drop-shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {problem.title}
        </h3>
      </div>

      {/* Middle Column: Content List */}
      <div className="flex flex-col gap-2.5 pt-2">
        {problem.content.map((item: string, i: number) => (
          <p 
            key={i} 
            className="anim-item font-sans text-[15px] md:text-[16px] leading-[1.4] text-[#6B7280]"
          >
            {item}
          </p>
        ))}
      </div>

      {/* Right Column: Visual */}
      <div className="anim-visual w-full aspect-[16/10] lg:aspect-[1.6/1] rounded-[24px] overflow-hidden relative group bg-white border border-[#EFEFEF] shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <div className="anim-visual-img w-full h-full">
          {problem.visual}
        </div>
      </div>
    </div>
  );
}

export function ProblemSectionContent() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 py-8 md:py-24 flex flex-col">
      {problems.map((problem) => (
        <ProblemRow key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
