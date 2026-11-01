import { useState, useEffect } from "react";
export default function useLocalStorage(key, initial, validate = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      return stored !== null && validate(stored) ? stored : initial;
    } catch {
      return initial;
    }
  });
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [key, value]);
  return [value, setValue, storageError];
}
