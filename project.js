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


const menu = (balance) => {
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
        } else if (choice == 4){
            break
        } else
            console.log(`ERROR --> Invalid Input`);
    }
        
}

const viewBalance = (balance) => {
    console.log(`
Current Balance = $${balance}`)
}

const manualDeposit = () => {
    while (true) {
        const depositAmount = parseFloat(prompt(`Enter Deposit Amount : `));
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log(`ERROR --> Invalid Deposit Amount\nPlease Try Again!\n`);
        } else

            return depositAmount;
    }
    
}

const randomDeposit = () => {
    return Math.floor((Math.random() * 10000) + 1);
}

const addToBalance = (depositAmount, balance) => {
    balance += depositAmount;
    console.log(`Successfully Deposited $${depositAmount}`);
    viewBalance(balance);
    return balance;
}

const deposit = (balance) => {
    while (true){
        console.log(`
-----------------------
        DEPOSIT
-----------------------
1. Manually Enter Deposit Amount
2. Deposit Random Amount
3. Back To Menu
`)
        var input = parseFloat(prompt(`Enter a Choice : `));
        if (input == 1){
            var depositAmount = manualDeposit();
            return addToBalance(depositAmount, balance);
        }

        if (input == 2){
            var depositAmount = randomDeposit()
            return addToBalance(depositAmount, balance);
        }

        if (input == 3){
            return balance
        } else 
            console.log(`ERROR --> Invalid Input`)
    }
}

var balance = 0;
menu(balance);