package com.deloitte.GeoMine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.deloitte.GeoMine.model.ProducaoModel;
import java.util.List;


public interface ProducaoRepository extends JpaRepository<ProducaoModel, Long> {
    List<ProducaoModel> findByGeoMineModelId(Long geoMineId);
}
