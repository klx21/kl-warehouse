/**
 * @author Huan LI
 */

var KAsync = com.huanli.async.KAsync;

function test() {
    'use strict';

  var af = KAsync.asynchronize(function(cb) {
    var a = 5, b = 8;
    window.setTimeout(function() {
      cb.done(a + b + cb.arrAsyncArgs[0]);
      // cb.fail('some reason');
    }, 1000);
  }), af1 = KAsync.asynchronize(function(cb) {
    window.setTimeout(function() {
      cb.done(cb.arrAsyncArgs[0] * cb.arrAsyncArgs[1]);
      // cb.fail('no reason');
    }, 2000);
  }), af2 = KAsync.asynchronize(function(cb) {
    window.setTimeout(function() {
      cb.done(cb.arrAsyncArgs[0] + cb.arrAsyncArgs[1]);
    }, 500);
  });
  (af(80).or(af1(4, 9))).or(af2(1, 1000)).then(function(anyArg) {
    console.log('the argument of the function wrapped in then is ');
    console.log(anyArg);
    return Math.sqrt(anyArg);
  }, function(error) {
    console.error('from then');
    console.error(error);
    return error;
  }).when(function(anyArg) {
    console.log('the argument of the function wrapped in when is ');
    console.log(anyArg);
  }, function(error) {
    console.error('from when');
    console.error(error);
  }); 

}
