import React, { useState, useEffect } from 'react';
import { fetchUserPortfolios, createPortfolio, fetchPortfolioHoldings, addHolding } from '../services/api';

const PortfolioManager = ({ userId = 1 }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddHoldingForm, setShowAddHoldingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [newPortfolio, setNewPortfolio] = useState({
    portfolioName: '',
    description: ''
  });

  const [newHolding, setNewHolding] = useState({
    symbol: '',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    loadPortfolios();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const portfoliosData = await fetchUserPortfolios(userId);
      setPortfolios(portfoliosData || []);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const loadHoldings = async (portfolioId) => {
    try {
      const holdingsData = await fetchPortfolioHoldings(portfolioId);
      setHoldings(holdingsData || []);
    } catch (error) {
      console.error('Error loading holdings:', error);
      setHoldings([]);
    }
  };

  const handleCreatePortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolio.portfolioName.trim()) {
      setMessage('Portfolio name is required');
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    try {
      const portfolioData = {
        userId,
        portfolioName: newPortfolio.portfolioName.trim(),
        description: newPortfolio.description.trim()
      };
      
      await createPortfolio(portfolioData);
      setNewPortfolio({ portfolioName: '', description: '' });
      setShowCreateForm(false);
      setMessage('Portfolio created successfully!');
      await loadPortfolios();
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setMessage('Failed to create portfolio. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddHolding = async (e) => {
    e.preventDefault();
    if (!selectedPortfolio) return;
    
    const symbol = newHolding.symbol.trim().toUpperCase();
    const quantity = parseFloat(newHolding.quantity);
    const price = parseFloat(newHolding.price);
    
    if (!symbol || quantity <= 0 || price <= 0) {
      setMessage('Please enter valid symbol, quantity, and price');
      return;
    }
    
    setSubmitting(true);
    setMessage('');
    try {
      const holdingData = { symbol, quantity, price };
      await addHolding(selectedPortfolio.id, holdingData);
      setNewHolding({ symbol: '', quantity: '', price: '' });
      setShowAddHoldingForm(false);
      setMessage('Holding added successfully!');
      await loadHoldings(selectedPortfolio.id);
      await loadPortfolios();
    } catch (error) {
      console.error('Error adding holding:', error);
      console.error('Error details:', error.message);
      setMessage(`Failed to add holding: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    loadHoldings(portfolio.id);
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading portfolios...</div>;
  }

  return (
    <div style={{padding: '1rem', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e9ecef'}}>
        <h2 style={{margin: 0, color: '#333'}}>Portfolio Manager</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          style={{padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold'}}
        >
          + Create Portfolio
        </button>
      </div>
      
      {message && (
        <div style={{padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '4px', backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da', color: message.includes('success') ? '#155724' : '#721c24', border: `1px solid ${message.includes('success') ? '#c3e6cb' : '#f5c6cb'}`}}>
          {message}
        </div>
      )}

      {showCreateForm && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginBottom: '1.5rem', color: '#333'}}>Create New Portfolio</h3>
            <form onSubmit={handleCreatePortfolio}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Portfolio Name *</label>
                <input
                  type="text"
                  value={newPortfolio.portfolioName}
                  onChange={(e) => setNewPortfolio({...newPortfolio, portfolioName: e.target.value})}
                  placeholder="Enter portfolio name"
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'}}
                  disabled={submitting}
                  required
                />
              </div>
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Description</label>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                  placeholder="Optional description"
                  rows="3"
                  style={{width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', resize: 'vertical'}}
                  disabled={submitting}
                />
              </div>
              <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                <button type="button" onClick={() => {setShowCreateForm(false); setMessage('');}} disabled={submitting} style={{padding: '0.75rem 1.5rem', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" disabled={submitting} style={{padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1}}>
                  {submitting ? 'Creating...' : 'Create Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: selectedPortfolio ? '1fr 2fr' : '1fr', gap: '2rem'}}>
        <div>
          <h3 style={{marginBottom: '1rem', color: '#333'}}>My Portfolios ({portfolios.length})</h3>
          {portfolios.length > 0 ? (
            portfolios.map((portfolio) => (
              <div 
                key={portfolio.id} 
                onClick={() => selectPortfolio(portfolio)}
                style={{
                  padding: '1rem',
                  border: selectedPortfolio?.id === portfolio.id ? '2px solid #007bff' : '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  backgroundColor: selectedPortfolio?.id === portfolio.id ? '#f8f9ff' : 'white',
                  transition: 'all 0.2s ease'
                }}
              >
                <h4 style={{margin: '0 0 0.5rem 0', color: '#333'}}>{portfolio.portfolioName}</h4>
                <p style={{margin: '0.25rem 0', color: '#28a745', fontWeight: 'bold'}}>Total Value: ${portfolio.totalValue?.toFixed(2) || '0.00'}</p>
                <p style={{margin: '0.25rem 0', color: '#6c757d'}}>Cash Balance: ${portfolio.cashBalance?.toFixed(2) || '0.00'}</p>
                {portfolio.description && <small style={{color: '#6c757d'}}>{portfolio.description}</small>}
              </div>
            ))
          ) : (
            <div style={{textAlign: 'center', padding: '2rem', color: '#6c757d'}}>
              <p>No portfolios found.</p>
              <p>Create your first portfolio to get started!</p>
            </div>
          )}
        </div>

        {selectedPortfolio && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e9ecef'}}>
              <h3 style={{margin: 0, color: '#333'}}>{selectedPortfolio.portfolioName} Holdings</h3>
              <button 
                onClick={() => {
                  console.log('Add Holding button clicked');
                  setShowAddHoldingForm(true);
                }}
                style={{padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem'}}
              >
                + Add Holding
              </button>
            </div>

            {console.log('showAddHoldingForm:', showAddHoldingForm)}
            {showAddHoldingForm && (
              <div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e9ecef'}}>
                <h4 style={{marginBottom: '1rem', color: '#333'}}>Add New Holding</h4>
                <form onSubmit={handleAddHolding}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold'}}>Symbol *</label>
                      <input
                        type="text"
                        placeholder="AAPL"
                        value={newHolding.symbol}
                        onChange={(e) => setNewHolding({...newHolding, symbol: e.target.value.toUpperCase()})}
                        style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'}}
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold'}}>Quantity *</label>
                      <input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        placeholder="10"
                        value={newHolding.quantity}
                        onChange={(e) => setNewHolding({...newHolding, quantity: e.target.value})}
                        style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'}}
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold'}}>Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="150.00"
                        value={newHolding.price}
                        onChange={(e) => setNewHolding({...newHolding, price: e.target.value})}
                        style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'}}
                        disabled={submitting}
                        required
                      />
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                    <button type="button" onClick={() => {setShowAddHoldingForm(false); setMessage('');}} disabled={submitting} style={{padding: '0.5rem 1rem', border: '1px solid #ddd', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer'}}>Cancel</button>
                    <button type="submit" disabled={submitting} style={{padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1}}>
                      {submitting ? 'Adding...' : 'Add Holding'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div>
              {holdings.length > 0 ? (
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <thead>
                      <tr style={{backgroundColor: '#f8f9fa'}}>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Symbol</th>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Company</th>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Quantity</th>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Avg Cost</th>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Current Price</th>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Market Value</th>
                        <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#495057', borderBottom: '2px solid #dee2e6'}}>Gain/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((holding) => (
                        <tr key={holding.id} style={{borderBottom: '1px solid #dee2e6'}}>
                          <td style={{padding: '0.75rem', fontWeight: 'bold', color: '#007bff'}}>{holding.symbol}</td>
                          <td style={{padding: '0.75rem', color: '#495057'}}>{holding.companyName || 'N/A'}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: '#495057'}}>{holding.quantity}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: '#495057'}}>${holding.averageCost?.toFixed(2)}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', color: '#495057'}}>${holding.currentPrice?.toFixed(2) || 'N/A'}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#495057'}}>${holding.marketValue?.toFixed(2) || 'N/A'}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: holding.unrealizedGainLoss >= 0 ? '#28a745' : '#dc3545'}}>
                            ${holding.unrealizedGainLoss?.toFixed(2) || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '3rem', color: '#6c757d', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #dee2e6'}}>
                  <p style={{fontSize: '1.125rem', marginBottom: '0.5rem'}}>No holdings in this portfolio</p>
                  <p>Add your first stock to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;