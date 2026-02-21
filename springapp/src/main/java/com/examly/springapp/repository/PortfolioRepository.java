package com.examly.springapp.repository;

import com.examly.springapp.model.Portfolio;
import com.examly.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByUser(User user);
    
    List<Portfolio> findByUserId(Long userId);
    
    Optional<Portfolio> findByUserAndPortfolioName(User user, String portfolioName);
    
    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId AND p.isActive = true")
    List<Portfolio> findActivePortfoliosByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Portfolio p WHERE p.isPublic = true AND p.isActive = true")
    List<Portfolio> findPublicPortfolios();
    
    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId AND p.portfolioName LIKE %:name%")
    List<Portfolio> findByUserIdAndPortfolioNameContaining(@Param("userId") Long userId, @Param("name") String name);
    
    @Query("SELECT COUNT(p) FROM Portfolio p WHERE p.user.id = :userId AND p.isActive = true")
    Long countActivePortfoliosByUserId(@Param("userId") Long userId);
}
