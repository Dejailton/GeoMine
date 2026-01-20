package com.deloitte.GeoMine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.deloitte.GeoMine.model.GeoMineModel;

public interface GeoMineRepository extends JpaRepository<GeoMineModel, Long> {
}