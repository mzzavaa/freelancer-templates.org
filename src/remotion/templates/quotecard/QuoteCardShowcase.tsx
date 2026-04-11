/**
 * Quote Card Showcase - Pre-configured compositions for social media quotes
 */

import React from "react";
import { QuoteCard } from "./QuoteCard";
import type { QuoteCardSpec } from "./QuoteCard";
import {
  THEME_DARK,
  THEME_MINIMAL,
  THEME_CANDY,
  THEME_MINT,
  THEME_GRAPE,
  THEME_CHARCOAL,
  THEME_PEACH,
  THEME_CREAM,
  THEME_PAPER,
  THEME_SWISS,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

// ── Sample Data ─────────────────────────────────────────────────
const SAMPLE_SPEC: QuoteCardSpec = {
  quote: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
  author_title: "Co-founder, Apple",
  hashtags: ["motivation", "success", "entrepreneurship"],
};

const SAMPLE_SPEC_SHORT: QuoteCardSpec = {
  quote: "Done is better than perfect.",
  author: "Sheryl Sandberg",
};

// ── Square Format (1:1) ──────────────────────────────────────────

export const QuoteCardDarkCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="centered" format="square" />
);

export const QuoteCardMinimalMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="minimal" format="square" />
);

export const QuoteCardCandyBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="bold" format="square" />
);

export const QuoteCardMintCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINT, brandKit)} layout="centered" format="square" />
);

export const QuoteCardGrapeBold: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="bold" format="square" />
);

export const QuoteCardCharcoalMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="minimal" format="square" />
);

export const QuoteCardPeachCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PEACH, brandKit)} layout="centered" format="square" />
);

export const QuoteCardCreamMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CREAM, brandKit)} layout="minimal" format="square" />
);

export const QuoteCardPaperMinimal: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_PAPER, brandKit)} layout="minimal" format="square" />
);

export const QuoteCardSwissCentered: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_SWISS, brandKit)} layout="centered" format="square" />
);

// ── Vertical Format (9:16) - Stories ─────────────────────────────

export const QuoteCardDarkCenteredVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_DARK, brandKit)} layout="centered" format="vertical" />
);

export const QuoteCardCandyBoldVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_CANDY, brandKit)} layout="bold" format="vertical" />
);

export const QuoteCardGrapeBoldVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC_SHORT} theme={applyBrandKit(THEME_GRAPE, brandKit)} layout="bold" format="vertical" />
);

export const QuoteCardCharcoalMinimalVertical: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <QuoteCard spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CHARCOAL, brandKit)} layout="minimal" format="vertical" />
);
