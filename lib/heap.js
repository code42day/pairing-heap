module.exports = heap;

function data(key) {
  return {
    next: null,  // next sibling
    subh: null,  // child heap
    prev: null,  // previous sibling, or parent
    key: key     // item 'weight'
  };
}

function unlink(item) {
  if (!item) {
    return item;
  }
  var prev = item._.prev;
  var next = item._.next;
  if (prev) {
    if (prev._.next === item) {
      // prev was our sibling
      prev._.next = next;
    } else {
      // prev was our father
      prev._.subh = next;
    }
  }
  if (next) {
    next._.prev = prev;
  }

  item._.next = null;
  item._.prev = null;

  return item;
}

function link(heap, item) {
  var subh = heap._.subh;

  item._.prev = heap;
  heap._.subh = item;

  item._.next = subh;
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
    link(one, two) : link(two, one);
}

function mergePairs(head) {
  // divide list into 3 parts
  // head, next, tail

  var p, q, item;

  head._.prev = null;
  var next = head._.next;
  if (!next) {
    return head;
  }

  // left-to-right pair merge
  var fifo = [];
  while(true) {
    p = head;
    q = next;
    head = q._.next;
    if (head) {
      next = head._.next;
    }
    p._.next = null;
    p._.prev = null;
    q._.next = null;
    q._.prev = null;

    item = merge(p, q);
    fifo.push(item);

    if (!head) {
      break;
    }
    if (!next) {
      head._.prev = null;
      fifo.push(head);
      break;
    }
  }

  // console.log('FIFO len', fifo.length);

  if (fifo.length === 1) {
    return fifo[0];
  }

  // right-to-left
  head = fifo[fifo.length - 1];
  for (var i = fifo.length - 2; i >= 0; --i) {
    head = merge(head, fifo[i]);
  }

  return head;
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
    remove: remove,
    update: update,
    // debug
    visit: function(fn, thisArg) {
      visit(memo.top, fn, thisArg);
    }
  };

  function push(item) {
    // item._.prev = item._.next = item._.subh = null;
    memo.top = merge(memo.top, item);
    memo.size += 1;
    return self;
  }

  function pop() {
    var r = memo.top;
    if (r) {
      if (r._.subh) {
        memo.top = mergePairs(r._.subh);
      } else {
        memo.top = null;
      }
      memo.size -= 1;
      r._.prev = r._.next = r._.subh = null;
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
      item = unlink(item);
      if (item._.subh) {
        merge.top = merge(memo.top, mergePairs(item._.subh));
      }
      item._.prev = item._.next = item._.subh = null;
      memo.size -= 1;
    }
    return self;
  }

  function update(item, key) {
    if (key === item._.key) {
      return;
    }
    if (key < item._.key) {
      // key decrese
      item._.key = key;
      if (item !== memo.top) {
        memo.top = merge(memo.top, unlink(item));
      }
      return;
    }
    remove(item);
    item._.key = key;
    push(item);
  }


  function visit(node, fn, thisArg, level, child) {
    if (!node) {
      return;
    }
    level = level || 0;
    child = child || 0;
    fn.call(thisArg, node, level, child);
    // deep first
    visit(node._.subh, fn, thisArg, level + 1, 0);
    visit(node._.next, fn, thisArg, level, child + 1);
  }

  return self;
}

heap._ = data;
