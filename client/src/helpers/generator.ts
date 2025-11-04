/**
 * Generates a unique, formatted policy ID.
 * Format: P-YYYYMMDD-XXXXX (e.g., P-20251029-A7C9F)
 * The XXXXX part is a random 5-character alphanumeric string.
 * @returns {string} The generated Policy ID.
 */
export const generatePolicyId = () => {
  // Helper function to generate a random alphanumeric string
  const generateRandomSuffix = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Get current date parts
  const now = new Date();
  const year = now.getFullYear();
  // Add leading zero if needed (e.g., 01 for January)
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Combine date and random suffix
  const datePart = `${year}${month}${day}`;
  const randomSuffix = generateRandomSuffix(5);

  // Final Policy ID structure
  return `P-${datePart}-${randomSuffix}`;
};

/**
 * Generates a random, unique-looking traffic ticket ID.
 * The format is: [3 Random Uppercase Letters]-[8 Random Alphanumeric Characters]
 * Example: 'ABC-1D2E3F4G'
 * * @returns {string} The generated traffic ticket ID.
 */
export function generateTrafficTicketID() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";

  // Helper function to get a random character from a given string
  const getRandomChar = (source: string) => {
    const randomIndex = Math.floor(Math.random() * source.length);
    return source.charAt(randomIndex);
  };

  // 1. Generate 3 random uppercase letters (Prefix)
  for (let i = 0; i < 3; i++) {
    id += getRandomChar(letters);
  }

  id += "-"; // Separator

  // 2. Generate 8 random alphanumeric characters (Unique Code)
  for (let i = 0; i < 8; i++) {
    id += getRandomChar(characters);
  }

  return id;
}

/**
 * Generates a unique-enough Insurance Claim ID.
 * Format: 'CLAIM-YYYYMMDD-HHMMSS-RANDOM'
 * * @returns {string} The generated claim ID.
 */
export function generateClaimID() {
  // 1. Define a fixed prefix for easy identification
  const prefix = "CLAIM-";

  // 2. Get the current date and time components
  const now = new Date();

  // Function to ensure two digits (e.g., 05 instead of 5)
  const pad = (num: number) => num.toString().padStart(2, "0");

  // Date part (YYYYMMDD)
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // getMonth() is 0-indexed
  const day = pad(now.getDate());

  // Time part (HHMMSS)
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  // 3. Generate a random number component
  // Using Math.random() and converting to a string, then slicing
  // to get a 4-digit number (excluding the '0.').
  const random = Math.random().toString().slice(2, 6);

  // 4. Assemble the final ID
  const claimID = `${prefix}${year}${month}${day}-${hour}${minute}${second}-${random}`;

  return claimID;
}
