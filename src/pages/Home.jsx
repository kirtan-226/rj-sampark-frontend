import React, { useState } from "react";
import Header from "../components/Header";
import { Button } from "reactstrap";
import { ToastContainer } from "react-toastify";
import AddMemberModal from "../components/AddMemberModal";

const Home = () => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <Header />

      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 style={{ margin: 0 }}>Add Sampark Details</h5>
          <Button color="primary" onClick={() => setShowAdd(true)}>
            Add Ahevaal
          </Button>
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
