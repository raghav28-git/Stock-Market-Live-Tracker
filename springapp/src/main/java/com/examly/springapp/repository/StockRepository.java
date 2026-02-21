package com.examly.springapp.repository;

import com.examly.springapp.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    
    List<Stock> findByCompanyName(String companyName);
    
    List<Stock> findByCompanyNameContainingIgnoreCase(String companyName);
    
    List<Stock> findAllByOrderByLastUpdatedDesc();
    
    Optional<Stock> findBySymbolIgnoreCase(String symbol);
    
    List<Stock> findBySectorIgnoreCase(String sector);
    
    List<Stock> findByIsActiveTrue();
    
    @Query("SELECT s FROM Stock s WHERE s.exchange = :exchange AND s.isActive = true")
    List<Stock> findByExchangeAndIsActive(@Param("exchange") String exchange);
    
    @Query("SELECT DISTINCT s.sector FROM Stock s WHERE s.sector IS NOT NULL AND s.isActive = true")
    List<String> findDistinctSectors();
    
    @Query("SELECT DISTINCT s.exchange FROM Stock s WHERE s.exchange IS NOT NULL AND s.isActive = true")
    List<String> findDistinctExchanges();
}
