export function handleSortQuery(query: { sort?: string | null; size?: string; color?: string }): Record<string, any> {
  try {
    // Use the sort provided by the client if it is defined and not an empty string.
    const sortOption = (query.sort && query.sort.trim() !== '' && query.sort !== 'undefined')
      ? query.sort.trim()
      : 'newest';

    let sortQuery: Record<string, any> = {};

    switch (sortOption) {
      case 'highToLow':
        // For highToLow, sort descending by newPrice first and then price.
        sortQuery = { newPrice: -1, price: -1 };
        break;
      case 'lowToHigh':
        // For lowToHigh, sort ascending by newPrice first and then price.
        sortQuery = { newPrice: 1, price: 1 };
        break;
      case 'newest':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    console.log('final sortQuery: ', sortQuery);
    return sortQuery;
  } catch (error) {
    console.error('Error handling sort query:', (error as Error).message);
    return { createdAt: -1 }; // Fallback sort order
  }
}