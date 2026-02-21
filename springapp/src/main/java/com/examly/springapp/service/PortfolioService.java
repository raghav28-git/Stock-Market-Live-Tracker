package com.examly.springapp.service;

import com.examly.springapp.model.Portfolio;
import com.examly.springapp.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {
    @Autowired
    private PortfolioRepository portfolioRepository;

    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    public List<Portfolio> getPortfoliosByUserId(Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public Portfolio getPortfolioById(Long id) {
        return portfolioRepository.findById(id).orElseThrow(() -> new RuntimeException("Portfolio not found"));
    }

    public Portfolio createPortfolio(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    public Portfolio updatePortfolio(Long id, Portfolio portfolioDetails) {
        Portfolio portfolio = getPortfolioById(id);
        portfolio.setPortfolioName(portfolioDetails.getPortfolioName());
        portfolio.setUser(portfolioDetails.getUser());
        portfolio.setTotalValue(portfolioDetails.getTotalValue());
        portfolio.setIsActive(portfolioDetails.getIsActive());
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> getPortfolioByUserId(Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public void deletePortfolio(Long id) {
        portfolioRepository.deleteById(id);
    }
}
