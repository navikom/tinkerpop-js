export default class Steps {

	constructor(Step, Count, Traversers, Time, Dur) {
		this.Step = Step || "";
		this.Count = Count || "";
		this.Traversers = Traversers || "";
		this.Time = Time === undefined ? 0 : Time;
		this.Duration = Dur || "";
	}

	setStep(step) {
		this.Step = step;
	}

	setCount(count) {
		this.Count = count;
	}

	setTraversers(traversers) {
		this.Traversers = traversers;
	}

	setTime(time) {
		this.Time = time;
	}

	setDur(dur) {
		this.Duration = dur;
	}
}