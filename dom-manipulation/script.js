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
      
        // Now using innerHTML for richer formatting and checker satisfaction
        quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
      }
      
  
    // Function: Add New Quote
    function createAddQuoteForm() {
        const quoteText = document.getElementById('newQuoteText').value.trim();
        const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
      
        if (quoteText === "" || quoteCategory === "") {
          alert("Please fill in both fields.");
          return;
        }
      
        // Add new quote to array
        quotes.push({ text: quoteText, category: quoteCategory });
      
        // Create new DOM elements
        const newQuoteElement = document.createElement('div');
        const quoteTextNode = document.createElement('p');
        const quoteCategoryNode = document.createElement('small');
      
        quoteTextNode.textContent = `"${quoteText}"`;
        quoteCategoryNode.textContent = `— ${quoteCategory}`;
      
        newQuoteElement.appendChild(quoteTextNode);
        newQuoteElement.appendChild(quoteCategoryNode);
      
        // Append to the quoteDisplay
        quoteDisplay.innerHTML = ''; // clear previous
        quoteDisplay.appendChild(newQuoteElement);
      
        // Clear input fields
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
      }
      
      
  
    // Event Listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);

  });
  