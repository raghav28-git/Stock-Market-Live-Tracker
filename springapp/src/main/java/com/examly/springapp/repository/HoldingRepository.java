package com.examly.springapp.repository;

import com.examly.springapp.model.Holding;
import com.examly.springapp.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {
    
    List<Holding> findByPortfolio(Portfolio portfolio);
    
    List<Holding> findByPortfolioId(Long portfolioId);
    
    Optional<Holding> findByPortfolioAndSymbol(Portfolio portfolio, String symbol);
    
    @Query("SELECT h FROM Holding h WHERE h.portfolio.user.id = :userId")
    List<Holding> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT h FROM Holding h WHERE h.symbol = :symbol")
    List<Holding> findBySymbol(@Param("symbol") String symbol);
    
    @Query("SELECT DISTINCT h.symbol FROM Holding h WHERE h.portfolio.user.id = :userId")
    List<String> findDistinctSymbolsByUserId(@Param("userId") Long userId);
}