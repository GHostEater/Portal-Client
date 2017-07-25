angular.module('b')
    .factory('Level', function ($resource,Host) {
        return $resource(Host.host+'/level/:id/', {id:'@id'});
    });
