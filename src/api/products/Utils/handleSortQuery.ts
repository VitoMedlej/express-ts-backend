export function handleSortQuery(query: { sort?: string | null; size?: string; color?: string }): Record<string, any> {
  try {
    const sort = query.sort?.trim() !== 'undefined' && query.sort?.trim() !== '' ? `${query.sort}`.trim() : 'newest';
    const filter: Record<string, any> = {};

    if (query.size && query.size !== 'undefined') {
      filter['variants'] = { $elemMatch: { key: 'size', value: query.size } };
    }
    if (query.color && query.color !== 'undefined') {
      filter['variants'] = { $elemMatch: { key: 'color', value: query.color } };
    }

    console.log('filter: ', filter); // Log the filter being created.
    console.log('sort: ', sort); // Log the sort option passed.

    let sortQuery = {};

    // Add condition for sorting based on the value of `sort`
    if (sort === 'highToLow') {
      sortQuery = { 
        ...filter, 
        price: { $cond: [{ $eq: [{ $type: "$price" }, "string"] }, { $toDouble: "$price" }, "$price"] },
        newPrice: { $cond: [{ $eq: [{ $type: "$newPrice" }, "string"] }, { $toDouble: "$newPrice" }, "$newPrice"] }
      };
    } else if (sort === 'lowToHigh') {
      sortQuery = { 
        ...filter, 
        price: { $cond: [{ $eq: [{ $type: "$price" }, "string"] }, { $toDouble: "$price" }, "$price"] },
        newPrice: { $cond: [{ $eq: [{ $type: "$newPrice" }, "string"] }, { $toDouble: "$newPrice" }, "$newPrice"] }
      };
    } else if (sort === 'onSale') {
      sortQuery = { 
        ...filter, 
        newPrice: { $gt: 0 }, 
        price: -1 
      };
    } else if (sort === 'newest') {
      sortQuery = { ...filter, createdAt: -1 };
    }

    // Log the final sortQuery being returned
    console.log('final sortQuery: ', sortQuery);

    return sortQuery;
  } catch (error) {
    console.error('Error handling sort query:', (error as Error).message);
    return { createdAt: -1 }; // Default fallback to avoid breaking the function
  }
}
