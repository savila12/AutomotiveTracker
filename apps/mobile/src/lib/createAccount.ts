const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CreateAccountForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const validateCreateAccountForm = ({ email, password, confirmPassword }: CreateAccountForm): string | null => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password || !confirmPassword) {
    return 'Please fill out all fields.';
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return 'Enter a valid email address.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
};
