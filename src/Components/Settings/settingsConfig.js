import iconLanguage from "../icons/arabic.png";
import iconCompany from "../icons/search.png";
import iconProfile from "../icons/user.png";
import iconPassword from "../icons/key.png";
import iconDelete from "../icons/trash.png";

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
