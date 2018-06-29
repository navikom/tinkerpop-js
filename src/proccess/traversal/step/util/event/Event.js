import { mixin, ArrayUtils } from '../../../../../util';

/**
 * A representation of some action that occurs on a {@link Graph} for a {@link Traversal}.
 *
 */
const Event = {}

/**
 * Represents an action where an {@link Edge} is added to the {@link Graph}.
 */
Event.EdgeAddedEvent = function(edge) {
  this.edge = edge;

};

Event.EdgeAddedEvent.prototype = {
  constructor: Event.EdgeAddedEvent,

  fireEvent(eventListeners) {
    while (eventListeners.hasNext()) {
      eventListeners.next().edgeAdded(this.edge);
    }
  }
};

/**
 * A base class for {@link Property} mutation events.
 */
Event.ElementPropertyEvent = function(element, oldValue, newValue, vertexPropertyKeyValues) {
  this.element = element;
  this.oldValue = oldValue;
  this.newValue = newValue;
  this.vertexPropertyKeyValues = vertexPropertyKeyValues;

};

Event.ElementPropertyEvent.prototype = {
  constructor: Event.ElementPropertyEvent,

  fireEvent(eventListeners) {
    while (eventListeners.hasNext()) {
      this.fire(eventListeners.next(), this.element, this.oldValue, this.newValue, this.vertexPropertyKeyValues);
    }
  }
};

/**
 * A base class for {@link Property} mutation events.
 */
Event.ElementPropertyChangedEvent = function(element, oldValue, newValue, ...vertexPropertyKeyValues) {
  Event.ElementPropertyEvent.call(this, element, oldValue, newValue, ArrayUtils.checkArray(vertexPropertyKeyValues));

};

Event.ElementPropertyChangedEvent.prototype = {
  constructor: Event.ElementPropertyChangedEvent,

};

mixin(Event.ElementPropertyChangedEvent, Event.ElementPropertyEvent.prototype);

/**
 * Represents an action where an {@link Edge} {@link Property} is added/modified.  If the {@link Property} is
 * new then the {@code oldValue} will be {@code null}.
 */
Event.EdgePropertyChangedEvent = function(element, oldValue, newValue, ...vertexPropertyKeyValues) {
  Event.ElementPropertyChangedEvent.call(this, element, oldValue, newValue, ArrayUtils.checkArray(vertexPropertyKeyValues));

};

Event.EdgePropertyChangedEvent.prototype = {
  constructor: Event.EdgePropertyChangedEvent,
  fire(listener, element, oldValue, newValue, ...vertexPropertyKeyValues) {
    listener.edgePropertyChanged(element, oldValue, newValue);
  }
};

mixin(Event.EdgePropertyChangedEvent, Event.ElementPropertyChangedEvent.prototype);

/**
 * Represents an action where an {@link Edge} {@link Property} is removed.
 */
Event.EdgePropertyRemovedEvent = function(element, removed) {
  Event.ElementPropertyEvent.call(this, element, removed, null);

};

Event.EdgePropertyRemovedEvent.prototype = {
  constructor: Event.EdgePropertyRemovedEvent,
  fire(listener, element, oldValue, newValue, ...vertexPropertyKeyValues) {
    listener.edgePropertyRemoved(element, oldValue);
  }
};

mixin(Event.EdgePropertyRemovedEvent, Event.ElementPropertyEvent.prototype);

/**
 * Represents an action where an {@link Edge} is removed from the {@link Graph}.
 */
Event.EdgeRemovedEvent = function(edge) {
  this.edge = edge;

};

Event.EdgeRemovedEvent.prototype = {
  constructor: Event.EdgeRemovedEvent,

  fireEvent(eventListeners) {
    while (eventListeners.hasNext()) {
      eventListeners.next().edgeRemoved(this.edge);
    }
  }
};

/**
 * Represents an action where a {@link Vertex} is removed from the {@link Graph}.
 */
Event.VertexAddedEvent = function(vertex) {
  this.vertex = vertex;

};

Event.VertexAddedEvent.prototype = {
  constructor: Event.VertexAddedEvent,

  fireEvent(eventListeners) {
    while (eventListeners.hasNext()) {
      eventListeners.next().edgeRemoved(this.vertex);
    }
  }
};

/**
 * Represents an action where a {@link VertexProperty} is modified on a {@link Vertex}.
 */
Event.VertexPropertyChangedEvent = function(element, oldValue, newValue, ...vertexPropertyKeyValues) {
  Event.ElementPropertyChangedEvent.call(this, element, oldValue, newValue, ArrayUtils.checkArray(vertexPropertyKeyValues));

};

Event.VertexPropertyChangedEvent.prototype = {
  constructor: Event.VertexPropertyChangedEvent,
  fire(listener, element, oldValue, newValue, ...vertexPropertyKeyValues) {
    listener.vertexPropertyChanged(element, oldValue, newValue);
  }
};

mixin(Event.VertexPropertyChangedEvent, Event.ElementPropertyChangedEvent.prototype);

/**
 * Represents an action where a {@link Property} is modified on a {@link VertexProperty}.
 */
Event.VertexPropertyPropertyChangedEvent = function(element, oldValue, newValue) {
  Event.ElementPropertyChangedEvent.call(this, element, oldValue, newValue);

};

Event.VertexPropertyPropertyChangedEvent.prototype = {
  constructor: Event.VertexPropertyPropertyChangedEvent,
  fire(listener, element, oldValue, newValue, ...vertexPropertyKeyValues) {
    listener.vertexPropertyPropertyChanged(element, oldValue, newValue);
  }
};

mixin(Event.VertexPropertyPropertyChangedEvent, Event.ElementPropertyChangedEvent.prototype);

/**
 * Represents an action where a {@link Property} is removed from a {@link VertexProperty}.
 */
Event.VertexPropertyPropertyRemovedEvent = function(element, removed) {
  Event.ElementPropertyEvent.call(this, element, removed);

};

Event.VertexPropertyPropertyRemovedEvent.prototype = {
  constructor: Event.VertexPropertyPropertyRemovedEvent,
  fire(listener, element, oldValue, newValue, ...vertexPropertyKeyValues) {
    listener.vertexPropertyPropertyRemoved(element, oldValue);
  }
};

mixin(Event.VertexPropertyPropertyRemovedEvent, Event.ElementPropertyEvent.prototype);

/**
 * Represents an action where a {@link Property} is removed from a {@link Vertex}.
 */
Event.VertexPropertyRemovedEvent = function(vertexProperty) {
  this.vertexProperty = vertexProperty;

};

Event.VertexPropertyRemovedEvent.prototype = {
  constructor: Event.VertexPropertyRemovedEvent,

  fireEvent(eventListeners) {
    while (eventListeners.hasNext()) {
      eventListeners.next().vertexPropertyRemoved(this.vertexProperty);
    }
  }
};

/**
 * Represents an action where a {@link Vertex} is removed from the {@link Graph}.
 */
Event.VertexRemovedEvent = function(vertex) {
  this.vertex = vertex;

};

Event.VertexRemovedEvent.prototype = {
  constructor: Event.VertexRemovedEvent,

  fireEvent(eventListeners) {
    while (eventListeners.hasNext()) {
      eventListeners.next().vertexRemoved(this.vertex);
    }
  }
};

export default Event;