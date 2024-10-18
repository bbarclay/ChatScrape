export const safeParseInt = (value: string): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
};
