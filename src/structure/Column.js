import { v4 } from 'uuid';
import { Map, List } from '../util';
import Path from '../proccess/traversal/Path';

const Column = {
	keys: {
		apply: (object) => {
			if (object instanceof Map)
				return object.getKeys();
			else if (object instanceof Path)
				return new List(object.labels());
			else
			throw ("The provided object does not have accessible keys: " + object.constructor.name);
		}
	},
	values: {
		apply: (object) => {
			if (object instanceof Map)
				return object.values();
			else if (object instanceof Path)
				return new List(object.objects());
			else
			throw ("The provided object does not have accessible keys: " + object.constructor.name);
		}
	}
};

Column.has = (value) => [Column.keys, Column.values].indexOf(value) > -1;

const keys = Column.keys;
const values = Column.values;

export default Column;
export { Column, keys, values }