import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(CustomEase, ScrollTrigger);

export function ProblemReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let splitPreloaderHeader: SplitType;
    let splitPreloaderCopy: SplitType;
    let splitHeader: SplitType;

    let ctx = gsap.context(() => {
      CustomEase.create("hop", "0.9, 0, 0.1, 1");

      splitPreloaderHeader = new SplitType(".preloader-header a", { types: "chars", charClass: "char" });
      splitPreloaderCopy = new SplitType(".preloader-copy p", { types: "lines", lineClass: "line" });
      splitHeader = new SplitType(".header-row h1", { types: "lines", lineClass: "line" });

      const chars = splitPreloaderHeader.chars;
      const lines = splitPreloaderCopy.lines;
      const headerLines = splitHeader.lines;

      const wrapElements = (elements: HTMLElement[] | null) => {
        if (!elements) return;
        elements.forEach(el => {
          const wrapper = document.createElement("div");
          wrapper.className = "split-mask";
          wrapper.style.overflow = "hidden";
          wrapper.style.display = "inline-block";
          wrapper.style.verticalAlign = "top";
          wrapper.style.paddingBottom = "0.2em";
          wrapper.style.marginBottom = "-0.2em";
          el.parentNode?.insertBefore(wrapper, el);
          wrapper.appendChild(el);
          el.style.display = "inline-block";
          el.style.transform = "translateY(0)";
          el.style.willChange = "transform";
        });
      };

      wrapElements(chars);
      wrapElements(lines);
      wrapElements(headerLines);

      if (!chars || chars.length === 0) return;

      const initialChar = chars[0];
      const lastChar = chars[chars.length - 1];

      chars.forEach((char, index) => {
        gsap.set(char, { yPercent: index % 2 === 0 ? -120 : 120 });
      });

      if (lines) gsap.set(lines, { yPercent: 120 });
      if (headerLines) gsap.set(headerLines, { yPercent: 120 });

      const preloaderImages = gsap.utils.toArray(".preloader-images .img");
      const preloaderImagesInner = gsap.utils.toArray(".preloader-images .img img");

      const tl = gsap.timeline({ 
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(".progress-bar", {
        scaleX: 1,
        duration: 4,
        ease: "power3.inOut",
      })
        .set(".progress-bar", { transformOrigin: "right" })
        .to(".progress-bar", {
          scaleX: 0,
          duration: 1,
          ease: "power3.in",
        });

      preloaderImages.forEach((preloaderImg: any, index) => {
        tl.to(
          preloaderImg,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: "hop",
            delay: index * 0.75,
          },
          "-=5"
        );
      });

      preloaderImagesInner.forEach((preloaderImageInner: any, index) => {
        tl.to(
          preloaderImageInner,
          {
            scale: 1,
            duration: 1.5,
            ease: "hop",
            delay: index * 0.75,
          },
          "-=5.25"
        );
      });

      if (lines) {
        tl.to(
          lines,
          {
            yPercent: 0,
            duration: 2,
            ease: "hop",
            stagger: 0.1,
          },
          "-=5.5"
        );
      }

      tl.to(
        chars,
        {
          yPercent: 0,
          duration: 1,
          ease: "hop",
          stagger: 0.025,
        },
        "-=5"
      );

      tl.to(
        ".preloader-images",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        },
        "-=1.5"
      );

      if (lines) {
        tl.to(
          lines,
          {
            y: "-125%",
            duration: 2,
            ease: "hop",
            stagger: 0.1,
          },
          "-=2"
        );
      }

      tl.to(
        chars,
        {
          yPercent: (index) => {
            if (index === 0 || index === chars.length - 1) {
              return 0;
            }
            return index % 2 === 0 ? 120 : -120;
          },
          duration: 1,
          ease: "hop",
          stagger: 0.025,
          delay: 0.5,
        },
        "-=2.5"
      );

      tl.set([initialChar.parentElement, lastChar.parentElement], { overflow: "visible" }, "-=2.0");

      tl.to(initialChar, {
        duration: 1,
        ease: "hop",
        x: () => {
          const isDesktop = window.innerWidth > 1000;
          const kerning = isDesktop ? 16 : 8; 
          const pMask = initialChar.parentElement!;
          const dotMask = lastChar.parentElement!;
          const headerEl = pMask.closest('.preloader-header') as HTMLElement;
          const containerCenter = headerEl.offsetWidth / 2;
          const totalWidth = pMask.offsetWidth + dotMask.offsetWidth - kerning;
          const targetPLeft = containerCenter - (totalWidth / 2);
          return targetPLeft - pMask.offsetLeft;
        },
      }, "-=2.0");

      tl.to(lastChar, {
        duration: 1,
        ease: "hop",
        x: () => {
          const isDesktop = window.innerWidth > 1000;
          const kerning = isDesktop ? 16 : 8; 
          const pMask = initialChar.parentElement!;
          const dotMask = lastChar.parentElement!;
          const headerEl = pMask.closest('.preloader-header') as HTMLElement;
          const containerCenter = headerEl.offsetWidth / 2;
          const totalWidth = pMask.offsetWidth + dotMask.offsetWidth - kerning;
          const targetDotLeft = containerCenter - (totalWidth / 2) + pMask.offsetWidth - kerning;
          return targetDotLeft - dotMask.offsetLeft;
        },
      }, "-=2.0");

      tl.set(".preloader-header", { mixBlendMode: "difference" }, "-=1.0");

      tl.to(".preloader-header", {
        x: () => {
          const navWidth = Math.min(window.innerWidth * 0.95, 1200);
          const navLeft = (window.innerWidth - navWidth) / 2;
          // Navbar padding is 16px initially
          const logoLeft = navLeft + 16; 
          
          const isDesktop = window.innerWidth > 1000;
          const kerning = isDesktop ? 16 : 8;
          const pMask = initialChar.parentElement!;
          const dotMask = lastChar.parentElement!;
          const totalWidth = pMask.offsetWidth + dotMask.offsetWidth - kerning;
          
          const startSize = isDesktop ? 7.5 * 16 : 4 * 16;
          const scale = 28 / startSize;
          
          // The logo width after scaling
          const scaledWidth = totalWidth * scale;
          // The center of the target logo
          const targetCenter = logoLeft + (scaledWidth / 2);
          
          // preloader-header is 100% wide, so its center is window.innerWidth / 2.
          return targetCenter - (window.innerWidth / 2);
        },
        y: () => {
          const isDesktop = window.innerWidth > 1000;
          const startY = window.innerHeight * (isDesktop ? 0.6 : 0.5);
          // Top of screen + 24px (top-6) + 34.8px (half of 69.6px navbar height)
          // = 58.8px from top of screen.
          // Navbar logo text-[28px] leading-none, so its height is 28px.
          // Target Y is the distance to move the preloader header so its center aligns with 58.8px.
          // Preloader header starts with translateY(60svh) / translateY(50svh).
          // And has transform-origin: top.
          // Since it's scaled by (28 / startSize), its final height is exactly 28px.
          // Its top will be 58.8px - 14px = 44.8px.
          return 44.8 - startY;
        },
        scale: () => {
          const isDesktop = window.innerWidth > 1000;
          const startSize = isDesktop ? 7.5 * 16 : 4 * 16;
          // We want the text to scale to match 28px exactly.
          return 28 / startSize;
        },
        duration: 1.75,
        ease: "hop",
      }, "-=1.0");

      tl.to(
        ".preloader",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.75,
          ease: "hop",
        },
        "-=0.5"
      );

      if (headerLines) {
        tl.to(
          headerLines,
          {
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.1,
          },
          "-=0.75"
        );
      }

      tl.to(
        ".divider",
        {
          scaleX: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.1,
        },
        "<"
      );

    }, containerRef);

    return () => {
      if (splitPreloaderHeader) splitPreloaderHeader.revert();
      if (splitPreloaderCopy) splitPreloaderCopy.revert();
      if (splitHeader) splitHeader.revert();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="problem-reveal-container">
      <div className="preloader">
        <div className="progress-bar"></div>

        <div className="preloader-images">
          <div className="img"><img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000&auto=format&fit=crop" alt="Phone screen glowing" /></div>
          <div className="img"><img src="https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1000&auto=format&fit=crop" alt="Hourglass time loss" /></div>
          <div className="img"><img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1000&auto=format&fit=crop" alt="Hunched posture" /></div>
          <div className="img"><img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1000&auto=format&fit=crop" alt="Empty moment" /></div>
        </div>

        <div className="preloader-copy">
          <p>
            Every notification is a tiny tug away from your own life —
            time lost, health strained, and moments quietly forgotten.
          </p>
        </div>
      </div>

      <div className="preloader-header">
        <a href="#">pause.</a>
      </div>

      <section className="hero">
        <div className="header-row">
          <div className="divider"></div>
          <h1>The Greatest Cost</h1>
        </div>

        <div className="header-row">
          <div className="divider"></div>
          <h1>Isn't The Hours</h1>
        </div>

        <div className="header-row">
          <div className="divider"></div>
          <h1>You'll Never Get Back</h1>
          <div className="divider last-divider"></div>
        </div>
      </section>

      <style>{`
        .problem-reveal-container {
          position: relative;
          font-family: "Inter", sans-serif;
          background-color: #fff;
          color: #000;
        }

        .problem-reveal-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .problem-reveal-container h1 {
          font-family: "Instrument Serif", serif;
          font-size: 8rem;
          line-height: 1;
          letter-spacing: -0.05em;
          margin: 0;
          font-weight: 400;
          text-transform: none;
        }

        .problem-reveal-container p {
          text-transform: uppercase;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0.05em;
        }

        .problem-reveal-container a {
          text-decoration: none;
          text-transform: none;
          color: #fff;
          font-family: "Instrument Serif", serif;
          font-size: 7.5rem;
          font-weight: 400;
          line-height: 1.15;
          display: block;
          letter-spacing: -0.02em;
          padding-bottom: 0.1em;
        }

        .preloader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100svh;
          background-color: #000;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          will-change: clip-path;
          overflow: hidden;
          z-index: 50;
        }

        .progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 7px;
          background-color: #fff;
          transform: scaleX(0);
          transform-origin: left;
          will-change: transform;
        }

        .preloader-images {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 25rem;
          height: 25rem;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          will-change: clip-path;
          overflow: hidden;
        }

        .preloader-images .img {
          position: absolute;
          width: 100%;
          height: 100%;
          clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
          will-change: clip-path;
          overflow: hidden;
        }

        .preloader-images .img img {
          position: relative;
          width: 100%;
          height: 100%;
          transform: scale(2);
          will-change: transform;
        }

        .preloader-copy {
          position: absolute;
          bottom: 5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 30%;
          color: #fff;
        }

        .preloader-header {
          position: absolute;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: translateY(60svh);
          transform-origin: top;
          will-change: transform;
          z-index: 51;
          pointer-events: none;
        }

        .problem-reveal-container .hero {
          position: relative;
          width: 100%;
          height: 100svh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background-color: #fff;
        }

        .header-row {
          margin-bottom: 0;
        }

        .header-row h1 {
          padding: 1.5rem 0;
        }

        .divider {
          position: relative;
          width: 100%;
          height: 1.5px;
          transform: scaleX(0);
          background-color: rgba(0, 0, 0, 0.2);
          will-change: transform;
        }

        .last-divider {
          margin-top: 0;
        }

        @media (max-width: 1000px) {
          .problem-reveal-container h1 {
            font-size: 3rem;
            letter-spacing: -0.02em;
          }

          .problem-reveal-container .hero {
            justify-content: center;
          }

          .preloader-images {
            top: 35%;
            width: 10rem;
            height: 10rem;
          }

          .preloader-copy {
            width: 80%;
          }

          .preloader-header {
            transform: translateY(50svh);
          }

          .problem-reveal-container a {
            font-size: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
