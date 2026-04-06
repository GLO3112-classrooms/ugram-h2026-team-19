export function formatKeywordsToMany(keywords: string) {
  return keywords
    .replace(/[^\w-_]+/g, " ")
    .trim()
    .split(" ")
    .filter((keyword) => keyword.length);
}

export function formatKeywordsToSingle(keywords: string) {
  return keywords.replace(/[^\w-_]+/g, "");
}
