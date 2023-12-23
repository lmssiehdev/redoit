import { customAlphabet } from "nanoid";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
  Retrieves the error message from an error object or any other value.
  
  @param error - The error object.
  @returns The error message.
*/
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * @see https://github.com/ai/nanoid#custom-alphabet-or-size
 */
export const generateId = (n = 6) => {
  const nanoid = customAlphabet(
    "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    n
  );

  return nanoid();
};

export function convertHexToRGBA(hexCode = "", opacity = 1) {
  let hex = hexCode.replace("#", "");

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }
  // `rgba(${r},${g},${b},${opacity})`
  const rgbString = `${r},${g},${b}`;

  const highlight = {
    background: `
    linear-gradient(to right, rgba(${rgbString}, 0.3) 0%, rgba(${rgbString}, 0.4) 60%, rgba(${rgbString}, 0.4) 60%, rgba(${rgbString}, 0.6) 85%, rgba(${rgbString}, 0.8) 100%)
    `,
  };
  return highlight;
}
