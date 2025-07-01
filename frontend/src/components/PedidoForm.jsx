import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Box, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import api from '../services/api';

export default function PedidoForm({ onPedidoCriado, pedidoEditando, onLimparEdicao }) {
  const [cliente, setCliente] = useState('');
  const [itens, setItens] = useState([{ produto: '', quantidade: 1, precoUnitario: 0 }]);

  useEffect(() => {
    if (pedidoEditando) {
      setCliente(pedidoEditando.cliente);
      setItens(pedidoEditando.itens.map(i => ({
        produto: i.produto,
        quantidade: i.quantidade,
        precoUnitario: i.precoUnitario
      })));
    }
  }, [pedidoEditando]);

  const handleChangeItem = (index, field, value) => {
    const novos = [...itens];
    novos[index][field] = value;
    setItens(novos);
  };

  const adicionarItem = () => {
    setItens([...itens, { produto: '', quantidade: 1, precoUnitario: 0 }]);
  };

  const salvar = () => {
    if (pedidoEditando) {
      api.put(`/pedidos/${pedidoEditando.id}`, { cliente, itens })
        .then(() => {
          onPedidoCriado();
          setCliente('');
          setItens([{ produto: '', quantidade: 1, precoUnitario: 0 }]);
          onLimparEdicao();
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            alert('Este pedido ou item já foi excluído!');
            onPedidoCriado();
            setCliente('');
            setItens([{ produto: '', quantidade: 1, precoUnitario: 0 }]);
            onLimparEdicao();
          } else {
            alert('Erro ao atualizar o pedido!');
          }
        });
    } else {
      api.post('/pedidos', { cliente, itens })
        .then(() => {
          onPedidoCriado();
          setCliente('');
          setItens([{ produto: '', quantidade: 1, precoUnitario: 0 }]);
        })
        .catch(() => alert('Erro ao criar o pedido!'));
    }
  };

  const resetarCampos = () => {
    setCliente('');
    setItens([{ produto: '', quantidade: 1, precoUnitario: 0 }]);
  };

  const onCancelarEdicao = () => {
    resetarCampos();
    onLimparEdicao();
  };

  const deletarItem = (index) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  // Função para formatar em reais
  const formatarReais = valor =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // Calcula o total de cada item
  const totalItem = (item) => Number(item.quantidade) * Number(item.precoUnitario);

  // Calcula o total geral do pedido
  const totalGeral = itens.reduce((acc, item) => acc + totalItem(item), 0);

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5">{pedidoEditando ? 'Editar Pedido' : 'Novo Pedido'}</Typography>
      <TextField
        label="Cliente"
        value={cliente}
        onChange={e => setCliente(e.target.value)}
        fullWidth
        margin="normal"
      />
      {itens.map((item, index) => (
        <Box key={index} display="flex" gap={2} marginBottom={2} alignItems="center">
          <TextField
            label="Produto"
            value={item.produto}
            onChange={e => handleChangeItem(index, 'produto', e.target.value)}
          />
          <TextField
            label="Quantidade"
            type="number"
            value={item.quantidade}
            onChange={e => handleChangeItem(index, 'quantidade', e.target.value)}
          />
          <TextField
            label="Preço Unitário"
            type="number"
            value={item.precoUnitario}
            onChange={e => handleChangeItem(index, 'precoUnitario', e.target.value)}
            InputProps={{
              endAdornment: <span>R$</span>
            }}
          />
          <Typography variant="body2" style={{ minWidth: 90 }}>
            {formatarReais(totalItem(item))}
          </Typography>
          <Button
            startIcon={<RemoveIcon />}
            onClick={() => { deletarItem(index); }}
          />
        </Box>
      ))}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Button
          startIcon={<AddIcon />}
          onClick={adicionarItem}
        >
          Adicionar Item
        </Button>
        <Typography variant="h6">
          Total do Pedido: {formatarReais(totalGeral)}
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={salvar}>
        {pedidoEditando ? 'Salvar Alterações' : 'Salvar Pedido'}
      </Button>
      {pedidoEditando && (
        <Button style={{ marginLeft: 10 }} onClick={onCancelarEdicao}>
          Cancelar
        </Button>
      )}
    </Paper>
  );
}