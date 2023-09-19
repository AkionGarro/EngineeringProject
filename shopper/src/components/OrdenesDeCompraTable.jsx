import React from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, IconButton, Hidden  } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles, withStyles } from '@mui/styles';
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';

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

const rows = [
  {
    id: '1',
    cliente: 'Cliente 1',
    telefono: '+1234567890',
    direccion: 'Dirección 1',
    estado: 'Pendiente',
  },
  {
    id: '2',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '3',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '4',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '5',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '6',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '7',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '8',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '9',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '10',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  {
    id: '11',
    cliente: 'Cliente 2',
    telefono: '+9876543210',
    direccion: 'Dirección 2',
    estado: 'En proceso',
  },
  // Agrega más datos de ejemplo aquí
];

function OrdenesDeCompraTable(){
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
            <StyledTableCell className="hide-on-mobile">Acción</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.cliente}</TableCell>
              <TableCell>
                <a href={`https://wa.me/${row.telefono}`} target="_blank" rel="noopener noreferrer">
                  <IconButton color="primary" aria-label="Chat en WhatsApp">
                    <WhatsAppIcon />
                  </IconButton>
                </a>
              </TableCell>
              <TableCell className="hide-on-mobile">{row.direccion}</TableCell>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default OrdenesDeCompraTable;
