'use client'

import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

export function LoadingFillText() {
  const progress = useMockLoading()
  const clipPath = useTransform(
    progress,
    [0, 1],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  )

  return (
    <div className="container">
      <div className="text-container">
        <div className="text text-bg" aria-hidden>
          Chargement
        </div>
        <motion.div className="text text-fill" style={{ clipPath }}>
          Chargement
        </motion.div>
      </div>
      <StyleSheet />
    </div>
  )
}

/**
 * ==============   Utils   ================
 */
function useMockLoading() {
  const progress = useSpring(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = progress.get() + Math.random() * 0.2

      if (newProgress >= 1) {
        clearInterval(interval)
      }

      progress.set(newProgress)
    }, 500)

    return () => clearInterval(interval)
  }, [progress])

  return progress
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
            @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap');

            .container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .text-container {
                position: relative;
                font-size: 16px;
                font-weight: bold;
            }

            .text {
                position: relative;
                color: #ff0088;
                font-family: "Unbounded", sans-serif;
                font-optical-sizing: auto;
                font-weight: 900;
                font-style: normal;
                text-transform: uppercase;
                font-size: 32px;
                letter-spacing: -0.06em;
            }

            .text-bg {
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0.2;
            }

            .text-fill {
                position: relative;
                clip-path: inset(0 100% 0 0);
                will-change: clip-path;
                z-index: 1;
            }
            `}
    </style>
  )
}
