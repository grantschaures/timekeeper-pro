let workerIntervalFlowmodoro;

onmessage = function(message) {
    let totalNotificationSeconds = message.data;

    if (message.data === "clearInterval") {
        if (workerIntervalFlowmodoro) {
            this.clearInterval(workerIntervalFlowmodoro);
            workerIntervalFlowmodoro = null;
        }
        return;
    } else {
        workerIntervalFlowmodoro = this.setInterval(() => {
            if (totalNotificationSeconds === 1) {
                this.postMessage("interval finished");
                this.clearInterval(workerIntervalFlowmodoro);
                workerIntervalFlowmodoro = null;
            } else {
                totalNotificationSeconds--;
                // console.log(totalNotificationSeconds);
            }
        }, 1000)
    }   
}