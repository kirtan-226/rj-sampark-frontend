import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";

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
  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        teamId: user.teamId?._id || user.teamId || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;

    setFormData((p) => ({ ...p, [name]: v }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name) errs.name = "Enter name";
    if (!formData.phone) errs.phone = "Enter phone number";

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
      const payload = {
        name: formData.name,
        phone: formData.phone,
        teamId: formData.teamId || null,
      };
      await axios.patch(`${BACKEND_ENDPOINT}users/${user._id}`, payload);
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

      {/* keep if you don’t already have a global container */}
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default EditMandalYuvakModal;
