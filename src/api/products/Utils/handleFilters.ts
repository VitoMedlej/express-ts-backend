export function handleFilters(query: any, filters: { size?: string; color?: string }): any {
  if (filters.size && filters.size !== "undefined") {
    const sizes = filters.size.split(",").filter(s => s && s !== "undefined");
    if (sizes.length > 0) {
      query.size = { $in: sizes };
    }
  }
  if (filters.color && filters.color !== "undefined") {
    const colors = filters.color.split(",").filter(c => c && c !== "undefined");
    if (colors.length > 0) {
      query.color = { $in: colors };
    }
  }
  return query;
}