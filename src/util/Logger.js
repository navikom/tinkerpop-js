let INSTANCE = null;

const Logger = (() => {
	let _enabled = false;
	return class {
		static get enabled(){
			return _enabled;
		}
		static set enabled(value){
			_enabled = value;
		}
		static init() {
			return new LogBuilder();
		}
	};
})();

class LogBuilder{

	constructor() {
		this._startTime = +new Date;
		this._stopTime = 0;
		this._started = false;
	}

	start() {
		this._startTime = +new Date;
		this._started = true;
	}

	stop(callback) {
		this._stopTime = (+new Date - this._startTime) / 1000;
		callback();
		this._started = false;
	}

	info(message) {
		if (Logger.enabled) {
			this.stop(() => {
				const timeText = this._started ? ` time: ${this._stopTime}s` : '';
				console.info(`%c${message}${timeText}`, 'color:blue');
			});
		}
	}
}

export { Logger }