export type TTopNavLeftProps = {
  fullWidth?: boolean;
  pathname: string[];
  lastPathname?: string;
  pathnameWithoutLast: string[];
  customTitle?: string;
  showSearch: boolean;
  onSearchClose: () => void;
};
