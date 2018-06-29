import React, { Component } from 'react';

import MyWorker from 'worker-loader!./work.js';

class App extends Component {
	componentWillMount() {
		this.worker = new MyWorker();
	}
	render() {
		this.worker.onmessage = (e) => {
			this.setState({
				[e.data.key]: e.data.object
			});
		};
		return (
			<div className="App">
			<div className="App-header">
			<h2>Welcome to React</h2>
		</div>
			<p className="App-intro">
				{this.state.someQueryName1} <br />
				{this.state.someQueryName2}
				<button onClick={() => this.worker.postMessage({ key: 'someQueryName1', args: [] })} > Up </button>
				<button onClick={() => this.worker.postMessage({ key: 'someQueryName2', args: [] })} > Down </button>
			</p>
		</div>
	);
	}
}

export default App;