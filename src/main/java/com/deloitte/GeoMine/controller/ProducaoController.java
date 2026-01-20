package com.deloitte.GeoMine.controller;


import com.deloitte.GeoMine.model.ProducaoModel;
import com.deloitte.GeoMine.service.ProducaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/producoes")
public class ProducaoController {

    @Autowired
    private ProducaoService service;

    @GetMapping
    public List<ProducaoModel> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProducaoModel> buscarPorId(@PathVariable Long id) {
        ProducaoModel producao = service.buscarPorId(id);
        if (producao == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producao);
    }

    @PostMapping
    public ProducaoModel criar(@RequestBody ProducaoModel producao) {
        return service.salvar(producao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProducaoModel> atualizar(@PathVariable Long id, @RequestBody ProducaoModel producao) {
        ProducaoModel atualizada = service.atualizar(id, producao);
        if (atualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(atualizada);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
