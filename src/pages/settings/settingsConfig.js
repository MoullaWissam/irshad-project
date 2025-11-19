import iconLanguage from "../../assets/icons/arabic.png";
import iconCompany from "../../assets/icons/search.png";
import iconProfile from "../../assets/icons/user.png";
import iconPassword from "../../assets/icons/key.png";
import iconDelete from "../../assets/icons/trash.png";

export const settingsByRole = {
  company: [
    {
      section: "General",
      items: [{ label: "Language", icon: iconLanguage }],
    },
    {
      section: "Account",
      items: [
        { label: "Company Info", icon: iconCompany },
        { label: "Change Password", icon: iconPassword },
        { label: "Delete Account", icon: iconDelete },
      ],
    },
  ],
  jobSeeker: [
    {
      section: "General",
      items: [{ label: "Language", icon: iconLanguage }],
    },
    {
      section: "Account",
      items: [
        { label: "Profile", icon: iconProfile },
        { label: "Change Password", icon: iconPassword },
        { label: "Delete Account", icon: iconDelete },
        { label: "wissam", icon: iconProfile },
      ],
    },
  ],
};
