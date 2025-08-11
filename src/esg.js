import React, { useEffect, useState } from 'react';

const EsgScores = ({ ticker_selected,secColumnvalue,api_value }) => {
  const [esg, setEsg] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEsg = async () => {
      try {
        const response = await fetch(`${api_value}/esg/${ticker_selected}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      });
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setEsg(data);
        }
      } catch (err) {
        setError('Failed to fetch ESG data');
      }
    };

    fetchEsg();
  }, [ticker_selected,secColumnvalue,api_value]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!esg) return <p>Loading ESG scores...</p>;

  return (
   <div style={{height:window.innerHeight*secColumnvalue,overflow:'scroll'}}>
      <div style={{width:'90%'}}>
      <h4>ESG Scores for {ticker_selected}</h4>
<ul className="list-group">
  {Object.entries(esg).map(([key, value]) => (
    <li className="list-group-item d-flex flex-column" key={key}>
      <strong style={{ textTransform: 'capitalize' }}>
        {key.replace(/([A-Z])/g, ' $1')}
      </strong>

      {typeof value === 'object' && value !== null ? (
        <ul className="list-unstyled ps-3">
          {Object.entries(value).map(([subKey, subVal]) => (
            <li key={subKey}>
              {subKey}: {typeof subVal === 'number' ? subVal.toFixed(2) : subVal}
            </li>
          ))}
        </ul>
      ) : (
        <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
      )}
    </li>
  ))}
</ul>
    </div>
    </div>
  );
};

export default EsgScores;
