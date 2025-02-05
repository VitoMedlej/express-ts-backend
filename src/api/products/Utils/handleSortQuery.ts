// handleSortQuery.ts
type SortDirection = 'asc' | 'desc';
type SortBy = {
  sort?: string;
  direction?: SortDirection;
  [key: string]: any;
};

export function handleSortQuery(query: SortBy): any {
  try {
    const { sort, direction = 'asc', ...rest } = query;
    if (direction !== 'asc' && direction !== 'desc') {
      throw new Error('Invalid sort direction. Allowed values are "asc" or "desc".');
    }
    const filters = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined && value !== null && value !== '' && value !== "undefined")
    );
    if (!sort) {
      return { createdAt: direction === 'asc' ? 1 : -1 };
    }
    const sortOrder: any = {};
    sortOrder[sort] = direction === 'asc' ? 1 : -1;
    return { ...sortOrder, ...filters };
  } catch (error) {
    console.error('Error handling sort query:', (error as Error).message);
    throw new Error('Invalid sorting query.');
  }
}
