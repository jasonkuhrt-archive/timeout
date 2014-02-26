/* globals describe, it */
'use strict';
var timeout = require('../');
var assert = require('assert');

function Counter(from){
  function count(){
    count.now = count.now + 1;
  }
  count.from = from;
  count.now = from;
  return count;
}

function assertNoCount(counter, done){
  return function check(){
    assert.equal(counter.now, 0, 'counter never incremented');
    done();
  };
}



describe('Timeout', function(){

  it('will invoke function after elapsed ms', function(done){
    timeout(done, 10);
  });


  describe('stop', function(){
    it('stops the timer', function(done){
      var count = Counter(0);
      var countSoon = timeout(count, 10);
      timeout(timeout.stop.bind(null, countSoon), 5);
      timeout(assertNoCount(count, done), 20);
    });
  });


  describe('start', function(){
    it('starts a stopped timer which retains initial configuration', function(done){
      var countSoon = timeout(done, 10);
      timeout.stop(countSoon);
      timeout(timeout.start.bind(null, countSoon), 5);
    });
  });


  describe('restart', function(){
    it('makes the timer abort current state, restarting counting down from initially configured ms', function(done){
      var count = Counter(0);
      var countSoon = timeout(count, 5);
      // Prevent countdown from finishing by restarting it every ms.
      var restarter = setInterval(timeout.restart, 1, countSoon);
      // Tidy up and assert state shortly after.
      timeout(timeout.stop.bind(null, countSoon), 20);
      timeout(clearInterval.bind(null, restarter), 20);
      timeout(assertNoCount(count, done), 25);
    });
  });


  describe('isOn / isOff', function(){
    it('each inversely returns a boolean indicating if the timer is on or off', function(done){
      function finish(){
        assert(!timeout.isOn(timer));
        assert(timeout.isOff(timer));
        done();
      }
      var timer = timeout(finish, 10);
      assert(timeout.isOn(timer));
      assert(!timeout.isOff(timer));
    });
  });

});

