package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trades")
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TradeType tradeType;

    @NotNull
    @Column(precision = 15, scale = 4)
    private BigDecimal quantity;

    @NotNull
    @Column(precision = 10, scale = 4)
    private BigDecimal price;

    @Column(precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @NotNull
    private LocalDateTime tradeDate;

    @Enumerated(EnumType.STRING)
    private TradeStatus status = TradeStatus.PENDING;

    public enum TradeType {
        BUY, SELL
    }

    public enum TradeStatus {
        PENDING, EXECUTED, CANCELLED, FAILED
    }

    public Trade() {
        this.tradeDate = LocalDateTime.now();
    }

    public Trade(User user, Stock stock, TradeType tradeType, BigDecimal quantity, BigDecimal price) {
        this();
        this.user = user;
        this.stock = stock;
        this.tradeType = tradeType;
        this.quantity = quantity;
        this.price = price;
        this.totalAmount = quantity.multiply(price);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }

    public TradeType getTradeType() { return tradeType; }
    public void setTradeType(TradeType tradeType) { this.tradeType = tradeType; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getTradeDate() { return tradeDate; }
    public void setTradeDate(LocalDateTime tradeDate) { this.tradeDate = tradeDate; }

    public TradeStatus getStatus() { return status; }
    public void setStatus(TradeStatus status) { this.status = status; }
}
