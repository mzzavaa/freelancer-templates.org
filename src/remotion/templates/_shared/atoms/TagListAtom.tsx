import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";

export interface TagListAtomProps extends AtomProps {
  tags: string[];
  maxVisible?: number;
}

export const TagListAtom: React.FC<TagListAtomProps> = ({
  theme,
  tags,
  maxVisible,
}) => {
  const visible = maxVisible ? tags.slice(0, maxVisible) : tags;
  const remaining = maxVisible ? tags.length - maxVisible : 0;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {visible.map((tag, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 500,
            fontFamily: theme.fontFamily,
            background: `${theme.accent}18`,
            color: theme.accent,
          }}
        >
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span
          style={{
            fontSize: 10,
            fontFamily: theme.fontFamily,
            color: theme.textMuted,
            padding: "3px 6px",
          }}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
};

export const TagListAtomMeta: AtomMeta = registerAtom({
  name: "TagList",
  category: "typography",
  compatibleShells: [
    "CardGridShell",
    "CategoryGroupShell",
    "ListDetailShell",
    "ContributorShell",
    "StatusBoardShell",
  ],
  requiredProps: ["tags"],
  defaultProps: { tags: [] },
});
