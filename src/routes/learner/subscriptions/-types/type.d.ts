import type { TIconName } from "@/components/Icon";

export type TSubscription = {
  type: "Starter" | "Pro" | "Career";
  title: string;
  icon: TIconName;
  price: string;
  subtitle: string;
  descriptions: string[];
};
