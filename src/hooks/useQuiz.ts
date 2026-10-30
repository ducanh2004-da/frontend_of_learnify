import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql";
import { GENERATE_AUTO_QUIZ_MUTATION } from "@/graphql/mutations";
import type { TQuizQuestion } from "@/routes/learner_/lessons/-components/QuizPanel/type";

type TBackendQuizResponse = {
  generateAutoQuiz: {
    id: string;
    lessonId: string;
    name: string;
    questions: {
      id: string;
      text: string;
      options: { id: string; isCorrect: boolean; text: string }[];
    }[];
  };
};

function transformQuestions(
  backendQuestions: TBackendQuizResponse["generateAutoQuiz"]["questions"]
): TQuizQuestion[] {
  return backendQuestions.map((q) => {
    const correctAnswer = q.options
      .map((opt, i) => (opt.isCorrect ? i : -1))
      .filter((i) => i >= 0);
    const type =
      correctAnswer.length > 1 ? "multiple-answer" : "multiple-choice";
    return {
      id: q.id,
      type,
      question: q.text,
      options: q.options.map((opt) => opt.text),
      correctAnswer,
    };
  });
}

export function useQuiz(lessonId?: string) {
  return useQuery({
    queryKey: ["quiz", lessonId],
    queryFn: async () => {
      const response = await graphqlClient.request<TBackendQuizResponse>(
        GENERATE_AUTO_QUIZ_MUTATION,
        { lessonId }
      );
      return transformQuestions(response.generateAutoQuiz.questions);
    },
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
}
