<<<<<<< HEAD
import React, { useState } from 'react'
import Header from '../components/Header'
import SupervisorMandals from '../components/SupervisorMandals';
import { Box, CardActionArea, CardContent, Chip, Grid, Paper, TextField, Typography } from '@mui/material';
import { Button, Card } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';
import CreateTeamModal from '../components/CreateTeamModal';
import { useNavigate } from 'react-router-dom';

const SanchalakHome = () => {

  const navigate = useNavigate();
=======
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Button } from "reactstrap";
import SupervisorTeams from "../components/SupervisorTeams";
import CreateTeamModal from "../components/CreateTeamModal";
import { BACKEND_ENDPOINT } from "../api/api";

const SanchalakHome = () => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTeamCreation = () => setShowCreateTeam(true);
>>>>>>> ff63803 (integrated login)

  useEffect(() => {
    const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId;
    const token = localStorage.getItem("authToken");
    if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
    axios.defaults.baseURL = BACKEND_ENDPOINT;

    if (!mandalId) {
      setError("Mandal not set for this sanchalak");
      return;
    }

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

    fetchTeams();
  }, []);

  return (
    <>
      <Header />
<<<<<<< HEAD
=======
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
>>>>>>> ff63803 (integrated login)

      <div>
        <Grid container spacing={2} sx={{ p: 2 }}>

          {/* CARD 1 */}
          <Grid item xs={6} md={3}>
            <Card sx={{
              aspectRatio: "1/1",
              background: "#ff6b6b", color: "#fff",
              borderRadius: 3, boxShadow: 3, display: "flex",
              justifyContent: "center", alignItems: "center",
              ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" }
            }}>
              <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/manage-mandal-yuvaks")}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">Mandal</Typography>
                  <Typography style={{ whiteSpace: "nowrap" }}>Add Mandal Yuvak</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* CARD 2 */}
          <Grid item xs={6} md={3}>
            <Card sx={{
              aspectRatio: "1/1",
              background: "#4dabf7", color: "#fff",
              borderRadius: 3, boxShadow: 3, display: "flex",
              justifyContent: "center", alignItems: "center",
              ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" }
            }}>
              <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/manage-mandal-teams")}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">Teams</Typography>
                  <Typography style={{ whiteSpace: "nowrap" }}>View & Create Teams</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* CARD 3 */}
          <Grid item xs={6} md={3}>
            <Card sx={{
              aspectRatio: "1/1",
              background: "#51cf66", color: "#fff",
              borderRadius: 3, boxShadow: 3, display: "flex",
              justifyContent: "center", alignItems: "center",
              ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" }
            }}>
              <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/reports")}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">Statistics</Typography>
                  <Typography style={{ whiteSpace: "nowrap" }}>View analytics reports</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* CARD 4 */}
          <Grid item xs={6} md={3}>
            <Card sx={{
              aspectRatio: "1/1",
              background: "#845ef7", color: "#fff",
              borderRadius: 3, boxShadow: 3, display: "flex",
              justifyContent: "center", alignItems: "center",
              ":hover": { boxShadow: 6, transform: "scale(1.05)", transition: "0.3s" }
            }}>
              <CardActionArea sx={{ height: "100%" }} onClick={() => navigate("/sampark-yuvak-team-wise")}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">Show Details</Typography>
                  <Typography style={{ whiteSpace: "nowrap" }}>Sampark Yuvak Details</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

        </Grid>
      </div>
<<<<<<< HEAD
=======
      <SupervisorTeams teams={teams} loading={loading} error={error} />

      {showCreateTeam && (
        <CreateTeamModal modal={showCreateTeam} setModal={setShowCreateTeam} />
      )}
>>>>>>> ff63803 (integrated login)
    </>
  );
};

export default SanchalakHome;
