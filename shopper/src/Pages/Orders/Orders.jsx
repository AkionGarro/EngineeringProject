import * as React from 'react';
import { useState, useEffect } from 'react';
import SearchInputField from '../../components/SearchInputField.jsx';
import './Orders.css';
import DateRangeIcon from '@mui/icons-material/DateRange';
import OrdenesDeCompraTable from '../../components/OrdenesDeCompraTable.jsx'
import { makeStyles, withStyles } from '@mui/styles';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, IconButton, Hidden } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFirebase } from '../../context/DatabaseContext';
import TablePagination from '@mui/material/TablePagination';
import Swal from "sweetalert2";
import EditModal from './EditModal.jsx';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
    [theme.breakpoints.down('sm')]: {
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
    "Pagado",
    "Enviado",
    "Recibido",
  ];
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("Todos");
  const childRef = React.useRef();

  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  var [orders, setOrders] = useState([]);
  const [fechaMenor, setFechaMenor] = useState(new Date());
  const [fechaMayor, setFechaMayor] = useState(new Date(2000, 1, 1));
  const [fecha, setFecha] = useState(fechaMenor.toLocaleDateString() + " - " + fechaMayor.toLocaleDateString());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [order, setOrder] = useState({});
  const [idOrder, setOrderId] = useState(0);
  
  const getIdForModal = () =>{
    return idOrder;
  }
  const handleEditClick = (id) => {
    console.log("ID handleEditClick: ", id);
    setOrderId(id);
    // Abre el modal de edición cuando se hace clic en el icono de editar
    setIsEditModalOpen(true);
  };

  

  const handleCloseEditModal = () => {
    // Cierra el modal de edición
    setIsEditModalOpen(false);
  };

  const getOrders = async (filtroParametro) => {
    setFiltroSeleccionado(filtroParametro)
    let data;
    const setData = async () => {
      data = await firebase.getAllOrders(filtroParametro);
      setOrders(data);
    }

    await Promise.all([setData()]);

    // Utiliza Promise.all para esperar a que todas las operaciones asíncronas se completen
    const fechaPromises = data.map(async (order) => {
      try {
        let fecha = order.pedido.fecha.toDate();
        if (fecha < fechaMenor) {
          console.log("FECHA: ", fecha, " MENOR: ", fechaMenor);
          setFechaMenor(fecha);
        }
        if (fecha > fechaMayor) {
          console.log("FECHA: ", fecha, " MAYOR: ", fechaMayor);
          setFechaMayor(fecha);
        }
      } catch (error) {
        console.log("ERROR TO GET ORDER'S DATE: ", error);
      }
    });

    // Espera a que todas las fechas se procesen antes de actualizar la fecha en la interfaz de usuario
    await Promise.all(fechaPromises);
    console.log("FECHA MENOR: ", fechaMenor);
    console.log("FECHA MAYOR: ", fechaMayor);
    setFecha(fechaMenor.toLocaleDateString() + " - " + fechaMayor.toLocaleDateString());
  };

  const firebase = useFirebase();

  useEffect(() => {
    // Esta función se ejecutará solo en el montaje inicial del componente
    firebase.getAllOrders("Todos").then((data) => {
      setOrders(data);
      data.forEach((order) => {
        try {
          let fecha = order.pedido.fecha.toDate();
          console.log("FECHA: INCIO");
          if (fecha > fechaMenor) {
            console.log("FECHA: ", fecha, " MENOR: ", fechaMenor);
            setFechaMenor(fecha);
          }
          if (fecha < fechaMayor) {
            console.log("FECHA: ", fecha, " MAYOR: ", fechaMayor);
            setFechaMayor(fecha);
          }
          setFecha(fechaMenor.toLocaleDateString() + " - " + fechaMayor.toLocaleDateString());
          console.log("FECHA: FIN");
        } catch (error) {
          console.log("ERROR TO GET ORDER'S DATE: ", error);
          setFecha(fechaMenor.toLocaleDateString() + " - " + fechaMayor.toLocaleDateString());
        }
      });
    });


  }, []);

  //console.log("ORDERS: ", orders[0].then((data) => console.log(data)));

  const handleChangePage = (event, newPage) => {
    console.log("DATA: ", orders);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteOrder = async (id) => {
    let result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la orden. ¿Estás seguro de que quieres continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      result = await firebase.deleteOrder(id);
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
  }


  return (
    <div className='row container'>
      <div className="row filter-tittle">Filtros</div>
      <div className="row filtro-buttons">
        {opcionesFiltro.map((opcion) => (
          <button
            key={opcion}
            className={`filter-button ${filtroSeleccionado === opcion ? "selected" : ""
              }`}
            onClick={() => getOrders(opcion)}
          >{opcion}
          </button>
        ))}
      </div>
      <div className="row row-search">
        <div className='div-search'><SearchInputField placeholder="Buscar por ID de orden" /></div>
        <div className='div-search'>
          <div className="fecha">
            <DateRangeIcon className="date-icon" />{fecha}
          </div>
        </div>
      </div>
      <div className="row-table">
        <TableContainer component={Paper} className={classes.root}>
          <Table className={classes.table} aria-label="Ordenes de Compra">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Cliente</StyledTableCell>
                <StyledTableCell>Teléfono</StyledTableCell>
                <StyledTableCell className="hide-on-mobile">Dirección</StyledTableCell>
                <StyledTableCell className="hide-on-mobile">Estado</StyledTableCell>
                <StyledTableCell className="hide-on-mobile">Acción</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order.pedido.id}>
                  <TableCell>{order.pedido.id}</TableCell>
                  <TableCell>{order.pedido.cliente}</TableCell>
                  <TableCell>
                    <a href={`https://wa.me/${order.pedido.telefono}`} target="_blank" rel="noopener noreferrer">
                      <IconButton color="primary" aria-label="Chat en WhatsApp">
                        <WhatsAppIcon />
                      </IconButton>
                    </a>
                  </TableCell>
                  <TableCell className="hide-on-mobile">{order.pedido.direccion}</TableCell>
                  <TableCell className="hide-on-mobile">{order.pedido.estado}</TableCell>
                  <TableCell className="hide-on-mobile">
                    <IconButton color="primary" aria-label="Editar" onClick={() => handleEditClick(order.pedido.id)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton onClick={() => deleteOrder(order.pedido.id)} color="secondary" aria-label="Borrar">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
      <EditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} idOrderModal = {idOrder} getIdFunc = {getIdForModal}/>

    </div>
  );
}

export default Orders;