import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type {
  TAdminUser,
  TCreateUserInput,
  TUpdateUserAdminInput,
} from "@/hooks/useAdminUsers";
import Modal from "@/components/Modal";
import TextButton from "@/components/TextButton";
import "./style.scss";

type TUserModalMode = "create" | "edit";

type TUserModalProps = {
  mode: TUserModalMode;
  user?: TAdminUser | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onCreate: (data: TCreateUserInput) => void;
  onUpdate: (data: TUpdateUserAdminInput) => void;
};

const ROLE_OPTIONS = ["Learner", "Instructor", "Reviewer", "Admin"] as const;

const UserModal = ({
  mode,
  user,
  isOpen,
  isPending,
  onClose,
  onCreate,
  onUpdate,
}: TUserModalProps) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (isEdit && user) {
      onUpdate({
        id: user.id,
        email: data.get("email") as string,
        username: data.get("username") as string,
        phoneNumber: data.get("phoneNumber") as string,
        role: data.get("role") as string,
      });
    } else {
      onCreate({
        email: data.get("email") as string,
        username: data.get("username") as string,
        phoneNumber: data.get("phoneNumber") as string,
        password: data.get("password") as string,
        role: data.get("role") as string,
      });
    }
  };

  return createPortal(
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? t("admin.users.modal.edit_title")
          : t("admin.users.modal.create_title")
      }
    >
      <form
        id="user-modal-form"
        className="user-modal"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="user-modal__field">
          <label className="user-modal__label" htmlFor="modal-username">
            {t("admin.users.modal.username")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="modal-username"
            name="username"
            type="text"
            className="user-modal__input"
            defaultValue={user?.username ?? ""}
            placeholder={t("admin.users.modal.username_placeholder")}
            required
            autoComplete="off"
          />
        </div>

        <div className="user-modal__field">
          <label className="user-modal__label" htmlFor="modal-email">
            {t("admin.users.modal.email")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="modal-email"
            name="email"
            type="email"
            className="user-modal__input"
            defaultValue={user?.email ?? ""}
            placeholder={t("admin.users.modal.email_placeholder")}
            required
            autoComplete="off"
          />
        </div>

        <div className="user-modal__field">
          <label className="user-modal__label" htmlFor="modal-phone">
            {t("admin.users.modal.phone")}
          </label>
          <input
            id="modal-phone"
            name="phoneNumber"
            type="tel"
            className="user-modal__input"
            defaultValue={user?.phoneNumber ?? ""}
            placeholder={t("admin.users.modal.phone_placeholder")}
            autoComplete="off"
          />
        </div>

        {!isEdit && (
          <div className="user-modal__field">
            <label className="user-modal__label" htmlFor="modal-password">
              {t("admin.users.modal.password")}{" "}
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="modal-password"
              name="password"
              type="password"
              className="user-modal__input"
              placeholder={t("admin.users.modal.password_placeholder")}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        )}

        <div className="user-modal__field">
          <label className="user-modal__label" htmlFor="modal-role">
            {t("admin.users.modal.role")} <span aria-hidden="true">*</span>
          </label>
          <select
            id="modal-role"
            name="role"
            className="user-modal__select"
            defaultValue={user?.role ?? "Learner"}
            required
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="user-modal__actions">
          <TextButton
            text={t("admin.users.modal.cancel")}
            tooltip={t("admin.users.modal.cancel_tooltip")}
            onClick={onClose}
            disabled={isPending}
            size="medium"
            icon="close"
            type="secondary"
          />
          <TextButton
            text={
              isPending
                ? t("admin.users.modal.saving")
                : isEdit
                  ? t("admin.users.modal.save")
                  : t("admin.users.modal.create")
            }
            tooltip={
              isEdit
                ? t("admin.users.modal.submit_edit_tooltip")
                : t("admin.users.modal.submit_create_tooltip")
            }
            buttonType="submit"
            onClick={() => {}}
            disabled={isPending}
            loading={isPending}
            icon={isPending ? "progress_activity" : isEdit ? "save" : "add"}
            size="medium"
            type="primary"
          />
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default UserModal;
