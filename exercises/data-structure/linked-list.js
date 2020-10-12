export class Node {
  constructor(value, left, right) {
    this.value = value;
    this.left = left || null;
    this.right = right || null;
  }
}

export class LinkedList {
  constructor(value) {
    if (typeof value === 'undefined') {
      throw 'At least one value should be provided in order to construct a linked list.';
    }
    this.current = new Node(value);
  }

  append(value) {
    const last = this.findLast();
    const newNode = new Node(value, last);
    last.right = newNode;
    this.current = newNode;
    return this;
  }

  findByValue(value) {
    return this.nodes.find(nodeValue => nodeValue === value);
  }

  findFirst() {
    let current = this.current;

    while (current.left) {
      current = current.left;
    }

    return current;
  }

  findLast() {
    let current = this.current;

    while (current.right) {
      current = current.right;
    }

    return current;
  }

  insert(value, target, bAfter) {
    return bAfter ?
      this.insertAfter(value, target) :
      this.insertBefore(value, target);
  }

  moveToFirst() {
    this.current = this.findFirst();
    return this;
  }

  moveToLast() {
    this.current = this.findLast();
    return this;
  }

  prepend(value) {
    const first = this.findFirst();
    const newNode = new Node(value, null, first);
    first.left = newNode;
    this.current = newNode;
    return this;
  }

  serialize() {
    const serialization = [];
    let current = this.findFirst();

    while (current.right) {
      serialization.push(current.value);
      current = current.right;
    }

    return serialization;
  }

  size() {
    let current = this.findFirst();
    let counter = 1;

    while (current.right) {
      counter++;
      current = current.right;
    }

    return counter;
  }

  /**
   * @private
   * @param value
   * @param target
   * @returns {LinkedList}
   */
  insertAfter(value, target) {
    const targetNode = this.findByValue(target);
    if (targetNode) {
      const newNode = new Node(value);
      if (!targetNode.right) {
        targetNode.right = newNode;
        newNode.left = targetNode;
      } else {
        const nextNode = targetNode.right;
        targetNode.right = newNode;
        newNode.left = targetNode;
        newNode.right = nextNode;
        nextNode.left = newNode;
      }
    }
    return this;
  }

  /**
   * @private
   * @param value
   * @param target
   * @returns {LinkedList}
   */
  insertBefore(value, target) {
    const targetNode = this.findByValue(target);
    if (targetNode) {
      const newNode = new Node(value);
      if (!targetNode.left) {
        targetNode.left = newNode;
        newNode.right = targetNode;
      } else {
        const previousNode = target.left;
        targetNode.left = newNode;
        newNode.right = targetNode;
        newNode.left = previousNode;
        previousNode.right = newNode;
      }
    }
    return this;
  }
}
