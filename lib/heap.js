module.exports = heap;

function data(key) {
  return {
    next: null,     // next sibling
    prev: null,     // previous sibling
    parent: null,
    subheap: null,    // child heap
    key: key        // item 'weight'
  };
}

function unlink(item) {
  if (item._.parent && item._.parent._.subh === item) {
    item._.parent._.subh = item._.next;
  }
  item._.parent = null;
  if (item._.prev) {
    item._.prev._.next = item._.next;
  }
  if (item._.next) {
    item._.next._.prev = item._.prev;
  }
  item._.next = null;
  item._.prev = null;
  return item;
}

function append(heap, item) {
  var subh = heap._.subh;
  item._.parent = heap;
  item._.prev = null;
  item._.next = subh;
  heap._.subh = item;
  if (subh) {
    subh._.prev = item;
  }

  return heap;
}

function merge(one, two) {
  if (!one) {
    return two;
  }
  if (!two) {
    return one;
  }

  return one._.key < two._.key ?
    append(one, two) : append(two, one);
}

function mergePairs(head) {
  if (!head) {
    return;
  }
  var next = head._.next;
  if (!next) {
    return head;
  }
  head._.next = null;
  var tail = next._.next;
  return merge(merge(head, next), mergePairs(tail));
}


function heap() {
  var memo = {
    size: 0,
    top: null
  };
  var self = {
    push: push,
    pop: pop,
    peek: peek,
    size: size,
    remove: remove
  };

  function push(item) {
    memo.top = merge(memo.top, item);
    memo.size += 1;
    return self;
  }

  function pop() {
    var r = memo.top;
    if (r) {
      memo.size -= 1;
      memo.top = mergePairs(memo.top._.subh);
      r._.next = null;
      r._.prev = null;
      r._.subh = null;
    }
    return r;
  }

  function peek() {
    return memo.top;
  }

  function size() {
    return memo.size;
  }

  function remove(item) {
    if (item === memo.top) {
      pop();
    } else {
      memo.size -= 1;
      item = unlink(item);
      merge.top = merge(memo.top, mergePairs(item._.subh));
    }
    return self;
  }

  return self;
}

heap._ = data;
