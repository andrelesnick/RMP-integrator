/* 6/20/22:
    current situation: Need to figure out how to 1) grab names from course search, 2) display ratings. 
    Looks like best way might be to make a popup so that it gets the DOM from the current active tab, then reads the prof names
    from the table, then either displays the info in the popup or appends it to the table somehow.

    to do this I'd need to change the script so that it doesn't immediately search for a name as soon as you load course search,
    instead it'd just rely on the current tab and popup
*/
// elements mapped to their class names
var element_mappings = {
    numProfessors: 'SearchResultsPage__SearchResultsPageHeader-sc-1srop1v-3 flHcYr',
    overallRating: ['#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a > div > div.TeacherCard__NumRatingWrapper-syjs0d-2.joEEbw > div > div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.gcFhmN', '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a > div > div.TeacherCard__NumRatingWrapper-syjs0d-2.joEEbw > div > div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.bUneqk', '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a > div > div.TeacherCard__NumRatingWrapper-syjs0d-2.joEEbw > div > div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.icXUyq'],
    dept: 'CardSchool__Department-sc-19lmz2k-0 haUIRO',
    takeAgain: '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a:nth-child(1) > div > div.TeacherCard__CardInfo-syjs0d-1.fkdYMc > div.CardFeedback__StyledCardFeedback-lq6nix-0.frciyA > div:nth-child(1) > div',
    numRatings: 'CardNumRating__CardNumRatingCount-sc-17t4b9u-3 jMRwbg',
    difficulty: 'CardFeedback__CardFeedbackNumber-lq6nix-2 hroXqf',
    noProfFound: "NoResultsFoundArea__NoResultsFoundHeader-mju9e6-1 dVgkql",
    relayStore: 'body > script:nth-child(5)'
}

console.log("content-script.js running")

// chrome.runtime.sendMessage({tid: "" + 2272729}, async function(response) {
//     var parser = new DOMParser();
//     var doc = parser.parseFromString(response.returned_text, "text/html")
//     console.log("parsing RMP doc");
//     let overallRating = scrapeOverallRating(doc)[0].textContent;
//     console.log("Overall rating: " + overallRating);
// });

// fetch("https://www.ratemyprofessors.com/search/teachers?query=" + encodeURI(request.names[i]) + "&sid=U2Nob29sLTEyNA==")
//           .then(response => response.text())
//           .then(text => ratings.set(request.names[i], text))
//           .catch(error => console.log("Error: " + error));

let ratings = new Map()

function getProfessors() {
    console.log("fetching professors")
    let table_cells = document.querySelectorAll("#body-tag > main > div > div > div > table > tbody > tr > td")
    let professors = []
    for (let i = 2; i < table_cells.length; i+=8) {
        let name = table_cells.item(i).innerText
        if (!professors.includes(name)) {
            professors.push(name)
        }
    }
    return professors
}
function addRating(prof, text) {
    console.log("text = " + text)
    console.log("addrating text: " + text.res)
    var parser = new DOMParser()
    var doc = parser.parseFromString(text.res, "text/html")
    rating = checkRatings(doc)
    console.log("parsed RMP doc")
    console.log("> " + doc)
    console.log("adding rating: " + prof + ":" + rating)
    ratings.set(prof, rating)
}
fetchRatings()
function fetchRatings() {
    let profs = getProfessors()
    for (let i = 0; i < profs.length; i++) {
        let prof_url = "https://www.ratemyprofessors.com/search/teachers?query=" + encodeURI(profs[i]) + "&sid=U2Nob29sLTEyNA=="
        console.log("fetching: " + prof_url)
        let resp = chrome.runtime.sendMessage({url:prof_url}, response => addRating(profs[i], response))
        // console.log("resolved: " + resp.then(data => data).catch(error => console.log("Error: " + error)))
        for (let j = 0, keys = Object.keys(ratings), ii = keys.length; j < ii; j++) {
            console.log(keys[j] + '|' + ratings[keys[j]].list);
          }
        
    }
}
    //     var parser = new DOMParser()
    // var doc = parser.parseFromString(response.returned_text, "text/html")
    // console.log("parsing RMP doc")
    // let ratings = checkRatings(doc)
    // console.log(ratings)

// function scrapeOverallRating(doc){
//     console.log("mapping:",element_mappings.overallRating);
//     return doc.getElementsByClassName(element_mappings.overallRating);
// } 

// old checkRatings
// function checkRatings(doc) {
//     console.log(doc)
//     // check if professor exists
//     // does not exist OR more than one professor with that exact name
//     if (doc.getElementsByClassName(element_mappings.noProfFound)[0] != undefined || !doc.getElementsByClassName(element_mappings.numProfessors)[0].innerText.startsWith('1 professor')) {
//         return "prof does not exist"
//     }
//     // professor exists, so now we get all their ratings
//     console.log("prof exists...")
//     ratings = {}
//     ratings.overall = findRating(element_mappings.overallRating, doc)
//     ratings.takeAgain = findRating(element_mappings.takeAgain, doc)
//     ratings.numRatings = findRating(element_mappings.numRatings, doc)
//     ratings.difficulty = findRating(element_mappings.difficulty, doc)

//     return ratings
// }
// checks rating for individual prof, given RMP dom
function checkRatings(doc) {
    console.log(doc)
    let data = doc.querySelector(element_mappings.relayStore).innerText
    console.log("data: " + data)
    // check if professor exists
    // does not exist OR more than one professor with that exact name
    let start = data.indexOf("avgRating")
    if (start === -1) {return "No professor"}
    // professor exists, so now we get all their ratings
    console.log("prof exists...")
    ratings = {}
    ratings.overall = parseFloat(data.match('(?<=avgRating":).*?(?=,)'))
    ratings.numRatings = parseFloat(data.match('(?<=numRatings":).*?(?=,)'))
    ratings.takeAgain = parseFloat(data.match('(?<=wouldTakeAgainPercent":).*?(?=,)'))
    ratings.difficulty = parseFloat(data.match('(?<=avgDifficulty":).*?(?=,)'))

    return ratings
}


// below functions used in the BU course search page

function xpathRating(doc) {
    let data = doc.evaluate("/html/body/script[2]/text()", doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    console.log(data)
}

function findRating(category, doc) {
    let len = category.length
    console.log("category: ",category," | len: ", len)
    for (let i = 0; i < len; i++) {
        let elem = doc.querySelector(category[i])
        if (elem != null) {
            console.log("rating found, i=", i)
            return elem.innerText
        }
    }
    console.log("rating ", category, " not found")
    return null

}

// function readProfessors(table) {
//     let professors = []
//     var len = table.rows.length
//     for (let i=1; i < len; i++) {
//         let prof = table.rows[i].cells[2]
//         if (!professors.includes(prof)) {
//             professors.push(prof)
            
//         }
//     }
// }