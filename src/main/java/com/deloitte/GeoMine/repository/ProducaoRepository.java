package com.deloitte.GeoMine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.deloitte.GeoMine.model.ProducaoModel;


public interface ProducaoRepository extends JpaRepository<ProducaoModel, Long> {
}
