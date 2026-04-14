/**
 * BTSCreator Showcase — 2 style variants
 *
 *   BTSCreatorChaoticCreator → ID: BTSCreator-ChaoticCreator
 *   BTSCreatorCleanStudio    → ID: BTSCreator-CleanStudio
 *
 * 240 frames (8s) · 1080×1920 · 30fps
 */

import React from "react";
import { BTSCreator } from "./BTSCreator";
import { THEME_BOLD, THEME_MINIMAL } from "../_shared/themes";

export const BTSCreatorChaoticCreator: React.FC = () => (
  <BTSCreator
    platform="tiktok_vertical"
    theme={THEME_BOLD}
    style="chaotic"
    beforeLabel="Setup"
    afterLabel="Final"
  />
);

export const BTSCreatorCleanStudio: React.FC = () => (
  <BTSCreator
    platform="instagram_reels"
    theme={THEME_MINIMAL}
    style="clean"
    beforeLabel="Before"
    afterLabel="After"
  />
);
