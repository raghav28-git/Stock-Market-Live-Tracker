package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_alerts")
public class PriceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    private String symbol;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    @Column(precision = 10, scale = 4)
    private BigDecimal targetPrice;

    @Column(precision = 5, scale = 2)
    private BigDecimal percentageChange;

    private Boolean isTriggered = false;
    private LocalDateTime triggerDate;
    private LocalDateTime createdDate;
    private Boolean isActive = true;

    public enum AlertType {
        PRICE_ABOVE, PRICE_BELOW, VOLUME_SPIKE, PERCENTAGE_CHANGE
    }

    public PriceAlert() {
        this.createdDate = LocalDateTime.now();
    }

    public PriceAlert(User user, String symbol, AlertType alertType, BigDecimal targetPrice) {
        this();
        this.user = user;
        this.symbol = symbol;
        this.alertType = alertType;
        this.targetPrice = targetPrice;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }

    public BigDecimal getTargetPrice() { return targetPrice; }
    public void setTargetPrice(BigDecimal targetPrice) { this.targetPrice = targetPrice; }

    public BigDecimal getPercentageChange() { return percentageChange; }
    public void setPercentageChange(BigDecimal percentageChange) { this.percentageChange = percentageChange; }

    public Boolean getIsTriggered() { return isTriggered; }
    public void setIsTriggered(Boolean isTriggered) { this.isTriggered = isTriggered; }

    public LocalDateTime getTriggerDate() { return triggerDate; }
    public void setTriggerDate(LocalDateTime triggerDate) { this.triggerDate = triggerDate; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}