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
  const token = localStorage.getItem("authToken");
  if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
  axios.defaults.baseURL = BACKEND_ENDPOINT;

  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    members: [{ name: "", phone: "" }],
  });
  const [errors, setErrors] = useState({});
  const [createdCreds, setCreatedCreds] = useState(null);
  const toggle = () => setModal(!modal);

  const PHONE_REGEX = /^[0-9]*$/;
  const handleChange = (index, field, value) => {
    if (!PHONE_REGEX.test(value)) return;

    if (value.length > 10) return;
    const members = [...formData.members];
    members[index] = { ...members[index], [field]: value };
    setFormData((p) => ({ ...p, members }));
  };

  const addMemberRow = () => {
    setFormData((p) => ({ ...p, members: [...p.members, { name: "", phone: "" }] }));
  };

  const removeMemberRow = (idx) => {
    setFormData((p) => ({ ...p, members: p.members.filter((_, i) => i !== idx) }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name) errs.name = "Enter team name";
    const memberErrors = [];
    formData.members.forEach((m, i) => {
      const errsForRow = {};
      if (!m.name) errsForRow.name = "Enter name";
      if (!m.phone) errsForRow.phone = "Enter phone";
      if (Object.keys(errsForRow).length) memberErrors[i] = errsForRow;
    });
    if (memberErrors.length) errs.members = memberErrors;
    if (formData.members.length === 0) errs.members = [{ name: "Add at least one member" }];

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const payload = {
        name: formData.name.trim(),
        members: formData.members.map((m) => ({ name: m.name.trim(), phone: m.phone.trim() })),
        mandalId,
      };

      const res = await axios.post(`${BACKEND_ENDPOINT}teams`, payload);
      const info = res.data || {};
      setCreatedCreds({
        teamLogin: info.teamLogin,
        memberCredentials: info.memberCredentials || [],
        teamCode: info.team?.teamCode,
      });
      toast.success("Team created");
      // reset form for next use
      setFormData({ name: "", members: [{ name: "", phone: "" }] });
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
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              variant="outlined"
              color="secondary"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
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

          {formData.members.map((m, idx) => (
            <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
              <TextField
                label="Name"
                value={m.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                error={Boolean(errors.members?.[idx]?.name)}
                helperText={errors.members?.[idx]?.name}
                fullWidth
              />
              <TextField
                label="Phone"
                value={m.phone}
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

          {createdCreds && (
            <div style={{ marginTop: "12px", padding: "10px", border: "1px solid #eee", borderRadius: "8px", background: "#fafafa" }}>
              <strong>Team Created:</strong> {createdCreds.teamCode || "-"}
              <div>Team login: <code>{createdCreds.teamLogin?.userId}</code> / <code>{createdCreds.teamLogin?.password}</code></div>
              <div style={{ marginTop: "6px" }}>
                Member logins:
                <ul style={{ marginBottom: 0, paddingLeft: "18px" }}>
                  {(createdCreds.memberCredentials || []).map((c) => (
                    <li key={c.userId}>
                      {c.name} - <code>{c.userId}</code> / <code>{c.password}</code> ({c.phone})
                    </li>
                  ))}
                </ul>
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
