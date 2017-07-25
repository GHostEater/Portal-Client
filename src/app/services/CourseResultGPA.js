angular.module('b')
  .factory('CourseResultGPA',function ($resource,Host) {
    return $resource(Host.host+'/gpa/:id/',{id:'@id'},{
      student:{
        method: 'get',
        isArray: true,
        url: Host.host+'/gpa/student/'
      },
      dept:{
        method: 'get',
        isArray: true,
        url: Host.host+'/gpa/dept/'
      },
      save:{
        method: 'post',
        url: Host.host+'/gpa/new/'
      },
      patch:{
        method: 'patch'
      }
    });
  });
