angular.module('b')
    .factory('Major', function ($resource,Host) {
        return $resource(Host.host+'/major/:id/',{id:'@id'});
    });
