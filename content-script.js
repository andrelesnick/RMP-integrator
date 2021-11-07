


chrome.runtime.sendMessage({tid: "" + 2272729}, async function(response) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(response.returned_text, "text/html")
    console.log(doc)
});