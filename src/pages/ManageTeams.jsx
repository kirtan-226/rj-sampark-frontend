import React from "react";
import Header from "../components/Header";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function ManageTeams() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div style={{ width: "90%", margin: "auto", marginTop: "30px", textAlign: "center" }}>
        <h4>Manage Teams</h4>
        <p>Team management has moved to the Mandal Teams page.</p>
        <Button color="warning" onClick={() => navigate("/manage-mandal-teams")}>
          Go to Mandal Teams
        </Button>
      </div>
    </>
  );
}
