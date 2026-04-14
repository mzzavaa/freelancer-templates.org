/**
 * DayInTheLife Showcase — 2 platform variants
 *
 *   DayInTheLifeTikTokEnergetic  → ID: DayInTheLife-TikTokEnergetic
 *   DayInTheLifeReelsCinematic   → ID: DayInTheLife-ReelsCinematic
 *
 * 360 frames (12s) · 1080×1920 · 30fps
 */

import React from "react";
import { DayInTheLife } from "./DayInTheLife";
import { THEME_BOLD, THEME_DARK } from "../_shared/themes";

export const DayInTheLifeTikTokEnergetic: React.FC = () => (
  <DayInTheLife
    platform="tiktok_vertical"
    theme={THEME_BOLD}
    style="energetic"
    creatorHandle="@yourhandle"
  />
);

export const DayInTheLifeReelsCinematic: React.FC = () => (
  <DayInTheLife
    platform="instagram_reels"
    theme={THEME_DARK}
    style="cinematic"
    creatorHandle="@yourhandle"
  />
);
