// pages/settings/settingsConfig.js
export const settingsByRole = {
  jobSeeker: [
    {
      title: "الحساب",
      items: [
        { label: "المعلومات الشخصية", path: "/settings/profile" },
        { label: "التفضيلات", path: "/settings/preferences" },
        { label: "إشعارات البريد الإلكتروني", path: "/settings/notifications" }
      ]
    },
    {
      title: "السيرة الذاتية",
      items: [
        { label: "إدارة السير الذاتية", path: "/settings/resumes" },
        { label: "إعدادات الخصوصية", path: "/settings/privacy" }
      ]
    }
  ],
  company: [
    {
      title: "الحساب",
      items: [
        { label: "معلومات الشركة", path: "/settings/company-profile" },
        { label: "تفضيلات التوظيف", path: "/settings/hiring-preferences" },
        { label: "إشعارات البريد الإلكتروني", path: "/settings/notifications" }
      ]
    },
    {
      title: "الاشتراك",
      items: [
        { label: "خطة الاشتراك", path: "/settings/subscription" },
        { label: "الفواتير والمدفوعات", path: "/settings/billing" }
      ]
    }
  ]
};