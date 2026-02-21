package com.examly.springapp.repository;

import com.examly.springapp.model.PriceAlert;
import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceAlertRepository extends JpaRepository<PriceAlert, Long> {
    
    List<PriceAlert> findByUser(User user);
    
    List<PriceAlert> findByUserId(Long userId);
    
    List<PriceAlert> findBySymbol(String symbol);
    
    @Query("SELECT p FROM PriceAlert p WHERE p.user.id = :userId AND p.isActive = true")
    List<PriceAlert> findActiveAlertsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM PriceAlert p WHERE p.symbol = :symbol AND p.isActive = true AND p.isTriggered = false")
    List<PriceAlert> findActiveUntriggeredAlertsBySymbol(@Param("symbol") String symbol);
    
    @Query("SELECT p FROM PriceAlert p WHERE p.isActive = true AND p.isTriggered = false")
    List<PriceAlert> findAllActiveUntriggeredAlerts();
    
    @Query("SELECT p FROM PriceAlert p WHERE p.user.id = :userId AND p.symbol = :symbol AND p.isActive = true")
    List<PriceAlert> findByUserIdAndSymbolAndIsActive(@Param("userId") Long userId, @Param("symbol") String symbol);
}