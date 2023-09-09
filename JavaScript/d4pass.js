var coins = 0;
var paidCount = 0;
var freeCount = 0;



for (let i = 0; i < 40; i++) {
    if (coins >= 1000) {
        //pay for the season pass with coins
        coins -= 1000;
        console.log("Free");
        freeCount++;
    }
    else {
        //pay for season pass with money
        console.log("Paid");
        paidCount++;
    }
    coins += 666;

}

console.log("paid count: " + paidCount + ", free count: " + freeCount);