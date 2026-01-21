package com.deloitte.GeoMine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GeoMineDTO(
        @NotBlank String nome,
        @NotBlank String localizacao,
        @NotBlank String mineral,
        @NotNull Boolean ativa
) {
}
