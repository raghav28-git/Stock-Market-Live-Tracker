package com.examly.springapp.controller;

import com.examly.springapp.model.Portfolio;
import com.examly.springapp.service.PortfolioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = {"https://8081-*.premiumproject.examly.io", "http://localhost:3000"})
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/byUser/{userId}")
    public ResponseEntity<java.util.List<Portfolio>> getPortfolioByUser(@PathVariable Long userId) {
        java.util.List<Portfolio> portfolios = portfolioService.getPortfolioByUserId(userId);
        return ResponseEntity.ok(portfolios);
    }



}
