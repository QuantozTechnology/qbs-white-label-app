export function constructUrlWithParams(
  base: string,
  queryParams?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!queryParams) return base;

  const params = Object.keys(queryParams)
    .map((key) => {
      const value = queryParams[key];
      if (value !== null && value !== undefined) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          value.toString()
        )}`;
      }
      return null;
    })
    .filter((param) => param !== null)
    .join("&");

  return params ? `${base}?${params}` : base;
}
