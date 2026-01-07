import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT, getAuthToken } from "../api/api";
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
  const token = getAuthToken();
  if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
  axios.defaults.baseURL = BACKEND_ENDPOINT;

  const REQUIRED_MEMBER_COUNT = 4;
  const buildEmptyRow = (useExisting) =>
    useExisting ? { memberId: "" } : { name: "", phone: "" };
  const buildEmptyMembers = (useExisting) =>
    Array.from({ length: REQUIRED_MEMBER_COUNT }, () => ({ ...buildEmptyRow(useExisting) }));

  const [loader, setLoader] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    members: buildEmptyMembers(false),
  });
  const [errors, setErrors] = useState({});
  const [createdCreds, setCreatedCreds] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);
  const toggle = () => setModal(!modal);
  const usingExistingMembers = availableMembers.length > 0;
  const PHONE_REGEX = /^[0-9]*$/;

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

  const normalizeMembers = (members, useExisting) => {
    const normalized = (members || []).map((m) =>
      useExisting ? { memberId: m.memberId || "" } : { name: m.name || "", phone: m.phone || "" }
    );
    const trimmed = normalized.slice(0, REQUIRED_MEMBER_COUNT);
    while (trimmed.length < REQUIRED_MEMBER_COUNT) trimmed.push({ ...buildEmptyRow(useExisting) });
    return trimmed;
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      members: normalizeMembers(prev.members, usingExistingMembers),
    }));
  }, [usingExistingMembers]);

  const handleMemberSelect = (index, memberId) => {
    const members = [...formData.members];
    members[index] = { memberId };
    setFormData((p) => ({ ...p, members }));
  };

  const handleChange = (index, field, value) => {
    if (field === "phone") {
      if (!PHONE_REGEX.test(value)) return;
      if (value.length > 10) return;
    }
    const members = [...formData.members];
    members[index] = { ...members[index], [field]: value };
    setFormData((p) => ({ ...p, members }));
  };

  const addMemberRow = () => {
    if (formData.members.length >= REQUIRED_MEMBER_COUNT) {
      setErrors((p) => ({
        ...p,
        memberCount: `Team must have exactly ${REQUIRED_MEMBER_COUNT} members`,
      }));
      return;
    }
    const newRow = usingExistingMembers ? { memberId: "" } : { name: "", phone: "" };
    setFormData((p) => ({ ...p, members: [...p.members, { ...newRow }] }));
  };

  const removeMemberRow = (idx) => {
    setFormData((p) => ({ ...p, members: p.members.filter((_, i) => i !== idx) }));
  };

  const validateForm = () => {
    const errs = {};
    const memberErrors = [];
    const teamName = (formData.name || suggestedName || "").trim();
    if (!teamName) errs.name = "Enter team name";

    if (formData.members.length !== REQUIRED_MEMBER_COUNT) {
      errs.memberCount = `Team must have exactly ${REQUIRED_MEMBER_COUNT} members`;
    }

    if (!formData.members.length) {
      errs.members = [{ memberId: "Add at least one member" }];
      return errs;
    }

    if (usingExistingMembers) {
      const seen = new Set();
      formData.members.forEach((m, i) => {
        const rowErr = {};
        if (!m.memberId) rowErr.memberId = "Select a member";
        if (m.memberId && seen.has(m.memberId)) rowErr.memberId = "Already selected";
        if (m.memberId) seen.add(m.memberId);
        if (Object.keys(rowErr).length) memberErrors[i] = rowErr;
      });
    } else {
      const phoneSet = new Set();
      formData.members.forEach((m, i) => {
        const rowErr = {};
        const name = (m.name || "").trim();
        const phone = (m.phone || "").trim();
        if (!name) rowErr.name = "Enter name";
        if (!phone) rowErr.phone = "Enter phone";
        else if (phone.length !== 10) rowErr.phone = "Phone must be exactly 10 digits";
        if (phone) {
          if (phoneSet.has(phone)) {
            rowErr.phone = "Duplicate phone";
          }
          phoneSet.add(phone);
        }
        if (Object.keys(rowErr).length) memberErrors[i] = rowErr;
      });
    }

    if (memberErrors.length) errs.members = memberErrors;
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

      const selectedExisting = usingExistingMembers
        ? formData.members.map((m) => m.memberId).filter(Boolean)
        : [];
      const newMembers = usingExistingMembers
        ? []
        : formData.members.map((m) => ({
            name: (m.name || "").trim(),
            phone: (m.phone || "").trim(),
          }));

      const payload = {
        name: (formData.name || suggestedName || "").trim(),
        existingMemberIds: selectedExisting,
        existingMembers: selectedExisting,
        members: newMembers,
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

      setFormData({
        name: isSanchalak ? suggestedName : "",
        members: buildEmptyMembers(usingExistingMembers),
      });
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
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <h6 style={{ margin: 0 }}>Members (name & phone)</h6>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>
                {formData.members.length}/{REQUIRED_MEMBER_COUNT} required
              </div>
              {errors.memberCount && (
                <div style={{ color: "red", fontSize: "0.85rem" }}>{errors.memberCount}</div>
              )}
            </div>
            <Tooltip title={formData.members.length >= REQUIRED_MEMBER_COUNT ? "Exactly 4 members are required" : "Add member"}>
              <span>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={addMemberRow}
                  disabled={formData.members.length >= REQUIRED_MEMBER_COUNT}
                >
                  <FaPlus />
                </IconButton>
              </span>
            </Tooltip>
          </div>

          {usingExistingMembers ? (
            formData.members.map((m, idx) => {
              const selected = availableMembers.find((a) => a._id === m.memberId);
              return (
                <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <TextField
                    select
                    // label="Select member"
                    value={m.memberId}
                    onChange={(e) => handleMemberSelect(idx, e.target.value)}
                    error={Boolean(errors.members?.[idx]?.memberId)}
                    helperText={errors.members?.[idx]?.memberId}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value="">-- Choose unassigned member --</option>
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
            })
          ) : (
            <>
              <div style={{ fontSize: "0.9rem", color: "#777", marginBottom: "8px" }}>
                No unassigned members found for this mandal.
              </div>
              {formData.members.map((m, idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <TextField
                    label="Name"
                    value={m.name || ""}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    error={Boolean(errors.members?.[idx]?.name)}
                    helperText={errors.members?.[idx]?.name}
                    fullWidth
                  />
                  <TextField
                    label="Phone"
                    value={m.phone || ""}
                    onChange={(e) => handleChange(idx, "phone", e.target.value)}
                    error={Boolean(errors.members?.[idx]?.phone)}
                    helperText={
                      errors.members?.[idx]?.phone ||
                      (m.phone && m.phone.length !== 10 ? "Phone must be exactly 10 digits" : "")
                    }
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10 }}
                    fullWidth
                  />
                  {formData.members.length > 1 && (
                    <IconButton color="error" onClick={() => removeMemberRow(idx)}>
                      <FaTrash />
                    </IconButton>
                  )}
                </div>
              ))}
            </>
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

      {/* keep if you don't already have a global container */}
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default CreateTeamModal;
