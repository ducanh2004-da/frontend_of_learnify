import type { TIconName } from "@/components/Icon";
import type { TCategoryKey } from "../../-constants";

export type TCategoryItem = {
  icon: TIconName;
  labelKey: string;
  key: TCategoryKey;
  selected: boolean;
  onClick: () => void;
};

export type TCategoryItemProps = TCategoryItem;
