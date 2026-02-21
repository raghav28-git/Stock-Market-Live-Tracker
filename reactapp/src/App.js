import React, { useState, useEffect } from "react";
import {
 fetchAllStocks,
 fetchStocksByCompany,
 fetchStocksSortedByDate,
 addStock,
 deleteStock,
} from "./services/api";
import AddStockForm from "./components/AddStockForm";
import SearchStock from "./components/SearchStock";
import StockList from "./components/StockList";
import Dashboard from "./components/Dashboard";
import PortfolioManager from "./components/PortfolioManager";
import MarketWatch from "./components/MarketWatch";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
 const [stocks, setStocks] = useState([]);
 const [activeTab, setActiveTab] = useState('dashboard');
 const [userId] = useState(1); // Mock user ID
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [showRegister, setShowRegister] = useState(false);
 const [userRole, setUserRole] = useState(null);

 useEffect(() => {
   const token = localStorage.getItem('token');
   const role = localStorage.getItem('userRole');
   if (token) {
     setIsAuthenticated(true);
     setUserRole(role || 'GUEST');
   }
 }, []);

 const getAllStocks = async () => {
  try {
    const response = await fetchAllStocks();
    setStocks(response.data);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    setStocks([]);
  }
 };

 const handleAddStock = async (stock) => {
  try {
    await addStock(stock);
    await getAllStocks();
  } catch (error) {
    console.error('Error adding stock:', error);
    alert('Failed to add stock. Please try again.');
  }
 };

 const handleDeleteStock = async (id) => {
  try {
    await deleteStock(id);
    await getAllStocks();
  } catch (error) {
    console.error('Error deleting stock:', error);
    alert('Failed to delete stock. Please try again.');
  }
 };

 const handleSearch = async (companyName) => {
  try {
    const response = await fetchStocksByCompany(companyName);
    setStocks(response.data);
  } catch (error) {
    console.error('Error searching stocks:', error);
  }
 };

 const handleSortByDate = async () => {
  try {
    const response = await fetchStocksSortedByDate();
    setStocks(response.data);
  } catch (error) {
    console.error('Error sorting stocks:', error);
  }
 };

 useEffect(() => {
  if (isAuthenticated) {
    getAllStocks();
  }
 }, [isAuthenticated]);

 const handleLogin = (token) => {
   const role = localStorage.getItem('userRole') || 'GUEST';
   setIsAuthenticated(true);
   setUserRole(role);
 };

 const handleLogout = () => {
   localStorage.removeItem('token');
   localStorage.removeItem('userRole');
   setIsAuthenticated(false);
   setUserRole(null);
 };

 const handleRegister = () => {
   setShowRegister(false);
 };

 const hasAccess = (requiredRoles) => {
   if (!userRole) return false;
   if (userRole === 'ADMIN') return true;
   return requiredRoles.includes(userRole);
 };

 const renderActiveTab = () => {
  switch(activeTab) {
    case 'dashboard':
      return <Dashboard userId={userId} />;
    case 'portfolio':
      if (!hasAccess(['INVESTOR', 'TRADER', 'PORTFOLIO_MANAGER'])) {
        return <div style={{padding: '2rem', textAlign: 'center', color: '#dc3545'}}>
          <h3>Access Denied</h3>
          <p>Portfolio management requires Investor access or higher.</p>
        </div>;
      }
      return <PortfolioManager userId={userId} />;
    case 'market':
      return <MarketWatch userId={userId} />;
    case 'stocks':
    default:
      if (!hasAccess(['INVESTOR', 'TRADER', 'ADMIN'])) {
        return <div style={{padding: '2rem', textAlign: 'center', color: '#dc3545'}}>
          <h3>Access Denied</h3>
          <p>Stock management requires Investor access or higher.</p>
        </div>;
      }
      return (
        <div style={{padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
          <div style={{marginBottom: '2rem'}}>
            <h1 style={{margin: '0 0 0.5rem 0', color: '#212529', fontSize: '2.5rem', fontWeight: 'bold'}}>Stock Management</h1>
            <p style={{margin: 0, color: '#6c757d', fontSize: '1.1rem'}}>Add, search, and manage your stock database ({userRole})</p>
          </div>

          {hasAccess(['ADMIN']) && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
              <AddStockForm onStockAdded={handleAddStock} />
              <SearchStock onSearchResult={handleSearch} />
            </div>
          )}

          <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', marginBottom: '2rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
              <span style={{fontSize: '1.5rem'}}>⚙️</span>
              <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Quick Actions</h3>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button 
                onClick={getAllStocks}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
              >
                📊 Show All Stocks
              </button>
              <button 
                onClick={handleSortByDate}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a32a3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6f42c1'}
              >
                📅 Sort by Date
              </button>
            </div>
          </div>

          <StockList stocks={stocks} onDelete={handleDeleteStock} />
        </div>
      );
  }
 };

 if (!isAuthenticated) {
   return showRegister ? (
     <Register 
       onRegister={handleRegister}
       onSwitchToLogin={() => setShowRegister(false)}
     />
   ) : (
     <Login 
       onLogin={handleLogin}
       onSwitchToRegister={() => setShowRegister(true)}
     />
   );
 }

 return (
  <div className="app">
   <div style={{
     background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
     padding: '2rem 0',
     boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
     borderBottom: '3px solid #e94560'
   }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
      textAlign: 'center'
    }}>
     <div style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       gap: '1rem',
       marginBottom: '1rem'
     }}>
       <div style={{
         width: '60px',
         height: '60px',
         background: 'linear-gradient(135deg, #e94560, #f39c12)',
         borderRadius: '16px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         fontSize: '2rem',
         boxShadow: '0 4px 15px rgba(233, 69, 96, 0.3)'
       }}>
         📈
       </div>
       <h1 style={{
         margin: 0,
         color: '#ffffff',
         fontSize: '2.5rem',
         fontWeight: 'bold',
         letterSpacing: '-1px',
         textShadow: '0 2px 4px rgba(0,0,0,0.3)'
       }}>Stock Market Live Tracker</h1>
       {userRole && (
         <div style={{
           backgroundColor: 'rgba(255,255,255,0.2)',
           padding: '0.25rem 0.75rem',
           borderRadius: '12px',
           fontSize: '0.875rem',
           color: '#ffffff',
           marginTop: '0.5rem'
         }}>
           {userRole === 'ADMIN' ? '⚡ Administrator' : 
            userRole === 'INVESTOR' ? '💼 Investor' : 
            userRole === 'GUEST' ? '👤 Guest User' : userRole}
         </div>
       )}
     </div>
     <p style={{
       margin: '0 auto',
       color: '#a0aec0',
       fontSize: '1.1rem',
       fontWeight: '400',
       maxWidth: '600px'
     }}>
      Monitor real-time stock prices, track performance, and stay ahead with the latest market trends!
     </p>
    </div>
    
    <nav style={{
      maxWidth: '1400px',
      margin: '2rem auto 0',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }}>
      <button 
        onClick={() => setActiveTab('dashboard')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'dashboard' ? '#e94560' : 'rgba(255,255,255,0.1)',
          color: activeTab === 'dashboard' ? 'white' : '#a0aec0',
          border: activeTab === 'dashboard' ? 'none' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '25px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: activeTab === 'dashboard' ? '0 4px 15px rgba(233, 69, 96, 0.4)' : 'none'
        }}
        onMouseOver={(e) => {
          if (activeTab !== 'dashboard') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.target.style.color = 'white';
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== 'dashboard') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.color = '#a0aec0';
          }
        }}
      >
        📊 Dashboard
      </button>
      <button 
        onClick={() => setActiveTab('portfolio')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'portfolio' ? '#e94560' : 'rgba(255,255,255,0.1)',
          color: activeTab === 'portfolio' ? 'white' : '#a0aec0',
          border: activeTab === 'portfolio' ? 'none' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '25px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: activeTab === 'portfolio' ? '0 4px 15px rgba(233, 69, 96, 0.4)' : 'none'
        }}
        onMouseOver={(e) => {
          if (activeTab !== 'portfolio') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.target.style.color = 'white';
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== 'portfolio') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.color = '#a0aec0';
          }
        }}
      >
        💼 Portfolio
      </button>
      <button 
        onClick={() => setActiveTab('market')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'market' ? '#e94560' : 'rgba(255,255,255,0.1)',
          color: activeTab === 'market' ? 'white' : '#a0aec0',
          border: activeTab === 'market' ? 'none' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '25px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: activeTab === 'market' ? '0 4px 15px rgba(233, 69, 96, 0.4)' : 'none'
        }}
        onMouseOver={(e) => {
          if (activeTab !== 'market') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.target.style.color = 'white';
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== 'market') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.color = '#a0aec0';
          }
        }}
      >
        📈 Market Watch
      </button>
      <button 
        onClick={() => setActiveTab('stocks')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: activeTab === 'stocks' ? '#e94560' : 'rgba(255,255,255,0.1)',
          color: activeTab === 'stocks' ? 'white' : '#a0aec0',
          border: activeTab === 'stocks' ? 'none' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '25px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          boxShadow: activeTab === 'stocks' ? '0 4px 15px rgba(233, 69, 96, 0.4)' : 'none'
        }}
        onMouseOver={(e) => {
          if (activeTab !== 'stocks') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.target.style.color = 'white';
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== 'stocks') {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.target.style.color = '#a0aec0';
          }
        }}
      >
        ⚙️ Stock Management
      </button>
      <button 
        onClick={handleLogout}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(220, 53, 69, 0.2)',
          color: '#ff6b7a',
          border: '1px solid rgba(220, 53, 69, 0.3)',
          borderRadius: '25px',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#dc3545';
          e.target.style.color = 'white';
          e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
          e.target.style.color = '#ff6b7a';
          e.target.style.boxShadow = 'none';
        }}
      >
        🚪 Logout
      </button>
    </nav>
   </div>

   <div className="app-content fade-in">
    {renderActiveTab()}
   </div>
  </div>
 );
}

export default App;

