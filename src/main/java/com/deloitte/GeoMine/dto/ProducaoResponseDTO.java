package com.deloitte.GeoMine.dto;

public record ProducaoResponseDTO(
        Long id,
        String data,
        Double quantidade,
        String unidadeMedida,
        Double valorTotal,
        Long geoMineId
) {}
