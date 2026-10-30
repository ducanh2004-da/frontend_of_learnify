export const GET_PROFILE = `
query GetUserProfile($userId: String!) {
    currentUser {
      count
      isSuccess
      message
      users {
        id
        username
        email
        diamond
        currentSteak
        phoneNumber
        role
      }
    }
    countSuccessEnrollments(userId: $userId) {
      count
      data {
        id
        courseName
        abstract
        isDone
        keyLearnings
      }
    }
    countInProgressEnrollments(userId: $userId) {
      count
      data {
        id
        courseName
        abstract
        isDone
        keyLearnings
      }
      progress
    }
  }
`;

export const UPDATE_USER = `
mutation Mutation($data: UpdateUserInput!) {
  updateUser(data: $data) {
    isSuccess
    message
    count
    users {
      id
      email
      role
      phoneNumber
      username
      avatar
      diamond
      currentSteak
    }
  }
}
`;

export * from "./gamification";
