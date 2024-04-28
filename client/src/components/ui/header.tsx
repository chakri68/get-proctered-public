import React from "react";

const Header = () => {
  return (
    <div className="flex px-4 py-2 bg-blue-50">
      <img
        src="/images/iiitllogobg.png"
        alt="logo"
        className="ml-12 mt-2"
        style={{height: "7rem", width: "7.2rem"}}
      />
      <div className="ml-auto text-xl text-gray-600 px-4 py-4" style={{direction: "rtl"}}>
        Indian Institute of Information Technology, Lucknow <br />
        भारतीय सूचना प्रौद्योगिकी संस्थान, लखनऊ <br />
        (An Institute of National Importance by the Act of Parliament)
      </div>
    </div>
  );
};

export default Header;
