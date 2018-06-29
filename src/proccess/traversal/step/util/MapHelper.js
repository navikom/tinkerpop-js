import { List } from '../../../../util';
export default class MapHelper {

	static incr(map, key, value) {
		if (map.getByIndex(0) instanceof List) {
			map.compute(key, (k, v) => {
				if (null === v || undefined === v) v = new List();
				v.add(value);
				return v;
			});
		} else {
			map.put(key, value + map.getOrDefault(key, 0));
		}
	}
}
