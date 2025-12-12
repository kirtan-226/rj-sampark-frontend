import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BACKEND_ENDPOINT } from "../api/api";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function AddAnnkutSevakModal({ modal, setModal }) {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
  });

  const me = JSON.parse(localStorage.getItem("sevakDetails") || "{}");
  const mandalId = me?.mandal_id || me?.mandalId || null;

  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((p) => ({ ...p, [name]: value }));
      }
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name.trim() === "" ||
      formData.phone_number.trim() === "" ||
      formData.phone_number.length !== 10
    ) {
      toast.error("All fields are required and must be valid.");
      return;
    }

    setLoader(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone_number.trim(),
        role: "KARYAKAR",
        mandalId: mandalId || undefined,
      };

      const res = await axios.post(`${BACKEND_ENDPOINT}users`, payload);

      toast.success(`User created. ID: ${res.data?.userId}, Pass: ${res.data?.password}`);
      setFormData({
        name: "",
        phone_number: "",
      });
      toggle();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || "An error occurred";
      toast.error(message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Sevak</ModalHeader>
        <ModalBody>
          <div>
            <TextField
              label="Sevak Name"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              required
              color="secondary"
            />
          </div>
          <div>
            <TextField
              label="Phone Number"
              name="phone_number"
              placeholder="Enter Phone number"
              value={formData.phone_number}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
              required
              color="secondary"
              inputProps={{ maxLength: 10 }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={loader}
          >
            {loader ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={toggle}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default AddAnnkutSevakModal;
