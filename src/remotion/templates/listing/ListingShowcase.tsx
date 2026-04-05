/**
 * Listing Showcase Compositions - 6 variants (3 layouts × 2 themes)
 */
import React from "react";
import { Listing } from "./Listing";
import {
  THEME_CLEAN,
  THEME_MINIMAL,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC = {
  property_title: "Skyline Penthouse Suite",
  price: 1250000,
  currency: "$",
  location: "Manhattan, NY",
  features: [
    { label: "4 Bedrooms" },
    { label: "3 Bathrooms" },
    { label: "2,400 sq ft" },
    { label: "Rooftop Terrace" },
  ],
  cta: "Book a Viewing",
};

export const ListingCleanShowcase: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listing spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="showcase" />
);
export const ListingMinimalShowcase: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listing spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="showcase" />
);
export const ListingCleanFeatureGrid: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listing spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="feature-grid" />
);
export const ListingMinimalFeatureGrid: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listing spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="feature-grid" />
);
export const ListingCleanComparison: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listing spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_CLEAN, brandKit)} layout="comparison" />
);
export const ListingMinimalComparison: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <Listing spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_MINIMAL, brandKit)} layout="comparison" />
);
