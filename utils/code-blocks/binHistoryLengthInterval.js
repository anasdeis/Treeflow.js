/*
 * History length handling code. Every 30 seconds, check the list of device
 * and remove any device that did not receive an update in the last historyLength.
 */
const historyLength = 60 * 60 * 1000;
setInterval(() => {
    const now = Date.now();
    for (const device in store.array) {
        if (store.array[device][3] < now - historyLength) {
            store.array.splice(device, 1);
        }
    }
}, 30000);