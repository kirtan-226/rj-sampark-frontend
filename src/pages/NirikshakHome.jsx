import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { Card, CardActionArea, CardContent, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../api/api";

const NirikshakHome = () => {
  const navigate = useNavigate();
  const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const assignedMandals = sevakDetails?.assigned_mandals || sevakDetails?.assignedMandals || [];

  const [mandals, setMandals] = useState([]);
  const [activeMandal, setActiveMandal] = useState(sevakDetails?.mandal_id || sevakDetails?.mandalId || "");

  const myMandals = useMemo(() => {
    if (!Array.isArray(assignedMandals) || assignedMandals.length === 0) return mandals;
    const set = new Set(assignedMandals.map((m) => m?._id || m?.id || m));
    return mandals.filter((m) => set.has(m._id) || set.has(String(m._id)));
  }, [assignedMandals, mandals]);

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

  useEffect(() => {
    if (!activeMandal && myMandals.length) {
      const first = myMandals[0]?._id || myMandals[0]?.id;
      if (first) setActiveMandal(first);
    }
  }, [activeMandal, myMandals]);

  // Persist the chosen mandal in localStorage so downstream pages pick it up
  useEffect(() => {
    if (!activeMandal) return;
    const stored = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    stored.mandal_id = activeMandal;
    stored.mandalId = activeMandal;
    localStorage.setItem("sevakDetails", JSON.stringify(stored));
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
          <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>{(sevakDetails?.role || "").toUpperCase()}</h5>

          {myMandals.length > 1 && (
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel id="nirikshak-mandal-select">Select Mandal</InputLabel>
              <Select
                labelId="nirikshak-mandal-select"
                label="Select Mandal"
                value={activeMandal || ""}
                onChange={(e) => setActiveMandal(e.target.value)}
              >
                {myMandals.map((m) => (
                  <MenuItem key={m._id || m.code} value={m._id}>
                    {m.name} ({m.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>

        {myMandals.length === 0 && (
          <Box p={3}>
            <Alert severity="warning">No mandals assigned to this Nirikshak.</Alert>
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

export default NirikshakHome;
