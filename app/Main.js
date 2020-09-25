// Root File for The Tree Flow app
import React from 'react';// Import boilerplates
import ReactDOM from 'react-dom';import createBrowserHistory from 'history/createBrowserHistory';import { Provider } from 'mobx-react';import { BrowserRouter as Router, Route , hashHistory} from 'react-router-dom';import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';import {NavBar} from 'Components';const app = document.getElementById('app');// Import Mobx Stores :
import FormsetStore from './DataPanel/FormsetStore';;import GraphStore from './Dashboard/GraphStore';
import DataPanel from './DataPanel';import Dashboard from './Dashboard'
const browserHistory = createBrowserHistory();const RoutingStore = new RouterStore();
var stores = {RoutingStore,FormsetStore,GraphStore};
var routes = [{dispLabel: 'DataPanel', route:'/data-panel'},,{dispLabel: 'Dashboard', route:'/dashboard'},];    ReactDOM.render(    <Provider {...stores}><Router history={browserHistory}><div><NavBar routes={routes}/><Route path='/data-panel' component={DataPanel}/>
<Route path='/dashboard' component={Dashboard}/></div></Router></Provider>, app)