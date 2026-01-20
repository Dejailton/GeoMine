package com.deloitte.GeoMine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deloitte.GeoMine.model.ProducaoModel;
import com.deloitte.GeoMine.repository.ProducaoRepository;

@Service
public class ProducaoService {

    @Autowired
    private ProducaoRepository repository;

    public List<ProducaoModel> listarTodas() {
        return repository.findAll();
    }

    public ProducaoModel buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public ProducaoModel salvar(ProducaoModel producao) {
        return repository.save(producao);
    }

    public ProducaoModel atualizar(Long id, ProducaoModel producaoAtualizada) {
        ProducaoModel producao = buscarPorId(id);
        if (producao == null) {
            return null;
        }

        producao.setData(producaoAtualizada.getData());
        producao.setQuantidade(producaoAtualizada.getQuantidade());
        producao.setUnidadeMedida(producaoAtualizada.getUnidadeMedida());
        producao.setGeoMineModel(producaoAtualizada.getGeoMineModel());
        producao.setValorTotal(producaoAtualizada.getValorTotal());

        return repository.save(producao);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}