import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { BACKEND_ENDPOINT } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";

const MandalSevakList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mandalFromRoute = location.state?.mandalDetails;

  const sevakDetails = (() => {
    try {
      return JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    } catch {
      return {};
    }
  })();

  const mandalId =
    mandalFromRoute?.mandalId ||
    mandalFromRoute?._id ||
    sevakDetails?.mandal_id ||
    sevakDetails?.mandalId ||
    undefined;

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSevaks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BACKEND_ENDPOINT}users`, {
        params: {
          role: "KARYAKAR",
          mandalId,
        },
      });
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to load sevaks";
      setError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSevaks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandalId]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      [r.name, r.userId, r.phone]
        .map((x) => String(x || "").toLowerCase())
        .some((val) => val.includes(needle))
    );
  }, [rows, q]);

  return (
    <>
      <Header />
      <Box p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i>
            </IconButton>
            <Typography variant="h6" sx={{ margin: 0 }}>
              Mandal Sevaks
            </Typography>
            {mandalId && (
              <Typography variant="body2" color="text.secondary">
                Mandal: {mandalId}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Search name/id/phone"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ width: 260 }}
            />
            <Tooltip title="Refresh">
              <Button variant="outlined" onClick={fetchSevaks} disabled={loading}>
                Refresh
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Box mb={1} color="error.main">
            {error}
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sevak Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Team</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row, idx) => (
                <TableRow key={row._id || row.userId || idx}>
                  <TableCell>{row.userId || "-"}</TableCell>
                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>{row.phone || "-"}</TableCell>
                  <TableCell>{row.teamId || "Not Assigned"}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {loading ? "Loading..." : "No sevaks found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default MandalSevakList;
