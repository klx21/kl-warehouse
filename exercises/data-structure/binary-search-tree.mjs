import { BinaryTree } from './binary-tree';

export class BinarySearchTree extends BinaryTree {
  insert(value) {
    // if (this.root === null) {
    //   this.root = new BinaryTreeNode(value);
    // } else {
    //   doInsertion(this.root, value);
    // }
    this.root = doInsertion(this.root, value);
    return this;
  }

  remove(value) {
    this.root = doRemoval(this.root, value);
    return this;
  }

  search(value) {
    return doSearch(this.root, value);
  }
}

function doInsertion(node, value) {
  if (node === null) {
    return new BinarySearchTree(value);
  }
  if (value < node.value) {
    node.left = doInsertion(node.left, value);
  } else if (value > node.value) {
    node.right = doInsertion(node.right, value);
  }
  return node;
}

function doRemoval(node, value) {
  if (node !== null) {
    if (value < node.value) {
      node.left = doRemoval(node.left, value);
    } else if (value > node.value) {
      node.right = doRemoval(node.right, value);
    } else {
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      node.value = findMinValue(node.right);
      node.right = doRemoval(node.right, node.value);
    }
    return node;
  }
}

function findMinValue(node) {
  let minValue = node.value;
  while (node.left) {
    node = node.left;
    minValue = node.value;
  }
  return minValue;
}

function doSearch(node, value) {
  if (node === null) {
    return null;
  } else if (value < node.value) {
    return doSearch(node.left, value);
  } else if (value > node.value) {
    return doSearch(node.right, value);
  } else {
    return node;
  }
}
