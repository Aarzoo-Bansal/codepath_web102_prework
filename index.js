/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");
const gameNames=[];

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i = 0; i < games.length; i++){
        
        // create a new div element, which will become the game card
        let div = document.createElement('div');
        // add the class game-card to the list
        div.classList.add('game-card');
        
        // set the inner HTML using a template literal to display some info 
        // about each game
        var imageTag = "<img src="+games[i].img+" class='game-img'> </img>";

        const gameInfo = `${imageTag}`+"<br><br><b>"+`${games[i].name}`+"</b><br><br>"+`${games[i].description}`+"<br><br> Backers: "+ `${games[i].backers}`+"<br><br>";
        gameNames[i]=games[i].name;
        
        //append the game info to the newly created div tag
        div.innerHTML = gameInfo;

        // append the game to the games-container
        document.getElementById('games-container').appendChild(div);
    }
}



// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON)
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((sum, individualContribution) => {
    return sum + individualContribution.backers;
},0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
var updatedFormat = `${totalContributions.toLocaleString('en-US')}`;
contributionsCard.innerHTML = updatedFormat;


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalAmount = GAMES_JSON.reduce((sum, amt) =>{
    return sum + amt.pledged;
},0);

// set inner HTML using template literal
var updatedAmtFormat = "$"+`${totalAmount.toLocaleString('en-US')}`;
raisedCard.innerHTML = updatedAmtFormat;


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const countGames = GAMES_JSON.reduce((cnt, game) => {
    return cnt+1;
},0);

gamesCard.innerHTML = countGames;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // getting a list of games that have not yet met their goal
    var unfundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged < game.goal;
    });

    // adding the unfunded games to the DOM
    addGamesToPage(unfundedGames);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // getting a list of games that have met or exceeded their goal
    var fundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged >= game.goal;
    });

    // adding funded games to the DOM
    addGamesToPage(fundedGames);

}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // adding all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// adding event listeners to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// count the number of unfunded games
var totalAmountRaised = GAMES_JSON.filter((game) => {
    return game.pledged < game.goal;
})

const countUnfundedGames = GAMES_JSON.reduce((sum, game) => {
    var cnt = game.pledged < game.goal ? 1:0;
    return sum + cnt;
},0);

// create a string that explains the number of unfunded games using the ternary operator
// countGames counts the total number of games and updatedAmtFormat displays that total amount that has been raised so far for all the games. 
// Both these values have been calculated in the Challenge 4 section
var num = countUnfundedGames > 1 ? " games remain" : " game remains" ;
const str = `A total of ${updatedAmtFormat} has been raised for ${countGames} games. 
Currently ${countUnfundedGames}` + num + ` unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
let p = document.createElement('p');
p.innerHTML = str;
document.getElementById('description-container').appendChild(p);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
var mostFunded, secondMostFunded;
[mostFunded, secondMostFunded] = [sortedGames[0], sortedGames[1]];

// create a new element to hold the name of the top pledge game, then append it to the correct element
let game1 = document.createElement('p');
game1.innerHTML = `${mostFunded.name}`;
document.getElementById('first-game').appendChild(game1);

// do the same for the runner up item
let game2 = document.createElement('p');
game2.innerHTML = `${secondMostFunded.name}`;
document.getElementById('second-game').appendChild(game2);


/***********************************************************************************************************
 * Here we will select the name of all the games and add those to the selector tab
 */

let selectors = document.createElement('select');
selectors.id="gameName";
let defaultOption = document.createElement('option');
defaultOption.text="Select an option";
defaultOption.value = "none";
defaultOption.disabled = true;
defaultOption.hidden = true;
defaultOption.selected = true;
selectors.appendChild(defaultOption);

for(var i = 0; i < gameNames.length; i++){
    let option = document.createElement('option');
    option.text = gameNames[i];
    option.value = gameNames[i];
    selectors.appendChild(option);

}
document.getElementById('gameSelector').appendChild(selectors);


/***********************************************************************************************************
 * Donation Form
 */
let donateForm = document.getElementById("donate-form");

donateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = document.getElementById("name");
  let companyName = document.getElementById("companyName");
  let email = document.getElementById("email");
  let amt = document.getElementById("fund-amount");
  let game = document.getElementById("gameName");

  if(name=="" || companyName=="" || email=="" || amt.value <= 0 || amt.value=="" || game.value =="none"){
    alert("Please enter all the details");
  }else{
    alert("Thank you for your donation!");
    name.value="";
    companyName.value="";
    email.value="";
    amt.value="";
    game.value="none";
  }

},);