// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import App from "../App";

// jest.mock("../services/api", () => ({
//   fetchAllStocks: jest.fn(),
//   fetchStocksSortedByDate: jest.fn(),
//   fetchStocksByCompany: jest.fn(),
//   addStock: jest.fn(),
//   deleteStock: jest.fn(),
// }));

// import {
//   fetchAllStocks,
//   fetchStocksSortedByDate,
//   fetchStocksByCompany,
//   addStock,
//   deleteStock,
// } from "../services/api";

// describe("Stock Management React App - 10 Stable Tests", () => {
//   const mockStocks = [
//     {
//       id: 1,
//       symbol: "AAPL",
//       companyName: "Apple Inc.",
//       price: 180.5,
//       lastUpdated: "2025-09-05T10:00:00Z",
//     },
//     {
//       id: 2,
//       symbol: "GOOG",
//       companyName: "Google LLC",
//       price: 135.2,
//       lastUpdated: "2025-09-05T11:00:00Z",
//     },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.spyOn(window, "confirm").mockImplementation(() => true);
//   });

//   test("renders_home_and_stock_management_title", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     render(<App />);
//     expect(
//       await screen.findByText("Stock Market Live Tracker")
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText("Stock Management System")
//     ).toBeInTheDocument();
//   });

//   test("displays_list_of_stocks_correctly", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: mockStocks });
//     render(<App />);
//     expect(await screen.findByText("AAPL")).toBeInTheDocument();
//     expect(await screen.findByText("GOOG")).toBeInTheDocument();
//   });

//   test("duplicate_test_show_all_stocks_button", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     fetchAllStocks.mockResolvedValueOnce({ data: mockStocks });

//     render(<App />);
//     fireEvent.click(await screen.findByText("Show All Stocks"));

//     await waitFor(() => expect(fetchAllStocks).toHaveBeenCalledTimes(2));
//     expect(await screen.findByText("AAPL")).toBeInTheDocument();
//     expect(await screen.findByText("GOOG")).toBeInTheDocument();
//   });

//   test("duplicate_test_home_static_content", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     render(<App />);
//     expect(
//       await screen.findByText(/Monitor real-time stock prices/i)
//     ).toBeInTheDocument();
//   });


//   test("show_all_stocks_button_fetches_all_stocks", async () => {
//     // initial load empty
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     // button click reload returns full list
//     fetchAllStocks.mockResolvedValueOnce({ data: mockStocks });

//     render(<App />);
//     fireEvent.click(await screen.findByText("Show All Stocks"));

//     await waitFor(() => expect(fetchAllStocks).toHaveBeenCalledTimes(2));
//     expect(await screen.findByText("AAPL")).toBeInTheDocument();
//     expect(await screen.findByText("GOOG")).toBeInTheDocument();
//   });

//   test("sort_by_last_updated_button_fetches_sorted_stocks", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     fetchStocksSortedByDate.mockResolvedValueOnce({ data: mockStocks });
//     render(<App />);
//     fireEvent.click(await screen.findByText("Sort by Last Updated"));

//     await waitFor(() =>
//       expect(fetchStocksSortedByDate).toHaveBeenCalledTimes(1)
//     );
//     expect(await screen.findByText("AAPL")).toBeInTheDocument();
//   });

//   test("displays_empty_state_when_no_stocks_available", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     render(<App />);

//     await waitFor(() => {
//       const rows = screen.queryAllByRole("row");
//       expect(rows.length).toBe(1); // only header row
//     });
//   });

//   test("home_static_content_renders_correctly", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     render(<App />);
//     expect(
//       await screen.findByText(/Monitor real-time stock prices/i)
//     ).toBeInTheDocument();
//   });

//   test("add_stock_shows_alert_if_fields_empty", async () => {
//     fetchAllStocks.mockResolvedValueOnce({ data: [] });
//     render(<App />);
//     window.alert = jest.fn();
//     fireEvent.click(await screen.findByText("Add Stock"));
//     expect(window.alert).toHaveBeenCalledWith("All fields are required!");
//   });
// });
