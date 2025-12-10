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
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import mandalYuvaks from "../api/data";

function CreateTeamModal({ modal, setModal }) {

  const me = JSON.parse(localStorage.getItem("sevakDetails")) || {};

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [yuvaks, setYuvaks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    yuvaks: []
  });
  const toggle = () => setModal(!modal);

  useEffect(() => {
    setYuvaks(mandalYuvaks.filter((x) => x.team === "Not Assigned"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let v = value;

    setFormData((p) => ({ ...p, [name]: v }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name) errs.name = "Enter team name";
    if (!formData.target) errs.target = "Enter target";
    if (formData.yuvaks.length === 0) errs.yuvaks = "Select at least one yuvak";

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
        target: formData.target,
        yuvaks: formData.yuvaks
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
        <ModalHeader toggle={toggle}>Create Team</ModalHeader>
        <ModalBody>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              label="Team Name"
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

          <FormControl fullWidth margin="normal" error={!!errors.yuvaks}>
            <InputLabel>Select Yuvaks</InputLabel>

            <Select
              multiple
              name="yuvaks"
              value={formData.yuvaks}
              onChange={handleChange}
              label="Select Yuvaks"
              renderValue={(selected) =>
                selected.map(id => yuvaks.find(x => x.id === id)?.name).join(", ")
              }
            >
              {yuvaks.map((y) => (
                <MenuItem key={y.id} value={y.id}>
                  <Checkbox checked={formData.yuvaks.includes(y.id)} />
                  <ListItemText primary={`${y.name} (${y.phone})`} />
                </MenuItem>
              ))}
            </Select>

            <small style={{ color: "red" }}>{errors.yuvaks}</small>
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

export default CreateTeamModal;
