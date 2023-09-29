import * as React from "react";
import { useState, useEffect } from "react";
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
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
function NewAdmin() {
  const [users, setUsers] = useState([]);
  const api = useFirebase();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [flagUpdate, setFlagUpdate] = useState(false);
  const [isColumnVisible, setIsColumnVisible] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
          setFlagUpdate(true);
        });
      }
    });
  };

  const changeAdminToUser = (email) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Estás a punto de convertir a este admin en usuario! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "¡Sí, quiero hacerlo!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Amin convertido en usuario!", "", "success");
        api.changeToUser(email).then(() => {
          setFlagUpdate(true);
        });
      }
    });
  };

  function UserPermissions(props) {
    console.log(props.userData);
    if (props.userData.userType === "admin") {
      return (
        <div className="container__permissions">
        <Button onClick={() => changeAdminToUser(props.userData.email)}>
          <CheckOutlinedIcon></CheckOutlinedIcon> 
        </Button>
        </div>

      );
    } else {
      return (
        <div className="container__permissions">
        <Button onClick={() => handleNewAdmin(props.userData.email)}>
        <CloseOutlinedIcon></CloseOutlinedIcon> 
        </Button>
        </div>
      );
    }
  }

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
    setFlagUpdate(false);

    fetchData();
  }, [flagUpdate]);


  useEffect(() => {
    const handleResize = () => {
  
      if (window.innerWidth < 900) {
        setIsColumnVisible(false);
      } else {
        setIsColumnVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              {isColumnVisible &&<TableCell>Nombre Completo</TableCell>}
                {isColumnVisible &&<TableCell>Teléfono</TableCell>}
                {isColumnVisible &&<TableCell>Tipo</TableCell>}
              <TableCell>Administrador</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={user.email} hover>
                  <TableCell className="email-cell">{user.email}</TableCell>
                  {isColumnVisible && <TableCell className="name-cell">{user.fullName}</TableCell>}
                  {isColumnVisible &&<TableCell className="phone-cell">{user.phone}</TableCell>}
                  {isColumnVisible &&<TableCell className="type-cell">{user.userType}</TableCell>}
                  <TableCell className="permissions-cell">
                    <UserPermissions userData={user}></UserPermissions>
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
