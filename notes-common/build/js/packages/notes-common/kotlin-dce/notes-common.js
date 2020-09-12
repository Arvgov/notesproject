(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', 'kotlin'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('kotlin'));
  else {
    if (typeof kotlin === 'undefined') {
      throw new Error("Error loading module 'notes-common'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'notes-common'.");
    }root['notes-common'] = factory(typeof this['notes-common'] === 'undefined' ? {} : this['notes-common'], kotlin);
  }
}(this, function (_, Kotlin) {
  'use strict';
  var Kind_CLASS = Kotlin.Kind.CLASS;
  var Kind_OBJECT = Kotlin.Kind.OBJECT;
  var Platform_instance = null;
}));

//# sourceMappingURL=notes-common.js.map
