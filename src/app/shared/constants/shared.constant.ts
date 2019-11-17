
export const emailKey = 'email';
export const passwordKey = 'password';
export const rePasswordKey = 'repeatPassword';
export const emailError = (value: string) => {
  return `* Email ${value} is already taken.`;
};
export const passwordError = 'Password must have at least one special character or numeric character and a minimum of 8 characters';
export const rePasswordError = "Oops! It looks like you've entered two different passwords. Please try again!";
