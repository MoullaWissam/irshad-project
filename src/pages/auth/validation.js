// validation.js
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // 8 أحرف على الأقل، حرف كبير واحد على الأقل ورقم واحد على الأقل
  // يمكن أن تحتوي على أحرف خاصة
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPhone = (phone) => {
  // أرقام فقط، من 8 إلى 15 رقم
  // يمكن أن تبدأ بعلامة + (للكود الدولي)
  const phoneRegex = /^[\+]?[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};

export const isValidWebsite = (website) => {
  // فحص عنوان ويب (يدعم http/https)
  // يمكن أن يبدأ بـ www. أو بدون
  const websiteRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  return websiteRegex.test(website);
};