import React, { useState, useEffect } from 'react';
import { fetchMarketData, fetchUserPortfolios, fetchUserAlerts } from '../services/api';

const Dashboard = ({ userId = 1 }) => {
  const [marketData, setMarketData] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [marketResponse, portfoliosResponse, alertsResponse] = await Promise.all([
          fetchMarketData().catch(() => []),
          fetchUserPortfolios(userId).catch(() => []),
          fetchUserAlerts(userId).catch(() => [])
        ]);
        
        setMarketData(Array.isArray(marketResponse) ? marketResponse.slice(0, 8) : []);
        setPortfolios(Array.isArray(portfoliosResponse) ? portfoliosResponse : []);
        setAlerts(Array.isArray(alertsResponse) ? alertsResponse.filter(alert => !alert.isTriggered).slice(0, 5) : []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId]);

  const calculateTotalPortfolioValue = () => {
    return portfolios.reduce((total, portfolio) => total + (portfolio.totalValue || 0), 0);
  };

  const getTopGainer = () => {
    if (marketData.length === 0) return null;
    return marketData.reduce((max, stock) => 
      (stock.changePercent || 0) > (max.changePercent || 0) ? stock : max
    );
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
        <div style={{fontSize: '1.2rem', color: '#6c757d'}}>Loading dashboard...</div>
      </div>
    );
  }

  const topGainer = getTopGainer();

  return (
    <div style={{padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header */}
      <div style={{marginBottom: '2rem'}}>
        <h1 style={{margin: '0 0 0.5rem 0', color: '#212529', fontSize: '2.5rem', fontWeight: 'bold'}}>Dashboard</h1>
        <p style={{margin: 0, color: '#6c757d', fontSize: '1.1rem'}}>Welcome back! Here's your portfolio overview</p>
      </div>

      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{margin: '0 0 0.5rem 0', color: '#6c757d', fontSize: '0.875rem', fontWeight: '500'}}>TOTAL PORTFOLIO VALUE</p>
              <h2 style={{margin: 0, color: '#28a745', fontSize: '2rem', fontWeight: 'bold'}}>${calculateTotalPortfolioValue().toFixed(2)}</h2>
            </div>
            <div style={{width: '48px', height: '48px', backgroundColor: '#28a745', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: 'white', fontSize: '1.5rem'}}>💰</span>
            </div>
          </div>
        </div>

        <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{margin: '0 0 0.5rem 0', color: '#6c757d', fontSize: '0.875rem', fontWeight: '500'}}>ACTIVE PORTFOLIOS</p>
              <h2 style={{margin: 0, color: '#007bff', fontSize: '2rem', fontWeight: 'bold'}}>{portfolios.length}</h2>
            </div>
            <div style={{width: '48px', height: '48px', backgroundColor: '#007bff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: 'white', fontSize: '1.5rem'}}>📊</span>
            </div>
          </div>
        </div>

        <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{margin: '0 0 0.5rem 0', color: '#6c757d', fontSize: '0.875rem', fontWeight: '500'}}>ACTIVE ALERTS</p>
              <h2 style={{margin: 0, color: '#ffc107', fontSize: '2rem', fontWeight: 'bold'}}>{alerts.length}</h2>
            </div>
            <div style={{width: '48px', height: '48px', backgroundColor: '#ffc107', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: 'white', fontSize: '1.5rem'}}>🔔</span>
            </div>
          </div>
        </div>

        {topGainer && (
          <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <p style={{margin: '0 0 0.5rem 0', color: '#6c757d', fontSize: '0.875rem', fontWeight: '500'}}>TOP PERFORMER</p>
                <h2 style={{margin: 0, color: '#17a2b8', fontSize: '1.5rem', fontWeight: 'bold'}}>{topGainer.symbol}</h2>
                <p style={{margin: 0, color: '#28a745', fontSize: '0.875rem'}}>${topGainer.currentPrice}</p>
              </div>
              <div style={{width: '48px', height: '48px', backgroundColor: '#17a2b8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{color: 'white', fontSize: '1.5rem'}}>📈</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
        {/* Market Overview */}
        <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
            <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Market Overview</h3>
          </div>
          <div style={{padding: '1rem'}}>
            {marketData.length > 0 ? (
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f8f9fa'}}>
                      <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>SYMBOL</th>
                      <th style={{padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>COMPANY</th>
                      <th style={{padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>PRICE</th>
                      <th style={{padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>VOLUME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((stock, index) => (
                      <tr key={stock.id} style={{borderBottom: index < marketData.length - 1 ? '1px solid #f1f3f4' : 'none'}}>
                        <td style={{padding: '0.75rem', fontWeight: 'bold', color: '#007bff'}}>{stock.symbol}</td>
                        <td style={{padding: '0.75rem', color: '#495057'}}>{stock.companyName}</td>
                        <td style={{padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#212529'}}>${stock.currentPrice}</td>
                        <td style={{padding: '0.75rem', textAlign: 'right', color: '#6c757d'}}>{stock.volume?.toLocaleString() || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{textAlign: 'center', padding: '3rem', color: '#6c757d'}}>
                <p>No market data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* Portfolios */}
          <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
              <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>My Portfolios</h3>
            </div>
            <div style={{padding: '1rem'}}>
              {portfolios.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {portfolios.map((portfolio) => (
                    <div key={portfolio.id} style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef'}}>
                      <h4 style={{margin: '0 0 0.5rem 0', color: '#212529', fontSize: '1rem'}}>{portfolio.portfolioName}</h4>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem'}}>
                        <span style={{color: '#28a745', fontWeight: '600'}}>Value: ${portfolio.totalValue?.toFixed(2) || '0.00'}</span>
                        <span style={{color: '#6c757d'}}>Cash: ${portfolio.cashBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6c757d'}}>
                  <p>No portfolios found</p>
                  <p style={{fontSize: '0.875rem'}}>Create your first portfolio!</p>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
              <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Recent Alerts</h3>
            </div>
            <div style={{padding: '1rem'}}>
              {alerts.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  {alerts.map((alert) => (
                    <div key={alert.id} style={{padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '6px', border: '1px solid #ffeaa7'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontWeight: 'bold', color: '#856404'}}>{alert.symbol}</span>
                        <span style={{fontSize: '0.875rem', color: '#856404'}}>{alert.alertType}</span>
                      </div>
                      <div style={{fontSize: '0.875rem', color: '#856404', marginTop: '0.25rem'}}>
                        Target: ${alert.targetPrice}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6c757d'}}>
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;