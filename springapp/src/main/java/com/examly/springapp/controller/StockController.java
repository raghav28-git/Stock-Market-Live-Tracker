package com.examly.springapp.controller;

import com.examly.springapp.model.Stock;
import com.examly.springapp.service.StockService;
import com.examly.springapp.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = {"https://8081-*.premiumproject.examly.io", "http://localhost:3000"})
public class StockController {

    @Autowired
    private StockService stockService;

    @PostMapping("/addStock")
    public ResponseEntity<Stock> addStock(@Valid @RequestBody Stock stock) {
        Stock savedStock = stockService.saveStock(stock);
        return ResponseEntity.ok(savedStock);
    }

    @GetMapping("/allStocks")
    public ResponseEntity<List<Stock>> getAllStocks() {
        List<Stock> stocks = stockService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/byCompany")
    public ResponseEntity<List<Stock>> getStocksByCompany(@RequestParam String companyName) {
        List<Stock> stocks = stockService.getStocksByCompany(companyName);
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/sortedByDate")
    public ResponseEntity<List<Stock>> getStocksSortedByDate() {
        List<Stock> stocks = stockService.getStocksSortedByDate();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<Stock> getStockBySymbol(@PathVariable String symbol) {
        Optional<Stock> stock = stockService.getStockBySymbol(symbol);
        if (stock.isPresent()) {
            return ResponseEntity.ok(stock.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/sector/{sector}")
    public ResponseEntity<List<Stock>> getStocksBySector(@PathVariable String sector) {
        List<Stock> stocks = stockService.getStocksBySector(sector);
        return ResponseEntity.ok(stocks);
    }

    @PutMapping("/updatePrice/{symbol}")
    public ResponseEntity<Stock> updateStockPrice(@PathVariable String symbol, 
                                                @RequestBody Map<String, BigDecimal> priceData) {
        BigDecimal newPrice = priceData.get("price");
        Stock updatedStock = stockService.updateStockPrice(symbol, newPrice);
        return ResponseEntity.ok(updatedStock);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        try {
            stockService.deleteStock(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
