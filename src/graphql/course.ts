export const GET_LESSON_BY_ID = `
  query GetLessonById($id: String!) {
    getLessonById(id: $id) {
      isSuccess
      lessons {
        id
        lessonName
        abstract
        courseId
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_SECTION_BY_LESSON = `
  query GetSectionByLesson($lessonId: String!) {
    getSectionByLesson(lessonId: $lessonId) {
      id
      urlPdf
      content
      lecturer_segment
      order
      lessonId
      createdAt
    }
  }
`;

export const GET_SECTIONS_BY_LESSON = GET_SECTION_BY_LESSON;

export const GET_COURSE_BY_ID = `
  query GetCourseById($id: String!) {
    getCourseById(id: $id) {
      id
      courseName
      abstract
      keyLearnings
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_LESSONS_BY_COURSE_ID_QUERY = `
  query GetLessonsByCourseId($id: String!) {
    getLessonsByCourseId(id: $id) {
      isSuccess
      lessons {
        id
        lessonName
        abstract
        courseId
        createdAt
        updatedAt
      }
    }
  }
`;
export const GET_ALL_COURSES_QUERY = `
query Query($skip: Float!) {
  getAllCourses(skip: $skip) {
    courses {
      id
      courseName
      abstract
      keyLearnings
      status
      createdAt
    }
    isSuccess
    count
    message
  }
}
`;

export const GET_ALL_PUBLISHED_COURSES_QUERY = `
  query Query($skip: Float!) {
  getAllPublishedCourses(skip: $skip) {
    isSuccess
    message
    count
    courses {
      id
      courseName
      abstract
      createdAt
      keyLearnings
      status
      updatedAt
    }
  }
}
`;

export const GET_COURSE_LESSONS_COMMENT_QUERY = `
  query GetCourseLessonsComment($courseId: String!, $lessonCourseId: String!) {
    getCourseById(id: $courseId) {
      id
      courseName
      abstract
      createdAt
      keyLearnings
      status
      updatedAt
    }
    getLessonsByCourseId(id: $lessonCourseId) {
      isSuccess
      count
      message
      lessons {
        id
        courseId
        abstract
        createdAt
        lessonName
        updatedAt
      }
    }
    getReviewsByCourse(courseId: $courseId) {
    isSuccess
    message
    reviews {
      id
      content
      rating
      createdAt
      user {
        id
        email
        diamond
        currentSteak
        role
        username
      }
    }
  }
  }
`;

export const ENROLL_COURSE_MUTATION = `
  mutation EnrollCourse($input: CreateEnrollmentInput!) {
    enrollCourse(input: $input) {
      id
      userId
      enrolledAt
      courseId
    }
  }
`;

export const GET_USER_ENROLLMENTS_QUERY = `
  query GetUserEnrollments($userId: String!) {
    getUserEnrollments(userId: $userId) {
      id
      courseId
      userId
      enrolledAt
    }
  }
`;

export const GET_PROGRESS_QUERY = `
  query GetProgressByUserAndCourse($userId: String!, $courseId: String!) {
    getProgressByUserAndCourse(userId: $userId, courseId: $courseId) {
      isSuccess
      count
      message
      progress {
        id
        userId
        status
        percentage
        lastCompleteAt
        lastCompletedLessonId
        completedLessons
        totalLessons
        courseId
      }
    }
  }
`;

export const FIND_ENROLLMENT_QUERY = `
  query FindEnrollment($courseId: String!) {
    findEnrollment(courseId: $courseId) {
      id
      courseId
      userId
    }
  }
`;

export const ASK_LESSON_QUESTION_QUERY = `
  query AskLessonQuestion($lessonId: String!, $question: String!) {
    askLessonQuestion(lessonId: $lessonId, question: $question)
  }
`;

export const GET_COURSE_BY_STATUS_QUERY = `
  query Query($status: StatusCourse!, $skip: Float!) {
  getCoursesByStatus(status: $status, skip: $skip) {
    isSuccess
    message
    count
    courses {
      id
      courseName
      abstract
      createdAt
      keyLearnings
      status
      updatedAt
    }
  }
}
`;

export const PUBLISH_COURSE_MUTATION = `
mutation Mutation($courseId: String!) {
  publishCourse(courseId: $courseId) {
    isSuccess
    count
    message
    courses {
      id
      courseName
      abstract
      keyLearnings
      status
      updatedAt
      createdAt
    }
  }
}
`;

export const REJECT_COURSE_MUTATION = `
mutation Mutation($courseId: String!) {
  rejectCourse(courseId: $courseId) {
    isSuccess
    message
    count
    courses {
      id
      courseName
      abstract
      createdAt
      keyLearnings
      status
      updatedAt
    }
  }
}
`;
export const GET_COURSE_LESSONS_BY_ID_QUERY = `
  query GetCourseLessonsById($getCourseByIdId: String!) {
  getCourseById(id: $getCourseByIdId) {
    id
    courseName
    abstract
    createdAt
    keyLearnings
    status
    updatedAt
  }
  getLessonsByCourseId(id: $getCourseByIdId) {
    isSuccess
    count
    lessons {
      id
      abstract
      lessonName
      courseId
      createdAt
    }
    message
  }
}
`;

export const GET_COURSE_BY_USER_ID_QUERY = `
  query GetCourseByUserId($userId: String!) {
    getCourseByUserId(userId: $userId) {
      id
      courseName
      abstract
      keyLearnings
      status
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COURSE_MUTATION = `
  mutation CreateCourse($data: CreateCourseDto!) {
    createCourse(data: $data) {
      isSuccess
      message
      count
      courses {
        id
        courseName
        abstract
        keyLearnings
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_INSTRUCTOR_DASHBOARD = `
  query GetInstructorDashboard($userId: String!) {
    getCourseByUserId(userId: $userId) {
      id
      courseName
      abstract
      keyLearnings
      status
      createdAt
      updatedAt
    }
    getAllLessons {
      count
      lessons {
        id
        courseId
        lessonName
      }
    }
  }
`;

export const DELETE_COURSE_MUTATION = `
  mutation DeleteCourse($id: String!) {
    deleteCourse(id: $id) {
      isSuccess
      message
      count
      courses {
        id
        courseName
        abstract
        keyLearnings
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_COURSE_PRICE_QUERY = `
  query GetCoursePrice($courseId: String!) {
    getCoursePrice(courseId: $courseId) {
      id
      originalPrice
      salePrice
      isFree
    }
  }
`;

export const GET_ALL_LESSONS_QUERY = `
  query GetAllLessons {
    getAllLessons {
      isSuccess
      count
      message
      lessons {
        id
        lessonName
        abstract
        courseId
        createdAt
      }
    }
  }
`;
