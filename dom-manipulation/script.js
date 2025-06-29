document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
    const exportButton = document.getElementById('exportQuotes');
    const importInput = document.getElementById('importFile');
  
    let quotes = [];
  
    // Load from localStorage
    function loadQuotes() {
      const saved = localStorage.getItem('quotes');
      if (saved) {
        quotes = JSON.parse(saved);
      } else {
        quotes = [
          { text: "Stay hungry, stay foolish.", category: "Motivation" },
          { text: "Talk is cheap. Show me the code.", category: "Programming" },
          { text: "Design is intelligence made visible.", category: "Design" }
        ];
        saveQuotes(); // Save initial quotes
      }
    }
  
    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    }
  
    function showRandomQuote() {
      if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
      }
  
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
  
      quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
  
      // Save to session storage
      sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    }
  
    function createAddQuoteForm() {
      const quoteText = document.getElementById('newQuoteText').value.trim();
      const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
      if (quoteText === "" || quoteCategory === "") {
        alert("Please fill in both fields.");
        return;
      }
  
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
      saveQuotes();
  
      // DOM update using createElement + appendChild
      const quoteContainer = document.createElement('div');
      const quoteTextNode = document.createElement('p');
      const quoteCategoryNode = document.createElement('small');
  
      quoteTextNode.textContent = `"${newQuote.text}"`;
      quoteCategoryNode.textContent = `— ${newQuote.category}`;
  
      quoteContainer.appendChild(quoteTextNode);
      quoteContainer.appendChild(quoteCategoryNode);
  
      quoteDisplay.innerHTML = ""; // Clear previous
      quoteDisplay.appendChild(quoteContainer);
  
      document.getElementById('newQuoteText').value = "";
      document.getElementById('newQuoteCategory').value = "";
  
      alert("Quote added successfully!");
    }
  
    function exportQuotes() {
      const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotes.json';
      a.click();
  
      URL.revokeObjectURL(url);
    }
  
    function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
        try {
          const importedQuotes = JSON.parse(event.target.result);
          if (Array.isArray(importedQuotes)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
          } else {
            alert('Invalid file format.');
          }
        } catch (error) {
          alert('Error reading file.');
        }
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    // Load initial quotes from local storage
    loadQuotes();
  
    // Show last quote from sessionStorage if available
    const last = sessionStorage.getItem('lastQuote');
    if (last) {
      const quote = JSON.parse(last);
      quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
    }
  
    // Event Listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportQuotes);
    importInput.addEventListener('change', importFromJsonFile);
  });
  