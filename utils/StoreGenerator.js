const fs = require('fs');
const fsPath = require('fs-path');
const EchartAdaptor = require('./EchartAdaptor');

/*
 @ storeName -> just str.concat(panel,'Store.js')
 @ stores -> stores to be generated
 @ pageDirectory -> stores associated page's directory, which the store files will be saved in as well
 @ callback -> callback function
 */

module.exports = function(storeName, panel, pageDirectory){

    fsPath.writeFile(__StoreFileDir(pageDirectory,storeName), '//Store File for '+storeName, function(err,data){
        if (err) throw err;
        console.log('Store File Created');

        var ws = fs.createWriteStream(__StoreFileDir(pageDirectory,storeName), {flags:'a'});
        ws.writeLine=(str)=>{ws.write('\n');ws.write(str);};
        ws.writeLine(__StoreFileDependencies__);
        if (panel.type == 'bin') ws.writeLine(__StoreFileDependenciesBinChart__);
        if (panel.type == 'bubble') ws.writeLine(__StoreFileDependenciesBubbleChart__);
        ws.writeLine(__ClassName(storeName));

        //write
        if (panel.type != 'bin') ws.writeLine(__BasicFunctions__);
        if (panel.type == 'formset'){
            // map user inputed values , formset is represented by map
            if(panel.store) {
                ws.writeLine("@observable map = " + JSON.stringify(panel.store));
            } else {
                console.log ('Store is missing on panel'+storeName);
                throw err;
            }
            ws.writeLine("@computed get formset(){\n");
            if(panel.formList){
                panel.formList.forEach(e=>{
                    e.trigger = 'changeValue';
                    e.value = panel.store[e.param] ? panel.store[e.param] : 0;
                })
                ws.writeLine("const formList = "+JSON.stringify(panel.formList, null, 4));
            } else {
                console.log ("FormList is missing on a formset panel");
                throw err;
            }
            if(panel.actionList){
                ws.writeLine("const actionList = "+JSON.stringify(panel.actionList, null, 4));
            } else {
                console.log ("FormList is missing on a formset panel");
                throw err;
            }

            ws.writeLine("return {\
                formList: formList,\
                actionList: actionList,\
                className: ' formset2 whiteBgColor',\
                columns: 1\
            }")
            ws.writeLine("}")
        } else if (panel.type  == 'table') {
            // map user inputed values , table is represented by array
            if(panel.store) {
                ws.writeLine("@observable array = " + JSON.stringify(panel.store));
            } else {
                console.log ('Store is missing on panel'+storeName);
                throw err;
            }
            // form header based on headers definition in the Config.json
            ws.writeLine("@computed get table(){\n");
            ws.writeLine("const headers = "+JSON.stringify(panel.headers));
            ws.writeLine("var centerBody = this.array.map(entry => {\
                                return (entry.map(e=>{\
                                        return {type:'plain', valueLabel: e};\
                                    }));\
                                }).map(e=>{return {className: '',list: e};});");
            ws.writeLine("var arrayOfCheckBoxes =this.array.map(e=>{\
            return({\
                className: '',\
                list: [{type: 'checkbox', param: 1, value: false, trigger: 'setCheckBox', className: 'td-text-center'}]\
            });});");
            // return the render ready obj data
            ws.writeLine("return {\
                leftHeader: [{type: 'checkbox', value: false, trigger: 'selectAll', className: 'td-text-center'}],\
                leftBody: arrayOfCheckBoxes,\
                rightHeader: [],\
                centerHeader: headers,\
                rightBody: [],\
                centerBody: centerBody}");
            ws.writeLine('}');
        } else if(panel.type == 'scatter' || panel.type == 'pie' || panel.type == 'graph' || panel.type == 'stackedgraph') {
            // initialize an empty array so that when socket.io emits messages in, it will store the data in the array
            ws.writeLine("\t@observable array = [];\n");
            // form  based on headers definition in the Config.json
            if(panel.type == 'scatter')
                ws.writeLine("\t@computed get scatter"+EchartAdaptor.scatter.toString().replace('function',''));
            else if(panel.type == 'pie')
                ws.writeLine("\t@computed get pie"+EchartAdaptor.pie.toString().replace('function',''));
            else if (panel.type == 'graph')
                ws.writeLine("\t@computed get graph" + EchartAdaptor.graph.toString().replace('function', ''));
            else if(panel.type == 'stackedgraph')
                ws.writeLine("\t@computed get stackedGraph" + EchartAdaptor.stackedGraph.toString().replace('function', ''));
            ws.writeLine(__AddDataPoints__);
        } else if (panel.type == 'bubble') {
            const mode = panel.mode;
            if (!["pre-clustered", "count", "average"].includes(mode)) {
                throw "Clustering mode for bubble chart is missing or invalid";
            }
            if (mode !== "pre-clustered" && (
                !panel.bandwidthRadius || !panel.deduplicationRadius || typeof(panel.bandwidthRadius) !== 'number' 
                || typeof(panel.deduplicationRadius) !== 'number')) {
                throw "Clustering hyperparameters missing or invlaid";
            }
            const bandwidthRadius = panel.bandwidthRadius || 0;
            const deduplicationRadius = panel.deduplicationRadius || 0;
            const valueType = panel.valueType || "";
            const maxBubbleSize = panel.maxBubbleSize || 10;
            // initialize an empty array so that when socket.io emits messages in, it will store the data in the array
            ws.writeLine("@observable array = [];");
            // initialize a dictionary to store per-device value
            ws.writeLine("deviceDict = {};");
            // initialize the device transition dictionary
            ws.writeLine("oldDeviceDict = {};");
            // initialize mode variable
            ws.writeLine(`mode = '${mode}';`);
            // initialize clustering hyperparameters
            ws.writeLine(`bandwidthRadius = ${bandwidthRadius};`);
            ws.writeLine(`deduplicationRadius = ${deduplicationRadius};`);
            // initialize valueType variable
            ws.writeLine(`valueType = '${valueType}';`);
            // symbol size logic
            ws.writeLine("maxValue = 0;");
            ws.writeLine(`maxSize = ${maxBubbleSize};`);
            // initialize bubble factory
            ws.writeLine("@computed get bubble" + EchartAdaptor.bubble.toString().replace('function', ''));
            // switch bubble chart modes

            if (mode === 'pre-clustered') {
                ws.writeLine(__AddCentroids__);
            }
            // count mode logic
            else if (mode === 'count' || mode === 'average') {
                const historyLength = (panel.historyLength || 60) * 60 * 1000;
                const transitionPeriod = (panel.transitionPeriod || 0) * 1000;
                ws.writeLine(__AddDataForClustering__(transitionPeriod));

                // Copy mean shift code block
                fs.readFile('./utils/code-blocks/meanShift.js', 'utf8', (err, data) => {
                    if (err) throw err;
                    ws.writeLine(data);
                });

                // Copy history length handling code block
                fs.readFile('./utils/code-blocks/bubbleHistoryLengthInterval.js', 'utf-8', (err, template) => {
                    if (err) throw err;
                    const intervalCode = template.replace("60 * 60 * 1000", `${historyLength}`);
                    ws.writeLine(intervalCode);
                });

                // Copy transitioning devices handling code block
                fs.readFile('./utils/code-blocks/assignTransitioningDevices.js', 'utf-8', (err, data) => {
                    if (err) throw err;
                    ws.writeLine(data);
                });
            }
        } else if (panel.type == 'bin') {
            const mode = panel.mode;
            const mode_inputs = ["count", "average"];
            if (!mode) {
                throw "Please input a mode for bin chart.";
            } else if (!mode_inputs.includes(mode)) {
                throw "Please input a valid mode for bin chart. Ex: 'count', 'average'.";
            }


            const maxBinColor = panel.maxBinColor || 10;
            const numberOfBinsX = panel.numberOfBinsX;
            const numberOfBinsY = panel.numberOfBinsY;
            const binMethod = panel.binMethod;
            const binMethod_inputs = ["squareRoot", "scott", "freedmanDiaconis", "sturges"];
            if (binMethod != undefined && !binMethod_inputs.includes(binMethod)) {
                throw "Please input a valid method for bin chart or leave it out to use 'squareRoot' as default.";
            }

            if(mode === 'average') {
                const valueType = panel.valueType || "";
                // initialize valueType variable
                ws.writeLine(`\tvalueType = '${valueType}';`);
            }

            // initialize mode variable
            ws.writeLine(`\tmode = '${mode}';`);
            // initialize maxBinColor variable
            ws.writeLine(`\tmaxBinColor = ${maxBinColor};`);
            // initialize method variable
            ws.writeLine(`\tbinMethod = ${binMethod};`);
            // initialize numberOfBinsX variable
            ws.writeLine(`\tnumberOfBinsX = ${numberOfBinsX};`);
            // initialize numberOfBinsY variable
            ws.writeLine(`\tnumberOfBinsY = ${numberOfBinsY};`);

            ws.writeLine("\t@observable array = [];\n");
            ws.writeLine("\t@computed get bin" + EchartAdaptor.bin.toString().replace('function', ''));
            ws.writeLine(__AddGridPoints__);

            const historyLength = (panel.historyLength || 60) * 60 * 1000;

            // Copy history length handling code block
            fs.readFile('./utils/code-blocks/binHistoryLengthInterval.js', 'utf-8', (err, template) => {
                if (err) throw err;
                const intervalCode = template.replace("60 * 60 * 1000", `${historyLength}`);
                ws.writeLine(intervalCode);
            });
        }

        ws.writeLine(__ClassFooter(storeName));
    });
}

const __StoreFileDir = (pageDirectory,storeName) => {return pageDirectory+'/'+storeName+'.js'};
const __ClassName = (storeName) => {return "class "+storeName+"{"};
const __ClassFooter = (storeName) => {return "}\n\
var store = window.store = new " + storeName +";\n\
export default store;\n"
}
const __StoreFileDependencies__ = "import { autorun, observable, computed} from 'mobx';"
const __StoreFileDependenciesBubbleChart__ = "import echarts from 'echarts';"
const __StoreFileDependenciesBinChart__ = "import {computeBins2dHeatmap, computeBins2dHeatmapAverage} from '../lib/histogram/histogram.js';"
const __BasicFunctions__ = "\treset(){this.map=this.map.map(e=>{return 0})}\
changeValue(value,param){this.map[param]=value;}"
const __AddDataPoints__ = "\taddDataPoints (body){\n\
        for (let i = 0; i < body.gateIndex - this.array.length + 1; i++) {this.array.push([]);}\n\
        this.array[body.gateIndex].push([body.x,body.y])};\n\
    setArray(array,gateIndex){\n\
        for (let i = 0; i < body.gateIndex - this.array.length + 1; i++) {this.array.push([]);}\n\
        this.array[body.gateIndex]=array;\n\
    };"

const __AddCentroids__ = "addDataPointsArray (data){\
    this.array = data.map(centroid => [centroid.x, centroid.y, centroid.size, centroid.label]);\
};"

const __AddDataForClustering__ = (transitionPeriod) => "addDataPointsArray (data) {\n\
    const transitionPeriod = " + transitionPeriod + ";\n\
    const now = Date.now();\n\
    data.forEach((datum) => {\n\
        if (this.deviceDict[datum.deviceId] && transitionPeriod) {\n\
            this.oldDeviceDict[`${datum.deviceId}__${now}`] = this.deviceDict[datum.deviceId];\n\
            setTimeout(() => delete this.oldDeviceDict[`${datum.deviceId}__${now}`], transitionPeriod);\n\
        }\n\
        this.deviceDict[datum.deviceId] = [datum.x, datum.y, datum.deviceId, now, datum.value]\n\
    });\n\
    const points = Object.values(this.deviceDict);\n\
    const fitted = fit(points, this.bandwidthRadius, this.deduplicationRadius);\n\
    if(transitionPeriod) {\n\
        assignTransitioningDevices(fitted);\n\
    }\n\
    this.array = fitted[0].map(fitResults => {\n\
        let averageOrLength = fitResults.points.length;\n\
        if(this.mode === 'average') {\n\
            averageOrLength = fitResults.points.reduce((acc, curr) => acc + curr[4], 0) / fitResults.points.length;\n\
            if (averageOrLength > this.maxValue) this.maxValue = averageOrLength;\n\
        }\n\
        if (this.mode === 'count' && averageOrLength > this.maxValue) this.maxValue = averageOrLength;\n\
        return [fitResults.centroid[0], fitResults.centroid[1], averageOrLength]});\n\
};\n"

const __AddGridPoints__ = "\taddDataPointsArray(data) {\n\
        const arrayColumn = (arr, n) => arr.map(x => x[n]);\n\
        const now = Date.now();\n\
        let device_idx;\n\
        data.forEach((datum) => {\n\
            device_idx = arrayColumn(this.array, 2).indexOf(datum.deviceId)\n\
            if (device_idx > -1) {\n\
                this.array.splice(device_idx, 1,[datum.x, datum.y, datum.deviceId, now, datum.value]);\n\
            }\n\
            else{\n\
                this.array.push([datum.x, datum.y, datum.deviceId, now, datum.value]);\n\
            }\n\
        });\n\
    };"