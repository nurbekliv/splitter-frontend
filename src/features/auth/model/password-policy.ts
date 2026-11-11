// Same rule as the backend (splitter-backend/src/utils/validation.ts).
// Checking it here lets the user see what is missing before submitting.
export const PASSWORD_RULES = [
  { key: 'length', test: (v: string) => v.length >= 8 },
  { key: 'upper', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'lower', test: (v: string) => /[a-z]/.test(v) },
  { key: 'digit', test: (v: string) => /\d/.test(v) },
  { key: 'special', test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export const isStrongPassword = (value: string) =>
  PASSWORD_RULES.every((rule) => rule.test(value));
