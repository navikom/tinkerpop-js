import { mixin, ArrayUtils, List } from '../../../../util';
import { FilterStep } from './FilterStep';
import Element from '../../../../structure/Element';
import Property from '../../../../structure/Property';
import VertexProperty from '../../../../structure/VertexProperty';
import { DetachedFactory } from '../../../../structure/util/detached';
import Event from '../util/event/Event';
import ListCallbackRegistry from '../util/event/ListCallbackRegistry';

/**
 * DropStep
 * @param traversal
 * @constructor
 */
function DropStep(traversal) {
	FilterStep.call(this, traversal);
}

DropStep.prototype = {
	constructor: DropStep,
	filter(traverser) {
		let s = traverser.get();
		if (Object.values(Element.TYPES).includes(s.type)) {
			const toRemove = s;
			if (this.callbackRegistry && this.callbackRegistry !== null) {
				let removeEvent;
				if (s.type === Element.TYPES.VERTEX)
					removeEvent = new Event.VertexRemovedEvent(DetachedFactory.detach(s, true));
				else if (s.type === Element.TYPES.EDGE)
					removeEvent = new Event.EdgeRemovedEvent(DetachedFactory.detach(s, true));
				else if (s.type === VertexProperty.TYPE)
					removeEvent = new Event.VertexPropertyRemovedEvent(DetachedFactory.detach(s, true));
				else
					throw ("The incoming object is not removable: " + s.type);

				this.callbackRegistry.getCallbacks().forEach(c => c.accept(removeEvent));
			}
			toRemove.remove();
		} else if (s.type === Property.TYPE) {
			const toRemove = s;
			if (this.callbackRegistry && this.callbackRegistry !== null) {
				let removeEvent;
				if (toRemove.element().type === Element.TYPES.EDGE)
					removeEvent = new Event.EdgePropertyRemovedEvent(toRemove.element(), DetachedFactory.detach(toRemove));
				else if (toRemove.element().type === VertexProperty.TYPE)
					removeEvent = new Event.VertexPropertyPropertyRemovedEvent(toRemove.element(), DetachedFactory.detach(toRemove));
				else
					throw ("The incoming object is not removable: " + s.type);

				this.callbackRegistry.getCallbacks().forEach(c => c.accept(removeEvent));
			}
			toRemove.remove();
		} else
			throw ("The incoming object is not removable: " + s.type);
		return false;
	},

	getMutatingCallbackRegistry() {
		if (null === this.callbackRegistry) this.callbackRegistry = new ListCallbackRegistry();
		return this.callbackRegistry;
	}

};

mixin(DropStep, FilterStep.prototype);

export { DropStep };
