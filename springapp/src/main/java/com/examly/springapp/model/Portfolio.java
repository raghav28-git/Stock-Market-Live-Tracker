package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String portfolioName;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String description;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalValue = BigDecimal.ZERO;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal cashBalance = BigDecimal.ZERO;
    
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    private InvestmentObjective investmentObjective;
    
    private String benchmarkSymbol;
    
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdated;
    private Boolean isActive = true;
    private Boolean isPublic = false;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Holding> holdings;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    public enum InvestmentObjective {
        GROWTH, INCOME, BALANCED, SPECULATION
    }

    public Portfolio() {
        this.createdDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    public Portfolio(String portfolioName, User user) {
        this();
        this.portfolioName = portfolioName;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPortfolioName() { return portfolioName; }
    public void setPortfolioName(String portfolioName) { this.portfolioName = portfolioName; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getCashBalance() { return cashBalance; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public InvestmentObjective getInvestmentObjective() { return investmentObjective; }
    public void setInvestmentObjective(InvestmentObjective investmentObjective) { this.investmentObjective = investmentObjective; }

    public String getBenchmarkSymbol() { return benchmarkSymbol; }
    public void setBenchmarkSymbol(String benchmarkSymbol) { this.benchmarkSymbol = benchmarkSymbol; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public List<Holding> getHoldings() { return holdings; }
    public void setHoldings(List<Holding> holdings) { this.holdings = holdings; }

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
}
