import React from "react";

const Navbar = () => (
  <nav style={{
    backgroundColor: '#1a1a2e',
    padding: '1rem 2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '3px solid #16213e'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#0f3460',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold'}}>📈</span>
        </div>
        <h2 style={{
          margin: 0,
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          letterSpacing: '-0.5px'
        }}>
          Stock Market Live Tracker
        </h2>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
        <div style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0f3460',
          borderRadius: '20px',
          border: '1px solid #16213e'
        }}>
          <span style={{color: '#ffffff', fontSize: '0.875rem', fontWeight: '500'}}>
            🟢 Market Open
          </span>
        </div>
        
        <div style={{
          width: '36px',
          height: '36px',
          backgroundColor: '#e94560',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <span style={{color: 'white', fontSize: '1rem', fontWeight: 'bold'}}>U</span>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;