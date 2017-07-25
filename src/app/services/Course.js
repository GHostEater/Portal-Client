angular.module('b')
    .factory('Course', function ($resource,Host) {
        return $resource(Host.host+'/course/:id/',{id:'@id'});
    });
