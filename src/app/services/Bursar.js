/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 07-Feb-19.
 */
angular.module("b")
  .factory('Bursar', function ($resource,Host) {
    return $resource(Host.host+'/bursar/:user/',{user:'@user'});
  });
