// Utility functions for SecureJSON

/**
 * Canonicalize JSON: sort keys + stable stringify
 */
export function canonicalize(obj: any): string {
  return JSON.stringify(sortKeys(obj));
}

/**
 * Canonically sort JSON object keys for consistent hashing
 */
export function canonicalSort(obj: any): any {
  return sortKeys(obj);
}

// Recursively sort keys
function sortKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  } else if (value && typeof value === "object" && !Buffer.isBuffer(value)) {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeys(value[key]);
        return acc;
      }, {} as any);
  }
  return value;
}

/**
 * Generate SHA-256 hash of JSON data
 */
export async function hashPayload(data: any): Promise<string> {
  const jsonString = canonicalize(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
