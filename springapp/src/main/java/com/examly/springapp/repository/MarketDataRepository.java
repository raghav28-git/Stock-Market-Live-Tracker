package com.examly.springapp.repository;

import com.examly.springapp.model.MarketData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarketDataRepository extends JpaRepository<MarketData, Long> {
    
    Optional<MarketData> findBySymbol(String symbol);
    
    List<MarketData> findBySymbolIn(List<String> symbols);
    
    @Query("SELECT m FROM MarketData m WHERE m.companyName LIKE %:companyName%")
    List<MarketData> findByCompanyNameContaining(@Param("companyName") String companyName);
    
    @Query("SELECT m FROM MarketData m WHERE m.isActive = true ORDER BY m.volume DESC")
    List<MarketData> findActiveStocksOrderByVolumeDesc();
    
    @Query("SELECT m FROM MarketData m WHERE m.isActive = true ORDER BY m.currentPrice DESC")
    List<MarketData> findActiveStocksOrderByPriceDesc();
    
    @Query("SELECT m FROM MarketData m WHERE m.timestamp >= :since ORDER BY m.timestamp DESC")
    List<MarketData> findRecentUpdates(@Param("since") LocalDateTime since);
    
    @Query("SELECT m FROM MarketData m WHERE m.exchange = :exchange AND m.isActive = true")
    List<MarketData> findByExchange(@Param("exchange") String exchange);
    
    @Query("SELECT DISTINCT m.exchange FROM MarketData m WHERE m.isActive = true")
    List<String> findDistinctExchanges();
}