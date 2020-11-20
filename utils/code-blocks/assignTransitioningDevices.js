/**
 * This function assigns each device in the old device dict to the closest
 * cluster. If the new value of the device is already in that cluster, do
 * not add the old device.
 * @param {*} fitted 
 */
function assignTransitioningDevices(fitted) {
    for (const oldDeviceId in store.oldDeviceDict) {
        const oldDevice = store.oldDeviceDict[oldDeviceId];
        const oldDevicePos = [oldDevice[0], oldDevice[1]];
        let bestCentroidIndex = 0;
        let distToBestCentroid = getDistance(fitted[0][0].centroid, oldDevicePos);
        for (let i = 1; i < fitted[0].length; i++) {
            const distToThisCentroid = getDistance(fitted[0][1].centroid, oldDevicePos);
            if (distToThisCentroid < distToBestCentroid) {
                bestCentroidIndex = i;
                distToBestCentroid = distToThisCentroid;
            }
        }
        const bestCentroid = fitted[0][bestCentroidIndex];
        if (!bestCentroid.points.find((point) => point[2] === oldDeviceId.split('__')[0])) {
            bestCentroid.points.push([oldDevice])
        }
    }
}