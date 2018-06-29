import { mixin, ObjectMap, List } from '../../../../util';

/**
 * Tree
 * @constructor
 */
class Tree extends ObjectMap {
	constructor(array) {
		super();
		if (array && array instanceof Array) {
			array.map((child) => this.put(child, new Tree()));
		}
	}

	getTreesAtDepth(depth) {
		let currentDepth = new List([this]);
		for (let i = 0; i < depth; i++) {
			if (i === depth - 1) {
				return currentDepth;
			} else {
				const temp = new List();
				for (let j = 0; j < currentDepth.size(); j++) {
					temp.addAll(currentDepth.get(j).values());
				}
				currentDepth = temp;
			}
		}
		return new List();
	}

	getObjectsAtDepth(depth) {
		const list = new List();
		const tree = this.getTreesAtDepth(depth);
		for (let i = 0; i < tree.size(); i++) {
			list.addAll(tree.get(i).keys());
		}
		return list;
	}

	getLeafTrees() {
		const leaves = new List();
		let currentDepth = new List(this);
		let allLeaves = false;
		while (!allLeaves) {
			allLeaves = true;
			const temp = new List();
			for (let i = 0; i < currentDepth.size(); i++) {
				const t = currentDepth.get(i);
				if (t.isLeaf()) {
					const it = t.keys().iterator();
					throw ('Need to choose Tree::getLeafTrees');
					while (it.hasNext()) {
						leaves.add(new Tree(t.get(it.next())));
					}
				} else {
					allLeaves = false;
					temp.addAll(t.values());
				}
			}
			currentDepth = temp;

		}
		return leaves;
	}

	getLeafObjects() {
		const leaves = new List();
		const leafTrees = this.getLeafTrees();
		for (let i = 0; leafTrees.size(); i++) {
			throw ('Need to choose Tree::getLeafObjects');
			leaves.addAll(leafTrees.get(i).values());
		}
		return leaves;
	}

	isLeaf() {
		const values = this.values();
		return values.iterator().next().isEmpty();
	}

	addTree(tree) {
		tree.forEach((k, v) => {
			if (this.containsKey(k)) {
				this.get(k).addTree(v);
			} else {
				this.put(k, v);
			}
		});
	}

	splitParents() {
		if (this.size() === 1) {
			return new List([this]);
		} else {
			const parents = new List();
			this.forEach((k, v) => {
				const parentTree = new Tree();
				parentTree.put(k, v);
				parents.add(parentTree);
			});
			return parents;
		}
	}
}
;

export default Tree;
