import React, { useEffect, useState } from 'react';

const SidePanel = ({ selectedTicker,period,api_value }) => {
  const [performance, setPerformance] = useState(null);
  const [fundamentals, setFundamentals] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!selectedTicker) return;

    const fetchAll = async () => {
      try {
        const [perfRes, fundRes, recRes] = await Promise.all([
          // fetch(`http://localhost:8000/performance/${selectedTicker}/${period}`).then(res => res.json()),
          // fetch(`http://localhost:8000/fundamentals/${selectedTicker}`).then(res => res.json()),
          // fetch(`http://localhost:8000/recommendations/${selectedTicker}`).then(res => res.json())
          fetch(`${api_value}/performance/${selectedTicker}/${period}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      }).then(res => res.json()),
          fetch(`${api_value}/fundamentals/${selectedTicker}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      }).then(res => res.json()),
          fetch(`${api_value}/recommendations/${selectedTicker}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      }).then(res => res.json())
        ]);

        setPerformance(perfRes);
        setFundamentals(fundRes);
        setRecommendations(recRes);
      } catch (err) {
        console.error('Error loading side panel data:', err);
      }
    };

    fetchAll();
  }, [selectedTicker,period, api_value]);

  return (
    <div>

      <div className="mb-3">
        <h6 className="text-success">Recommendations</h6>
{recommendations ? (
  <table className="table table-sm">
    <thead>
      <tr>
        <th>Stock</th>
        <th>Points</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(recommendations).map(([key, val]) => (
        <tr key={key}>
          <td>{key}</td>
          <td className="text-success">{val}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>Loading...</p>
)}
      </div>

      <div className="mb-3">
        <h6 className="text-success">Performance</h6>
        <small>
          <p className="d-flex justify-content-between text-success">
            <b className="text-muted">Performance:</b> {performance?.Performance ?? 'Loading...'}
          </p>
        </small>
      </div>

      <div style={{ height: '1rem' }}></div>

      <div className="mb-3">
        <h6 className="text-success">Key Stats</h6>
        {fundamentals ? (
          <div className="responsive-stats">
            {Object.entries(fundamentals).map(([key, val]) => (
              <div style={{ fontSize: '0.73rem' }} key={key} className="d-flex justify-content-between">
                <span className="text-muted"><b>{key}:</b></span>
                <span className="text-success">{val !== null ? val : 'N/A'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="small">Loading...</p>
        )}
      </div>

    </div>
  );
};

export default SidePanel;
