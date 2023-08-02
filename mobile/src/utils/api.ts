export function constructUrlWithParams(
  base: string,
  queryParams?: Record<string, string | number | boolean | null | undefined>
): string {
  const url = new URL(base);

  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key];
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
}
