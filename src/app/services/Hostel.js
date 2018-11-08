/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .factory('Hostel',function ($resource,Host) {
    return $resource(Host.host+'/hostel/:id/',{id:'@id'});
  });
