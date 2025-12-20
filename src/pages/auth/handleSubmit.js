import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidWebsite,
} from "./validation";

export const handleSubmitLogic = (
  activeForm,
  employeeData,
  companyData
) => {
  let newErrors = {};

  if (activeForm === "employee") {
    if (!employeeData.firstName?.trim()) newErrors.firstName = "Required";
    if (!employeeData.lastName?.trim()) newErrors.lastName = "Required";
    
    if (!employeeData.email?.trim()) newErrors.email = "Required";
    else if (!isValidEmail(employeeData.email)) newErrors.email = "Invalid";

    if (!employeeData.password) newErrors.password = "Required";
    else if (!isValidPassword(employeeData.password)) 
      newErrors.password = "Weak password";

    if (!employeeData.phone?.trim()) newErrors.phone = "Required";
    else if (!isValidPhone(employeeData.phone)) newErrors.phone = "Invalid";

    // التحقق من تاريخ الميلاد
    if (!employeeData.birthDate) {
      newErrors.birthDate = "Required";
    } else {
      const birthDate = new Date(employeeData.birthDate);
      const today = new Date();
      
      // التحقق من أن التاريخ ليس في المستقبل
      if (birthDate > today) {
        newErrors.birthDate = "Birth date cannot be in the future";
      }
      
      // التحقق من العمر (16 سنة على الأقل)
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 16) {
        newErrors.birthDate = "You must be at least 16 years old";
      }
    }

  } else {
    if (!companyData.companyName?.trim()) newErrors.companyName = "Required";
    
    if (!companyData.email?.trim()) newErrors.email = "Required";
    else if (!isValidEmail(companyData.email)) newErrors.email = "Invalid";

    if (!companyData.companyPassword) newErrors.companyPassword = "Required";
    else if (!isValidPassword(companyData.companyPassword))
      newErrors.companyPassword = "Weak password";

    if (!companyData.companyAddress?.trim()) 
      newErrors.companyAddress = "Required";

    if (!companyData.website?.trim()) newErrors.website = "Required";
    else if (!isValidWebsite(companyData.website)) 
      newErrors.website = "Invalid URL";
  }

  return newErrors;
};