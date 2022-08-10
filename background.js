var data = "default"
// let request = fetch
chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    var raw_htmls = []
    let profs = request.names
    // console.log("in bg. will fetch: " + profs)
    for (let i = 0; i < profs.length; i++) {
      let url = "https://www.ratemyprofessors.com/search/teachers?query=" + encodeURI(profs[i]) + "&sid=U2Nob29sLTEyNA=="
    
      console.log("Fetching stats for prof: " + url)
      await fetch(url)
          .then(response => response.text())
          .then (text => 
            {
            data = text
            raw_htmls.push({name: profs[i], raw: data})
            // console.log("raws: " + raw_htmls)
          })
          .catch(error => console.log("Error: " + error))
        }
      
    // sendResponse(global_ratings)
        // console.log("raws AFTER: " + raw_htmls.length)
    chrome.tabs.sendMessage(sender.tab.id, {raws:raw_htmls, id: sender.tab.id}, response => {
      console.log("response")
  })
  return true
  }
)


