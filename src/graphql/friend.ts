export const GET_MY_FRIENDS = `
  query GetMyFriends {
    myFriends {
      isSuccess
      message
      count
      users {
        id
        username
        email
        avatar
        role
      }
    }
  }
`;

export const GET_PENDING_REQUESTS = `
  query GetPendingRequests {
    myPendingFriendRequests {
      isSuccess
      message
      count
      users {
        id
        email
        username
        avatar
        role
        phoneNumber
      }
    }
  }
`;

export const RESPOND_FRIEND_REQUEST = `
  mutation RespondFriendRequest($requesterId: String!, $isAccepted: Boolean!) {
    respondFriendRequest(requesterId: $requesterId, isAccepted: $isAccepted) {
      isSuccess
      message
      count
      users {
        id
        username
        role
        email
        avatar
      }
    }
  }
`;

export const GET_LEADERBOARD = `
  query GetSteakLeaderboard {
    getSteakLeaderboard {
      isSuccess
      count
      message
      users {
        id
        email
        diamond
        currentSteak
        longestSteak
        phoneNumber
        username
        role
        avatar
      }
    }
  }
`;

export const SEND_FRIEND_REQUEST = `
  mutation SendFriendRequest($targetUserId: String!) {
    sendFriendRequest(targetUserId: $targetUserId) {
      isSuccess
      message
      count
      users {
        id
        username
        email
        avatar
        role
      }
    }
  }
`;
