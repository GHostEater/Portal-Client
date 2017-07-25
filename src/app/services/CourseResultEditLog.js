angular.module('b')
  .factory('CourseResultEditLog',function ($resource,Host) {
    return $resource(Host.host+'/result-edit-log/:id/',{id:'@id'},{
      save:{
        url: Host.host+'/result-edit-log/new/',
        method:"post"
      }
    });
  });
