/**
 * Created by GHostEater on 16-Sep-17.
 */
angular.module('b')
  .filter('newLine', function(lodash) {
    return function(input) {
      var out = input;
      if(lodash.includes(input,"\n")){
        out = input.replace(/\n/g,"<br>");
      }
      return out;
    };
});
