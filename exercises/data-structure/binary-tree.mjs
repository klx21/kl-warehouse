import { BinaryTreeNode, LinkedListNode } from './base.mjs';

export const DepthFirstOrder = {
  PRE_ORDER: 0,
  IN_ORDER: 1,
  POST_ORDER: 2
};

/**
 * Deserialize the array into a binary tree in a breadth first manner.
 *
 * @param {Array<BinaryTreeNode|number|null|undefined>} array An array of a mix of tree nodes, numbers, nulls and undefineds.
 * @returns {BinaryTreeNode} The root node of the binary tree.
 */
export function deserializeBreadthFirst(array) {
  if (array && array.length > 0 && array[0] !== null) {
    const firstItem = array.shift();
    const rootNode =
      firstItem instanceof BinaryTreeNode
        ? firstItem
        : new BinaryTreeNode(firstItem);
    const queue = [rootNode];

    while (array.length > 0) {
      const left = array.shift();
      const right = array.shift();
      const leftNode =
        typeof left !== 'undefined' && left !== null
          ? left instanceof BinaryTreeNode
            ? left
            : new BinaryTreeNode(left)
          : null;
      const rightNode =
        typeof right !== 'undefined' && right !== null
          ? right instanceof BinaryTreeNode
            ? right
            : new BinaryTreeNode(right)
          : null;
      const parent = queue.shift();

      parent.left = leftNode;
      parent.right = rightNode;
      if (left !== null) {
        queue.push(leftNode);
      }
      if (right !== null) {
        queue.push(rightNode);
      }
    }

    return rootNode;
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
export function findLowestCommonAncestor(root, p, q) {
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

export function getDepth(root, value) {
  if (!root) {
    return 0;
  }

  const depth = _getDepth(value, root);

  return typeof depth === 'number' ? depth : -1;
}

export function getHeight(root, value) {
  if (!root) {
    return 0;
  }

  const node = findNode(value, root);

  return node ? _getHeight(node) : -1;
}

export function getVerticalOrder(root) {
  if (!root) {
    return [];
  }

  const columnsMap = new Map();
  const nodes = []; // queue
  const columnNums = []; // queue
  const cRoot = 0;
  let minColumn = 0;

  columnsMap.set(cRoot, [root.value]);

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
    columnsMap.get(column).push(node.value);
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

export function serializeBreadthFirst(root, bCompact = false) {
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

export function serializeDepthFirst(
  root,
  order = DepthFirstOrder.IN_ORDER,
  bCompact = false
) {
  if (!root) {
    return [];
  }

  const result = [];

  _serializeDepthFirst(result, root, order, bCompact);

  // remove trailing nulls
  while (result.length > 0) {
    if (result[result.length - 1] === null) {
      result.pop();
    } else {
      break;
    }
  }

  return result;
}

export function toLinkedList(root) {
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

export function toRightSideView(root) {
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

  return result.map((r) => r[r.length - 1].value);
}

export function toRightSkewTreeInPlace(root) {
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

function findNode(value, node) {
  if (node) {
    if (value === node.value) {
      return node;
    }
    return findNode(value, node.left) || findNode(value, node.right);
  }
}

function findPath(node, t, path) {
  path.push(node);

  if (node.value === t.value) {
    return path;
  }

  const left = node.left ? findPath(node.left, t, [...path]) : null;
  const right = node.right ? findPath(node.right, t, [...path]) : null;

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
  if (order === DepthFirstOrder.PRE_ORDER) {
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

  if (order === DepthFirstOrder.IN_ORDER) {
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

  if (order === DepthFirstOrder.POST_ORDER) {
    if (node) {
      visited.push(node.value);
    } else {
      if (!bCompact) {
        visited.push(null);
      }
    }
  }
}
