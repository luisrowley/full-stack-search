// Removes special characters except spaces & hyphens
export const sanitizeInput = (input: string) => {
  return input.replace(/[^\w\s-]/gi, "").trim();
};
