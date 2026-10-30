export const GET_ALL_USERS_QUERY = `
  query GetAllUsers {
    users {
      count
      message
      users {
        avatar
        email
        id
        phoneNumber
        role
        updatedAt
        username
        createdAt
      }
    }
  }
`;

export const CREATE_USER_MUTATION = `
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      createdAt
      email
      id
      phoneNumber
      role
      username
    }
  }
`;

export const UPDATE_ADMIN_USER_MUTATION = `
  mutation UpdateAdminUser($data: UpdateUserAdminInput!) {
    updateAdmin(data: $data) {
      email
      createdAt
      id
      phoneNumber
      role
      username
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;
