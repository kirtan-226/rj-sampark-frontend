import React, { useState } from "react";
import Header from "../components/Header";
import { Button } from "reactstrap";
import { ToastContainer } from "react-toastify";
import AddMemberModal from "../components/AddMemberModal";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../api/api";

const Home = () => {
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/");
  };

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <h5 style={{ margin: 0 }}>Add Sampark Details</h5>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button color="primary" onClick={() => setShowAdd(true)}>
              Add Ahevaal
            </Button>
            <Button color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <p style={{ marginTop: "12px", color: "#555" }}>
          Use the button above to submit a new Ahevaal. Viewing analytics/list is disabled on this page.
        </p>
      </div>

      {showAdd && (
        <AddMemberModal
          modal={showAdd}
          setModal={setShowAdd}
          onSuccess={() => {}}
        />
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Home;
