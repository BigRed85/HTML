function RunCalculations(pitty = false) {
    var previousResult;
    var longestRun = 1;
    var currentRun = 1;
    var prob = 0.75;
    var trueCount = 0;
    var falseCount = 0;
    var maxRun = calculateMaxRun(prob);
    var overageCounter = 0;


    var previousResult = getRandomChance(prob)

    if (previousResult){
        trueCount++;
    }
    else {
        falseCount++;
    }

    for (let i = 0; i < 10000000; i++) {
        let currentResult = getRandomChance(prob);
        if (!currentResult && currentResult === previousResult) {
            currentRun++;
            if (pitty && currentRun > maxRun) {
                currentResult = true;
                currentRun = 1;
            }
            else if (currentResult > maxRun) {

            }

            if (currentRun > longestRun) {
                longestRun = currentRun;
            }
        }
        else {
            if (currentResult !== previousResult && currentRun > maxRun)
                overageCounter++;
            currentRun = 1;
        }

        if (currentResult){
            trueCount++;
        }
        else {
            falseCount++;
        }

        previousResult = currentResult;
    }

    console.log("prob: " + prob);
    console.log("MaxRun: " + maxRun);
    console.log("Pitty: " + pitty);
    console.log("Longest Run: " +  longestRun);
    console.log("True count: " + trueCount );
    console.log("False count: " + falseCount );
    console.log("effective prob: " + (trueCount / (trueCount + falseCount)));
    console.log("Overage Counter: " + overageCounter);
}
function getRandomChance(prob) {
    let rand = Math.random();
    if (rand < prob) 
        return true;
    return false;
}

function calculateMaxRun(prob) {
    let probOfFail = 1 - prob;
    let probAtLeastOne = prob;
    let probAllFail = 1 - prob;
    let count = 1;

    while (probAtLeastOne < 0.999) {
        count++;
        probAllFail *= probOfFail;
        probAtLeastOne = 1 - probAllFail;
    }

    return count;
}

console.log("WITHOUT PITTY: ---------------------------------------");
for (let i = 0; i < 5; i++) {
    RunCalculations(false);
}


console.log("\n\nWITH PITTY:-----------------------------------");
for (let i = 0; i < 5; i++) {
    RunCalculations(true);
}