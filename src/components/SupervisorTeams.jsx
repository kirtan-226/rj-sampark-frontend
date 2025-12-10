import React, { useMemo, useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditMandalYuvakModal from "./EditMandalYuvakModal";

export default function SupervisorTeams({ teams = [], loading = false, error = "" }) {
  const [openTeam, setOpenTeam] = useState(null);
  const [showEditMember, setShowEditMember] = useState(false);
  const [qSevak, setQSevak] = useState("");

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

        {filteredTeams.map((team) => (
          <div
            key={team._id || team.teamCode || team.name}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "12px",
              background: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <div
              onClick={() => toggleOpen(team._id || team.teamCode || team.name)}
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
              <span>{openTeam === (team._id || team.teamCode || team.name) ? "-" : "+"}</span>
            </div>

            {openTeam === (team._id || team.teamCode || team.name) && (
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
                      {isAdmin || isSanchalak ? <th style={th}>Actions</th> : null}
                    </tr>
                  </thead>

                  <tbody>
                    {(team.members || []).map((m) => (
                      <tr key={m._id || m.userId || m.name}>
                        <td style={td}>{m.name || m.userId || "-"}</td>
                        <td style={td}>{m.phone || "-"}</td>
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
                              style={{
                                cursor: "pointer",
                              }}
                              size={18}
                              color="green"
                              onClick={() => setShowEditMember(true)}
                            />
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

      {showEditMember && <EditMandalYuvakModal modal={showEditMember} setModal={setShowEditMember} />}
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
