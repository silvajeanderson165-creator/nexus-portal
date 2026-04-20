import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Caracteres mais compactos para evitar overflow no mobile
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

export default function DecodeText({ text, className }: { text: string; className?: string }) {
  const [output, setOutput] = useState(text);
  const [decoded, setDecoded] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let iteration = 0;
    let interval: number | null = null;
    let isActive = false;

    const scramble = () => {
      clearInterval(interval as number);
      iteration = 0;
      interval = window.setInterval(() => {
        setOutput(
          text.split('')
            .map((_char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (text[index] === ' ') return ' ';
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        if (iteration >= text.length) {
          clearInterval(interval as number);
          setDecoded(true);
        }
        iteration += 1 / 3;
      }, 30);
    };

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        if (!isActive) {
          isActive = true;
          scramble();
        }
      },
    });

    return () => {
      clearInterval(interval as number);
      trigger.kill();
    };
  }, [text]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      {decoded ? text : output}
    </span>
  );
}
