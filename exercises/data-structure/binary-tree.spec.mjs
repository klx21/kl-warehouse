import { BinaryTree } from './binary-tree.mjs';

describe('Binary tree', () => {
  describe('deserialization and serialization', () => {
    let root;

    /**
     * Initialize the tree to be like this.
     *            1
     *           / \
     *          2   3
     *         / \
     *        4   5
     *           / \
     *          6   7
     */
    beforeAll(() => {
      const array = [1, 2, 3, 4, 5, null, null, null, null, 6, 7];
      root = BinaryTree.deserializeBreadthFirst(array);
    });

    it('root node is not null', () => {
      expect(root).not.toBeNull();
    });

    it('should deserialize and serialize successfully in breadth first manner', () => {
      const array = [1, 2, 3, 4, 5, null, null, null, null, 6, 7];
      let root = new BinaryTree(BinaryTree.deserializeBreadthFirst(array));
      let result = BinaryTree.serializeBreadthFirst(root);
      expect(result).toEqual([1, 2, 3, 4, 5, null, null, null, null, 6, 7]);
    });

    it('should pre-order-serialize to [1, 2, 4, null, null, 5, 6, null, null, 7, null, null, 3]', () => {
      let result = BinaryTree.serializeDepthFirst(root, BinaryTree.DEPTH_FIRST_ORDER.PRE_ORDER);
      expect(result).toEqual([1, 2, 4, null, null, 5, 6, null, null, 7, null, null, 3]);
    });

    it('should in-order-serialize to [null, 4, null, 2, null, 6, null, 5, null, 7, null, 1, null, 3]', () => {
      let result = BinaryTree.serializeDepthFirst(root, BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER);
      expect(result).toEqual([null, 4, null, 2, null, 6, null, 5, null, 7, null, 1, null, 3]);
    });

    it('should post-order-serialize to [null, null, 4, null, null, 6, null, null, 7, 5, 2, null, null, 3, 1]', () => {
      let result = BinaryTree.serializeDepthFirst(root, BinaryTree.DEPTH_FIRST_ORDER.POST_ORDER);
      expect(result).toEqual([null, null, 4, null, null, 6, null, null, 7, 5, 2, null, null, 3, 1]);
    });
  });

  describe('node depth', () => {
    let root;

    /**
     * Initialize the tree to be like this.
     *            1
     *           / \
     *          2   3
     *         / \
     *        4   5
     *           / \
     *          6   7
     */
    beforeAll(() => {
      const array = [1, 2, 3, 4, 5, null, null, null, null, 6, 7];
      root = BinaryTree.deserializeBreadthFirst(array);
    });

    it('1 should have a depth 0', () => {
      expect(BinaryTree.getDepth(root, 1)).toEqual(0);
    })

    it('2 should have a depth 1', () => {
      expect(BinaryTree.getDepth(root, 2)).toEqual(1);
    })

    it('3 should have a depth 1', () => {
      expect(BinaryTree.getDepth(root, 3)).toEqual(1);
    })

    it('4 should have a depth 2', () => {
      expect(BinaryTree.getDepth(root, 4)).toEqual(2);
    })

    it('5 should have a depth 2', () => {
      expect(BinaryTree.getDepth(root, 5)).toEqual(2);
    })

    it('6 should have a depth 3', () => {
      expect(BinaryTree.getDepth(root, 6)).toEqual(3);
    })

    it('7 should have a depth 3', () => {
      expect(BinaryTree.getDepth(root, 7)).toEqual(3);
    })

    it('9 should have a depth -1', () => {
      expect(BinaryTree.getDepth(root, 9)).toEqual(-1);
    })
  });

  describe('node height', () => {
    let root;

    /**
     * Initialize the tree to be like this.
     *            1
     *           / \
     *          2   3
     *         / \
     *        4   5
     *           / \
     *          6   7
     */
    beforeAll(() => {
      const array = [1, 2, 3, 4, 5, null, null, null, null, 6, 7];
      root = BinaryTree.deserializeBreadthFirst(array);
    });

    it('1 should have a height 3', () => {
      expect(BinaryTree.getHeight(root, 1)).toEqual(3);
    })

    it('2 should have a height 2', () => {
      expect(BinaryTree.getHeight(root, 2)).toEqual(2);
    })

    it('3 should have a height 0', () => {
      expect(BinaryTree.getHeight(root, 3)).toEqual(0);
    })

    it('4 should have a height 0', () => {
      expect(BinaryTree.getHeight(root, 4)).toEqual(0);
    })

    it('5 should have a height 1', () => {
      expect(BinaryTree.getHeight(root, 5)).toEqual(1);
    })

    it('6 should have a height 0', () => {
      expect(BinaryTree.getHeight(root, 6)).toEqual(0);
    })

    it('7 should have a height 0', () => {
      expect(BinaryTree.getHeight(root, 7)).toEqual(0);
    })

    it('9 should have a height -1', () => {
      expect(BinaryTree.getHeight(root, 9)).toEqual(-1);
    })
  });
});
