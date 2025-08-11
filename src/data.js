// data.js
export async function fetchStockData(selectedTimeframe,ticker_selected,api_value) {


  if (selectedTimeframe === null || selectedTimeframe === '' || typeof selectedTimeframe === 'undefined') {
    selectedTimeframe= '15m'  
  }

  try {
    // const response = await fetch(`https://5710-34-169-132-156.ngrok-free.app/chart/${ticker_selected}/${selectedTimeframe}`)
    // https://99cc-34-27-55-207.ngrok-free.app/chart/AAPL/15m
    const response = await fetch(`${api_value}/chart/${ticker_selected}/${selectedTimeframe}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const stock = await response.json();


    if (stock.length > 0 && stock[0].hasOwnProperty('Date')) {
      // The first element of the 'stock' array has a 'Date' property
      // Assuming this indicates the data uses 'Date' consistently

      const formattedData = stock.map(d => ({
        date: new Date(d.Date),
        open: d.Open,
        high: d.High,
        low: d.Low,
        close: d.Close,
        volume: d.Volume
      }));
      // console.log('formattedData','      console.log(formattedData)')

      // console.log(formattedData)
      return formattedData;

      // ... further processing with formattedData
    } else if (stock.length > 0 && stock[0].hasOwnProperty('Datetime')) {
      // The first element of the 'stock' array has a 'Datetime' property
      // Assuming this indicates the data uses 'Datetime' consistently
      // console.log('Before 2')
      // console.log(stock.map(d => ({'Date':d.Datetime  })))
      const formattedData = stock.map(d => ({
        date: new Date(d.Datetime),
        open: d.Open,
        high: d.High,
        low: d.Low,
        close: d.Close,
        volume: d.Volume
      }));
      return formattedData;

    }

  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
}
