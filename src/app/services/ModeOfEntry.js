angular.module('b')
    .factory('ModeOfEntry', function ($resource,Host) {
        return $resource(Host.host+'/mode-of-entry/:id/',{id:'@id'})
    });
