import React from "react";
import { PinCollection, PinCollectionSpec } from "./PinCollection";

const BASE_SPEC: PinCollectionSpec = {
  collection_title: "Best Brunch Spots in Vienna",
  collection_description: "A curated guide to the finest brunch experiences across Vienna's neighborhoods",
  curator_name: "Linda Mohamed",
  pins: [
    { place_name: "Café Harvest", category: "Café", description: "Organic bowls and specialty coffee", rating: 4.8, tags: ["organic", "vegan-friendly"] },
    { place_name: "Joseph Brot", category: "Bakery", description: "Artisan sourdough and pastries", rating: 4.6, tags: ["bakery", "brunch"] },
    { place_name: "Motto am Fluss", category: "Restaurant", description: "Danube-side brunch with a view", rating: 4.5, tags: ["waterfront", "upscale"] },
    { place_name: "Vollpension", category: "Café", description: "Grandma-style cakes and charm", rating: 4.7, tags: ["traditional", "cozy"] },
    { place_name: "Ramasuri", category: "Restaurant", description: "Creative brunch plates in Neubau", rating: 4.4, tags: ["creative", "local"] },
  ],
  total_pins: 24,
  region: "Vienna, Austria",
};

export const PinCollectionCardGalleryWarm: React.FC = () => <PinCollection spec={{ ...BASE_SPEC, layout: "card-gallery", theme: "warm" }} />;
export const PinCollectionCardGalleryClean: React.FC = () => <PinCollection spec={{ ...BASE_SPEC, layout: "card-gallery", theme: "clean" }} />;
export const PinCollectionMapListWarm: React.FC = () => <PinCollection spec={{ ...BASE_SPEC, layout: "map-list", theme: "warm" }} />;
export const PinCollectionMapListClean: React.FC = () => <PinCollection spec={{ ...BASE_SPEC, layout: "map-list", theme: "clean" }} />;
export const PinCollectionCategoryGridWarm: React.FC = () => <PinCollection spec={{ ...BASE_SPEC, layout: "category-grid", theme: "warm" }} />;
export const PinCollectionCategoryGridClean: React.FC = () => <PinCollection spec={{ ...BASE_SPEC, layout: "category-grid", theme: "clean" }} />;
