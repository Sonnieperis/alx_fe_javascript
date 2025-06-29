document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
    const exportButton = document.getElementById('exportQuotes');
    const importInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
  
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
        saveQuotes();
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
  
      // Save last viewed to session
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
  
      quoteDisplay.innerHTML = "";
      quoteDisplay.appendChild(quoteContainer);
  
      document.getElementById('newQuoteText').value = "";
      document.getElementById('newQuoteCategory').value = "";
  
      populateCategories(); // update filter if new category
      alert("Quote added successfully!");
    }
  
    function populateCategories() {
      const categories = new Set(quotes.map(q => q.category));
  
      categoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });
  
      // Restore selected filter from localStorage
      const savedCategory = localStorage.getItem('selectedCategory');
      if (savedCategory && [...categories].includes(savedCategory)) {
        categoryFilter.value = savedCategory;
        filterQuotes();
      }
    }
  
    function filterQuotes() {
      const selected = categoryFilter.value;
      localStorage.setItem('selectedCategory', selected);
  
      const filtered = selected === 'all'
        ? quotes
        : quotes.filter(q => q.category === selected);
  
      quoteDisplay.innerHTML = "";
  
      if (filtered.length === 0) {
        quoteDisplay.textContent = "No quotes in this category.";
        return;
      }
  
      filtered.forEach(quote => {
        const container = document.createElement('div');
        const quoteText = document.createElement('p');
        const quoteCat = document.createElement('small');
  
        quoteText.textContent = `"${quote.text}"`;
        quoteCat.textContent = `— ${quote.category}`;
  
        container.appendChild(quoteText);
        container.appendChild(quoteCat);
  
        quoteDisplay.appendChild(container);
      });
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
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            quotes.push(...imported);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
          } else {
            alert('Invalid file format.');
          }
        } catch (err) {
          alert('Error reading file.');
        }
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    // INIT
    loadQuotes();
    populateCategories();
  
    // Restore last viewed quote
    const last = sessionStorage.getItem('lastQuote');
    if (last) {
      const quote = JSON.parse(last);
      quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
    }
  
    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportQuotes);
    importInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
  });
  