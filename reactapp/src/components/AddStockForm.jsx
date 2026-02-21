import React, { useState } from "react";

const AddStockForm = ({ onStockAdded }) => {
  const [symbol, setSymbol] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol.trim() || !companyName.trim() || price === "") {
      alert("All fields are required!");
      return;
    }
    
    setLoading(true);
    try {
      const newStock = {
        symbol: symbol.toUpperCase().trim(),
        companyName: companyName.trim(),
        price: parseFloat(price).toFixed(2),
        lastUpdated: new Date().toISOString(),
      };
      await onStockAdded(newStock);
      setSymbol("");
      setCompanyName("");
      setPrice("");
    } catch (error) {
      console.error('Error adding stock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <span style={{fontSize: '1.5rem'}}>➕</span>
        <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Add New Stock</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>
              SYMBOL *
            </label>
            <input
              type="text"
              placeholder="AAPL"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>
              COMPANY NAME *
            </label>
            <input
              type="text"
              placeholder="Apple Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              disabled={loading}
              required
            />
          </div>
          
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>
              PRICE *
            </label>
            <input
              type="number"
              placeholder="150.00"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              disabled={loading}
              required
            />
          </div>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#218838')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#28a745')}
          >
            {loading ? '⏳ Adding...' : '✅ Add Stock'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStockForm;