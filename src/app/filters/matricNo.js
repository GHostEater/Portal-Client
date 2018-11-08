/**
 * Created by GHostEater on 24-Jul-17.
 */
angular.module('b')
  .filter('matricNo', function(lodash) {
    return function(input) {
      var out;
      if(lodash.includes(input,"-")){
        out = input.replace(/-/g,"/")
      }
      else if(lodash.includes(input,"/")){
        out = input.replace(/\//g,"-");
      }
      else{
        out = input;
      }
      return out;
    };
});
