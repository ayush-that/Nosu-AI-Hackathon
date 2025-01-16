import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function flattenColorPalette(
  colors: Record<string, any>,
  prefix = "",
  result: Record<string, string> = {}
): Record<string, string> {
  for (const [key, value] of Object.entries(colors)) {
    const newPrefix = prefix ? `${prefix}-${key}` : key;
    if (typeof value === "string") {
      result[newPrefix] = value;
    } else {
      flattenColorPalette(value, newPrefix, result);
    }
  }
  return result;
}
