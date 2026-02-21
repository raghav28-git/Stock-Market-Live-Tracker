package com.examly.springapp.service;

import com.examly.springapp.model.Stock;
import com.examly.springapp.repository.StockRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;

    @Override
    public Stock saveStock(Stock stock) {
        stock.setLastUpdated(LocalDateTime.now());
        return stockRepository.save(stock);
    }

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findByIsActiveTrue();
    }

    @Override
    public List<Stock> getStocksByCompany(String companyName) {
        return stockRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    @Override
    public List<Stock> getStocksSortedByDate() {
        return stockRepository.findAllByOrderByLastUpdatedDesc();
    }

    @Override
    public Optional<Stock> getStockBySymbol(String symbol) {
        return stockRepository.findBySymbolIgnoreCase(symbol.toUpperCase());
    }

    @Override
    public List<Stock> getStocksBySector(String sector) {
        return stockRepository.findBySectorIgnoreCase(sector);
    }

    @Override
    public Stock updateStockPrice(String symbol, BigDecimal newPrice) {
        Optional<Stock> stockOpt = stockRepository.findBySymbolIgnoreCase(symbol.toUpperCase());
        if (stockOpt.isPresent()) {
            Stock stock = stockOpt.get();
            stock.setPrice(newPrice);
            stock.setLastUpdated(LocalDateTime.now());
            return stockRepository.save(stock);
        } else {
            throw new ResourceNotFoundException("Stock not found with symbol: " + symbol);
        }
    }

    @Override
    public void deleteStock(Long id) {
        Optional<Stock> stockOpt = stockRepository.findById(id);
        if (stockOpt.isPresent()) {
            Stock stock = stockOpt.get();
            stock.setIsActive(false);
            stockRepository.save(stock);
        } else {
            throw new ResourceNotFoundException("Stock not found with id: " + id);
        }
    }
}