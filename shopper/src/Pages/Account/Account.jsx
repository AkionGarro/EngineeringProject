import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography, Paper, IconButton } from "@mui/material";
import { Edit as EditIcon, CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material"; // Import icons
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
  const [isEditing, setIsEditing] = useState(false);


  const handleEditClick = () => {
    setIsEditing(true);
  };

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
      setIsEditing(false);
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
      <Paper elevation={3} className="profileInfo">
        <Grid container spacing={2} mt={2} ml={2}>
          <Grid item xs={12} sm={5}>
            <TextField
            InputLabelProps={{ shrink: true }}

              id="fullName"
              label="Full Name"
              name="fullName"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
            InputLabelProps={{ shrink: true }}
              id="email"
              label="Email"
              name="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
            InputLabelProps={{ shrink: true }}
              id="identification"
              label="Identification"
              name="identification"
              variant="outlined"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
            InputLabelProps={{ shrink: true }}
              id="phone"
              label="Phone Number"
              name="phone"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
            InputLabelProps={{ shrink: true }}
              id="address"
              label="Address"
              name="address"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
            InputLabelProps={{ shrink: true }}
              id="role"
              label="Role"
              name="role"
              variant="outlined"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={!isEditing}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
         
              <IconButton onClick={handleEditClick}>
                <EditIcon />
              </IconButton>
           
              <IconButton type="submit">
                <CheckCircleOutlineIcon />
              </IconButton>
          
          </Grid>
        </Grid>
      </Paper>

    </form>
  );
}

export default Account;
