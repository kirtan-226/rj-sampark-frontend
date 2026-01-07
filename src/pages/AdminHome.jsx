import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  TextField,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { BACKEND_ENDPOINT, getAuthToken } from "../api/api";

const AdminHome = () => {
  const stored = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const [mandals, setMandals] = useState([]);
  const [qMandal, setQMandal] = useState("");
  const [selectedMandal, setSelectedMandal] = useState(null);
  const [mandalError, setMandalError] = useState("");
  const [mandalLoading, setMandalLoading] = useState(false);

  const [teams, setTeams] = useState([]);
  const [yuvaks, setYuvaks] = useState([]);
  const [sanchalaks, setSanchalaks] = useState([]);
  const [nirikshaks, setNirikshaks] = useState([]);
  const [ahevaals, setAhevaals] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [activeTab, setActiveTab] = useState("ahevaals"); // ahevaals | teams | members

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common["x-user-id"] = token;
    } else {
      delete axios.defaults.headers.common["x-user-id"];
    }
    axios.defaults.baseURL = BACKEND_ENDPOINT;
    fetchMandals();
  }, []);

  const fetchMandals = async () => {
    setMandalLoading(true);
    setMandalError("");
    try {
      const res = await axios.get(`${BACKEND_ENDPOINT}mandals`);
      const list = Array.isArray(res.data) ? res.data : [];
      const filtered = list.filter(
        (m) => String(m?.name || "").trim().toLowerCase() !== "test"
      );
      setMandals(filtered);
    } catch (err) {
      console.error("mandals load error", err);
      setMandals([]);
      setMandalError(err?.response?.data?.message || err.message || "Failed to load mandals");
    } finally {
      setMandalLoading(false);
    }
  };

  const fetchMandalDetails = async (mandalId) => {
    if (!mandalId) return;
    setDetailLoading(true);
    setDetailError("");
    try {
      const [teamsRes, usersRes, ahevaalRes, sanchalakRes, nirikshakRes] = await Promise.all([
        axios.get(`${BACKEND_ENDPOINT}teams/mandal/${mandalId}`),
        axios.get(`${BACKEND_ENDPOINT}users`, { params: { mandalId, role: "KARYAKAR" } }),
        axios.get(`${BACKEND_ENDPOINT}ahevaals/mandal/${mandalId}`),
        axios.get(`${BACKEND_ENDPOINT}users`, { params: { mandalId, role: "SANCHALAK" } }),
        axios.get(`${BACKEND_ENDPOINT}users`, { params: { mandalId, role: "NIRIKSHAK" } }),
      ]);

      setTeams(Array.isArray(teamsRes.data) ? teamsRes.data : []);
      setYuvaks(Array.isArray(usersRes.data) ? usersRes.data : []);
      setSanchalaks(Array.isArray(sanchalakRes.data) ? sanchalakRes.data : []);
      setNirikshaks(Array.isArray(nirikshakRes.data) ? nirikshakRes.data : []);
      setAhevaals(Array.isArray(ahevaalRes.data) ? ahevaalRes.data : []);
    } catch (err) {
      console.error("mandal details load error", err);
      setTeams([]);
      setYuvaks([]);
      setSanchalaks([]);
      setNirikshaks([]);
      setAhevaals([]);
      setDetailError(err?.response?.data?.message || err.message || "Failed to load details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectMandal = (mandal) => {
    setSelectedMandal(mandal);
    setActiveTab("ahevaals");
    const id = mandal?._id || mandal?.id;
    const next = { ...(JSON.parse(localStorage.getItem("sevakDetails") || "{}") || {}) };
    next.mandal_id = id;
    next.mandalId = id;
    localStorage.setItem("sevakDetails", JSON.stringify(next));
    fetchMandalDetails(id);
  };

  const filteredMandals = useMemo(() => {
    const q = qMandal.trim().toLowerCase();
    return !q
      ? mandals
      : mandals.filter((m) =>
          [m.name, m.code, m.xetra]
            .map((v) => String(v || "").toLowerCase())
            .some((v) => v.includes(q))
        );
  }, [mandals, qMandal]);

  const summary = useMemo(
    () => ({
      teams: teams.length,
      yuvaks: yuvaks.length,
      ahevaals: ahevaals.length,
    }),
    [teams.length, yuvaks.length, ahevaals.length]
  );

  const teamLookup = useMemo(() => {
    const map = {};
    teams.forEach((t) => {
      const id = t._id || t.id;
      if (id) map[String(id)] = t;
    });
    return map;
  }, [teams]);

  const leaderIds = useMemo(() => {
    const set = new Set();
    teams.forEach((t) => {
      const lid = typeof t.leader === "object" ? t.leader?._id || t.leader?.id : t.leader;
      if (lid) set.add(String(lid));
    });
    return set;
  }, [teams]);

  const sanchalakLabel = useMemo(() => {
    const names = sanchalaks.map((s) => s.name || s.userId).filter(Boolean);
    return names.join(", ");
  }, [sanchalaks]);

  const nirikshakLabel = useMemo(() => {
    const names = nirikshaks.map((n) => n.name || n.userId).filter(Boolean);
    return names.join(", ");
  }, [nirikshaks]);

  const yuvaksWithTeam = useMemo(() => {
    return yuvaks.map((y) => {
      const teamId = typeof y.teamId === "object" ? y.teamId?._id || y.teamId?.id : y.teamId;
      const team = typeof y.teamId === "object" && (y.teamId?.name || y.teamId?.teamCode)
        ? y.teamId
        : teamLookup[String(teamId)];
      const id = y._id || y.id || y.userId;
      const isLeader = id && leaderIds.has(String(id));
      return {
        ...y,
        _teamLabel: team?.name || team?.teamCode || "Not Assigned",
        _isLeader: isLeader,
        _sanchalak: sanchalakLabel,
        _nirikshak: nirikshakLabel,
      };
    });
  }, [yuvaks, teamLookup, leaderIds, sanchalaks, nirikshaks]);

  const backToGrid = () => {
    setSelectedMandal(null);
    setTeams([]);
    setYuvaks([]);
    setAhevaals([]);
    setDetailError("");
    setActiveTab("ahevaals");
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "16px" }}>
        {!selectedMandal && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              gap={2}
            >
              <Typography variant="h6" sx={{ margin: 0 }}>
                ADMIN
              </Typography>
              <TextField
                size="small"
                placeholder="Search mandals..."
                value={qMandal}
                onChange={(e) => setQMandal(e.target.value)}
                sx={{ width: 280 }}
              />
            </Box>

            {mandalError && (
              <Box mb={2}>
                <Alert severity="error">{mandalError}</Alert>
              </Box>
            )}
            {mandalLoading && (
              <Box mb={2}>
                <Alert severity="info">Loading mandals...</Alert>
              </Box>
            )}
            {filteredMandals.length === 0 && !mandalLoading && !mandalError && (
              <Alert severity="warning">No mandals available for this admin account.</Alert>
            )}

            <Grid container spacing={2}>
              {filteredMandals.map((m) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={m._id || m.code}>
                  <Card
                    sx={{
                      height: 170,
                      background: "#fff",
                      color: "#111",
                      borderRadius: 2,
                      boxShadow: 2,
                      ":hover": { boxShadow: 5, transform: "scale(1.02)", transition: "0.2s" },
                    }}
                  >
                    <CardActionArea sx={{ height: "100%" }} onClick={() => handleSelectMandal(m)}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography fontWeight={700} sx={{ mb: 1 }}>
                          {m.name}
                        </Typography>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                          <Chip label={`Code: ${m.code || "-"}`} size="small" />
                          {/* <Chip label={`Mandal ID: ${m.mandal_id || "-"}`} size="small" /> */}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {selectedMandal && (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Button variant="outlined" onClick={backToGrid}>
                  Back
                </Button>
                <Typography variant="h6" sx={{ margin: 0 }}>
                  {selectedMandal.name}
                </Typography>
                {selectedMandal.xetra && <Chip label={`Xetra: ${selectedMandal.xetra}`} />}
                {selectedMandal.code && <Chip label={`Code: ${selectedMandal.code}`} />}
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip label={`Teams: ${summary.teams}`} color="primary" variant="outlined" />
                <Chip label={`Yuvaks: ${summary.yuvaks}`} color="success" variant="outlined" />
                <Chip label={`Sampark: ${summary.ahevaals}`} color="warning" variant="outlined" />
                {sanchalakLabel && (
                  <Chip
                    label={`Sanchalak: ${sanchalakLabel}`}
                    variant="outlined"
                    sx={{ borderColor: "#1976d2", color: "#1976d2", fontWeight: 600 }}
                  />
                )}
                {nirikshakLabel && (
                  <Chip
                    label={`Nirikshak: ${nirikshakLabel}`}
                    variant="outlined"
                    sx={{ borderColor: "#ff9800", color: "#ff9800", fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>

            {detailError && (
              <Box mb={2}>
                <Alert severity="error">{detailError}</Alert>
              </Box>
            )}
            {detailLoading && (
              <Box mb={2}>
                <Alert severity="info">Loading mandal details...</Alert>
              </Box>
            )}

            <Paper sx={{ p: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2 }}
              >
                <Tab label="Sampark" value="ahevaals" />
                <Tab label="Teams" value="teams" />
                <Tab label="Yuvaks" value="members" />
              </Tabs>

              {activeTab === "ahevaals" && (
                <div style={{ overflowX: "auto" }}>
                  {ahevaals.length === 0 && !detailLoading && <div>No sampark entries yet</div>}
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "720px" }}>
                    <thead>
                      <tr style={{ background: "#f7f7f7" }}>
                        <th style={th}>#</th>
                        <th style={th}>Name</th>
                        <th style={th}>Phone</th>
                        <th style={th}>DOB</th>
                        <th style={th}>Sampark Date</th>
                        <th style={th}>Address</th>
                        <th style={th}>Grade</th>
                        <th style={th}>Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ahevaals.map((a, idx) => {
                        const team = a.teamId && teamLookup[String(a.teamId)];
                        return (
                          <tr key={a._id || idx}>
                            <td style={td}>{idx + 1}</td>
                            <td style={td}>{a.name || "-"}</td>
                            <td style={td}>{a.phone || "-"}</td>
                            <td style={td}>{a.dob ? new Date(a.dob).toLocaleDateString() : "-"}</td>
                            <td style={td}>
                              {a.samparkDate || a.createdAt
                                ? new Date(a.samparkDate || a.createdAt).toLocaleDateString()
                                : "-"}
                            </td>
                            <td style={td}>{a.address || "-"}</td>
                            <td style={td}>{a.grade || "-"}</td>
                            <td style={td}>{team?.name || team?.teamCode || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "teams" && (
                <div style={{ overflowX: "auto" }}>
                  {teams.length === 0 && !detailLoading && <div>No teams found</div>}
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                      <tr style={{ background: "#f7f7f7" }}>
                        <th style={th}>#</th>
                        <th style={th}>Team</th>
                        <th style={th}>Code</th>
                        <th style={th}>Leader</th>
                        <th style={th}>Members</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((t, idx) => (
                        <tr key={t._id || t.teamCode || idx}>
                          <td style={td}>{idx + 1}</td>
                          <td style={td}>{t.name || "-"}</td>
                          <td style={td}>{t.teamCode || "-"}</td>
                          <td style={td}>{typeof t.leader === "object" ? t.leader?.name || "-" : "-"}</td>
                          <td style={td}>{(t.members || []).length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "members" && (
                <div style={{ overflowX: "auto" }}>
                  {yuvaksWithTeam.length === 0 && !detailLoading && <div>No members found</div>}
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                    <thead>
                      <tr style={{ background: "#f7f7f7" }}>
                        <th style={th}>#</th>
                        <th style={th}>Name</th>
                        <th style={th}>User ID</th>
                        <th style={th}>Phone</th>
                        <th style={th}>Team</th>
                        <th style={th}>Leader</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yuvaksWithTeam.map((y, idx) => (
                        <tr key={y._id || y.userId || idx}>
                          <td style={td}>{idx + 1}</td>
                          <td style={td}>{y.name || "-"}</td>
                          <td style={td}>{y.userId || "-"}</td>
                          <td style={td}>{y.phone || "-"}</td>
                          <td style={td}>{y._teamLabel}</td>
                          <td style={td}>{y._isLeader ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Paper>
          </Box>
        )}
      </div>
    </>
  );
};

const th = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  fontSize: "13px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  fontSize: "13px",
  textAlign: "left",
  whiteSpace: "nowrap",
};

export default AdminHome;
