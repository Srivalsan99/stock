
import React, { useEffect, useState } from 'react';

const TabItems = ({ ticker_selected,secColumnvalue,api_value }) => {
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const fetchTabItems = async () => {
      try {
        const response = await fetch(`${api_value}/about/${ticker_selected}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      });
        const data = await response.json();
        console.log('TabItems search result:', data);
        setSearchData(data);
      } catch (error) {
        console.error("Error fetching tab items:", error);
      }
    };

    fetchTabItems();
  }, [ticker_selected,secColumnvalue,api_value]);

  const formatNumber = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString();
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
   <div style={{height:window.innerHeight*secColumnvalue,overflow:'scroll'}}>
      <div style={{width:'90%'}}>
      <h2>{searchData?.longName || ticker_selected}</h2>

      <h4>
        About{' '}
        <span style={{ fontSize: '0.8rem', color: '#007bff', cursor: 'pointer' }}>
          [ edit ]
        </span>
      </h4>
      <p>{searchData?.longBusinessSummary || 'No company description available.'}</p>

      <h4>Key Points</h4>
      <ul>
        <li><strong>Sector:</strong> {searchData?.sector}</li>
        <li><strong>Industry:</strong> {searchData?.industry}</li>
        <li><strong>Employees:</strong> {formatNumber(searchData?.fullTimeEmployees)}</li>
        <li><strong>Country:</strong> {searchData?.country}</li>
        <li>
          <strong>Website:</strong>{' '}
          <a href={searchData?.website} target="_blank" rel="noreferrer">
            {searchData?.website}
          </a>
        </li>
      </ul>

      <h4>Financial Summary</h4>
      <ul>
        <li><strong>Market Cap:</strong> ${formatNumber(searchData?.marketCap)}</li>
        <li><strong>Revenue (TTM):</strong> ${formatNumber(searchData?.totalRevenue)}</li>
        <li><strong>Gross Margin:</strong> {formatPercent(searchData?.grossMargins)}</li>
        <li><strong>EBITDA Margin:</strong> {formatPercent(searchData?.ebitdaMargins)}</li>
        <li><strong>Net Income:</strong> ${formatNumber(searchData?.netIncomeToCommon)}</li>
        <li><strong>Free Cash Flow:</strong> ${formatNumber(searchData?.freeCashflow)}</li>
        <li><strong>Operating Cash Flow:</strong> ${formatNumber(searchData?.operatingCashflow)}</li>
        <li><strong>Profit Margins:</strong> {formatPercent(searchData?.profitMargins)}</li>
        <li><strong>Return on Assets:</strong> {formatPercent(searchData?.returnOnAssets)}</li>
        <li><strong>Return on Equity:</strong> {formatPercent(searchData?.returnOnEquity)}</li>
        <li><strong>Debt to Equity:</strong> {searchData?.debtToEquity}</li>
        <li><strong>Book Value:</strong> ${searchData?.bookValue}</li>
        <li><strong>Price to Book:</strong> {searchData?.priceToBook}</li>
        <li><strong>Enterprise Value:</strong> ${formatNumber(searchData?.enterpriseValue)}</li>
        <li><strong>Enterprise to Revenue:</strong> {searchData?.enterpriseToRevenue}</li>
        <li><strong>Enterprise to EBITDA:</strong> {searchData?.enterpriseToEbitda}</li>
      </ul>

      <h4>Stock Information</h4>
      <ul>
        <li><strong>Ticker:</strong> {searchData?.symbol}</li>
        <li><strong>Exchange:</strong> {searchData?.exchange}</li>
        <li><strong>Quote Type:</strong> {searchData?.quoteType}</li>
        <li><strong>Currency:</strong> {searchData?.currency}</li>
        <li><strong>Current Price:</strong> ${searchData?.currentPrice}</li>
        <li><strong>Previous Close:</strong> ${searchData?.previousClose}</li>
        <li><strong>Open:</strong> ${searchData?.open}</li>
        <li><strong>Day Range:</strong> ${searchData?.dayLow} - ${searchData?.dayHigh}</li>
        <li><strong>52 Week Range:</strong> {searchData?.fiftyTwoWeekRange}</li>
        <li><strong>52 Week Change:</strong> {formatPercent(searchData?.fiftyTwoWeekChangePercent)}</li>
        <li><strong>Volume:</strong> {formatNumber(searchData?.volume)}</li>
        <li><strong>Avg Volume (3M):</strong> {formatNumber(searchData?.averageDailyVolume3Month)}</li>
      </ul>

      <h4>Dividends & Valuation</h4>
      <ul>
        <li><strong>Dividend Rate:</strong> ${searchData?.dividendRate}</li>
        <li><strong>Dividend Yield:</strong> {formatPercent(searchData?.dividendYield)}</li>
        <li><strong>Payout Ratio:</strong> {formatPercent(searchData?.payoutRatio)}</li>
        <li><strong>Trailing PE:</strong> {searchData?.trailingPE}</li>
        <li><strong>Forward PE:</strong> {searchData?.forwardPE}</li>
        <li><strong>Beta:</strong> {searchData?.beta}</li>
        <li><strong>EPS (TTM):</strong> {searchData?.trailingEps}</li>
        <li><strong>EPS Forward:</strong> {searchData?.forwardEps}</li>
        <li><strong>Dividend Date:</strong> {formatDate(searchData?.dividendDate)}</li>
        <li><strong>Ex-Dividend Date:</strong> {formatDate(searchData?.exDividendDate)}</li>
      </ul>

      <h4>Analyst Estimates</h4>
      <ul>
        <li><strong>Recommendation:</strong> {searchData?.recommendationKey}</li>
        <li><strong>Average Rating:</strong> {searchData?.averageAnalystRating}</li>
        <li><strong>Target High Price:</strong> ${searchData?.targetHighPrice}</li>
        <li><strong>Target Mean Price:</strong> ${searchData?.targetMeanPrice}</li>
        <li><strong>Target Low Price:</strong> ${searchData?.targetLowPrice}</li>
        <li><strong>Target Median Price:</strong> ${searchData?.targetMedianPrice}</li>
        <li><strong>Number of Analyst Opinions:</strong> {searchData?.numberOfAnalystOpinions}</li>
      </ul>
    </div>
    </div>
  );
};

export default TabItems;

