// elements mapped to their class names
var element_mappings = {
    numProfessors: '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div.SearchResultsPage__SearchResultsPageHeader-sc-1srop1v-3.flHcYr > div > h1',
    overallRating: ['#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a > div > div.TeacherCard__NumRatingWrapper-syjs0d-2.joEEbw > div > div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.gcFhmN', '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a > div > div.TeacherCard__NumRatingWrapper-syjs0d-2.joEEbw > div > div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.bUneqk', '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a > div > div.TeacherCard__NumRatingWrapper-syjs0d-2.joEEbw > div > div.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2.icXUyq'],
    dept: 'CardSchool__Department-sc-19lmz2k-0 haUIRO',
    takeAgain: '#root > div > div > div:nth-child(4) > div.SearchResultsPage__StyledSearchResultsPage-sc-1srop1v-0.kdXwyM > div.SearchResultsPage__SearchResultsWrapper-sc-1srop1v-1.gsOeEv > div:nth-child(3) > a:nth-child(1) > div > div.TeacherCard__CardInfo-syjs0d-1.fkdYMc > div.CardFeedback__StyledCardFeedback-lq6nix-0.frciyA > div:nth-child(1) > div',
    numRatings: 'CardNumRating__CardNumRatingCount-sc-17t4b9u-3 jMRwbg',
    difficulty: 'CardFeedback__CardFeedbackNumber-lq6nix-2 hroXqf',
    noProfFound: "NoResultsFoundArea__NoResultsFoundHeader-mju9e6-1 dVgkql"
}

console.log("content-script.js running")

// chrome.runtime.sendMessage({tid: "" + 2272729}, async function(response) {
//     var parser = new DOMParser();
//     var doc = parser.parseFromString(response.returned_text, "text/html")
//     console.log("parsing RMP doc");
//     let overallRating = scrapeOverallRating(doc)[0].textContent;
//     console.log("Overall rating: " + overallRating);
// });

function scrapeOverallRating(doc){
    console.log("mapping:",element_mappings.overallRating);
    return doc.getElementsByClassName(element_mappings.overallRating);
}
function checkRatings(prof_name, doc) {
    // check if professor exists

    // does not exist OR more than one professor with that exact name
    if (doc.getElementsByClassName(noProfFound)[0] != undefined || !doc.querySelector(numProfessors).innerText.startsWith('1 professor')) {
        return null
    }
    ratings = {}
    
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
    console.log("rating not found")
    return null

}

function readProfessors(table) {
    let professors = []
    var len = table.rows.length
    for (let i=1; i < len; i++) {
        let prof = table.rows[i].cells[2]
        if (!professors.includes(prof)) {
            professors.push(prof)
            
        }
    }
}