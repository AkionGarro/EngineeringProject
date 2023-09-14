import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import { useFirebase } from "../../context/DatabaseContext";
import "./NewAdmin.css";
import Swal from "sweetalert2";
function NewAdmin() {
  const [users, setUsers] = useState([]);
  const api = useFirebase();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const updateTable = async () => {
    try {
      const querySnapshot = await api.getAllUsers();
      const userData = [];
      for (const doc in querySnapshot) {
        userData.push(querySnapshot[doc]);
      }
      setUsers(userData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al obtener usuarios",
        text: error,
      });
    }
  };

  const handleNewAdmin = (email) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Estás a punto de convertir a este usuario en administrador! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero hacerlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("¡Usuario convertido en administrador!", "", "success");
        api.addNewAdmin(email).then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.email === email ? { ...user, userType: "admin" } : user
            )
          );
        });
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await api.getAllUsers();
        const userData = [];
        for (const doc in querySnapshot) {
          userData.push(querySnapshot[doc]);
        }
        setUsers(userData);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al obtener usuarios",
          text: error,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "auto" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Permisos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={user.email}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleNewAdmin(user.email)}>
                      <AddIcon></AddIcon> New Admin
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default NewAdmin;
