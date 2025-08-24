import React, { useMemo, useState } from "react";
import "./ColorPaletteModal.css";

/* ---------- Color helpers ---------- */
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const hexToRgb = (hex) => {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const rgbToHsl = ({ r, g, b }) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s; const l = (max + min) / 2, d = max - min;
  if (!d) { h = s = 0; }
  else {
    s = l > .5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};
const hslToHex = ({ h, s, l }) => {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if      (0 <= h && h < 60)  { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120){ r = x; g = c; b = 0; }
  else if (120<= h && h < 180){ r = 0; g = c; b = x; }
  else if (180<= h && h < 240){ r = 0; g = x; b = c; }
  else if (240<= h && h < 300){ r = x; g = 0; b = c; }
  else                        { r = c; g = 0; b = x; }
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2,"0");
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

/** Stable 5-step ramp (light→dark) for any color */
const buildShades = (hex) => {
  const { h, s } = rgbToHsl(hexToRgb(hex));
  const sat = clamp(s, 35, 90);
  const levels = [88, 74, 60, 46, 32];
  return { base: hex, shades: levels.map(l => hslToHex({ h, s: sat, l })) };
};

const QUICK_BASES = [
  "#ef4444","#f97316","#f59e0b","#eab308","#84cc16",
  "#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9",
  "#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef",
  "#ec4899","#f43f5e","#9ca3af","#6b7280","#111827"
];

/* ---------- Component ---------- */
const ColorPaletteModal = ({ onClose, onColorSelect }) => {
  const [baseColor, setBaseColor] = useState("#8b5cf6");
  const [hexInput, setHexInput]   = useState("#8b5cf6");
  const palette = useMemo(() => buildShades(baseColor), [baseColor]);

  const commitHex = () => {
    let v = hexInput.trim();
    if (!v) return;
    if (!v.startsWith("#")) v = "#" + v;
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return;
    setBaseColor(v);
  };

  const chooseShade = (hex) => {
    setBaseColor(hex);
    setHexInput(hex);
    const next = buildShades(hex);
    onColorSelect?.(hex, next); // apply clicked shade + provide palette
  };

  const applyCurrent = () => {
    const next = buildShades(baseColor);
    onColorSelect?.(next.shades[2], next); // middle shade by default
  };

  return (
    <div className="color-palette-modal-overlay">
      <div className="color-popup">
        <div className="color-popup-header">
          <h2>Color Palette</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Top controls */}
        <div className="color-top-row">
          <div className="color-preview" style={{ backgroundColor: baseColor }} />
          <input
            className="hex-input"
            value={hexInput}
            onChange={(e)=>setHexInput(e.target.value)}
            onKeyDown={(e)=> e.key === "Enter" && commitHex()}
            placeholder="#8b5cf6"
            aria-label="Hex color"
          />
          <button className="apply-btn" onClick={applyCurrent}>Apply</button>
        </div>

        {/* Wrapping quick chips */}
        <div className="quick-row">
          {QUICK_BASES.map(c => (
            <button
              key={c}
              className="quick-dot"
              title={c}
              style={{ backgroundColor: c }}
              onClick={() => { setBaseColor(c); setHexInput(c); }}
            />
          ))}
        </div>

        {/* Five generated shades */}
        <div className="color-swatch-container shades">
          {palette.shades.map((c, i) => (
            <button
              key={i}
              className="color-swatch"
              style={{ backgroundColor: c }}
              title={`${c} (shade ${i+1})`}
              onClick={() => chooseShade(c)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteModal;