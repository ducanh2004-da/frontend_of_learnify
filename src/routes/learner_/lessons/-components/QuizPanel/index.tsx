import { useState, useCallback, useMemo } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import type { TQuizQuestion, TQuizAnswer } from "./type";
import "./style.scss";

type TQuizPanelProps = {
  questions: TQuizQuestion[];
  onComplete: () => void;
  className?: string;
};

const QuizPanel = ({ questions, onComplete, className }: TQuizPanelProps) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<TQuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const currentAnswer = useMemo(
    () => answers.find((a) => a.questionId === currentQuestion?.id),
    [answers, currentQuestion?.id]
  );

  const updateAnswer = useCallback(
    (partial: Partial<TQuizAnswer>) => {
      const q = currentQuestion!;
      setAnswers((prev) => {
        const existing = prev.findIndex((a) => a.questionId === q.id);
        const base: TQuizAnswer = {
          questionId: q.id,
          selected: [],
          isCorrect: false,
          submitted: false,
        };
        const merged = {
          ...base,
          ...(existing >= 0 ? prev[existing] : {}),
          ...partial,
        };
        if (existing >= 0) {
          const copy = [...prev];
          copy[existing] = merged;
          return copy;
        }
        return [...prev, merged];
      });
    },
    [currentQuestion]
  );

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      const q = currentQuestion!;
      if (currentAnswer?.submitted) return;
      if (q.type === "multiple-choice") {
        updateAnswer({ selected: [optionIndex] });
      } else if (q.type === "multiple-answer") {
        const prev = currentAnswer?.selected || [];
        const next = prev.includes(optionIndex)
          ? prev.filter((i) => i !== optionIndex)
          : [...prev, optionIndex];
        updateAnswer({ selected: next });
      }
    },
    [currentAnswer, currentQuestion, updateAnswer]
  );

  const evaluate = useCallback(
    (answer: TQuizAnswer): boolean => {
      const q = currentQuestion!;
      const sortedSelected = [...answer.selected].sort();
      const sortedCorrect = [...q.correctAnswer].sort();
      return (
        sortedSelected.length === sortedCorrect.length &&
        sortedSelected.every((v, i) => v === sortedCorrect[i])
      );
    },
    [currentQuestion]
  );

  const handleSubmit = useCallback(() => {
    if (!currentAnswer || currentAnswer.submitted) return;
    const isCorrect = evaluate(currentAnswer);
    updateAnswer({ submitted: true, isCorrect });
  }, [currentAnswer, evaluate, updateAnswer]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setShowResults(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLast]);

  const score = useMemo(() => {
    const correct = answers.filter((a) => a.submitted && a.isCorrect).length;
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  }, [answers, questions.length]);

  if (showResults) {
    return (
      <div className={classnames("quiz-panel", className)}>
        <div className="quiz-panel-results">
          <div className="quiz-panel-results-header">
            {t("quiz_panel.results_header")}
          </div>
          <div className="quiz-panel-results-score">
            <span className="quiz-panel-results-fraction">
              {score.correct}/{score.total}
            </span>
            <span className="quiz-panel-results-percent">
              {score.percentage}%
            </span>
          </div>
          <div className="quiz-panel-results-bar-track">
            <div
              className="quiz-panel-results-bar-fill"
              style={{ width: `${score.percentage}%` }}
            />
          </div>
          <div className="quiz-panel-results-list">
            {questions.map((q, i) => {
              const a = answers.find((x) => x.questionId === q.id);
              const correct = a?.submitted && a.isCorrect;
              return (
                <div
                  key={q.id}
                  className={classnames("quiz-panel-results-item", {
                    correct,
                    wrong: a?.submitted && !correct,
                  })}
                >
                  <Icon
                    name={correct ? "check_circle" : "cancel"}
                    className="quiz-panel-results-item-icon"
                  />
                  <span className="quiz-panel-results-item-label">
                    {t("quiz_panel.question_label", {
                      number: i + 1,
                      question: q.question,
                    })}
                  </span>
                  {a?.submitted && !correct && (
                    <span className="quiz-panel-results-item-hint">
                      {t("quiz_panel.correct_answer")}{" "}
                      {q.correctAnswer.map((idx) => q.options[idx]).join(", ")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <button className="quiz-panel-results-complete" onClick={onComplete}>
            {t("quiz_panel.complete")}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className={classnames("quiz-panel", className)}>
      <div className="quiz-panel-progress">
        {t("quiz_panel.progress", {
          current: currentIndex + 1,
          total: questions.length,
        })}
      </div>
      <div className="quiz-panel-question">
        <div className="quiz-panel-question-type">
          {currentQuestion.type === "multiple-choice"
            ? t("quiz_panel.type_multiple_choice")
            : t("quiz_panel.type_multiple_answer")}
        </div>
        <p className="quiz-panel-question-text">{currentQuestion.question}</p>

        <div className="quiz-panel-options">
          {currentQuestion.options.map((option, i) => {
            const isSelected = currentAnswer?.selected.includes(i);
            let optionMod = "";
            if (currentAnswer?.submitted) {
              if (currentQuestion.correctAnswer.includes(i)) {
                optionMod = "correct";
              } else if (isSelected) {
                optionMod = "wrong";
              }
            } else if (isSelected) {
              optionMod = "selected";
            }
            return (
              <button
                key={i}
                className={classnames("quiz-panel-option", optionMod)}
                onClick={() => handleSelectOption(i)}
                disabled={currentAnswer?.submitted}
              >
                <Icon
                  name={isSelected ? "check_circle" : "radio_button_unchecked"}
                  className="quiz-panel-option-indicator"
                />
                <span className="quiz-panel-option-label">{option}</span>
              </button>
            );
          })}
        </div>

        {currentAnswer?.submitted && currentQuestion.explanation && (
          <div className="quiz-panel-explanation">
            <span className="quiz-panel-explanation-label">
              {t("quiz_panel.explanation")}
            </span>
            <p className="quiz-panel-explanation-text">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="quiz-panel-actions">
          {!currentAnswer?.submitted ? (
            <button
              className="quiz-panel-submit"
              onClick={handleSubmit}
              disabled={!currentAnswer || currentAnswer.selected.length === 0}
            >
              {t("quiz_panel.submit_answer")}
            </button>
          ) : (
            <button className="quiz-panel-next" onClick={handleNext}>
              {isLast
                ? t("quiz_panel.see_results")
                : t("quiz_panel.next_question")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPanel;
