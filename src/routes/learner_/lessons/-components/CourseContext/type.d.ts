export type TCourseContextSection = { value: string; label: string };

export type TCourseContextProps = {
  references?: TCourseContextSection[];
  documents?: TCourseContextSection[];
  notes?: TCourseContextSection[];
};

export type TCourseContextRef = {
  reset: () => void;
};
