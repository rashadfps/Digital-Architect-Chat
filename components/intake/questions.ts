export type IntakeAnswers = {
  projectType?: string;
  primaryGoal?: string;
  coreFeatures?: string[];
  priorityArea?: string;
  deliveryPreference?: string;
  timeline?: string;
  followUp?: string;
};

type IntakeQuestion = {
  id: keyof IntakeAnswers;
  label: string;
  options: string[];
  multi?: boolean;
};

export const WEBSITE_ONLY_GUARDRAIL =
  "Great idea — I specialize in website and web application projects. If your idea is broader, no problem — I’ll guide you using web-focused modules (pages, features, users, content, integrations) so we can turn it into a clear scope document.";

export const intakeQuestions: IntakeQuestion[] = [
  {
    id: "projectType",
    label: "What type of website/web app do you want?",
    options: [
      "Business Website",
      "Portfolio",
      "E-commerce",
      "Booking",
      "Web App",
      "Blog",
      "Landing Page",
      "Other",
    ],
  },
  {
    id: "primaryGoal",
    label: "What is your primary goal?",
    options: [
      "Generate leads",
      "Sell products",
      "Showcase services/work",
      "User accounts/community",
      "Automate workflow",
      "Share information/content",
      "Other",
    ],
  },
  {
    id: "coreFeatures",
    label: "Which core modules/features do you need?",
    options: [
      "Contact form",
      "CMS/admin editing",
      "Login/signup",
      "Payments",
      "Booking/calendar",
      "Search/filter",
      "Chat/support",
      "Analytics dashboard",
      "Multi-language",
      "API integrations",
      "Other",
    ],
    multi: true,
  },
  {
    id: "priorityArea",
    label: "Which area should we prioritize most?",
    options: [
      "Look & Brand",
      "Features & User Flow",
      "Content & Pages",
      "Integrations",
      "Performance & SEO",
      "Not sure",
    ],
  },
  {
    id: "deliveryPreference",
    label: "Which delivery mode do you prefer?",
    options: ["Fast MVP", "Balanced", "Scalable Foundation", "Premium Polish"],
  },
  {
    id: "timeline",
    label: "Preferred timeline?",
    options: [
      "ASAP (2-4 weeks)",
      "Standard (1-2 months)",
      "Extended (2-4 months)",
      "Flexible",
    ],
  },
];
