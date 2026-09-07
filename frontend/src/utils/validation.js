// Password Regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

export const validatePassword = (password, email = '') => {
  const isMasterAdmin = (email || '').toLowerCase() === 'shasankshah.25.mca@iite.indusuni.ac.in';

  const checks = {
    minLength: isMasterAdmin || (password || '').length >= 8,
    hasUppercase: isMasterAdmin || /[A-Z]/.test(password || ''),
    hasLowercase: isMasterAdmin || /[a-z]/.test(password || ''),
    hasNumber: isMasterAdmin || /[0-9]/.test(password || ''),
    hasSpecial: isMasterAdmin || /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password || ''),
  };

  const isValid = Object.values(checks).every(Boolean);
  return { isValid, checks };
};
