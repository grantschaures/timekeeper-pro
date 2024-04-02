let workerInterval3;

onmessage = function(message) {
    if (message.data === "clearInterval") {
        if (workerInterval3) {
            this.clearInterval(workerInterval3);
            workerInterval3 = null;
        }
        return;
    } else if (message.data === "startInterval") {
        // console.log("total display increment1 " + Date.now())
        workerInterval3 = this.setInterval(() => {
            this.postMessage("total display increment");
            // console.log("total display increment" + Date.now())
        }, 1000)
    }   
}
