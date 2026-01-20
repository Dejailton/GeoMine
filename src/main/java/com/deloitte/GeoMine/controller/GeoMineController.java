package com.deloitte.GeoMine.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deloitte.GeoMine.model.GeoMineModel;
import com.deloitte.GeoMine.service.GeoMineService;

@RestController
@RequestMapping("/minas")
public class GeoMineController {

    private final GeoMineService service;

    public GeoMineController(GeoMineService service) {
        this.service = service;
    }

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
    public GeoMineModel criar(@RequestBody GeoMineModel mina) {
        return service.salvar(mina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeoMineModel> atualizar(@PathVariable Long id, @RequestBody GeoMineModel mina) {
        GeoMineModel atualizada = service.atualizar(id, mina);
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