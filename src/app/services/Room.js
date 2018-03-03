/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .factory('Room',function ($resource,Host) {
    return $resource(Host.host+'/room/:id/',{id:'@id'},{
      save:{
        method: 'post',
        url: Host.host+'/room/new/'
      },
      patch:{
        method: 'patch'
      }
    });
  });
