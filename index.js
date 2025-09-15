import { fetchSearchResults, fetchStockData, getChange, getPrice, getTopFive } from './api.js';


document.addEventListener("DOMContentLoaded", () => {


    // capure search button as const
    const searchBtn = document.getElementById("openSearchModal");
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

                if (stockinfoSection) {
                    console.log("info section replaced with:", html)
                    stockinfoSection.outerHTML(html)
                } else {
                    searchSection.insertAdjacentHTML("afterend", html);
                }
        });
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
