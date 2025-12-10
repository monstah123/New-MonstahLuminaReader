chrome.runtime.onInstalled.addListener(function() {
    // Fetch the YouTube video history
    chrome.history.search({ text: "youtube.com/watch", maxResults: 10 }, function(data) {
      var videoLinks = data.map(function(item) {
        return item.url;
      });
  
      // Store the video links in Chrome storage
      chrome.storage.local.set({ videoLinks: videoLinks }, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  });
  