function calculateDistractionPerHour() {
    // let startOfHourTime = startOfHour.getTime();
    // let hourBeforeStartOfHourTime = hourBeforeStartOfHour.getTime();
    let distractionsCounter = 0;

    let i = 0;
    while (interruptionTimes[i] < startOfHourTime) {
        if (interruptionTimes[i] >= hourBeforeStartOfHourTime) {
            distractionsCounter++;
        }
        i++;
    }

    console.log(distractionsCounter);
}

let interruptionTimes = [0, 1, 3, 4, 6, 7, 9];
let startOfHourTime = 9;
let hourBeforeStartOfHourTime = 0;

calculateDistractionPerHour();