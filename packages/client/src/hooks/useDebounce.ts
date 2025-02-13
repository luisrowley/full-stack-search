import { useEffect, useRef } from "react";
import { debounce } from "lodash";

/**
 * Custom hook to debounce a function call.
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns A debounced function
 */
export const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay: number) => {
  const debouncedFn = useRef(debounce(callback, delay)).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
};
