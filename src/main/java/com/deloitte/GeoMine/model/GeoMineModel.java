package com.deloitte.GeoMine.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.deloitte.GeoMine.model.ProducaoModel;

import java.util.List;

@Entity
@Table(name= "geo_mine_model")
public class GeoMineModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nome;

    @NotNull
    private String localizacao;

    @NotNull
    private String mineral;


    @OneToMany(mappedBy = "geoMineModel", cascade = CascadeType.ALL)
    private List<ProducaoModel> producoes;

    private boolean ativa;

    public GeoMineModel() {
    }

    public GeoMineModel(String nome, String localizacao, String mineral, boolean ativa) {
        this.nome = nome;
        this.localizacao = localizacao;
        this.mineral = mineral;
        this.ativa = ativa;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getMineral() {
        return mineral;
    }

    public void setMineral(String mineral) {
        this.mineral = mineral;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }
}