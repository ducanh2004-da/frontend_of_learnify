export const USER_FIELDS_FRAGMENT = `
  fragment UserFields on UserResponse {
    id
    username
    email
    phoneNumber
    avatar
    role
    currentSteak
    longestSteak
    diamond
    createdAt
    updatedAt
    learningDate
  }
`;

export const INCREASE_STREAK_MUTATION = `
  ${USER_FIELDS_FRAGMENT}
  mutation IncreaseStreak {
    increaseCurrentStreak {
      isSuccess
      message
      users {
        ...UserFields
      }
    }
  }
`;

export const UPDATE_DIAMONDS_MUTATION = `
  ${USER_FIELDS_FRAGMENT}
  mutation UpdateDiamonds($data: UpdateDiamondInput!) {
    updateDiamond(data: $data) {
      isSuccess
      message
      users {
        ...UserFields
      }
    }
  }
`;

export type DiamondTransactionType = "EARN" | "SPEND";

export type DiamondSourceType =
  | "SYSTEM_STREAK"
  | "INSTRUCTOR_REWARD"
  | "BUY_COURSE_REWARD"
  | "VOUCHER_EXCHANGE"
  | "REFUND";

export interface UpdateDiamondInput {
  userId: string;
  amount: number;
  transactionType: DiamondTransactionType;
  source: DiamondSourceType;
}

export interface UserFieldsData {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  avatar?: string | null;
  role?: string | null;
  currentSteak?: number | null;
  currentStreak?: number | null;
  longestSteak?: number | null;
  longestStreak?: number | null;
  diamond?: number | null;
  diamonds?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  learningDate?: string | null;
}

export interface GamificationMutationResult {
  isSuccess: boolean;
  message?: string | null;
  users: UserFieldsData[];
}

export interface IncreaseStreakResponse {
  increaseCurrentStreak: GamificationMutationResult;
}

export interface UpdateDiamondsResponse {
  updateDiamond: GamificationMutationResult;
}
