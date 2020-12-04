/*
 * History length handling code. Every 30 seconds, check the list of device
 * and remove any device that did not receive an update in the last historyLength.
 */

const historyLength = 120000;
setInterval(() => {
    const now = Date.now();
    for (const device in store.array) {
        if (store.array[device][3] < now - historyLength) {
            //console.log('delete', store.array[device][2])
            store.array.splice(device, 1);
        }
    }
}, 30000);