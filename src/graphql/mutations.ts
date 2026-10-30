export const LOGIN_MUTATION = `
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      success
      message
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      success
      message
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const SEND_RESET_CODE_MUTATION = `
  mutation SendResetCode($email: String!) {
    sendResetCode(email: $email) {
      success
      message
    }
  }
`;

export const VERIFY_RESET_CODE_MUTATION = `
  mutation VerifyResetCode($email: String!, $code: String!) {
    verifyResetCode(email: $email, code: $code) {
      success
      message
      token
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = `
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

export const RESEND_VERIFICATION_MUTATION = `
  mutation ResendVerification($email: String!) {
    resendVerification(email: $email) {
      success
      message
    }
  }
`;

export const CURRENT_USER_QUERY = `
  query CurrentUser {
    currentUser {
      isSuccess
      users {
        id
        username
        email
        phoneNumber
        avatar
        role
        diamond
        currentSteak
      }
    }
  }
`;

export const GOOGLE_LOGIN_MUTATION = `
  mutation GoogleLogin($idToken: String!) {
    googleLogin(idToken: $idToken) {
      success
      message
      accessToken
      refreshToken
    }
  }
`;

export const MARK_COMPLETE_LESSON_MUTATION = `
  mutation MarkCompleteLesson($input: MarkCompleteInput!) {
    markCompleteLesson(input: $input) {
      isSuccess
      message
    }
  }
`;

export const GENERATE_AUTO_QUIZ_MUTATION = `
  mutation GenerateAutoQuiz($lessonId: String!) {
    generateAutoQuiz(lessonId: $lessonId) {
      id
      lessonId
      name
      questions {
        id
        text
        options {
          id
          isCorrect
          text
        }
      }
    }
  }
`;

export const UPDATE_PROGRESS_MUTATION = `
  mutation UpdateProgress($input: UpdateProgressInput!) {
    updateProgress(input: $input) {
      isSuccess
      message
      progress {
        id
        userId
        status
        percentage
        completedLessons
        totalLessons
        courseId
      }
    }
  }
`;

export const CREATE_LESSON_FROM_AI_MUTATION = `
  mutation CreateLessonFromAi($data: CreateLessonFromAiInput!, $pdfFile: Upload!) {
    createLessonFromAi(data: $data, pdfFile: $pdfFile) {
      lesson_id
      content {
        url_pdf
        content
      }
    }
  }
`;

export const DELETE_LESSON_MUTATION = `
  mutation DeleteLesson($id: String!) {
    deleteLesson(id: $id) {
      id
      lessonName
      abstract
      createdAt
    }
  }
`;

export const UPLOAD_DOCUMENT_MUTATION = `
  mutation UploadDocument($file: Upload!, $uploadedBy: String) {
    uploadDocument(file: $file, uploadedBy: $uploadedBy) {
      success
      document {
        id
        fileName
        fileUrl
        fileType
        fileSize
      }
    }
  }
`;
