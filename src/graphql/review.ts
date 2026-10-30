import { USER_FIELDS_FRAGMENT, type UserFieldsData } from "./gamification";

export const REVIEW_FIELDS_FRAGMENT = `
  ${USER_FIELDS_FRAGMENT}
  fragment ReviewFields on Review {
    id
    rating
    content
    createdAt
    updatedAt
    user {
      ...UserFields
    }
  }
`;

export const GET_REVIEWS_BY_COURSE_QUERY = `
  ${REVIEW_FIELDS_FRAGMENT}
  query GetReviewsByCourse($courseId: String!) {
    getReviewsByCourse(courseId: $courseId) {
      isSuccess
      message
      reviews {
        ...ReviewFields
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = `
  ${REVIEW_FIELDS_FRAGMENT}
  mutation CreateReview($data: CreateReviewInput!) {
    createReview(data: $data) {
      isSuccess
      message
      reviews {
        ...ReviewFields
      }
    }
  }
`;

export const GET_REVIEWS_BY_COURSE = GET_REVIEWS_BY_COURSE_QUERY;
export const CREATE_REVIEW = CREATE_REVIEW_MUTATION;

export interface Review {
  id: string;
  rating: number;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: UserFieldsData | null;
}

export interface CreateReviewInput {
  courseId: string;
  rating: number;
  content?: string | null;
  userId?: string;
}

export interface ReviewResponse {
  isSuccess: boolean;
  message?: string | null;
  reviews: Review[];
}

export interface GetReviewsByCourseResponse {
  getReviewsByCourse: ReviewResponse | null;
}

export interface CreateReviewResponse {
  createReview: ReviewResponse;
}

export type { UserFieldsData };
