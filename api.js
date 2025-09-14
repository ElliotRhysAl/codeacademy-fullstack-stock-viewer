const API_KEY = "YR44JDSUL3UH2TWP";


export async function fetchStockData(symbol) {

  // looks up stock based on stock symbol
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    

    if (!response.ok) {
      // Custom error messaging
      const errorMessage = handleClientErrors(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // set top level key to const so that inner object can be accessed easier.
    const stock = data["Global Quote"];

    // update key value pairs into something more readable
    const stockData = {
    symbol: stock["01. symbol"],
    open: stock["02. open"],
    high: stock["03. high"],
    low: stock["04. low"],
    price: stock["05. price"],
    previousClose: stock["08. previous close"],
    change: stock["09. change"],
    changePercent: stock["10. change percent"]
  };

    console.log("JavaScript Object:", stockData);
    return stockData; // updated object returned for usage

  } catch (error) {
    // Handles Error
    console.error(error);
    document.getElementById("user-error").innerHTML = `
      <div class="error-message">
        <h3>Oops! ${error.message}</h3>
      </div>`;
  }
}

export async function getChange(symbol) {
  // references previous function to return solely change - will be used for top stock - kind of pointless but did it so I understand minimising repeated code
  stock = await fetchStockData(symbol)
  return stock.changepercent;
}

export async function fetchSearchResults(query) {

  // retrieves a list of stocks based on symbol and/or name
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  // alphavantage has it's own query engine that does best matches for you which can be stored in a JS array
  if (!data.bestMatches) return [];

    // data.bestMatches is a seriew of Key Values pairs
    // maps the information  into an array of KV pairs with cleaner names - newKey: Value[oldKey]
    const results = data.bestMatches.map(stock => ({
      symbol: stock["1. symbol"],
      name: stock["2. name"],
      type: stock["3. type"],
      region: stock["4. region"],
      currency: stock["8. currency"]
    }));
    console.log(results)
    return results;
}

export async function fetchTopFive () {

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;

  try {
      const response = await fetch(url);

      if (!response.ok) {
        // Custom error messaging
        const errorMessage = response.statusText;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("JavaScript Object:", data);
      return data; // Return data for use outside of function

    } catch (error) {
      // Handles Error
      console.error(error);
      document.getElementByClass("quick-search").innerHTML = `
        <div class="error-message">
          <h3>Oops! ${error.message}</h3>
        </div>`;
    }
  }


  

function handleClientErrors(response) {
  switch (response.status) {
    case 400: 
      return "Bad Request - Check your data format";
    case 401: 
      return "Unauthorized - You need to log in first";
    case 403: 
      return "Forbidden - You don't have permission for this";
    case 404: 
      return "Not Found - This item doesn't exist";
    case 422: 
      return "Invalid Data - Check your input fields";
    default: 
      return `Client Error ${response.status} - Check your request`;
  }
}