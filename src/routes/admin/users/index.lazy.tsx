import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  useGetAllAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
  type TAdminUser,
  type TCreateUserInput,
  type TUpdateUserAdminInput,
} from "@/hooks/useAdminUsers";
import Search from "@/components/Search";
import PageHeader from "../-components/PageHeader";
import UserTable from "../-components/UserTable";
import Pagination from "../-components/Pagination";
import UserModal from "../-components/UserModal";

export const Route = createLazyFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

const PAGE_SIZE = 10;

type TModalState =
  | { isOpen: false }
  | { isOpen: true; mode: "create" }
  | { isOpen: true; mode: "edit"; user: TAdminUser };

function AdminUsersPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetAllAdminUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateAdminUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateAdminUser();
  const { mutate: deleteUser } = useDeleteAdminUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<TModalState>({ isOpen: false });
  const allUsers = useMemo(() => data?.users ?? [], [data?.users]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.role?.toLowerCase() ?? "").includes(q)
    );
  }, [allUsers, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, []);

  const pagedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const pagedIds = pagedUsers.map((u) => u.id);
    const allPageSelected = pagedIds.every((id) => selectedIds.has(id));
    setSelectedIds(allPageSelected ? new Set() : new Set(pagedIds));
  }, [pagedUsers, selectedIds]);

  const openCreateModal = () => setModal({ isOpen: true, mode: "create" });
  const openEditModal = (user: TAdminUser) =>
    setModal({ isOpen: true, mode: "edit", user });
  const closeModal = () => setModal({ isOpen: false });

  const handleCreate = (data: TCreateUserInput) => {
    createUser(data, { onSuccess: closeModal });
  };

  const handleUpdate = (data: TUpdateUserAdminInput) => {
    updateUser(data, { onSuccess: closeModal });
  };

  const handleDelete = useCallback(
    (userId: string) => {
      const user = allUsers.find((u) => u.id === userId);
      const confirmed = window.confirm(
        t("admin.users.delete_confirm", { username: user?.username ?? userId })
      );
      if (confirmed) {
        deleteUser(userId);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    },
    [allUsers, deleteUser, t]
  );

  return (
    <div className="admin-users-page">
      <PageHeader
        title={t("admin.users.title")}
        count={data?.count}
        onAddUser={openCreateModal}
      />

      <Search
        size="medium"
        onSearch={handleSearch}
        placeholder={t("admin.search.placeholder")}
      />

      <div className="admin-users-page__table-section">
        <UserTable
          users={pagedUsers}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <UserModal
        mode={modal.isOpen ? modal.mode : "create"}
        user={modal.isOpen && modal.mode === "edit" ? modal.user : null}
        isOpen={modal.isOpen}
        isPending={isCreating || isUpdating}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
