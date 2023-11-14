import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFirebase } from "../../context/DatabaseContext";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const AddAddressrModal = (props) => {
    const auth = useAuth();
    const firebase = useFirebase();

    const handleClose = () =>{ 
        props.setOpen(false)
        props.setFlagUpdate(true)
    };

    const [email, setEmail] = useState("");

    const [country, setCountry] = useState("");
    const [province, setProvince] = useState("");
    const [canton, setCanton] = useState("");
    const [district, setDistrict] = useState("");
    const [address, setAddress] = useState("");

    const handleAddress = async (event) => {
        if (auth.user) {
            setEmail(auth.user.email);
        }
        event.preventDefault();
        const dataForm = new FormData(event.currentTarget);

        const dataAddress = {
            email: auth.user.email,
            country: dataForm.get("country"),
            province: dataForm.get("province"),
            canton: dataForm.get("canton"),
            district: dataForm.get("district"),
            address: dataForm.get("address"),
        };
        try {
            await firebase.addAddressToUser(dataAddress);
            props.setFlagUpdate(true);
            handleClose();
            Swal.fire({
                icon: "success",
                title: "¡Registro exitoso!",
                text: "Se ha registrado correctamente",
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle style={{ textAlign: "center", color: "#457B9D" }}>Registrar una nueva dirección</DialogTitle>
            <DialogContent>
                <form onSubmit={handleAddress}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="country"
                        name="country"
                        label="País"
                        type="text"
                        fullWidth
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="province"
                        name="province"
                        label="Provincia"
                        type="text"
                        onChange={(e) => setProvince(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        id="canton"
                        name="canton"
                        label="Canton"
                        type="text"
                        fullWidth
                        onChange={(e) => setCanton(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        id="district"
                        name="district"
                        label="Distrito"
                        type="text"
                        fullWidth
                        required
                        onChange={(e) => setDistrict(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        name="address"
                        label="Dirección exacta"
                        type="text"
                        fullWidth
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit">Registrar</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default AddAddressrModal;
