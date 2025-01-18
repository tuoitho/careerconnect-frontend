// Profile.js
import React from "react";
// import { useAuth } from "../context/AuthContext";
const Profile = () => {
  const user = localStorage.getItem("user");
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <div>
      {user}2
      {user ? (
        <div>
          <h2>Welcome, {user}</h2>
          {/* Hiển thị thông tin người dùng sau khi đăng nhập */}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;
