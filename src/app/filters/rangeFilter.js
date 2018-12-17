/**
 * Created by GHostEater on 15-Sep-16.
 */
angular.module('b')
  .filter('rangeFilter', function() {
    return function( items, rangeInfo ) {
      var filtered = [];
      var min = rangeInfo.min;
      var max = rangeInfo.max;

      // If time is with the range
      angular.forEach(items, function(item) {
        if( new Date(item.date) >= min && new Date(item.date) <= max ) {
          filtered.push(item);
        }
      });
      return filtered;
    };
});
