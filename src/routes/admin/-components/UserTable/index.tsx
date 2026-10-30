import "./style.scss";

import { useTranslation } from "react-i18next";
import type { TAdminUser } from "@/hooks/useAdminUsers";
import Icon from "@/components/Icon";
import TextButton from "@/components/TextButton";
import capitalize from "lodash/capitalize";
import type { TTypeSecondary } from "@/types/global";

type TUserTableProps = {
  users: TAdminUser[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (user: TAdminUser) => void;
  onDelete: (userId: string) => void;
};

const ROLE_MOD: Record<string, TTypeSecondary> = {
  learner: "pastelNavy",
  user: "pastelNavy",
  instructor: "green",
  reviewer: "yellow",
  admin: "salmon",
};

const UserTable = ({
  users,
  isLoading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: TUserTableProps) => {
  const { t, i18n } = useTranslation();

  const TABLE_COLUMNS = [
    { key: "checkbox", label: "" },
    { key: "id", label: t("admin.users.table.id") },
    { key: "username", label: t("admin.users.table.user") },
    { key: "email", label: t("admin.users.table.email") },
    { key: "role", label: t("admin.users.table.role") },
    { key: "createdAt", label: t("admin.users.table.joined") },
    { key: "actions", label: t("admin.users.table.actions") },
  ];

  const SkeletonRow = () => (
    <tr className="admin-user-table__skeleton-row">
      {TABLE_COLUMNS.map((col) => (
        <td key={col.key} className="admin-user-table__cell">
          <div className="admin-user-table__skeleton" />
        </td>
      ))}
    </tr>
  );

  const allSelected = users.length > 0 && selectedIds.size === users.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const formatDate = (raw: string) => {
    try {
      return new Date(Number(raw) || raw).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return raw;
    }
  };

  return (
    <div className="admin-user-table__wrapper">
      <table className="admin-user-table">
        <thead className="admin-user-table__thead">
          <tr>
            <th className="admin-user-table__th admin-user-table__th--checkbox">
              <input
                id="user-table-select-all"
                type="checkbox"
                className="admin-user-table__checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all users"
              />
            </th>
            {TABLE_COLUMNS.slice(1).map((col) => (
              <th key={col.key} className="admin-user-table__th">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={TABLE_COLUMNS.length}
                className="admin-user-table__empty"
              >
                <Icon name="person_off" size={40} />
                <p>{t("admin.users.table.empty")}</p>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className={`admin-user-table__row ${selectedIds.has(user.id) ? "admin-user-table__row--selected" : ""}`}
              >
                <td className="admin-user-table__cell admin-user-table__cell--checkbox">
                  <input
                    id={`user-select-${user.id}`}
                    type="checkbox"
                    className="admin-user-table__checkbox"
                    checked={selectedIds.has(user.id)}
                    onChange={() => onToggleSelect(user.id)}
                    aria-label={`Select user ${user.username}`}
                  />
                </td>

                <td className="admin-user-table__cell admin-user-table__cell--id">
                  <TextButton
                    typeSecondary="pastelNavy"
                    size="tiny"
                    text={`#${user.id.slice(0, 6)}`}
                    leftIcon={false}
                    type="secondary"
                    onClick={() => {}}
                  />
                </td>

                <td className="admin-user-table__cell">
                  <div className="admin-user-table__user-info">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="admin-user-table__avatar"
                        width={36}
                        height={36}
                      />
                    ) : (
                      <div className="admin-user-table__avatar-placeholder">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="admin-user-table__username">
                      {user.username}
                    </span>
                  </div>
                </td>

                <td className="admin-user-table__cell admin-user-table__cell--email">
                  {user.email}
                </td>

                <td className="admin-user-table__cell">
                  <TextButton
                    size="tiny"
                    type="secondary"
                    className={`admin-user-table__badge admin-user-table__badge--${user.role?.toLowerCase() ?? ""}`}
                    typeSecondary={
                      user.role
                        ? ROLE_MOD[user.role.toLowerCase()]
                        : "pastelNavy"
                    }
                    leftIcon={false}
                    text={user.role ? capitalize(user.role) : "User"}
                    onClick={() => {}}
                  />
                </td>

                <td className="admin-user-table__cell">
                  {formatDate(user.createdAt)}
                </td>

                <td className="admin-user-table__cell admin-user-table__cell--actions">
                  <div className="admin-user-table__actions">
                    <TextButton
                      icon="edit"
                      text={t("admin.users.table.edit")}
                      tooltip={t("admin.users.table.edit_tooltip")}
                      onClick={() => onEdit(user)}
                      size="tiny"
                      type="primary"
                    />
                    <TextButton
                      icon="delete"
                      text={t("admin.users.table.delete")}
                      tooltip={t("admin.users.table.delete_tooltip")}
                      onClick={() => onDelete(user.id)}
                      size="tiny"
                      type="outlined"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
