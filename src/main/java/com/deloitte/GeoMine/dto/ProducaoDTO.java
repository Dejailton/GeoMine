package com.deloitte.GeoMine.dto;

import com.deloitte.GeoMine.model.Unidade;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record ProducaoDTO(
        @NotNull LocalDate data,
        @NotNull @Positive Double quantidade,
        @NotNull Unidade unidadeMedida,
        @NotNull @Positive Double valorTotal,
        @NotNull @Positive Long geoMineId
) {
}
