import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

export function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(1000);

  useEffect(() => {
    const updateVh = () => setVh(window.innerHeight);
    updateVh();
    window.addEventListener('resize', updateVh);
    return () => window.removeEventListener('resize', updateVh);
  }, []);
  
  // Fades in when the user scrolls past the initial view of the Hero section
  const volumeTransform = useTransform(scrollY, [vh * 0.5, vh * 1.5], [0, 0.25]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        // Generate pink noise for a softer, more natural wind/ocean sound
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11; 
            b6 = white * 0.115926;
        }

        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Lowpass filter to muffle the pink noise, sounding like distant wind
        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 400;

        noiseNode.connect(lowpass);

        const gainNode = audioCtx.createGain();
        const initialVol = volumeTransform.get();
        gainNode.gain.value = initialVol;
        gainNodeRef.current = gainNode;

        lowpass.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start(0);
      } else {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      }
      setIsPlaying(true);
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    }
  };

  useMotionValueEvent(volumeTransform, "change", (latest) => {
    if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(latest, audioCtxRef.current.currentTime, 0.1);
    }
  });

  return (
    <button 
      onClick={toggleSound}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white/40 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/60 transition-colors"
      title={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
