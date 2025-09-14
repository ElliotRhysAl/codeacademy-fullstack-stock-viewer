import { fetchStockData, getChange, fetchTopFive, fetchSearchResults } from './api.js';


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
                    <li style="padding: 10px; border-bottom: 1px solid #ddd;">
                    <strong>${result.symbol}</strong> - ${result.name}<br>
                    Type: ${result.type}, Region: ${result.region}, Currency: ${result.currency}
                    </li>
                `).join('')}
            </ul>
        `;

    //updates modal via const rather than explicit html references                
    modalBody.innerHTML = html;
    
    });
});
