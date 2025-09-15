export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateGPA = (gpa: string): boolean => {
  const gpaNum = parseFloat(gpa);
  return !isNaN(gpaNum) && gpaNum >= 0 && gpaNum <= 4.0;
};

export const validateFundingAmount = (amount: string): boolean => {
  const amountNum = parseFloat(amount);
  return !isNaN(amountNum) && amountNum > 0 && amountNum <= 100000;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};