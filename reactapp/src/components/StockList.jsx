import React, { useState, useEffect } from "react";

const StockList = ({ stocks, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 5;
  
  const totalPages = Math.ceil(stocks.length / stocksPerPage);
  const startIndex = (currentPage - 1) * stocksPerPage;
  const endIndex = startIndex + stocksPerPage;
  const currentStocks = stocks.slice(startIndex, endIndex);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [stocks]);
  
  return (
  <div style={{backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: '1px solid #e9ecef'}}>
    <div style={{padding: '1.5rem', borderBottom: '1px solid #e9ecef'}}>
      <h3 style={{margin: 0, color: '#212529', fontSize: '1.25rem', fontWeight: 'bold'}}>
        Stocks List ({stocks.length})
      </h3>
      {totalPages > 1 && (
        <div style={{fontSize: '0.875rem', color: '#6c757d'}}>
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
    
    {currentStocks.length > 0 ? (
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#f8f9fa'}}>
              <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>SYMBOL</th>
              <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>COMPANY NAME</th>
              <th style={{padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>PRICE</th>
              <th style={{padding: '1rem 0.75rem', textAlign: 'left', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>LAST UPDATED</th>
              <th style={{padding: '1rem 0.75rem', textAlign: 'center', fontWeight: '600', color: '#495057', fontSize: '0.875rem'}}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentStocks.map((stock, index) => (
              <tr 
                key={stock.id} 
                style={{
                  borderBottom: index < currentStocks.length - 1 ? '1px solid #f1f3f4' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{padding: '0.75rem', fontWeight: 'bold', color: '#007bff'}}>{stock.symbol}</td>
                <td style={{padding: '0.75rem', color: '#495057'}}>{stock.companyName}</td>
                <td style={{padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#28a745'}}>
                  ${parseFloat(stock.price).toFixed(2)}
                </td>
                <td style={{padding: '0.75rem', color: '#6c757d', fontSize: '0.875rem'}}>
                  {new Date(stock.lastUpdated).toLocaleDateString()} {new Date(stock.lastUpdated).toLocaleTimeString()}
                </td>
                <td style={{padding: '0.75rem', textAlign: 'center'}}>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${stock.symbol} (${stock.companyName})?`)) {
                        onDelete(stock.id);
                      }
                    }}
                    style={{
                      padding: '0.375rem 0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div style={{textAlign: 'center', padding: '3rem', color: '#6c757d'}}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📊</div>
        <p style={{fontSize: '1.125rem', marginBottom: '0.5rem'}}>No stocks found</p>
        <p>Add your first stock to get started!</p>
      </div>
    )}
    
    {totalPages > 1 && (
      <div style={{padding: '1rem 1.5rem', borderTop: '1px solid #e9ecef', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === 1 ? '#f8f9fa' : '#007bff',
            color: currentPage === 1 ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Previous
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: currentPage === page ? '#007bff' : 'white',
              color: currentPage === page ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              minWidth: '40px'
            }}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#007bff',
            color: currentPage === totalPages ? '#6c757d' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Next
        </button>
      </div>
    )}
  </div>
  );
};

export default StockList;