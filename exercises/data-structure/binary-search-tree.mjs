import { BinaryTreeNode } from './base.mjs';

export class BinarySearchTree {

  static getDiameter(root) {
    if (!root) {
      return 0;
    }

    let max = Number.NEGATIVE_INFINITY;
    _findLongest(root);
    return max;

    function _findLongest(node) {
      let left = 0;
      let right = 0;
      let both = 0;

      if (node.left) {
        left = _findLongest(node.left) + 1;
        both = both + left;
      }
      if (node.right) {
        right = _findLongest(node.right) + 1;
        both = both + right;
      }

      max = Math.max(max, left, right, both);
      return Math.max(left, right, 0);
    }
  }

  static insert(root, value) {
    return _insert(root, value);
  }

  static isValid(root) {
    if (!root) {
      return false;
    }
    if (!root.left && !root.right) {
      return true;
    }

    const stack = [];
    let node = root;
    let inOrder = Number.NEGATIVE_INFINITY;

    while (node || stack.length > 0) {
      while (node) {
        stack.push(node);
        node = node.left;
      }

      node = stack.pop();

      if (node.value <= inOrder) {
        return false;
      }

      inOrder = node.value;
      node = node.right;
    }

    return true;
  }

  static remove(root, value) {
    return _remove(root, value);
  }

  static search(root, value) {
    return _search(root, value);
  }
}

function _insert(node, value) {
  if (!node) {
    return new BinaryTreeNode(value);
  }
  if (value < node.value) {
    node.left = _insert(node.left, value);
  } else if (value > node.value) {
    node.right = _insert(node.right, value);
  }
  return node;
}

function _remove(node, value) {
  if (node) {
    if (value < node.value) {
      node.left = _remove(node.left, value);
    } else if (value > node.value) {
      node.right = _remove(node.right, value);
    } else {
      if (!node.left) {
        return node.right;
      }
      if (!node.right) {
        return node.left;
      }

      node.value = _findMinValue(node.right);
      node.right = _remove(node.right, node.value);
    }
    return node;
  }
}

function _findMinValue(node) {
  let minValue = node.value;
  while (node.left) {
    node = node.left;
    minValue = node.value;
  }
  return minValue;
}

function _search(node, value) {
  if (!node) {
    return null;
  } else if (value < node.value) {
    return _search(node.left, value);
  } else if (value > node.value) {
    return _search(node.right, value);
  } else {
    return node;
  }
}
