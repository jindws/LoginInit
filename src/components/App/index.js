import React, {Component,Fragment} from 'react';
// import createBrowserHistory from 'history/createBrowserHistory';
import {inject, observer, Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
// import {Router} from 'react-router-dom';
// import Route from '../Route';
import Stores from '../../stores';
import {hot} from 'react-hot-loader'
import Translate from '../Translate';
// import ForgetPassword from '../ForgetPassword';

// const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
// const history = syncHistoryWithStore(browserHistory, routingStore);
const stores = {
	...Stores,
	routing: routingStore
};


import Auth from '../Auth';
@inject('routing','UserStore', 'TextStore')
@observer
class Main extends Component{
	
	render(){
		const {routing, UserStore,TextStore} = this.props;
		const {push} = routing;
		return <Auth {...this.props} UserStore={UserStore} TextStore={TextStore}
					 push={push}/>
	}
}

class App extends Component {
	constructor(props) {
		super(props);
	}
	
	Show(){
		const {show} = this.props;
		if(show){
			return <Fragment>
					<Main {...this.props}/>
					<Translate/>
				</Fragment>
		}
		return <div/>
	}
	
	render() {
		return (
			<Provider {...stores}>
				{this.Show()}
			</Provider>
		);
	}
}

export default hot(module)(App)
