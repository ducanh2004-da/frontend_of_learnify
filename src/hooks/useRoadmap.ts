import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import {
  GET_ALL_ROADMAPS_QUERY,
  GET_ROADMAP_BY_ID_QUERY,
} from "@/graphql/roadmap";

export type TBackendRoadmapItem = {
  id: string;
  abstract: string;
  roadMapName: string;
};

export type TBackendCourseInRoadmap = {
  id: string;
  courseName: string;
  abstract: string;
  status: string;
  keyLearnings: string[];
  createdAt: string;
};

export type TBackendRoadmapDetail = TBackendRoadmapItem & {
  courses: TBackendCourseInRoadmap[];
};

type GetAllRoadmapResponse = {
  getAllRoadmap: {
    isSuccess: boolean;
    count: number;
    message: string;
    roadmap: TBackendRoadmapItem[];
  };
};

type GetRoadmapByIdResponse = {
  getRoadmapById: {
    isSuccess: boolean;
    count: number;
    message: string;
    roadmap: TBackendRoadmapDetail[];
  };
};

export function useAllRoadmaps() {
  return useQuery({
    queryKey: ["all-roadmaps"],
    queryFn: async () => {
      const response = await graphqlClient.request<GetAllRoadmapResponse>(
        GET_ALL_ROADMAPS_QUERY
      );
      return response.getAllRoadmap;
    },
  });
}

export function useSuspenseAllRoadmaps() {
  return useSuspenseQuery({
    queryKey: ["all-roadmaps"],
    queryFn: async () => {
      const response = await graphqlClient.request<GetAllRoadmapResponse>(
        GET_ALL_ROADMAPS_QUERY
      );
      return response.getAllRoadmap;
    },
  });
}

export function useRoadmapDetail(roadmapId: string) {
  return useQuery({
    queryKey: ["roadmap-detail", roadmapId],
    queryFn: async () => {
      const response = await graphqlClient.request<GetRoadmapByIdResponse>(
        GET_ROADMAP_BY_ID_QUERY,
        {
          getRoadmapByIdId: roadmapId,
        }
      );
      return response.getRoadmapById.roadmap[0];
    },
    enabled: !!roadmapId,
  });
}
