import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FaPlus, FaTrash } from "react-icons/fa";

function CreateTeamModal({ modal, setModal }) {

  const me = JSON.parse(localStorage.getItem("sevakDetails")) || {};
  const isSanchalak = (me.role || "").toUpperCase() === "SANCHALAK";
  const token = localStorage.getItem("authToken");
  if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
  axios.defaults.baseURL = BACKEND_ENDPOINT;

  const [loader, setLoader] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    members: [{ memberId: "" }],
  });
  const [errors, setErrors] = useState({});
  const [createdCreds, setCreatedCreds] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);
  const toggle = () => setModal(!modal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mandalId = me?.mandal_id || me?.mandalId;
        if (!mandalId) return;

        const [membersRes, teamsRes, mandalsRes] = await Promise.all([
          axios.get(`${BACKEND_ENDPOINT}users`, { params: { mandalId, role: "KARYAKAR" } }),
          axios.get(`${BACKEND_ENDPOINT}teams`, { params: { mandalId } }),
          axios.get(`${BACKEND_ENDPOINT}mandals`, {}),
        ]);

        const list = (membersRes.data || []).filter((u) => !u.teamId);
        setAvailableMembers(list);

        const teams = Array.isArray(teamsRes.data) ? teamsRes.data : [];
        const mandals = Array.isArray(mandalsRes.data) ? mandalsRes.data : [];
        const mandalCode =
          mandals.find((m) => m._id === mandalId)?.code ||
          mandals.find((m) => String(m._id) === String(mandalId))?.code ||
          "";

        const letterToNumber = (letters = "") =>
          letters
            .toUpperCase()
            .split("")
            .reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0);
        const numberToLetter = (num) => {
          let n = num;
          let out = "";
          while (n > 0) {
            const rem = (n - 1) % 26;
            out = String.fromCharCode(65 + rem) + out;
            n = Math.floor((n - 1) / 26);
          }
          return out || "A";
        };

        let maxSeq = 0;
        if (mandalCode) {
          const regex = new RegExp(`^${mandalCode}_([A-Z]+)$`, "i");
          teams.forEach((t) => {
            const match = (t.name || "").match(regex);
            if (match && match[1]) {
              const seq = letterToNumber(match[1]);
              if (seq > maxSeq) maxSeq = seq;
            }
          });
        }
        const nextName =
          mandalCode && `${mandalCode}_${numberToLetter(maxSeq + 1 || 1)}`;
        if (nextName) {
          setSuggestedName(nextName);
          setFormData((p) => ({ ...p, name: nextName }));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load data");
      }
    };
    if (modal) {
      fetchData();
    }
  }, [modal]);

  const handleMemberSelect = (index, memberId) => {
    const members = [...formData.members];
    members[index] = { memberId };
    setFormData((p) => ({ ...p, members }));
  };

  const addMemberRow = () => {
    setFormData((p) => ({ ...p, members: [...p.members, { memberId: "" }] }));
  };

  const removeMemberRow = (idx) => {
    setFormData((p) => ({ ...p, members: p.members.filter((_, i) => i !== idx) }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name) errs.name = "Enter team name";
    const memberErrors = [];
    const seen = new Set();
    formData.members.forEach((m, i) => {
      const errsForRow = {};
      if (!m.memberId) errsForRow.memberId = "Select a member";
      if (m.memberId && seen.has(m.memberId)) errsForRow.memberId = "Already selected";
      if (m.memberId) seen.add(m.memberId);
      if (Object.keys(errsForRow).length) memberErrors[i] = errsForRow;
    });
    if (memberErrors.length) errs.members = memberErrors;
    if (formData.members.length === 0) errs.members = [{ memberId: "Add at least one member" }];

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoader(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoader(false);
      return;
    }

    try {
      const mandalId = me?.mandal_id || me?.mandalId;
      if (!mandalId) {
        toast.error("Mandal not set for current user");
        setLoader(false);
        return;
      }

      const selectedExisting = formData.members
        .map((m) => m.memberId)
        .filter((id) => Boolean(id));

      const payload = {
        name: (formData.name || suggestedName || "").trim(),
        existingMemberIds: selectedExisting,
        // keep alias to support older API versions that expect existingMembers
        existingMembers: selectedExisting,
        members: [], // no new members created from modal; only attach existing
        mandalId,
      };

      const res = await axios.post(`${BACKEND_ENDPOINT}teams`, payload);
      const info = res.data || {};
      const leaderId = info.team?.leader;
      const createdMembers = info.members || [];
      const existingMembers = info.existingMembers || [];
      const memberCredentials = info.memberCredentials || [];
      const computePasswordFromPhone = (phone) => {
        if (!phone) return null;
        const digits = String(phone).replace(/\D/g, "");
        return digits.slice(-6) || null;
      };
      const leaderUser = [...createdMembers, ...existingMembers].find(
        (u) => String(u._id) === String(leaderId)
      );
      let leaderCredential =
        memberCredentials.find((c) => c.userId === leaderUser?.userId) || null;
      if (!leaderCredential && leaderUser) {
        leaderCredential = {
          userId: leaderUser.userId,
          password: computePasswordFromPhone(leaderUser.phone),
          name: leaderUser.name,
          phone: leaderUser.phone,
        };
      }

      setCreatedCreds({
        teamCode: info.team?.teamCode,
        leaderCredential,
      });
      toast.success("Team created");
      // reset form for next use
      setFormData({ name: "", members: [{ memberId: "" }] });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to create team";
      toast.error(msg);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>Create Team</ModalHeader>
        <ModalBody>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Team Name"
              value={formData.name}
              onChange={(e) =>
                isSanchalak
                  ? null
                  : setFormData((p) => ({ ...p, name: e.target.value }))
              }
              variant="outlined"
              color="secondary"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              InputProps={{ readOnly: isSanchalak }}
            />
          </FormControl>

          <div style={{ marginTop: "10px", marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h6 style={{ margin: 0 }}>Members (name & phone)</h6>
            <Tooltip title="Add member">
              <IconButton size="small" color="primary" onClick={addMemberRow}>
                <FaPlus />
              </IconButton>
            </Tooltip>
          </div>

          {formData.members.map((m, idx) => {
            const selected = availableMembers.find((a) => a._id === m.memberId);
            return (
              <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                <TextField
                  select
                  label="Select member"
                  value={m.memberId}
                  onChange={(e) => handleMemberSelect(idx, e.target.value)}
                  error={Boolean(errors.members?.[idx]?.memberId)}
                  helperText={errors.members?.[idx]?.memberId}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="">-- choose unassigned member --</option>
                  {availableMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.phone})
                    </option>
                  ))}
                </TextField>
                {selected && (
                  <div style={{ minWidth: "140px", fontSize: "0.85rem", color: "#555" }}>
                    <div>{selected.userId}</div>
                  </div>
                )}
                {formData.members.length > 1 && (
                  <IconButton color="error" onClick={() => removeMemberRow(idx)}>
                    <FaTrash />
                  </IconButton>
                )}
              </div>
            );
          })}

          {!availableMembers.length && (
            <div style={{ fontSize: "0.9rem", color: "#777", marginBottom: "8px" }}>
              No unassigned members found for this mandal.
            </div>
          )}

          {createdCreds && (
            <div style={{ marginTop: "12px", padding: "10px", border: "1px solid #eee", borderRadius: "8px", background: "#fafafa" }}>
              <strong>Team Created:</strong> {createdCreds.teamCode || "-"}
              <div style={{ marginTop: "6px" }}>
                Leader login:
                {createdCreds.leaderCredential ? (
                  <span style={{ marginLeft: "6px" }}>
                    <code>{createdCreds.leaderCredential.userId}</code>
                    {" / "}
                    <code>{createdCreds.leaderCredential.password || "password unavailable"}</code>
                  </span>
                ) : (
                  <span style={{ marginLeft: "6px", color: "#777" }}>Unavailable</span>
                )}
              </div>
            </div>
          )}

        </ModalBody>

        <ModalFooter>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={loader}
          >
            {loader ? <CircularProgress size={24} /> : "Add"}
          </Button>
          <Button
            color="error"
            style={{ margin: "10px" }}
            variant="contained"
            onClick={toggle}
            disabled={loader}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* keep if you don’t already have a global container */}
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default CreateTeamModal;
