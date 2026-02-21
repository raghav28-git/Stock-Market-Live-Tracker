package com.examly.springapp.service;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PortfolioManagementService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private HoldingRepository holdingRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private MarketDataRepository marketDataRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Portfolio> getUserPortfolios(Long userId) {
        return portfolioRepository.findActivePortfoliosByUserId(userId);
    }

    public Portfolio createPortfolio(Long userId, String portfolioName, String description) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            Portfolio portfolio = new Portfolio(portfolioName, userOpt.get());
            portfolio.setDescription(description);
            return portfolioRepository.save(portfolio);
        }
        throw new RuntimeException("User not found");
    }

    public Portfolio getPortfolioById(Long portfolioId) {
        return portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
    }

    public List<Holding> getPortfolioHoldings(Long portfolioId) {
        return holdingRepository.findByPortfolioId(portfolioId);
    }

    public Holding addHolding(Long portfolioId, String symbol, BigDecimal quantity, BigDecimal price) {
        Portfolio portfolio = getPortfolioById(portfolioId);
        
        Optional<Holding> existingHolding = holdingRepository.findByPortfolioAndSymbol(portfolio, symbol.toUpperCase());
        
        Holding savedHolding;
        if (existingHolding.isPresent()) {
            // Update existing holding
            Holding holding = existingHolding.get();
            BigDecimal totalCost = holding.getAverageCost().multiply(holding.getQuantity())
                    .add(price.multiply(quantity));
            BigDecimal totalQuantity = holding.getQuantity().add(quantity);
            BigDecimal newAverageCost = totalCost.divide(totalQuantity, 4, RoundingMode.HALF_UP);
            
            holding.setQuantity(totalQuantity);
            holding.setAverageCost(newAverageCost);
            holding.setLastUpdated(LocalDateTime.now());
            
            savedHolding = holdingRepository.save(holding);
        } else {
            // Create new holding
            Holding holding = new Holding(portfolio, symbol.toUpperCase(), quantity, price);
            
            // Get company name from market data
            Optional<MarketData> marketData = marketDataRepository.findBySymbol(symbol.toUpperCase());
            if (marketData.isPresent()) {
                holding.setCompanyName(marketData.get().getCompanyName());
                holding.setCurrentPrice(marketData.get().getCurrentPrice());
            }
            
            savedHolding = holdingRepository.save(holding);
        }
        
        // Update portfolio value after adding holding
        updatePortfolioValue(portfolioId);
        
        return savedHolding;
    }

    public void removeHolding(Long holdingId) {
        holdingRepository.deleteById(holdingId);
    }

    public Transaction recordTransaction(Long portfolioId, String symbol, Transaction.TransactionType type, 
                                      BigDecimal quantity, BigDecimal price) {
        Portfolio portfolio = getPortfolioById(portfolioId);
        
        Transaction transaction = new Transaction(portfolio, symbol.toUpperCase(), type, quantity, price);
        transaction.setTotalAmount(quantity.multiply(price));
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Update holdings based on transaction
        if (type == Transaction.TransactionType.BUY) {
            addHolding(portfolioId, symbol, quantity, price);
        } else if (type == Transaction.TransactionType.SELL) {
            sellHolding(portfolioId, symbol, quantity);
        }
        
        updatePortfolioValue(portfolioId);
        return savedTransaction;
    }

    private void sellHolding(Long portfolioId, String symbol, BigDecimal quantity) {
        Portfolio portfolio = getPortfolioById(portfolioId);
        Optional<Holding> holdingOpt = holdingRepository.findByPortfolioAndSymbol(portfolio, symbol.toUpperCase());
        
        if (holdingOpt.isPresent()) {
            Holding holding = holdingOpt.get();
            BigDecimal newQuantity = holding.getQuantity().subtract(quantity);
            
            if (newQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                holdingRepository.delete(holding);
            } else {
                holding.setQuantity(newQuantity);
                holding.setLastUpdated(LocalDateTime.now());
                holdingRepository.save(holding);
            }
        }
    }

    public void updatePortfolioValue(Long portfolioId) {
        List<Holding> holdings = holdingRepository.findByPortfolioId(portfolioId);
        BigDecimal totalValue = BigDecimal.ZERO;
        
        for (Holding holding : holdings) {
            Optional<MarketData> marketData = marketDataRepository.findBySymbol(holding.getSymbol());
            BigDecimal marketValue;
            
            if (marketData.isPresent()) {
                BigDecimal currentPrice = marketData.get().getCurrentPrice();
                holding.setCurrentPrice(currentPrice);
                marketValue = currentPrice.multiply(holding.getQuantity());
                
                BigDecimal unrealizedGainLoss = marketValue.subtract(
                    holding.getAverageCost().multiply(holding.getQuantity())
                );
                holding.setUnrealizedGainLoss(unrealizedGainLoss);
            } else {
                // Use average cost if no market data available
                marketValue = holding.getAverageCost().multiply(holding.getQuantity());
                holding.setUnrealizedGainLoss(BigDecimal.ZERO);
            }
            
            holding.setMarketValue(marketValue);
            holdingRepository.save(holding);
            totalValue = totalValue.add(marketValue);
        }
        
        Portfolio portfolio = getPortfolioById(portfolioId);
        portfolio.setTotalValue(totalValue);
        portfolio.setLastUpdated(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }

    public List<Transaction> getPortfolioTransactions(Long portfolioId) {
        return transactionRepository.findByPortfolioId(portfolioId);
    }

    public void deletePortfolio(Long portfolioId) {
        Portfolio portfolio = getPortfolioById(portfolioId);
        portfolio.setIsActive(false);
        portfolioRepository.save(portfolio);
    }
}