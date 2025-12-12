import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Button,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

function AddSupervisorModal({ modal, setModal }) {
  const me = JSON.parse(localStorage.getItem("sevakDetails")) || {};
  const mySevakCode = me?.sevak_code || me?.sevak_id || "";
  const myMandalId = me?.mandal_id || me?.mandalId || null;

  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    post: "",
    mandal: "",
  });
  const [errors, setErrors] = useState({});

  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;

    setFormData((p) => ({ ...p, [name]: v }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.post) errs.post = "પોસ્ટ પસંદ કરો";
    if (!formData.mandal) errs.mandal = "મંડળ પસંદ કરો";
    if (!formData.name) errs.name = "સુપરવાઇજરનું નામ લખો";
    if (!formData.phone) errs.phone = "સુપરવાઇજરનો ફોન નંબર લખો";

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
      const roleMap = {
        sant_nirdeshak: "NIRDESHAK",
        nirdeshak: "NIRDESHAK",
        nirikshak: "NIRIKSHAK",
        sanchalak: "SANCHALAK",
      };

      const payload = {
        name: formData.name,
        phone: formData.phone,
        role: roleMap[formData.post] || "NIRIKSHAK",
        mandalId: myMandalId || undefined,
        assignedMandals: [],
      };

      const res = await axios.post(`${BACKEND_ENDPOINT}users`, payload);
      toast.success(`User created. ID: ${res.data?.userId}, Pass: ${res.data?.password}`);
      setFormData({ name: "", phone: "", post: "", mandal: "" });
      setErrors({});
      toggle();

    } catch (error) {
      console.error("add_supervisor error:", error);
      const message = error?.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Supervisor</ModalHeader>
        <ModalBody>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="સુપરવાઇજરનું નામ"
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
              label="સુપરવાઇજરનો ફોન નંબર"
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
            <InputLabel id="post-select-label">સુપરવાઇજરની પોસ્ટ</InputLabel>
            <Select
              labelId="post-select-label"
              label="સુપરવાઇજરની પોસ્ટ"
              name="post"
              value={formData.post}
              onChange={handleChange}
              error={!!errors.post}
            >
              <MenuItem key="sant_nirdeshak" value="sant_nirdeshak">
                સંત નિર્દેશક
              </MenuItem>
              <MenuItem key="nirdeshak" value="nirdeshak">
                નિર્દેશક
              </MenuItem>
              <MenuItem key="nirikshak" value="nirikshak">
                નિરીક્ષક
              </MenuItem>
              <MenuItem key="sanchalak" value="sanchalak">
                સંચાલક
              </MenuItem>
            </Select>
            {errors.post && (
              <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>{errors.post}</div>
            )}
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" size="small">
            <InputLabel id="mandal-select-label">સુપરવાઇજરનું મંડળ</InputLabel>
            <Select
              labelId="mandal-select-label"
              label="સુપરવાઇજરનું મંડળ"
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

      <ToastContainer position="top-center" autoClose={5000} pauseOnHover theme="colored" />
    </div>
  );
}

export default AddSupervisorModal;
