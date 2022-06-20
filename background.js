let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let ratings = new Map()
    for (let i = 0; i < names.length; i++) {
      console.log("Fetching stats for prof: " + encodeURI(request.names[i]))
      fetch("https://www.ratemyprofessors.com/search/teachers?query=" + encodeURI(request.names[i]) + "&sid=U2Nob29sLTEyNA==")
          .then(response => response.text())
          .then(text => ratings.set(request.names[i], text))
          .catch(error => console.log("Error: " + error));

    }

    sendResponse({returned_text:text})
    return true;
  }
);
