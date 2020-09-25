//Store File for GraphStore
import {autorun, observable, computed} from 'mobx';
import echarts from "echarts";

class GraphStore {
    reset() {
        this.map = this.map.map(e => {
            return 0
        })
    }

    changeValue(value, param) {
        this.map[param] = value;
    }

    @observable array = [];

    @computed get graph() {

        const data = [];
        this.array.forEach(element => data.push(element));


        const option = {
            backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                offset: 0,
                color: '#f7f8fa'
            }, {
                offset: 1,
                color: '#cdd0d5'
            }]),
            title: {
                text: 'Life Expectancy and GDP in Various Countries in 2015'
            },
            legend: {
                right: 10,
                data: '2015'
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
            series: {
                name: '2015',
                data: data,
                type: 'scatter',
                symbolSize: function (data) {
                    return Math.sqrt(data[2]) / 5e2;
                },
                emphasis: {
                    label: {
                        show: true,
                        formatter: function (param) {
                            return param.data[3];
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
            }
        };

        return option;
    }

    addDataPoints(gdp, age, number, country, year) {
        this.array.push([gdp, age, number, country, year])
    };

    setArray(array) {
        this.array = array;
    };
}

var store = window.store = new GraphStore;
export default store