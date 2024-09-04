let workerIntervalPomodoro;

onmessage = function(message) {
    let totalNotificationSeconds = message.data;

    if (message.data === "clearInterval") {
        if (workerIntervalPomodoro) {
            this.clearInterval(workerIntervalPomodoro);
            workerIntervalPomodoro = null;
        }
        return;
    } else {
        workerIntervalPomodoro = this.setInterval(() => {
            if (totalNotificationSeconds === 1) {
                this.postMessage("interval finished");
                this.clearInterval(workerIntervalPomodoro);
                workerIntervalPomodoro = null;
            } else {
                totalNotificationSeconds--;
                // console.log(totalNotificationSeconds);
            }
        }, 1000)
    }   
}
