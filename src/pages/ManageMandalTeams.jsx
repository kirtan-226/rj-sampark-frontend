import React, { useEffect, useState, useCallback } from 'react'
import Header from '../components/Header';
import { Button } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';
import CreateTeamModal from '../components/CreateTeamModal';
import AddMandalYuvakModal from '../components/AddMandalYuvakModal';
import axios from 'axios';
import { BACKEND_ENDPOINT, getAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

const ManageMandalTeams = () => {

    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [showAddYuvak, setShowAddYuvak] = useState(false);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId;

    const fetchTeams = useCallback(async () => {
        if (!mandalId) {
            setError("Mandal not set");
            return;
        }
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
    }, [mandalId]);

    useEffect(() => {
        const token = getAuthToken();
        if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
        axios.defaults.baseURL = BACKEND_ENDPOINT;
        fetchTeams();
    }, [fetchTeams, showCreateTeam]);

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

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Button color="warning" onClick={handleTeamCreation}>
                        <span style={{ whiteSpace: "nowrap" }}>Create Team</span>
                    </Button>
                    {/* <Button color="primary" outline onClick={() => setShowAddYuvak(true)}>
                        <span style={{ whiteSpace: "nowrap" }}>Add Yuvak</span>
                    </Button> */}
                </div>
            </div>

            <SupervisorTeams teams={teams} loading={loading} error={error} refreshTeams={fetchTeams} />

            {showCreateTeam && (
                <CreateTeamModal modal={showCreateTeam} setModal={setShowCreateTeam} />
            )}
            {showAddYuvak && (
                <AddMandalYuvakModal modal={showAddYuvak} setModal={setShowAddYuvak} />
            )}
        </>
    )
}

export default ManageMandalTeams
