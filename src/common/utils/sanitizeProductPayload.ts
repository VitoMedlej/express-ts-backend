export function sanitizeProductPayload<T extends Record<string, any>>(payload: T): Omit<T, "id"> {
    const { id, ...sanitizedPayload } = payload;
    return sanitizedPayload;
  }
  