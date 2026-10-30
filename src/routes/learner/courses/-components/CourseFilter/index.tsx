import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Chip from "@/components/Chip";
import Icon from "@/components/Icon";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import "./style.scss";

type TCourseFilters = {
  courseType?: "free" | "paid";
  durationRange?: string;
};

type TCourseFilterProps = {
  isOpen: boolean;
  filters: TCourseFilters;
  onToggle: () => void;
  onFilterChange: (filters: TCourseFilters) => void;
  onClose: () => void;
};

const DURATION_OPTIONS = ["30", "45", "60", "120", "180"] as const;

const CourseFilter = ({
  isOpen,
  filters,
  onFilterChange,
  onClose,
}: TCourseFilterProps) => {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => {
    if (isOpen) onClose();
  });

  const hasActiveFilters = !!filters.courseType || !!filters.durationRange;

  return (
    <div className="course-filter" ref={dropdownRef}>
      {isOpen && (
        <div className="course-filter__dropdown">
          <div className="course-filter__section">
            <div className="course-filter__section-header">
              <Icon name="filter_list" size={16} />
              <span>{t("courses.filter_type")}</span>
            </div>
            <div className="course-filter__chips">
              <Chip
                label={t("courses.filter_free")}
                selected={filters.courseType === "free"}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    courseType:
                      filters.courseType === "free" ? undefined : "free",
                  })
                }
              />
              <Chip
                label={t("courses.filter_paid")}
                selected={filters.courseType === "paid"}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    courseType:
                      filters.courseType === "paid" ? undefined : "paid",
                  })
                }
              />
            </div>
          </div>

          <div className="course-filter__divider" />

          <div className="course-filter__section">
            <div className="course-filter__section-header">
              <Icon name="schedule" size={16} />
              <span>{t("courses.filter_duration_label")}</span>
            </div>
            <div className="course-filter__chips">
              {DURATION_OPTIONS.map((dur) => (
                <Chip
                  key={dur}
                  label={t(`courses.filter_duration_${dur}`)}
                  selected={filters.durationRange === dur}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      durationRange:
                        filters.durationRange === dur ? undefined : dur,
                    })
                  }
                />
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <>
              <div className="course-filter__divider" />
              <button
                type="button"
                className="course-filter__clear"
                onClick={() => onFilterChange({})}
              >
                {t("courses.filter_clear")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseFilter;
export type { TCourseFilters };
