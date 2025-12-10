import React, { useState } from 'react'
import Header from '../components/Header'
import SupervisorMandals from '../components/SupervisorMandals';
import { Box, CardContent, Chip, Grid, Paper, TextField, Typography } from '@mui/material';
import { Button, Card } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';

const NirdeshakHome = () => {

  // ================= STATIC VALUES FOR NOW =================
  const [isLeader] = useState(true);
  const [isAdmin] = useState(true);
  const [isSanchalak] = useState(true);
  const [mode, setMode] = useState("mandals");   // mandals / sevaks
  const [loading] = useState(false);
  const [error] = useState(null);

  const [qMandal, setQMandal] = useState("");
  const [qSevak, setQSevak] = useState("");
  const [selectedMandal, setSelectedMandal] = useState(null);

  // ===== Dummy grouped Xetra + Mandals =====
  const groupedByXetra = [
    ["Bharuch 1", [
      { name: "Akshardham", sanchalak_name: "Pragneshkumar Godhani", mandal_target: 40, mandal_filled_form: 25 },
      { name: "Maitrinagar", sanchalak_name: "Akshaybhai Umakantbhai Patel", mandal_target: 50, mandal_filled_form: 42 },
      { name: "Manasnagar", sanchalak_name: "Dhruv Bijraj Khudkhudiya", mandal_target: 40, mandal_filled_form: 25 },
      { name: "Akshardham", sanchalak_name: "Pragneshkumar Godhani", mandal_target: 40, mandal_filled_form: 25 },
      { name: "Maitrinagar", sanchalak_name: "Akshaybhai Umakantbhai Patel", mandal_target: 50, mandal_filled_form: 42 },
      { name: "Manasnagar", sanchalak_name: "Dhruv Bijraj Khudkhudiya", mandal_target: 40, mandal_filled_form: 25 },
    ]],
  ];

  // ===== Dummy Sevaks =====
  const sevaks = [
    { id: 1, sevak_id: "AK01", name: "Harsh", mandal_name: "Akshardham", filled_form: 10, sevak_target: 15, phone_number: "9999999999" },
    { id: 2, sevak_id: "AK02", name: "Nirav", mandal_name: "Akshardham", filled_form: 12, sevak_target: 15, phone_number: "8888888888" },
    { id: 3, sevak_id: "AK03", name: "Kunal", mandal_name: "Akshardham", filled_form: 9, sevak_target: 10, phone_number: "7777777777" }
  ];

  const filteredSevaks = sevaks.filter(s =>
    s.name.toLowerCase().includes(qSevak.toLowerCase()) ||
    s.sevak_id.toLowerCase().includes(qSevak.toLowerCase()) ||
    s.phone_number.includes(qSevak)
  );

  // ===== reusable sum utility =====
  const sum = (rows, field) => rows.reduce((t, x) => t + (x[field] || 0), 0);

  const handleMandalCardClick = (m) => {
    setSelectedMandal(m.name);
    setMode("sevaks");
  };

  const handleEdit = (row) => alert("Edit → " + row.name);
  const handleBackToMandals = () => setMode("mandals");

  return (
    <>
      <Header />
      <Box p={2}>
        {/* ================== MANDALS VIEW ================== */}
        {isLeader && mode === "mandals" && (
          <>
            <Box display="flex" justifyContent="flex-start" mb={2}>
              <TextField
                size="small"
                placeholder="Search mandals…"
                value={qMandal}
                onChange={(e) => setQMandal(e.target.value)}
                sx={{ width: 360 }}
              />
            </Box>

            {groupedByXetra.length === 0 && (
              <Paper sx={{ p: 2, textAlign: "center" }}>
                {loading ? "Loading mandals…" : "No mandals found"}
              </Paper>
            )}

            {groupedByXetra.map(([xetra, rows]) => (
              <Box mb={3} key={xetra}>
                <Typography align="center" fontWeight={800} fontSize={23}>{xetra} (Nirdeshak)</Typography>

                <Grid container spacing={2} mt={1}>
                  {rows.map((m, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <Card onClick={() => handleMandalCardClick(m)} style={{ cursor: "pointer" }}>
                        <CardContent sx={{ textAlign: "center" }}>   {/* Center everything */}
                          <Typography fontWeight={700}>{m.name}</Typography>

                          <Box mt={1} display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <Chip label={"Sanchalak: " + m.sanchalak_name} size="small" />
                            <Chip label={"Teams: " + m.mandal_target} size="small" />
                            <Chip label={"Sevak: " + m.mandal_filled_form} size="small" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Paper sx={{ p: 1.5, textAlign: "center", mt: 1 }}>
                  Subtotal Filled: {sum(rows, "mandal_filled_form")} | Subtotal Target: {sum(rows, "mandal_target")}
                </Paper>
              </Box>
            ))}
          </>
        )}

        {/* ================== SEVAK VIEW ================== */}
        {mode === "sevaks" && (
          <>
            <div style={{ width: "90%", margin: "auto", marginTop: "30px" }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" gap={1}>
                  {selectedMandal && <Chip label={"Mandal: " + selectedMandal} />}
                </Box>

                <TextField
                  size="small"
                  placeholder="Search sevaks..."
                  value={qSevak}
                  onChange={(e) => setQSevak(e.target.value)}
                  sx={{ width: 360 }}
                />
              </Box>

              {error && <Box color="error.main">{error}</Box>}

            </div>
            <SupervisorTeams />
          </>
        )}
      </Box>
    </>
  );
}

export default NirdeshakHome