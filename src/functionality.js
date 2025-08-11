export async function fetchStockData(symbol,api_value) {
  try {
    const response = await fetch(`${api_value}/search/${symbol}`,
            {
        headers: {
          'ngrok-skip-browser-warning': 'true',  // This bypasses ngrok's warning page
          'Content-Type': 'application/json',
        }
      });
    const search = await response.json();
    return search;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }

}