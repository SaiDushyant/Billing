export function generateSKU(parts: string[]) {
  return parts
    .map((part) => part.trim().toUpperCase().replace(/\s+/g, "-"))
    .join("-");
}
