export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

export const isValidPhone = (phone) => /^[+ 0-9]{8,15}$/.test(phone);

export const isValidWebsite = (url) => /^https?:\/\/.+\..+/.test(url);
