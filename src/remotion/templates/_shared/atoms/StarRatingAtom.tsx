import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { StarRating } from "../components";

export interface StarRatingAtomProps extends AtomProps {
  rating: number;
  size?: number;
  color?: string;
}

export const StarRatingAtom: React.FC<StarRatingAtomProps> = ({
  frame,
  fps,
  delay = 0,
  rating,
  size,
  color,
}) => (
  <StarRating
    rating={rating}
    frame={frame}
    startFrame={delay}
    fps={fps}
    size={size}
    color={color}
  />
);

export const StarRatingAtomMeta: AtomMeta = registerAtom({
  name: "StarRating",
  category: "data-display",
  compatibleShells: [
    "HeroStatShell",
    "CardGridShell",
    "ListDetailShell",
    "ContributorShell",
  ],
  requiredProps: ["rating"],
  defaultProps: { rating: 5, size: 24 },
});
