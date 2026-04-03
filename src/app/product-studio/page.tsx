'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface ProductImage {
  src: string
  x: number
  y: number
  scale: number
}

const CANVAS_SIZE = 1080

// Background style presets
const BG_PRESETS = {
  'Dark Drama': {
    topColor: '#0a0a0a',
    midColor: '#2a2a2e',
    bottomColor: '#e8e8ec',
    spotlightOpacity: 0.18,
    label: 'Dark Drama',
  },
  'Charcoal Luxe': {
    topColor: '#111116',
    midColor: '#363640',
    bottomColor: '#d8d8e0',
    spotlightOpacity: 0.22,
    label: 'Charcoal Luxe',
  },
  'Noir Silver': {
    topColor: '#050508',
    midColor: '#1e1e24',
    bottomColor: '#f0f0f4',
    spotlightOpacity: 0.25,
    label: 'Noir Silver',
  },
}

type PresetKey = keyof typeof BG_PRESETS

function drawBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  preset: (typeof BG_PRESETS)[PresetKey]
) {
  // Main vertical gradient: dark top → light bottom
  const mainGrad = ctx.createLinearGradient(0, 0, 0, size)
  mainGrad.addColorStop(0, preset.topColor)
  mainGrad.addColorStop(0.45, preset.midColor)
  mainGrad.addColorStop(1, preset.bottomColor)

  ctx.fillStyle = mainGrad
  ctx.fillRect(0, 0, size, size)

  // Radial spotlight from center — creates depth illusion
  const cx = size * 0.5
  const cy = size * 0.52
  const spotlightGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.72)
  spotlightGrad.addColorStop(0, `rgba(255,255,255,${preset.spotlightOpacity})`)
  spotlightGrad.addColorStop(0.5, 'rgba(255,255,255,0.04)')
  spotlightGrad.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = spotlightGrad
  ctx.fillRect(0, 0, size, size)

  // Edge vignette — darken corners
  const vigGrad = ctx.createRadialGradient(cx, cy, size * 0.3, cx, cy, size * 0.9)
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)')
  vigGrad.addColorStop(1, 'rgba(0,0,0,0.45)')

  ctx.fillStyle = vigGrad
  ctx.fillRect(0, 0, size, size)
}

export default function ProductStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activePreset, setActivePreset] = useState<PresetKey>('Charcoal Luxe')
  const [product, setProduct] = useState<ProductImage | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawBackground(ctx, CANVAS_SIZE, BG_PRESETS[activePreset])

    if (product) {
      const img = new window.Image()
      img.src = product.src
      img.onload = () => {
        ctx.save()
        const w = img.width * product.scale
        const h = img.height * product.scale
        ctx.drawImage(img, product.x - w / 2, product.y - h / 2, w, h)
        ctx.restore()
      }
    }
  }, [activePreset, product])

  useEffect(() => {
    render()
  }, [render])

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      setProduct({ src, x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2, scale: 0.7 })
    }
    reader.readAsDataURL(file)
  }

  function getCanvasPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_SIZE / rect.width
    const scaleY = CANVAS_SIZE / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!product) return
    const pos = getCanvasPos(e)
    dragOffset.current = { x: pos.x - product.x, y: pos.y - product.y }
    setIsDragging(true)
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDragging || !product) return
    const pos = getCanvasPos(e)
    setProduct((p) => p ? { ...p, x: pos.x - dragOffset.current.x, y: pos.y - dragOffset.current.y } : p)
  }

  function onMouseUp() {
    setIsDragging(false)
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (!product) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.95 : 1.05
    setProduct((p) => p ? { ...p, scale: Math.min(3, Math.max(0.1, p.scale * delta)) } : p)
  }

  function exportPNG() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `mbox-product-${activePreset.toLowerCase().replace(/ /g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function exportBG() {
    const offscreen = document.createElement('canvas')
    offscreen.width = CANVAS_SIZE
    offscreen.height = CANVAS_SIZE
    const ctx = offscreen.getContext('2d')!
    drawBackground(ctx, CANVAS_SIZE, BG_PRESETS[activePreset])
    const link = document.createElement('a')
    link.download = `mbox-background-${activePreset.toLowerCase().replace(/ /g, '-')}.png`
    link.href = offscreen.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h1 className="text-lg font-semibold tracking-wide">Product Studio</h1>
        <p className="text-xs text-white/40 mt-0.5">MBOX · Luxury Background Generator · 1080×1080</p>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Canvas Preview */}
        <div className="flex-1 flex items-center justify-center p-6 bg-[#111113]">
          <div className="relative" style={{ maxWidth: 540, maxHeight: 540, width: '100%' }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="w-full h-full rounded-xl shadow-2xl cursor-crosshair"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onWheel={handleWheel}
            />
            {!product && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-20">+</div>
                  <p className="text-xs text-white/30">Upload product image to compose</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-[#0d0d0f] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">

            {/* Background Presets */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Background Style</h2>
              <div className="space-y-2">
                {(Object.keys(BG_PRESETS) as PresetKey[]).map((key) => {
                  const p = BG_PRESETS[key]
                  return (
                    <button
                      key={key}
                      onClick={() => setActivePreset(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        activePreset === key
                          ? 'bg-white/15 border border-white/25'
                          : 'bg-white/5 border border-transparent hover:bg-white/8'
                      }`}
                    >
                      {/* Gradient swatch */}
                      <div
                        className="w-8 h-8 rounded-md flex-shrink-0"
                        style={{
                          background: `linear-gradient(to bottom, ${p.topColor}, ${p.midColor}, ${p.bottomColor})`,
                        }}
                      />
                      <span className="text-sm">{key}</span>
                      {activePreset === key && (
                        <span className="ml-auto text-white/60 text-xs">✓</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Product Image */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Product Image</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-lg border border-dashed border-white/20 text-sm text-white/50 hover:border-white/40 hover:text-white/70 transition-all"
              >
                {product ? '↺ Replace Image' : '+ Upload PNG / JPG'}
              </button>
              {product && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Scale</span>
                    <span>{Math.round(product.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={Math.round(product.scale * 100)}
                    onChange={(e) => setProduct((p) => p ? { ...p, scale: parseInt(e.target.value) / 100 } : p)}
                    className="w-full accent-white"
                  />
                  <p className="text-xs text-white/30 mt-1">Drag to reposition · Scroll to zoom</p>
                  <button
                    onClick={() => setProduct(null)}
                    className="w-full py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all"
                  >
                    Remove
                  </button>
                </div>
              )}
            </section>

          </div>

          {/* Export Buttons */}
          <div className="p-5 border-t border-white/10 space-y-2">
            <button
              onClick={exportBG}
              className="w-full py-2.5 rounded-lg bg-white/8 hover:bg-white/12 text-sm text-white/70 transition-all"
            >
              Export Background Only
            </button>
            <button
              onClick={exportPNG}
              className="w-full py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Export PNG 1080×1080
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
