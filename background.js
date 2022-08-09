let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

var data = "monkey"
// let request = fetch
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("Fetching stats for prof: " + request.url)
      fetch(request.url)
          .then(response => response.text())
          .then (text => 
            {console.log("text:" + text)
            console.log("data1:")
            console.log(data)
            data = text
            console.log("data2: " + data)
            sendResponse({res:data})}
            )
          .catch(error => console.log("Error: " + error))
    console.log("\n\n\n\n\n\ndataaaaaaaa:" + data)
    
    return true;
  }
)


