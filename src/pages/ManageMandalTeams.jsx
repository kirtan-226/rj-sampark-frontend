import React, { useEffect, useState, useCallback } from 'react'
import Header from '../components/Header';
import { Button } from 'reactstrap';
import SupervisorTeams from '../components/SupervisorTeams';
import CreateTeamModal from '../components/CreateTeamModal';
import AddMandalYuvakModal from '../components/AddMandalYuvakModal';
import axios from 'axios';
import { BACKEND_ENDPOINT } from '../api/api';
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
        const token = localStorage.getItem("authToken");
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
                    <Button color="primary" outline onClick={() => setShowAddYuvak(true)}>
                        <span style={{ whiteSpace: "nowrap" }}>Add Yuvak</span>
                    </Button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", margin: "20px 15px" }}>
                <div
                    style={{
                        minHeight: "190px",
                        borderRadius: "12px",
                        padding: "16px",
                        background: "linear-gradient(135deg, #f78ca0, #f9748f, #fd868c, #fe9a8b)",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <h5 style={{ margin: 0 }}>Team &amp; Yuvak</h5>
                        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>Add yuvaks, create teams, assign yuvaks to teams.</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Button size="sm" color="light" onClick={() => setShowAddYuvak(true)} style={{ color: "#d93f3f", fontWeight: 600 }}>
                            Add Yuvak
                        </Button>
                        <Button size="sm" color="light" onClick={handleTeamCreation} style={{ color: "#d93f3f", fontWeight: 600 }}>
                            Create Team
                        </Button>
                    </div>
                </div>

                <div
                    style={{
                        minHeight: "190px",
                        borderRadius: "12px",
                        padding: "16px",
                        background: "linear-gradient(135deg, #6dd5fa, #2980b9)",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.12)"
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <h5 style={{ margin: 0 }}>Team Ahevaals</h5>
                        <p style={{ margin: "6px 0 0", opacity: 0.9 }}>View ahevaals submitted by teams, grouped team-wise.</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Button size="sm" color="light" onClick={() => navigate("/sampark-yuvak-team-wise")} style={{ color: "#1f4f86", fontWeight: 600 }}>
                            View Team Ahevaals
                        </Button>
                    </div>
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
