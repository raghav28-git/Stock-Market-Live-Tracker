package com.examly.springapp.repository;

import com.examly.springapp.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId")
    List<Trade> findByUserId(@Param("userId") Long userId);
    
    List<Trade> findByStockSymbol(String symbol);
    
    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId ORDER BY t.tradeDate DESC")
    List<Trade> findByUserIdOrderByTradeDateDesc(@Param("userId") Long userId);
}