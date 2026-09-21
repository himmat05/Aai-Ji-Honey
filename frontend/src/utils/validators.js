/**
 * Checks individual password requirements for live UI feedback checklist
 * @param {string} password 
 * @returns {{ length: boolean, uppercase: boolean, lowercase: boolean, number: boolean, special: boolean, isValid: boolean }}
 */
export const checkPasswordRequirements = (password = '') => {
  const pwd = password || '';
  const length = pwd.length >= 8 && pwd.length <= 16;
  const uppercase = /[A-Z]/.test(pwd);
  const lowercase = /[a-z]/.test(pwd);
  const number = /[0-9]/.test(pwd);
  const special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

  return {
    length,
    uppercase,
    lowercase,
    number,
    special,
    isValid: length && uppercase && lowercase && number && special,
  };
};

/**
 * Validates a password string and returns an error message or null if valid
 * @param {string} password 
 * @returns {string|null}
 */
export const validateStrongPassword = (password) => {
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
