import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ErrorsContext = createContext({ errors: null, setErrors: () => {} });

export function ErrorsProvider({ children }) {
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    function onValidation(e) {
      const detail = e.detail || null;
      setErrors(detail);
    }
    window.addEventListener('easyappz:validation', onValidation);
    return () => window.removeEventListener('easyappz:validation', onValidation);
  }, []);

  const value = useMemo(() => ({ errors, setErrors }), [errors]);
  return (
    <ErrorsContext.Provider value={value}>{children}</ErrorsContext.Provider>
  );
}

export function useErrors() {
  return useContext(ErrorsContext);
}

export function useFieldErrors(name) {
  const { errors } = useErrors();
  if (!errors || !errors.data) return [];
  const data = errors.data;
  if (name in data && Array.isArray(data[name])) return data[name];
  return [];
}
