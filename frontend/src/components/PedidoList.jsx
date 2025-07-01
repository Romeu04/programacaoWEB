import React from 'react';
import api from '../services/api';
import {
  Typography, List, ListItem, ListItemText, IconButton, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function PedidoList({ pedidos, setPedidos, onEditarPedido }) {
  const excluir = (id) => {
    api.delete(`/pedidos/${id}`).then(() => {
      setPedidos(pedidos.filter(p => p.id !== id));
    });
  };

  return (
    <Paper style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h5">Lista de Pedidos</Typography>
      <List>
        {(Array.isArray(pedidos) ? pedidos : []).map(p => (
          <ListItem
            key={p.id}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => onEditarPedido(p)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => excluir(p.id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={`Cliente: ${p.cliente}`}
              secondary={`Criado em: ${new Date(p.dataCriacao).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}