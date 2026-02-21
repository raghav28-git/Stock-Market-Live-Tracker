package com.examly.springapp.controller;

import com.examly.springapp.model.MarketData;
import com.examly.springapp.service.MarketDataService;
import com.examly.springapp.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = {"https://8081-*.premiumproject.examly.io", "http://localhost:3000"})
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    @Autowired
    private AlertService alertService;

    @GetMapping("/quote/{symbol}")
    public ResponseEntity<?> getQuote(@PathVariable String symbol) {
        Optional<MarketData> marketData = marketDataService.getMarketDataBySymbol(symbol);
        if (marketData.isPresent()) {
            return ResponseEntity.ok(marketData.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/quotes")
    public ResponseEntity<List<MarketData>> getQuotes(@RequestParam List<String> symbols) {
        List<MarketData> marketDataList = marketDataService.getMarketDataBySymbols(symbols);
        return ResponseEntity.ok(marketDataList);
    }

    @GetMapping("/all")
    public ResponseEntity<List<MarketData>> getAllMarketData() {
        List<MarketData> marketDataList = marketDataService.getAllMarketData();
        return ResponseEntity.ok(marketDataList);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MarketData>> searchStocks(@RequestParam String query) {
        List<MarketData> results = marketDataService.searchByCompanyName(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/top-volume")
    public ResponseEntity<List<MarketData>> getTopVolumeStocks() {
        List<MarketData> topStocks = marketDataService.getTopVolumeStocks();
        return ResponseEntity.ok(topStocks);
    }

    @GetMapping("/top-price")
    public ResponseEntity<List<MarketData>> getTopPriceStocks() {
        List<MarketData> topStocks = marketDataService.getTopPriceStocks();
        return ResponseEntity.ok(topStocks);
    }

    @PostMapping("/add")
    public ResponseEntity<MarketData> addMarketData(@RequestBody MarketData marketData) {
        MarketData savedData = marketDataService.saveMarketData(marketData);
        return ResponseEntity.ok(savedData);
    }

    @PutMapping("/update-price/{symbol}")
    public ResponseEntity<MarketData> updatePrice(@PathVariable String symbol, 
                                                @RequestBody Map<String, BigDecimal> priceData) {
        BigDecimal newPrice = priceData.get("price");
        MarketData updatedData = marketDataService.updatePrice(symbol, newPrice);
        
        // Check and trigger any price alerts
        alertService.checkAndTriggerAlerts(symbol, newPrice);
        
        return ResponseEntity.ok(updatedData);
    }

    @PostMapping("/simulate-update/{symbol}")
    public ResponseEntity<?> simulatePriceUpdate(@PathVariable String symbol) {
        marketDataService.simulatePriceUpdate(symbol);
        Optional<MarketData> updatedData = marketDataService.getMarketDataBySymbol(symbol);
        if (updatedData.isPresent()) {
            alertService.checkAndTriggerAlerts(symbol, updatedData.get().getCurrentPrice());
            return ResponseEntity.ok(updatedData.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/recent-updates")
    public ResponseEntity<List<MarketData>> getRecentUpdates(@RequestParam(defaultValue = "1") int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        List<MarketData> recentUpdates = marketDataService.getRecentUpdates(since);
        return ResponseEntity.ok(recentUpdates);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarketData(@PathVariable Long id) {
        marketDataService.deleteMarketData(id);
        return ResponseEntity.ok().build();
    }
}