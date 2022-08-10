
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

let global_ratings = []
let tab_id = undefined
console.log("content-script.js running")
// ///////////////////////////////

// /////////////////////////////

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



async function fetchRatings() {
    let profs = getProfessors()
        console.log("fetching ratings for " + profs)
        chrome.runtime.sendMessage({names:profs}, response => {
            // console.log("FETCED! response: ", response )
        })
        // console.log("resolved: " + resp.then(data => data).catch(error => console.log("Error: " + error)))
        // for (let j = 0, keys = Object.keys(ratings), ii = keys.length; j < ii; j++) {
        //     console.log(keys[j] + '|' + ratings[keys[j]].list);
        //   }
        

    return Promise.resolve(true)
}

fetchRatings()
chrome.runtime.onMessage.addListener(
    function(request, sender) {
        // console.log("bg request: " + JSON.stringify(request))
        // console.log("raw length " + request.raws.length)
        for (let i = 0; i < request.raws.length; i++) {
            let raws = request.raws
            addRating(raws[i].name, raws[i].raw)
        }
        console.log("All ratings found. Adding to BU page now.")
        // console.log("global_ratings.length: " + global_ratings.length)
        tab_id = request.id
        console.log("tab id: " + tab_id)
        displayRatings()
        
        return true
    }

    
)



// checks rating for individual prof, given RMP dom
function checkRatings(doc) {
    console.log(doc)
    let data = doc.querySelector(element_mappings.relayStore).innerText
    // console.log("data: " + data)
    // check if professor exists
    // does not exist OR more than one professor with that exact name
    let start = data.indexOf("avgRating")
    if (start === -1) {return "No professor"}
    // professor exists, so now we get all their ratings
    console.log("prof exists...")
    let ratings = {}
    ratings.overall = parseFloat(data.match('(?<=avgRating":).*?(?=,)'))
    ratings.numRatings = parseFloat(data.match('(?<=numRatings":).*?(?=,)'))
    ratings.takeAgain = parseFloat(data.match('(?<=wouldTakeAgainPercent":).*?(?=,)'))
    ratings.difficulty = parseFloat(data.match('(?<=avgDifficulty":).*?(?=,)'))
    ratings.department = data.match('(?<=department":").*?(?=",)')
  
    return ratings
  }
  
  
  
  async function addRating(prof, text) {
    //   console.log("addRating txt: " + text)
    // console.log("text = " + text)
    // console.log("addrating text: " + text.res)
    var parser = new DOMParser()
    var doc = parser.parseFromString(text, "text/html")
    let rating = checkRatings(doc)
    console.log("parsed RMP doc")
    // console.log("> " + doc)
    console.log("adding rating: " + prof + ":" + JSON.stringify(rating))
    // console.log("gratings: " + JSON.stringify(global_ratings))
    global_ratings.push({name: prof, rating:rating})
    // console.log("gratings again: " + JSON.stringify(global_ratings))
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

// }




function createRow(table, prof, ratings) {
    let newRow = table.insertRow(-1)
    let url = "https://www.ratemyprofessors.com/search/teachers?query=" + encodeURI(prof) + "&sid=U2Nob29sLTEyNA=="
    let a =  document.createElement('a')
    let linkText = document.createTextNode(prof)
    a.appendChild(linkText)
    a.title = prof
    a.href = url

    newRow.insertCell(0).appendChild(a)
    newRow.insertCell(1).appendChild(document.createTextNode(ratings.overall))
    newRow.insertCell(2).appendChild(document.createTextNode(ratings.difficulty))
    newRow.insertCell(3).appendChild(document.createTextNode(Math.round(ratings.takeAgain)+"%"))
    newRow.insertCell(4).appendChild(document.createTextNode(ratings.numRatings))
    newRow.insertCell(5).appendChild(document.createTextNode(ratings.department))
}

function displayRatings() {
    console.log("displaying ratings now")
    let new_table = document.createElement("table")
    
    let og_table = document.querySelector("#body-tag > main > div > div > div > table")
    
    // while (global_ratings.length == 0) {
    //     console.log("waiting for ")
    // }
    for (let i = 0; i < global_ratings.length; i++) {
        let pair = global_ratings[i]
        createRow(new_table, pair.name, pair.rating)
    }

    let header_row = new_table.insertRow(0)
    header_row.insertCell(0).appendChild(document.createTextNode("Name"))
    header_row.insertCell(1).appendChild(document.createTextNode("Overall Rating"))
    header_row.insertCell(2).appendChild(document.createTextNode("Difficulty"))
    header_row.insertCell(3).appendChild(document.createTextNode("Take Again"))
    header_row.insertCell(4).appendChild(document.createTextNode("# Ratings"))
    header_row.insertCell(5).appendChild(document.createTextNode("Department"))



    // now to add the table
    let div = og_table.parentNode
    div.insertBefore(new_table, og_table)

}
