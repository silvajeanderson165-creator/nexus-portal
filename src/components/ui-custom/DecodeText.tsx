import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export default function DecodeText({ text, className }: { text: string; className?: string }) {
  const [output, setOutput] = useState('');
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let iteration = 0;
    let interval: number | null = null;
    let isActive = false;

    const scramble = () => {
      clearInterval(interval as number);
      interval = window.setInterval(() => {
        setOutput(
          text.split('')
            .map((_char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        if (iteration >= text.length) {
          clearInterval(interval as number);
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
    <span ref={ref} className={className}>
      {output || text.replace(/./g, '_')}
    </span>
  );
}
