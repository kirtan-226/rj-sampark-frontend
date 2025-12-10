import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, CardContent, Chip, Grid, Paper, TextField, Typography } from "@mui/material";
import { Card } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import SupervisorTeams from "./SupervisorTeams";

export default function SupervisorMandals() {
  const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const role = (sevakDetails?.role || sevakDetails?.role_code || "").toUpperCase();
  const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId;

  const isAdmin = role === "ADMIN";
  const isSanchalak = role === "SANCHALAK";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [qMandal, setQMandal] = useState("");
  const [groupedByXetra, setGroupedByXetra] = useState([]);

  const [teams, setTeams] = useState([]);

  const fetchMandals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BACKEND_ENDPOINT}mandals`);
      const mandals = res.data || [];

      const grouped = mandals.reduce((acc, m) => {
        const key = m.xetra || "Unassigned";
        if (!acc[key]) acc[key] = [];
        acc[key].push(m);
        return acc;
      }, {});

      setGroupedByXetra(Object.entries(grouped));
    } catch (err) {
      setGroupedByXetra([]);
      setError(err.response?.data?.message || err.message || "Failed to load mandals");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    if (!mandalId) {
      setError("Mandal not set for this sanchalak");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (token) {
      axios.defaults.headers.common.Authorization = `Basic ${token}`;
    }
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
    if (isAdmin) fetchMandals();
    else if (isSanchalak && mandalId) fetchTeams();
  }, [role, mandalId]);

  const filteredGrouped = useMemo(() => {
    const query = qMandal.trim().toLowerCase();
    if (!query) return groupedByXetra;
    return groupedByXetra
      .map(([xetra, rows]) => [
        xetra,
        rows.filter(
          (m) =>
            m.name?.toLowerCase().includes(query) ||
            m.code?.toLowerCase().includes(query) ||
            m.xetra?.toLowerCase().includes(query)
        ),
      ])
      .filter(([, rows]) => rows.length > 0);
  }, [groupedByXetra, qMandal]);

  return (
    <Box p={2}>
      {isAdmin && (
        <>
          <Box display="flex" justifyContent="flex-start" mb={2}>
            <TextField
              size="small"
              placeholder="Search mandals..."
              value={qMandal}
              onChange={(e) => setQMandal(e.target.value)}
              sx={{ width: 360 }}
            />
          </Box>

          {error && <Paper sx={{ p: 2, textAlign: "center", color: "error.main" }}>{error}</Paper>}

          {filteredGrouped.length === 0 && !loading && !error && (
            <Paper sx={{ p: 2, textAlign: "center" }}>No mandals found</Paper>
          )}

          {loading && <Paper sx={{ p: 2, textAlign: "center" }}>Loading mandals...</Paper>}

          {filteredGrouped.map(([xetra, rows]) => (
            <Box mb={3} key={xetra}>
              <Typography align="center" fontWeight={800} fontSize={23}>
                {xetra}
              </Typography>

              <Grid container spacing={2} mt={1}>
                {rows.map((m) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={m._id || m.code}>
                    <Card style={{ cursor: "default" }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography fontWeight={700}>{m.name}</Typography>

                        <Box mt={1} display="flex" flexDirection="column" alignItems="center" gap={1}>
                          <Chip label={"Code: " + (m.code || "-")} size="small" />
                          <Chip label={"Xetra: " + (m.xetra || "-")} size="small" />
                          <Chip label={"Mandal ID: " + (m.mandal_id || "-")} size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </>
      )}

      {isSanchalak && <SupervisorTeams teams={teams} loading={loading} error={error} />}

      {!isAdmin && !isSanchalak && (
        <Paper sx={{ p: 2, textAlign: "center" }}>Role not supported for this view yet.</Paper>
      )}
    </Box>
  );
}
