angular.module('b')
  .factory('CourseResultEditRequest',function ($resource, Host) {
    return $resource(Host.host+'/result-edit-request/:id/',{id:'@id'},{
      save:{
        method: 'post',
        url: Host.host+'/result-edit-request/new/'
      },
      patch:{
        method: 'patch'
      }
    });
  });
