import { customAlphabet } from "nanoid";
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
