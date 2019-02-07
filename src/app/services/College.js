angular.module('b')
  .factory('College', function ($resource, Host) {
    return $resource(Host.host+'/college/:id/',{id:'@id'});
  });
