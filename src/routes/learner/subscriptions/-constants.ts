import type { TSubscription } from "./-types/type";

export const SUBSCRIPTIONS: TSubscription[] = [
  {
    type: "Starter",
    title: "Starter",
    icon: "sell",
    price: "<strong>Free</strong>",
    subtitle:
      "Start learning with basic access to hands-on labs and earn your first skill badges.",
    descriptions: [
      "<strong>35 free</strong> credits every month",
      "<strong>10 questions</strong> for 3D AI Lecturers per month",
      "Access to foundational courses and limited labs",
    ],
  },
  {
    type: "Pro",
    title: "Pro",
    icon: "business_center",
    price: "<strong>$49</strong> / month",
    subtitle:
      "Unlock unlimited hands-on learning from beginner to advanced levels.",
    descriptions: [
      "<strong>Unlimited</strong> access to thousands of courses and labs",
      "Full access to the Learnify content library",
      "<strong>Included everything in Free plan</strong>",
    ],
  },
  {
    type: "Career",
    title: "Career",
    icon: "star",
    price: "<strong>$99</strong> / month",
    subtitle:
      "Launch your career in high-paying fields with the skills employers are looking for.",
    descriptions: [
      "Validated by <strong>top employers</strong>",
      "<strong>Unlimited questions</strong> for 3D AI Lecturers",
      "Access to <strong>professional certification programs</strong>",
    ],
  },
] as const;
