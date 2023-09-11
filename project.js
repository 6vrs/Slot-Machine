/*
STEPS

1. Deposit Money

2. Determine Number of lines to bet

3. Collect bet amount

4. Spin slot machine

5. Check if user won

6. Give user winnings / take bet if lost

7. Play again / consider if user is bankrupt

*/

const prompt = require("prompt-sync")();
var figlet = require("figlet");


const ROWS = 3;                 // Rows and columns in the slots machine
const COLS = 3;

const SYMBOLS_COUNT = {         // Amount of each symbol there are
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
} 

const SYMBOLS_VALUES = {        // Value of each symbol
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}
 
const menu = (balance) => {     // Prints SLOTS ascii text
    console.log(``)
    console.log(
        figlet.textSync("Slots", {
          font: "Big Money-nw",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: false,
        })
    );
    while (true) {
        console.log(`
-----------------------
         MENU
-----------------------
1. Deposit into Balance
2. View Balance
3. Play
4. Quit
`)
        var choice = parseFloat(prompt(`Enter a Choice : `))

        if (choice == 1){
            balance = deposit(balance);
        } else if (choice == 2){
            viewBalance(balance);
        } else if (choice == 3 && balance > 0){
            balance = play(balance);
        } else if (choice == 3 && balance <= 0){        // Cannot play if balance = 0
            console.log(`ERROR --> You cannot play since you have a balance of $0`)
        } 
        else if (choice == 4){
            break
        } else
            console.log(`ERROR --> Invalid Input`);
    }
        
}

const viewBalance = (balance) => {      // Prints current balance 
    console.log(`
Current Balance = $${balance}`)
}

const manualDeposit = () => {       // User defined deposit amount (must be greater than 0)
    while (true) {
        const depositAmount = parseFloat(prompt(`Enter Deposit Amount : `));
        if (isNaN(depositAmount) || depositAmount <= 0) {      
            console.log(`ERROR --> Invalid Deposit Amount\nPlease Try Again!\n`);
        } else
            return depositAmount;
    }
    
}


const randomDeposit = () => {       // Generates random number between 1 and 10000 for deposit
    return Math.floor((Math.random() * 10000) + 1);    
}

const addToBalance = (depositAmount, balance) => {      // Adds passed amount to balance
    balance += depositAmount;
    console.log(`Successfully Deposited $${depositAmount}`);
    viewBalance(balance);
    return balance;
}

const deposit = (balance) => {      // Deposit Menu
    while (true){
        console.log(`
-----------------------
        DEPOSIT
-----------------------
1. Manually Enter Deposit Amount
2. Deposit Random Amount
3. Back To Menu
`);
        var input = parseFloat(prompt(`Enter a Choice : `));
        if (input == 1){
            var depositAmount = manualDeposit();
            return addToBalance(depositAmount, balance);

        } else if (input == 2){
            var depositAmount = randomDeposit()
            return addToBalance(depositAmount, balance);

        } else if (input == 3){
            return balance;

        } else 
            console.log(`ERROR --> Invalid Input`);
    }
}

const getNumLines = () => {     // Gets number of lines to bet on
    while (true) {
        const lines = parseFloat(prompt(`Enter Number of Lines to Bet On [1 - 3] : `));
        
        if (isNaN(lines) || lines <= 0 || lines > 3) {
            console.log(`ERROR --> Invalid Number Entered\nPlease Enter a number from 1 - 3\n`);
        } else
            return lines;
    }
}

const getBet = (balance, lines) => {       // Gets bet value, and bet is applied to each line --> means bet has to be smaller than balance / lines betted on
    while (true) {
        const bet = parseFloat(prompt(`Enter Bet Per Line : `));
        
        if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
            console.log(`ERROR --> Invalid Bet\nPlease Enter A Bet from $1 - $${balance / lines}\n`);
        } else
            return bet;
    }
}

const spin = () => {
    const symbols = [];                 // Stores all possible symbols
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);       // Pushes each symbol, count number of times accoridng to global variable
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);                         // Creates columns in slot machine
        const reelSymbols = [...symbols];       // Used to push symbols, and has used symbols removed
        for (let j = 0; j < ROWS; j++){         // For each row in each column
            const index = Math.floor(Math.random() * reelSymbols.length);   // Pick random symbol
            const selectedSymbol = reelSymbols[index];
            reels[i].push(selectedSymbol);      // Add this to the reel
            reelSymbols.splice(index, 1);       // Removes from available symbols
        }
    }
    return reels;

}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row ++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                return 0;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
            console.log(`\nCONGRATULATIONS! You Have Won $${winnings}\n`);
            return winnings;
        } 
    }
}

const printRows = (rows) => {                   // Prints rows in a readable way
    console.log("")
    for (const row of rows) {
        let rowString = "| ";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol +  " | ";
        }
        console.log(rowString);
    }
}

const transpose = (reels) => {                  // Transposes reels from column based to row based
    const rows = [];
    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const play = (balance) => {
    console.log(`
-----------------------
          PLAY
-----------------------`)

    const lines = getNumLines();                // Get number of lines to bet on
    const bet = getBet(balance, lines);         // Get bet for each line
    const reels = transpose(spin());            
    printRows(reels);                           // Spins slots and displays them
    const winnings = getWinnings(reels, bet, lines);       

    if (winnings != 0){
        balance = addToBalance(winnings, balance);      // Gets winnings and adds to balance if winnings > 0
    } else
        console.log(`\nUNLUCKY! You Didn't Win!`);
        balance -= bet * lines;

    viewBalance(balance);
    return balance;
}

var balance = 0;                // Start with a balance of 0
menu(balance);