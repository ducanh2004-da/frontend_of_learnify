import { Fragment } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import classnames from "classnames";
import Search from "@/components/Search";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import type { TTopNavLeftProps } from "./type";
import "./style.scss";

const PATH_LABELS: Record<string, string> = {
  courses: "Courses",
  lessons: "Lessons",
  roadmaps: "Roadmaps",
  friends: "Friends",
  about: "About",
  dashboard: "Dashboard",
  search: "Search",
  user: "Profile",
  learner: "Home",
};

const resolveLabel = (
  segment: string,
  isLast: boolean,
  customTitle?: string
) => {
  if (isLast && customTitle) return customTitle;
  return PATH_LABELS[segment] || segment;
};

const LogoWrapper = () => (
  <>
    <Logo size="small" />
    <div className="divider" />
  </>
);

const TopNavLeft = (props: TTopNavLeftProps) => {
  const {
    pathname,
    lastPathname,
    pathnameWithoutLast,
    fullWidth = false,
    customTitle,
    showSearch,
    onSearchClose,
  } = props;
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate({ to: "/learner/search", search: { q: query } });
    onSearchClose();
  };

  if (showSearch) {
    return (
      <div className="top-nav-left">
        <Search
          onSearch={handleSearch}
          placeholder="Search courses, lessons..."
        />
      </div>
    );
  }

  const content =
    pathname.length >= 4 ? (
      <>
        {fullWidth && <LogoWrapper />}
        <section className="top-nav-left-context">
          <Link to="/learner">
            <Icon name="home" fill size={24} />
          </Link>
          <Icon name="keyboard_arrow_right" />
          <button
            className="more medium"
            title={pathnameWithoutLast.join(" / ")}
            aria-label="Show more breadcrumbs"
          >
            ...
          </button>
          <Icon name="keyboard_arrow_right" />
          <Link to="/learner" className="medium">
            {customTitle ||
              resolveLabel(
                lastPathname || pathname[pathname.length - 1] || "",
                true,
                customTitle
              )}
          </Link>
        </section>
      </>
    ) : pathname.length >= 2 ? (
      <>
        {fullWidth && <LogoWrapper />}
        <Link to="/learner">
          <Icon name="home" fill size={24} />
        </Link>
        {pathname.map((item, index) => {
          const isLast = index === pathname.length - 1;
          const href = `/learner/${pathname.slice(0, index + 1).join("/")}`;
          return (
            <Fragment key={item}>
              <Icon name="keyboard_arrow_right" />
              <Link
                href={href}
                to="/learner"
                className={classnames("medium", {
                  "breadcrumb-last": isLast,
                })}
              >
                {resolveLabel(item, isLast, customTitle)}
              </Link>
            </Fragment>
          );
        })}
      </>
    ) : null;

  return <div className="top-nav-left">{content}</div>;
};

export default TopNavLeft;
