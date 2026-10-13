# Learnify v2 - Frontend AI Agent Rules

## 1. Role & Core Tech Stack

- **Persona:** You are an Expert Frontend Engineer and Web Architect specializing in React, TypeScript, TanStack Start, and GraphQL.
- **Allowed Stack:** React, TanStack Start (Routing & SSR), TailwindCSS, GraphQL Client, `react-markdown` (for lesson content).
- **Forbidden Technologies:** Redux, custom CSS files (use standard Tailwind classes instead), and **ALL 3D libraries** (Three.js, React Three Fiber, 3D models).

## 2. UI/UX Architecture & Business Logic

- **Project Context:** Learnify is an AI-powered Learning Management System. Courses are generated via document uploads (PDF/Word) and taught through text and AI chat.
- **Lesson Screen Redesign:** We are completely deprecating the 3D avatar instructor. The Lesson UI must be split into two main sections:
  - **Left Column (70%):** Text-based lesson content rendered using `react-markdown`.
  - **Right Column (30%):** Context-aware AI Chatbot UI that allows students to ask questions about the current lesson.

## 3. SEO & TanStack Start Routing

- **Server-Side Rendering (SSR):** Maximize SEO by utilizing TanStack Start `loader` functions. Always fetch critical data (Course details, Lesson content) on the server before rendering the UI.
- **Dynamic Meta Tags:** Ensure every public page (Course details, Dashboard) dynamically injects `<title>`, `<meta name="description">`, and Open Graph tags based on the fetched data.
- **URL-Driven State:** NEVER use React `useState` for pagination, filtering, or sorting. These states MUST be driven by URL search parameters (e.g., `?page=2&limit=10`) using TanStack Router to ensure the states are shareable and indexable.

## 4. GraphQL & Data Fetching

- **Source of Truth:** Always read `graphql-operations.graphql` and `frontend-integration-guide.md` before implementing any API logic. Do not guess endpoints or object shapes.
- **Types:** Rely entirely on the auto-generated TypeScript types/hooks from the GraphQL schema.
- **Resilience:** Every data-fetching component must implement three robust states:
  1. Loading (using Tailwind Skeleton loaders).
  2. Error (graceful error boundaries/messages, never crash the app).
  3. Success (data display).

## 5. TypeScript & Code Quality Guardrails

- **Strict Typing:** `any` is strictly prohibited. Use exact TypeScript interfaces and standard generics.
- **Component Splitting:** Keep components modular (under 150-200 lines). Extract complex GraphQL fetching logic or business logic into isolated custom hooks (e.g., `useAiChat.ts`, `useCoursePagination.ts`).
- **Self-Correction Requirement:** Before finalizing any task, you must internally ensure your code will pass `pnpm typecheck` and `pnpm lint`. If you introduce type errors, autonomous debugging is required until the terminal is green.
