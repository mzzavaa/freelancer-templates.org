import React, { useState, useCallback, useRef, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import {
  COMPOSITIONS, COMP_BY_ID, CATEGORIES,
  TOTAL_COMPOSITIONS, TOTAL_TEMPLATE_TYPES,
  type CompSpec,
} from "./registry";
import { type BrandKit } from "@templates/_shared/themes";

// ── Color extraction from images ──────────────────────────────────

interface ExtractedColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

function extractColorsFromImage(imageData: ImageData): ExtractedColors {
  const pixels = imageData.data;
  const colorCounts: Map<string, number> = new Map();
  
  // Sample every 4th pixel for performance
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];
    
    if (a < 128) continue; // Skip transparent pixels
    
    // Quantize colors to reduce noise
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    
    const key = `${qr},${qg},${qb}`;
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  }
  
  // Sort by frequency
  const sorted = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}` };
    });
  
  // Filter out near-white and near-black colors for accent detection
  const vibrant = sorted.filter(c => {
    const brightness = (c.r + c.g + c.b) / 3;
    const saturation = Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b);
    return brightness > 30 && brightness < 225 && saturation > 30;
  });
  
  const darkColors = sorted.filter(c => (c.r + c.g + c.b) / 3 < 80);
  const lightColors = sorted.filter(c => (c.r + c.g + c.b) / 3 > 200);
  
  return {
    primary: vibrant[0]?.hex || sorted[0]?.hex || "#4a90d9",
    secondary: vibrant[1]?.hex || sorted[1]?.hex || "#64748b",
    accent: vibrant[2]?.hex || vibrant[0]?.hex || "#f59e0b",
    background: lightColors[0]?.hex || "#ffffff",
    text: darkColors[0]?.hex || "#1e293b",
  };
}

async function extractColorsFromImageUrl(url: string): Promise<ExtractedColors> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Scale down for performance
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(extractColorsFromImage(imageData));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

// ── URL param helpers ─────────────────────────────────────────────

function getCompFromUrl(): string {
  return new URLSearchParams(window.location.search).get("comp") ?? "";
}

function isEmbed(): boolean {
  return new URLSearchParams(window.location.search).get("embed") === "1";
}

/** Read brand color URL params and return a BrandKit, or undefined if none present.
 *  Params use bare hex values without the # prefix: brandPrimary=ff0000
 */
function getBrandKitFromUrl(): BrandKit | undefined {
  const params = new URLSearchParams(window.location.search);
  const primary   = params.get("brandPrimary");
  const secondary = params.get("brandSecondary");
  const accent    = params.get("brandAccent");
  const bg        = params.get("brandBg");
  const text      = params.get("brandText");
  if (!primary && !secondary && !accent && !bg && !text) return undefined;
  return {
    ...(primary   ? { primaryColor:   `#${primary}`   } : {}),
    ...(secondary ? { secondaryColor: `#${secondary}` } : {}),
    ...(accent    ? { accentColor:    `#${accent}`    } : {}),
    ...(bg        ? { bgColor:        `#${bg}`        } : {}),
    ...(text      ? { textColor:      `#${text}`      } : {}),
  };
}

function setCompInUrl(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("comp", id);
  window.history.replaceState({}, "", url.toString());
}

// ── Display helpers ───────────────────────────────────────────────

function formatCategory(cat: string): string {
  return cat.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

function formatCompName(id: string): string {
  const parts = id.split("-");
  return parts.slice(1).join(" - ");
}

// ── Brand Customizer Component ────────────────────────────────────

interface BrandCustomizerProps {
  brandKit: BrandKit | undefined;
  onBrandKitChange: (kit: BrandKit | undefined) => void;
  logoUrl: string | undefined;
  onLogoChange: (url: string | undefined) => void;
  savedBrands: SavedBrand[];
  onSaveBrand: (name: string) => void;
  onLoadBrand: (brand: SavedBrand) => void;
  onDeleteBrand: (name: string) => void;
}

const BrandCustomizer: React.FC<BrandCustomizerProps> = ({
  brandKit,
  onBrandKitChange,
  logoUrl,
  onLogoChange,
  savedBrands,
  onSaveBrand,
  onLoadBrand,
  onDeleteBrand,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [saveName, setSaveName] = useState("");
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (key: keyof BrandKit, value: string) => {
    onBrandKitChange({
      ...brandKit,
      [key]: value,
    });
  };

  const handleImagePaste = useCallback(async (dataUrl: string) => {
    onLogoChange(dataUrl);
    setIsExtracting(true);
    
    try {
      const colors = await extractColorsFromImageUrl(dataUrl);
      onBrandKitChange({
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
        bgColor: colors.background,
        textColor: colors.text,
      });
    } catch (err) {
      console.error("Failed to extract colors:", err);
    } finally {
      setIsExtracting(false);
    }
  }, [onBrandKitChange, onLogoChange]);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              handleImagePaste(reader.result);
            }
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  }, [handleImagePaste]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          handleImagePaste(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [handleImagePaste]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          handleImagePaste(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [handleImagePaste]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Global paste listener when expanded
  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("paste", handlePaste);
      return () => document.removeEventListener("paste", handlePaste);
    }
  }, [isExpanded, handlePaste]);

  const clearBranding = () => {
    onBrandKitChange(undefined);
    onLogoChange(undefined);
  };

  const colorFields: { key: keyof BrandKit; label: string }[] = [
    { key: "primaryColor", label: "Primary" },
    { key: "secondaryColor", label: "Secondary" },
    { key: "accentColor", label: "Accent" },
    { key: "bgColor", label: "Background" },
    { key: "textColor", label: "Text" },
  ];

  return (
    <div style={brandStyles.container}>
      <button
        style={brandStyles.toggleBtn}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span style={brandStyles.toggleIcon}>{isExpanded ? "▼" : "▶"}</span>
        <span>Brand Customization</span>
        {brandKit && <span style={brandStyles.activeBadge}>Active</span>}
      </button>

      {isExpanded && (
        <div style={brandStyles.panel}>
          {/* Logo/Screenshot paste area */}
          <div style={brandStyles.section}>
            <div style={brandStyles.sectionLabel}>Logo / Screenshot</div>
            <div
              ref={dropZoneRef}
              style={brandStyles.dropZone}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {logoUrl ? (
                <div style={brandStyles.logoPreview}>
                  <img src={logoUrl} alt="Logo" style={brandStyles.logoImg} />
                  <button
                    style={brandStyles.clearLogoBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogoChange(undefined);
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div style={brandStyles.dropZoneContent}>
                  <svg style={brandStyles.dropIcon as React.CSSProperties} width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="2"/>
                    <path d="M8 12H16M12 8V16" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div style={brandStyles.dropText}>
                    <strong>Paste screenshot</strong> or drop image
                  </div>
                  <div style={brandStyles.dropHint}>
                    Tip: Screenshot your website header to auto-extract brand colors
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
            </div>
            {isExtracting && (
              <div style={brandStyles.extractingMsg}>
                Extracting colors from image...
              </div>
            )}
          </div>

          {/* Color pickers */}
          <div style={brandStyles.section}>
            <div style={brandStyles.sectionLabel}>Brand Colors</div>
            <div style={brandStyles.colorGrid}>
              {colorFields.map(({ key, label }) => (
                <div key={key} style={brandStyles.colorField}>
                  <label style={brandStyles.colorLabel}>{label}</label>
                  <div style={brandStyles.colorInputWrap}>
                    <input
                      type="color"
                      value={brandKit?.[key] || "#4a90d9"}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={brandStyles.colorInput}
                    />
                    <input
                      type="text"
                      value={brandKit?.[key] || ""}
                      placeholder="#4a90d9"
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      style={brandStyles.hexInput}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Brand */}
          <div style={brandStyles.section}>
            <div style={brandStyles.sectionLabel}>Save Brand</div>
            <div style={brandStyles.saveRow}>
              <input
                type="text"
                placeholder="Brand name..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                style={brandStyles.saveInput}
              />
              <button
                style={brandStyles.saveBtn}
                onClick={() => {
                  if (saveName.trim()) {
                    onSaveBrand(saveName.trim());
                    setSaveName("");
                  }
                }}
                disabled={!brandKit || !saveName.trim()}
              >
                Save
              </button>
            </div>
          </div>

          {/* Saved Brands */}
          {savedBrands.length > 0 && (
            <div style={brandStyles.section}>
              <div style={brandStyles.sectionLabel}>Saved Brands</div>
              <div style={brandStyles.savedList}>
                {savedBrands.map((brand) => (
                  <div key={brand.name} style={brandStyles.savedItem}>
                    <div style={brandStyles.savedColors}>
                      {brand.kit.primaryColor && <span style={{ ...brandStyles.colorDot, background: brand.kit.primaryColor }} />}
                      {brand.kit.secondaryColor && <span style={{ ...brandStyles.colorDot, background: brand.kit.secondaryColor }} />}
                      {brand.kit.accentColor && <span style={{ ...brandStyles.colorDot, background: brand.kit.accentColor }} />}
                    </div>
                    <span style={brandStyles.savedName}>{brand.name}</span>
                    <button style={brandStyles.loadBtn} onClick={() => onLoadBrand(brand)}>Load</button>
                    <button style={brandStyles.deleteBtn} onClick={() => onDeleteBrand(brand.name)}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={brandStyles.actions}>
            <button style={brandStyles.clearBtn} onClick={clearBranding}>
              Clear All
            </button>
            <button
              style={brandStyles.copyUrlBtn}
              onClick={() => {
                const url = new URL(window.location.href);
                if (brandKit?.primaryColor) url.searchParams.set("brandPrimary", brandKit.primaryColor.replace("#", ""));
                if (brandKit?.secondaryColor) url.searchParams.set("brandSecondary", brandKit.secondaryColor.replace("#", ""));
                if (brandKit?.accentColor) url.searchParams.set("brandAccent", brandKit.accentColor.replace("#", ""));
                if (brandKit?.bgColor) url.searchParams.set("brandBg", brandKit.bgColor.replace("#", ""));
                if (brandKit?.textColor) url.searchParams.set("brandText", brandKit.textColor.replace("#", ""));
                navigator.clipboard.writeText(url.toString());
              }}
            >
              Copy URL with Colors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const brandStyles: Record<string, React.CSSProperties> = {
  container: {
    borderBottom: "1px solid #1e293b",
    flexShrink: 0,
  },
  toggleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  },
  toggleIcon: {
    fontSize: 8,
    color: "#64748b",
  },
  activeBadge: {
    marginLeft: "auto",
    padding: "2px 6px",
    fontSize: 9,
    fontWeight: 700,
    background: "#22c55e20",
    color: "#22c55e",
    borderRadius: 4,
  },
  panel: {
    padding: "0 14px 14px",
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dropZone: {
    border: "2px dashed #334155",
    borderRadius: 8,
    padding: 16,
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    background: "#0f172a",
  },
  dropZoneContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  dropIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  dropText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  dropHint: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  logoPreview: {
    position: "relative",
    display: "inline-block",
  },
  logoImg: {
    maxWidth: "100%",
    maxHeight: 60,
    borderRadius: 4,
  },
  clearLogoBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "none",
    background: "#ef4444",
    color: "white",
    fontSize: 14,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  extractingMsg: {
    fontSize: 11,
    color: "#4ade80",
    marginTop: 8,
    textAlign: "center",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  colorField: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  colorLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  colorInputWrap: {
    display: "flex",
    gap: 4,
  },
  colorInput: {
    width: 28,
    height: 28,
    padding: 0,
    border: "1px solid #334155",
    borderRadius: 4,
    cursor: "pointer",
    background: "transparent",
  },
  hexInput: {
    flex: 1,
    minWidth: 0,
    padding: "4px 6px",
    fontSize: 11,
    fontFamily: "monospace",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 4,
    color: "#e2e8f0",
    outline: "none",
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  clearBtn: {
    flex: 1,
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 600,
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: 4,
    color: "#94a3b8",
    cursor: "pointer",
  },
  copyUrlBtn: {
    flex: 1,
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 600,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 4,
    color: "#e2e8f0",
    cursor: "pointer",
  },
  saveRow: {
    display: "flex",
    gap: 6,
  },
  saveInput: {
    flex: 1,
    padding: "6px 8px",
    fontSize: 11,
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 4,
    color: "#e2e8f0",
    outline: "none",
  },
  saveBtn: {
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 600,
    background: "#22c55e20",
    border: "1px solid #22c55e40",
    borderRadius: 4,
    color: "#22c55e",
    cursor: "pointer",
  },
  savedList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  savedItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 6px",
    background: "#1e293b",
    borderRadius: 4,
  },
  savedColors: {
    display: "flex",
    gap: 2,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    border: "1px solid #ffffff30",
  },
  savedName: {
    flex: 1,
    fontSize: 11,
    color: "#94a3b8",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  loadBtn: {
    padding: "2px 8px",
    fontSize: 10,
    fontWeight: 600,
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: 3,
    color: "#64748b",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "2px 4px",
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// ── Main App ──────────────────────────────────────────────────────

// Theme groups for organized filtering
const THEME_GROUPS = {
  "Original": ["dark", "clean", "bold", "warm", "minimal", "neon"],
  "Extended": ["ocean", "sunset", "forest", "rose", "gold", "midnight", "crimson", "lavender", "arctic", "espresso"],
  "European": ["corporate", "industrial", "vienna", "alpine", "finance"],
  "Flat/Material": ["materialblue", "materialdark", "flatred", "flatnavy", "swiss", "bauhaus", "mono", "paper", "slate", "blueprint"],
} as const;

const ALL_THEMES = Object.values(THEME_GROUPS).flat();
type ThemeFilter = "all" | typeof ALL_THEMES[number];

// Saved brand interface
interface SavedBrand {
  name: string;
  kit: BrandKit;
  logoUrl?: string;
}

const STORAGE_KEY_BRANDS = "fto-saved-brands";

export const App: React.FC = () => {
  const embed = isEmbed();
  const initialId = getCompFromUrl();
  const initialComp = COMP_BY_ID[initialId] ?? COMPOSITIONS[0];
  const initialBrandKit = getBrandKitFromUrl();

  const [active, setActive] = useState<CompSpec>(initialComp);
  const [search, setSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>("all");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Original": true,
    "Extended": false,
    "European": false,
    "Flat/Material": false,
  });
  const [brandKit, setBrandKit] = useState<BrandKit | undefined>(initialBrandKit);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [savedBrands, setSavedBrands] = useState<SavedBrand[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BRANDS);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const playerRef = useRef<PlayerRef>(null);

  // Persist saved brands
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BRANDS, JSON.stringify(savedBrands));
  }, [savedBrands]);

  const select = useCallback((comp: CompSpec) => {
    setActive(comp);
    setCompInUrl(comp.id);
    playerRef.current?.seekTo(0);
  }, []);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const saveBrand = (name: string) => {
    if (!brandKit || !name.trim()) return;
    setSavedBrands(prev => [...prev.filter(b => b.name !== name), { name, kit: brandKit, logoUrl }]);
  };

  const loadBrand = (brand: SavedBrand) => {
    setBrandKit(brand.kit);
    setLogoUrl(brand.logoUrl);
  };

  const deleteBrand = (name: string) => {
    setSavedBrands(prev => prev.filter(b => b.name !== name));
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const idx = COMPOSITIONS.indexOf(active);
        if (idx < COMPOSITIONS.length - 1) select(COMPOSITIONS[idx + 1]);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const idx = COMPOSITIONS.indexOf(active);
        if (idx > 0) select(COMPOSITIONS[idx - 1]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, select]);

  const filtered = COMPOSITIONS.filter((c) => {
    const matchesSearch = !search.trim() || c.id.toLowerCase().includes(search.toLowerCase());
    const matchesTheme = themeFilter === "all" || c.id.toLowerCase().includes(`-${themeFilter}`);
    return matchesSearch && matchesTheme;
  });

  // Embed mode - player only
  if (embed) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Player
          ref={playerRef}
          component={active.component}
          inputProps={{ brandKit }}
          durationInFrames={active.durationInFrames}
          fps={active.fps}
          compositionWidth={active.width}
          compositionHeight={active.height}
          style={{ width: "100%", aspectRatio: "16/9" }}
          controls
          loop
          autoPlay
        />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Header */}
        <div style={styles.sidebarHead}>
          <div style={styles.siteTitle}>freelancer-templates.org</div>
          <div style={styles.counts}>
            {TOTAL_COMPOSITIONS} compositions - {TOTAL_TEMPLATE_TYPES} types
          </div>
          <input
            style={styles.search}
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* Theme filter groups */}
          <div style={styles.themeSection}>
            <button
              style={{
                ...styles.themeBtn,
                ...(themeFilter === "all" ? styles.themeBtnActive : {}),
                marginBottom: 6,
                width: "100%",
              }}
              onClick={() => setThemeFilter("all")}
            >
              All Themes
            </button>
            {Object.entries(THEME_GROUPS).map(([groupName, themes]) => (
              <div key={groupName} style={styles.themeGroup}>
                <button
                  style={styles.themeGroupHeader}
                  onClick={() => toggleGroup(groupName)}
                >
                  <span style={styles.themeGroupIcon}>{expandedGroups[groupName] ? "v" : ">"}</span>
                  <span>{groupName}</span>
                  <span style={styles.themeGroupCount}>{themes.length}</span>
                </button>
                {expandedGroups[groupName] && (
                  <div style={styles.themeGroupItems}>
                    {themes.map((t) => (
                      <button
                        key={t}
                        style={{
                          ...styles.themeBtn,
                          ...(themeFilter === t ? styles.themeBtnActive : {}),
                        }}
                        onClick={() => setThemeFilter(t as ThemeFilter)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brand Customization */}
        <BrandCustomizer
          brandKit={brandKit}
          onBrandKitChange={setBrandKit}
          logoUrl={logoUrl}
          onLogoChange={setLogoUrl}
          savedBrands={savedBrands}
          onSaveBrand={saveBrand}
          onLoadBrand={loadBrand}
          onDeleteBrand={deleteBrand}
        />

        {/* Composition list grouped by category */}
        <div style={styles.compList}>
          {CATEGORIES.map((cat) => {
            const comps = filtered.filter((c) => c.category === cat);
            if (!comps.length) return null;
            return (
              <div key={cat} style={styles.catGroup}>
                <div style={styles.catLabel}>{formatCategory(cat)}</div>
                {comps.map((comp) => (
                  <button
                    key={comp.id}
                    style={{
                      ...styles.compBtn,
                      ...(comp.id === active.id ? styles.compBtnActive : {}),
                    }}
                    onClick={() => select(comp)}
                  >
                    {formatCompName(comp.id)}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={styles.sidebarFoot}>
          <a href="/" style={styles.footLink}>
            Back to library
          </a>
          <a
            href="https://github.com/mzzavaa/freelancer-templates.org"
            target="_blank"
            rel="noopener"
            style={styles.footLink}
          >
            GitHub
          </a>
        </div>
      </aside>

      {/* Main area */}
      <main style={styles.main}>
        {/* Composition header */}
        <div style={styles.compHeader}>
          <div style={styles.compTitle}>{active.id}</div>
          <div style={styles.compMeta}>
            {active.width}x{active.height} - {active.fps}fps - {active.durationInFrames / active.fps}s
          </div>
          <div style={styles.navHint}>
            ← → to navigate between compositions
          </div>
        </div>

        {/* Player */}
        <div style={styles.playerWrap}>
          <Player
            ref={playerRef}
            key={active.id}
            component={active.component}
            inputProps={{ brandKit }}
            durationInFrames={active.durationInFrames}
            fps={active.fps}
            compositionWidth={active.width}
            compositionHeight={active.height}
            style={styles.player}
            controls
            loop
            autoPlay
            clickToPlay
          />
        </div>

        {/* Usage code block */}
        <div style={styles.codeBlock}>
          <div style={styles.codeHeader}>
            <span style={{ color: "#ef4444" }}>●</span>
            <span style={{ color: "#f59e0b" }}>●</span>
            <span style={{ color: "#22c55e" }}>●</span>
            <span style={styles.codeLabel}>Remotion CLI</span>
          </div>
          <pre style={styles.codePre}>
            <span style={{ color: "#94a3b8" }}># Render this composition</span>{"\n"}
            <span style={{ color: "#60a5fa" }}>npx remotion render</span>
            {" "}
            <span style={{ color: "#4ade80" }}>{active.id}</span>
            {" "}
            <span style={{ color: "#a78bfa" }}>out/{active.id.toLowerCase().replace(/-/g, "_")}.mp4</span>
            {"\n\n"}
            <span style={{ color: "#94a3b8" }}># Or render all variants</span>{"\n"}
            <span style={{ color: "#60a5fa" }}>npx remotion render</span>
            {" "}
            <span style={{ color: "#4ade80" }}>{active.category.charAt(0).toUpperCase() + active.category.slice(1)}*</span>
            {" "}
            <span style={{ color: "#a78bfa" }}>out/</span>
          </pre>
        </div>
      </main>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    height: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "'Inter', system-ui, sans-serif",
    overflow: "hidden",
  },
  sidebar: {
    width: 260,
    minWidth: 260,
    borderRight: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarHead: {
    padding: "16px 14px 12px",
    borderBottom: "1px solid #1e293b",
    flexShrink: 0,
  },
  siteTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#4a90d9",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  counts: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 10,
  },
  search: {
    width: "100%",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 12,
    color: "#e2e8f0",
    outline: "none",
  },
  themeSection: {
    marginTop: 10,
  },
  themeGroup: {
    marginBottom: 2,
  },
  themeGroupHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 6px",
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left" as const,
  },
  themeGroupIcon: {
    fontSize: 8,
    width: 10,
    color: "#475569",
  },
  themeGroupCount: {
    marginLeft: "auto",
    fontSize: 9,
    color: "#475569",
  },
  themeGroupItems: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 3,
    padding: "4px 0 4px 16px",
  },
  themeFilters: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 4,
    marginTop: 8,
  },
  themeBtn: {
    padding: "3px 7px",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0.3,
    border: "1px solid #1e293b",
    borderRadius: 4,
    background: "transparent",
    color: "#475569",
    cursor: "pointer",
    transition: "all .1s",
  },
  themeBtnActive: {
    background: "#1e293b",
    color: "#e2e8f0",
    borderColor: "#4a90d9",
  },
  compList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  catGroup: {
    marginBottom: 4,
  },
  catLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: "8px 14px 4px",
  },
  compBtn: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "5px 14px",
    fontSize: 12,
    color: "#94a3b8",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: 0,
    transition: "background .1s, color .1s",
  },
  compBtnActive: {
    background: "#1e293b",
    color: "#e2e8f0",
    borderLeft: "2px solid #4a90d9",
    paddingLeft: 12,
  },
  sidebarFoot: {
    padding: "12px 14px",
    borderTop: "1px solid #1e293b",
    display: "flex",
    gap: 12,
    flexShrink: 0,
  },
  footLink: {
    fontSize: 12,
    color: "#64748b",
    textDecoration: "none",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "20px 24px",
    gap: 16,
  },
  compHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 16,
    flexShrink: 0,
  },
  compTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#f1f5f9",
  },
  compMeta: {
    fontSize: 12,
    color: "#64748b",
  },
  navHint: {
    fontSize: 11,
    color: "#475569",
    marginLeft: "auto",
  },
  playerWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
  },
  player: {
    width: "100%",
    maxWidth: "calc((100vh - 220px) * 16 / 9)",
    aspectRatio: "16/9",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,.6)",
  },
  codeBlock: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  codeHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderBottom: "1px solid #1e293b",
    fontSize: 12,
  },
  codeLabel: {
    color: "#475569",
    marginLeft: 4,
    fontSize: 11,
  },
  codePre: {
    padding: "12px 14px",
    margin: 0,
    fontSize: 12,
    lineHeight: 1.7,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: "#e2e8f0",
    overflowX: "auto",
  },
};
