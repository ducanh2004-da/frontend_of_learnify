export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "future-of-ai-education",
    title: "The Future of AI in Education",
    date: "May 15, 2026",
    excerpt:
      "How 3D AI lecturers are transforming the way we learn and retain knowledge through immersive, interactive experiences.",
    category: "AI & Tech",
    readTime: "5 min read",
    tags: ["AI", "3D Learning", "EdTech"],
  },
  {
    id: "career-ready-skills",
    title: "Building Career-Ready Skills",
    date: "May 10, 2026",
    excerpt:
      "Why hands-on labs and interactive learning lead to better job outcomes and faster skill acquisition.",
    category: "Career",
    readTime: "4 min read",
    tags: ["Career", "Skills", "Labs"],
  },
  {
    id: "introducing-learnify-pro",
    title: "Introducing Learnify Pro",
    date: "May 1, 2026",
    excerpt:
      "Unlimited courses, labs, and AI-guided mentorship for serious learners ready to accelerate their growth.",
    category: "Product",
    readTime: "3 min read",
    tags: ["Pro", "Subscription", "Features"],
  },
  {
    id: "3d-learning-science",
    title: "The Science Behind 3D Learning",
    date: "April 28, 2026",
    excerpt:
      "Research shows that spatial and interactive learning environments improve retention by up to 40%.",
    category: "Research",
    readTime: "6 min read",
    tags: ["3D", "Science", "Retention"],
  },
  {
    id: "instructor-toolkit",
    title: "The Modern Instructor's Toolkit",
    date: "April 20, 2026",
    excerpt:
      "How educators are leveraging AI-powered analytics and 3D content to create more engaging classrooms.",
    category: "Teaching",
    readTime: "5 min read",
    tags: ["Instructors", "Analytics", "Classroom"],
  },
  {
    id: "institution-partnerships",
    title: "Scaling Education for Institutions",
    date: "April 15, 2026",
    excerpt:
      "How universities and training centers are deploying Learnify to reach more students with less overhead.",
    category: "Institutions",
    readTime: "4 min read",
    tags: ["Enterprise", "Universities", "Scale"],
  },
];
