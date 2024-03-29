let workerInterval2;

onmessage = function(message) {
    if (message.data === "clearInterval") {
        if (workerInterval2) {
            this.clearInterval(workerInterval2);
            workerInterval2 = null;
        }
        return;
    } else if (message.data === "startInterval") {
        // console.log("display increment1 " + Date.now())
        workerInterval2 = this.setInterval(() => {
            this.postMessage("display increment");
            console.log("display increment" + Date.now())
        }, 1000)
    }   
}
