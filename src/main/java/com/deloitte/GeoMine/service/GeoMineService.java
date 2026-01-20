package com.deloitte.GeoMine.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deloitte.GeoMine.model.GeoMineModel;
import com.deloitte.GeoMine.repository.GeoMineRepository;

@Service
public class GeoMineService {

    @Autowired
    private GeoMineRepository repository;

    public List<GeoMineModel> listarTodas() {
        return repository.findAll();
    }

    public GeoMineModel buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public GeoMineModel salvar(GeoMineModel mina) {
        return repository.save(mina);
    }

    public GeoMineModel atualizar(Long id, GeoMineModel minaAtualizada) {
        GeoMineModel mina = buscarPorId(id);
        if (mina == null) {
            return null;
        }

        mina.setNome(minaAtualizada.getNome());
        mina.setLocalizacao(minaAtualizada.getLocalizacao());
        mina.setMineral(minaAtualizada.getMineral());
        mina.setAtiva(minaAtualizada.isAtiva());

        return repository.save(mina);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}