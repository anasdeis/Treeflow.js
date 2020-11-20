// dataPoints/logger is supposed to be a [[][]] : array of 2d vectors
// Math, Some Math, More Math?

module.exports = {
    // Adaptor for formulating data points to a pie chart
    // Good for ratio comparison and load balancing meters
    pie: function(){
        var devices = this.array.toJSON().map(device => (device.toJSON()));
        var data = [];
        devices.forEach(function (e) {
            data.push(e.map(dataPoints => dataPoints.toJSON()))
        });

        var option = {
            tooltip:{
                trigger: 'item',
                formatter: "{a} <br/>{b}:{c}({d}%)"
            },
            legend:{
                orient: 'vertical',
                x:'left',
                data:data.map((e,idx)=>{return 'Device-'+idx})
            },
            series:[
                {
                    name:'Device Distribution',
                    type:'pie',
                    radius:['50%','70%'],
                    avoidLabelOverlap:false,
                    label:{
                        normal:{
                            show:false,
                            position:'center'
                        },
                        emphasis:{
                            show:true,
                            textStyle:{
                                fontSize:'30',
                                fontWeight:'bold'
                            }
                        }
                    },
                    labelLine:{
                        normal:{
                            show:false
                        }
                    },
                    data: data.map((e,idx)=>{
                        var obj = {};
                        obj.value = e.length;
                        obj.name = 'Device-'+idx;
                        return obj;
                    })
                }
            ]
        };
        return option;
    },
    // Adaptor for formulating data points to a graph
    // Good for seeing the trend fo data flow
    graph: function(){
        var devices = this.array.toJSON().map(device => (device.toJSON()));
        var data = [];
        devices.forEach(function (e) {
            data.push(e.map(dataPoints => dataPoints.toJSON()))
        });
        var option={
            title:{
                text: 'Graph Chart'
            },
            tooltip: {
                trigger: 'none',
                axisPointer:{
                    type:'cross'
                }
            },
            dataZoom: {
                show: true,
                start : 70
            },
            legend:{
                data: data.map((e,idx)=>{return 'Device-'+idx;})
            },
            grid:{
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel:true
            },
            xAxis:{
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale:true
            },
            yAxis:[
                {
                    type:'value'
                }
            ],
            series: data.map((e,idx)=>{
                var obj = {};
                obj.name = 'Device-'+idx;
                obj.type = 'line';
                obj.smooth = false;
                obj.data = e;
                return obj;
            })
        };
        return option;
    },
    // Adaptor for formulating data points to a graph
    // Good for seeing the trend fo data flow
    stackedGraph: function(){
        var devices = this.array.toJSON().map(device => (device.toJSON()));
        var data = [];
        devices.forEach(function (e) {
            data.push(e.map(dataPoints => dataPoints.toJSON()))
        });
        var option={
            title:{
                text: 'Graph Chart'
            },
            tooltip: {
                trigger: 'none',
                axisPointer:{
                    type:'cross'
                }
            },
            dataZoom: {
                show: true,
                start : 70
            },
            legend:{
                data: data.map((e,idx)=>{return 'Device-'+idx;})
            },
            grid:{
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel:true
            },
            xAxis:{
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale:true
            },
            yAxis:[
                {
                    type:'value'
                }
            ],
            series: data.map((e,idx)=>{
                var obj = {};
                obj.name = 'Device-'+idx;
                obj.type = 'line';
                obj.smooth = false;
                obj.data = e;
                obj.itemStyle= {normal: {areaStyle: {type: 'default'}}};
                return obj;
            })
        };
        return option;
    },
    // Adaptor for formulating data points to a scatter
    // Good for peeking the exact data point values
    scatter: function () {

        var devices = this.array.toJSON().map(device => (device.toJSON()));
        var data = [];
        devices.forEach(function (e) {
            data.push(e.map(dataPoints => dataPoints.toJSON()))
        });

        var option = {
        title: {
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer:{
                type: 'cross'
            }
        },
        legend:{
            data: data.map((e,idx)=>{return 'Device-'+idx;})
        },
        dataZoom: {
            show: true,
            start : 70
        },
        xAxis:{
            type: 'value',
            splitLine:{
                lineStyle:{
                    type: 'dashed'
                }
            },
        },
        yAxis:{
            type:'value',
            min:1.5,
            splitLine:{
                lineStyle:{
                    type:'dashed'
                }
            },
            scale:true
        },
        series: data.map((e,idx)=>{
            var obj = {};
            obj.name = 'Device-'+idx;
            obj.type = 'scatter';
            obj.label = {
                emphasis:{
                show: true,
                    position: 'left'
                }
            }
            obj.data = e;
            return obj;})
        };
        return option;
    },

    bubble: function () {

        const data = [];
        const that = this;
        this.array.forEach(element => data.push(element));
        data.sort((firstEl, secondEl) =>{
            const distToZero = (x, y) => Math.sqrt(x*x + y*y);
            return distToZero(firstEl[0], firstEl[1]) - distToZero(secondEl[0] - secondEl[1]);
        });

        const option = {
            title: {
                text: 'Bubble Chart'
            },
            xAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true
            },
            series: [{
                name: 'Series 1',
                data: data,
                type: 'scatter',
                symbolSize: function (data) {
                    return (data[2] / that.maxValue) * that.maxSize;
                },
                emphasis: {
                    label: {
                        show: true,
                        formatter: function (param) {
                            return `${param.data[2]} devices contributing`;
                        },
                        position: 'top'
                    }
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                        offset: 0,
                        color: 'rgb(251, 118, 123)'
                    }, {
                        offset: 1,
                        color: 'rgb(204, 46, 72)'
                    }])
                }
            }]
        };
        return option;
    }
};