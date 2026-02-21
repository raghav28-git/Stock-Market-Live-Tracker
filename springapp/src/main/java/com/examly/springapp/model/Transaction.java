package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "portfolio_id")
    private Portfolio portfolio;

    @NotBlank
    private String symbol;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @NotNull
    @Column(precision = 15, scale = 4)
    private BigDecimal quantity;

    @NotNull
    @Column(precision = 10, scale = 4)
    private BigDecimal price;

    @Column(precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 8, scale = 2)
    private BigDecimal commission = BigDecimal.ZERO;

    @Column(precision = 8, scale = 2)
    private BigDecimal fees = BigDecimal.ZERO;

    private LocalDateTime transactionDate;
    private LocalDate settlementDate;
    private String orderId;
    private String notes;

    public enum TransactionType {
        BUY, SELL, DIVIDEND, SPLIT, MERGER
    }

    public Transaction() {
        this.transactionDate = LocalDateTime.now();
    }

    public Transaction(Portfolio portfolio, String symbol, TransactionType transactionType, 
                      BigDecimal quantity, BigDecimal price) {
        this();
        this.portfolio = portfolio;
        this.symbol = symbol;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.price = price;
        this.totalAmount = quantity.multiply(price);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Portfolio getPortfolio() { return portfolio; }
    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getCommission() { return commission; }
    public void setCommission(BigDecimal commission) { this.commission = commission; }

    public BigDecimal getFees() { return fees; }
    public void setFees(BigDecimal fees) { this.fees = fees; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}