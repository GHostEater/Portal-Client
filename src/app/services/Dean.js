angular.module('b')
  .factory('Dean',function ($resource,Host) {
    return $resource(Host.host+'/dean/:user/',{user:'@user'});
  });
