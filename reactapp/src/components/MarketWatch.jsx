import React, { useState, useEffect } from 'react';
import { fetchMarketData, searchStocks, fetchQuote, createAlert } from '../services/api';

const MarketWatch = ({ userId = 1 }) => {
  const [marketData, setMarketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newAlert, setNewAlert] = useState({
    symbol: '',
    alertType: 'PRICE_ABOVE',
    targetPrice: ''
  });

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      const data = await fetchMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stocks:', error);
    }
  };

  const handleStockSelect = async (stock) => {
    try {
      const quote = await fetchQuote(stock.symbol);
      setSelectedStock(quote);
      setNewAlert({...newAlert, symbol: stock.symbol});
    } catch (error) {
      console.error('Error fetching quote:', error);
      setSelectedStock(stock);
      setNewAlert({...newAlert, symbol: stock.symbol});
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const alertData = {
        userId,
        symbol: newAlert.symbol,
        alertType: newAlert.alertType,
        targetPrice: parseFloat(newAlert.targetPrice)
      };
      
      await createAlert(alertData);
      setNewAlert({ symbol: '', alertType: 'PRICE_ABOVE', targetPrice: '' });
      setShowAlertForm(false);
      alert('Alert created successfully!');
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : 'N/A';
  };

  const formatVolume = (volume) => {
    if (!volume) return 'N/A';
    return volume.toLocaleString();
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
        <div style={{fontSize: '1.2rem', color: '#6c757d'}}>Loading market data...</div>
      </div>
    );
  }

  return (
    <div style={{padding: '1.5rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header */}
      <div style={{marginBottom: '2rem'}}>
        <h1 style={{margin: '0 0 1rem 0', color: '#212529', fontSize: '2.5rem', fontWeight: 'bold'}}>Market Watch</h1>
        
        {/* Search Section */}
        <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
          <form onSubmit={handleSearch} style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <input
              type="text"
              placeholder="Search stocks by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{flex: 1, padding: '0.75rem 1rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s'}}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
            <button 
              type="submit"
              style={{padding: '0.75rem 2rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              🔍 Search
            </button>
          </form>
        </div>
      </div>

      {/* Market Data Table */}
      <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', marginBottom: '2rem'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
          <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Market Overview</h3>
        </div>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: '#f8f9fa'}}>
                <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>SYMBOL</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>COMPANY</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>PRICE</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>OPEN</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>HIGH</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>LOW</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>VOLUME</th>
                <th style={{padding: '1rem 0.75rem', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((stock, index) => (
                <tr key={stock.id} style={{borderBottom: index < marketData.length - 1 ? '1px solid #f1f3f4' : 'none', transition: 'background-color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{padding: '0.75rem', fontWeight: 'bold', color: '#007bff'}}>{stock.symbol}</td>
                  <td style={{padding: '0.75rem', color: '#495057'}}>{stock.companyName}</td>
                  <td style={{padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#212529'}}>${formatPrice(stock.currentPrice)}</td>
                  <td style={{padding: '0.75rem', textAlign: 'right', color: '#6c757d'}}>${formatPrice(stock.openPrice)}</td>
                  <td style={{padding: '0.75rem', textAlign: 'right', color: '#28a745', fontWeight: '600'}}>${formatPrice(stock.highPrice)}</td>
                  <td style={{padding: '0.75rem', textAlign: 'right', color: '#dc3545', fontWeight: '600'}}>${formatPrice(stock.lowPrice)}</td>
                  <td style={{padding: '0.75rem', textAlign: 'right', color: '#6c757d'}}>{formatVolume(stock.volume)}</td>
                  <td style={{padding: '0.75rem', textAlign: 'center'}}>
                    <button 
                      onClick={() => handleStockSelect(stock)}
                      style={{padding: '0.375rem 0.75rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer', transition: 'background-color 0.2s'}}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', marginBottom: '2rem'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
            <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Search Results</h3>
          </div>
          <div style={{padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem'}}>
            {searchResults.map((stock) => (
              <div 
                key={stock.id} 
                onClick={() => handleStockSelect(stock)}
                style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef', cursor: 'pointer', transition: 'all 0.2s'}}
                onMouseOver={(e) => {e.target.style.backgroundColor = '#e9ecef'; e.target.style.transform = 'translateY(-2px)';}}
                onMouseOut={(e) => {e.target.style.backgroundColor = '#f8f9fa'; e.target.style.transform = 'translateY(0)';}}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem'}}>{stock.symbol}</div>
                    <div style={{color: '#6c757d', fontSize: '0.875rem'}}>{stock.companyName}</div>
                  </div>
                  <div style={{fontWeight: 'bold', color: '#212529', fontSize: '1.1rem'}}>${formatPrice(stock.currentPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Details */}
      {selectedStock && (
        <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Stock Details</h3>
              <button 
                onClick={() => setShowAlertForm(true)}
                style={{padding: '0.5rem 1rem', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer'}}
              >
                🔔 Create Alert
              </button>
            </div>
          </div>
          <div style={{padding: '1.5rem'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <h4 style={{margin: '0 0 0.5rem 0', color: '#212529', fontSize: '1.5rem'}}>{selectedStock.symbol} - {selectedStock.companyName}</h4>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <span style={{fontSize: '2rem', fontWeight: 'bold', color: '#28a745'}}>${formatPrice(selectedStock.currentPrice)}</span>
                {selectedStock.exchange && <span style={{padding: '0.25rem 0.5rem', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '0.875rem', color: '#6c757d'}}>{selectedStock.exchange}</span>}
              </div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>Open</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#212529'}}>${formatPrice(selectedStock.openPrice)}</div>
              </div>
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>High</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#28a745'}}>${formatPrice(selectedStock.highPrice)}</div>
              </div>
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>Low</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#dc3545'}}>${formatPrice(selectedStock.lowPrice)}</div>
              </div>
              <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>Volume</div>
                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#212529'}}>{formatVolume(selectedStock.volume)}</div>
              </div>
              {selectedStock.peRatio && (
                <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                  <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>P/E Ratio</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#212529'}}>{selectedStock.peRatio.toFixed(2)}</div>
                </div>
              )}
              {selectedStock.dividendYield && (
                <div style={{padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                  <div style={{fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.25rem'}}>Dividend Yield</div>
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#212529'}}>{(selectedStock.dividendYield * 100).toFixed(2)}%</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertForm && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}}>
            <h3 style={{marginBottom: '1.5rem', color: '#212529', fontSize: '1.5rem'}}>Create Price Alert</h3>
            <form onSubmit={handleCreateAlert}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057'}}>Symbol</label>
                <input
                  type="text"
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({...newAlert, symbol: e.target.value})}
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem', backgroundColor: '#f8f9fa'}}
                  required
                  readOnly
                />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057'}}>Alert Type</label>
                <select
                  value={newAlert.alertType}
                  onChange={(e) => setNewAlert({...newAlert, alertType: e.target.value})}
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem'}}
                >
                  <option value="PRICE_ABOVE">Price Above</option>
                  <option value="PRICE_BELOW">Price Below</option>
                </select>
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057'}}>Target Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAlert.targetPrice}
                  onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem'}}
                  required
                />
              </div>
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                <button type="button" onClick={() => setShowAlertForm(false)} style={{padding: '0.75rem 1.5rem', border: '1px solid #ced4da', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" style={{padding: '0.75rem 1.5rem', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'}}>Create Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketWatch;