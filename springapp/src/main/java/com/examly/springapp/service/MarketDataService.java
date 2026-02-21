package com.examly.springapp.service;

import com.examly.springapp.model.MarketData;
import com.examly.springapp.repository.MarketDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MarketDataService {

    @Autowired
    private MarketDataRepository marketDataRepository;

    public List<MarketData> getAllMarketData() {
        return marketDataRepository.findAll();
    }

    public Optional<MarketData> getMarketDataBySymbol(String symbol) {
        return marketDataRepository.findBySymbol(symbol.toUpperCase());
    }

    public List<MarketData> getMarketDataBySymbols(List<String> symbols) {
        return marketDataRepository.findBySymbolIn(symbols);
    }

    public MarketData saveMarketData(MarketData marketData) {
        marketData.setTimestamp(LocalDateTime.now());
        return marketDataRepository.save(marketData);
    }

    public MarketData updatePrice(String symbol, BigDecimal newPrice) {
        Optional<MarketData> existingData = marketDataRepository.findBySymbol(symbol.toUpperCase());
        if (existingData.isPresent()) {
            MarketData marketData = existingData.get();
            marketData.setPreviousClose(marketData.getCurrentPrice());
            marketData.setCurrentPrice(newPrice);
            marketData.setTimestamp(LocalDateTime.now());
            return marketDataRepository.save(marketData);
        } else {
            MarketData newMarketData = new MarketData(symbol.toUpperCase(), "", newPrice);
            return marketDataRepository.save(newMarketData);
        }
    }

    public List<MarketData> searchByCompanyName(String companyName) {
        return marketDataRepository.findByCompanyNameContaining(companyName);
    }

    public List<MarketData> getTopVolumeStocks() {
        return marketDataRepository.findActiveStocksOrderByVolumeDesc();
    }

    public List<MarketData> getTopPriceStocks() {
        return marketDataRepository.findActiveStocksOrderByPriceDesc();
    }

    public List<MarketData> getRecentUpdates(LocalDateTime since) {
        return marketDataRepository.findRecentUpdates(since);
    }

    public void deleteMarketData(Long id) {
        marketDataRepository.deleteById(id);
    }

    // Simulate real-time price updates
    public void simulatePriceUpdate(String symbol) {
        Optional<MarketData> marketDataOpt = getMarketDataBySymbol(symbol);
        if (marketDataOpt.isPresent()) {
            MarketData marketData = marketDataOpt.get();
            BigDecimal currentPrice = marketData.getCurrentPrice();
            // Simulate price change between -5% to +5%
            double changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5%
            BigDecimal newPrice = currentPrice.multiply(BigDecimal.valueOf(1 + changePercent));
            updatePrice(symbol, newPrice);
        }
    }
}