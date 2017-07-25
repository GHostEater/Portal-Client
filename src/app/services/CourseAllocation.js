angular.module('b')
  .factory('CourseAllocation',function ($resource,Host) {
    return $resource(Host.host+'/course-allocation/:id/',{id:'@id'},{
      save:{
        method: 'post',
        url: Host.host+'/course-allocation/new/'
      }
    });
  });
