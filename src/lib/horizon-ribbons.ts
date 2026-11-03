// Geometry and colour mixing adapted without path changes from Signal:
// public/horizon-ribbons.js at f19d53fff86eb67bd6e4a3907efe796cd054b54c.
// Render SVG on the server; do not import the graphics pipeline's canvas runtime.
export interface RibbonSurface {
  path: string
  points: [number, number, number, number]
  stops: [number, string][]
}

export const RIBBON_COLORS = Object.freeze({
  purple: '#32105A',
  ink: '#08040F',
  violet: '#A25CF2',
  white: '#FFFFFF',
  victoriaAccent: '#A8A8AD',
})

export function mixColor(a: string, b: string, t: number) {
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
  return (
    '#' +
    [0, 1, 2]
      .map((i) =>
        Math.round(channel(a, i) * (1 - t) + channel(b, i) * t)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}

const H = RIBBON_COLORS
const tones = {
  deep: mixColor(H.purple, H.ink, 0.6),
  violet: mixColor(H.purple, H.violet, 0.78),
  light: mixColor(H.violet, H.white, 0.55),
}

export function foldedRibbon(accent: string = H.victoriaAccent): RibbonSurface[] {
  const litAccent = mixColor(accent, H.white, 0.3)
  const shadeAccent = mixColor(accent, H.purple, 0.56)
  return [
    {
      path: 'M1160 90C960 140 730 245 690 410C650 575 930 650 1020 850L1190 735C1070 535 875 510 900 395C925 300 1085 290 1180 245Z',
      points: [700, 250, 1110, 630],
      stops: [
        [0, litAccent],
        [0.36, accent],
        [0.72, shadeAccent],
        [1, tones.deep],
      ],
    },
    {
      path: 'M690 410C680 520 835 555 925 620L1040 570C910 495 780 465 810 355Z',
      points: [720, 420, 960, 600],
      stops: [
        [0, tones.deep],
        [1, shadeAccent],
      ],
    },
    {
      path: 'M375-170C480 80 950 80 910 300C885 440 610 470 595 650C580 825 890 915 1100 1070L1220 860C945 700 790 705 805 595C820 500 1100 410 1120 245C1150 5 780-30 655-245Z',
      points: [510, 0, 1040, 500],
      stops: [
        [0, tones.light],
        [0.28, tones.violet],
        [0.56, H.purple],
        [0.8, tones.light],
        [1, tones.violet],
      ],
    },
    {
      path: 'M250-120C480-45 520 150 760 205C875 230 980 185 1100 185L1100 45C940 75 895 35 775 0C570-65 560-200 365-245Z',
      points: [370, -100, 900, 210],
      stops: [
        [0, tones.violet],
        [0.48, tones.light],
        [0.8, tones.violet],
        [1, H.purple],
      ],
    },
    {
      path: 'M595 650C580 800 900 915 1100 1070L1210 870C980 760 800 735 805 595C740 650 665 680 595 650Z',
      points: [610, 720, 1110, 1060],
      stops: [
        [0, tones.violet],
        [0.5, tones.light],
        [1, H.purple],
      ],
    },
  ]
}

export function ribbonSweep(accent: string = H.victoriaAccent): RibbonSurface[] {
  const colors = [
    [mixColor(accent, H.white, 0.35), accent, mixColor(accent, H.purple, 0.6)],
    [tones.light, tones.violet, H.purple, tones.light],
  ]
  const paths = [
    'M-120 330C140 70 360 225 590 70C800-80 980 155 1130 20L1130 210C900 380 795 110 620 225C355 420 215 260-120 520Z',
    'M-120 200C140 95 380 425 650 280C825 190 875 65 1130 150L1130 345C900 245 850 470 650 475C370 565 110 280-120 410Z',
  ]
  return paths.map((path, index) => ({
    path,
    points: [0, 90, 900, 450],
    stops: colors[index].map((color, i) => [i / (colors[index].length - 1), color]),
  }))
}
