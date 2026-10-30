import { useState, useRef } from "react";
import trim from "lodash/trim";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import Icon from "@/components/Icon";
import "./style.scss";

type TSearchProps = {
  style?: React.CSSProperties;
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: "large" | "medium" | "small";
};

const Search = (props: TSearchProps) => {
  const { t } = useTranslation();
  const { style, onSearch, size = "large" } = props;
  const placeholder = props.placeholder ?? t("search.placeholder");
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit: React.EventHandler<
    React.SyntheticEvent<HTMLFormElement>
  > = (e) => {
    e.preventDefault();
    const query = trim(value);

    if (onSearch) onSearch(query);
    else if (query) navigate({ to: "/learner/search", search: { q: query } });
  };

  const handleClear = () => {
    setValue("");
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  return (
    <form
      aria-label={t("search.aria_label")}
      className={`search search--${size}${focused ? " search--focused" : ""}`}
      style={style}
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        aria-label={t("search.submit_aria")}
        className="search__submit"
      >
        <Icon name="search" size={30} />
      </button>
      <label htmlFor="search" className="sr-only">
        {t("search.label")}
      </label>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        id="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button
          type="button"
          className="search__clear"
          aria-label={t("search.clear_tooltip")}
          title={t("search.clear_tooltip")}
          onClick={handleClear}
        >
          <Icon name="close" size={24} />
        </button>
      )}
    </form>
  );
};

export default Search;
