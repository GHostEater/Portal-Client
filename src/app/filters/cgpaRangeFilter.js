/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */

angular.module('b')
  .filter('cgpaRangeFilter', function() {
    return function(items, obj) {
      var filtered = [];
      var min = obj.min;
      var max = obj.max;

      angular.forEach(items, function(item) {
        if((Number(item.cgpa) >= Number(min)) && (Number(item.cgpa) <= Number(max))) {
          filtered.push(item);
        }
      });
      return filtered;
    };
});
