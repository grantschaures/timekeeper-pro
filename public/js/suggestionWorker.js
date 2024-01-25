let workerIntervalSuggestion;

onmessage = function(message) {
    let totalNotificationSeconds = message.data;

    if (message.data === "clearInterval") {
        if (workerIntervalSuggestion) {
            this.clearInterval(workerIntervalSuggestion);
            workerIntervalSuggestion = null;
        }
        return;
    } else {
        workerIntervalSuggestion = this.setInterval(() => {
            if (totalNotificationSeconds === 1) {
                this.postMessage("interval finished");
                this.clearInterval(workerIntervalSuggestion);
                workerIntervalSuggestion = null;
            } else {
                totalNotificationSeconds--;
                // console.log(totalNotificationSeconds);
            }
        }, 1000)
    }   
}