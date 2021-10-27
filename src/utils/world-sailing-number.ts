export const FilterWorldSailingNumber = (key: string, source: string[]) => {
  if (!key) return source;
  return source.filter((data) => data.includes(key.toUpperCase()));
};
