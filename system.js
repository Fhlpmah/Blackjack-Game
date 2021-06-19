let blackjackDatabase = {
    'you': {'board': '#your-result-board', 'current-score': '#yourScore', 'initial-score': 0},
    'dealer': {'board': '#oppo-result-board', 'current-score': '#botScore', 'initial-score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsValue': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': [1, 11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'inStand': false,
    'turnsOver': false,
}

const YOU = blackjackDatabase['you'];
const DEALER = blackjackDatabase['dealer'];
const CARD = blackjackDatabase['cardsValue'];
const WIN = blackjackDatabase['wins'];
const LOSS = blackjackDatabase['losses'];
const DRAW = blackjackDatabase['draws'];


document.querySelector('#bj-hit-button').addEventListener('click', buttonHit);
document.querySelector('#bj-deal-button').addEventListener('click', buttonDeal);
document.querySelector('#bj-stand-button').addEventListener('click', buttonStand);

function buttonHit () {
    if (blackjackDatabase['inStand'] === false) {
    
        let randomCard = randoming();
        let lastValueYOU = valueAdditionSecond(YOU, CARD, randomCard);
        showCard(randomCard, YOU, lastValueYOU);
        showScore(YOU, lastValueYOU);
        stopFunc(YOU, lastValueYOU)
        console.log('your = ' + lastValueYOU);

    }
}

function buttonStand () {
    dealerTurn();
   
}

async function dealerTurn () {
    blackjackDatabase['inStand'] = true;

//Yup this line of codes are pretty nasty, need to develope a neater way
    while (DEALER['initial-score'] < 16 && blackjackDatabase['inStand'] === true) {
        let randomCard = randoming();
        let lastValueDEALER = valueAdditionSecond(DEALER, CARD, randomCard);
        showCard(randomCard, DEALER, lastValueDEALER);
        showScore(DEALER, lastValueDEALER);
        stopFunc(DEALER, lastValueDEALER);
        console.log('dealer = ' + lastValueDEALER);
        await sleep(1000);
    }

        blackjackDatabase['turnsOver'] = true;
        let logic = winnerLogic();
        headWinner(logic);
}

function randoming(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackDatabase['cards'][randomIndex];
}

function showCard(card, activePlayer, lastValueYOU) {
    if (lastValueYOU <= 21) {
        let cardShow = document.createElement('img');
        cardShow.src = `assets/${card}.png`;
        document.querySelector(activePlayer['board']).appendChild(cardShow);

    }
}

function valueAdditionSecond(initial, value, card) {
    if (card === 'A') {
        if ( initial['initial-score'] + value[card][1] <= 21 ) {
            return initial['initial-score'] += value[card][1];
        } else {
            return initial['initial-score'] += value[card][0];
        }
    } else {
        return initial['initial-score'] += value[card];
    }
}

function showScore(mine, showing) {
    document.querySelector(mine['current-score']).textContent = showing;
}

function stopFunc(mine, stopPing) {
    if(stopPing > 21) {
        document.querySelector(mine['current-score']).textContent = 'THATS TOO MUCH SG. SOAP!!';
        document.querySelector(mine['current-score']).style.color = 'red';
    }
}

function buttonDeal () {
    if (blackjackDatabase['turnsOver'] === true) {

        blackjackDatabase['inStand'] = false;

        let allYourImages = document.querySelector(YOU['board']).querySelectorAll('img');
        let allOppoImages = document.querySelector(DEALER['board']).querySelectorAll('img');

        for (let i = 0; i < allYourImages.length; i++) {
            allYourImages[i].remove();
        }

        for (let i = 0; i < allOppoImages.length; i++) {
            allOppoImages[i].remove();
        }

        YOU['initial-score'] = 0;
        DEALER['initial-score'] = 0;

        document.querySelector(YOU['current-score']).textContent = 0;
        document.querySelector(DEALER['current-score']).textContent = 0;
        document.querySelector(YOU['current-score']).style.color = '#ffffff';
        document.querySelector(DEALER['current-score']).style.color = '#ffffff';

        document.querySelector('#headTitle').textContent = "Let's Play";
        document.querySelector('#headTitle').style.color = 'black';
    
        blackjackDatabase['turnsOver'] = false;
    }
}

function winnerLogic() {
    let winner;
    // Conditions where we got the score under and how it reacts to the opponents various LastValue
    if (YOU['initial-score'] <= 21) {
        if (YOU['initial-score'] > DEALER['initial-score'] ) {
            blackjackDatabase['wins']++;
            winner = YOU;

        } else if (DEALER['initial-score'] > 21) {
            blackjackDatabase['wins']++;
            winner = YOU;

        } else if (YOU['initial-score'] < DEALER['initial-score']) {
            blackjackDatabase['losses']++; 
            winner = DEALER;

        } else if (YOU['initial-score'] === DEALER['initial-score']) {
            blackjackDatabase['draws']++;
        }
    // Conditions where we got the score off the mark, regardless how much the opponent got
    } else if (YOU['initial-score'] > 21 && DEALER['initial-score'] <= 21) {
        blackjackDatabase['losses']++;
        winner = DEALER;
    // Conditions where both of u got the score off the mark
    } else if (YOU['initial-score'] > 21 && DEALER['initial-score'] > 21){
        blackjackDatabase['draws']++;
    }

    console.log(blackjackDatabase);
    return winner;


}

function headWinner(winner) {
    if (blackjackDatabase['turnsOver'] === true){
        let message, messageColor;

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackDatabase['wins'];
            message = 'YOU WON !!';
            messageColor = '#ffffff'
        }

        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackDatabase['losses'];
            message = 'YOU LOST !!';
            messageColor = '#ffffff'
        }

        else { 
            document.querySelector('#draws').textContent = blackjackDatabase['draws'];
            message = 'YOU DREW!!'
        }

        document.querySelector('#headTitle').textContent = message;
        document.querySelector('#headTitle').style.color = messageColor;
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

