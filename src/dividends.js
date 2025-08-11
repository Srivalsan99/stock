import React, { useState, useEffect } from 'react';

const DividendHistory = ({ ticker_selected,secColumnvalue,api_value  }) => {
  const [dividends, setDividends] = useState([]);

  useEffect(() => {
    const fetchDividends = async () => {
      try {
        const response = await fetch(`${api_value}/dividend/${ticker_selected }`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      });
        const data = await response.json();
        setDividends(data);
      } catch (err) {
        console.error('Error fetching dividend history:', err);
      }
    };

    fetchDividends();
  }, [ticker_selected ,secColumnvalue,api_value])

    return (
   <div style={{height:window.innerHeight*secColumnvalue,overflow:'scroll'}}>
      <div style={{width:'90%'}}>
      <h4>Dividend History</h4>
      {dividends.length === 0 ? (
        <p>No dividend data available.</p>
      ) : (
        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Dividend</th>
            </tr>
          </thead>
          <tbody>
            {dividends.map((item, idx) => (
              <tr key={idx}>
                <td>{item.Date}</td>
                <td>${item.Dividends.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default DividendHistory;
