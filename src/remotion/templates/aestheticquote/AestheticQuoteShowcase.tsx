/**
 * AestheticQuote Showcase — 2 style variants
 *
 *   AestheticQuoteMinimalCream → ID: AestheticQuote-MinimalCream
 *   AestheticQuoteDarkMoody    → ID: AestheticQuote-DarkMoody
 *
 * 240 frames (8s) · 1080×1920 · 30fps
 */

import React from "react";
import { AestheticQuote } from "./AestheticQuote";
import { THEME_CREAM, THEME_MIDNIGHT } from "../_shared/themes";

export const AestheticQuoteMinimalCream: React.FC = () => (
  <AestheticQuote
    platform="instagram_reels"
    theme={THEME_CREAM}
    style="cream"
    quote="Create the life you can't stop thinking about"
    emphasisWord="life"
    attribution="— anonymous"
  />
);

export const AestheticQuoteDarkMoody: React.FC = () => (
  <AestheticQuote
    platform="tiktok_vertical"
    theme={THEME_MIDNIGHT}
    style="moody"
    quote="She remembered who she was and the game changed"
    emphasisWord="changed"
    attribution="— Lalah Delia"
  />
);
