"use client"

// Interface para cores vibrantes
export interface VibrantColor {
  r: number
  g: number
  b: number
  saturation: number
  brightness: number
  population: number
  hue: number
  colorName: string
  rawPixelCount: number
  dominanceScore?: number
}

// Classe SmartColorExtractor melhorada
export class SmartColorExtractor {
  static extractVibrantColors(imageData: ImageData): VibrantColor[] {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data

    const colorStats = new Map<
      string,
      {
        r: number
        g: number
        b: number
        count: number
        weight: number
        isVibrant: boolean
        visualImpact: number
        rawPixelCount: number
      }
    >()

    // Detectar se é uma imagem monocromática - CRITÉRIOS MAIS RIGOROSOS
    let totalPixels = 0
    let monochromaticPixels = 0
    let significantColorPixels = 0
    let colorfulPixels = 0

    // Primeira passagem: analisar se a imagem é monocromática - MUITO MAIS PERMISSIVO
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const alpha = data[i + 3]

        if (alpha < 200) continue
        totalPixels++

        const hsv = this.rgbToHsv(r, g, b)

        const isMonochromatic = hsv.s < 0.01 || hsv.v < 0.02 || hsv.v > 0.98
        const isSignificantColor = hsv.s > 0.03 && hsv.v > 0.1 && hsv.v < 0.98
        const isColorful = hsv.s > 0.05 && hsv.v > 0.15 && hsv.v < 0.95

        const hasBlueHint = hsv.h >= 180 && hsv.h <= 240 && hsv.s > 0.02 && hsv.v > 0.3

        if (isMonochromatic) monochromaticPixels++
        if (isSignificantColor || hasBlueHint) significantColorPixels++
        if (isColorful || hasBlueHint) colorfulPixels++
      }
    }

    const monochromaticRatio = monochromaticPixels / Math.max(1, totalPixels)
    const colorfulRatio = colorfulPixels / Math.max(1, totalPixels)

    const isMonochromaticImage = monochromaticRatio > 0.99 && colorfulRatio < 0.005
    const hasVeryFewColorfulPixels = colorfulPixels < totalPixels * 0.005

    if (isMonochromaticImage || hasVeryFewColorfulPixels) {
      return [
        {
          r: 30,
          g: 30,
          b: 30,
          saturation: 0,
          brightness: 0.12,
          population: 1000,
          rawPixelCount: 50000,
          hue: 0,
          colorName: "preto-elegante",
        },
        {
          r: 200,
          g: 200,
          b: 200,
          saturation: 0,
          brightness: 0.78,
          population: 800,
          rawPixelCount: 40000,
          hue: 0,
          colorName: "cinza-claro",
        },
      ]
    }

    // Analisar pixel por pixel com foco em cores mais saturadas
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const alpha = data[i + 3]

        if (alpha < 200) continue

        const hsv = this.rgbToHsv(r, g, b)

        if (hsv.v < 0.02 || hsv.v > 0.99) continue

        const isBlueish = hsv.h >= 180 && hsv.h <= 240
        const isLightBlue = hsv.h >= 200 && hsv.h <= 220
        const isPinkish = hsv.h >= 300 && hsv.h <= 360 && hsv.s > 0.02

        if (isBlueish || isLightBlue) {
          if (hsv.s < 0.01) continue
        } else if (isPinkish) {
          if (hsv.s < 0.02) continue
        } else {
          if (hsv.s < 0.05) continue
        }

        const centerWeight = this.getCenterWeight(x, y, width, height)
        const saturationWeight = Math.pow(hsv.s, isMonochromaticImage ? 2 : 1.2) * (isMonochromaticImage ? 5 : 2)
        const brightnessWeight = hsv.v > 0.2 && hsv.v < 0.9 ? 1.5 : 1

        const isVibrant = this.isVibrantColor(r, g, b, hsv)
        const vibrantWeight = isVibrant ? (isMonochromaticImage ? 10 : 3) : 1

        const uniqueColorWeight = isMonochromaticImage && hsv.s > 0.4 ? 3 : 1
        const visualImpact = hsv.s * hsv.v * (isVibrant ? 2 : 1) * uniqueColorWeight

        const tolerance = hsv.s > 0.6 ? 10 : hsv.s > 0.3 ? 20 : 30

        const key = `${Math.floor(r / tolerance)}-${Math.floor(g / tolerance)}-${Math.floor(b / tolerance)}`

        const pixelWeight = centerWeight * saturationWeight * brightnessWeight * vibrantWeight * uniqueColorWeight

        if (colorStats.has(key)) {
          const existing = colorStats.get(key)!
          existing.count++
          existing.rawPixelCount++
          existing.weight += pixelWeight
          existing.visualImpact += visualImpact
          const total = existing.count
          existing.r = Math.round((existing.r * (total - 1) + r) / total)
          existing.g = Math.round((existing.g * (total - 1) + g) / total)
          existing.b = Math.round((existing.b * (total - 1) + b) / total)
          existing.isVibrant = existing.isVibrant || isVibrant
        } else {
          colorStats.set(key, {
            r,
            g,
            b,
            count: 1,
            rawPixelCount: 1,
            weight: pixelWeight,
            isVibrant,
            visualImpact,
          })
        }
      }
    }

    const candidateColors: VibrantColor[] = []

    for (const color of colorStats.values()) {
      if (color.count < 5) continue

      const hsv = this.rgbToHsv(color.r, color.g, color.b)

      candidateColors.push({
        r: color.r,
        g: color.g,
        b: color.b,
        saturation: hsv.s,
        brightness: hsv.v,
        hue: hsv.h,
        population: color.weight,
        rawPixelCount: color.rawPixelCount,
        colorName: this.getColorName(hsv.h, hsv.s, color.isVibrant),
      })
    }

    candidateColors.sort((a, b) => {
      const aIsVibrant = this.isVibrantColor(a.r, a.g, a.b, { h: a.hue, s: a.saturation, v: a.brightness }) ? 2000 : 0
      const bIsVibrant = this.isVibrantColor(b.r, b.g, b.b, { h: b.hue, s: a.saturation, v: b.brightness }) ? 2000 : 0

      const scoreA = aIsVibrant + a.saturation * 1000 + a.brightness * 500 + a.population
      const scoreB = bIsVibrant + b.saturation * 1000 + b.brightness * 500 + b.population

      return scoreB - scoreA
    })

    const finalColors: VibrantColor[] = []
    for (const color of candidateColors) {
      const isDuplicate = finalColors.some((existing) => {
        const colorDiff =
          Math.abs(color.r - existing.r) + Math.abs(color.g - existing.g) + Math.abs(color.b - existing.b)
        return colorDiff < 50
      })

      if (!isDuplicate) {
        finalColors.push(color)
      }

      if (finalColors.length >= 20) break
    }

    if (finalColors.length < 2) {
      const emergencyColors: VibrantColor[] = []

      for (const color of colorStats.values()) {
        if (color.count < 3) continue

        const hsv = this.rgbToHsv(color.r, color.g, color.b)

        if (hsv.s > 0.05 || hsv.v < 0.9) {
          emergencyColors.push({
            r: color.r,
            g: color.g,
            b: color.b,
            saturation: hsv.s,
            brightness: hsv.v,
            hue: hsv.h,
            population: color.weight,
            rawPixelCount: color.rawPixelCount,
            colorName: this.getColorName(hsv.h, hsv.s, color.isVibrant),
          })
        }
      }

      if (emergencyColors.length > 0) {
        finalColors.push(...emergencyColors.slice(0, 10))
      }

      if (finalColors.length < 2) {
        finalColors.push(
          {
            r: 30,
            g: 30,
            b: 30,
            saturation: 0,
            brightness: 0.12,
            population: 1000,
            rawPixelCount: 1000,
            hue: 0,
            colorName: "preto-elegante",
          },
          {
            r: 60,
            g: 60,
            b: 60,
            saturation: 0,
            brightness: 0.24,
            population: 800,
            rawPixelCount: 800,
            hue: 0,
            colorName: "cinza-escuro",
          },
        )
      }
    }

    return finalColors
  }

  private static getCenterWeight(x: number, y: number, width: number, height: number): number {
    const centerX = width / 2
    const centerY = height / 2
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
    const distance = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY))
    return Math.max(0.3, 1 - (distance / maxDistance) * 0.7)
  }

  private static isVibrantColor(r: number, g: number, b: number, hsv: { h: number; s: number; v: number }): boolean {
    const isPurpleMagenta = hsv.h >= 270 && hsv.h <= 330 && hsv.s > 0.3 && hsv.v > 0.2 && hsv.v < 0.95

    const isRedVibrant =
      ((hsv.h >= 0 && hsv.h <= 20) || (hsv.h >= 340 && hsv.h <= 360)) && hsv.s > 0.4 && hsv.v > 0.3 && r > 100

    const isRoseMagenta = hsv.h >= 300 && hsv.h <= 360 && hsv.s > 0.2 && hsv.v > 0.4 && r > g && r > b * 0.8

    const isGreenVibrant = hsv.h >= 80 && hsv.h <= 160 && hsv.s > 0.3 && hsv.v > 0.2 && g > r * 1.2 && g > b * 1.2

    const isBlueVibrant = hsv.h >= 180 && hsv.h <= 270 && hsv.s > 0.1 && hsv.v > 0.2 && b > r * 1.05 && b > g * 1.05

    const isClothingBlue = hsv.h >= 180 && hsv.h <= 240 && hsv.s > 0.08 && hsv.v > 0.25 && hsv.v < 0.9

    const isYellowOrange = hsv.h >= 20 && hsv.h <= 80 && hsv.s > 0.2 && hsv.v > 0.3

    const isPastelBlue = hsv.h >= 200 && hsv.h <= 220 && hsv.s > 0.05 && hsv.v > 0.4 && hsv.v < 0.95

    return (
      isPurpleMagenta ||
      isRedVibrant ||
      isRoseMagenta ||
      isGreenVibrant ||
      isBlueVibrant ||
      isYellowOrange ||
      isClothingBlue ||
      isPastelBlue
    )
  }

  private static getColorName(hue: number, saturation: number, isVibrant: boolean): string {
    if (isVibrant) {
      if (hue >= 270 && hue <= 300) return "🔮 Roxo Vibrante"
      if (hue >= 300 && hue <= 330) return "💖 Magenta Vibrante"
      if (hue >= 330 && hue <= 360) return "🌸 Rosa Vibrante"
      if (hue >= 0 && hue <= 20) return "🔴 Vermelho Vibrante"
      if (hue >= 20 && hue <= 45) return "🧡 Laranja Vibrante"
      if (hue >= 45 && hue <= 80) return "💛 Amarelo Vibrante"
      if (hue >= 80 && hue <= 160) return "💚 Verde Vibrante"
      if (hue >= 200 && hue <= 220) return "🩵 Azul Pastel"
      if (hue >= 160 && hue <= 200) return "💚 Verde Água"
      if (hue >= 200 && hue <= 270) return "💙 Azul Vibrante"
    }

    if (saturation < 0.2) return "⚪ Neutro"
    if (hue >= 270 && hue <= 300) return "💜 Roxo"
    if (hue >= 300 && hue <= 330) return "💖 Magenta"
    if (hue >= 330 && hue <= 360) return "🌸 Rosa"
    if (hue >= 0 && hue <= 30) return "❤️ Vermelho"
    if (hue >= 30 && hue <= 60) return "🧡 Laranja"
    if (hue >= 60 && hue <= 120) return "💛 Amarelo"
    if (hue >= 120 && hue <= 180) return "💚 Verde"
    if (hue >= 180 && hue <= 270) return "💙 Azul"
    return "🎨 Cor Única"
  }

  private static rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min
    let h = 0
    const s = max === 0 ? 0 : diff / max
    const v = max

    if (diff !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / diff + 2) / 6
          break
        case b:
          h = ((r - g) / diff + 4) / 6
          break
      }
    }
    return { h: h * 360, s, v }
  }

  // Método para extrair cores simples (compatibilidade com código anterior)
  static extractColors(
    imageData: ImageData,
  ): Array<{ r: number; g: number; b: number; population: number; hsl: [number, number, number] }> {
    const vibrantColors = this.extractVibrantColors(imageData)
    return vibrantColors.map((color) => ({
      r: color.r,
      g: color.g,
      b: color.b,
      population: color.population,
      hsl: [color.hue, color.saturation, color.brightness] as [number, number, number],
    }))
  }
}

export type { VibrantColor }
