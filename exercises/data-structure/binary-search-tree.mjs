export const TREE_DIRECTION = {
  BREADTH: 0,
  DEPTH: 1
};

export const DEPTH_FIRST_ORDER = {
  IN_ORDER: 0,
  POST_ORDER: 1,
  PRE_ORDER: 2
}

export class TreeNode {
  constructor(value, left, right) {
    this.value = value;
    this.left = left || null;
    this.right = right || null;
  }
}

export class BinarySearchTree {
  constructor(root) {
    this.root = root || null;
  }

  insertInOrder(value, allowDuplicate) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
    } else {
      this.addSide(this.root, newNode, allowDuplicate);
    }

    return this;
  }

  searchBreadthFirst(target) {
    const queue = [this.root];
    let current;

    while (queue.length) {
      current = queue.shift();
      if (target === current.value) {
        return current;
      } else {
        if (current.left) {
          queue.push(current.left);
        }
        if (current.right) {
          queue.push(current.right);
        }
      }
    }

    return null;
  }

  searchDepthFirst(target, depthFirstOrder) {
    return this.traverseFor(target, this.root, depthFirstOrder || DEPTH_FIRST_ORDER.IN_ORDER) || null;
  }



  serializeToArray(treeDirection, depthFirstOrder) {
    switch (treeDirection) {
      case TREE_DIRECTION.BREADTH:
        return this.serializeBreadth();
      case TREE_DIRECTION.DEPTH:
        return this.serializeDepth(depthFirstOrder || DEPTH_FIRST_ORDER.IN_ORDER);
      default:
        return [];
    }
  }

  /**
   * @private
   * @param currentNode
   * @param newNode
   * @param allowDuplicate
   * @returns {BinarySearchTree}
   */
  addSide(currentNode, newNode, allowDuplicate) {
    if (allowDuplicate || currentNode.value !== newNode.value) {
      const side = newNode.value <= currentNode.value ? 'left' : 'right';
      if (!currentNode[side]) {
        currentNode[side] = newNode;
        return this;
      } else {
        return this.addSide(currentNode[side], newNode);
      }
    } else {
      return this;
    }
  }

  /**
   * @private
   * @returns {Array}
   */
  serializeBreadth() {
    const queue = [this.root];
    const visited = [];
    let current;

    do {
      current = queue.shift();
      visited.push(current.value);
      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    } while (queue.length);

    return visited;
  }

  /**
   * @private
   * @returns {Array}
   */
  serializeDepth(depthFirstOrder) {
    const visited = [];
    this.traverse(visited, this.root, depthFirstOrder);
    return visited;
  }

  /**
   * @private
   */
  traverse(visited, node, depthFirstOrder) {
    if (depthFirstOrder === DEPTH_FIRST_ORDER.PRE_ORDER) {
      visited.push(node.value);
    }
    if (node.left) {
      this.traverse(visited, node.left, depthFirstOrder);
    }
    if (depthFirstOrder === DEPTH_FIRST_ORDER.IN_ORDER) {
      visited.push(node.value);
    }
    if (node.right) {
      this.traverse(visited, node.right, depthFirstOrder);
    }
    if (depthFirstOrder === DEPTH_FIRST_ORDER.POST_ORDER) {
      visited.push(node.value);
    }
  }

  /**
   * @private
   * @param target
   * @param node
   * @param depthFirstOrder
   * @returns {TreeNode|undefined}
   */
  traverseFor(target, node, depthFirstOrder) {
    const currentResult = target === node.value && node;
    const leftResult = node.left && this.traverseFor(target, node.left, depthFirstOrder);
    const rightResult = node.right && this.traverseFor(target, node.right, depthFirstOrder);
    let results = [];

    switch (depthFirstOrder) {
      case DEPTH_FIRST_ORDER.PRE_ORDER:
        results = [currentResult, leftResult, rightResult];
        break;
      case DEPTH_FIRST_ORDER.IN_ORDER:
        results = [leftResult, currentResult, rightResult];
        break;
      case DEPTH_FIRST_ORDER.POST_ORDER:
        results = [leftResult, rightResult, currentResult];
        break;
    }

    return results.filter(value => value)[0];
  }
}
