package com.deloitte.GeoMine.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.FetchType;

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

    @NotNull
    private Double valorTotal; // Nova coluna adicionada

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "geo_mine_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonBackReference
    private GeoMineModel geoMineModel;

    public ProducaoModel() {}

    public ProducaoModel(LocalDate data, Double quantidade, String unidadeMedida, Double valorTotal, GeoMineModel geoMineModel) {
        this.data = data;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.valorTotal = valorTotal;
        this.geoMineModel = geoMineModel;
    }

    public Long getId() {
        return id;
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

    public Double getValorTotal() {
        return valorTotal;
    }

    public GeoMineModel getGeoMineModel() {
        return geoMineModel;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public void setGeoMineModel(GeoMineModel geoMineModel) {
        this.geoMineModel = geoMineModel;
    }
}