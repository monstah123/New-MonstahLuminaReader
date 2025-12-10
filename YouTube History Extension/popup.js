// Retrieve video links from storage and display them
chrome.storage.local.get("videoLinks", function(result) {
  var videoLinks = result.videoLinks || [];

  var videoLinksContainer = document.getElementById("videoLinks");
  videoLinksContainer.innerHTML = ""; // Clear the container before adding new videos

  if (videoLinks.length === 0) {
    var noVideosMessage = document.createElement("p");
    noVideosMessage.textContent = "No recent videos found.";
    videoLinksContainer.appendChild(noVideosMessage);
  } else {
    // Get unique video links by removing duplicates
    var uniqueVideoLinks = Array.from(new Set(videoLinks));

    uniqueVideoLinks.forEach(function(link) {
      var videoId = extractVideoId(link);
      var thumbnailUrl = "https://img.youtube.com/vi/" + videoId + "/default.jpg";

      var videoLinkDiv = document.createElement("div");
      videoLinkDiv.className = "video-link";

      var thumbnailImg = document.createElement("img");
      thumbnailImg.src = thumbnailUrl;

      var linkAnchor = document.createElement("a");
      linkAnchor.href = link;

      linkAnchor.appendChild(thumbnailImg);
      videoLinkDiv.appendChild(linkAnchor);

      videoLinksContainer.appendChild(videoLinkDiv);
    });
  }
});

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  var match = url.match(/[?&]v=([^&#]+)/);
  return match ? match[1] : null;
}

