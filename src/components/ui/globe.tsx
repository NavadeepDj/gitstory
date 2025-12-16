"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

// Primary color oklch(0.488 0.243 264.376) converted to RGB (0-1 range)
// Approximately rgb(79, 70, 229) - blue/indigo
const PRIMARY_COLOR: [number, number, number] = [0.31, 0.27, 0.90]

const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [14.5995, 120.9842], size: 0.03 },
  { location: [19.076, 72.8777], size: 0.1 },
  { location: [23.8103, 90.4125], size: 0.05 },
  { location: [30.0444, 31.2357], size: 0.07 },
  { location: [39.9042, 116.4074], size: 0.08 },
  { location: [-23.5505, -46.6333], size: 0.1 },
  { location: [19.4326, -99.1332], size: 0.1 },
  { location: [40.7128, -74.006], size: 0.1 },
  { location: [34.6937, 135.5022], size: 0.05 },
  { location: [41.0082, 28.9784], size: 0.06 },
]

const LIGHT_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => { },
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: PRIMARY_COLOR,
  glowColor: [1, 1, 1],
  markers: MARKERS,
}

const DARK_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => { },
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 2,
  baseColor: [0.4, 0.4, 0.4],
  markerColor: PRIMARY_COLOR,
  glowColor: [0.1, 0.1, 0.1],
  markers: MARKERS,
}

export function Globe({
  className,
  config,
}: {
  className?: string
  config?: COBEOptions
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = resolvedTheme === "dark"

  // Handle mounting to avoid SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize the config based on theme
  const globeConfig = useMemo(() => {
    if (config) return config
    return isDark ? DARK_GLOBE_CONFIG : LIGHT_GLOBE_CONFIG
  }, [config, isDark])

  let phi = 0
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    // Only create globe on client side when mounted
    if (!mounted || !canvasRef.current) return

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    // Reset phi when recreating globe
    phi = 0

    const globe = createGlobe(canvasRef.current!, {
      ...globeConfig,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.005
        state.phi = phi + rs.get()
        state.width = width * 2
        state.height = width * 2
      },
    })

    // Small delay to allow the canvas to render with proper colors before showing
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    }, 50)

    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, globeConfig, mounted])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
