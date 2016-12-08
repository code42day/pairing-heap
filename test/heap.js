var should = require('should');
var heap = require('..');

/* global describe, it */

function _(w) {
  return {
    w: w,
    _: heap._(w)
  };
}

/* exported dump */

function dump(node, prefix) {
  prefix = prefix || '';

  if (prefix.length > 30) {
    return;
  }
  console.log(prefix, node.w);
  if (node._.subh) {
    dump(node._.subh, prefix + '   ');
  }
  if(node._.next) {
    dump(node._.next, prefix);
  }
}

describe('heap', function() {


  describe('size', function() {
    it('should be 0 after init', function() {
      heap().size().should.eql(0);
    });


    it('reflect heap size after push/pop', function() {
      var h = heap();

      h.push(_(1));
      h.size().should.eql(1, 'after push');

      h.push(_(2));
      h.size().should.eql(2, 'after 2 pushes');

      h.pop();
      h.size().should.eql(1, 'after 2 pushes and 1 pop');

      h.pop();
      h.size().should.eql(0, 'after 2 pushes and 2 pops');
    });
  });

  describe('push and pop', function() {
    it('should work with a single item', function() {
      var h = heap(),
        item = _(5);

      h.push(item);
      h.peek().should.be.exactly(item);
      h.pop().should.be.exactly(item);
    });


    it('should maintain order', function() {
      var h = heap();

      h.push(_(5));
      // 5
      h.peek().should.have.property('w', 5);


      h.push(_(6));
      // 5 6
      h.peek().should.have.property('w', 5);

      h.push(_(1));
      // 1 5 6
      h.peek().should.have.property('w', 1);

      h.push(_(0));
      // 0 1 5 6
      h.peek().should.have.property('w', 0);

      h.push(_(18));
      // 0 1 5 6 18
      h.peek().should.have.property('w', 0);

      h.push(_(-3));
      // -3 0 1 5 6 18
      h.peek().should.have.property('w', -3);

      h.push(_(6));
      // -3 0 1 5 6 6 18
      h.peek().should.have.property('w', -3);


      h.pop().should.have.property('w', -3);
      // 0 1 5 6 6 18
      h.peek().should.have.property('w', 0);


      h.pop().should.have.property('w', 0);
      // 1 5 6 6 18
      h.peek().should.have.property('w', 1);

      h.pop().should.have.property('w', 1);
      // 5 6 6 18
      h.peek().should.have.property('w', 5);

      h.pop().should.have.property('w', 5);
      // 6 6 18
      h.peek().should.have.property('w', 6);

      h.pop().should.have.property('w', 6);
      // 6 18
      h.peek().should.have.property('w', 6);

      h.pop().should.have.property('w', 6);
      // 18
      h.peek().should.have.property('w', 18);

      h.pop().should.have.property('w', 18);
    });

    it('should remove head child', function () {
      var h = heap();
      var items = [ -30, 44, 10 ].map(_);
      items.forEach(function(item) {
        h.push(item);
      });
      // -30
      //    10 44

      h.pop().should.have.property('w', -30);
      h.pop().should.have.property('w', 10);
      h.pop().should.have.property('w', 44);

      should.not.exist(h.pop());
    });

    it('should keep items in order', function () {
      var h = heap();
      var items = [];

      for (var i = 0; i < 100; i++) {
        items.push(Math.random());
      }

      items.map(_).forEach(h.push);

      items.sort(function(a, b) {
        return a - b;
      });

      items.forEach(function(item) {
        h.pop().should.have.property('w', item);
      });
    });


  });

  describe('remove', function() {
    it('should do remove items', function () {
      var h = heap();

      var items = [ -11, 5, -30, 44, 10 ].map(_);

      var tops = [ -30, -30, 10, 10 ];

      items.forEach(h.push);

      h.size().should.eql(items.length);
      h.peek().should.have.property('w', -30);

      items.forEach(function(item, i) {

        h.remove(item);

        h.size().should.eql(tops.length - i, 'iteration: ' + i);
        if (h.size()) {
          h.peek().should.have.property('w', tops[i], 'iteration: ' + i);
        }

      });
    });

  });

});
