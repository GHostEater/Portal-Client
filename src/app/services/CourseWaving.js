angular.module('b')
  .factory('CourseWaving',function ($resource,Host) {
    return $resource(Host.host+'/course-waving/:id/',{id:'@id'},{
      student:{
        method: 'get',
        isArray: true,
        url: Host.host+'/course-waving/student/'
      },
      save:{
        method: 'post',
        url: Host.host+'/course-waving/new/'
      }
    });
  });
