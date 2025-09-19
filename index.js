import { fetchSearchResults, fetchStockData, getChange, getPrice, getTopFive } from './api.js';


document.addEventListener("DOMContentLoaded", () => {


    // capure search button as const
    const searchBtn = document.getElementById("search-btn");
    // capture body of modal as const
    const modalBody = document.getElementById("search-result-body");


    searchBtn.addEventListener("click", async () => {
        // data needs to be read from text input after button is clicked - data is empty on page load
        const queryInput = document.getElementById("search-query");
        // trim the value to prevent any uneeded issue
        const query = queryInput.value.trim();
        // calls function to get list of results and awaits response. Modal will open once data arrives
        const results = await fetchSearchResults(query);

        const html = `
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${results.map(result => `
                        <li id="${result.symbol}" style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd;">
                            <div>
                                <strong>${result.symbol}</strong> - ${result.name}<br>
                                Type: ${result.type}, Region: ${result.region}, Currency: ${result.currency}
                            </div>
                            <button class="select" data-symbol="${result.symbol}" style="padding: 4px 8px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">
                                Select
                            </button>
                        </li>
                    `).join('')}
                </ul>
            `;

        //updates modal's children via const rather than explicit html references                
        modalBody.innerHTML = html;

        const selectBtns = document.getElementsByClassName("select");
            for (let button of selectBtns) {
                button.addEventListener("click", async e => {
                
                const symbol = e.target.dataset.symbol;
                console.log("Clicked button for:", symbol);
                const stock = await fetchStockData(symbol);

                //create stock section
                const html = `
                    <section id="stock-info">
                        <div class="header">
                            <h2>${stock.symbol}</h2>
                            <button type="button" class="btn btn-primary" id="watch">Watch</button>
                        </div>
                        <div class="stock-container">
                            <div class="container">
                                <div id="">
                                    <p>Open:</p>
                                    <h3>${stock.open}</h3>
                                </div>
                                <div id="">
                                    <p>High:</p>
                                    <h3>${stock.high}</h3>
                                </div>
                                <div id="">
                                    <p>Low:</p>
                                    <h3>${stock.low}</h3>
                                </div>
                                <div id="">
                                    <p>Previous Close:</p>
                                    <h3>${stock.close}</h3>
                                </div>
                            </div>
                            <div class="container">
                                <div id="">
                                    <p>Volume:</p>
                                    <h3>${stock.volume} units</h3>
                                </div>
                                <div id="">
                                    <p>Price:</p>
                                    <h3>${stock.price}</h3>
                                </div>
                                <div id="">
                                    <p>Change:</p>
                                    <h3>${stock.change}</h3>
                                </div>
                                <div id="">
                                    <p>% Change:</p>
                                    <h3>${stock.changePercent}</h3>
                                </div>
                            </div>
                        </div>
                    </section>
                    `;

            const searchSection = document.getElementById("search");
            const stockinfoSection = document.getElementById("stock-info");

            // ensure that only one stock info section is present at a time        
            if (stockinfoSection) {
                console.log("info section replaced with:", html)
                stockinfoSection.outerHTML = html;
            } else {
                 searchSection.insertAdjacentHTML("afterend", html);
            }
        });
    }                     
});

// event delegation to capture created watch button
document.body.addEventListener('click', async (event) => {
    if (event.target && event.target.id === "watch") {
        const symbol = document.querySelector("#stock-info h2").textContent;
        console.log("Watch button clicked for:", symbol);

        const stockQuote = await fetchStockData(symbol)
        const stockInfo = await fetchSearchResults(symbol);
        const bestMatch = stockInfo[0];
        console.log("Best match from search results:", bestMatch);

        const watchlist = document.getElementById("watchlist");
        const stockContainer = watchlist.querySelector('.container');
        const stockList = watchlist.querySelector('ul');
        const stocks = stockList ? stockList.querySelectorAll('.stock') : [];

        
        if (stockList) {
            console.log("Stocklist already exists. Adding new stock if not duplicate:", bestMatch.symbol);

            // Check for duplicates
            for (let stock of stocks) { 
            const stockSymbol = stock.id;
            if (stockSymbol === bestMatch.symbol) {
                console.log("Stock already in watchlist:", stockSymbol);
                return; // Exit the function if duplicate is found
            }
        }
            // If no duplicates, add the new stock
            const html = `
                <li class="stock" id="${bestMatch.symbol}">
                    <div>
                        <strong>${bestMatch.symbol}</strong> <br>
                        ${bestMatch.name}<br>
                        Type: ${bestMatch.type}, Region: ${bestMatch.region}, Currency: ${bestMatch.currency}
                    </div>
                    <div>
                        <p class="price" id="${bestMatch.symbol}-price">Price: $${stockQuote.price}</p>
                        <p class="change" id="${bestMatch.symbol}-change">Change: $${stockQuote.change}</p>                            <p class="percent-change" id="${bestMatch.symbol}-change-percent">Change Percentage: ${stockQuote.changePercent}%</p>
                    </div>
                    <button class="remove" data-symbol="${bestMatch.symbol}" style="padding: 4px 8px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">
                        remove
                    </button>
                </li>
            `;
            stockList.insertAdjacentHTML("beforeend", html);
        } 
        else {
            console.log("Creating new stocklist with:", bestMatch.symbol);
            
            // Create the stocklist and add the first stock
            const html = `
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li class="stock" id="${bestMatch.symbol}">
                        <div>
                            <strong>${bestMatch.symbol}</strong> <br>
                            ${bestMatch.name}<br>
                            Type: ${bestMatch.type}, Region: ${bestMatch.region}, Currency: ${bestMatch.currency}
                        </div>
                        <div>
                            <p class="price" id="${bestMatch.symbol}-price">Price: $${stockQuote.price}</p>
                            <p class="change" id="${bestMatch.symbol}-change">Change: $${stockQuote.change}</p>
                            <p class="percent-change" id="${bestMatch.symbol}-change-percent">Change Percentage: ${stockQuote.changePercent}%</p>
                        </div>
                        <button class="remove" data-symbol="${bestMatch.symbol}" style="padding: 4px 8px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">
                            remove
                        </button>
                    </li>
                </ul>
            `;
            stockContainer.innerHTML = ""; // clears existing content to avoid duplicates
            stockContainer.insertAdjacentHTML("beforeend", html);
            console.log("Added to watchlist:", html);
        }
    }
});  
    
const refreshBtn = document.getElementById("refresh-price");
refreshBtn.addEventListener("click", async () => {
        
    // creates a nodelist of elements with the class stock
    const nodes = document.querySelectorAll(".stock"); 
    // makes an array from nodelist of stocks and then picks out those with class of symbol
    const symbols = Array.from(nodes).map(node => node.querySelector(".symbol").textContent);

    // forEach on array of symbols
    symbols.forEach(async symbol => {
        const price = await getPrice(symbol);

        // select the correct element to update for each iteration of the loop    
        const priceText = document.getElementById(`${symbol}-current-price`)
        const html = `
            <p class="current-price" id="${symbol}-current-price"${price}></p>
        `;
        // replaces the element unlike innerHTML which updates child elements 
        priceText.outerHTML = html;
        });
    });
});
