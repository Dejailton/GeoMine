package com.deloitte.GeoMine.model;

import jakarta.persistence.*;

@Entity
@Table(name= "geo_mine_model")
public class GeoMineModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String localizacao;
    private String mineral;
    private String status;

    public GeoMineModel() {
    }

    public GeoMineModel(String nome, String localizacao, String mineral, String status) {
        this.nome = nome;
        this.localizacao = localizacao;
        this.mineral = mineral;
        this.status = status;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}