export type TWithDefaults<T, D extends Partial<T>> = Omit<T, keyof D> &
  Partial<Pick<T, keyof D & keyof T>>;
export type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type TSpecial =
  | "lesson"
  | "lab"
  | "check"
  | "roadmap"
  | "course"
  | "certificate"
  | "private"
  | "public"
  | TSubscription;
export type TType = "primary" | "secondary" | "outlined" | "special";
export type TRoundedCorner =
  | "rounded"
  | "roundedSquare"
  | "exceptUpperLeft"
  | "exceptLowerLeft"
  | "exceptUpperRight"
  | "exceptLowerRight"
  | "exceptLeft"
  | "exceptRight"
  | "exceptUpper"
  | "exceptLower"
  | "onlyUpperLeft"
  | "onlyLowerLeft"
  | "onlyUpperRight"
  | "onlyLowerRight";
export type TSize = "large" | "medium" | "small" | "tiny";
export type TTypeSecondary =
  | "default"
  | "neutral"
  | "yellow"
  | "orange"
  | "salmon"
  | "darkGreen"
  | "navy"
  | "brown"
  | "green"
  | "pastelNeutral"
  | "pastelYellow"
  | "pastelOrange"
  | "pastelSalmon"
  | "pastelDarkGreen"
  | "pastelNavy"
  | "pastelBrown"
  | "pastelGreen";

export type TProgress = Enumerate<101>;

export type TStatusCard = "default" | "inProgress" | "completed" | "locked";

export type TRole = "learner" | "instructor" | "reviewer" | "admin";
