import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import Header from '../components/Header';
import AddMandalYuvakModal from '../components/AddMandalYuvakModal';
import EditMandalYuvakModal from '../components/EditMandalYuvakModal';
import { Box, TextField } from '@mui/material';
import axios from 'axios';
import { BACKEND_ENDPOINT } from '../api/api';
import { toast } from 'react-toastify';

const ManageMandalYuvaks = () => {
    const [showAddSupervisor, setShowAddSupervisor] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [qMandal, setQMandal] = useState("");
    const [rows, setRows] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sevakDetails = (() => {
        try {
            return JSON.parse(localStorage.getItem("sevakDetails") || "{}");
        } catch {
            return {};
        }
    })();
    const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId || "";

    const handleAddSupervisor = () => setShowAddSupervisor(true);

    const handleEdit = (user) => {
        setEditUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (user) => {
        if (!user?._id) return;
        const ok = window.confirm("Delete this yuvak?");
        if (!ok) return;
        try {
            await axios.delete(`${BACKEND_ENDPOINT}users/${user._id}`);
            toast.success("Deleted");
            loadData();
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await axios.get(`${BACKEND_ENDPOINT}users`, {
                params: {
                    role: "KARYAKAR",
                    mandalId: mandalId || undefined,
                }
            });
            setRows(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            const message = err?.response?.data?.message || err.message || "Failed to load yuvaks";
            setError(message);
            toast.error(message);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const loadTeams = async () => {
        try {
            if (!mandalId) return;
            const res = await axios.get(`${BACKEND_ENDPOINT}teams/mandal/${mandalId}`);
            setTeams(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("team load error", err);
            setTeams([]);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
        axios.defaults.baseURL = BACKEND_ENDPOINT;
        loadData();
        loadTeams();
    }, [showAddSupervisor, showEditModal]);

    const filtered = rows.filter((item) => {
        const q = qMandal.trim().toLowerCase();
        if (!q) return true;
        return (
            item.name?.toLowerCase().includes(q) ||
            item.phone?.toLowerCase().includes(q) ||
            item.userId?.toLowerCase().includes(q)
        );
    });

    return (
        <>
            <Header />
            <div style={{ padding: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h5 style={{ margin: 0 }}>Mandal Yuvak</h5>

                    <Button color="warning" onClick={handleAddSupervisor}>
                        Add Mandal Yuvak
                    </Button>
                </div>
                <Box my={2}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search here..."
                        value={qMandal}
                        onChange={(e) => setQMandal(e.target.value)}
                    />
                </Box>
                <div style={{ overflowX: "auto", marginTop: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>ID</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Team</th>
                                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} style={{ padding: "12px", textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: "12px", textAlign: "center" }}>
                                        {error || "No data"}
                                    </td>
                                </tr>
                            )}
                            {!loading && filtered.map((item) => (
                                <tr key={item._id || item.userId}>
                                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.userId || "-"}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.name}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{item.phone}</td>
                                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                        {item.teamId?.name || item.teamId?.teamCode || "Not Assigned"}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                                        <FaEdit
                                            style={{ cursor: "pointer", marginRight: "15px" }}
                                            size={18}
                                            color="green"
                                            title="Edit"
                                            onClick={() => handleEdit(item)}
                                        />
                                        <FaTrash
                                            style={{ cursor: "pointer" }}
                                            size={18}
                                            color="red"
                                            title="Delete"
                                            onClick={() => handleDelete(item)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div >

            {showAddSupervisor && (
                <AddMandalYuvakModal modal={showAddSupervisor} setModal={setShowAddSupervisor} />
            )}
            {showEditModal && editUser && (
                <EditMandalYuvakModal
                    modal={showEditModal}
                    setModal={setShowEditModal}
                    user={editUser}
                    teams={teams}
                    onSuccess={loadData}
                />
            )}
        </>
    )
}

export default ManageMandalYuvaks
