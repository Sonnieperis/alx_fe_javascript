
document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteButton');
    const exportButton = document.getElementById('exportQuotes');
    const importInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const notification = document.getElementById('notification');
  
    let quotes = [];
  
    // ==== Load and Save ====
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
  
    // ==== UI ====
    function showRandomQuote() {
      if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
      }
  
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
  
      quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
      sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    }
  
    function createAddQuoteForm() {
      const quoteText = document.getElementById('newQuoteText').value.trim();
      const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
      if (!quoteText || !quoteCategory) {
        alert("Please fill in both fields.");
        return;
      }
  
      const newQuote = { text: quoteText, category: quoteCategory };
      quotes.push(newQuote);
      saveQuotes();
  
      quoteDisplay.innerHTML = "";
      const div = document.createElement('div');
      const p = document.createElement('p');
      const small = document.createElement('small');
      p.textContent = `"${newQuote.text}"`;
      small.textContent = `— ${newQuote.category}`;
      div.appendChild(p);
      div.appendChild(small);
      quoteDisplay.appendChild(div);
  
      document.getElementById('newQuoteText').value = "";
      document.getElementById('newQuoteCategory').value = "";
  
      populateCategories();
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
  
      const savedCategory = localStorage.getItem('selectedCategory');
      if (savedCategory && categoryFilter.querySelector(`option[value="${savedCategory}"]`)) {
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
        const div = document.createElement('div');
        const p = document.createElement('p');
        const small = document.createElement('small');
        p.textContent = `"${quote.text}"`;
        small.textContent = `— ${quote.category}`;
        div.appendChild(p);
        div.appendChild(small);
        quoteDisplay.appendChild(div);
      });
    }
  
    // ==== Export / Import ====
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
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            quotes.push(...imported);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
          } else {
            alert('Invalid file.');
          }
        } catch {
          alert('Error reading file.');
        }
      };
      reader.readAsText(event.target.files[0]);
    }
  
    // ==== Server Sync Simulation ====
    async function fetchFromServer() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const data = await response.json();
  
        let newQuotes = data.map(post => ({
          text: post.title,
          category: "Server"
        }));
  
        let added = 0;
        newQuotes.forEach(q => {
          if (!quotes.find(existing => existing.text === q.text)) {
            quotes.push(q);
            added++;
          }
        });
  
        if (added > 0) {
          saveQuotes();
          populateCategories();
          showNotification(`${added} new quote(s) synced from server.`);
        }
      } catch (err) {
        showNotification("Server sync failed.");
      }
    }
  
    function showNotification(message) {
      notification.textContent = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, 4000);
    }
  
    // ==== Init ====
    loadQuotes();
    populateCategories();
  
    const last = sessionStorage.getItem('lastQuote');
    if (last) {
      const quote = JSON.parse(last);
      quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
    }
  
    // Sync every 30 seconds
    fetchFromServer();
    setInterval(fetchFromServer, 30000);
  
    // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', createAddQuoteForm);
    exportButton.addEventListener('click', exportQuotes);
    importInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
  });
  