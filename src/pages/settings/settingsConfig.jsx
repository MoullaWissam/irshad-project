import LanguageIcon from "../../assets/icons/arabic.png";
import ChangePassword from "../../assets/icons/key.png";
import DeleteAccount from "../../assets/icons/trash.png";
import AccountStatus from "../../assets/icons/user.png";
import AccountSettingsIcon from "../../assets/icons/setting.png"; 

export const settingsByRole = {
  company: [
    {
      title: "General",
      items: [{ label: "Language", icon: LanguageIcon }, { label: "---" }],
    },
    {
      title: "Account",
      items: [
        { label: "Account Settings", icon: AccountSettingsIcon },
        // { label: "Change Password", icon: ChangePassword },
        { label: "Delete Account", icon: DeleteAccount },
      ],
    },
  ],

  jobSeeker: [
    {
      title: "General",
      items: [{ label: "Language", icon: LanguageIcon }, { label: "---" }],
    },
    {
      title: "Account",
      items: [
        { label: "Account status", icon: AccountStatus },
        { label: "Account Settings", icon: AccountSettingsIcon },
        // { label: "Change Password", icon: ChangePassword },
        { label: "Delete Account", icon: DeleteAccount },
      ],
    },
  ],
};