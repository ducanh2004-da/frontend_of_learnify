# Frontend Integration Guide for Learnify Backend

> **Target Audience**: Frontend AI Generators, Frontend Engineers, Full-Stack Architects  
> **API Protocols**: GraphQL (via `graphql-request`) + REST Probes + Socket.io (Chat Gateway)  
> **Backend Port / Base URL**: `http://localhost:10000` (Production: `https://learnify-be.onrender.com`)  
> **GraphQL Endpoint**: `/graphql`  
> **CSRF Endpoint**: `/csrf-token`

---

## 1. Type Mapping: GraphQL to Frontend TypeScript

Ensure your frontend codebase (e.g., `src/types/graphql.ts`) implements the following type definitions:

### Core Enums

```typescript
export enum Role {
  INSTRUCTOR = "INSTRUCTOR",
  USER = "USER",
  REVIEWER = "REVIEWER",
  ADMIN = "ADMIN",
}

export enum StatusCourse {
  Published = "Published",
  Pending = "Pending",
  Rejected = "Rejected",
}

export enum ProgressStatusEnum {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export enum TransactionType {
  COURSE_PURCHASE = "COURSE_PURCHASE",
  REFUND = "REFUND",
  PARTIAL_REFUND = "PARTIAL_REFUND",
}

export enum DiamondSource {
  SYSTEM_STREAK = "SYSTEM_STREAK",
  INSTRUCTOR_REWARD = "INSTRUCTOR_REWARD",
  BUY_COURSE_REWARD = "BUY_COURSE_REWARD",
  VOUCHER_EXCHANGE = "VOUCHER_EXCHANGE",
  REFUND = "REFUND",
}

export enum DiamondTransactionType {
  EARN = "EARN",
  SPEND = "SPEND",
}

export enum SenderType {
  USER = "USER",
  AI = "AI",
}

export enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}
```

### Domain Interfaces

```typescript
// Custom Scalar Representations
export type DateTime = string; // ISO-8601 UTC
export type JSONValue =
  | Record<string, any>
  | any[]
  | string
  | number
  | boolean
  | null;
export type BigIntString = string; // PayOS order codes

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  avatar?: string | null;
  role?: Role | string | null;
  currentSteak: number;
  longestSteak: number;
  diamond: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  learningDate?: DateTime | null;
}

export interface CourseDto {
  id: string;
  courseName: string;
  abstract?: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  keyLearnings: string[];
  status?: StatusCourse | null;
}

export interface CoursePriceDto {
  id: string;
  originalPrice: number;
  salePrice?: number | null;
  isFree: boolean;
}

export interface LessonDto {
  id: string;
  lessonName: string;
  abstract?: string | null;
  courseId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface SectionResponse {
  id: string;
  urlPdf: string;
  content?: string | null;
  lecturer_segment?: JSONValue;
  order: number;
  lessonId: string;
  createdAt: DateTime;
}

export interface ProgressResponse {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  status: ProgressStatusEnum;
  lastCompletedLessonId?: string | null;
  lastCompleteAt?: DateTime | null;
  updatedAt: DateTime;
}

export interface ProgressLessonResponse {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  completeAt?: DateTime | null;
  lessonOrder: number;
  createdAt: DateTime;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  checkoutUrl?: string | null;
  qrCode?: string | null;
  amount: number;
  currency: string;
  status: string;
  expiresAt?: DateTime | null;
  accountNumber?: string | null;
  accountName?: string | null;
  bin?: string | null;
}

export interface QuizResponse {
  id: string;
  name?: string | null;
  lessonId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  questions: QuestionResponse[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  order?: number | null;
  options: OptionResponse[];
}

export interface OptionResponse {
  id: string;
  text: string;
  isCorrect: boolean;
}
```

---

## 2. Authentication & Authorization Lifecycle

The Learnify backend implements a dual auth mechanism supporting both **HTTP-only Cookies** and **Bearer Tokens**, guarded by **Double-CSRF Protection**.

```
                           Frontend Authentication Flow
┌──────────────────┐                                                  ┌──────────────────┐
│ Frontend Client  │                                                  │ NestJS Backend   │
└────────┬─────────┘                                                  └────────┬─────────┘
         │                                                                     │
         │ 1. GET /csrf-token (withCredentials: true)                          │
         ├────────────────────────────────────────────────────────────────────►│
         │◄────────────────────────────────────────────────────────────────────┤
         │    Returns { csrfToken } & sets __Host-psifi.x-csrf-token cookie    │
         │                                                                     │
         │ 2. mutation Login($data) [CSRF exempt]                              │
         ├────────────────────────────────────────────────────────────────────►│
         │◄────────────────────────────────────────────────────────────────────┤
         │    Returns { accessToken, refreshToken }                            │
         │    Sets 'Authentication' (90m) & 'Refresh' (7d) httpOnly cookies    │
         │                                                                     │
         │ 3. Protected Mutation (e.g., CreatePayment)                         │
         │    Headers: X-CSRF-Token: <csrfToken> + Cookie credentials          │
         ├────────────────────────────────────────────────────────────────────►│
         │◄────────────────────────────────────────────────────────────────────┤
         │                                                                     │
         │ 4. Access Token Expired (401 / UNAUTHENTICATED)                     │
         │    mutation Refresh                                                 │
         ├────────────────────────────────────────────────────────────────────►│
         │◄────────────────────────────────────────────────────────────────────┤
         │    Re-issues new cookies & returns success: true                    │
         │                                                                     │
         │ 5. Connect Socket.io Chat Gateway                                   │
         │    mutation CreateSocketToken ──► connect with auth: { token }      │
         └─────────────────────────────────────────────────────────────────────┘
```

### Step 1: CSRF Token Initialization

Before executing any protected GraphQL mutation, fetch the active CSRF token:

```typescript
let csrfToken: string | null = null;

export async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    credentials: "include", // Ensures __Host-psifi.x-csrf-token is set
  });
  const data = await response.json();
  csrfToken = data.csrfToken;
  return data.csrfToken;
}
```

### Step 2: Attaching Headers in GraphQL Client

Every GraphQL mutation must include:

1. `credentials: 'include'` (transmits `Authentication` and `__Host-psifi.x-csrf-token` cookies).
2. Header `X-CSRF-Token`: Value returned from `/csrf-token`.
3. Header `Authorization`: `Bearer <accessToken>` (optional if relying entirely on httpOnly cookies, but recommended for mobile/PWA).

---

## 3. Recommended Client Libraries & Setup Recipes

### Recommended Stack:

1. **API Client**: `API State Management: @tanstack/react-query
2. **GraphQL Client**: `graphql-request
3. **Global State**: `zustand` (lightweight state for user profile, current 3D avatar emotion, audio playback).
4. **Realtime**: `socket.io-client` (for peer-to-peer / group chat gateway).

### Complete Apollo Client Configuration:

```typescript
import {
  ApolloClient,
  InMemoryCache,
  from,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// 1. Auth & CSRF Context Link
const authLink = setContext(async (_, { headers }) => {
  if (!csrfToken) {
    await fetchCsrfToken();
  }
  return {
    headers: {
      ...headers,
      "x-csrf-token": csrfToken || "",
      // If token stored in memory/localStorage:
      // Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 2. HTTP Link with credentials
const httpLink = createHttpLink({
  uri: "http://localhost:10000/graphql",
  credentials: "include", // Critical for cookie authentication
});

// 3. WebSocket Link for Subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:10000/graphql",
  })
);

// 4. Silent Token Refresh on 401
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message === "No token provided"
      ) {
        // Trigger mutation Refresh and retry operation
      }
    }
  }
});

// 5. Split Link: Queries & Mutations via HTTP, Subscriptions via WS
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  from([errorLink, authLink, httpLink])
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
```

---

## 4. Pagination, Edge Cases & Error Handling

### 1. Pagination Pattern: Numerical Offset (`skip`)

The backend courses API uses offset-based pagination via the `skip: Float!` argument:

```graphql
query GetPublishedCourses($skip: Float!) {
  getAllPublishedCourses(skip: $skip) {
    isSuccess
    count
    courses {
      id
      courseName
    }
  }
}
```

- **Page 1**: `skip: 0`
- **Page 2**: `skip: 10` (or `skip: page * pageSize`)
- Total items available: `count` field in the response.

### 2. File Upload for AI Course Generation (`Upload` Scalar)

When calling `mutation CreateLessonFromAi($data: CreateLessonFromAiInput!, $pdfFile: Upload!)`:

- The client must transmit standard **GraphQL multipart request spec** (`multipart/form-data`).
- Use `apollo-upload-client` or construct a `FormData` object with operations, map, and file streams.
- **Timeout Consideration**: Processing PDFs with Gemini / FastAPI can take **15–45 seconds**. Ensure client HTTP request timeout is configured to at least **60 seconds**.

### 3. PayOS VietQR Payment Handling

1. Invoke `mutation CreatePayment(input: { courseId: $id })`.
2. Extract `checkoutUrl` and `qrCode` from `PaymentResponse`.
3. Display VietQR dynamically or redirect user to `checkoutUrl`.
4. Poll status using `query CheckPaymentStatus(input: { paymentId: $paymentId })` every 3–5 seconds until `status === 'COMPLETED'`.

### 4. Normalized Error Contract

Backend exceptions return normalized extensions:

```typescript
interface GraphQLErrorExtension {
  code:
    | "DUPLICATE_DATA"
    | "RECORD_NOT_FOUND"
    | "BAD_GATEWAY"
    | "CSRF_TOKEN_INVALID"
    | "ThrottlerException"
    | "INTERNAL_SERVER_ERROR";
  httpStatus?: number;
  aiResponse?: any;
  details?: string;
}
```

- **`DUPLICATE_DATA`**: Notify user of duplicate record (e.g., email already registered or already enrolled).
- **`CSRF_TOKEN_INVALID`**: Automatically re-fetch `/csrf-token` and retry mutation.
- **`ThrottlerException`**: Rate limit exceeded (user executing >5 req/sec). Show cooldown toast.
- **`BAD_GATEWAY`**: AI engine failure (FastAPI / Gemini downstream error).
