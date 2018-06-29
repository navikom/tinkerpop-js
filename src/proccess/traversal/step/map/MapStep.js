import AbstractStep from '../util/AbstractStep';

/**
 * MapStep
 * @param traversal
 * @constructor
 */
function MapStep(traversal) {
	AbstractStep.call(this, traversal);
}

MapStep.prototype = Object.create(AbstractStep.prototype);
MapStep.prototype.constructor = MapStep;
MapStep.prototype.processNextStart = function() {
	const traverser = this.starts.next();
	//console.log('MapStep', this, this.starts.traverserSet.size(), traverser);
	return traverser.split(this.map(traverser), this);
};

export { MapStep };
