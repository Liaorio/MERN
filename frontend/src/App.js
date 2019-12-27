import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./store";

import Customers from "./container/Customers";

const store = configureStore();

class App extends Component {

	componentDidMount() {
		
	}

  	render() {
		return (
			<Provider store={store}>
				<div className="App">
					<Customers/>
				</div>
			</Provider>
		);
  	}
}

export default App;