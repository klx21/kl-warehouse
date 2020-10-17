import { DEPTH_FIRST_ORDER, BinarySearchTree, TREE_DIRECTION } from './binary-search-tree.mjs';
import { strict as assert } from 'assert';

const tree = new BinarySearchTree();
// const numbers = [20, 14, 9, 19, 57, 31, 3, 62, 11, 72];
const elements = [1,2,2,'#',3,'#',3];
const elements1 = [1,2,2,3,4,4,3];
const elements2 = [1,2,3];
// numbers.forEach(number => tree.insertInOrder(number));


try {
  // assert.deepStrictEqual(tree.serializeToArray(TREE_DIRECTION.BREADTH), [20, 14, 57, 9, 19, 31, 62, 3, 11, 72]);
  // console.info('Success: Breadth first serialization succeeded.');
  // assert.deepStrictEqual(tree.serializeToArray(TREE_DIRECTION.DEPTH, DEPTH_FIRST_ORDER.PRE_ORDER), [20, 14, 9, 3, 11, 19, 57, 31, 62, 72]);
  // console.info('Success: Pre-order depth first serialization succeeded.');
  // assert.deepStrictEqual(tree.serializeToArray(TREE_DIRECTION.DEPTH, DEPTH_FIRST_ORDER.POST_ORDER), [3, 11, 9, 19, 14, 31, 72, 62, 57, 20]);
  // console.info('Success: Post-order depth first serialization succeeded.');
  // assert.deepStrictEqual(tree.serializeToArray(TREE_DIRECTION.DEPTH, DEPTH_FIRST_ORDER.IN_ORDER), [3, 9, 11, 14, 19, 20, 31, 57, 62, 72]);
  // console.info('Success: In-order depth first serialization succeeded.');
  // assert.equal(tree.searchBreadthFirst(5), null);
  // console.info('Success: 5 is not found with a breadth first search.');
  // assert.ok(tree.searchDepthFirst(31), '31 is not found with an in-order depth first search.');
  // console.info('Success: 31 is found with an in-order depth first search.');
  // assert.equal(tree.searchDepthFirst(46), null);
  // console.info('Success: 46 is not found with an in-order depth first search.');
  tree.deserializeBreadthFirst(elements2);
  console.log(tree.serializeWithHashes());
  console.log(tree.isSymmetric());
} catch(e) {
  console.error('Failure: ', e.message);
} finally {
  console.log('Info: Test finished.');
}
