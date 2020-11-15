import { BinaryTreeNode } from './base.mjs';

export class BinaryTree {
  static DEPTH_FIRST_ORDER = {
    PRE_ORDER: 0,
    IN_ORDER: 1,
    POST_ORDER: 2
  };

  /**
   *
   * @param {Array<number|null>} array
   * @returns {BinaryTreeNode}
   */
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

  static getDepth(root, value) {
    const depth = _getDepth(value, root);
    return typeof depth === 'number' ? depth : -1;
  }

  static getHeight(root, value) {
    const node = _findNode(value, this.root);
    return node ? _getHeight(node) : -1;
  }

  static getVerticalOrder(root) {
    if (!root) {
      return [];
    }

    const columnsMap = new Map();
    const nodes = []; // queue
    const columnNums = []; // queue
    const cRoot = 0;
    let minColumn = 0;

    columnsMap.set(cRoot, [
      root.value
    ]);
    if (root.left || root.right) {
      columnNums.push(cRoot);
      nodes.push(root.left, root.right);
    }

    while (nodes.length > 0) {
      const left = nodes.shift();
      const right = nodes.shift();
      const cParent = columnNums.shift();
      const cLeft = cParent - 1;
      const cRight = cParent + 1;

      if (left) {
        _handleNode(cLeft, left);
        if (cLeft < minColumn) {
          minColumn = cLeft;
        }
      }
      if (right) {
        _handleNode(cRight, right);
      }
    }

    return _output();

    function _handleNode(column, node) {
      if (!columnsMap.has(column)) {
        columnsMap.set(column, []);
      }
      columnsMap.get(column)
        .push(node.value);
      if (node.left || node.right) {
        columnNums.push(column);
        nodes.push(node.left, node.right);
      }
    }

    function _output() {
      const result = [];
      const maxColumn = columnsMap.size + minColumn - 1;
      for (let i = minColumn; i <= maxColumn; i++) {
        result.push(columnsMap.get(i));
      }
      return result;
    }
  }

  static serializeBreadthFirst(root) {
    const visited = [];
    const queue = [root];

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

  static serializeDepthFirst(root, order = BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER) {
    const result = [];

    _serializeDepthFirst(result, root, order);

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
