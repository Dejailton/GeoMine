package com.deloitte.GeoMine.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deloitte.GeoMine.model.GeoMineModel;
import com.deloitte.GeoMine.model.ProducaoModel;
import com.deloitte.GeoMine.model.Unidade;
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

    public double relatorioValorTotalPorMina(Long id) {
        Optional<GeoMineModel> mina = repository.findById(id);
        if (mina.isEmpty()) {
            return 0.0;
        }
        if (mina.get().getProducoes() == null || mina.get().getProducoes().isEmpty()) {
            return 0.0;
        }

        double total = 0.0;

        for (ProducaoModel producao : mina.get().getProducoes()) {
            Double valor = producao.getValorTotal();
            if (valor != null) {
                total += valor;
            }
        }
        return total;
    }

    public double relatorioQuantidadeTotalPorMina(Long id) {
        Optional<GeoMineModel> mina = repository.findById(id);
        if (mina.isEmpty()) {
            return 0.0;
        }
        if (mina.get().getProducoes() == null || mina.get().getProducoes().isEmpty()) {
            return 0.0;
        }

        double totalQuantidadeKg = 0.0;
        for (ProducaoModel producao : mina.get().getProducoes()) {
            Double qtd = producao.getQuantidade();
            if (qtd == null) continue;
            Unidade u = producao.getUnidadeMedida();
            if (u == null) {
                totalQuantidadeKg += qtd;
                continue;
            }
            switch (u) {
                case KG:
                    totalQuantidadeKg += qtd;
                    break;
                case G:
                    totalQuantidadeKg += qtd / 1000.0;
                    break;
                case T:
                    totalQuantidadeKg += qtd * 1000.0;
                    break;
                default:
                    totalQuantidadeKg += qtd;
            }
        }
        return totalQuantidadeKg;
    }
}