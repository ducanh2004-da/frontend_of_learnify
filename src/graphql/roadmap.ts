export const GET_ALL_ROADMAPS_QUERY = `
query Query {
  getAllRoadmap {
    isSuccess
    count
    message
    roadmap {
      id
      abstract
      roadMapName
    }
  }
}
`;

export const GET_ROADMAP_BY_ID_QUERY = `
query Query($getRoadmapByIdId: String!) {
  getRoadmapById(id: $getRoadmapByIdId) {
    isSuccess
    count
    message
    roadmap {
      id
      roadMapName
      abstract
      courses {
        id
        courseName
        abstract
        status
        keyLearnings
        createdAt
      }
    }
  }
}
`;
