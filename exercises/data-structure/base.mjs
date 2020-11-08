export class BinaryTreeNode {
  constructor(value) {
    this.value = value;
    this.left = this.right = null;
  }
}

export class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class DoublyLinkedListNode extends LinkedListNode {
  constructor(value) {
    super(value);
    this.prev = this.next;
  }
}
