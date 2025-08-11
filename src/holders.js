import React, { useEffect, useState } from 'react';

const TabItems = ({ ticker_selected,secColumnvalue,api_value }) => {
  const [holdersData, setHoldersData] = useState({
    majorHolders: [],
    institutionalHolders: [],
    mutualFundHolders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolders = async () => {
      try {
        const response = await fetch(`${api_value}/holders/${ticker_selected}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      });
        const data = await response.json();
        setHoldersData(data);
      } catch (error) {
        console.error('Error fetching holders data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
  }, [ticker_selected,secColumnvalue,api_value]);
    // console.log('holdersData.majorHolders')

  console.log(holdersData.majorHolders.Value)
  if (loading) return <p>Loading holders data...</p>;

  return (
   <div style={{height:window.innerHeight*secColumnvalue,overflow:'scroll'}}>
      <div style={{width:'90%'}}>
        <p></p>
        <p></p>
        <p></p>
                <p></p>
        <p></p>
        <p></p>
      <h3>Major Holders</h3>
      <table className="table table-sm  table-hover">
        <tbody>
          {Object.entries(holdersData.majorHolders.Value).map(([label, value], idx) => (
            <tr key={idx}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <p></p>
        <p></p>
      <h3>Institutional Holders</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-sm  table-hover">
          <thead className="table-success">
            <tr>
              {holdersData.institutionalHolders.length > 0 &&
                Object.keys(holdersData.institutionalHolders[0]).map((key, idx) => (
                  <th key={idx}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {holdersData.institutionalHolders.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <p></p>
        <p></p>
      <h3>Mutual Fund Holders</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-sm table-hover">
          <thead className="table-success">
            <tr>
              {holdersData.mutualFundHolders.length > 0 &&
                Object.keys(holdersData.mutualFundHolders[0]).map((key, idx) => (
                  <th key={idx}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {holdersData.mutualFundHolders.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};
export default TabItems;

