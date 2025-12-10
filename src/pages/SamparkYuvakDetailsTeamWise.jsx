import React, { useState } from 'react'
import { FaEdit, FaTrash } from "react-icons/fa";
import EditMemberModal from "../components/EditMandalYuvakModal";
import { teamMandalData, teamSamparkData } from "../api/data";
import EditMandalYuvakModal from "../components/EditMandalYuvakModal";
import Header from '../components/Header';
import EditSamparkYuvakModal from '../components/EditSamparkYuvakModal';

export default function SamparkYuvakDetailsTeamWise() {
    const [openTeam, setOpenTeam] = useState(null);
    const [showEditMember, setShowEditMember] = useState(false);

    const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails"));
    const role = sevakDetails.role;
    const isAdmin = role === "Admin";
    const isSanchalak = role === "Sanchalak";

    const handleEditMember = () => setShowEditMember(true);
    const handleDeleteMember = () => {
        alert("Sure want to remove member from this team ?");
    };

    const toggleOpen = (teamId) => {
        setOpenTeam(openTeam === teamId ? null : teamId);
    };

    const showUpdateMemberModal = () => {
        alert("Update Member clicked");
    }

    const showDeleteMemberModal = () => {
        alert("Delete Member clicked");
    }

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
                <h5 style={{ margin: 0, whiteSpace: "nowrap", marginLeft: "10px" }} >Sampark Yuvak Details</h5>
            </div>

            <div style={{ width: "90%", margin: "auto", marginTop: "30px" }}>

                {teamSamparkData.teams.map(team => (
                    <div
                        key={team.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            marginBottom: "12px",
                            background: "#fff",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div
                            onClick={() => toggleOpen(team.id)}
                            style={{
                                padding: "12px 16px",
                                fontWeight: "600",
                                display: "flex",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                background: "#fafafa",
                                fontSize: "17px"
                            }}
                        >
                            {team.teamName}
                            <span>{openTeam === team.id ? "▲" : "▼"}</span>
                        </div>

                        {openTeam === team.id && (
                            <div style={{ padding: "12px", overflowX: "auto" }}>

                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        textAlign: "left"
                                    }}
                                >
                                    <thead>
                                        <tr style={{ background: "#f5f5f5" }}>
                                            <th style={th}>Id</th>
                                            <th style={th}>Sampark Yuvak Name</th>
                                            <th style={th}>Phone</th>
                                            <th style={th}>DOB</th>
                                            <th style={th}>Address</th>
                                            {(isAdmin || isSanchalak) ? <th style={th}>Actions</th> : null}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {team.members.map(m => (
                                            <tr key={m.id}>
                                                <td style={td}>{m.id}</td>
                                                <td style={td}>{m.name}</td>
                                                <td style={td}>{m.phone}</td>
                                                <td style={td}>{m.dob}</td>
                                                <td style={td}>{m.address}</td>
                                                {(isAdmin || isSanchalak) && (
                                                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", whiteSpace: "nowrap" }}>
                                                        <FaEdit
                                                            style={{
                                                                cursor: "pointer",
                                                                marginRight: "15px"
                                                            }}
                                                            size={18}
                                                            color="green"
                                                            onClick={handleEditMember}
                                                        />
                                                        {isAdmin && (
                                                            <FaTrash
                                                                style={{
                                                                    cursor: "pointer",
                                                                    marginRight: "15px"
                                                                }}
                                                                size={18}
                                                                color="red"
                                                                onClick={handleDeleteMember}
                                                            />
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}
                    </div>
                ))}

            </div>

            {showEditMember && (
                <EditSamparkYuvakModal modal={showEditMember} setModal={setShowEditMember} />
            )}
        </>
    )
}

const th = {
    padding: "10px",
    borderBottom: "2px solid #ddd",
    fontSize: "14px",
    textAlign: "center",
    whiteSpace: "nowrap"
};

const td = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    textAlign: "center",
    whiteSpace: "nowrap"
};