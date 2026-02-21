package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.service.PortfolioManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = {"https://8081-*.premiumproject.examly.io", "http://localhost:3000"})
public class PortfolioManagementController {

    @Autowired
    private PortfolioManagementService portfolioService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Portfolio>> getUserPortfolios(@PathVariable Long userId) {
        List<Portfolio> portfolios = portfolioService.getUserPortfolios(userId);
        return ResponseEntity.ok(portfolios);
    }

    @PostMapping("/create")
    public ResponseEntity<Portfolio> createPortfolio(@RequestBody Map<String, Object> portfolioData) {
        Long userId = Long.valueOf(portfolioData.get("userId").toString());
        String portfolioName = portfolioData.get("portfolioName").toString();
        String description = portfolioData.get("description") != null ? 
                           portfolioData.get("description").toString() : "";
        
        Portfolio portfolio = portfolioService.createPortfolio(userId, portfolioName, description);
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/{portfolioId}")
    public ResponseEntity<Portfolio> getPortfolio(@PathVariable Long portfolioId) {
        Portfolio portfolio = portfolioService.getPortfolioById(portfolioId);
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/{portfolioId}/holdings")
    public ResponseEntity<List<Holding>> getPortfolioHoldings(@PathVariable Long portfolioId) {
        List<Holding> holdings = portfolioService.getPortfolioHoldings(portfolioId);
        return ResponseEntity.ok(holdings);
    }

    @PostMapping("/{portfolioId}/holdings")
    public ResponseEntity<Holding> addHolding(@PathVariable Long portfolioId, 
                                            @RequestBody Map<String, Object> holdingData) {
        String symbol = holdingData.get("symbol").toString();
        BigDecimal quantity = new BigDecimal(holdingData.get("quantity").toString());
        BigDecimal price = new BigDecimal(holdingData.get("price").toString());
        
        Holding holding = portfolioService.addHolding(portfolioId, symbol, quantity, price);
        return ResponseEntity.ok(holding);
    }

    @DeleteMapping("/holdings/{holdingId}")
    public ResponseEntity<?> removeHolding(@PathVariable Long holdingId) {
        portfolioService.removeHolding(holdingId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{portfolioId}/transactions")
    public ResponseEntity<Transaction> recordTransaction(@PathVariable Long portfolioId,
                                                       @RequestBody Map<String, Object> transactionData) {
        String symbol = transactionData.get("symbol").toString();
        Transaction.TransactionType type = Transaction.TransactionType.valueOf(
            transactionData.get("type").toString().toUpperCase()
        );
        BigDecimal quantity = new BigDecimal(transactionData.get("quantity").toString());
        BigDecimal price = new BigDecimal(transactionData.get("price").toString());
        
        Transaction transaction = portfolioService.recordTransaction(portfolioId, symbol, type, quantity, price);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/{portfolioId}/transactions")
    public ResponseEntity<List<Transaction>> getPortfolioTransactions(@PathVariable Long portfolioId) {
        List<Transaction> transactions = portfolioService.getPortfolioTransactions(portfolioId);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{portfolioId}/update-value")
    public ResponseEntity<?> updatePortfolioValue(@PathVariable Long portfolioId) {
        portfolioService.updatePortfolioValue(portfolioId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{portfolioId}")
    public ResponseEntity<?> deletePortfolio(@PathVariable Long portfolioId) {
        portfolioService.deletePortfolio(portfolioId);
        return ResponseEntity.ok().build();
    }

    // Bulk update all portfolio values
    @PostMapping("/update-all-values")
    public ResponseEntity<?> updateAllPortfolioValues(@RequestBody Map<String, Long> userData) {
        Long userId = userData.get("userId");
        List<Portfolio> portfolios = portfolioService.getUserPortfolios(userId);
        for (Portfolio portfolio : portfolios) {
            portfolioService.updatePortfolioValue(portfolio.getId());
        }
        return ResponseEntity.ok().build();
    }
}