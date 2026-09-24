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
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xd97706, // refined warm honey amber
            backgroundColor: 0xfffdf8,
            points: 5.0, // Reduced by half from default 10.0 to 5.0 for clean visual space
            maxDistance: 17.0, // Refined connection line distance
            spacing: 20.0, // Wider spacing to prevent clustering and visual distraction
            showDots: true,
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
    <>
      {/* Vanta 3D particle canvas with halved particle count and 50% visual opacity */}
      <div
        ref={vantaRef}
        className="fixed inset-0 w-full h-full z-[-2] pointer-events-none transition-opacity duration-700"
        style={{ opacity: 0.5 }}
      />
      {/* Soft ambient contrast wash that guarantees text and UI clarity across all pages */}
      <div
        className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-gradient-to-b from-[#fffdf8]/60 via-[#fffdf8]/35 to-[#fffdf8]/75"
        style={{ pointerEvents: 'none' }}
      />
    </>
  );
};

export default HoneyBeeBackground;
