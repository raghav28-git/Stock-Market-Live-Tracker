package com.examly.springapp.service;

import com.examly.springapp.model.Trade;
import com.examly.springapp.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradingService {
    @Autowired
    private TradeRepository tradeRepository;

    public List<Trade> getAllTrades() {
        return tradeRepository.findAll();
    }

    public List<Trade> getTradesByUser(Long userId) {
        return tradeRepository.findByUserId(userId);
    }

    public Trade getTradeById(Long id) {
        return tradeRepository.findById(id).orElseThrow(() -> new RuntimeException("Trade not found"));
    }

    public Trade saveTrade(Trade trade) {
        return tradeRepository.save(trade);
    }

    public void deleteTrade(Long id) {
        tradeRepository.deleteById(id);
    }
}
