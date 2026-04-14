/**
 * ProductReveal Showcase — 2 style variants
 *
 *   ProductRevealLuxuryBlack  → ID: ProductReveal-LuxuryBlack
 *   ProductRevealPlayfulPastel → ID: ProductReveal-PlayfulPastel
 *
 * 240 frames (8s) · 1080×1920 · 30fps
 */

import React from "react";
import { ProductReveal } from "./ProductReveal";
import { THEME_DARK, THEME_ROSE } from "../_shared/themes";

export const ProductRevealLuxuryBlack: React.FC = () => (
  <ProductReveal
    platform="instagram_reels"
    theme={THEME_DARK}
    style="luxury"
    productName="Noir Serum"
    tagline="Formulated for the bold"
    dropLabel="NEW DROP"
  />
);

export const ProductRevealPlayfulPastel: React.FC = () => (
  <ProductReveal
    platform="tiktok_vertical"
    theme={THEME_ROSE}
    style="playful"
    productName="Cloud Blush"
    tagline="Your new everyday fave ✨"
    dropLabel="NEW DROP"
  />
);
