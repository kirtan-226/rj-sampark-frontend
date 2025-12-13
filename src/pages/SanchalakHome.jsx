import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Button } from "reactstrap";
import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import SupervisorTeams from "../components/SupervisorTeams";
import CreateTeamModal from "../components/CreateTeamModal";
import { BACKEND_ENDPOINT } from "../api/api";
import { useNavigate } from "react-router-dom";

const SanchalakHome = () => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId;
  const token = localStorage.getItem("authToken");
  if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
  axios.defaults.baseURL = BACKEND_ENDPOINT;

  const fetchTeams = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BACKEND_ENDPOINT}teams/mandal/${mandalId}`);
      setTeams(res.data || []);
    } catch (err) {
      setTeams([]);
      setError(err.response?.data?.message || err.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (!mandalId) {
      setError("Mandal not set for this sanchalak");
      return;
    }

    fetchTeams();
  }, []);

  return (
    <>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "20px",
            marginInline: "15px",
          }}
        >
          <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>Manage Teams</h5>
          <Button color="primary" onClick={() => setShowCreateTeam(true)}>
            Create Team
          </Button>
        </div>

        <div style={{ padding: "20px 15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  aspectRatio: "1/1",
                  background: "#ff6b6b",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" },
                }}
              >
                <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/manage-mandal-yuvaks")}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold">
                      Mandal
                    </Typography>
                    <Typography style={{ whiteSpace: "nowrap" }}>Add Mandal Yuvak</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  aspectRatio: "1/1",
                  background: "#4dabf7",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" },
                }}
              >
                <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/manage-mandal-teams")}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold">
                      Teams
                    </Typography>
                    <Typography style={{ whiteSpace: "nowrap" }}>View &amp; Create Teams</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  aspectRatio: "1/1",
                  background: "#845ef7",
                  color: "#fff",
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" },
                }}
              >
                <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/sampark-yuvak-team-wise")}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold">
                      Show Details
                    </Typography>
                    <Typography style={{ whiteSpace: "nowrap" }}>Sampark Yuvak Details</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </div>

        <div style={{ padding: "0 15px 20px" }}>
          <SupervisorTeams teams={teams} loading={loading} error={error} refreshTeams={fetchTeams} />
        </div>
      </div>

      {showCreateTeam && <CreateTeamModal modal={showCreateTeam} setModal={setShowCreateTeam} />}
    </>
  );
};

export default SanchalakHome;
