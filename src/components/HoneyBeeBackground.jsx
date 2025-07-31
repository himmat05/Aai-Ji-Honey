import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const HoneyBeeBackground = () => {
    const vantaRef = useRef(null)
    const vantaEffect = useRef(null)

    useEffect(() => {
        if (!window.THREE) window.THREE = THREE

        let isMounted = true

        const loadVanta = async () => {
            const module = await import('vanta/dist/vanta.net.min.js')
            const NET = module.default || module

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
                    color: 0xf6b73c, // honey color
                    backgroundColor: 0xffffff,
                })
            }
        }

        loadVanta()

        return () => {
            isMounted = false
            if (vantaEffect.current) {
                vantaEffect.current.destroy()
                vantaEffect.current = null
            }
        }
    }, [])

    const bees = Array.from({ length: 5 })

    return (
        <div
            ref={vantaRef}
            className="fixed inset-0 w-full h-full z-[-1]"
            style={{ pointerEvents: 'none' }}
        >
            {bees.map((_, i) => (
                <img
                    key={i}
                    src="/vecteezy_bee-side-view-with_24589176.png"
                    alt="Honey Bee"
                    className={`absolute w-12 h-12 opacity-80 animate-fly-bee delay-${i * 200}`}
                    style={{
                        top: `${15 + i * 15}%`,
                        left: `${14 + i * 15}%`,
                        pointerEvents: 'none',
                    }}
                />
            ))}
        </div>
    )
}

export default HoneyBeeBackground
