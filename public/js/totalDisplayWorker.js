let workerInterval3;

onmessage = function(message) {
    if (message.data === "clearInterval") {
        if (workerInterval3) {
            this.clearInterval(workerInterval3);
            workerInterval3 = null;
        }
        return;
    } else if (message.data === "startInterval") {
        workerInterval3 = this.setInterval(() => {
            this.postMessage("total display increment");
        }, 1000)
    }   
}
