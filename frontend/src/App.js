import React, { useEffect, useState } from 'react';
import PedidoForm from './components/PedidoForm';
import PedidoList from './components/PedidoList';
import { Container, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import api from './services/api';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  const carregarPedidos = () => {
    api.get('/pedidos')
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <Typography variant="h4" style={{ marginTop: 20 }}>Sistema de Pedidos</Typography>
        <PedidoForm
          onPedidoCriado={carregarPedidos}
          pedidoEditando={pedidoEditando}
          onLimparEdicao={() => setPedidoEditando(null)}
        />
        <PedidoList
          pedidos={pedidos}
          setPedidos={setPedidos}
          onEditarPedido={setPedidoEditando}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;