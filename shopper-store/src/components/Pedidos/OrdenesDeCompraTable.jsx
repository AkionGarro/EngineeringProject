import React, { useRef, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, IconButton, Hidden  } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles, withStyles } from '@mui/styles';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import { useFirebase } from '../../context/DatabaseContext';

import './OrdenesDeCompraTable.css';

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

function OrdenesDeCompraTable(){
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);

  const getOrders = (filtroParametro) => {
    firebase.getAllOrders(filtroParametro).then((data) => (setOrders(data)));
  };

  const firebase = useFirebase();

  firebase.getAllOrders(null).then((data) => (setOrders(data)));

  //console.log("ORDERS: ", orders[0].then((data) => console.log(data)));

  const handleChangePage = (event, newPage) => {

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
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
                <IconButton color="primary" aria-label="Editar">
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="Borrar">
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
  );
};

export default OrdenesDeCompraTable;
