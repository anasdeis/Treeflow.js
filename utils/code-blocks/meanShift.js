/*
 * Mean shift algorithm code. Adapted from GitHub @easonyty 
 * https://github.com/ytyeason/Visualization-on-Internet-of-Things/blob/master/app/Dashboard/meanShift.js
 */
function fit(data, radius, c_distance) {

    // Naive initialization. 1 point = 1 centroid
    var centroids = [];
    for (let i = 0; i < data.length; i++) {
        centroids[i] = data[i];
    }

    // Begin optimization
    while (true) {
        let new_centroids = [];
        let new_centroids_points = [];

        // For each cluster, add all points to it that are within the kernel size
        for (let i = 0; i < centroids.length; i++) {

            let in_bandwidth = [];
            var centroid = centroids[i];
            for (let i = 0; i < data.length; i++) {
                if (getDistance(data[i], centroid) < radius) {
                    in_bandwidth.push(data[i]);
                }
            }

            // Find the average position of all points in kernel
            let new_centroid = getAverage(in_bandwidth);
            new_centroids.push(new_centroid);

            // Save this step's clusters
            let new_centroid_points = {};
            new_centroid_points.centroid = new_centroid;
            new_centroid_points.points = in_bandwidth;
            new_centroids_points.push(new_centroid_points);
        }

        // Save previous centroid for optimization evaluation
        var prev_centroids = JSON.parse(JSON.stringify(centroids));

        // Remove duplicate cluster (two clusters within a 2*c_distance square)
        var uniques = removeDupFromMultiArr(new_centroids, c_distance);

        // Check if clusters changed. If not, the solution is optimized. 
        centroids = [];
        for (let i = 0; i < uniques.length; i++) {
            centroids[i] = uniques[i].centroid;
        }
        var optimized = true;
        for (let i = 0; i < centroids.length; i++) {
            if (!arraysEqual(centroids[i], prev_centroids[i])) {
                optimized = false;
            }
            if (!optimized) {
                break;
            }
        }
        if (optimized) {
            // Rebuild list of contributing devices per cluster and return.
            return [buildCentroidPoints(centroids, data), centroids];
        }

    }
}

function removeDupFromMultiArr(arr, distance) {

    var uniques = [];
    var centroid_distance = distance;

    for (var i = 0; i < arr.length; i++) {

        let unique = true;
        for (var j = 0; j < uniques.length; j++) {

            const uniqueCentroid = uniques[j].centroid;
            if ((Math.abs(arr[i][0]-uniqueCentroid[0])<centroid_distance)&&(Math.abs(arr[i][1]-uniqueCentroid[1])<centroid_distance)) { //if within range of c_distance, abandon this center
                unique = false;
                uniques[j].absorbedCentroids.push(arr[i]);
                break;
            }
        }

        if (unique) {
            uniques.push({centroid: arr[i], absorbedCentroids: []});
        }

    }

    return uniques;

}

/**
 * Get euclidean distance between 2 points.
 * @param {*} arr1 [x, y]
 * @param {*} arr2 [x, y]
 */
function getDistance(arr1, arr2) {
    var diff_x = arr1[0] - arr2[0];
    var diff_y = arr1[1] - arr2[1];
    var dis_square = diff_x * diff_x + diff_y * diff_y;
    return Math.sqrt(dis_square);
}

/**
 * Get the average x and y values of all points in arr
 * @param {*} arr [[x, y]]
 */
function getAverage(arr) {
    var num = arr.length;
    var sum_x = 0;
    var sum_y = 0;

    for (let i = 0; i < arr.length; i++) {
        sum_x = sum_x + arr[i][0];
        sum_y = sum_y + arr[i][1];
    }

    var x = sum_x / num;
    var y = sum_y / num;
    var tmp = [];
    tmp.push(+(x.toFixed(2)));
    tmp.push(+(y.toFixed(2)));

    return tmp;
}

/**
 * Compare two arrays. Return true if they are equal.
 * @param {*} a1 
 * @param {*} a2 
 */
function arraysEqual(a1, a2) {
    return JSON.stringify(a1) === JSON.stringify(a2);
}

/**
 * Assign each device to the closest cluster.
 * @param {*} centroids 
 * @param {*} data 
 */
function buildCentroidPoints(centroids, data) {
    const deviceDict = {};
    const centroidPoints = centroids.map(centroid => {
        return {centroid, points: []};
    });
    for (const point of data) {
        const pointPos = [point[0], point[1]];
        const deviceId = point[2];
        let closestCentroid = 0;
        let closestCentroidDist = getDistance(pointPos, centroidPoints[0].centroid);
        for (let i = 1; i < centroidPoints.length; i++) {
            const distToThisCentroid = getDistance(pointPos, centroidPoints[i].centroid);
            if (distToThisCentroid < closestCentroidDist) {
                closestCentroid = i;
                closestCentroidDist = distToThisCentroid;
            }
        }
        centroidPoints[closestCentroid].points.push(point);
        deviceDict[deviceId] = closestCentroid;
    }
    return centroidPoints;
}
