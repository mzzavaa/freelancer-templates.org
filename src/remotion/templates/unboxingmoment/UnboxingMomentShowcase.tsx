/**
 * UnboxingMoment Showcase — 2 energy variants
 *
 *   UnboxingMomentTikTokHype      → ID: UnboxingMoment-TikTokHype
 *   UnboxingMomentReelsEditorial  → ID: UnboxingMoment-ReelsEditorial
 *
 * 240 frames (8s) · 1080×1920 · 30fps
 */

import React from "react";
import { UnboxingMoment } from "./UnboxingMoment";
import { THEME_NEON, THEME_DARK } from "../_shared/themes";

export const UnboxingMomentTikTokHype: React.FC = () => (
  <UnboxingMoment
    platform="tiktok_vertical"
    theme={THEME_NEON}
    style="hype"
    productName="THE DROP"
    callouts={["New Formula", "Limited Run", "Sold Out Soon"]}
  />
);

export const UnboxingMomentReelsEditorial: React.FC = () => (
  <UnboxingMoment
    platform="instagram_reels"
    theme={THEME_DARK}
    style="editorial"
    productName="Noir Edition"
    callouts={["New Scent", "24h Wear", "100% Vegan"]}
  />
);
