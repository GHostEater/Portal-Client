angular.module('b')
    .factory('Dept', function ($resource,Host) {
        return $resource(Host.host+'/dept/:id/',{id:'@id'});
    });
