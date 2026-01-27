package com.deloitte.GeoMine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.deloitte.GeoMine.model.ProducaoModel;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface ProducaoRepository extends JpaRepository<ProducaoModel, Long> {
    List<ProducaoModel> findByGeoMineModelId(Long geoMineId);
    Optional<ProducaoModel> findByGeoMineModelIdAndData(Long geoMineId, LocalDate data);
}
