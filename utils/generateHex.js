export const generateHex = (arr) => {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};
