import { BinaryTreeNode, LinkedListNode, DoublyLinkedListNode } from './base.mjs';

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
      const queue = [root];

      while (array.length > 0) {
        const leftValue = array.shift();
        const rightValue = array.shift();
        const leftNode = typeof leftValue !== 'undefined' && leftValue !== null ? new BinaryTreeNode(leftValue) : null;
        const rightNode = typeof rightValue !== 'undefined' && rightValue !== null ? new BinaryTreeNode(rightValue) : null;
        const parent = queue.shift();

        parent.left = leftNode;
        parent.right = rightNode;
        if (leftValue !== null) {
          queue.push(leftNode);
        }
        if (rightValue !== null) {
          queue.push(rightNode);
        }
      }

      return root;
    } else {
      return null;
    }
  }

  /**
   *
   * @param {BinaryTreeNode} root
   * @param {BinaryTreeNode} p
   * @param {BinaryTreeNode} q
   */
  static findLowestCommonAncestor(root, p, q) {
    const queue = [root];
    const childParentMap = new Map();
    const pPath = new Map();
    let node;

    childParentMap.set(root, false);

    while (queue.length > 0) {
      const node = queue.shift();

      if (node.left) {
        childParentMap.set(node.left.value, node);
        queue.push(node.left);
      }
      if (node.right) {
        childParentMap.set(node.right.value, node);
        queue.push(node.right);
      }
    }

    node = p;
    do {
      pPath.set(node, true);
      node = childParentMap.get(node.value);
    } while (node);

    node = q;
    while (node) {
      if (pPath.has(node)) {
        return node;
      }
      node = childParentMap.get(node.value);
    }

    return null;
  }

  static getDepth(root, value) {
    if (!root) {
      return 0;
    }

    const depth = _getDepth(value, root);
    return typeof depth === 'number' ? depth : -1;
  }

  static getHeight(root, value) {
    if (!root) {
      return 0;
    }

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

  static serializeBreadthFirst(root, bCompact = false) {
    if (!root) {
      return [];
    }

    const visited = [];
    const queue = [root];

    while (queue.length > 0) {
      const node = queue.shift();

      if (node) {
        visited.push(node.value);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        if (!bCompact) {
          visited.push(null);
        }
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

  static serializeDepthFirst(root, order = BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER, bCompact = false) {
    if (!root) {
      return [];
    }

    const result = [];

    _serializeDepthFirst(result, root, order, bCompact);

    while (result.length > 0) {
      if (result[result.length - 1] === null) {
        result.pop();
      } else {
        break;
      }
    }

    return result;
  }

  static toLinkedList(root) {
    if (!root) {
      return null;
    }

    const stack = [root];
    let node;
    let head;
    let current;

    while (node || stack.length > 0) {
      if (!node) {
        node = stack.pop();
      }

      const newNode = new LinkedListNode(node.value);

      if (!head) {
        head = newNode;
        current = newNode;
      } else {
        current.next = newNode;
        current = newNode;
      }

      if (node.right) {
        stack.push(node.right);
      }

      node = node.left;
    }

    return head;
  }

  static toRightSideView(root) {
    if (!root) {
      return [];
    }

    const result = [];
    const queue = [[root]];

    while (queue.length > 0) {
      const nodes = queue.shift();
      const row = nodes.reduce((accu, curr) => {
        if (curr.left) {
          accu.push(curr.left);
        }
        if (curr.right) {
          accu.push(curr.right);
        }
        return accu;
      }, []);

      if (row.length > 0) {
        queue.push(row);
      }
      result.push(nodes);
    }

    return result.map(r => r[r.length - 1].value);
  }

  static toRightSkewTreeInPlace(root) {
    if (!root) {
      return null;
    }

    let node = root;

    while (node) {
      if (node.left) {
        if (node.right) {
          let rightmost = node.left;
          while (rightmost.right) {
            rightmost = rightmost.right;
          }
          rightmost.right = node.right;
        }

        node.right = node.left;
        node.left = null;
      }
      node = node.right;
    }

    return root;
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

function _findPath(node, t, path) {
  path.push(node);
  if (node.value === t.value) {
    return path;
  }
  const left = node.left ? _findPath(node.left, t, [...path]) : null;
  const right = node.right ? _findPath(node.right, t, [...path]) : null;

  return left || right;
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

function _serializeDepthFirst(visited, node, order, bCompact) {
  if (order === BinaryTree.DEPTH_FIRST_ORDER.PRE_ORDER) {
    if (node) {
      visited.push(node.value);
    } else {
      if (!bCompact) {
        visited.push(null);
      }
    }
  }
  if (node) {
    _serializeDepthFirst(visited, node.left, order, bCompact);
  }
  if (order === BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER) {
    if (node) {
      visited.push(node.value);
    } else {
      if (!bCompact) {
        visited.push(null);
      }
    }
  }
  if (node) {
    _serializeDepthFirst(visited, node.right, order, bCompact);
  }
  if (order === BinaryTree.DEPTH_FIRST_ORDER.POST_ORDER) {
    if (node) {
      visited.push(node.value);
    } else {
      if (!bCompact) {
        visited.push(null);
      }
    }
  }
}
