import { useState, useCallback } from "react";

/**
 * A custom React hook for managing optimistic updates.
 *
 * @template T The type of the data being managed.
 * @param {T} initialData - The initial state of the data.
 * @param {(data: T) => Promise<T>} updateFn - A function to perform the actual update operation.
 * @returns {[T, (optimisticUpdater: (currentData: T) => T) => Promise<void>, () => void]}
 */
export function useOptimistic<T>(
  initialData: T,
  updateFn: (data: T) => Promise<T>,
): [
  T,
  (optimisticUpdater: (currentData: T) => T) => Promise<void>,
  () => void,
] {
  const [data, setData] = useState<T>(initialData);
  const [snapshot, setSnapshot] = useState<T | null>(null);

  /**
   * Optimistically update the data.
   * @param {(currentData: T) => T} optimisticUpdater - A function to produce the optimistic state.
   */
  const update = useCallback(
    async (optimisticUpdater: (currentData: T) => T) => {
      setSnapshot(data); // Snapshot the current state for rollback

      const optimisticData = optimisticUpdater(data); // Apply optimistic update
      setData(optimisticData);

      try {
        const result = await updateFn(optimisticData); // Perform the actual update
        setData(result); // Update state with server response
      } catch (error) {
        console.error("Update failed, rolling back:", error);
        if (snapshot !== null) {
          setData(snapshot); // Rollback if an error occurs
        }
      } finally {
        setSnapshot(null); // Clear snapshot
      }
    },
    [data, updateFn, snapshot],
  );

  /**
   * Rollback to the previous state manually.
   */
  const rollback = useCallback(() => {
    if (snapshot !== null) {
      setData(snapshot);
      setSnapshot(null);
    }
  }, [snapshot]);

  return [data, update, rollback];
}
