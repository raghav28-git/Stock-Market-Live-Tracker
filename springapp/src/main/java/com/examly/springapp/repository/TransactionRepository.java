package com.examly.springapp.repository;

import com.examly.springapp.model.Transaction;
import com.examly.springapp.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByPortfolio(Portfolio portfolio);
    
    List<Transaction> findByPortfolioId(Long portfolioId);
    
    List<Transaction> findBySymbol(String symbol);
    
    @Query("SELECT t FROM Transaction t WHERE t.portfolio.user.id = :userId ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdOrderByTransactionDateDesc(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Transaction t WHERE t.portfolio.id = :portfolioId AND t.symbol = :symbol ORDER BY t.transactionDate DESC")
    List<Transaction> findByPortfolioIdAndSymbolOrderByTransactionDateDesc(@Param("portfolioId") Long portfolioId, @Param("symbol") String symbol);
    
    @Query("SELECT t FROM Transaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByTransactionDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.portfolio.user.id = :userId AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndTransactionDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}