import { Trans, useTranslation } from "react-i18next";
import TextButton from "@/components/TextButton";
import "./style.scss";
import IconButton from "@/components/IconButton";

type TPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
}: TPaginationProps) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const { t } = useTranslation();

  const getPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "…", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "…",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "…",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "…",
        totalPages
      );
    }
    return pages;
  };

  return (
    <div className="admin-pagination">
      <span className="admin-pagination__info">
        <Trans
          i18nKey="admin.pagination.showing"
          values={{ start: startItem, end: endItem, total: totalItems }}
        />
      </span>

      <div className="admin-pagination__controls">
        <IconButton
          icon="chevron_left"
          text=""
          tooltip={t("admin.pagination.prev_tooltip")}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          size="small"
          type="secondary"
        />

        {getPageNumbers().map((page, idx) =>
          page === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="admin-pagination__ellipsis"
            >
              …
            </span>
          ) : (
            <TextButton
              key={page}
              text={String(page)}
              tooltip={t("admin.pagination.page_tooltip", {
                page: String(page),
              })}
              onClick={() => onPageChange(page as number)}
              size="small"
              type={page === currentPage ? "primary" : "secondary"}
            />
          )
        )}

        <IconButton
          icon="chevron_right"
          text=""
          tooltip={t("admin.pagination.next_tooltip")}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          size="small"
          type="secondary"
        />
      </div>
    </div>
  );
};

export default Pagination;
