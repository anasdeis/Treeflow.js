// Root File for Page Dashboard
import React from 'react';
import {inject, observer} from 'mobx-react';
import {Panel, FormSet, NavBar, FixTable} from 'Components';
import io from 'socket.io-client';
import Echarts from 'Echarts/Echarts';

@inject("FormsetStore", "GraphStore")
@observer
export default class Dashboard extends React.Component {
    componentDidMount() {
        if (!this.socket) {
            this.socket = io.connect('/');
            this.socket.on('newDataPoint', function (data) {
                if (data.body.id === 0) this.props.GraphStore.addDataPoints(data.body.gdp, data.body.age, data.body.number, data.body.country, data.body.year)
            }.bind(this));
            this.socket.on('setArray', function (data) {
                if (data.body.id === 0) this.props.GraphStore.setArray(data.array)
            }.bind(this));
        }
    }

    render() {
        const GraphStore_graph = this.props.GraphStore.graph;
        return <div><Panel title="Graph"> <Echarts style={{width: '100%', height: '365px'}} option={GraphStore_graph}/>
        </Panel>
        </div>
    }
};