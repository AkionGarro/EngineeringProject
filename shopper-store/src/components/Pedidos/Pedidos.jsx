import * as React from "react";
import { useState, useEffect } from "react";
import "./Pedidos.css";
import SearchInputField from "./SearchInputField.jsx";
import DateRangeIcon from "@mui/icons-material/DateRange";
import OrdenesDeCompraTable from "./OrdenesDeCompraTable.jsx";
import { makeStyles, withStyles } from "@mui/styles";
import { useFirebase } from "../../context/DatabaseContext.jsx";
import { Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import Box, { BoxProps } from '@mui/material/Box';
import { Container } from '@mui/system';
//useAuth para ver el usuario logueado
import { useAuth } from "../../context/AuthContext.jsx";
function Pedidos() {
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
    const [filtroSeleccionado2Fire, setFiltroSeleccionado2Fire] =
        useState("Todos");
    const childRef = React.useRef();
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

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

    const getIdForModal = () => {
        return idOrder;
    };
    const handleEditClick = (id) => {
        console.log("ID handleEditClick objeto:", id);
        console.log("ID handleEditClick:" + toString(id));
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
            data = await firebase.getOrdersForUser(filtroSeleccionadoFire, filtro2, auth.user.email);
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
                filtro = "0";
                setFiltroSeleccionado("Pendiente de confirmación");
                setFiltroSeleccionadoFire("0");
                break;
            case "En proceso":
                filtro = "1";
                setFiltroSeleccionado("En proceso");
                setFiltroSeleccionadoFire("1");
                break;
            case "Pendiente de pago":
                filtro = "2";
                setFiltroSeleccionado("Pendiente de pago");
                setFiltroSeleccionadoFire("2");
                break;
            case "Cancelado":
                filtro = "3";
                setFiltroSeleccionado("Cancelado");
                setFiltroSeleccionadoFire("3");
                break;
            case "Pagado":
                filtro = "4";
                setFiltroSeleccionado("Pagado");
                setFiltroSeleccionadoFire("4");
                break;
            case "Enviado":
                filtro = "5";
                setFiltroSeleccionado("Enviado");
                setFiltroSeleccionadoFire("5");
                break;
            case "Recibido":
                filtro = "6";
                setFiltroSeleccionado("Recibido");
                setFiltroSeleccionadoFire("6");
                break;
            default:
                filtro = "Todos";
                setFiltroSeleccionado("Todos");
                setFiltroSeleccionadoFire("Todos");
                break;
        }

        let data;
        const setData = async () => {
            data = await firebase.getOrdersForUser(filtro, filtroSeleccionado2Fire, auth.user.email);
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
    const auth = useAuth();
   

    useEffect(() => {
        

        firebase.getOrdersForUser("Todos", "Todos", auth.user.email).then((data) => {
            setOrders(data);
     
        });
    }, []);

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
    };

    const columns = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "cliente", headerName: "Cliente", width: 150 },
        { field: "telefono", headerName: "Telefono", width: 100 },
        { field: "direccion", headerName: "Dirección", width: 300 },
        { field: "estado", headerName: "Estado", width: 200 },
        {
            headerName: "Acciones",
            width: 300,
            renderCell: (params) => (
                <div>
                    <Stack direction="row" spacing={2}>
                        <Button
                            onClick={() => deleteOrder(params.row.id)}
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                        ></Button>
                        <Button
                            variant="outlined"
                            id={params.row.id}
                            onClick={() => handleEditClick(params.row.id)}
                            startIcon={<BorderColorRoundedIcon />}
                        ></Button>
                    </Stack>
                </div>
            ),
        },
    ];
    const commonStyles = {
        bgcolor: 'background.paper',
        mb: 1,
        borderColor: 'text.primary',
        width: '100%',
    
      };
    return (
        <Container maxWidth="xl">
      <Box component="div" ><h4>Filtros de Mis pedidos</h4></Box>
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
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', textAlign: 'center' }}>
            <div>
              <SearchInputField placeholder="Buscar por ID de orden" searchFunc={onChangeInput} />
            </div>
            

          </Box>
        </div>
        <div style={{ display: 'block', marginTop: '7px' }}>

          {orders.length > 0 ? (
            <div style={{ overflowX: "auto", display: 'block' }}>
              <DataGrid
                rows={orders}
                sx={{ maxWidth: '100%', width: { xs: '100vw', sm: '100vw', md: '100vw', lg: '100vw' }, textAlign: 'center' }}
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

         
        </div>

      </Box>
    </Container>
    );
}

export default Pedidos;
