const FONT_CONFIG = {
  roboto: {
    family: "Roboto",
    url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
    cssFamily: "'Roboto', sans-serif",
  },
  lato: {
    family: "Lato",
    url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
    cssFamily: "'Lato', sans-serif",
  },
  "open-sans": {
    family: "Open Sans",
    url: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap",
    cssFamily: "'Open Sans', sans-serif",
  },
  playfair: {
    family: "Playfair Display",
    url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
    cssFamily: "'Playfair Display', serif",
  },
  inter: {
    family: "Inter",
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    cssFamily: "'Inter', sans-serif",
  },
};

const loadedFonts = new Set();

export function getFontFamily(fontId) {
  return FONT_CONFIG[fontId]?.cssFamily || FONT_CONFIG.roboto.cssFamily;
}

export async function loadResumeFont(fontId) {
  const config = FONT_CONFIG[fontId] || FONT_CONFIG.roboto;
  if (loadedFonts.has(config.family)) return;

  const existing = document.querySelector(`link[data-resume-font="${config.family}"]`);
  if (!existing) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = config.url;
    link.setAttribute("data-resume-font", config.family);
    document.head.appendChild(link);
  }

  try {
    await document.fonts.load(`16px "${config.family}"`);
    await document.fonts.ready;
  } catch {
    // Continue with fallback fonts if Google Fonts fail to load
  }

  loadedFonts.add(config.family);
}
