package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "holdings")
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "portfolio_id")
    @JsonIgnore
    private Portfolio portfolio;

    @NotBlank
    private String symbol;

    private String companyName;

    @NotNull
    @Column(precision = 15, scale = 4)
    private BigDecimal quantity;

    @NotNull
    @Column(precision = 10, scale = 4)
    private BigDecimal averageCost;

    @Column(precision = 10, scale = 4)
    private BigDecimal currentPrice;

    @Column(precision = 15, scale = 2)
    private BigDecimal marketValue;

    @Column(precision = 15, scale = 2)
    private BigDecimal unrealizedGainLoss;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentageOfPortfolio;

    private LocalDate purchaseDate;
    private LocalDateTime lastUpdated;

    public Holding() {
        this.lastUpdated = LocalDateTime.now();
    }

    public Holding(Portfolio portfolio, String symbol, BigDecimal quantity, BigDecimal averageCost) {
        this();
        this.portfolio = portfolio;
        this.symbol = symbol;
        this.quantity = quantity;
        this.averageCost = averageCost;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Portfolio getPortfolio() { return portfolio; }
    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getAverageCost() { return averageCost; }
    public void setAverageCost(BigDecimal averageCost) { this.averageCost = averageCost; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getMarketValue() { return marketValue; }
    public void setMarketValue(BigDecimal marketValue) { this.marketValue = marketValue; }

    public BigDecimal getUnrealizedGainLoss() { return unrealizedGainLoss; }
    public void setUnrealizedGainLoss(BigDecimal unrealizedGainLoss) { this.unrealizedGainLoss = unrealizedGainLoss; }

    public BigDecimal getPercentageOfPortfolio() { return percentageOfPortfolio; }
    public void setPercentageOfPortfolio(BigDecimal percentageOfPortfolio) { this.percentageOfPortfolio = percentageOfPortfolio; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}