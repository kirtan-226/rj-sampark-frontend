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
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function AddSamparkSevakModal({ modal, setModal }) {

  const me = JSON.parse(localStorage.getItem("sevakDetails")) || {};
  const mySevakCode = me?.sevak_code || me?.sevak_id || "";

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    mandal: "",
    target: "",
  });
  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;

    setFormData((p) => ({ ...p, [name]: v }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.mandal) errs.mandal = "મંડળ પસંદ કરો";
    if (!formData.name) errs.name = "સંપૂર્ણ નામ લખો";
    if (!formData.phone) errs.phone = "ફોન નંબર લખો";
    if (!formData.target) errs.target = "ટાર્ગેટ લખો";

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
        mandal: formData.mandal,
        target: formData.target,
        sevak_id: mySevakCode,
      };
      alert("Work in progress: " + JSON.stringify(payload));
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setLoader(false);
      toggle();
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>Add Sampark Sevak</ModalHeader>
        <ModalBody>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="નામ"
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
              label="ફોન નંબર"
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

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Target"
              name="target"
              type="number"
              value={formData.target}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              error={!!errors.target}
              helperText={errors.target}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" size="small">
            <InputLabel id="mandal-select-label">મંડળ</InputLabel>
            <Select
              labelId="mandal-select-label"
              label="મંડળ"
              name="mandal"
              value={formData.mandal}
              onChange={handleChange}
              error={!!errors.mandal}
            >
              <MenuItem key="SJ" value="SJ">
                સહજાનંદ (SJ)
              </MenuItem>
              <MenuItem key="NK" value="NK">
                નારાયણકુંજ (NK)
              </MenuItem>
              <MenuItem key="SRB" value="SRB">
                સુરભિ (SRB)
              </MenuItem>
            </Select>
            {errors.mandal && (
              <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>{errors.mandal}</div>
            )}
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

      {/* keep if you don’t already have a global container */}
      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default AddSamparkSevakModal;
