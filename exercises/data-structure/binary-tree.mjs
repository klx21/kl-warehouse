import { BinaryTreeNode } from './base';

export class BinaryTree {
  static DEPTH_FIRST_ORDER = {
    PRE_ORDER: 0,
    IN_ORDER: 1,
    POST_ORDER: 2
  };

  static deserializeBreadthFirst(array) {
    if (array && array.length > 0 && array[0] !== null) {
      const root = new BinaryTreeNode(array.shift());
      const cache = [root];

      while (array.length > 0) {
        const leftValue = array.shift();
        const rightValue = array.shift();
        const leftNode = typeof leftValue !== 'undefined' && leftValue !== null ? new BinaryTreeNode(leftValue) : null;
        const rightNode = typeof rightValue !== 'undefined' && rightValue !== null ? new BinaryTreeNode(rightValue) : null;
        const parent = cache.shift();

        parent.left = leftNode;
        parent.right = rightNode;
        if (leftValue !== null) {
          cache.push(leftNode);
        }
        if (rightValue !== null) {
          cache.push(rightNode);
        }
      }

      return root;
    } else {
      return null;
    }
  }

  constructor(root) {
    this.root = root instanceof BinaryTreeNode ? root : null;
    this.left = this.right = null;
  }

  getDepth(value) {
    const depth = _getDepth(value, this.root);

    return typeof depth === 'number' ? depth : -1;
  }

  getHeight(value) {
    const node = _findNode(value, this.root);

    return node ? _getHeight(node) : -1;
  }

  serializeBreadthFirst() {
    const visited = [];
    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        visited.push(node.value);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        visited.push(null);
      }
    }

    // remove trailing nulls
    while (visited.length > 0) {
      if (visited[visited.length - 1] === null) {
        visited.pop();
      } else {
        break;
      }
    }

    return visited;
  }

  serializeDepthFirst(order = BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER) {
    const result = [];

    _serializeDepthFirst(result, this.root, order);

    while (result.length > 0) {
      if (result[result.length - 1] === null) {
        result.pop();
      } else {
        break;
      }
    }

    return result;
  }
}

function _findNode(value, node) {
  if (node) {
    if (value === node.value) {
      return node;
    }
    return _findNode(value, node.left) || _findNode(value, node.right);
  }
}

function _getDepth(value, node) {
  if (node) {
    if (value === node.value) {
      return 0;
    } else {
      const left = _getDepth(value, node.left);
      const right = _getDepth(value, node.right);

      if (typeof left === 'number') {
        return left + 1;
      }
      if (typeof right === 'number') {
        return right + 1;
      }
    }
  }
}

function _getHeight(node) {
  if (!node) {
    return -1;
  }
  const left = _getHeight(node.left);
  const right = _getHeight(node.right);
  return Math.max(left, right) + 1;
}

function _serializeDepthFirst(visited, node, order) {
  if (order === BinaryTree.DEPTH_FIRST_ORDER.PRE_ORDER) {
    visited.push(node ? node.value : null);
  }
  if (node) {
    _serializeDepthFirst(visited, node.left, order);
  }
  if (order === BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER) {
    visited.push(node ? node.value : null);
  }
  if (node) {
    _serializeDepthFirst(visited, node.right, order);
  }
  if (order === BinaryTree.DEPTH_FIRST_ORDER.POST_ORDER) {
    visited.push(node ? node.value : null);
  }
}
