/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .factory('RoomAllocation',function ($resource,Host) {
    return $resource(Host.host+'/room-allocation/:id/',{id:'@id'},{
      save:{
        method: 'post',
        url: Host.host+'/room-allocation/new/'
      },
      patch:{
        method: 'patch'
      },
      sessionHostel:{
        url: Host.host+'/room-allocation/session-hostel/',
        method: 'get',
        isArray: true
      },
      student:{
        url: Host.host+'/room-allocation/student/',
        method: 'get',
        isArray: true
      }
    });
  });
