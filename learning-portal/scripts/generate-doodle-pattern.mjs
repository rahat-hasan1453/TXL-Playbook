// Builds public/patterns/ux-doodle.svg: a tileable wallpaper of faint UX-design doodles
// (WhatsApp-style) used behind the learning path. Re-run after changing the icon list:
//   node scripts/generate-doodle-pattern.mjs
import fs from "fs"
import path from "path"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import * as Lucide from "lucide-react"

const ICONS = [
  "PenTool", "MousePointer2", "LayoutGrid", "Palette", "Lightbulb", "Ruler", "Component",
  "Type", "StickyNote", "Smartphone", "AppWindow", "Target", "UserRound", "ChartScatter",
  "SwatchBook", "Pointer", "Network", "MessageCircle", "Layers", "WandSparkles", "Eye",
  "Puzzle", "Presentation", "Shapes", "Frame", "PencilRuler", "Spline", "Brush",
]

const TILE = 420
const COLS = 6
const ROWS = 6
const SIZE = 26

let seed = 11
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280), seed / 233280)

const cell = TILE / COLS
const parts = []
let i = 0
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const name = ICONS[i++ % ICONS.length]
    const Icon = Lucide[name]
    if (!Icon) throw new Error(`Unknown lucide icon ${name}`)
    const x = c * cell + cell * (0.15 + rnd() * 0.45)
    const y = (r * TILE) / ROWS + (TILE / ROWS) * (0.15 + rnd() * 0.45)
    const rot = Math.round(rnd() * 50 - 25)
    // Render the icon, keep only its inner shapes, place them in the tile
    const inner = renderToStaticMarkup(createElement(Icon, { size: 24 })).replace(/^<svg[^>]*>|<\/svg>$/g, "")
    const s = SIZE / 24
    parts.push(
      `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot} ${SIZE / 2} ${SIZE / 2}) scale(${s.toFixed(3)})">${inner}</g>`
    )
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}" fill="none" stroke="#8ea0c4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${parts.join("")}</svg>\n`
const out = path.join(process.cwd(), "public", "patterns", "ux-doodle.svg")
fs.writeFileSync(out, svg)
console.log(`Wrote ${out} (${svg.length} bytes)`)
