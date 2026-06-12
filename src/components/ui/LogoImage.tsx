'use client'

import { useEffect, useState } from 'react'

interface LogoImageProps {
  width: number
  height: number
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export function LogoImage({ width, height, alt = 'OliWood', className, style }: LogoImageProps) {
  const [src, setSrc] = useState('/images/logo.png')

  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2]
        // Pure white → fully transparent
        if (r > 240 && g > 240 && b > 240) {
          d[i + 3] = 0
        // Near-white edge → partial transparency for smooth border
        } else if (r > 210 && g > 210 && b > 210) {
          const whiteness = (Math.min(r, g, b) - 210) / 30
          d[i + 3] = Math.round((1 - whiteness) * d[i + 3])
        }
      }
      ctx.putImageData(imageData, 0, 0)
      setSrc(canvas.toDataURL('image/png'))
    }
    img.src = '/images/logo.png'
  }, [])

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={width} height={height} alt={alt} className={className} style={style} />
}
