/**
 * Testimonial Template Configuration
 *
 * Defines the template configuration for the Testimonial template,
 * including layouts, dimensions, theme compatibility, and sample data.
 *
 * @module templates/testimonial/config
 * @see Requirements: 4.1, 4.2, 5.1-5.7
 */

import React from "react";
import type { TemplateConfig, TemplateProps, ValidFps } from "../../themes/types";
import { Testimonial, type TestimonialSpec } from "./Testimonial";

/**
 * Adapter component that bridges the Testimonial component to TemplateProps interface.
 *
 * The Testimonial component uses its own props interface (TestimonialProps),
 * so this adapter converts the standard TemplateProps to the expected format.
 */
const TestimonialAdapter: React.ComponentType<TemplateProps> = (props) => {
  const { theme, layout, spec } = props;

  return (
    <Testimonial
      spec={spec as unknown as TestimonialSpec}
      theme={theme}
      layout={layout as "centered" | "split" | "editorial"}
      bgPattern="grid"
    />
  );
};

/**
 * Sample testimonial specification for testing and preview.
 */
const SAMPLE_TESTIMONIAL_SPEC: TestimonialSpec = {
  client_name: "Sarah Johnson",
  client_title: "CEO",
  client_company: "TechStart Inc.",
  quote:
    "Working with this team transformed our entire digital presence. The results exceeded our expectations and delivered real business value.",
  rating: 5,
  project_type: "Web Development",
  freelancer_name: "Your Name",
  freelancer_title: "Full-Stack Developer",
  cta_text: "Let's work together",
};

/**
 * Alternative sample spec for editorial layout.
 */
const SAMPLE_EDITORIAL_SPEC: TestimonialSpec = {
  client_name: "Michael Chen",
  client_title: "Founder",
  client_company: "Innovate Labs",
  quote: "Exceptional work that speaks for itself.",
  rating: 5,
  project_type: "Brand Strategy",
};

/**
 * Alternative sample spec for split layout.
 */
const SAMPLE_SPLIT_SPEC: TestimonialSpec = {
  client_name: "Emily Rodriguez",
  client_title: "Marketing Director",
  client_company: "Growth Co.",
  quote:
    "The attention to detail and creative approach made all the difference. Our conversion rates improved by 40% after the redesign.",
  rating: 5,
  project_type: "UI/UX Design",
  freelancer_name: "Your Name",
  freelancer_title: "Product Designer",
  cta_text: "Start your project",
};

/**
 * Testimonial template configuration.
 *
 * Defines all metadata required for the TemplateRegistry:
 * - Identity: id, name, description
 * - Component: React component reference
 * - Variants: available layouts and default
 * - Dimensions: video width, height, fps, duration
 * - Theme compatibility: compatible with all themes
 * - Sample data: default props and sample specs
 * - Metadata: icon, color, category, implementation status
 *
 * @see Requirements: 4.1, 4.2, 5.1-5.7
 */
export const TESTIMONIAL_CONFIG: TemplateConfig = {
  // ── Identity ──────────────────────────────────────────────────────
  id: "testimonial",
  name: "Testimonial",
  description:
    "Customer testimonial video with quote, rating, and attribution. Perfect for social proof and client showcases.",

  // ── Component Reference ───────────────────────────────────────────
  component: TestimonialAdapter,

  // ── Variants ──────────────────────────────────────────────────────
  layouts: ["centered", "split", "editorial"],
  defaultLayout: "centered",

  // ── Dimensions ────────────────────────────────────────────────────
  width: 1920,
  height: 1080,
  fps: 30 as ValidFps,
  durationInFrames: 150, // 5 seconds at 30fps

  // ── Theme Compatibility ───────────────────────────────────────────
  // undefined = compatible with all themes
  compatibleThemes: undefined,
  excludedThemes: undefined,

  // ── Sample Data ───────────────────────────────────────────────────
  defaultProps: {
    spec: SAMPLE_TESTIMONIAL_SPEC,
    layout: "centered",
    bgPattern: "grid",
  },
  sampleSpecs: [
    SAMPLE_TESTIMONIAL_SPEC as unknown as Record<string, unknown>,
    SAMPLE_EDITORIAL_SPEC as unknown as Record<string, unknown>,
    SAMPLE_SPLIT_SPEC as unknown as Record<string, unknown>,
  ],

  // ── Metadata ──────────────────────────────────────────────────────
  icon: "💬",
  color: "#6366f1",
  category: "social",
  hasImplementation: true,
};
