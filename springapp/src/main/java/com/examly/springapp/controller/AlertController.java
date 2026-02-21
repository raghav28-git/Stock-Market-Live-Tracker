package com.examly.springapp.controller;

import com.examly.springapp.model.PriceAlert;
import com.examly.springapp.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = {"https://8081-*.premiumproject.examly.io", "http://localhost:3000"})
public class AlertController {

    @Autowired
    private AlertService alertService;

    @PostMapping("/create")
    public ResponseEntity<PriceAlert> createAlert(@RequestBody Map<String, Object> alertData) {
        Long userId = Long.valueOf(alertData.get("userId").toString());
        String symbol = alertData.get("symbol").toString();
        PriceAlert.AlertType alertType = PriceAlert.AlertType.valueOf(
            alertData.get("alertType").toString().toUpperCase()
        );
        
        BigDecimal targetPrice = null;
        BigDecimal percentageChange = null;
        
        if (alertData.get("targetPrice") != null) {
            targetPrice = new BigDecimal(alertData.get("targetPrice").toString());
        }
        
        if (alertData.get("percentageChange") != null) {
            percentageChange = new BigDecimal(alertData.get("percentageChange").toString());
        }
        
        PriceAlert alert = alertService.createPriceAlert(userId, symbol, alertType, targetPrice, percentageChange);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PriceAlert>> getUserAlerts(@PathVariable Long userId) {
        List<PriceAlert> alerts = alertService.getUserAlerts(userId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<List<PriceAlert>> getAlertsBySymbol(@PathVariable String symbol) {
        List<PriceAlert> alerts = alertService.getAlertsBySymbol(symbol);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/triggered/{userId}")
    public ResponseEntity<List<PriceAlert>> getTriggeredAlerts(@PathVariable Long userId) {
        List<PriceAlert> triggeredAlerts = alertService.getTriggeredAlerts(userId);
        return ResponseEntity.ok(triggeredAlerts);
    }

    @DeleteMapping("/{alertId}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long alertId) {
        alertService.deleteAlert(alertId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/check-all")
    public ResponseEntity<?> checkAllAlerts() {
        alertService.checkAllAlerts();
        return ResponseEntity.ok(Map.of("message", "All alerts checked"));
    }

    @PostMapping("/check/{symbol}")
    public ResponseEntity<?> checkSymbolAlerts(@PathVariable String symbol, 
                                             @RequestBody Map<String, BigDecimal> priceData) {
        BigDecimal currentPrice = priceData.get("currentPrice");
        alertService.checkAndTriggerAlerts(symbol, currentPrice);
        return ResponseEntity.ok(Map.of("message", "Alerts checked for " + symbol));
    }
}