import "./modal.scss";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import IconButton from "@/components/IconButton";

type TModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const Modal = ({ open, onClose, title, children }: TModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      overlayRef.current?.focus();
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Enter") {
        const modal = e.currentTarget.querySelector<HTMLElement>(".modal");
        if (!modal) return;
        const primary =
          modal.querySelector<HTMLButtonElement>("button[type='submit']") ??
          modal.querySelector<HTMLButtonElement>(
            ".modal__body button:last-of-type"
          );
        primary?.click();
      }
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      tabIndex={-1}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <IconButton
            className="modal__close-btn"
            icon="close"
            size="tiny"
            type="secondary"
            ariaLabel="Close"
            onClick={onClose}
          />
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
