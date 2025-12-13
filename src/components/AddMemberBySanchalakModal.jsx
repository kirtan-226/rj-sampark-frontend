import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";

function AddMemberBySanchalakModal({ modal, setModal, teams = [], onSuccess }) {
  const token = localStorage.getItem("authToken");
  if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
  axios.defaults.baseURL = BACKEND_ENDPOINT;

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    specialExp: "",
    dob: "",
    teamId: "",
  });
  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      tempErrors.name = "Only characters allowed";
    }

    // Phone validation
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!formData.teamId || formData.teamId.trim() === "") {
      tempErrors.teamId = "Team is required";
    }

    if (!formData.dob) {
      tempErrors.dob = "Date of Birth is required";
    }
    return tempErrors;
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
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        specialExp: formData.specialExp,
        dob: formData.dob,
        teamId: formData.teamId,
      };
      console.log("Submitting ahevaal with payload:", payload);
      await axios.post(`${BACKEND_ENDPOINT}ahevaals`, payload);
      toast.success("Ahevaal submitted");
      if (onSuccess) onSuccess();
      setFormData({ name: "", phone: "", address: "", specialExp: "", dob: "", teamId: "" });
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to submit";
      toast.error(msg);
    } finally {
      setLoader(false);
      toggle();
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>Add Sampark Details</ModalHeader>
        <ModalBody>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setFormData({ ...formData, name: value });
                }
              }}
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // digits only
                if (value.length <= 10) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              variant="outlined"
              color="secondary"
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              fullWidth
              inputProps={{ inputMode: "numeric", pattern: "[0-9]{10}", maxLength: 10 }}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Address (optional)"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Special Experience (optional)"
              name="specialExp"
              type="text"
              value={formData.specialExp}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              error={!!errors.dob}
              helperText={errors.dob}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" size="small">
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              label="Team"
              name="teamId"
              value={formData.teamId}
              error={!!errors.teamId}
              onChange={handleChange}
            >
              {/* <MenuItem value="">Not Assigned</MenuItem> */}
              {teams.map((t) => (
                <MenuItem key={t._id || t.teamCode} value={t._id}>
                  {t.teamCode ? `${t.teamCode} - ${t.name}` : t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default AddMemberBySanchalakModal;
