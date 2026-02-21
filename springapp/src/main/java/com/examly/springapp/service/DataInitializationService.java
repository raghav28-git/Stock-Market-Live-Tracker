package com.examly.springapp.service;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private MarketDataRepository marketDataRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeStocks();
        initializeMarketData();
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            // Create sample users
            User admin = new User("admin", "admin@example.com", 
                passwordEncoder.encode("admin123"), Set.of(User.Role.ADMIN));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setAccountType(User.AccountType.INSTITUTIONAL);
            admin.setRiskTolerance(User.RiskTolerance.MODERATE);
            userRepository.save(admin);

            User investor = new User("investor", "investor@example.com", 
                passwordEncoder.encode("investor123"), Set.of(User.Role.INVESTOR));
            investor.setFirstName("John");
            investor.setLastName("Investor");
            investor.setAccountType(User.AccountType.INDIVIDUAL);
            investor.setRiskTolerance(User.RiskTolerance.MODERATE);
            userRepository.save(investor);

            User trader = new User("trader", "trader@example.com", 
                passwordEncoder.encode("trader123"), Set.of(User.Role.TRADER));
            trader.setFirstName("Jane");
            trader.setLastName("Trader");
            trader.setAccountType(User.AccountType.PROFESSIONAL);
            trader.setRiskTolerance(User.RiskTolerance.AGGRESSIVE);
            userRepository.save(trader);
        }
    }

    private void initializeStocks() {
        if (stockRepository.count() == 0) {
            // Create sample stocks
            Stock apple = new Stock("AAPL", "Apple Inc.", new BigDecimal("150.25"));
            apple.setSector("Technology");
            apple.setIndustry("Consumer Electronics");
            apple.setExchange("NASDAQ");
            stockRepository.save(apple);

            Stock microsoft = new Stock("MSFT", "Microsoft Corporation", new BigDecimal("305.50"));
            microsoft.setSector("Technology");
            microsoft.setIndustry("Software");
            microsoft.setExchange("NASDAQ");
            stockRepository.save(microsoft);

            Stock google = new Stock("GOOGL", "Alphabet Inc.", new BigDecimal("2750.80"));
            google.setSector("Technology");
            google.setIndustry("Internet Services");
            google.setExchange("NASDAQ");
            stockRepository.save(google);

            Stock amazon = new Stock("AMZN", "Amazon.com Inc.", new BigDecimal("3200.45"));
            amazon.setSector("Consumer Discretionary");
            amazon.setIndustry("E-commerce");
            amazon.setExchange("NASDAQ");
            stockRepository.save(amazon);

            Stock tesla = new Stock("TSLA", "Tesla Inc.", new BigDecimal("850.75"));
            tesla.setSector("Consumer Discretionary");
            tesla.setIndustry("Electric Vehicles");
            tesla.setExchange("NASDAQ");
            stockRepository.save(tesla);
        }
    }

    private void initializeMarketData() {
        if (marketDataRepository.count() == 0) {
            // Create sample market data
            MarketData appleData = new MarketData("AAPL", "Apple Inc.", new BigDecimal("150.25"));
            appleData.setOpenPrice(new BigDecimal("149.80"));
            appleData.setHighPrice(new BigDecimal("152.10"));
            appleData.setLowPrice(new BigDecimal("148.90"));
            appleData.setPreviousClose(new BigDecimal("149.50"));
            appleData.setVolume(45000000L);
            appleData.setMarketCap(new BigDecimal("2450000000000"));
            appleData.setPeRatio(new BigDecimal("28.5"));
            appleData.setDividendYield(new BigDecimal("0.0065"));
            appleData.setExchange("NASDAQ");
            marketDataRepository.save(appleData);

            MarketData microsoftData = new MarketData("MSFT", "Microsoft Corporation", new BigDecimal("305.50"));
            microsoftData.setOpenPrice(new BigDecimal("304.20"));
            microsoftData.setHighPrice(new BigDecimal("307.80"));
            microsoftData.setLowPrice(new BigDecimal("303.50"));
            microsoftData.setPreviousClose(new BigDecimal("304.00"));
            microsoftData.setVolume(32000000L);
            microsoftData.setMarketCap(new BigDecimal("2280000000000"));
            microsoftData.setPeRatio(new BigDecimal("32.1"));
            microsoftData.setDividendYield(new BigDecimal("0.0072"));
            microsoftData.setExchange("NASDAQ");
            marketDataRepository.save(microsoftData);

            MarketData googleData = new MarketData("GOOGL", "Alphabet Inc.", new BigDecimal("2750.80"));
            googleData.setOpenPrice(new BigDecimal("2745.00"));
            googleData.setHighPrice(new BigDecimal("2765.50"));
            googleData.setLowPrice(new BigDecimal("2740.20"));
            googleData.setPreviousClose(new BigDecimal("2748.00"));
            googleData.setVolume(1200000L);
            googleData.setMarketCap(new BigDecimal("1850000000000"));
            googleData.setPeRatio(new BigDecimal("25.8"));
            googleData.setExchange("NASDAQ");
            marketDataRepository.save(googleData);

            MarketData amazonData = new MarketData("AMZN", "Amazon.com Inc.", new BigDecimal("3200.45"));
            amazonData.setOpenPrice(new BigDecimal("3195.00"));
            amazonData.setHighPrice(new BigDecimal("3215.80"));
            amazonData.setLowPrice(new BigDecimal("3190.50"));
            amazonData.setPreviousClose(new BigDecimal("3198.00"));
            amazonData.setVolume(2800000L);
            amazonData.setMarketCap(new BigDecimal("1620000000000"));
            amazonData.setPeRatio(new BigDecimal("58.2"));
            amazonData.setExchange("NASDAQ");
            marketDataRepository.save(amazonData);

            MarketData teslaData = new MarketData("TSLA", "Tesla Inc.", new BigDecimal("850.75"));
            teslaData.setOpenPrice(new BigDecimal("845.20"));
            teslaData.setHighPrice(new BigDecimal("855.90"));
            teslaData.setLowPrice(new BigDecimal("842.10"));
            teslaData.setPreviousClose(new BigDecimal("847.50"));
            teslaData.setVolume(28000000L);
            teslaData.setMarketCap(new BigDecimal("850000000000"));
            teslaData.setPeRatio(new BigDecimal("165.4"));
            teslaData.setExchange("NASDAQ");
            marketDataRepository.save(teslaData);
        }
    }
}