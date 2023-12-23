let workerInterval2;

onmessage = function(message) {
    if (message.data === "clearInterval") {
        if (workerInterval2) {
            this.clearInterval(workerInterval2);
            workerInterval2 = null;
        }
        return;
    } else if (message.data === "startInterval") {
        workerInterval2 = this.setInterval(() => {
            this.postMessage("display increment");
        }, 1000)
    }   
}
