package com.examly.springapp.service;

import com.examly.springapp.model.Stock;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface StockService {

    Stock saveStock(Stock stock);
    List<Stock> getAllStocks();
    List<Stock> getStocksByCompany(String companyName);
    List<Stock> getStocksSortedByDate();
    Optional<Stock> getStockBySymbol(String symbol);
    List<Stock> getStocksBySector(String sector);
    Stock updateStockPrice(String symbol, BigDecimal newPrice);
    void deleteStock(Long id);
}
