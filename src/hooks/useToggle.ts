import { useState, useCallback } from "react";

const useToggle = (
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void, () => void, () => void] => {
  const [state, setState] = useState(initialValue);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  const setToggle = useCallback((value: boolean) => {
    setState(value);
  }, []);

  return [
    state,
    toggle,
    setToggle,
    () => setState(false),
    () => setState(true),
  ];
};

export default useToggle;
