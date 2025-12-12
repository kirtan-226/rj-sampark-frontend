import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../api/api";
import Header from "../components/Header";
import AddAnnkutSevakModal from "../components/AddAnnkutSevakModal";
import {
  Box,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  TextField,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";

export default function AnnkutSevakList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sevaks, setSevaks] = useState([]);
  const [qSevak, setQSevak] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const sevakDetails = (() => {
    try {
      return JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    } catch {
      return {};
    }
  })();
  const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId || undefined;

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
      setSevaks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to load sevaks";
      setError(msg);
      setSevaks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSevaks();
  }, [showAdd]);

  const filteredSevaks = useMemo(() => {
    const needle = qSevak.trim().toLowerCase();
    if (!needle) return sevaks;
    return sevaks.filter((s) =>
      [s.name, s.userId, s.phone]
        .map((x) => String(x || "").toLowerCase())
        .some((val) => val.includes(needle))
    );
  }, [sevaks, qSevak]);

  return (
    <>
      <Header />
      <Box p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5">Sevaks</Typography>
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Search name/id/phone"
              value={qSevak}
              onChange={(e) => setQSevak(e.target.value)}
              sx={{ width: 260 }}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={fetchSevaks} disabled={loading}>
                <i className="bi bi-arrow-clockwise"></i>
              </IconButton>
            </Tooltip>
            <Button variant="contained" onClick={() => setShowAdd(true)}>
              Add Sevak
            </Button>
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
                <TableCell>Mandal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSevaks.map((row, idx) => (
                <TableRow key={row._id || row.userId || idx}>
                  <TableCell>{row.userId || "-"}</TableCell>
                  <TableCell>{row.name || "-"}</TableCell>
                  <TableCell>{row.phone || "-"}</TableCell>
                  <TableCell>{row.mandalId || "-"}</TableCell>
                </TableRow>
              ))}
              {filteredSevaks.length === 0 && (
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

      {showAdd && (
        <AddAnnkutSevakModal modal={showAdd} setModal={setShowAdd} />
      )}
    </>
  );
}
