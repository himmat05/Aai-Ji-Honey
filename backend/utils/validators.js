/**
 * Validates whether a password meets the strong security policy:
 * - Length: 8 to 16 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one numeric digit (0-9)
 * - At least one special symbol (!@#$%^&*...)
 * 
 * @param {string} password 
 * @returns {string|null} Returns error message if invalid, or null if valid.
 */
const validateStrongPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }

  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters long.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one numeric digit (0-9).';
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (e.g. !@#$%^&*).';
  }

  return null;
};

module.exports = {
  validateStrongPassword,
};
