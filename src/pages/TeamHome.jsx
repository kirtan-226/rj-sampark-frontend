import React, { useState } from 'react'
import Header from '../components/Header'
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import AddSupervisorModal from '../components/AddSupervisorModal';
import ListingTable from '../components/ListingTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AddMemberModal from '../components/AddMemberModal';
import { ProgressBar } from 'react-bootstrap';
import { Box, Chip, TextField } from '@mui/material';

const TeamHome = () => {

  const navigate = useNavigate();
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const [qMandal, setQMandal] = useState("");

  const handleAddSupervisor = () => setShowAddSupervisor(true);

  let sevak_target = 45;
  let achievedTarget = 2;
  const progress = sevak_target > 0 ? (achievedTarget / sevak_target) * 100 : 0;
  const progressClamped = Math.max(0, Math.min(100, Math.round(progress)));

  const showUpdateSupervisorModal = () => {
    alert("Update Supervisor clicked");
  }

  const showDeleteSupervisorModal = () => {
    alert("Delete Supervisor clicked");
  }

  return (
    <>
      <Header />

      <div
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
      </div>

      <Chip
        label="Team A"
        sx={{
          fontSize: "1.2rem",
          padding: "16px 28px",
          height: "45px",
          margin: "20px 12px",
        }}
      />

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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Address</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>DOB</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>1</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Ravi Patel</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>B14 Tulsidham Society 390011</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>12-04-2000</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>9876543210</td>
              </tr>

              <tr>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>2</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>Aryan Vyas</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>A-22 Opp. Jay Ambe School 390011</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>05-06-1997</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>8765432109</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div >

      {showAddSupervisor && (
        <AddMemberModal modal={showAddSupervisor} setModal={setShowAddSupervisor} />
      )}
    </>
  )
}

export default TeamHome