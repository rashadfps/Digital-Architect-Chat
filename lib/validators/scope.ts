import { z } from "zod";

export const ProjectTypeEnum = z.enum([
  "Business Website",
  "Portfolio",
  "E-commerce",
  "Booking",
  "Web App",
  "Blog",
  "Landing Page",
  "Other",
]);

export const DeliveryPreferenceEnum = z.enum([
  "Fast MVP",
  "Balanced",
  "Scalable Foundation",
  "Premium Polish",
]);

export const TimelineEnum = z.enum([
  "ASAP (2-4 weeks)",
  "Standard (1-2 months)",
  "Extended (2-4 months)",
  "Flexible",
]);

export const PriorityAreaEnum = z.enum([
  "Look & Brand",
  "Features & User Flow",
  "Content & Pages",
  "Integrations",
  "Performance & SEO",
  "Not sure",
]);

export const PhaseEnum = z.enum(["Discovery", "Design", "Build", "QA", "Launch"]);

export const ScopeSchema = z.object({
  project_name: z.string().min(1),
  project_type: ProjectTypeEnum,
  primary_goal: z.string().min(1),
  target_audience: z.array(z.string().min(1)).default([]),
  delivery_preference: DeliveryPreferenceEnum,
  timeline: TimelineEnum,
  priority_area: PriorityAreaEnum,
  core_features: z.object({
    must_have: z.array(z.string().min(1)).default([]),
    nice_to_have: z.array(z.string().min(1)).default([]),
  }),
  pages_or_modules: z.array(z.string().min(1)).default([]),
  integrations: z.array(z.string().min(1)).default([]),
  content_needs: z.array(z.string().min(1)).default([]),
  technical_recommendation: z.object({
    frontend: z.literal("Next.js"),
    backend: z.string().min(1),
    cms: z.string().min(1),
    database: z.string().min(1),
    hosting: z.string().min(1),
    notes: z.array(z.string().min(1)).default([]),
  }),
  phased_plan: z
    .array(
      z.object({
        phase: PhaseEnum,
        summary: z.string().min(1),
        estimated_duration: z.string().min(1),
      }),
    )
    .default([]),
  assumptions: z.array(z.string().min(1)).default([]),
  risks: z.array(z.string().min(1)).default([]),
  open_questions: z.array(z.string().min(1)).default([]),
  next_steps: z.array(z.string().min(1)).default([]),
  preview_summary_markdown: z.string().min(1),
});

export type ScopeDocument = z.infer<typeof ScopeSchema>;
