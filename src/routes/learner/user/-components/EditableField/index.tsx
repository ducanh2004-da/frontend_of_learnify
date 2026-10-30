import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { TEditableFieldProps } from "./type";
import "./style.scss";

const EditableField = (props: TEditableFieldProps) => {
  const { t } = useTranslation();
  const { label, value, fieldName, onSave, isLoading } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentValue !== value && currentValue.trim() !== "") {
      onSave(fieldName, currentValue);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="editable-field">
      <label className="editable-field-label" htmlFor={`editable-${fieldName}`}>
        {label}
      </label>
      <div className="editable-field-wrapper">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            id={`editable-${fieldName}`}
            className="editable-field-input"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
        ) : (
          <div className="editable-field-text">{value}</div>
        )}

        <button
          className="editable-field-btn"
          onClick={() => setIsEditing((prev) => !prev)}
          disabled={isLoading}
          type="button"
          aria-label={t("editable_field.edit", { fieldName })}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EditableField;
