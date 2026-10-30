import { queryOptions } from "@tanstack/react-query";
import { GET_ROADMAP_BY_ID_QUERY } from "@/graphql/roadmap";
import { graphqlClient } from "@/lib/graphql";

export type TRoadmapDetailItem = {
  id: string;
  roadMapName: string;
  abstract: string;
  courses: {
    id: string;
    courseName: string;
    abstract: string;
    status: string;
    keyLearnings: string[];
    createdAt: string;
  }[];
};

type GetRoadmapByIdResponse = {
  getRoadmapById: {
    isSuccess: boolean;
    count: number;
    message: string;
    roadmap: TRoadmapDetailItem[];
  };
};

export const roadmapQueryOptions = (roadmapId: string) =>
  queryOptions({
    queryKey: ["roadmap-detail", roadmapId],
    queryFn: async () => {
      const response = await graphqlClient.request<GetRoadmapByIdResponse>(
        GET_ROADMAP_BY_ID_QUERY,
        { getRoadmapByIdId: roadmapId }
      );
      return response;
    },
    enabled: !!roadmapId,
  });
