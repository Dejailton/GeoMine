package com.deloitte.GeoMine.controller;
import java.math.BigDecimal;
import java.util.List;

import com.deloitte.GeoMine.dto.GeoMineDTO;
import com.deloitte.GeoMine.dto.RelatorioValorDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.deloitte.GeoMine.model.GeoMineModel;
import com.deloitte.GeoMine.service.GeoMineService;

@RestController
@RequestMapping("/mina")
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
    public ResponseEntity<GeoMineModel> criar(@Valid @RequestBody GeoMineDTO dto) {
        GeoMineModel mina = new GeoMineModel();
        mina.setNome(dto.nome());
        mina.setLocalizacao(dto.localizacao());
        mina.setMineral(dto.mineral());
        mina.setAtiva(dto.ativa());
        GeoMineModel salva = service.salvar(mina);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeoMineModel> atualizar(@PathVariable Long id, @Valid @RequestBody GeoMineDTO dto) {
        GeoMineModel existente = service.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        GeoMineModel paraAtualizar = new GeoMineModel();
        paraAtualizar.setNome(dto.nome());
        paraAtualizar.setLocalizacao(dto.localizacao());
        paraAtualizar.setMineral(dto.mineral());
        paraAtualizar.setAtiva(dto.ativa());

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

    @GetMapping("/{id}/relatorio")
    public ResponseEntity<RelatorioValorDTO> valorTotalPorMina(@PathVariable Long id) {
        GeoMineModel mina = service.buscarPorId(id);
        if (mina == null) {
            return ResponseEntity.notFound().build();
        }

        double total = service.relatorioValorTotalPorMina(id);
        RelatorioValorDTO dto = new RelatorioValorDTO(mina.getNome(), mina.getLocalizacao(), mina.getMineral(), total);
        return ResponseEntity.ok(dto);
    }
}