type SortDirection = 'asc' | 'desc';
type SortBy = {
  sort?: string; // Sort field (e.g., 'price', 'createdAt')
  direction?: SortDirection; // Sorting direction (asc, desc)
  [key: string]: any; // Additional filter params like size, color, etc.
};

function handleSortQuery(query: SortBy): any {
  try {
    const { sort, direction = 'asc', ...rest } = query;

    // Validate direction
    if (direction !== 'asc' && direction !== 'desc') {
      throw new Error('Invalid sort direction. Allowed values are "asc" or "desc".');
    }

    // Remove undefined, null, or empty string values from the additional filters
    const filters = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );

    // Default sort if no sort field is provided
    if (!sort) {
      return { createdAt: direction === 'asc' ? 1 : -1 };
    }

    // Prepare the sort order based on the `sort` field
    const sortOrder: any = {};
    sortOrder[sort] = direction === 'asc' ? 1 : -1;

    // Merge sort order with any additional filters that remain
    return { ...sortOrder, ...filters };
  } catch (error) {
    console.error('Error handling sort query:', (error as Error).message);
    throw new Error('Invalid sorting query.');
  }
}

export { handleSortQuery };