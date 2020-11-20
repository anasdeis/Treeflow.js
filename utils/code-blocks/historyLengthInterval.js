/*
 * History length handling code. Every 30 seconds, check the list of device
 * and remove any device that did not receive an update in the last historyLength.
 */
const historyLength = 60 * 60 * 1000;
setInterval(() => {
    const now = Date.now();
    for (const device in store.deviceDict) {
        if (store.deviceDict[device][3] < now - historyLength) {
            delete store.deviceDict[device];
        }
    }
    const points = Object.values(store.deviceDict);
    const fitted = fit(points, 10, 5);
    store.array = fitted[0].map(fitResults => [fitResults.centroid[0], fitResults.centroid[1], fitResults.points.length]);
}, 30000);
