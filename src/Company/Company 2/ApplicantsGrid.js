import React from "react";
import ApplicantCard from "../../Components/Card/ApplicantCard/ApplicantCard";
import "./ApplicantsGrid.css";

function ApplicantsGrid() {
  const applicants = [
    {
      name: "Ali",
      description: "Something short and simple here.",
      avatar: "/avatars/ali.png",
      rank: 1,
    },
    {
      name: "Sara",
      description: "Something short and simple here.",
      avatar: "/avatars/sara.png",
      rank: 2,
    },
    {
      name: "Omar",
      description: "Something short and simple here.",
      avatar: "/avatars/omar.png",
      rank: 3,
    },
    {
      name: "Lina",
      description: "Something short and simple here.",
      avatar: "/avatars/lina.png",
      rank: 4,
    },
    // أضف المزيد حسب الحاجة
  ];

  return (
    <div className="applicants-grid">
      {applicants.map((applicant, index) => (
        <ApplicantCard key={index} {...applicant} />
      ))}
    </div>
  );
}

export default ApplicantsGrid;
