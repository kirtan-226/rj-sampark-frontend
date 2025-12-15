import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import { BACKEND_ENDPOINT } from "../api/api";

function AddSupervisorModal({ modal, setModal, onCreated }) {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    post: "",
    mandal: [],
  });
  const [errors, setErrors] = useState({});
  const [mandals, setMandals] = useState([]);

  const mandalLookup = useMemo(() => {
    const map = {};
    mandals.forEach((m) => {
      const id = m?._id || m?.id;
      if (id) map[String(id)] = m;
      if (m?.code) map[m.code.toUpperCase()] = m;
    });
    return map;
  }, [mandals]);

  const isNirikshak = (formData.post || "").toLowerCase() === "nirikshak";
  const selectedMandals = useMemo(() => {
    if (Array.isArray(formData.mandal)) return formData.mandal;
    if (!formData.mandal) return [];
    return [formData.mandal];
  }, [formData.mandal]);

  const toggle = () => setModal(!modal);

  const getMandalFromCode = (code) => {
    if (!code) return null;
    const upper = typeof code === "string" ? code.toUpperCase() : "";
    return mandalLookup[upper] || mandalLookup[code] || null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => {
      const nextPost = name === "post" ? value : p.post;
      const wantsMulti = (nextPost || "").toLowerCase() === "nirikshak";

      if (name === "mandal") {
        const codes = wantsMulti
          ? Array.isArray(value)
            ? value
            : value
            ? [value]
            : []
          : value
          ? [value]
          : [];
        return { ...p, mandal: codes };
      }
      return { ...p, [name]: value };
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    if (!formData.post) errs.post = "Post is required";

    if (isNirikshak && selectedMandals.length === 0) {
      errs.mandal = "Select at least one mandal";
    } else if (!isNirikshak && selectedMandals.length !== 1) {
      errs.mandal = "Select a mandal";
    }
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
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        role: roleMap[formData.post] || "NIRIKSHAK",
      };

      if (payload.role === "SANCHALAK") {
        const code = selectedMandals[0];
        const mandal = getMandalFromCode(code);
        payload.mandalId = mandal?._id || mandal?.id || null;
      }

      if (payload.role === "NIRIKSHAK") {
        payload.assignedMandals = selectedMandals
          .map((code) => {
            const mandal = getMandalFromCode(code);
            return mandal?._id || mandal?.id || null;
          })
          .filter(Boolean);
      }

      const res = await axios.post(`${BACKEND_ENDPOINT}users`, payload);
      toast.success(`User created. ID: ${res.data?.userId}, Pass: ${res.data?.password}`);
      setFormData({ name: "", phone: "", post: "", mandal: [] });
      setErrors({});
      onCreated?.();
      toggle();
    } catch (error) {
      console.error("add_supervisor error:", error);
      const message = error?.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!modal) return;
    const token = localStorage.getItem("authToken");
    if (token) axios.defaults.headers.common.Authorization = `Basic ${token}`;
    axios.defaults.baseURL = BACKEND_ENDPOINT;

    const loadMandals = async () => {
      try {
        const res = await axios.get(`${BACKEND_ENDPOINT}mandals`);
        setMandals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("mandal load error", err);
        toast.error(err?.response?.data?.message || err.message || "Failed to load mandals");
        setMandals([]);
      }
    };

    loadMandals();
  }, [modal]);

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Supervisor</ModalHeader>
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
              label="Phone"
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
            <InputLabel id="post-select-label">Post</InputLabel>
            <Select
              labelId="post-select-label"
              label="Post"
              name="post"
              value={formData.post}
              onChange={handleChange}
              error={!!errors.post}
            >
              <MenuItem key="sant_nirdeshak" value="sant_nirdeshak">
                Sant Nirdeshak
              </MenuItem>
              <MenuItem key="nirdeshak" value="nirdeshak">
                Nirdeshak
              </MenuItem>
              <MenuItem key="nirikshak" value="nirikshak">
                Nirikshak
              </MenuItem>
              <MenuItem key="sanchalak" value="sanchalak">
                Sanchalak
              </MenuItem>
            </Select>
            {errors.post && (
              <div style={{ color: "#d32f2f", fontSize: 12, marginTop: 4 }}>{errors.post}</div>
            )}
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal" size="small">
            <InputLabel id="mandal-select-label">{isNirikshak ? "Mandals" : "Mandal"}</InputLabel>
            <Select
              labelId="mandal-select-label"
              label={isNirikshak ? "Mandals" : "Mandal"}
              name="mandal"
              multiple={isNirikshak}
              value={isNirikshak ? selectedMandals : selectedMandals[0] || ""}
              onChange={handleChange}
              error={!!errors.mandal}
              renderValue={(selected) =>
                Array.isArray(selected) ? selected.join(", ") : selected
              }
            >
              {(mandals || []).map((m) => (
                <MenuItem key={m.code || m._id} value={m.code}>
                  {m.name} ({m.code})
                </MenuItem>
              ))}
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
