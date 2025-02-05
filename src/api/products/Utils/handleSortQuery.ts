// handleSortQuery.ts
type SortDirection = 'asc' | 'desc';
type SortBy = {
  sort?: string;
  direction?: SortDirection;
  [key: string]: any;
};

export function handleSortQuery(query: SortBy): any {
  try {
    const { sort, direction = 'desc', ...rest } = query;
    if (direction !== 'asc' && direction !== 'desc') {
      console.error('Invalid sort direction. Using default sort by createdAt descending.');
      return { createdAt: -1 };
    }
    const filters = Object.fromEntries(
      Object.entries(rest).filter(
        ([, value]) => value !== undefined && value !== null && value !== '' && value !== "undefined"
      )
    );
    if (!sort) {
      return { createdAt: direction === 'asc' ? 1 : -1 };
    }
    const sortOrder: any = {};
    sortOrder[sort] = direction === 'asc' ? 1 : -1;
    return { ...sortOrder, ...filters };
  } catch (error) {
    console.error('Error handling sort query:', (error as Error).message, 'Using default sort by createdAt descending.');
    return { createdAt: -1 };
  }
}
