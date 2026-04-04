import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { fadeIn } from "../animations";

export interface CodeBlockAtomProps extends AtomProps {
  code: string;
  language?: string;
  fontSize?: number;
}

export const CodeBlockAtom: React.FC<CodeBlockAtomProps> = ({
  theme,
  frame,
  delay = 0,
  code,
  language,
  fontSize = 13,
}) => {
  const opacity = fadeIn(frame, delay, 20);
  return (
    <div
      style={{
        background: theme.bgSecondary,
        border: `1px solid ${theme.cardBorder}`,
        borderRadius: 8,
        padding: "14px 18px",
        opacity,
        overflow: "hidden",
      }}
    >
      {language && (
        <div style={{ fontSize: 10, fontFamily: theme.fontFamily, color: theme.textMuted, marginBottom: 8 }}>
          {language}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          color: theme.textPrimary,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {code}
      </pre>
    </div>
  );
};

export const CodeBlockAtomMeta: AtomMeta = registerAtom({
  name: "CodeBlock",
  category: "typography",
  compatibleShells: [
    "CardGridShell",
    "SplitPanelShell",
    "ListDetailShell",
    "ComparisonShell",
  ],
  requiredProps: ["code"],
  defaultProps: { code: "// code here", fontSize: 13 },
});
