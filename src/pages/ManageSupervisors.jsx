import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "reactstrap";
import axios from "axios";
import { Box, TextField } from "@mui/material";
import { toast } from "react-toastify";
import AddSupervisorModal from "../components/AddSupervisorModal";
import Header from "../components/Header";
import { BACKEND_ENDPOINT } from "../api/api";

const ManageSupervisors = () => {
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const [mandals, setMandals] = useState([]);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mandalLookup = useMemo(() => {
    const map = {};
    mandals.forEach((m) => {
      const id = m?._id || m?.id;
      if (id) map[String(id)] = m;
      if (m?.code) map[m.code.toUpperCase()] = m;
    });
    return map;
  }, [mandals]);

  const decoratedRows = useMemo(() => {
    return (rows || []).map((u) => {
      const role = (u?.role || u?.role_code || "").toUpperCase();
      const assigned = role === "NIRIKSHAK"
        ? u.assignedMandals || []
        : u.mandalId
          ? [u.mandalId]
          : [];

      const mandalsForUser = assigned
        .map((id) => {
          const key = typeof id === "object" ? id?._id || id?.id || id : id;
          const mandal =
            mandalLookup[String(key)] ||
            (typeof id === "object" && id?.code ? mandalLookup[id.code.toUpperCase()] : null);
          return mandal?.code || mandal?.name || (key ? String(key) : "");
        })
        .filter(Boolean);

      return {
        ...u,
        _roleLabel: role === "NIRIKSHAK" ? "Nirikshak" : "Sanchalak",
        _mandalLabel: mandalsForUser.length ? mandalsForUser.join(", ") : "-",
      };
    });
  }, [rows, mandalLookup]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return decoratedRows;
    return decoratedRows.filter((u) => {
      return (
        u.name?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.userId?.toLowerCase().includes(q) ||
        u._mandalLabel?.toLowerCase().includes(q) ||
        u._roleLabel?.toLowerCase().includes(q)
      );
    });
  }, [decoratedRows, query]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
      axios.defaults.baseURL = BACKEND_ENDPOINT;

      const [mandalsRes, sanchalakRes, nirikshakRes] = await Promise.all([
        axios.get(`${BACKEND_ENDPOINT}mandals`),
        axios.get(`${BACKEND_ENDPOINT}users`, { params: { role: "SANCHALAK" } }),
        axios.get(`${BACKEND_ENDPOINT}users`, { params: { role: "NIRIKSHAK" } }),
      ]);

      setMandals(Array.isArray(mandalsRes.data) ? mandalsRes.data : []);
      const combined = [...(sanchalakRes.data || []), ...(nirikshakRes.data || [])];
      const seen = new Set();
      const unique = combined.filter((u) => {
        const id = u?._id || u?.id || u?.userId;
        if (!id) return true;
        const key = String(id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setRows(unique);
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to load supervisors";
      setError(message);
      toast.error(message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showAddSupervisor]);

  const handleAddSupervisor = () => setShowAddSupervisor(true);

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 0 10px 0",
          }}
        >
          <h5 style={{ margin: 0 }}>Manage Supervisors</h5>

          <Button color="warning" onClick={handleAddSupervisor}>
            Add Supervisor
          </Button>
        </div>

        <Box my={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, phone, role or mandal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>

        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Sevak ID</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Name</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Role</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Mandal(s)</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Phone</th>
                <th style={{ border: "1px solid #ddd", padding: "10px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} style={{ padding: "12px", textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={6} style={{ padding: "12px", textAlign: "center", color: "red" }}>
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "12px", textAlign: "center" }}>
                    No supervisors found
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredRows.map((row) => (
                  <tr key={row._id || row.id || row.userId}>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{row.userId || "-"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{row.name || "-"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{row._roleLabel}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{row._mandalLabel}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>{row.phone || "-"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                      <FaEdit
                        style={{ cursor: "pointer", marginRight: "15px" }}
                        size={18}
                        color="green"
                        onClick={() => toast.info("Update coming soon")}
                      />
                      <FaTrash
                        style={{ cursor: "pointer" }}
                        size={18}
                        color="red"
                        onClick={() => toast.info("Delete coming soon")}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddSupervisor && (
        <AddSupervisorModal
          modal={showAddSupervisor}
          setModal={setShowAddSupervisor}
          onCreated={loadData}
        />
      )}
    </>
  );
};

export default ManageSupervisors;
