import uniqueId from "lodash/uniqueId";
import { useCallback, useMemo } from "react";
import { createGlobalState } from "react-use";

import { FormChangeTrackerServiceApi } from "./types";

const changedForms = new Set<string>();
const useHasFormChanges = createGlobalState<boolean>(false);

export const useUniqueFormId = (formId?: string) => useMemo(() => formId ?? uniqueId("form_"), [formId]);

export const useFormChangeTrackerService = (): FormChangeTrackerServiceApi => {
  const [hasFormChanges, setHasFormChanges] = useHasFormChanges();

  const clearAllFormChanges = useCallback(() => {
    changedForms.clear();
    setHasFormChanges(false);
  }, [setHasFormChanges]);

  const clearFormChange = useCallback(
    (id: string) => {
      changedForms.delete(id);
      setHasFormChanges(changedForms.size > 0);
    },
    [setHasFormChanges]
  );

  const trackFormChange = useCallback(
    (id: string, changed: boolean) => {
      if (changed) {
        changedForms.add(id);
      } else {
        changedForms.delete(id);
      }
      setHasFormChanges(changedForms.size > 0);
    },
    [setHasFormChanges]
  );

  return {
    hasFormChanges,
    trackFormChange,
    clearFormChange,
    clearAllFormChanges,
  };
};
