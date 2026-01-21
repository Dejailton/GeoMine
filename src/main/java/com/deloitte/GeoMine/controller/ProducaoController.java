package com.deloitte.GeoMine.controller;


import com.deloitte.GeoMine.dto.ProducaoDTO;
import com.deloitte.GeoMine.model.GeoMineModel;
import com.deloitte.GeoMine.model.ProducaoModel;
import com.deloitte.GeoMine.repository.GeoMineRepository;
import com.deloitte.GeoMine.service.ProducaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/producoes")
public class ProducaoController {

    @Autowired
    private ProducaoService service;

    @Autowired
    private GeoMineRepository geoMineRepository;

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
    public ResponseEntity<?> criar(@Valid @RequestBody ProducaoDTO dto) {
        Optional<GeoMineModel> geoOpt = geoMineRepository.findById(dto.geoMineId());
        if (geoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("GeoMine not found with id: " + dto.geoMineId());
        }

        ProducaoModel producao = new ProducaoModel(
                dto.data(),
                dto.quantidade(),
                dto.unidadeMedida(),
                dto.valorTotal(),
                geoOpt.get()
        );

        ProducaoModel saved = service.salvar(producao);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody ProducaoDTO dto) {
        // verificar existência da producao
        ProducaoModel existente = service.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        // verificar geoMine
        Optional<GeoMineModel> geoOpt = geoMineRepository.findById(dto.geoMineId());
        if (geoOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("GeoMine not found with id: " + dto.geoMineId());
        }

        ProducaoModel paraAtualizar = new ProducaoModel(
                dto.data(),
                dto.quantidade(),
                dto.unidadeMedida(),
                dto.valorTotal(),
                geoOpt.get()
        );

        ProducaoModel atualizada = service.atualizar(id, paraAtualizar);
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
