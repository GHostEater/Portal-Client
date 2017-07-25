angular.module('b')
  .factory('CourseToMajor', function ($resource,Host) {
    return $resource(Host.host+'/course-to-major/:id/',{id:'@id'},{
      add:{
        url: Host.host+'/course-to-major/new/',
        method: 'post'
      }
    });
  });
