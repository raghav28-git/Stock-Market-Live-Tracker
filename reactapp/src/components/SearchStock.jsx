import React, { useState } from "react";

const SearchStock = ({ onSearchResult }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please enter a company name!");
      return;
    }
    
    setLoading(true);
    try {
      await onSearchResult(query.trim());
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <span style={{fontSize: '1.5rem'}}>🔍</span>
        <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>Search Stocks</h3>
      </div>
      
      <form onSubmit={handleSearch} style={{display: 'flex', gap: '1rem', alignItems: 'end'}}>
        <div style={{flex: 1}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>
            COMPANY NAME
          </label>
          <input
            type="text"
            placeholder="Enter company name (e.g., Apple, Microsoft)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
        >
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchStock;