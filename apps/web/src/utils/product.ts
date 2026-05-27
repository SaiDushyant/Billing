export function generateSKU(parts: string[]) {
  return parts
    .filter(Boolean)
    .map((part) => part.trim().toUpperCase().replace(/\s+/g, "-"))
    .join("-");
}
