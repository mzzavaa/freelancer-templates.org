import React from "react";
import type { AtomProps, AtomMeta } from "./registry-core";
import { registerAtom } from "./registry-core";
import { StepIndicator } from "../components";

export interface StepIndicatorAtomProps extends AtomProps {
  stepNumber: number;
  status: "pending" | "active" | "completed";
  label: string;
}

export const StepIndicatorAtom: React.FC<StepIndicatorAtomProps> = ({
  theme,
  stepNumber,
  status,
  label,
}) => (
  <StepIndicator
    stepNumber={stepNumber}
    status={status}
    label={label}
    theme={theme}
  />
);

export const StepIndicatorAtomMeta: AtomMeta = registerAtom({
  name: "StepIndicator",
  category: "interactive",
  compatibleShells: [
    "TimelineShell",
    "PipelineShell",
    "ListDetailShell",
    "StatusBoardShell",
  ],
  requiredProps: ["stepNumber", "status", "label"],
  defaultProps: { stepNumber: 1, status: "pending", label: "Step" },
});
