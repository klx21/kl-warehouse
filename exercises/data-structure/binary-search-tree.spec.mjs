import { BinaryTreeNode } from './base';
import { BinarySearchTree } from './binary-search-tree';

describe('Binary search tree', () => {
  describe('insertion', () => {
    let root;

    /**
     *          4
     *         / \
     *        1   5
     *         \   \
     *          2   6
     *           \   \
     *            3   7
     */
    beforeAll(() => {
      root = new BinaryTreeNode(4);
      BinarySearchTree.insert(root, 1);
      BinarySearchTree.insert(root, 2);
      BinarySearchTree.insert(root, 3);
      BinarySearchTree.insert(root, 5);
      BinarySearchTree.insert(root, 6);
      BinarySearchTree.insert(root, 7);
    });

    it('should create a valid binary search tree', () => {
      expect(BinarySearchTree.isValid(root)).toBeTrue();
    });
  });
});
