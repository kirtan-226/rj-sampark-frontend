import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../api/api";
import EditMandalYuvakModal from "./EditMandalYuvakModal";

export default function SupervisorTeams({ teams = [], loading = false, error = "", refreshTeams }) {
  const [openTeam, setOpenTeam] = useState(null);
  const [qSevak, setQSevak] = useState("");
  const [editMember, setEditMember] = useState(null);

  const sevakDetails = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const role = (sevakDetails?.role || sevakDetails?.role_code || "").toUpperCase();
  const isAdmin = role === "ADMIN";
  const isSanchalak = role === "SANCHALAK";

  const toggleOpen = (teamId) => setOpenTeam(openTeam === teamId ? null : teamId);

  const filteredTeams = useMemo(() => {
    const query = qSevak.trim().toLowerCase();
    if (!query) return teams;
    return teams
      .map((team) => ({
        ...team,
        members: (team.members || []).filter(
          (m) =>
            m.name?.toLowerCase().includes(query) ||
            m.userId?.toLowerCase().includes(query) ||
            m.phone?.includes(query)
        ),
      }))
      .filter(
        (team) =>
          team.members.length > 0 ||
          team.name?.toLowerCase().includes(query) ||
          team.teamCode?.toLowerCase().includes(query)
      );
  }, [teams, qSevak]);

  const handleDeleteTeam = async (team) => {
    if (!team?._id) return;
    const confirm = window.confirm(`Delete team ${team.name || team.teamCode || ""}?`);
    if (!confirm) return;
    try {
      await axios.delete(`${BACKEND_ENDPOINT}teams/${team._id}`);
      if (typeof refreshTeams === "function") refreshTeams();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to delete team");
    }
  };

  const handleSetLeader = async (teamId, memberId) => {
    try {
      const res = await axios.patch(`${BACKEND_ENDPOINT}teams/${teamId}`, {
        leader: memberId,
      });
      console.log("Set leader response:", res.data);
      if (typeof refreshTeams === "function") refreshTeams();
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to update leader");
    }
  };

  return (
    <>
      <div style={{ width: "90%", margin: "auto", marginTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0 }}>Teams</h4>
          <input
            type="text"
            placeholder="Search team/member..."
            value={qSevak}
            onChange={(e) => setQSevak(e.target.value)}
            style={{
              width: "260px",
              padding: "8px 10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {error && (
          <div style={{ padding: "12px", color: "red", border: "1px solid #f0c5c5", borderRadius: "6px" }}>
            {error}
          </div>
        )}
        {loading && (
          <div style={{ padding: "12px", textAlign: "center", border: "1px solid #eee", borderRadius: "6px" }}>
            Loading teams...
          </div>
        )}
        {!loading && !error && filteredTeams.length === 0 && (
          <div style={{ padding: "12px", textAlign: "center", border: "1px solid #eee", borderRadius: "6px" }}>
            No teams found
          </div>
        )}

        {filteredTeams.map((team) => {
          const key = team._id || team.teamCode || team.name;
          return (
            <div
              key={key}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "12px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <div
                onClick={() => toggleOpen(key)}
                style={{
                  padding: "12px 16px",
                  fontWeight: "600",
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  background: "#fafafa",
                  fontSize: "17px",
                }}
              >
                <span>
                  {team.teamCode ? `${team.teamCode} - ` : ""}
                  {team.name || "Team"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {(isAdmin || isSanchalak) && (
                    <FaTrash
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team);
                      }}
                      title="Delete team"
                    />
                  )}
                  {openTeam === key ? "▲" : "▼"}
                </span>
              </div>

              {openTeam === key && (
                <div style={{ padding: "12px", overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        <th style={th}>Name</th>
                        <th style={th}>Phone</th>
                        <th style={th}>Leader</th>
                        {(isAdmin || isSanchalak) ? <th style={th}>Actions</th> : null}
                      </tr>
                    </thead>

                    <tbody>
                      {(team.members || []).map((m) => {
                        const memberId = typeof m === "string" ? m : m._id;
                        const leaderId =
                          typeof team.leader === "string" ? team.leader : team.leader?._id;

                        const isLeader =
                          leaderId && memberId && leaderId.toString() === memberId.toString();

                        return (
                          <tr key={memberId}>
                            <td style={td}>{typeof m === "object" ? m.name : "-"}</td>
                            <td style={td}>{typeof m === "object" ? m.phone : "-"}</td>
                            <td style={td}>{isLeader ? "Yes" : "No"}</td>

                            {(isAdmin || isSanchalak) && (
                              <td
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "10px",
                                  textAlign: "center",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <FaEdit
                                  style={{ cursor: "pointer", marginRight: "12px" }}
                                  size={18}
                                  color="green"
                                  title="Edit member"
                                  onClick={() => {
                                    setEditMember({ ...m, teamId: team._id, });
                                  }}
                                />

                                {!isLeader && (
                                  <button
                                    onClick={() => handleSetLeader(team._id, memberId)}
                                    style={{ padding: "6px 10px", cursor: "pointer" }}
                                    title="Make Leader"
                                  >
                                    Make Leader
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editMember && (
        <EditMandalYuvakModal
          modal={Boolean(editMember)}
          setModal={() => setEditMember(null)}
          user={editMember}
          teams={teams}
          onSuccess={() => {
            setEditMember(null);
            if (typeof refreshTeams === "function") refreshTeams();
          }}
        />
      )}
    </>
  );
}

const th = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  fontSize: "14px",
  textAlign: "center",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
  textAlign: "center",
};
