// التحقق من البريد الإلكتروني
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// التحقق من كلمة السر (8 رموز على الأقل + حرف كبير + رقم)
export const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

// التحقق من رقم الهاتف (بين 8 و15 رقم)
export const isValidPhone = (phone) => /^[+ 0-9]{8,15}$/.test(phone);

// التحقق من رابط الموقع (يبدأ بـ http أو https)
export const isValidWebsite = (url) => /^https?:\/\/.+\..+/.test(url);
