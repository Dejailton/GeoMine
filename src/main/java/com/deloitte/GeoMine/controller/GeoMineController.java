package com.deloitte.GeoMine.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deloitte.GeoMine.dto.GeoMineDTO;
import jakarta.validation.Valid;

import com.deloitte.GeoMine.model.GeoMineModel;
import com.deloitte.GeoMine.service.GeoMineService;

@RestController
@RequestMapping("/minas")
public class GeoMineController {

    @Autowired
    private GeoMineService service;

    @GetMapping
    public List<GeoMineModel> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeoMineModel> buscarPorId(@PathVariable Long id) {
        GeoMineModel mina = service.buscarPorId(id);
        if (mina == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mina);
    }

    @PostMapping
    public GeoMineModel criar(@Valid @RequestBody GeoMineDTO dto) {
        GeoMineModel mina = new GeoMineModel(dto.nome(), dto.localizacao(), dto.mineral(), dto.ativa());
        return service.salvar(mina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody GeoMineDTO dto) {
        GeoMineModel existente = service.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        GeoMineModel paraAtualizar = new GeoMineModel(dto.nome(), dto.localizacao(), dto.mineral(), dto.ativa());
        GeoMineModel atualizada = service.atualizar(id, paraAtualizar);
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