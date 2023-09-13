import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "./Login.css";
import {firestore} from "../../firebase";
import { addDoc,collection } from "firebase/firestore";

function Login() {
    const ref =  collection(firestore, "users");

    const handleData = async(event) => {
        console.log(event);
        event.preventDefault();
        let data = {
            user : 'Akion',
            email : event.target.email.value,
            password : event.target.password.value
        }
        try {
            const docRef = await addDoc(ref, data);
            console.log("Document written with ID: ", docRef.id);
        }   catch (e) {
            console.error("Error adding document: ", e);
        }
    };

  return (

    <form className="container__form" onSubmit={handleData}>

      <h3>Sign in</h3>
      <div className="container__login">
        <label>Email</label>
        <TextField id="email" variant="standard" />
      </div>

      <div className="container__login">
        <label>Password</label>
        <TextField id="password" type="password" variant="standard" />
      </div>

      <Button type="submit" variant="contained">Login</Button>

    </form>
  );
}

export default Login;
