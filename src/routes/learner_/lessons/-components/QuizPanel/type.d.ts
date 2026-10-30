export type TQuizQuestion = {
  id: string;
  type: "multiple-choice" | "multiple-answer";
  question: string;
  options: string[];
  correctAnswer: number[];
  explanation?: string;
};

export type TQuizAnswer = {
  questionId: string;
  selected: number[];
  isCorrect: boolean;
  submitted: boolean;
};
