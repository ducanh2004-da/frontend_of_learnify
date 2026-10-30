export interface ContactInfo {
  key: string;
  label: string;
  value: string;
  icon: string;
  href?: string;
}

export const CONTACT_INFO: ContactInfo[] = [
  {
    key: "general",
    label: "General Inquiries",
    value: "hello@learnify.com",
    icon: "mail",
    href: "mailto:hello@learnify.com",
  },
  {
    key: "support",
    label: "Support",
    value: "support@learnify.com",
    icon: "headset_mic",
    href: "mailto:support@learnify.com",
  },
  {
    key: "partnerships",
    label: "Partnerships",
    value: "partners@learnify.com",
    icon: "handshake",
    href: "mailto:partners@learnify.com",
  },
  {
    key: "office",
    label: "Office",
    value: "123 Education Lane, Tech City, TC 90210",
    icon: "location_on",
  },
];

export const SOCIAL_LINKS = [
  {
    key: "twitter",
    name: "Twitter",
    icon: "twitter",
    url: "https://twitter.com/learnify",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    url: "https://linkedin.com/company/learnify",
  },
  {
    key: "github",
    name: "GitHub",
    icon: "github",
    url: "https://github.com/learnify",
  },
  {
    key: "youtube",
    name: "YouTube",
    icon: "youtube",
    url: "https://youtube.com/learnify",
  },
];
