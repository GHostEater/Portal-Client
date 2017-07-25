angular.module('b')
    .factory('StudentAffairs', function ($resource,Host) {
        return $resource(Host.host+'/student-affairs/:id/',{id:'@id'});
    });
