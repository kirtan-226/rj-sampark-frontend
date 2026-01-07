import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import { BACKEND_ENDPOINT, getAuthToken } from "../api/api";
import AddMemberModal from "../components/AddMemberModal";
import { Button } from "reactstrap";
import AddMemberBySanchalakModal from "../components/AddMemberBySanchalakModal";

export default function SamparkYuvakDetailsTeamWise() {
  const [openTeam, setOpenTeam] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddSamparkDetails, setShowAddSamparkDetails] = useState(false);

  const sevakDetails = (() => {
    try {
      return JSON.parse(localStorage.getItem("sevakDetails") || "{}");
    } catch {
      return {};
    }
  })();
  const mandalId = sevakDetails?.mandal_id || sevakDetails?.mandalId || null;

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const toggleOpen = (teamId) => setOpenTeam(openTeam === teamId ? null : teamId);

  const fetchTeamsWithAhevaals = async () => {
    if (!mandalId) {
      setError("Mandal not set for current user");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const resTeams = await axios.get(`${BACKEND_ENDPOINT}teams/mandal/${mandalId}`);
      const teamList = Array.isArray(resTeams.data) ? resTeams.data : [];

      const enriched = await Promise.all(
        teamList.map(async (t) => {
          try {
            const resA = await axios.get(`${BACKEND_ENDPOINT}ahevaals/mandal`, {
              params: { teamId: t._id },
            });
            const ahevaals = Array.isArray(resA.data) ? resA.data : [];
            return { ...t, ahevaals };
          } catch (err) {
            console.error("ahevaal fetch error", err);
            return { ...t, ahevaals: [] };
          }
        })
      );
      setTeams(enriched);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to load teams";
      setError(msg);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
    axios.defaults.baseURL = BACKEND_ENDPOINT;
    fetchTeamsWithAhevaals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSamparkDetails = () => setShowAddSamparkDetails(true);

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          marginInline: "15px",
        }}
      >
        <h5 style={{ margin: 0, whiteSpace: "nowrap", marginLeft: "10px" }}>
          Sampark Details
        </h5>
        <Button color="warning" onClick={handleAddSamparkDetails}>
          <span style={{ whiteSpace: "nowrap" }}>Add Sampark Details</span>
        </Button>
      </div>

      <div style={{ width: "90%", margin: "auto", marginTop: "30px" }}>
        {error && <div style={{ padding: "10px", color: "#b00020" }}>{error}</div>}
        {loading && <div style={{ padding: "10px" }}>Loading...</div>}

        {!loading &&
          teams.map((team) => {
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
                  {team.teamCode ? `${team.teamCode} - ${team.name}` : team.name || "Team"}
                  <span>{openTeam === key ? "▲" : "▼"}</span>
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
                          <th style={th}>#</th>
                          <th style={th}>Name</th>
                          <th style={th}>Phone</th>
                          <th style={th}>DOB</th>
                          <th style={th}>Sampark Date</th>
                          <th style={th}>Address</th>
                          <th style={th}>Special Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(team.ahevaals || []).map((a, idx) => (
                          <tr key={a._id || idx}>
                            <td style={td}>{idx + 1}</td>
                            <td style={td}>{a.name || "-"}</td>
                            <td style={td}>{a.phone || "-"}</td>
                            <td style={td}>{formatDate(a.dob)}</td>
                            <td style={td}>{formatDate(a.samparkDate || a.createdAt)}</td>
                            <td style={td}>{a.address || "-"}</td>
                            <td style={td}>{a.specialExp || "-"}</td>
                          </tr>
                        ))}
                        {(team.ahevaals || []).length === 0 && (
                          <tr>
                            <td colSpan={7} style={{ ...td, textAlign: "center" }}>
                              No ahevaals for this team.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {showAddSamparkDetails && (
        <AddMemberBySanchalakModal
          modal={showAddSamparkDetails}
          setModal={setShowAddSamparkDetails}
          teams={teams}
          onSuccess={fetchTeamsWithAhevaals}
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
  whiteSpace: "nowrap",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
  textAlign: "center",
  whiteSpace: "nowrap",
};
