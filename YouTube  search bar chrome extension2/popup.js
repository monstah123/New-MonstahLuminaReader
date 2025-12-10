document.addEventListener("DOMContentLoaded", function() {
    var searchInput = document.getElementById("search-input");
    var searchButton = document.getElementById("search-button");
  
    searchButton.addEventListener("click", function() {
      var query = searchInput.value;
      if (query.trim() !== "") {
        var url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
        chrome.tabs.create({ url: url });
      }
    });
  });
  