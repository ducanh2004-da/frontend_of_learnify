import type { TIconName } from "@/components/Icon";

export type TDropdownMenuOption = {
  value: string;
  label: string;
};

export type TDropdownMenuProps = {
  icon: TIconName;
  title: string;
  options: TDropdownMenuOption[];
  iconOption: TIconName;
  className?: string;
  style?: React.CSSProperties;
  buttonBackgroundColor: string;
  buttonColor?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
};
