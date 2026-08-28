import { useState } from "react";
import "./SearchBar.css";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search products, compliance checks...",
}) {
  const [internalValue, setInternalValue] = useState("");

  const searchValue =
    value !== undefined ? value : internalValue;

  const updateValue = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch?.(searchValue);
  };

  const handleClear = () => {
    updateValue("");
    onSearch?.("");
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="search-icon">
        <SearchIcon />
      </div>

      <input
        type="search"
        value={searchValue}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />

      {searchValue && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      )}

      <button
        type="submit"
        className="search-button"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;