/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 30-Jan-19.
 */
angular.module("b")
  .factory("Country", function ($resource) {
    return $resource('app/data/countries.json');
  });
