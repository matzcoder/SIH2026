import { useState, useRef, useCallback, useEffect } from "react";
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
  debounceMs = 300,
}) {
  const [internalValue, setInternalValue] = useState("");
  const debounceTimer = useRef(null);

  const searchValue =
    value !== undefined ? value : internalValue;

  // Debounced onChange callback — fires at most once every `debounceMs`
  const debouncedOnChange = useCallback(
    (newValue) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onChange?.(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const updateValue = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }

    debouncedOnChange(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Cancel any pending debounce and fire immediately on submit
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    onSearch?.(searchValue);
  };

  const handleClear = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (value === undefined) {
      setInternalValue("");
    }
    onChange?.("");
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