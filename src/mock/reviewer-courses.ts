export type TReviewStatus = "Pending" | "Published" | "Rejected";

export type TReviewerCourse = {
  id: string | number;
  title: string;
  instructorName: string;
  dateSubmitted: string;
  status: TReviewStatus;
  thumbnail: string;
};

export type MockLesson = {
  id: string;
  lessonName: string;
  abstract: string;
  order: number;
};

export type MockCourseDetail = TReviewerCourse & {
  abstract: string;
  keyLearnings: string[];
  creatorName: string;
  lessons: MockLesson[];
};

export const MOCK_REVIEWER_COURSES: TReviewerCourse[] = [
  {
    id: 1,
    title: "Mastering ReactJS & TanStack Router",
    instructorName: "Alice Johnson",
    dateSubmitted: "Oct 24, 2024",
    status: "Pending",
    thumbnail: "https://placehold.co/40x40/4f46e5/ffffff?text=RC",
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals for Developers",
    instructorName: "Bob Martinez",
    dateSubmitted: "Oct 22, 2024",
    status: "Pending",
    thumbnail: "https://placehold.co/40x40/0891b2/ffffff?text=UI",
  },
  {
    id: 3,
    title: "NestJS Backend: Build Scalable APIs",
    instructorName: "Carol Wang",
    dateSubmitted: "Oct 20, 2024",
    status: "Pending",
    thumbnail: "https://placehold.co/40x40/dc2626/ffffff?text=NJ",
  },

  {
    id: 4,
    title: "PostgreSQL & Database Design Essentials",
    instructorName: "David Kim",
    dateSubmitted: "Oct 18, 2024",
    status: "Published",
    thumbnail: "https://placehold.co/40x40/16a34a/ffffff?text=DB",
  },
  {
    id: 5,
    title: "GraphQL with TypeScript — End-to-End",
    instructorName: "Eva Nguyen",
    dateSubmitted: "Oct 15, 2024",
    status: "Published",
    thumbnail: "https://placehold.co/40x40/9333ea/ffffff?text=GQ",
  },
  {
    id: 6,
    title: "Docker & Kubernetes for Full-Stack Devs",
    instructorName: "Frank Lee",
    dateSubmitted: "Oct 10, 2024",
    status: "Published",
    thumbnail: "https://placehold.co/40x40/0369a1/ffffff?text=DK",
  },

  {
    id: 7,
    title: "Introduction to Machine Learning",
    instructorName: "Grace Chen",
    dateSubmitted: "Oct 8, 2024",
    status: "Rejected",
    thumbnail: "https://placehold.co/40x40/b45309/ffffff?text=ML",
  },
  {
    id: 8,
    title: "Flutter Mobile App Development",
    instructorName: "Henry Park",
    dateSubmitted: "Oct 5, 2024",
    status: "Rejected",
    thumbnail: "https://placehold.co/40x40/0e7490/ffffff?text=FL",
  },
];

export const MOCK_COURSE_DETAILS: MockCourseDetail[] = [
  {
    id: 1,
    title: "Mastering ReactJS & TanStack Router",
    instructorName: "Alice Johnson",
    creatorName: "Alice Johnson",
    dateSubmitted: "Oct 24, 2024",
    status: "Pending",
    thumbnail: "https://placehold.co/40x40/4f46e5/ffffff?text=RC",
    abstract:
      "A comprehensive deep-dive into the modern React ecosystem centred around TanStack Router and TanStack Start. Students will go from zero to building fully server-rendered, type-safe React applications with file-based routing, data loaders, and search-param management.",
    keyLearnings: [
      "Set up TanStack Router with file-based routing in a Vite project",
      "Use loaders and actions for server-side data fetching",
      "Manage type-safe search params and dynamic segments",
      "Integrate TanStack Query for client-side caching",
      "Deploy a production-ready TanStack Start application",
    ],
    lessons: [
      {
        id: "l1-1",
        order: 1,
        lessonName: "Introduction to Modern React Routing",
        abstract:
          "Overview of why file-based routing exists and how TanStack Router differs from React Router.",
      },
      {
        id: "l1-2",
        order: 2,
        lessonName: "Setting Up a TanStack Start Project",
        abstract:
          "Scaffold a new project, configure Vite, and wire up the router plugin from scratch.",
      },
      {
        id: "l1-3",
        order: 3,
        lessonName: "Route Files, Layouts & Outlets",
        abstract:
          "Understand route.tsx, index.tsx, and nested layout patterns with Outlet.",
      },
      {
        id: "l1-4",
        order: 4,
        lessonName: "Data Loaders & Server Functions",
        abstract:
          "Fetch data before a route renders using loaders, and expose server-only functions.",
      },
      {
        id: "l1-5",
        order: 5,
        lessonName: "Search Params & Type Safety",
        abstract:
          "Validate and infer URL search parameters with Zod schemas built into the router.",
      },
      {
        id: "l1-6",
        order: 6,
        lessonName: "Integrating TanStack Query",
        abstract:
          "Layer TanStack Query on top of loaders for client-side cache invalidation and optimistic updates.",
      },
    ],
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals for Developers",
    instructorName: "Bob Martinez",
    creatorName: "Bob Martinez",
    dateSubmitted: "Oct 22, 2024",
    status: "Pending",
    thumbnail: "https://placehold.co/40x40/0891b2/ffffff?text=UI",
    abstract:
      "Bridges the gap between engineering and design. Developers will learn the core principles that make interfaces feel intuitive, accessible, and visually compelling — without needing a design background.",
    keyLearnings: [
      "Apply the fundamentals of visual hierarchy and spacing",
      "Design accessible colour palettes and typography systems",
      "Create interactive prototypes in Figma",
      "Conduct basic usability tests and interpret results",
      "Translate Figma designs into pixel-perfect React components",
    ],
    lessons: [
      {
        id: "l2-1",
        order: 1,
        lessonName: "Design Thinking for Engineers",
        abstract:
          "Framing problems from the user's perspective before writing a single line of code.",
      },
      {
        id: "l2-2",
        order: 2,
        lessonName: "Visual Hierarchy & Layout Grids",
        abstract:
          "How the eye moves across a page, and how to guide it with size, weight, and whitespace.",
      },
      {
        id: "l2-3",
        order: 3,
        lessonName: "Colour Theory & Accessible Palettes",
        abstract:
          "Build WCAG 2.2-compliant colour systems using HSL and contrast-ratio tooling.",
      },
      {
        id: "l2-4",
        order: 4,
        lessonName: "Typography Systems",
        abstract:
          "Type scales, line-height, and pairing rules that produce readable, premium-looking UIs.",
      },
      {
        id: "l2-5",
        order: 5,
        lessonName: "Prototyping in Figma",
        abstract:
          "Auto-layout, components, and interactive prototypes that you can hand to stakeholders.",
      },
    ],
  },
  {
    id: 3,
    title: "NestJS Backend: Build Scalable APIs",
    instructorName: "Carol Wang",
    creatorName: "Carol Wang",
    dateSubmitted: "Oct 20, 2024",
    status: "Pending",
    thumbnail: "https://placehold.co/40x40/dc2626/ffffff?text=NJ",
    abstract:
      "Learn to architect enterprise-grade REST and GraphQL APIs with NestJS, Prisma, and PostgreSQL. Covers authentication, role-based authorization, background jobs, and containerised deployment.",
    keyLearnings: [
      "Structure NestJS modules, controllers, and services",
      "Integrate Prisma ORM with PostgreSQL",
      "Implement JWT authentication and RBAC guards",
      "Write unit and e2e tests with Jest and Supertest",
      "Deploy to Docker and configure CI/CD pipelines",
    ],
    lessons: [
      {
        id: "l3-1",
        order: 1,
        lessonName: "NestJS Architecture Overview",
        abstract:
          "Modules, dependency injection, and how NestJS maps onto Angular-inspired patterns.",
      },
      {
        id: "l3-2",
        order: 2,
        lessonName: "Building Your First REST Endpoint",
        abstract:
          "Controllers, DTOs, validation pipes, and serialisation interceptors.",
      },
      {
        id: "l3-3",
        order: 3,
        lessonName: "Prisma ORM & Database Migrations",
        abstract:
          "Define schemas, run migrations, and query data type-safely with Prisma Client.",
      },
      {
        id: "l3-4",
        order: 4,
        lessonName: "Authentication with Passport & JWT",
        abstract:
          "Stateless auth flows, refresh tokens, and protecting routes with guards.",
      },
      {
        id: "l3-5",
        order: 5,
        lessonName: "Testing Strategies for NestJS",
        abstract:
          "Unit-test services with Jest mocks; e2e-test controllers with a real in-memory database.",
      },
      {
        id: "l3-6",
        order: 6,
        lessonName: "Dockerising & Deploying the API",
        abstract:
          "Multi-stage Dockerfile, docker-compose for local dev, and GitHub Actions for CI.",
      },
    ],
  },
  {
    id: 4,
    title: "PostgreSQL & Database Design Essentials",
    instructorName: "David Kim",
    creatorName: "David Kim",
    dateSubmitted: "Oct 18, 2024",
    status: "Published",
    thumbnail: "https://placehold.co/40x40/16a34a/ffffff?text=DB",
    abstract:
      "Solid relational database fundamentals using PostgreSQL. From data modelling and normalisation through to indexing strategies, transactions, and performance tuning.",
    keyLearnings: [
      "Model domains with ER diagrams and normalise to 3NF",
      "Write efficient SQL with JOINs, CTEs, and window functions",
      "Design and maintain indexes for query performance",
      "Use transactions and understand isolation levels",
      "Tune slow queries with EXPLAIN ANALYZE",
    ],
    lessons: [
      {
        id: "l4-1",
        order: 1,
        lessonName: "Relational Modelling & Normalisation",
        abstract:
          "Entities, attributes, relationships, and the rules for 1NF through 3NF.",
      },
      {
        id: "l4-2",
        order: 2,
        lessonName: "Advanced SQL Queries",
        abstract: "JOINs, subqueries, CTEs, and aggregate window functions.",
      },
      {
        id: "l4-3",
        order: 3,
        lessonName: "Indexes & Query Planning",
        abstract:
          "B-tree, GIN, and BRIN indexes — when to add them and when to avoid them.",
      },
    ],
  },
  {
    id: 5,
    title: "GraphQL with TypeScript — End-to-End",
    instructorName: "Eva Nguyen",
    creatorName: "Eva Nguyen",
    dateSubmitted: "Oct 15, 2024",
    status: "Published",
    thumbnail: "https://placehold.co/40x40/9333ea/ffffff?text=GQ",
    abstract:
      "Build a fully type-safe GraphQL API with TypeGraphQL and Apollo Server, then consume it from a React client with Apollo Client and generated hooks.",
    keyLearnings: [
      "Define a schema-first vs code-first GraphQL API",
      "Resolve queries, mutations, and subscriptions",
      "Generate TypeScript types from the schema with codegen",
      "Optimise with DataLoader to solve the N+1 problem",
      "Handle auth context and field-level guards",
    ],
    lessons: [
      {
        id: "l5-1",
        order: 1,
        lessonName: "GraphQL Fundamentals",
        abstract: "Schema language, resolvers, and the request lifecycle.",
      },
      {
        id: "l5-2",
        order: 2,
        lessonName: "Code-First API with TypeGraphQL",
        abstract:
          "Decorators, argument types, and automatic schema generation.",
      },
      {
        id: "l5-3",
        order: 3,
        lessonName: "Apollo Client & Generated Hooks",
        abstract: "Codegen setup, cache policies, and reactive query hooks.",
      },
    ],
  },
  {
    id: 6,
    title: "Docker & Kubernetes for Full-Stack Devs",
    instructorName: "Frank Lee",
    creatorName: "Frank Lee",
    dateSubmitted: "Oct 10, 2024",
    status: "Published",
    thumbnail: "https://placehold.co/40x40/0369a1/ffffff?text=DK",
    abstract:
      "Practical containerisation and orchestration for developers who want to ship confidently. Covers Docker fundamentals, multi-service compose setups, Kubernetes deployments, and cloud-native patterns.",
    keyLearnings: [
      "Write optimised multi-stage Dockerfiles",
      "Orchestrate multi-container apps with docker-compose",
      "Deploy to a Kubernetes cluster with Deployments and Services",
      "Manage configuration with ConfigMaps and Secrets",
      "Set up Helm charts for repeatable releases",
    ],
    lessons: [
      {
        id: "l6-1",
        order: 1,
        lessonName: "Docker Fundamentals",
        abstract: "Images, layers, containers, and the Docker daemon.",
      },
      {
        id: "l6-2",
        order: 2,
        lessonName: "docker-compose for Local Dev",
        abstract:
          "Defining services, volumes, networks, and health checks in a single YAML file.",
      },
      {
        id: "l6-3",
        order: 3,
        lessonName: "Kubernetes Core Concepts",
        abstract: "Pods, ReplicaSets, Deployments, and Services explained.",
      },
      {
        id: "l6-4",
        order: 4,
        lessonName: "Helm Charts & Release Management",
        abstract:
          "Package Kubernetes manifests into reusable, versioned Helm charts.",
      },
    ],
  },
  {
    id: 7,
    title: "Introduction to Machine Learning",
    instructorName: "Grace Chen",
    creatorName: "Grace Chen",
    dateSubmitted: "Oct 8, 2024",
    status: "Rejected",
    thumbnail: "https://placehold.co/40x40/b45309/ffffff?text=ML",
    abstract:
      "An accessible introduction to the core concepts of machine learning, covering supervised and unsupervised learning with Python and scikit-learn.",
    keyLearnings: [
      "Understand the ML workflow end to end",
      "Apply linear and logistic regression",
      "Evaluate models with cross-validation and metrics",
      "Use clustering algorithms for unsupervised tasks",
    ],
    lessons: [
      {
        id: "l7-1",
        order: 1,
        lessonName: "What is Machine Learning?",
        abstract:
          "Types of ML, the bias-variance tradeoff, and key vocabulary.",
      },
      {
        id: "l7-2",
        order: 2,
        lessonName: "Linear Regression from Scratch",
        abstract: "Gradient descent, cost functions, and the normal equation.",
      },
      {
        id: "l7-3",
        order: 3,
        lessonName: "Model Evaluation",
        abstract:
          "Train/val/test splits, k-fold CV, precision, recall, and F1.",
      },
    ],
  },
  {
    id: 8,
    title: "Flutter Mobile App Development",
    instructorName: "Henry Park",
    creatorName: "Henry Park",
    dateSubmitted: "Oct 5, 2024",
    status: "Rejected",
    thumbnail: "https://placehold.co/40x40/0e7490/ffffff?text=FL",
    abstract:
      "Build cross-platform iOS and Android apps with Flutter and Dart. Learn widget composition, state management with Riverpod, and native device API integration.",
    keyLearnings: [
      "Compose UIs with Flutter's widget tree",
      "Manage state with Riverpod providers",
      "Navigate with go_router",
      "Access device APIs (camera, location, push notifications)",
      "Publish to the App Store and Google Play",
    ],
    lessons: [
      {
        id: "l8-1",
        order: 1,
        lessonName: "Dart Language Essentials",
        abstract:
          "Null safety, async/await, and the Dart type system for Flutter developers.",
      },
      {
        id: "l8-2",
        order: 2,
        lessonName: "Flutter Widget Architecture",
        abstract:
          "Stateless vs stateful widgets, the widget lifecycle, and tree rebuilds.",
      },
      {
        id: "l8-3",
        order: 3,
        lessonName: "State Management with Riverpod",
        abstract:
          "Providers, notifiers, and scoping reactive state across the widget tree.",
      },
    ],
  },
];
