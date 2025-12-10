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

function EditSamparkYuvakModal({ modal, setModal }) {

  const me = JSON.parse(localStorage.getItem("sevakDetails")) || {};
  const mySevakCode = me?.sevak_code || me?.sevak_id || "";

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    address: "",
  });
  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;

    setFormData((p) => ({ ...p, [name]: v }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.dob) errs.dob = "Enter Date of Birth";
    if (!formData.name) errs.name = "Enter Name";
    if (!formData.phone) errs.phone = "Enter Phone No";
    if (!formData.address) errs.address = "Enter Address";

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
        dob: formData.dob,
        address: formData.address,
        sevak_id: mySevakCode,
      };
      alert("New member added: " + JSON.stringify(payload));
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
        <ModalHeader toggle={toggle}>Edit Sampark Details</ModalHeader>
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

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              InputLabelProps={{ shrink: true }}   // Ensures label doesn't overlap
              error={!!errors.dob}
              helperText={errors.dob}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              variant="outlined"
              color="secondary"
              error={!!errors.address}
              helperText={errors.address}
              fullWidth
            />
          </FormControl>

          {/* <FormControl fullWidth variant="outlined" margin="normal" size="small">
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
          </FormControl> */}
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

export default EditSamparkYuvakModal;