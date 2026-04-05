/**
 * FitnessRoutine Showcase Compositions - 6 variants (3 layouts × 2 themes)
 */
import React from "react";
import { FitnessRoutine } from "./FitnessRoutine";
import {
  THEME_BOLD,
  THEME_NEON,
  BrandKit,
  applyBrandKit,
} from "../_shared/themes";

const SAMPLE_SPEC = {
  workout_title: "Full Body HIIT Blast",
  exercises: [
    { name: "Jumping Jacks", reps: 30, sets: 3 },
    { name: "Burpees", reps: 10, sets: 3 },
    { name: "Mountain Climbers", reps: 20, sets: 3 },
    { name: "Kettlebell Swings", reps: 15, sets: 3 },
    { name: "Box Jumps", reps: 12, sets: 3 },
  ],
  total_duration: 35,
  difficulty: "advanced" as const,
};

export const FitnessRoutineBoldExerciseList: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FitnessRoutine spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="exercise-list" />
);
export const FitnessRoutineNeonExerciseList: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FitnessRoutine spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="exercise-list" />
);
export const FitnessRoutineBoldTimerFocus: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FitnessRoutine spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="timer-focus" />
);
export const FitnessRoutineNeonTimerFocus: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FitnessRoutine spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="timer-focus" />
);
export const FitnessRoutineBoldCircuit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FitnessRoutine spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_BOLD, brandKit)} layout="circuit" />
);
export const FitnessRoutineNeonCircuit: React.FC<{ brandKit?: BrandKit }> = ({ brandKit }) => (
  <FitnessRoutine spec={SAMPLE_SPEC} theme={applyBrandKit(THEME_NEON, brandKit)} layout="circuit" />
);
