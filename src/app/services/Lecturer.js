angular.module('b')
    .factory('Lecturer', function ($resource,Host) {
        return $resource(Host.host+'/lecturer/:user/',{user:'@user'});
    });
