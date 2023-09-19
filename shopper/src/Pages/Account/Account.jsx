import * as React from "react";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import "./Account.css";
import { useFirebase } from "../../context/DatabaseContext";

function Account() {
  const firebase = useFirebase();
  const [updateInfo, setUpdateInfo] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identification, setIdentification] = useState(0);
  const [address, setAddress] = useState({});
  const [role, setRole] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataForm = new FormData(event.currentTarget);

    const data = {
      fullName: dataForm.get("fullName"),
      email: dataForm.get("email"),
      phone: dataForm.get("phone"),
      identification: dataForm.get("identification"),
      address: dataForm.get("address"),
      role: dataForm.get("role"),
    };

    try {
      await firebase.updateUserData(data);
      setUpdateInfo(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("currentUser");
      const data = await firebase.getUserData(email);
      setFullName(data.fullName);
      setEmail(data.email);
      setPhone(data.phone);
      setIdentification(data.identification);
      setAddress(data.address);
      setRole(data.userType);
      setUpdateInfo(false);
    };
    fetchUserData();
  }, [updateInfo]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="profileInfo">
        <TextField
          className="profileInfo__textfield"
          id="fullName"
          label="Full Name"
          name="fullName"
          variant="standard"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          className="profileInfo__textfield"
          id = "email"
          label="Email"
          name="email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="profileInfo__textfield"
          id="identification"
          label="Identification"
          name="identification"
          variant="standard"
          value={identification}
          onChange={(e) => setIdentification(e.target.value)}
        />
        <TextField
          className="profileInfo__textfield"
          id="phone"
          name="phone"
          variant="standard"
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          className="profileInfo__textfield"
          id="address"
          label="Address"
          name="address"
          variant="standard"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          className="profileInfo__textfield"
         id="role"
          label="Role"
          name="role"
          variant="standard"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div className="profileInfo__button">
        <Button variant="contained" type="submit">Update</Button>
      </div>
    </form>
  );
}

export default Account;
