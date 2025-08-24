import React, { useEffect, useMemo, useState } from "react";
import "./FontPopup.css";

/** 1) Font catalog: add to this list anytime.
 *  - system fonts: no url
 *  - google fonts: provide a cssUrl (Google Fonts v2)
 */
const FONT_CATALOG = [
  // System-safe
  { name: "Roman",         family: "'Times New Roman', serif",      source: "system" },
  { name: "Arial",         family: "'Arial', sans-serif",            source: "system" },
  { name: "Georgia",       family: "'Georgia', serif",               source: "system" },
  { name: "Courier New",   family: "'Courier New', monospace",       source: "system" },
  { name: "Verdana",       family: "'Verdana', sans-serif",          source: "system" },
  { name: "Trebuchet MS",  family: "'Trebuchet MS', sans-serif",     source: "system" },
  { name: "Tahoma",        family: "'Tahoma', sans-serif",           source: "system" },
  { name: "Palatino",      family: "'Palatino Linotype', serif",     source: "system" },

  // Google fonts (examples)
  { name: "Inter",         family: "'Inter', sans-serif",            source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
  { name: "Poppins",       family: "'Poppins', sans-serif",          source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
  { name: "Roboto",        family: "'Roboto', sans-serif",           source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
  { name: "Montserrat",    family: "'Montserrat', sans-serif",       source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" },
  { name: "Lato",          family: "'Lato', sans-serif",             source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" },
  { name: "Merriweather",  family: "'Merriweather', serif",          source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" },
  { name: "Nunito",        family: "'Nunito', sans-serif",           source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" },
  { name: "Playfair",      family: "'Playfair Display', serif",      source: "google",
    cssUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" },
];

/** Inject a Google Fonts <link> once (no duplicates). */
function ensureGoogleFontLoaded(cssUrl) {
  if (!cssUrl) return;
  const id = "gf-" + btoa(cssUrl).replace(/=/g, "");
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }
}

/** Recent/selected persistence (so the chosen font stays on top) */
const RECENT_KEY = "resumix_recent_font";

const FontPopup = ({ onClose, onFontSelect }) => {
  // UI state
  const [queryInput, setQueryInput] = useState(""); // what user types
  const [query, setQuery] = useState("");           // committed search when clicking the button
  const [selected, setSelected] = useState(null);   // the pinned font card

  // Load last chosen font from localStorage (pin at top)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        const byName = FONT_CATALOG.find(f => f.name === saved);
        if (byName) {
          if (byName.source === "google") ensureGoogleFontLoaded(byName.cssUrl);
          setSelected(byName);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Search (only filters after click or Enter)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FONT_CATALOG.filter(f => f.name.toLowerCase().includes(q));
  }, [query]);

  // Render list with the selected one pinned on top (if present)
  const displayFonts = useMemo(() => {
    if (!selected) return filtered;
    const rest = filtered.filter(f => f.name !== selected.name);
    return [selected, ...rest];
  }, [filtered, selected]);

  // Handle select: load google font css if needed, pin to top, persist, and bubble up
  const chooseFont = (font) => {
    if (font.source === "google") ensureGoogleFontLoaded(font.cssUrl);
    setSelected(font);
    try { localStorage.setItem(RECENT_KEY, font.name); } catch {}
    onFontSelect?.(font.family); // parent can apply it to preview/page
  };

  // Submit search via the round icon button or Enter
  const commitSearch = (e) => {
    if (e?.preventDefault) e.preventDefault();
    setQuery(queryInput);
  };

  return (
    <div className="font-popup-overlay">
      <div className="font-popup">
        {/* Header */}
        <div className="font-popup-header">
          <h2>Fonts</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Search */}
        <form className="search-section" onSubmit={commitSearch}>
          <input
            type="text"
            className="font-search"
            placeholder="search"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            {/* magnifier icon (inline SVG) inside the round button */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {/* Selected (pinned) preview at the very top */}
        {selected && (
          <div className="font-selected">
            <div
              className="font-card selected"
              onClick={() => chooseFont(selected)}
              title="Currently selected"
            >
              <div className="font-preview" style={{ fontFamily: selected.family }}>
                Hello
              </div>
              <div className="font-name">{selected.name} • selected</div>
            </div>
          </div>
        )}

        {/* All fonts (filtered; selected will appear at index 0) */}
        <div className="font-grid">
          {displayFonts.map((font, index) => (
            <div
              key={`${font.name}-${index}`}
              className={`font-card${selected && font.name === selected.name ? " is-top" : ""}`}
              onClick={() => chooseFont(font)}
            >
              <div className="font-preview" style={{ fontFamily: font.family }}>
                Hello
              </div>
              <div className="font-name">{font.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontPopup;
