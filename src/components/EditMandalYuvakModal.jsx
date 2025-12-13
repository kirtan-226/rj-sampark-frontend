import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function EditMandalYuvakModal({ modal, setModal, user, teams = [], onSuccess }) {
  const me = JSON.parse(localStorage.getItem("sevakDetails")) || {};
  const mySevakCode = me?.sevak_code || me?.sevak_id || "";

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    teamId: "",
  });
  const [initialTeamId, setInitialTeamId] = useState("");
  const [replacementDialogOpen, setReplacementDialogOpen] = useState(false);
  const [replacementChoice, setReplacementChoice] = useState("");
  const [replacementMemberId, setReplacementMemberId] = useState("");
  const [memberToRemoveId, setMemberToRemoveId] = useState("");
  const [targetRemovalMemberId, setTargetRemovalMemberId] = useState("");
  const [replacementDecision, setReplacementDecision] = useState(null);
  const [replacementError, setReplacementError] = useState("");
  const [availableUnassigned, setAvailableUnassigned] = useState([]);
  const toggle = () => setModal(!modal);
  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        teamId: user.teamId?._id || user.teamId || "",
      });
      setInitialTeamId(user.teamId?._id || user.teamId || "");
      setReplacementDecision(null);
      setReplacementChoice("");
      setReplacementMemberId("");
      setMemberToRemoveId("");
      setTargetRemovalMemberId("");
      setReplacementError("");
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
    axios.defaults.baseURL = BACKEND_ENDPOINT;
  }, []);

  useEffect(() => {
    const fetchUnassigned = async () => {
      try {
        const mandalId = me?.mandal_id || me?.mandalId || user?.mandal_id || user?.mandalId;
        if (!mandalId || !modal) return;
        const res = await axios.get(`${BACKEND_ENDPOINT}users`, {
          params: { mandalId, role: "KARYAKAR" },
        });
        const list = (res.data || []).filter((u) => !u.teamId);
        setAvailableUnassigned(list);
      } catch (err) {
        console.error("Failed to load unassigned members", err);
        setAvailableUnassigned([]);
      }
    };
    fetchUnassigned();
  }, [modal, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (name === "teamId") {
      const hasTeamChanged = (v || "") !== (initialTeamId || "");
      const nextTeam = teams.find((t) => (t?._id || t?.teamId) === (v || ""));
      const nextMembers = nextTeam?.members || [];
      const alreadyInNext = nextMembers.some(
        (m) => (typeof m === "string" ? m : m?._id)?.toString() === (currentUserId || "").toString()
      );
      const sizeAfterMove =
        (nextMembers.length || 0) + (hasTeamChanged && v ? (alreadyInNext ? 0 : 1) : 0);
      const targetNeedsRemoval = Boolean(hasTeamChanged && v && sizeAfterMove > 4);

      setFormData((p) => ({ ...p, [name]: v }));
      setReplacementDecision(null);
      setReplacementChoice("");
      setReplacementMemberId("");
      setMemberToRemoveId("");
      setTargetRemovalMemberId("");
      setReplacementError("");
      setReplacementDialogOpen(Boolean((hasTeamChanged && initialTeamId) || targetNeedsRemoval));
      return;
    }

    setFormData((p) => ({ ...p, [name]: v }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name) errs.name = "Enter name";
    if (!formData.phone) errs.phone = "Enter phone number";
    return errs;
  };

  const previousTeam = useMemo(
    () => teams.find((t) => (t?._id || t?.teamId) === (initialTeamId || "")),
    [teams, initialTeamId]
  );
  const selectedTeam = useMemo(
    () => teams.find((t) => (t?._id || t?.teamId) === (formData.teamId || "")),
    [teams, formData.teamId]
  );
  const teamChanged = (formData.teamId || "") !== (initialTeamId || "");
  const needsPreviousFill = teamChanged && Boolean(initialTeamId);

  const previousTeamMembers = useMemo(() => {
    const list = previousTeam?.members || [];
    return list
      .map((m) => ({
        id: typeof m === "string" ? m : m?._id,
        name: typeof m === "object" ? m.name : "",
        phone: typeof m === "object" ? m.phone : "",
      }))
      .filter((m) => m.id);
  }, [previousTeam]);

  const remainingPreviousMembers = useMemo(() => {
    const leaderId =
      typeof previousTeam?.leader === "string" ? previousTeam?.leader : previousTeam?.leader?._id;
    return previousTeamMembers.filter((m) => m.id !== currentUserId && m.id !== leaderId);
  }, [previousTeamMembers, previousTeam, currentUserId]);

  const projectedPreviousSize = useMemo(() => {
    const base = Math.max(
      previousTeamMembers.length - (needsPreviousFill ? 1 : 0),
      0
    );
    return base + (replacementMemberId ? 1 : 0);
  }, [previousTeamMembers.length, replacementMemberId, needsPreviousFill]);

  const removalNeeded = needsPreviousFill && projectedPreviousSize > 4;

  const targetTeamMembers = useMemo(() => {
    const list = selectedTeam?.members || [];
    return list
      .map((m) => ({
        id: typeof m === "string" ? m : m?._id,
        name: typeof m === "object" ? m.name : "",
        phone: typeof m === "object" ? m.phone : "",
      }))
      .filter((m) => m.id);
  }, [selectedTeam]);

  const targetLeaderId =
    typeof selectedTeam?.leader === "string" ? selectedTeam?.leader : selectedTeam?.leader?._id;

  const targetRemovableMembers = useMemo(
    () => targetTeamMembers.filter((m) => m.id !== targetLeaderId && m.id !== currentUserId),
    [targetTeamMembers, targetLeaderId, currentUserId]
  );

  const targetTeamSizeAfterMove = useMemo(() => {
    const alreadyInTarget = targetTeamMembers.some(
      (m) => m.id && m.id.toString() === (currentUserId || "").toString()
    );
    return (
      (targetTeamMembers.length || 0) +
      (teamChanged && formData.teamId ? (alreadyInTarget ? 0 : 1) : 0)
    );
  }, [targetTeamMembers, currentUserId, teamChanged, formData.teamId]);

  const targetRemovalNeeded = teamChanged && Boolean(formData.teamId) && targetTeamSizeAfterMove > 4;

  const otherTeamMembers = useMemo(() => {
    const mapped = [];
    teams.forEach((team) => {
      const teamId = team?._id || team?.teamId;
      if (!team?.members || !teamId || teamId === initialTeamId) return;
      team.members.forEach((m) => {
        const memberId = typeof m === "string" ? m : m?._id;
        if (!memberId || memberId === currentUserId) return;
        mapped.push({
          id: memberId,
          name: typeof m === "object" ? m.name : "",
          phone: typeof m === "object" ? m.phone : "",
          teamName: team.teamCode ? `${team.teamCode} - ${team.name}` : team.name || "Team",
        });
      });
    });
    return mapped;
  }, [teams, initialTeamId, currentUserId]);

  const confirmReplacementChoice = () => {
    if (needsPreviousFill && !replacementChoice) {
      setReplacementError("Choose how to add a replacement");
      return;
    }
    if (needsPreviousFill && !replacementMemberId) {
      setReplacementError("Select a member for the previous team");
      return;
    }
    if (removalNeeded && !memberToRemoveId) {
      setReplacementError("Select a member to remove to keep team at 4");
      return;
    }
    if (targetRemovalNeeded && !targetRemovalMemberId) {
      setReplacementError("Select who to remove from the new team");
      return;
    }
    setReplacementDecision({
      type: needsPreviousFill ? replacementChoice : null,
      memberId: needsPreviousFill ? replacementMemberId : null,
      removeMemberId: removalNeeded ? memberToRemoveId : null,
      targetRemoveId: targetRemovalNeeded ? targetRemovalMemberId : null,
    });
    setReplacementDialogOpen(false);
    setReplacementError("");
  };

  const cancelReplacementDialog = () => {
    setReplacementDialogOpen(false);
    setReplacementChoice("");
    setReplacementMemberId("");
    setMemberToRemoveId("");
    setTargetRemovalMemberId("");
    setReplacementDecision(null);
    setFormData((p) => ({ ...p, teamId: initialTeamId || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setReplacementError("");
    setLoader(true);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoader(false);
      return;
    }

    const previousLeaderId =
      typeof previousTeam?.leader === "string" ? previousTeam?.leader : previousTeam?.leader?._id;
    const isCurrentLeader =
      previousLeaderId && currentUserId && previousLeaderId.toString() === currentUserId.toString();

    if (teamChanged && isCurrentLeader) {
      setErrors({ replacement: "Team leader cannot be moved. Assign a new leader first." });
      setLoader(false);
      return;
    }
    if (
      teamChanged &&
      ((needsPreviousFill && !replacementDecision?.memberId) ||
        (targetRemovalNeeded && !replacementDecision?.targetRemoveId))
    ) {
      setErrors({
        replacement:
          "Complete the team adjustments (replacement for old team and removal from new team if needed).",
      });
      setLoader(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        teamId: formData.teamId || null,
      };
      console.log("Updating yuvak with payload:", payload);
      await axios.patch(`${BACKEND_ENDPOINT}users/${user._id}`, payload);
      if (teamChanged && initialTeamId && replacementDecision?.memberId) {
        try {
          await axios.patch(`${BACKEND_ENDPOINT}users/${replacementDecision.memberId}`, {
            teamId: initialTeamId,
          });
          toast.success("Replacement member added to previous team");
        } catch (err) {
          toast.error(err?.response?.data?.message || err.message || "Failed to add replacement");
        }
      }
      if (teamChanged && initialTeamId && replacementDecision?.removeMemberId) {
        try {
          await axios.patch(`${BACKEND_ENDPOINT}users/${replacementDecision.removeMemberId}`, {
            teamId: null,
          });
          toast.success("Removed member to keep team size at 4");
        } catch (err) {
          toast.error(err?.response?.data?.message || err.message || "Failed to remove member");
        }
      }
      if (teamChanged && targetRemovalNeeded && replacementDecision?.targetRemoveId) {
        try {
          await axios.patch(`${BACKEND_ENDPOINT}users/${replacementDecision.targetRemoveId}`, {
            teamId: null,
          });
          toast.success("Removed member from new team to keep size at 4");
        } catch (err) {
          toast.error(err?.response?.data?.message || err.message || "Failed to remove from new team");
        }
      }
      toast.success("Yuvak updated");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoader(false);
      toggle();
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>Edit Mandal Yuvak</ModalHeader>
        <ModalBody>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Phone No"
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10 }}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" size="small">
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              label="Team"
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
            >
              <MenuItem value="">Not Assigned</MenuItem>
              {teams.map((t) => (
                <MenuItem key={t._id || t.teamCode} value={t._id}>
                  {t.teamCode ? `${t.teamCode} - ${t.name}` : t.name}
                </MenuItem>
              ))}
            </Select>
            {errors.replacement && <FormHelperText error>{errors.replacement}</FormHelperText>}
          </FormControl>

        </ModalBody>

        <ModalFooter>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={loader}
          >
            {loader ? <CircularProgress size={24} /> : "Update"}
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

      <Dialog open={replacementDialogOpen} onClose={cancelReplacementDialog} fullWidth maxWidth="sm">
        <DialogTitle>Adjust team members</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are moving this member to another team.
            {needsPreviousFill ? " Choose who should be added back to the old team to keep its strength." : ""}
            {targetRemovalNeeded ? " The new team is already at capacity; pick someone to remove to keep it at 4 members." : ""}
          </DialogContentText>

          {needsPreviousFill && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="replacement-option-label">Choose option</InputLabel>
              <Select
                labelId="replacement-option-label"
                label="Choose option"
                value={replacementChoice}
                onChange={(e) => {
                  setReplacementChoice(e.target.value);
                  setReplacementMemberId("");
                  setMemberToRemoveId("");
                  setReplacementError("");
                }}
              >
                <MenuItem value="unassigned">Add unassigned member</MenuItem>
                <MenuItem value="otherTeam">Move from another team</MenuItem>
              </Select>
            </FormControl>
          )}

          {needsPreviousFill && replacementChoice === "unassigned" && (
            <FormControl fullWidth margin="normal" disabled={!availableUnassigned.length}>
              <InputLabel id="unassigned-select-label">Select member</InputLabel>
              <Select
                labelId="unassigned-select-label"
                label="Select member"
                value={replacementMemberId}
                onChange={(e) => {
                  setReplacementMemberId(e.target.value);
                  setMemberToRemoveId("");
                  setReplacementError("");
                }}
              >
                {availableUnassigned.length === 0 && <MenuItem value="">No unassigned members</MenuItem>}
                {availableUnassigned.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.name} ({m.phone})
                  </MenuItem>
                ))}
              </Select>
              {!availableUnassigned.length && (
                <FormHelperText>No unassigned members found for this mandal.</FormHelperText>
              )}
            </FormControl>
          )}

          {needsPreviousFill && replacementChoice === "otherTeam" && (
            <FormControl fullWidth margin="normal" disabled={!otherTeamMembers.length}>
              <InputLabel id="other-team-select-label">Select member</InputLabel>
              <Select
                labelId="other-team-select-label"
                label="Select member"
                value={replacementMemberId}
                onChange={(e) => {
                  setReplacementMemberId(e.target.value);
                  setMemberToRemoveId("");
                  setReplacementError("");
                }}
              >
                {otherTeamMembers.length === 0 && <MenuItem value="">No team members available</MenuItem>}
                {otherTeamMembers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.phone}) - {m.teamName}
                  </MenuItem>
                ))}
              </Select>
              {!otherTeamMembers.length && (
                <FormHelperText>No members found in other teams to move.</FormHelperText>
              )}
            </FormControl>
          )}

          {removalNeeded && (
            <FormControl fullWidth margin="normal" disabled={!remainingPreviousMembers.length}>
              <InputLabel id="remove-member-select-label">Select member to remove</InputLabel>
              <Select
                labelId="remove-member-select-label"
                label="Select member to remove"
                value={memberToRemoveId}
                onChange={(e) => {
                  setMemberToRemoveId(e.target.value);
                  setReplacementError("");
                }}
              >
                {remainingPreviousMembers.length === 0 && <MenuItem value="">No members to remove</MenuItem>}
                {remainingPreviousMembers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.phone})
                  </MenuItem>
                ))}
              </Select>
              {!remainingPreviousMembers.length && (
                <FormHelperText>No removable members found in previous team.</FormHelperText>
              )}
              <FormHelperText>
                Previous team would exceed 4 members; pick one to unassign.
              </FormHelperText>
            </FormControl>
          )}

          {targetRemovalNeeded && (
            <FormControl fullWidth margin="normal" disabled={!targetRemovableMembers.length}>
              <InputLabel id="target-remove-member-label">Remove from new team</InputLabel>
              <Select
                labelId="target-remove-member-label"
                label="Remove from new team"
                value={targetRemovalMemberId}
                onChange={(e) => {
                  setTargetRemovalMemberId(e.target.value);
                  setReplacementError("");
                }}
              >
                {targetRemovableMembers.length === 0 && <MenuItem value="">No members to remove</MenuItem>}
                {targetRemovableMembers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.phone})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                New team would exceed 4 members; pick one to unassign.
              </FormHelperText>
            </FormControl>
          )}

          {replacementError && <FormHelperText error>{replacementError}</FormHelperText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelReplacementDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmReplacementChoice} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* keep if you don't already have a global container */}
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default EditMandalYuvakModal;
