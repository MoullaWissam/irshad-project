import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidWebsite,
} from "./validation";

// دالة عامة لمعالجة التحقق والإرسال
export const handleSubmitLogic = (
  activeForm,
  employeeData,
  companyData,
  setErrors
) => {
  let newErrors = {};
  let dataToSend = {};

  // تحقق بيانات الموظف
  if (activeForm === "employee") {
    if (!employeeData.firstName) newErrors.firstName = "First name is required";
    if (!employeeData.lastName) newErrors.lastName = "Last name is required";

    if (!employeeData.email) newErrors.email = "Email is required";
    else if (!isValidEmail(employeeData.email))
      newErrors.email = "Invalid email format";

    if (!employeeData.password) newErrors.password = "Password is required";
    else if (!isValidPassword(employeeData.password))
      newErrors.password =
        "Password must be at least 8 characters, include one capital letter and one number";

    if (!employeeData.phone) newErrors.phone = "Phone number is required";
    else if (!isValidPhone(employeeData.phone))
      newErrors.phone = "Phone number must contain only digits (8–15)";

    dataToSend = { type: "job_seeker", ...employeeData };
  }

  // تحقق بيانات الشركة
  else {
    if (!companyData.companyName)
      newErrors.companyName = "Company name is required";

    if (!companyData.companyPassword)
      newErrors.companyPassword = "Password is required";
    else if (!isValidPassword(companyData.companyPassword))
      newErrors.companyPassword =
        "Password must be at least 8 characters, include one capital letter and one number";

    if (!companyData.companyAddress)
      newErrors.companyAddress = "Address is required";

    if (!companyData.website) newErrors.website = "Website is required";
    else if (!isValidWebsite(companyData.website))
      newErrors.website = "Invalid website format (use https://...)";

    dataToSend = { type: "company", ...companyData };
  }

  // تحديث الأخطاء
  setErrors(newErrors);

  // في حال لا توجد أخطاء
  if (Object.keys(newErrors).length === 0) {
    console.log("✅ Submitted Data:", dataToSend);
    // هنا ممكن تضيف النداء إلى الـ backend لاحقًا (fetch أو axios)
  }
};
