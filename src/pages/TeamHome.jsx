import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import AddSupervisorModal from '../components/AddSupervisorModal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AddMemberModal from '../components/AddMemberModal';
import { ProgressBar } from 'react-bootstrap';
import { Box, Chip, TextField } from '@mui/material';
import axios from 'axios';
import { BACKEND_ENDPOINT } from '../api/api';

const TeamHome = () => {

  const navigate = useNavigate();
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const [qMandal, setQMandal] = useState("");
  const [ahevaals, setAhevaals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddSupervisor = () => setShowAddSupervisor(true);

  let sevak_target = 45;
  let achievedTarget = 2;
  const progress = sevak_target > 0 ? (achievedTarget / sevak_target) * 100 : 0;
  const progressClamped = Math.max(0, Math.min(100, Math.round(progress)));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
    axios.defaults.baseURL = BACKEND_ENDPOINT;
    fetchAhevaals();
  }, []);

  const fetchAhevaals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BACKEND_ENDPOINT}ahevaals/my`);
      console.log("Fetched ahevaals:", res.data);
      setAhevaals(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load data");
      setAhevaals([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAhevaals = React.useMemo(() => {
    const q = qMandal.trim().toLowerCase();
    if (!q) return ahevaals;

    return ahevaals.filter((item) =>
      item.name?.toLowerCase().includes(q) ||
      item.phone?.includes(q) ||
      item.address?.toLowerCase().includes(q)
    );
  }, [ahevaals, qMandal]);

  return (
    <>
      <Header />

      {/* <div
        style={{
          display: "flex",
          textAlign: "left",
          fontFamily: "system-ui",
          justifyContent: "space-around",
        }}
      >
        <div style={{ width: "100%", padding: "10px", fontWeight: 600 }}>
          <h6 style={{ fontWeight: 600 }}>Achieved Target</h6>
          <ProgressBar
            now={progressClamped}
            label={`${progressClamped}%`}
            className="custom-progress-bar"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          textAlign: "left",
          fontFamily: "system-ui",
          margin: "0 12px",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h6>Target : {sevak_target}</h6>
          <h6>Filled form : {achievedTarget}</h6>
        </div>
      </div> */}

      {/* <Chip
        label="Team A"
        sx={{
          fontSize: "1.2rem",
          padding: "16px 28px",
          height: "45px",
          margin: "20px 12px",
        }}
      /> */}

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '15px 12px',
        }}>
          <h5 style={{ margin: 0 }}>Sampark Details</h5>

          <Button color="warning" onClick={handleAddSupervisor}>
            Add Sampark Details
          </Button>
        </div>

        <Box mb={2} mx={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search here..."
            value={qMandal}
            onChange={(e) => setQMandal(e.target.value)}
          />
        </Box>

        <div style={{ overflowX: "auto", marginTop: "20px", marginInline: "12px" }}>
          {error && <div style={{ color: "red", padding: "8px" }}>{error}</div>}
          {loading && <div style={{ padding: "8px" }}>Loading...</div>}
          {!loading && !error && (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #ddd", padding: "10px" }}>#</th>
                  <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                  <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
                  <th style={{ border: "1px solid #ddd", padding: "10px" }}>Address</th>
                </tr>
              </thead>

              <tbody>
                {filteredAhevaals.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.phone}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.address || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div >

      {showAddSupervisor && (
        <AddMemberModal
          modal={showAddSupervisor}
          setModal={setShowAddSupervisor}
          onSuccess={fetchAhevaals}
        />
      )}
    </>
  )
}

export default TeamHome
