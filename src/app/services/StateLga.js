/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 30-Jan-19.
 */
angular.module("b")
  .factory("StateLga", function ($resource) {
    return $resource('app/data/state_lgas.json');
  });
