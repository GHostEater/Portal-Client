/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */

angular.module('b')
  .filter('cgpaRangeFilter', function() {
    return function(items, min, max) {
      var filtered = [];

      angular.forEach(items, function(item) {
        if((item.cgpa >= min) && (item.cgpa <= max)) {
          filtered.push(item);
        }
      });
      return filtered;
    };
});
