package com.programacaoweb.backend.controller;

import com.programacaoweb.backend.model.Pedido;
import com.programacaoweb.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    @PostMapping
    public Pedido criar(@RequestBody Pedido pedido) {
        pedido.getItens().forEach(i -> i.setPedido(pedido));
        return pedidoRepository.save(pedido);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        pedidoRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Pedido atualizar(@PathVariable Long id, @RequestBody Pedido pedidoAtualizado) {
        return pedidoRepository.findById(id).map(pedido -> {

            try {
                pedido.setCliente(pedidoAtualizado.getCliente());

                pedido.getItens().clear();

                if (pedidoAtualizado.getItens() != null) {
                    pedidoAtualizado.getItens().forEach(item -> {
                        item.setPedido(pedido);
                        pedido.getItens().add(item);
                    });
                }
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro ao atualizar o pedido: " + e.getMessage());
            }

            return pedidoRepository.save(pedido);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}