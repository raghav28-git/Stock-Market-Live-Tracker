const API_BASE_URL = "https://8080-edadadafcfebaaecafeefebdedcedabff.premiumproject.examly.io/api";

// Stock API
export const fetchAllStocks = async () => {
  const res = await fetch(`${API_BASE_URL}/stocks/allStocks`);
  if (!res.ok) {
    throw new Error("Failed to fetch all stocks");
  }
  const json = await res.json();
  return { data: json };
};

export const fetchStocksByCompany = async (companyName) => {
  const res = await fetch(
    `${API_BASE_URL}/stocks/byCompany?companyName=${encodeURIComponent(companyName)}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch stocks by company");
  }
  const json = await res.json();
  return { data: json };
};

export const fetchStocksSortedByDate = async () => {
  const res = await fetch(`${API_BASE_URL}/stocks/sortedByDate`);
  if (!res.ok) {
    throw new Error("Failed to fetch stocks sorted by date");
  }
  const json = await res.json();
  return { data: json };
};

export const addStock = async (stock) => {
  const res = await fetch(`${API_BASE_URL}/stocks/addStock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stock),
  });
  if (!res.ok) {
    throw new Error("Failed to add stock");
  }
  return res.json();
};

export const deleteStock = async (id) => {
  const res = await fetch(`${API_BASE_URL}/stocks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete stock");
  }
  return res.ok;
};

// Market Data API
export const fetchMarketData = async () => {
  const res = await fetch(`${API_BASE_URL}/market/all`);
  if (!res.ok) {
    throw new Error("Failed to fetch market data");
  }
  return res.json();
};

export const fetchQuote = async (symbol) => {
  const res = await fetch(`${API_BASE_URL}/market/quote/${symbol}`);
  if (!res.ok) {
    throw new Error("Failed to fetch quote");
  }
  return res.json();
};

export const searchStocks = async (query) => {
  const res = await fetch(`${API_BASE_URL}/market/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error("Failed to search stocks");
  }
  return res.json();
};

// Portfolio API
export const fetchUserPortfolios = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/portfolios/user/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch portfolios");
  }
  return res.json();
};

export const createPortfolio = async (portfolioData) => {
  const res = await fetch(`${API_BASE_URL}/portfolios/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(portfolioData),
  });
  if (!res.ok) {
    throw new Error("Failed to create portfolio");
  }
  return res.json();
};

export const fetchPortfolioHoldings = async (portfolioId) => {
  const res = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/holdings`);
  if (!res.ok) {
    throw new Error("Failed to fetch holdings");
  }
  return res.json();
};

export const addHolding = async (portfolioId, holdingData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/holdings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(holdingData),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to add holding: ${res.status} ${res.statusText}`);
    }
    
    const responseText = await res.text();
    console.log('API Response Text:', responseText);
    console.log('Response length:', responseText.length);
    
    if (!responseText || responseText.trim() === '') {
      console.log('Empty response, but request was successful');
      return {};
    }
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response was:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Error in addHolding:', error);
    throw error;
  }
};

// Alert API
export const fetchUserAlerts = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/alerts/user/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch alerts");
  }
  return res.json();
};

export const createAlert = async (alertData) => {
  const res = await fetch(`${API_BASE_URL}/alerts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alertData),
  });
  if (!res.ok) {
    throw new Error("Failed to create alert");
  }
  return res.json();
};

// Auth API
export const login = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    throw new Error("Failed to login");
  }
  const data = await res.json();
  if (data.user && data.user.roles) {
    localStorage.setItem('userRole', data.user.roles[0]);
  }
  return data;
};

export const register = async (userData) => {
  const registrationData = {
    ...userData,
    roles: [userData.role]
  };
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationData),
  });
  if (!res.ok) {
    throw new Error("Failed to register");
  }
  return res.json();
};
