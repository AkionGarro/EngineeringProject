import * as React from "react";
import { useState, useEffect } from "react";
import "./Pedidos.css";
import SearchInputField from "./SearchInputField.jsx";
import { useFirebase } from "../../context/DatabaseContext.jsx";
import { useGlobalContext } from "../../GlobalContext/GlobalContext.js";
import { Button, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import Box from '@mui/material/Box';
//useAuth para ver el usuario logueado
import { useAuth } from "../../context/AuthContext.jsx";
import VerPedido from "../VerPedido/VerPedido.jsx";
import VerPedidoOnline from "../VerPedidoOnline/VerPedidoOnline.jsx";
import VerPedidoPersonal from "../VerPedidoPersonal/VerPedidoPersonal.jsx";
const defaultTheme = createTheme();

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
  const {componentToRender, setComponentToRender} = useGlobalContext();
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
  const [order, setOrder] = useState({id: "sin ID"});
  const [idOrder, setOrderId] = useState(0);

  const getPedido = () => {
    return order;
  };
  const verPedido = (id, estado, tabla) => {
    setOrderId(id);
    setPedidoSeleccionado(firebase.getOrder(id));
    // Abre el modal de edición cuando se hace clic en el icono de editar
    if(tabla === "pedidosOnline"){
      setComponentToRender(<VerPedidoOnline idPedido={id} estado={estado} />);
    }else if(tabla === "pedidosTest"){
      setComponentToRender(<VerPedido idPedido={id} estado={estado} />);
    }else if(tabla === "pedidosPersonales"){
      setComponentToRender(<VerPedidoPersonal idPedido={id} estado={estado} />);
    }
  };

  const onChangeInput = async (idOrder) => {

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
    { field: "fecha", headerName: "Fecha", width: 300 },
    { field: "direccionString", headerName: "Dirección", width: 300 },
    { field: "estado", headerName: "Estado", width: 200 },
    {
      headerName: "Acciones",
      width: 300,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={2}>
            
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
    bgcolor: 'background.paper',
    mb: 1,
    borderColor: 'text.primary',
    width: '100%',

  };
      return (
        <ThemeProvider theme={defaultTheme}>
          
          <div style={{ padding: '0 0.4rem' }}>
            <Box component="div" ><h4>Filtros de Mis pedidos</h4></Box>
            <Box sx={{ display: 'block', gridTemplateRows: 'repeat(3, 1fr)' }}>
    
              <div >
                <Box component="div" className='filtro-buttons' sx={{
                  ...commonStyles,
                  display: {
                    xs: 'flex',  // Para pantallas pequeñas (extra small), display es 'block'
                    md: 'block',   // Para pantallas medianas (medium), display es 'flex'
                    lg: 'block'
                  },
                  
                  verticalAlign: 'middle', border: 1
                }}>
    
                  <Box sx={{ textAlign: '', m: '0.1rem auto',  }}>
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
                <Box sx={{ display: '', gridTemplateColumns: 'repeat(1, 1fr)', alignContent: 'center',textAlign: 'center' ,width: { xs: '70vw', sm: '70vw', md: '70vw', lg: '70%'} }}>
                  <div>
                    <SearchInputField placeholder="Buscar por ID de orden" searchFunc={onChangeInput} />
                  </div>
    
    
                </Box>
                
              </div>
              <div >
    
                {orders.length > 0 ? (
                  <div style={{ overflowX: "auto", display: 'block' }}>
                    <DataGrid
                      rows={orders}
                      sx={{ maxWidth: '100%', width: { xs: '99vw', sm: '99vw', md: '99vw', lg: '99vw' }, textAlign: 'center' }}
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
          </div>
        </ThemeProvider>
      );
}

export default Pedidos;
