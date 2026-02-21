package com.examly.springapp.controller;

import com.examly.springapp.model.Trade;
import com.examly.springapp.service.TradingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = {"https://8081-*.premiumproject.examly.io", "http://localhost:3000"})
public class TradeController {

    @Autowired
    private TradingService tradingService;

    @PostMapping("/addTrade")
    public ResponseEntity<Trade> addTrade(@Valid @RequestBody Trade trade) {
        Trade savedTrade = tradingService.saveTrade(trade);
        return ResponseEntity.ok(savedTrade);
    }

    @GetMapping("/allTrades")
    public ResponseEntity<List<Trade>> getAllTrades() {
        return ResponseEntity.ok(tradingService.getAllTrades());
    }

    // Additional: Get trades by userId (optional)
    @GetMapping("/byUser")
    public ResponseEntity<List<Trade>> getTradesByUser(@RequestParam Long userId) {
        List<Trade> trades = tradingService.getTradesByUser(userId);
        return ResponseEntity.ok(trades);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrade(@PathVariable Long id) {
        tradingService.deleteTrade(id);
        return ResponseEntity.noContent().build();
    }
}
