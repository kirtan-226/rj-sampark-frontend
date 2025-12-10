import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../api/api";

const ChangePassword = () => {
  const [loader, setLoader] = useState(false);
  const [passwordData, setPasswordData] = useState({
    userId: "",
    phone: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_ENDPOINT}auth/forgot-password`,
        {
          userId: passwordData.userId.trim(),
          phone: passwordData.phone.trim(),
          newPassword: passwordData.newPassword,
        }
      );

      toast.success(res.data?.message || "Password updated successfully");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Change Password failed";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="password-container">
        <div className="password-card">
          <form onSubmit={handleSubmit}>
            <h1>Change Password</h1>
            <label>Sevak Id:</label>
            <input
              type="text"
              name="userId"
              onChange={handleChange}
              value={passwordData.userId}
              required
            />
            <label>Phone Number:</label>
            <input
              type="number"
              name="phone"
              onChange={handleChange}
              value={passwordData.phone}
              required
            />
            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={passwordData.newPassword}
              required
            />
            <button
              type="submit"
              disabled={loader}
              className="password-btn"
            >
              {loader ? "Loading..." : "Change Password"}
            </button>

            <p className="back-to-login-link">
              <Link to="/" className="link">
                Back to Login
              </Link>
            </p>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              closeOnClick
              pauseOnHover
              theme="colored"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
