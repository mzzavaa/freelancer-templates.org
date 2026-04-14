/**
 * TravelMontage Showcase — 2 grade variants
 *
 *   TravelMontageFilmGrain  → ID: TravelMontage-FilmGrain  (teal-orange split-tone)
 *   TravelMontageSunsetVibes → ID: TravelMontage-SunsetVibes (warm saturated)
 *
 * 330 frames (11s) · 1080×1920 · 30fps
 */

import React from "react";
import { TravelMontage } from "./TravelMontage";
import { THEME_ESPRESSO, THEME_SUNSET } from "../_shared/themes";

export const TravelMontageFilmGrain: React.FC = () => (
  <TravelMontage
    platform="tiktok_vertical"
    theme={THEME_ESPRESSO}
    style="filmgrain"
    tripSummary="8 CITIES · 14 DAYS"
  />
);

export const TravelMontageSunsetVibes: React.FC = () => (
  <TravelMontage
    platform="instagram_reels"
    theme={THEME_SUNSET}
    style="sunset"
    tripSummary="8 CITIES · 14 DAYS"
  />
);
