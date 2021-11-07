let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("Fetching stats for prof: " + request.tid)
      fetch('https://www.ratemyprofessors.com/ShowRatings.jsp?tid=' + request.tid)
          .then(response => response.text())
          .then(text => sendResponse({returned_text:text}))
          .catch(error => console.log("Error: " + error));
      return true;
  }
);
