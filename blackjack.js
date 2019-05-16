const suits =  ["Clubs", "Diamonds", "Hearts", "Spades"];
const cards =  ["Two", "Three", "Four" , "Five",
                "Six", "Seven", "Eight", "Nine", "Ten",
                "Jack", "Queen", "King", "Ace"];

const dealerCardsUI = document.getElementById("dealer-cards");
const playerCardsUI = document.getElementById("player-cards");
const gameButtons = document.getElementById("game");
const playerScoreUI = document.getElementById("player-score");
const dealerScoreUI = document.getElementById("dealer-score");
const restartButton = document.getElementById("restart-game");

let endTextNode;
let playerCards = [];
let dealerCards = [];
let cardObjArray = [];

initializeGame();

function initializeGame() {
    deck();
    randomizeDeck(cardObjArray);
    dealCards();
    addCardsToUI(playerCards, playerCardsUI);
    addCardsToUI(dealerCards, dealerCardsUI);
    scoreHands();
}

function deck() {
    for(i = 0; i < suits.length; i++){
        for(j = 0; j < cards.length; j++) {
            let card = {
                "Suit" : suits[i],
                "Value" : cards[j]
            }
            cardObjArray.push(card);
        }
    }
}

function randomizeDeck(deck) {
    let arr = [];
    for (i = 0; i < deck.length; i++) {
        let swapId = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapId];
        deck[swapId] = deck[i];
        deck[i] = tmp;
    }
}

function dealToPlayer() {
    let playerCard = cardObjArray.shift();
    playerCards.push(playerCard);
}

function dealToDealer() {
    let dealerCard = cardObjArray.shift();
    dealerCards.push(dealerCard);
}

function dealCards() {
    for (i = 0; i < 2; i++) {
        dealToPlayer();
        dealToDealer();
    }    
}

function getNumericValue(card) {
    let cardValue;
    switch(card.Value) {
        case 'Ace':
            cardValue = 1;
            break;
        case 'Two':
            cardValue = 2;
            break;
        case 'Three':
            cardValue = 3;
            break;
        case 'Four':
            cardValue = 4;
            break;
        case 'Five':
            cardValue = 5;
            break;
        case 'Six':
            cardValue = 6;
            break;
        case 'Seven':
            cardValue = 7;
            break;
        case 'Eight':
            cardValue = 8;
            break;
        case 'Nine':
            cardValue = 9;
            break;
        default:
            cardValue = 10;
    }
    return cardValue;
}

function scoreHand(cardHand, scoreUI) {
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < cardHand.length; i++) {
        let card = cardHand[i];
        score += getNumericValue(card);
        if (card.Value === 'Ace') {
            hasAce = true;
        }
    }
    if (hasAce && score + 10 <= 21) {
        score += 10;
    }
    addToScoreUI(score, scoreUI);
}

function scoreHands() {
    scoreHand(playerCards, playerScoreUI);
    scoreHand(dealerCards, dealerScoreUI);
}

function startNewGame() {
    resetAllHands();
    resetGameDiv();
    initializeGame();
}

function resetAllHands() {
    score = 0;
    removeCards(playerCards, playerCardsUI);
    removeCards(dealerCards, dealerCardsUI);
    removeCards(cardObjArray);
}

function removeCards(deck, hand) {
    while (deck.length > 0) {
        deck.pop();
        if (hand) {
            removeCardsFromUI(hand);
        }
    }
}

function gameEndConditions() {
    if (parseInt(playerScoreUI.innerText) <= 21) {
        dealAfterStay();
    }
    dealerPlayerHandComp();
    restartButton.style.display = 'block';
}

function dealerPlayerHandComp() {
    let playerWin = false;
    if (parseInt(dealerScoreUI.innerText) <= 21 && dealerCards.length === 5) {
        gameEndText(playerWin);
    } else if (parseInt(dealerScoreUI.innerText) > 21 && parseInt(playerScoreUI.innerText) <= 21) {
        playerWin = true;
        gameEndText(playerWin);
    } else if  (parseInt(playerScoreUI.innerText) <= 21 && 
                parseInt(playerScoreUI.innerText) > parseInt(dealerScoreUI.innerText)) {
        playerWin = true;
        gameEndText(playerWin);
    } else {
        gameEndText(playerWin);
    }
}

function dealAfterStay() {
    while (parseInt(dealerScoreUI.innerText) < parseInt(playerScoreUI.innerText) &&
        parseInt(dealerScoreUI.innerText) < 21) {
            dealToDealer();
            addNewCardToUI(dealerCards, dealerCardsUI);
            scoreHand(dealerCards, dealerScoreUI); 
    }
}

//***********************UI Functions***********************************//

const hitButton = HitMeButtonCreate();
const stayButton = StayButtonCreate();

function addCardsToUI(array, ulNode) {
    array.forEach(function (card) {
        const node = document.createElement("LI");
        let cardText = document.createTextNode(`${card.Value} of ${card.Suit}`);
        node.appendChild(cardText);
        ulNode.appendChild(node);
    });
}

function addNewCardToUI(array, ulNode) {
    const lastCard = array[array.length - 1];
    const node = document.createElement("LI");
    let cardText = document.createTextNode(`${lastCard.Value} of ${lastCard.Suit}`);
    node.appendChild(cardText);
    ulNode.appendChild(node);
}

function removeCardsFromUI(hand) {
    hand.removeChild(hand.childNodes[0]);
}

function addToScoreUI(score, scoreDiv) { 
    scoreDiv.innerText = score; 
}

function HitMeButtonCreate() {
    const hitNode = document.createElement("BUTTON");
    hitNode.id = "hit-me-button";
    hitNode.innerText = "Hit Me!";
    gameButtons.appendChild(hitNode);
    return hitNode;
}

function StayButtonCreate() {
    const stayNode = document.createElement("BUTTON");
    stayNode.id = "stay-button";
    stayNode.innerText = "Stay";
    gameButtons.appendChild(stayNode);
    return stayNode;
}

function removeHitMeCondition (stayButtonClicked) {
    if (playerScoreUI.innerText > 21 || stayButtonClicked) {
        removeGameButtons();
        gameEndConditions();
    }
}

function removeGameButtons() {
    removeHitMeButton();
    removeStayButton();
}

function removeHitMeButton() {
    hitButton.style.display = 'none';
}

function removeStayButton() {
    stayButton.style.display = 'none';
}

function gameEndText(playerWins) {
    if (playerWins) {
        endTextNode = document.createTextNode("Player Wins.");
    } else {
        endTextNode = document.createTextNode("Dealer Wins.");
    }
    gameButtons.appendChild(endTextNode);
}

function resetGameDiv() {
    gameButtons.removeChild(endTextNode);
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    restartButton.style.display = 'none';
}

restartButton.addEventListener("click", function () {
    startNewGame();
});

hitButton.addEventListener("click", function() {
    dealToPlayer();   
    addNewCardToUI(playerCards, playerCardsUI);
    scoreHand(playerCards, playerScoreUI);
    removeHitMeCondition(false);
});

stayButton.addEventListener("click", function() {
    removeHitMeCondition(true);
});

//***********************UI Functions***********************************//