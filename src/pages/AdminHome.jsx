import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { BACKEND_ENDPOINT } from "../api/api";

// Admin view intentionally mirrors the Nirikshak dashboard, but with access to all mandals.
const AdminHome = () => {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const [mandals, setMandals] = useState([]);
  const [activeMandal, setActiveMandal] = useState(stored?.mandal_id || stored?.mandalId || "");

  // Fetch all mandals for admin
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
    axios.defaults.baseURL = BACKEND_ENDPOINT;

    const fetchMandals = async () => {
      try {
        const res = await axios.get(`${BACKEND_ENDPOINT}mandals`);
        setMandals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("mandals load error", err);
        setMandals([]);
      }
    };

    fetchMandals();
  }, []);

  // Default to first mandal if none selected
  useEffect(() => {
    if (!activeMandal && mandals.length) {
      const first = mandals[0]?._id || mandals[0]?.id;
      if (first) setActiveMandal(first);
    }
  }, [activeMandal, mandals]);

  // Persist selection for downstream pages
  useEffect(() => {
    if (!activeMandal) return;
    const next = { ...(JSON.parse(localStorage.getItem("sevakDetails") || "{}") || {}) };
    next.mandal_id = activeMandal;
    next.mandalId = activeMandal;
    localStorage.setItem("sevakDetails", JSON.stringify(next));
  }, [activeMandal]);

  return (
    <>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "20px",
            marginInline: "15px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>ADMIN</h5>

          {mandals.length > 1 && (
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel id="admin-mandal-select">Select Mandal</InputLabel>
              <Select
                labelId="admin-mandal-select"
                label="Select Mandal"
                value={activeMandal || ""}
                onChange={(e) => setActiveMandal(e.target.value)}
              >
                {mandals.map((m) => (
                  <MenuItem key={m._id || m.code} value={m._id || m.id}>
                    {m.name} ({m.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>

        {mandals.length === 0 && (
          <Box p={3}>
            <Alert severity="warning">No mandals available for this admin account.</Alert>
          </Box>
        )}

        <div style={{ padding: "20px 15px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4} md={3}>
              <Card
                sx={{
                  height: 200,
                  background: "#ff6b6b",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 2,
                  ":hover": {
                    boxShadow: 5,
                    transform: "scale(1.03)",
                    transition: "0.25s",
                  },
                }}
              >
                <CardActionArea
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => navigate("/manage-mandal-yuvaks")}
                  disabled={!activeMandal}
                >
                  <CardContent sx={{ textAlign: "center", p: 1 }}>
                    <Typography fontSize={14} fontWeight="bold">
                      Mandal
                    </Typography>
                    <Typography fontSize={12} noWrap>
                      Add Mandal Yuvak
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
              <Card
                sx={{
                  height: 200,
                  background: "#4dabf7",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 2,
                  ":hover": {
                    boxShadow: 5,
                    transform: "scale(1.03)",
                    transition: "0.25s",
                  },
                }}
              >
                <CardActionArea
                  sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => navigate("/manage-mandal-teams")}
                  disabled={!activeMandal}
                >
                  <CardContent sx={{ textAlign: "center", p: 1 }}>
                    <Typography fontSize={14} fontWeight="bold">
                      Teams
                    </Typography>
                    <Typography fontSize={12} noWrap>
                      View &amp; Create Teams
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
              <Card
                sx={{
                  height: 200,
                  background: "#845ef7",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 2,
                  ":hover": {
                    boxShadow: 5,
                    transform: "scale(1.03)",
                    transition: "0.25s",
                  },
                }}
              >
                <CardActionArea
                  sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => navigate("/sampark-yuvak-team-wise")}
                  disabled={!activeMandal}
                >
                  <CardContent sx={{ textAlign: "center", p: 1 }}>
                    <Typography fontSize={14} fontWeight="bold">
                      Show Details
                    </Typography>
                    <Typography fontSize={12} noWrap>
                      Sampark Yuvak Details
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            
          </Grid>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
