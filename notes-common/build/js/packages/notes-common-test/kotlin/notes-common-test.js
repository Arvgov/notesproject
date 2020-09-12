(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', 'kotlin', 'notes-common', 'kotlin-test'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('kotlin'), require('notes-common'), require('kotlin-test'));
  else {
    if (typeof kotlin === 'undefined') {
      throw new Error("Error loading module 'notes-common-test'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'notes-common-test'.");
    }if (typeof this['notes-common'] === 'undefined') {
      throw new Error("Error loading module 'notes-common-test'. Its dependency 'notes-common' was not found. Please, check whether 'notes-common' is loaded prior to 'notes-common-test'.");
    }if (typeof this['kotlin-test'] === 'undefined') {
      throw new Error("Error loading module 'notes-common-test'. Its dependency 'kotlin-test' was not found. Please, check whether 'kotlin-test' is loaded prior to 'notes-common-test'.");
    }root['notes-common-test'] = factory(typeof this['notes-common-test'] === 'undefined' ? {} : this['notes-common-test'], kotlin, this['notes-common'], this['kotlin-test']);
  }
}(this, function (_, Kotlin, $module$notes_common, $module$kotlin_test) {
  'use strict';
  var hello = $module$notes_common.sample.hello;
  var Sample = $module$notes_common.sample.Sample;
  var assertTrue = $module$kotlin_test.kotlin.test.assertTrue_ifx8ge$;
  var Kind_CLASS = Kotlin.Kind.CLASS;
  var test = $module$kotlin_test.kotlin.test.test;
  var suite = $module$kotlin_test.kotlin.test.suite;
  var contains = Kotlin.kotlin.text.contains_li3zpu$;
  function SampleTests() {
  }
  SampleTests.prototype.testMe = function () {
    hello();
    assertTrue((new Sample()).checkMe() > 0);
  };
  SampleTests.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'SampleTests',
    interfaces: []
  };
  function SampleTestsJS() {
  }
  SampleTestsJS.prototype.testHello = function () {
    assertTrue(contains(hello(), 'JS'));
  };
  SampleTestsJS.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'SampleTestsJS',
    interfaces: []
  };
  var package$sample = _.sample || (_.sample = {});
  package$sample.SampleTests = SampleTests;
  package$sample.SampleTestsJS = SampleTestsJS;
  suite('sample', false, function () {
    suite('SampleTests', false, function () {
      test('testMe', false, function () {
        return (new SampleTests()).testMe();
      });
    });
    suite('SampleTestsJS', false, function () {
      test('testHello', false, function () {
        return (new SampleTestsJS()).testHello();
      });
    });
  });
  Kotlin.defineModule('notes-common-test', _);
  return _;
}));

//# sourceMappingURL=notes-common-test.js.map
