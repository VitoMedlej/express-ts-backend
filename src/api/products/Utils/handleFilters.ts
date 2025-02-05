export function handleFilters(query: any, filters: { size?: string; color?: string }): any {
    if (filters.size) {
      query.size = { $in: filters.size.split(",") };
    }
  
    if (filters.color) {
      query.color = { $in: filters.color.split(",") };
    }
  
    return query;
  }
  