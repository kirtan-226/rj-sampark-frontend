import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BACKEND_ENDPOINT, getAuthToken, setAuthSession } from "../api/api";
import Mandir from './../resources/mandir.png';
import bapsLogo from './../resources/logoBaps.png';

const Login = () => {
  const [loader, setLoader] = useState(false);
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });
  const navigate = useNavigate();

  // If an admin is already logged in, land them on the admin page right away.
  React.useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    const sevak = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    if (sevak?.role === "ADMIN") {
      navigate("/admin-home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setLoader(true);
    e.preventDefault();

    try {
      axios.defaults.baseURL = BACKEND_ENDPOINT;
      const res = await axios.post(`${BACKEND_ENDPOINT}auth/login`, {
        userId: loginData.userId.trim(),
        password: loginData.password,
      });

      const { user, message } = res.data || {};

      if (!user) {
        toast.error(res.data?.message || "Login failed");
        return;
      }

      const assignedMandals = user.assignedMandals || [];
      const derivedMandalId = user.mandalId || (assignedMandals.length ? assignedMandals[0] : null);

      const sevakDetails = {
        ...user,
        sevak_id: user.userId,
        phone_number: user.phone,
        mandal_id: derivedMandalId,
        team_id: user.teamId,
        team_name: user.teamName || user.teamCode || null,
        team_code: user.teamCode || null,
        role_code: user.role,
        sevak_target: user.sevak_target ?? 0,
        filled_form: user.filled_form ?? 0,
        achieved_target: user.achieved_target ?? 0,
        assigned_mandals: assignedMandals,
      };

      localStorage.setItem("sevakDetails", JSON.stringify(sevakDetails));
      const basicToken = btoa(`${loginData.userId.trim()}:${loginData.password}`);
      setAuthSession(basicToken);
      axios.defaults.headers.common.Authorization = `Basic ${basicToken}`;
      toast.success(message || "Login successful");

      switch (user.role) {
        case "ADMIN":
          navigate("/admin-home");
          break;
        case "NIRDESHAK":
          navigate("/nirdeshak-home");
          break;
        case "NIRIKSHAK":
          navigate("/nirikshak-home");
          break;
        case "SANCHALAK":
          navigate("/sanchalak-home");
          break;
        default:
          navigate("/team-home");
          break;
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={Mandir} alt="Mandir Background" className="mandir-image" />
        <img src={bapsLogo} alt="BAPS Logo" className="baps-logo" />
        <h6>WELCOME</h6>
        <h2>Sampark Sevak</h2>
      </div>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <label>Sevak Id:</label>
          <input
            type="text"
            name="userId"
            onChange={handleChange}
            value={loginData.userId}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={loginData.password}
            required
          />
          <button
            type="submit"
            disabled={loader}
            className="login-btn"
          >
            {loader ? "Loading..." : "Log In"}
          </button>

          <p className="change-password-link">
            <Link to="/change-password" className="link">
              Change Password
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
  );
};

export default Login;
