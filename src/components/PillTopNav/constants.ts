export const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  {
    key: "resources",
    label: "Resources",
    href: "#",
    children: [
      {
        key: "blogs",
        title: "Blogs",
        href: "/blogs",
        description: "Insights, tutorials, and updates from the Learnify team.",
      },
      {
        key: "courses",
        title: "Courses",
        href: "/learner/courses",
        description:
          "Browse thousands of expert-led courses across every field.",
      },
      {
        key: "roadmaps",
        title: "Roadmaps",
        href: "/learner/roadmaps",
        description: "Structured learning paths from beginner to career-ready.",
      },
    ],
  },
  { key: "about_us", label: "About Us", href: "/about-us" },
  { key: "contact", label: "Contact", href: "/contact" },
];
