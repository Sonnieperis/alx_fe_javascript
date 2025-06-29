document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
  
    // Initial quotes array
    const quotes = [
      { text: "Stay hungry, stay foolish.", category: "Motivation" },
      { text: "Talk is cheap. Show me the code.", category: "Programming" },
      { text: "Design is intelligence made visible.", category: "Design" }
    ];
  
    // Function: Show Random Quote
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    }
  
    // Function: Add New Quote
    function addQuote() {
      const quoteText = document.getElementById('newQuoteText').value.trim();
      const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
      if (quoteText === "" || quoteCategory === "") {
        alert("Please fill in both fields.");
        return;
      }
  
      quotes.push({ text: quoteText, category: quoteCategory });
      document.getElementById('newQuoteText').value = "";
      document.getElementById('newQuoteCategory').value = "";
      alert("Quote added successfully!");
    }
  
    // Event Listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
  });
  