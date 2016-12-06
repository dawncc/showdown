/**
 * Showdown's Extension boilerplate
 *
 * A boilerplate from where you can easily build extensions
 * for showdown
 */
(function (extension) {
  'use strict';

  // UML - Universal Module Loader
  // This enables the extension to be loaded in different environments
  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function (showdown) {
  'use strict';

  //This is the extension code per se

  // Here you have a safe sandboxed environment where you can use "static code"
  // that is, code and data that is used accros instances of the extension itself
  // If you have regexes or some piece of calculation that is immutable
  // this is the best place to put them.

  /**
   * 匹配命令字符串,当前行以@@开头的连续字符都为sql命令
   * @type {RegExp}
   */
  var commandRegExp = /^@@([\S]+)/g,
  /**
   * 匹配表名和工号：[sys_sysparams][c0026510411]
   * @type {[RegExp]}
   */
   // referenceRegExp =  /\[([^\]]*?)] ?(?:\n *)?\[(.*?)]/i,
   referenceRegExp =  /\[([^\]]*?)] ?/g,
  /**
   * 匹配带插入的值: 如(id,CODE)
   * @type {RegExp}
   */
  inLineValuesRegExp = /\((.*)\)/g,
  sqlTemplet = "--create by %0 \n insert into %1 (id, code) values('%2', '%3');";

  // The following method will register the extension with showdown
  showdown.extension('sql-extends', function() {
    'use strict';

    return {
      type: 'lang', //or output
      filter: function (text, converter, options) {
        // your code here
        // ...
        // text is the text being parsed
        // converter is an instance of the converter
        // ...
        // don't forget to return the altered text. If you don't, nothing will appear in the output
        console.log('sql command :' + text);
       
        // return text.replace(referenceRegExp,  function (match, reference) {
        //   console.log('match:' + match + '\n reference:' + reference);
        //   return sqlTemplet.replace(/%0/g, reference).replace(/%1/g, reference);
        // });
        var ref = referenceRegExp.exec(text);
        console.log("ref:" + ref);
        return  sqlTemplet.replace(/%0/g, ref)
                .replace(/%1/g, inLineValuesRegExp.exec(text));
      },
      regex: commandRegExp,// if filter is present, both regex and replace properties will be ignored
      replace: ''
    };
  });
}));