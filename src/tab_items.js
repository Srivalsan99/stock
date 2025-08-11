
import React, { useEffect, useState } from 'react';

const IncomeStatement = ({ ticker_selected,secColumnvalue,activeTab,api_value }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log('tab items part')
  useEffect(() => {
    console.log(`${api_value}/${activeTab}/${ticker_selected}`)
    const fetchIncomeStatement = async () => {
      try {
        const response = await fetch(`${api_value}/${activeTab}/${ticker_selected}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      });
        const data = await response.json();
          // console.log('response Tab Items')
          // console.log(data)
        setIncomeData(data);
      } catch (error) {
        console.error("Error fetching income statement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeStatement();
  }, [ticker_selected,secColumnvalue,activeTab,api_value]);

  // console.log('incomeData')
  // console.log(incomeData)

  if (loading) return <p>Loading income statement...</p>;
  if (incomeData.length === 0) return <p>No income data available.</p>;

  const headers = Object.keys(incomeData[0]);

  return (
   <div style={{height:window.innerHeight*secColumnvalue,overflow:'scroll'}}>
      <div style={{width:'90%'}}>
      <h3>Income Statement for {ticker_selected}</h3>
      <table className="table table-sm table-hover">
        <thead className="table-success">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {incomeData.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header, colIdx) => (
                <td key={colIdx}>
                  {row[header] !== null ? row[header] : '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default IncomeStatement;