package com.deloitte.GeoMine.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@Entity
@Table(name = "producao")
public class ProducaoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDate data;

    @NotNull
    @Positive
    private Double quantidade;

    @NotNull
    private String unidadeMedida;

    @ManyToOne
    @JoinColumn(name = "geo_mine_id")
    private GeoMineModel geoMineModel;


    public ProducaoModel() {

    }
    public ProducaoModel(LocalDate data, Double quantidade, String unidadeMedida, GeoMineModel geoMineModel) {
        this.data = data;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.geoMineModel = geoMineModel;
    }


    public LocalDate getData() {
        return data;
    }

    public Double getQuantidade() {
        return quantidade;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public GeoMineModel getGeoMineModel() {
        return geoMineModel;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public void setQuantidade(@Positive Double quantidade) {
        this.quantidade = quantidade;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public void setGeoMineModel(GeoMineModel geoMineModel) {
        this.geoMineModel = geoMineModel;
    }
}
