// elements mapped to their class names
var element_mappings = {
    overallRating: 'RatingValue__Numerator-qw8sqy-2 liyUjw'
}

console.log("content-script.js running")

chrome.runtime.sendMessage({tid: "" + 2272729}, async function(response) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(response.returned_text, "text/html")
    console.log("parsing RMP doc");
    let overallRating = scrapeOverallRating(doc)[0].textContent;
    console.log("Overall rating: " + overallRating);
});

function scrapeOverallRating(doc){
    console.log("mapping:",element_mappings.overallRating);
    return doc.getElementsByClassName(element_mappings.overallRating);
}