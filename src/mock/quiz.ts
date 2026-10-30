import type { TQuizQuestion } from "@/routes/learner_/lessons/-components/QuizPanel/type";

export const mockQuizQuestions: TQuizQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice",
    question: "What is the main function of the mitochondria?",
    options: [
      "Protein synthesis",
      "Energy production",
      "DNA replication",
      "Cell division",
    ],
    correctAnswer: [1],
  },
  {
    id: "q2",
    type: "multiple-choice",
    question: "Photosynthesis occurs in the mitochondria.",
    options: ["True", "False"],
    correctAnswer: [1],
  },
  {
    id: "q3",
    type: "multiple-answer",
    question: "Which of the following are types of RNA?",
    options: ["mRNA", "tRNA", "rRNA", "dRNA"],
    correctAnswer: [0, 1, 2],
  },
];
