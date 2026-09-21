import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HoneyBeeBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!window.THREE) window.THREE = THREE;

    let isMounted = true;

    const loadVanta = async () => {
      try {
        const module = await import('vanta/dist/vanta.net.min.js');
        const NET = module.default || module;

        if (isMounted && vantaRef.current && !vantaEffect.current && typeof NET === 'function') {
          vantaEffect.current = NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            vertexColors: false,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xf59e0b, // warm honey amber
            backgroundColor: 0xfffdf8,
          });
        }
      } catch (err) {
        console.warn('Vanta background effect could not be loaded:', err);
      }
    };

    loadVanta();

    return () => {
      isMounted = false;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full z-[-1]"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default HoneyBeeBackground;
