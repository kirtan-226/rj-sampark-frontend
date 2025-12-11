import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import { Button } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';
import CreateTeamModal from '../components/CreateTeamModal';
import axios from 'axios';
import { BACKEND_ENDPOINT } from '../api/api';

const ManageMandalTeams = () => {

    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
        const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId;
        const token = localStorage.getItem("authToken");
        if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
        axios.defaults.baseURL = BACKEND_ENDPOINT;

        if (!mandalId) {
            setError("Mandal not set");
            return;
        }

        const fetchTeams = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${BACKEND_ENDPOINT}teams/mandal/${mandalId}`);
                setTeams(res.data || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to load teams");
                setTeams([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [showCreateTeam]);

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
            <SupervisorTeams teams={teams} loading={loading} error={error} />

            {showCreateTeam && (
                <CreateTeamModal modal={showCreateTeam} setModal={setShowCreateTeam} />
            )}
        </>
    )
}

export default ManageMandalTeams
