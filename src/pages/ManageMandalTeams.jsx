import React, { useState } from 'react'
import Header from '../components/Header';
import { Button } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';
import CreateTeamModal from '../components/CreateTeamModal';

const ManageMandalTeams = () => {

    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const handleTeamCreation = () => setShowCreateTeam(true);

    return (

        <>
            <Header />
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                marginInline: '15px'
            }}>
                <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>Manage Teams</h5>

                <Button color="warning" onClick={handleTeamCreation}>
                    <span style={{ whiteSpace: "nowrap" }}>Create Team</span>
                </Button>
            </div>
            <SupervisorTeams />

            {showCreateTeam && (
                <CreateTeamModal modal={showCreateTeam} setModal={setShowCreateTeam} />
            )}
        </>
    )
}

export default ManageMandalTeams