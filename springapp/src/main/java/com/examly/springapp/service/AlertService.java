package com.examly.springapp.service;

import com.examly.springapp.model.MarketData;
import com.examly.springapp.model.PriceAlert;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.MarketDataRepository;
import com.examly.springapp.repository.PriceAlertRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    @Autowired
    private PriceAlertRepository priceAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MarketDataRepository marketDataRepository;

    public PriceAlert createPriceAlert(Long userId, String symbol, PriceAlert.AlertType alertType, 
                                     BigDecimal targetPrice, BigDecimal percentageChange) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            PriceAlert alert = new PriceAlert(userOpt.get(), symbol.toUpperCase(), alertType, targetPrice);
            alert.setPercentageChange(percentageChange);
            return priceAlertRepository.save(alert);
        }
        throw new RuntimeException("User not found");
    }

    public List<PriceAlert> getUserAlerts(Long userId) {
        return priceAlertRepository.findActiveAlertsByUserId(userId);
    }

    public List<PriceAlert> getAlertsBySymbol(String symbol) {
        return priceAlertRepository.findActiveUntriggeredAlertsBySymbol(symbol.toUpperCase());
    }

    public void deleteAlert(Long alertId) {
        Optional<PriceAlert> alertOpt = priceAlertRepository.findById(alertId);
        if (alertOpt.isPresent()) {
            PriceAlert alert = alertOpt.get();
            alert.setIsActive(false);
            priceAlertRepository.save(alert);
        }
    }

    public void checkAndTriggerAlerts(String symbol, BigDecimal currentPrice) {
        List<PriceAlert> alerts = priceAlertRepository.findActiveUntriggeredAlertsBySymbol(symbol.toUpperCase());
        
        for (PriceAlert alert : alerts) {
            boolean shouldTrigger = false;
            
            switch (alert.getAlertType()) {
                case PRICE_ABOVE:
                    shouldTrigger = currentPrice.compareTo(alert.getTargetPrice()) >= 0;
                    break;
                case PRICE_BELOW:
                    shouldTrigger = currentPrice.compareTo(alert.getTargetPrice()) <= 0;
                    break;
                case PERCENTAGE_CHANGE:
                    // This would require historical price data to calculate percentage change
                    // For now, we'll skip this implementation
                    break;
                case VOLUME_SPIKE:
                    // This would require volume data comparison
                    // For now, we'll skip this implementation
                    break;
            }
            
            if (shouldTrigger) {
                alert.setIsTriggered(true);
                alert.setTriggerDate(LocalDateTime.now());
                priceAlertRepository.save(alert);
                
                // Here you would typically send a notification to the user
                // For now, we'll just log it or handle it in the controller
                System.out.println("Alert triggered for user " + alert.getUser().getUsername() + 
                                 " for symbol " + symbol + " at price " + currentPrice);
            }
        }
    }

    public void checkAllAlerts() {
        List<MarketData> allMarketData = marketDataRepository.findAll();
        for (MarketData marketData : allMarketData) {
            checkAndTriggerAlerts(marketData.getSymbol(), marketData.getCurrentPrice());
        }
    }

    public List<PriceAlert> getTriggeredAlerts(Long userId) {
        return priceAlertRepository.findByUserId(userId).stream()
                .filter(PriceAlert::getIsTriggered)
                .toList();
    }
}