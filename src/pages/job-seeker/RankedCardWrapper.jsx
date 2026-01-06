/**
 * RankedCardWrapper Component
 * مسؤول عن تغليف بطاقة الوظيفة ضمن حاوية تسمح بإضافة عناصر إضافية مثل وسام الرانك
 */

import React from "react";
import "./RankedCardWrapper.css";

function RankedCardWrapper({ children, rank }) {
  return (
    <div className="ranked-wrapper">
      <div className="job-card-container">{children}</div>
    </div>
  );
}

export default RankedCardWrapper;
