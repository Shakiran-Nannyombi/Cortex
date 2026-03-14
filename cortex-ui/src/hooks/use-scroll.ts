import { useState, useEffect } from 'react';

export function useScroll(threshold: number = 0, elementId?: string) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const element = elementId ? document.getElementById(elementId) : window;
    if (!element) return;

    const handleScroll = () => {
      const scrollY = element instanceof Window ? element.scrollY : (element as HTMLElement).scrollTop;
      setScrolled(scrollY > threshold);
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [threshold, elementId]);

  return scrolled;
}
