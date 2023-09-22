import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {firestore} from "../../firebase";
import { getDocs, getDoc,collection, doc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DetallePedidoModal from '../../components/EditPeronalOrde/OrderDetailsModal'; 


function Ver_pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); 
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [idselc, setidselc] = useState(null);
  const rows = pedidos;

  useEffect(() => {
    const obtenerColeccion = async () => {
      try {
        const collectionRef = collection(firestore, 'pedidosPersonales');
        const querySnapshot = await getDocs(collectionRef);
  
        const pedidosData = [];
        querySnapshot.forEach((doc) => {
          pedidosData.push({ id: doc.id, ...doc.data() });
        });
        setPedidos(pedidosData);
      } catch (error) {
        console.error('Error al obtener la colección:', error);
      }
    };

    obtenerColeccion();
  }, []);

  const handleEditar = async (id) => {
    try {
      const pedidoRef = doc(firestore, 'pedidosPersonales', id);
      const pedidoSnapshot = await getDoc(pedidoRef);
      if (pedidoSnapshot.exists()) {
        const pedidoData = pedidoSnapshot.data();
        setPedidoSeleccionado(pedidoData);
        setidselc(id);
        setModalVisible(true);
      } else {
        console.log('El documento no existe');
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
    }
  };
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'usuario', headerName: 'Cliente', width: 150 },
    { field: 'telefono', headerName: 'Telefono', width: 150 },
    {
      field: 'direccion',
      headerName: 'Dirección',
      width: 150,
    },
    { field: 'estado', headerName: 'Estado', width: 150 },
    { headerName: 'Acciones', 
      width: 300,
      renderCell: (params) => (
        <div>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined"  startIcon={<DeleteIcon />}>
            </Button>
            <Button variant="outlined"  onClick={() => handleEditar(params.row.id)} startIcon={<BorderColorRoundedIcon />}>
            </Button>
          </Stack>
        </div>
      ), }
  ]

  const closeModal = () => {
    setModalVisible(false);
  };  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '90%', overflowX: 'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        autoHeight 
      />
      {pedidoSeleccionado && (
        <DetallePedidoModal
          visible={modalVisible}
          onCancel={closeModal}
          idModal={idselc}
        />
      )}
      </div>
    </div>
  );
}

export default Ver_pedidos;
