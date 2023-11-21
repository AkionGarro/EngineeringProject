import * as React from "react";
import { useState, useEffect } from "react";
import SearchInputField from "../../components/SearchInputField.jsx";
import "./Orders.css";
import DateRangeIcon from "@mui/icons-material/DateRange";
import OrdenesDeCompraTable from "../../components/OrdenesDeCompraTable.jsx";
import { makeStyles, withStyles } from "@mui/styles";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  IconButton,
  Hidden,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebase } from "../../context/DatabaseContext";
import TablePagination from "@mui/material/TablePagination";
import Swal from "sweetalert2";
import EditModal from "./EditModal.jsx";
import Stack from "@mui/material/Stack";
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { DataGrid } from '@mui/x-data-grid';
import { firestore } from '../../firebase.js';
import VisibilityIcon from '@mui/icons-material/Visibility';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import Box, { BoxProps } from '@mui/material/Box';
import { Container } from '@mui/system';

import VerPedido from "../../components/VerPedido/VerPedido.jsx";
import VerPedidoOnline from "../../components/VerPedidoOnline/VerPedidoOnline.jsx";
import VerPedidoPersonal from "../../components/VerPedidoPersonal/VerPedidoPersonal.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
    [theme.breakpoints.down("sm")]: {
      minWidth: 265, // Cambia el ancho mínimo en pantallas pequeñas
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function Orders() {
  const opcionesFiltro = [
    "Todos",
    "Pendiente de confirmación",
    "En proceso",
    "Pendiente de pago",
    "Cancelado",
    "Pagado",
    "Enviado",
    "Recibido",
  ];

  const opcionesFiltro2 = [
    "Todos",
    "Pedidos online",
    "Pedidos personalizados",
    "Pedidos comunes",
  ];

  const [filtroSeleccionado, setFiltroSeleccionado] = useState("Todos");
  const [filtroSeleccionado2, setFiltroSeleccionado2] = useState("Todos");
  const [filtroSeleccionadoFire, setFiltroSeleccionadoFire] = useState("Todos");
  const [filtroSeleccionado2Fire, setFiltroSeleccionado2Fire] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [openNormal, setOpenNormal] = useState(false);
  const [openOnline, setOpenOnline] = useState(false);
  const [openPersonal, setOpenPersonal] = useState(false);
  const [loading, setLoading] = useState(true)
  const childRef = React.useRef();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  var [orders, setOrders] = useState([]);
  const [fechaMenor, setFechaMenor] = useState(new Date());
  const [fechaMayor, setFechaMayor] = useState(new Date(2000, 1, 1));
  const [fecha, setFecha] = useState(
    fechaMenor.toLocaleDateString() + " - " + fechaMayor.toLocaleDateString()
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [idOrder, setOrderId] = useState(0);
  const [idOrderNormal, setIdOrderNormal] = useState(0);
  const [idOrderOnline, setIdOrderOnline] = useState(0);
  const [idOrderPersonal, setIdOrderPersonal] = useState(0);
  const [estadoOrder, setEstadoOrder] = useState(0);

  const getIdForModal = () => {
    return idOrder;
  };

  const handleEditClick = (id) => {
    setOrderId(id);
    setPedidoSeleccionado(firebase.getOrder(id));
    // Abre el modal de edición cuando se hace clic en el icono de editar
    setIsEditModalOpen(true);
  };

  const onChangeInput = async (idOrder) => {
    console.log("ID ORDER onChangeInput: ", idOrder);
    const data = await firebase.getOrder(idOrder);
    if (data !== null) {
      setOrders([data]);
    }
  };

  const handleCloseEditModal = () => {
    // Cierra el modal de edición
    setIsEditModalOpen(false);
  };

  const getOrders2 = async (filtroParametro) => {
    let filtro2 = filtroSeleccionado2;
    switch (filtroParametro) {
      case "Todos":
        filtro2 = "Todos";
        setFiltroSeleccionado2("Todos");
        setFiltroSeleccionado2Fire("Todos");
        break;
      case "Pedidos online":
        filtro2 = "pedidosOnline";
        setFiltroSeleccionado2("Pedidos online");
        setFiltroSeleccionado2Fire("pedidosOnline");
        break;
      case "Pedidos personalizados":
        filtro2 = "pedidosPersonales";
        setFiltroSeleccionado2("Pedidos personalizados");
        setFiltroSeleccionado2Fire("pedidosPersonales");
        break;
      case "Pedidos comunes":
        filtro2 = "pedidosTest";
        setFiltroSeleccionado2("Pedidos comunes");
        setFiltroSeleccionado2Fire("pedidosTest");
        break;
      default:
        filtro2 = "Todos";
        setFiltroSeleccionado2("Todos");
        setFiltroSeleccionado2Fire("Todos");
        break;
    }

    let data;
    const setData = async () => {
      data = await firebase.getAllOrdersWithID(filtroSeleccionadoFire, filtro2);
      setOrders(data);
    };

    await Promise.all([setData()]);
  };

  const getOrders = async (filtroParametro) => {
    let filtro = filtroSeleccionado;

    // Llama a la función auxiliar para actualizar el estado del filtro
    switch (filtroParametro) {
      case "Todos":
        filtro = "Todos";
        setFiltroSeleccionado("Todos");
        setFiltroSeleccionadoFire("Todos");
        break;
      case "Pendiente de confirmación":
        filtro = 0;
        setFiltroSeleccionado("Pendiente de confirmación");
        setFiltroSeleccionadoFire(0);
        break;
      case "En proceso":
        filtro = 1;
        setFiltroSeleccionado("En proceso");
        setFiltroSeleccionadoFire(1);
        break;
      case "Pendiente de pago":
        filtro = 2;
        setFiltroSeleccionado("Pendiente de pago");
        setFiltroSeleccionadoFire(2);
        break;
      case "Cancelado":
        filtro = 3;
        setFiltroSeleccionado("Cancelado");
        setFiltroSeleccionadoFire(3);
        break;
      case "Pagado":
        filtro = 4;
        setFiltroSeleccionado("Pagado");
        setFiltroSeleccionadoFire(4);
        break;
      case "Enviado":
        filtro = 5;
        setFiltroSeleccionado("Enviado");
        setFiltroSeleccionadoFire(5);
        break;
      case "Recibido":
        filtro = 6;
        setFiltroSeleccionado("Recibido");
        setFiltroSeleccionadoFire(6);
        break;
      default:
        filtro = "Todos";
        setFiltroSeleccionado("Todos");
        setFiltroSeleccionadoFire("Todos");
        break;
    }

    let data;
    const setData = async () => {
      console.log("FILTRO: ", filtro, "FILTRO2: ", filtroSeleccionado2Fire);
      data = await firebase.getAllOrdersWithID(filtro, filtroSeleccionado2Fire);
      setOrders(data);
    };

    await Promise.all([setData()]);

    // Utiliza Promise.all para esperar a que todas las operaciones asíncronas se completen
    const fechaPromises = data.map(async (order) => {
      try {
        let fecha = order.pedido.fecha.toDate();
        if (fecha < fechaMenor) {
          setFechaMenor(fecha);
        }
        if (fecha > fechaMayor) {
          setFechaMayor(fecha);
        }
      } catch (error) {
        //console.log("ERROR TO GET ORDER'S DATE: ", error);
      }
    });
    // Espera a que todas las fechas se procesen antes de actualizar la fecha en la interfaz de usuario
    await Promise.all(fechaPromises);

    setFecha(
      fechaMenor.toLocaleDateString() + " - " + fechaMayor.toLocaleDateString()
    );
  };

  const firebase = useFirebase();

  useEffect(() => {


    firebase.getAllOrdersWithID("Todos", "Todos").then((data) => {
      setOrders(data);
      console.log("ORDERS WITH ID: ", data);
    });
  }, []);


  const handleChangePage = (event, newPage) => {

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteOrder = async (id, tabla) => {
    console.log("ID ORDER BORRAR: ", id);
    let result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la orden. ¿Estás seguro de que quieres continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      result = await firebase.deleteOrder(id, tabla);
      if (result) {
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Se ha eliminado la orden correctamente",
        });
        getOrders(filtroSeleccionado);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No se ha eliminado la orden, ha ocurrido un error",
        });
      }
    }
  };
  const handleCloseModalNormal = () => {
    setOpenNormal(false)
    setLoading(true)
  }

  const handleCloseModalOnline = () => {
    setOpenOnline(false)
    setLoading(true)
  }

  const handleCloseModalPersonal = () => {
    setOpenPersonal(false)
    setLoading(true)
  }

  const verPedido = (id, estado, tabla) => {
    console.log("TABLA DEL PEDIDO A VER:", tabla)
    setEstadoOrder(estado);
    
    
    // Abre el modal de edición cuando se hace clic en el icono de editar
    if (tabla === "pedidosOnline") {
      //
      setIdOrderOnline(id);
      setOpenOnline(true);
    } else if (tabla === "pedidosTest") {
      //
      setIdOrderNormal(id);
      setOpenNormal(true);
      
    } else if (tabla === "pedidosPersonales") {
      //
      setIdOrderPersonal(id);
      setOpenPersonal(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 95 },
    { field: "fullName", headerName: "Cliente", width: 170 },
    { field: "phone", headerName: "Telefono", width: 140 },
    { field: "direccionString", headerName: "Dirección", width: 400, },

    {
      headerName: "Acciones",
      width: 300,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => deleteOrder(params.row.id, params.row.tabla)}
              variant="outlined"
              startIcon={<DeleteIcon />}
            ></Button>
            <Button
              variant="outlined"
              id={params.row.id}
              onClick={() => handleEditClick(params.row.id)}
              startIcon={<BorderColorRoundedIcon />}
            ></Button>
            <Button
              variant="outlined"
              id={params.row.id}
              onClick={() => verPedido(params.row.id, params.row.estado, params.row.tabla)}
              startIcon={<VisibilityIcon />}
            ></Button>
          </Stack>
        </div>
      ),
    },
  ];
  const commonStyles = {
    bgcolor: '#E8E9F3',
    mb: 1,
    borderRadius: 1,
    width: '100%',
  };

  return (
    <Container maxWidth="xl">
      <Box component="div" ><h4>Filtros</h4></Box>
      <Box sx={{ display: 'block', gridTemplateRows: 'repeat(3, 1fr)' }}>

        <div>
          <Box component="div" className='filtro-buttons' sx={{
            ...commonStyles,
            display: {
              xs: 'flex',  // Para pantallas pequeñas (extra small), display es 'block'
              md: 'block',   // Para pantallas medianas (medium), display es 'flex'
              lg: 'block'
            },
            verticalAlign: 'middle', border: 1
          }}>

            <Box sx={{ textAlign: '', m: '0.1rem 0' }}>
              {opcionesFiltro.map((opcion) => (
                <button
                  key={opcion}
                  className={`filter-button ${filtroSeleccionado === opcion ? "selected" : ""}`}
                  onClick={() => getOrders(opcion)}
                >
                  {opcion}
                </button>
              ))}
            </Box>
          </Box>
          <Box component="div" className='filtro-buttons' sx={{
            ...commonStyles,
            display: {
              xs: 'flex',  // Para pantallas pequeñas (extra small), display es 'block'
              md: 'block',   // Para pantallas medianas (medium), display es 'flex'
              lg: 'block'
            },
            verticalAlign: 'middle',
            border: 1
          }}>

            <Box sx={{ textAlign: '', m: '0.1rem auto' }}>
              {opcionesFiltro2.map((opcion) => (
                <button
                  key={opcion}
                  className={`filter-button ${filtroSeleccionado2 === opcion ? "selected" : ""}`}
                  onClick={() => getOrders2(opcion)}
                >
                  {opcion}
                </button>
              ))}
            </Box>
          </Box>

        </div>
        <div style={{ display: 'block' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: {lg: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)'}, textAlign: 'center' }}>

            <SearchInputField placeholder="Buscar por ID de orden" searchFunc={onChangeInput} />



          </Box>
        </div>
        <div style={{ display: 'block', marginTop: '7px' }}>

          {orders.length > 0 ? (
            <div style={{ overflowX: "auto", display: 'block' }}>
              <DataGrid
                rows={orders}
                sx={{ maxWidth: '100%', width: { xs: '90vw', sm: '62.5vw', md: '71vw', lg: '77vw' }, textAlign: 'center' }}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 15 },
                  },
                }}
                pageSizeOptions={[5, 10, 15]}
                autoHeight
              />
            </div>


          ) : (
            <p>No hay órdenes para mostrar.</p>
          )}

          <EditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} idOrderModal={idOrder} getIdFunc={getIdForModal} getOrdersFunc={getOrders} filter={filtroSeleccionado} />
        </div>

      </Box>
      <VerPedido isOpen={openNormal} closeModal={handleCloseModalNormal} idNormal={idOrderNormal} estado={estadoOrder} />
      <VerPedidoOnline isOpen={openOnline} closeModal={handleCloseModalOnline} idOnline={idOrderOnline} estado={estadoOrder} />
      <VerPedidoPersonal isOpen={openPersonal} closeModal={handleCloseModalPersonal} idPersonal={idOrderPersonal} estado={estadoOrder} />
    </Container>

  );
}
export default Orders;