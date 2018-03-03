/**
 * Created by GHostEater on 07-Feb-18.
 */
angular.module('b')
  .factory('User',function ($resource,Host) {
    return $resource(Host.host+"/user/:id/",{id:'@id'},{
      patch:{
        method: 'patch'
      }
    });
  });
