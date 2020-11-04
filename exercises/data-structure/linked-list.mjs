export class Node {
  constructor(value, prev, next) {
    this.value = value;
    this.prev = prev || null;
    this.next = next || null;
  }
}

export class LinkedList {
  constructor(value) {
    if (typeof value === 'undefined') {
      throw 'At least one value should be provided in order to construct a linked list.';
    }
    if (typeof value === 'object' && value.constructor === Array) {
      this.deserialize(value);
    } else {
      this.current = new Node(value);
    }
  }

  append(value) {
    const last = this.findLast();
    const newNode = new Node(value, last);
    last.next = newNode;
    this.current = newNode;
    return this;
  }

  deserialize(array) {
    this.current = null;
    for (let i = array.length - 1; i >= 0; i--) {
      this.current = new Node(array[i], null, this.current);
    }
    return this;
  }

  findByValue(value) {
    return this.nodes.find(nodeValue => nodeValue === value);
  }

  findFirst() {
    let current = this.current;

    while (current.prev) {
      current = current.prev;
    }

    return current;
  }

  findLast() {
    let current = this.current;

    while (current.next) {
      current = current.next;
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
    first.prev = newNode;
    this.current = newNode;
    return this;
  }

  serialize() {
    const serialization = [];
    let current = this.findFirst();

    while (current) {
      serialization.push(current.value);
      current = current.next;
    }

    return serialization;
  }

  size() {
    let current = this.findFirst();
    let counter = 1;

    while (current.next) {
      counter++;
      current = current.next;
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
      if (!targetNode.next) {
        targetNode.next = newNode;
        newNode.prev = targetNode;
      } else {
        const nextNode = targetNode.next;
        targetNode.next = newNode;
        newNode.prev = targetNode;
        newNode.next = nextNode;
        nextNode.prev = newNode;
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
      if (!targetNode.prev) {
        targetNode.prev = newNode;
        newNode.next = targetNode;
      } else {
        const previousNode = target.prev;
        targetNode.prev = newNode;
        newNode.next = targetNode;
        newNode.prev = previousNode;
        previousNode.next = newNode;
      }
    }
    return this;
  }
}
