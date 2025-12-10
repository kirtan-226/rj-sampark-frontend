import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../components/Header";

export default function ManageTeams() {
    const [openTeam, setOpenTeam] = useState(null);

    const toggleOpen = (teamId) => {
        setOpenTeam(openTeam === teamId ? null : teamId);
    };

    const leaderData = {
        teams: [
            {
                id: 1,
                teamName: "Team A",
                members: [
                    { id: 101, name: "Amit", phone: "9999999999", mandal: "SJ" },
                    { id: 102, name: "Rahul", phone: "8888888888", mandal: "NK" },
                    { id: 103, name: "Kirtan", phone: "7777777777", mandal: "SRB" }
                ]
            },
            {
                id: 2,
                teamName: "Team B",
                members: [
                    { id: 201, name: "Vraj", phone: "9992221110", mandal: "NK" },
                    { id: 202, name: "Dev", phone: "9090909090", mandal: "SRB" }
                ]
            }
        ]
    };

    const showUpdateMemberModal = () => {
        alert("Update Member clicked by admin");
    }

    const showDeleteMemberModal = () => {
        alert("Delete Member clicked");
    }

    return (
        <>
            <Header />
            <div style={{ width: "90%", margin: "auto", marginTop: "30px" }}>

                <h2 style={{ marginBottom: "20px" }}>
                    Manage Teams
                </h2>

                {leaderData.teams.map(team => (
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
                                            <th style={th}>Name</th>
                                            <th style={th}>Phone</th>
                                            <th style={th}>Mandal</th>
                                            <th style={th}>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {team.members.map(m => (
                                            <tr key={m.id}>
                                                <td style={td}>{m.name}</td>
                                                <td style={td}>{m.phone}</td>
                                                <td style={td}>{m.mandal}</td>
                                                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", whiteSpace: "nowrap" }}>
                                                    <FaEdit
                                                        style={{
                                                            cursor: "pointer",
                                                            marginRight: "15px"
                                                        }}
                                                        size={18}
                                                        color="green"
                                                        onClick={showUpdateMemberModal}
                                                    />
                                                    <FaTrash
                                                        style={{ cursor: "pointer" }}
                                                        size={18}
                                                        color="red"
                                                        onClick={showDeleteMemberModal}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

const th = {
    padding: "10px",
    borderBottom: "2px solid #ddd",
    fontSize: "14px",
    textAlign: "center"
};

const td = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    textAlign: "center"
};