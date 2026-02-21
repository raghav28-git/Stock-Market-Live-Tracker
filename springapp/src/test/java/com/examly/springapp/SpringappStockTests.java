// package com.examly.springapp;

// import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

// import java.nio.charset.StandardCharsets;
// import java.time.LocalDateTime;
// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.MethodOrderer;
// import org.junit.jupiter.api.Order;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.TestMethodOrder;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;

// import static org.junit.jupiter.api.Assertions.assertTrue;
// import static org.junit.jupiter.api.Assertions.fail;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

// @TestMethodOrder(MethodOrderer.OrderAnnotation.class)
// @ActiveProfiles("test")
// @SpringBootTest(classes = SpringappApplication.class)
// @AutoConfigureMockMvc
// class SpringappStockTests {

//     @Autowired
//     private MockMvc mockMvc;

//     private final ObjectMapper om = new ObjectMapper();

//     // -------------------- API Tests --------------------

//     @Order(1)
//     @Test
//     void should_add_stock_and_return_200() throws Exception {
//         String stockData = """
//             {
//               "symbol": "NFLX",
//               "companyName": "Netflix Inc.",
//               "price": 420.50,
//               "lastUpdated": "%s"
//             }
//         """.formatted(LocalDateTime.now());

//         mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData)
//                 .accept(MediaType.APPLICATION_JSON))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$.symbol").value("NFLX"))
//             .andExpect(jsonPath("$.companyName").value("Netflix Inc."))
//             .andReturn();
//     }

//     @Order(2)
//     @Test
//     void should_allow_adding_duplicate_stock_and_return_200() throws Exception {
//         String stockData = """
//             {
//               "symbol": "NFLX",
//               "companyName": "Netflix Inc.",
//               "price": 430.75,
//               "lastUpdated": "%s"
//             }
//         """.formatted(LocalDateTime.now());

//         mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData))
//             .andExpect(status().isOk());
//     }

//     @Order(3)
//     @Test
//     void should_return_all_stocks_as_array() throws Exception {
//         mockMvc.perform(get("/api/stocks/allStocks")
//                 .with(jwt())
//                 .accept(MediaType.APPLICATION_JSON))
//             .andDo(print())
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$").isArray());
//     }

//     @Order(4)
//     @Test
//     void should_return_stocks_by_company() throws Exception {
//         mockMvc.perform(get("/api/stocks/byCompany")
//                 .with(jwt())
//                 .param("companyName", "Apple Inc.")
//                 .accept(MediaType.APPLICATION_JSON))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$").isArray());
//     }

//     @Order(5)
//     @Test
//     void should_return_empty_array_for_nonexistent_company() throws Exception {
//         mockMvc.perform(get("/api/stocks/byCompany")
//                 .with(jwt())
//                 .param("companyName", "Nonexistent Co.")
//                 .accept(MediaType.APPLICATION_JSON))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$").isArray())
//             .andExpect(jsonPath("$.length()").value(0));
//     }

//     @Order(6)
//     @Test
//     void should_return_stocks_sorted_by_date() throws Exception {
//         mockMvc.perform(get("/api/stocks/sortedByDate")
//                 .with(jwt())
//                 .accept(MediaType.APPLICATION_JSON))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$").isArray());
//     }

//     @Order(7)
//     @Test
//     void should_delete_stock_successfully() throws Exception {
//         // First, create a stock
//         String stockData = """
//             {
//               "symbol": "DELETE",
//               "companyName": "Delete Inc.",
//               "price": 100.00,
//               "lastUpdated": "%s"
//             }
//         """.formatted(LocalDateTime.now());

//         String response = mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData)
//                 .accept(MediaType.APPLICATION_JSON))
//             .andExpect(status().isOk())
//             .andReturn()
//             .getResponse()
//             .getContentAsString(StandardCharsets.UTF_8);

//         JsonNode node = om.readTree(response);
//         long id = node.get("id").asLong();
//         assertTrue(id > 0);

//         // Delete the stock
//         mockMvc.perform(delete("/api/stocks/{id}", id).with(jwt()))
//             .andExpect(status().isOk());
//     }

//     @Order(8)
//     @Test
//     void should_handle_duplicate_stock_symbol_gracefully() throws Exception {
//         String stockData = """
//             {
//               "symbol": "DUPL",
//               "companyName": "Duplicate Co.",
//               "price": 250.00,
//               "lastUpdated": "%s"
//             }
//         """.formatted(LocalDateTime.now());

//         // Add stock for the first time
//         mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$.symbol").value("DUPL"))
//             .andExpect(jsonPath("$.companyName").value("Duplicate Co."));

//         // Try adding the same stock again
//         mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$.symbol").value("DUPL"))
//             .andExpect(jsonPath("$.companyName").value("Duplicate Co."));
//     }

//     @Order(9)
//     @Test
//     void should_allow_duplicate_stock_with_different_price() throws Exception {
//         String stockData1 = """
//             {
//               "symbol": "DUPL2",
//               "companyName": "Duplicate Co. 2",
//               "price": 300.00,
//               "lastUpdated": "%s"
//             }
//         """.formatted(LocalDateTime.now());

//         String stockData2 = """
//             {
//               "symbol": "DUPL2",
//               "companyName": "Duplicate Co. 2",
//               "price": 350.00,
//               "lastUpdated": "%s"
//             }
//         """.formatted(LocalDateTime.now());

//         // Add first stock
//         mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData1))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$.price").value(300.00));

//         // Add duplicate stock with updated price
//         mockMvc.perform(post("/api/stocks/addStock")
//                 .with(jwt())
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(stockData2))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$.price").value(350.00));
//     }

//     // -------------------- Project Structure Tests --------------------

//     @Test
//     void controller_directory_should_exist() { assertDir("src/main/java/com/examly/springapp/controller"); }

//     @Test
//     void stock_controller_file_should_exist() { assertFile("src/main/java/com/examly/springapp/controller/StockController.java"); }

//     @Test
//     void model_directory_should_exist() { assertDir("src/main/java/com/examly/springapp/model"); }

//     @Test
//     void stock_model_file_should_exist() { assertFile("src/main/java/com/examly/springapp/model/Stock.java"); }

//     @Test
//     void repository_directory_should_exist() { assertDir("src/main/java/com/examly/springapp/repository"); }

//     @Test
//     void stock_repository_file_should_exist() { assertFile("src/main/java/com/examly/springapp/repository/StockRepository.java"); }

//     @Test
//     void service_directory_should_exist() { assertDir("src/main/java/com/examly/springapp/service"); }

//     @Test
//     void stock_service_interface_should_exist() { checkClassExists("com.examly.springapp.service.StockService"); }

//     @Test
//     void stock_service_impl_class_should_exist() { checkClassExists("com.examly.springapp.service.StockServiceImpl"); }

//     @Test
//     void stock_model_should_have_symbol_field() { checkFieldExists("com.examly.springapp.model.Stock", "symbol"); }

//     @Test
//     void stock_model_should_have_companyName_field() { checkFieldExists("com.examly.springapp.model.Stock", "companyName"); }

//     @Test
//     void stock_model_should_have_price_field() { checkFieldExists("com.examly.springapp.model.Stock", "price"); }

//     @Test
//     void stock_model_should_have_lastUpdated_field() { checkFieldExists("com.examly.springapp.model.Stock", "lastUpdated"); }

//     // -------------------- Helpers --------------------

//     private void assertDir(String path) {
//         assertTrue(new java.io.File(path).exists(), "Missing directory: " + path);
//     }

//     private void assertFile(String path) {
//         assertTrue(new java.io.File(path).exists(), "Missing file: " + path);
//     }

//     private void checkClassExists(String className) {
//         try { Class.forName(className); }
//         catch (ClassNotFoundException e) { fail("Class " + className + " does not exist."); }
//     }

//     private void checkFieldExists(String className, String fieldName) {
//         try {
//             Class<?> clazz = Class.forName(className);
//             clazz.getDeclaredField(fieldName);
//         } catch (ClassNotFoundException | NoSuchFieldException e) {
//             fail("Field " + fieldName + " in class " + className + " does not exist.");
//         }
//     }
// }
