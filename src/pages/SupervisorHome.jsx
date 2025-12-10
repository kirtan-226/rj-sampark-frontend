import React, { useState } from 'react'
import Header from '../components/Header'
import { Button } from 'reactstrap';
import LeaderTeams from '../components/SupervisorTeams';
import CreateTeamModal from '../components/CreateTeamModal';
import AddSamparkSevakModal from '../components/AddSamparkSevakModal';
import { Grid, Paper, Typography } from '@mui/material';
import SupervisorMandals from '../components/SupervisorMandals';

const SupervisorHome = () => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  let formTarget = {
    total_target: 250,
    total_filled_form: 121,
    no_of_teams: 12,
    seva_thousand: 50000,
    seva_other: 15000
  };

  const handleAddMember = () => setShowAddMember(true);

  const handleCreateTeam = () => setShowCreateTeam(true);

  return (
    <>
      <Header />

      {/* Stats boxes */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Target
            </Typography>
            <Typography variant="h6">
              {formTarget?.total_target ?? 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Row with 4 cards */}
      <Grid container spacing={2} mb={2}>

        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Filled Forms
            </Typography>
            <Typography variant="h6">
              {formTarget?.total_filled_form ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Teams
            </Typography>
            <Typography variant="h6">
              {formTarget?.no_of_teams ?? 0}
            </Typography>
          </Paper>
        </Grid>

      </Grid>

      <div
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center"
        }}
      >
        <Button style={{ flex: "1 1 calc(25% - 10px)", whiteSpace: "nowrap" }} color="warning" onClick={handleAddMember}>
          Add Sampark Sevak
        </Button>
        <Button style={{ flex: "1 1 calc(25% - 10px)", whiteSpace: "nowrap" }} color="warning" onClick={handleCreateTeam}>
          Create Team
        </Button>
      </div>

      <div>
        {/* <LeaderTeams /> */}
        <SupervisorMandals />
      </div>

      {showAddMember && (
        <AddSamparkSevakModal modal={showAddMember} setModal={setShowAddMember} />
      )}

      {showCreateTeam && (
        <CreateTeamModal modal={showCreateTeam} setModal={setShowCreateTeam} />
      )}
    </>
  )
}

export default SupervisorHome