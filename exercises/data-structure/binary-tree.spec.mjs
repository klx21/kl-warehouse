import { BinaryTree } from './binary-tree.mjs';

describe('Binary tree', () => {
  describe('empty', () => {
    let tree;

    beforeEach(() => {
      tree = new BinaryTree();
    });

    it('should have a null root node', () => {
      expect(tree.root).toBeNull();
    })
  });

  describe('deserialization and serialization', () => {
    let tree;

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
      tree = new BinaryTree(BinaryTree.deserializeBreadthFirst(array));
    });

    it('root node is not null', () => {
      expect(tree.root).not.toBeNull();
    });

    it('should deserialize and serialize successfully in breadth first manner', () => {
      const array = [1, 2, 3, 4, 5, null, null, null, null, 6, 7];
      let tree = new BinaryTree(BinaryTree.deserializeBreadthFirst(array));
      let result = tree.serializeBreadthFirst();
      expect(result).toEqual([1, 2, 3, 4, 5, null, null, null, null, 6, 7]);
    });

    it('should pre-order-serialize to [1, 2, 4, null, null, 5, 6, null, null, 7, null, null, 3]', () => {
      let result = tree.serializeDepthFirst(BinaryTree.DEPTH_FIRST_ORDER.PRE_ORDER);
      expect(result).toEqual([1, 2, 4, null, null, 5, 6, null, null, 7, null, null, 3]);
    });

    it('should in-order-serialize to [null, 4, null, 2, null, 6, null, 5, null, 7, null, 1, null, 3]', () => {
      let result = tree.serializeDepthFirst(BinaryTree.DEPTH_FIRST_ORDER.IN_ORDER);
      expect(result).toEqual([null, 4, null, 2, null, 6, null, 5, null, 7, null, 1, null, 3]);
    });

    it('should post-order-serialize to [null, null, 4, null, null, 6, null, null, 7, 5, 2, null, null, 3, 1]', () => {
      let result = tree.serializeDepthFirst(BinaryTree.DEPTH_FIRST_ORDER.POST_ORDER);
      expect(result).toEqual([null, null, 4, null, null, 6, null, null, 7, 5, 2, null, null, 3, 1]);
    });
  });

  describe('node depth', () => {
    let tree;

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
      tree = new BinaryTree(BinaryTree.deserializeBreadthFirst(array));
    });

    it('1 should have a depth 0', () => {
      expect(tree.getDepth(1)).toEqual(0);
    })

    it('2 should have a depth 1', () => {
      expect(tree.getDepth(2)).toEqual(1);
    })

    it('3 should have a depth 1', () => {
      expect(tree.getDepth(3)).toEqual(1);
    })

    it('4 should have a depth 2', () => {
      expect(tree.getDepth(4)).toEqual(2);
    })

    it('5 should have a depth 2', () => {
      expect(tree.getDepth(5)).toEqual(2);
    })

    it('6 should have a depth 3', () => {
      expect(tree.getDepth(6)).toEqual(3);
    })

    it('7 should have a depth 3', () => {
      expect(tree.getDepth(7)).toEqual(3);
    })

    it('9 should have a depth -1', () => {
      expect(tree.getDepth(9)).toEqual(-1);
    })
  });

  describe('node height', () => {
    let tree;

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
      tree = new BinaryTree(BinaryTree.deserializeBreadthFirst(array));
    });

    it('1 should have a height 3', () => {
      expect(tree.getHeight(1)).toEqual(3);
    })

    it('2 should have a height 2', () => {
      expect(tree.getHeight(2)).toEqual(2);
    })

    it('3 should have a height 0', () => {
      expect(tree.getHeight(3)).toEqual(0);
    })

    it('4 should have a height 0', () => {
      expect(tree.getHeight(4)).toEqual(0);
    })

    it('5 should have a height 1', () => {
      expect(tree.getHeight(5)).toEqual(1);
    })

    it('6 should have a height 0', () => {
      expect(tree.getHeight(6)).toEqual(0);
    })

    it('7 should have a height 0', () => {
      expect(tree.getHeight(7)).toEqual(0);
    })

    it('9 should have a height -1', () => {
      expect(tree.getHeight(9)).toEqual(-1);
    })
  });
});
